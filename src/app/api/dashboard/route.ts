import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]

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
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
