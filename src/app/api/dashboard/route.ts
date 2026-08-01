import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'
import { getWIBDate } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'dashboard')

    const today = getWIBDate()
    const userNama = user.nama || ''

    // Check if user is guru (not super-admin or admin)
    const isGuruRole = user.role !== 'super-admin' && user.role !== 'admin'

    if (isGuruRole) {
      // ── Guru-specific dashboard data ──
      // Build list of possible guru names for matching
      const userRecord = await db.user.findUnique({ where: { id: user.userId }, select: { nama: true, nip: true, username: true } })
      const guruNames = new Set<string>()
      if (userNama) guruNames.add(userNama)
      if (userRecord?.nama && userRecord.nama !== userNama) guruNames.add(userRecord.nama)
      const identifiers = [userRecord?.nip, userRecord?.username, user.username].filter(Boolean) as string[]
      if (identifiers.length > 0) {
        const gurus = await db.guru.findMany({ where: { OR: identifiers.map(id => ({ nip: id })) }, select: { nama: true } })
        for (const g of gurus) guruNames.add(g.nama)
      }
      const guruNameArr = Array.from(guruNames).filter(Boolean)
      const mapelWhere = guruNameArr.length > 0 ? { guru: { in: guruNameArr }, status: 'aktif' } : { status: 'aktif' }

      const [myMapel, myKelasWali, myNilaiCount, mySiswaCount, myAbsenToday] = await Promise.all([
        // Mapel taught by this guru
        db.mataPelajaran.findMany({
          where: mapelWhere,
          select: { kodeMapel: true, namaMapel: true, guru: true, kkm: true },
        }),
        // Kelas where this guru is wali kelas
        db.kelas.findMany({
          where: { waliKelas: userNama, status: 'aktif' },
          select: { kodeKelas: true, namaKelas: true, waliKelas: true },
        }),
        // Nilai count by this guru
        db.nilai.count({ where: { guru: { in: guruNameArr.length > 0 ? guruNameArr : [userNama] } } }),
        // Count students in classes where this guru teaches
        (async () => {
          const mapelList = await db.mataPelajaran.findMany({
            where: mapelWhere,
            select: { kodeMapel: true },
          })
          if (mapelList.length === 0) return 0
          const mapelCodes = mapelList.map(m => m.kodeMapel)
          const nilaiRecords = await db.nilai.findMany({
            where: { guru: { in: guruNameArr.length > 0 ? guruNameArr : [userNama] } },
            select: { kelas: true, nis: true },
            distinct: ['kelas', 'nis'],
          })
          return nilaiRecords.length
        })(),
        // Guru's own attendance today
        db.absensiGuru.findFirst({
          where: { tanggal: today, namaGuru: userNama },
        }),
      ])

      // Build a combined list of kelas the guru is associated with
      // (wali kelas + kelas found in nilai records)
      const nilaiKelasList = await db.nilai.findMany({
        where: { guru: { in: guruNameArr.length > 0 ? guruNameArr : [userNama] } },
        select: { kelas: true },
        distinct: ['kelas'],
      })
      const nilaiKelasCodes = nilaiKelasList.map(n => n.kelas)

      // Also get kelas from wali kelas
      const allKelasCodes = [...new Set([
        ...myKelasWali.map(k => k.kodeKelas),
        ...nilaiKelasCodes,
      ])]

      const kelasList = allKelasCodes.length > 0
        ? await db.kelas.findMany({
            where: { kodeKelas: { in: allKelasCodes }, status: 'aktif' },
            select: { kodeKelas: true, namaKelas: true },
          })
        : []

      // Count total siswa in those kelas
      let totalSiswa = 0
      if (allKelasCodes.length > 0) {
        for (const kc of allKelasCodes) {
          const count = await db.siswa.count({ where: { kelas: kc, status: 'aktif' } })
          totalSiswa += count
        }
      }

      // Pengumuman
      const pengumuman = await db.pengumuman.findMany({
        where: { status: 'aktif' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, judul: true, tanggal: true, isi: true, createdAt: true },
      })

      return NextResponse.json({
        stats: {
          totalKelas: kelasList.length,
          totalSiswa,
          totalMapel: myMapel.length,
          totalNilai: myNilaiCount,
          myMapel,
          myKelasWali,
          kelasList,
          pengumumanAktif: pengumuman.length,
        },
        recentPengumuman: pengumuman,
        myAbsenToday,
        today,
      })
    }

    // ── Admin dashboard data (original) ──
    const [totalGuru, totalSiswa, totalKelas, totalMapel] = await Promise.all([
      db.guru.count({ where: { status: 'aktif' } }),
      db.siswa.count({ where: { status: 'aktif' } }),
      db.kelas.count({ where: { status: 'aktif' } }),
      db.mataPelajaran.count({ where: { status: 'aktif' } }),
    ])

    // Detailed guru attendance
    const guruHadir = await db.absensiGuru.count({ where: { tanggal: today, status: 'Hadir' } })
    const guruSudahPulang = await db.absensiGuru.count({ where: { tanggal: today, status: 'Sudah Pulang' } })
    const guruTidakHadir = await db.absensiGuru.count({ where: { tanggal: today, status: 'Tidak Hadir' } })

    // Detailed siswa attendance
    const siswaHadir = await db.absensiSiswa.count({ where: { tanggal: today, status: 'Hadir' } })
    const siswaSakit = await db.absensiSiswa.count({ where: { tanggal: today, status: 'Sakit' } })
    const siswaIzin = await db.absensiSiswa.count({ where: { tanggal: today, status: 'Izin' } })
    const siswaAlpha = await db.absensiSiswa.count({ where: { tanggal: today, status: 'Alpha' } })
    const totalAbsensiSiswa = siswaHadir + siswaSakit + siswaIzin + siswaAlpha

    const totalNilai = await db.nilai.count()
    const rataRataAll = await db.nilai.aggregate({ _avg: { nilaiAkhir: true } })
    const siswaAboveKKM = await db.nilai.count({ where: { nilaiAkhir: { gte: 75 } } })
    const persentaseLulus = totalNilai > 0 ? Math.round((siswaAboveKKM / totalNilai) * 100) : 0

    const pengumumanAktif = await db.pengumuman.count({ where: { status: 'aktif' } })

    const recentPengumuman = await db.pengumuman.findMany({
      where: { status: 'aktif' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, judul: true, tanggal: true, createdAt: true },
    })

    const kelasList = await db.kelas.findMany({ where: { status: 'aktif' } })
    const siswaPerKelas = await Promise.all(
      kelasList.map(async (k) => {
        const count = await db.siswa.count({ where: { kelas: k.kodeKelas, status: 'aktif' } })
        return { id: k.id, kodeKelas: k.kodeKelas, namaKelas: k.namaKelas, jumlahSiswa: count }
      })
    )

    const mapelStats = await db.mataPelajaran.findMany({
      where: { status: 'aktif' },
      select: { namaMapel: true, kodeMapel: true },
    })

    return NextResponse.json({
      stats: {
        totalGuru, totalSiswa, totalKelas, totalMapel,
        guruHadir, guruSudahPulang, guruTidakHadir,
        siswaHadir, siswaSakit, siswaIzin, siswaAlpha,
        totalAbsensiSiswaHariIni: totalAbsensiSiswa,
        totalNilai,
        rataRataKeseluruhan: rataRataAll._avg.nilaiAkhir ? Math.round(rataRataAll._avg.nilaiAkhir * 100) / 100 : 0,
        persentaseLulus,
        pengumumanAktif,
      },
      recentPengumuman,
      siswaPerKelas,
      mapelStats,
      today,
    })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}