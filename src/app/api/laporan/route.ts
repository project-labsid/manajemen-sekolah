import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    const url = new URL(request.url)
    const tipe = url.searchParams.get('tipe') || 'nilai'
    const kelas = url.searchParams.get('kelas') || ''
    const mapel = url.searchParams.get('mapel') || ''
    const semester = url.searchParams.get('semester') || ''
    const tahunAjaran = url.searchParams.get('tahunAjaran') || ''
    const tanggalMulai = url.searchParams.get('tanggalMulai') || ''
    const tanggalSelesai = url.searchParams.get('tanggalSelesai') || ''

    if (tipe === 'nilai') {
      const where: Record<string, unknown> = {}
      if (kelas) where.kelas = kelas
      if (mapel) where.mapel = mapel
      if (semester) where.semester = semester
      if (tahunAjaran) where.tahunAjaran = tahunAjaran

      const nilaiData = await db.nilai.findMany({
        where,
        orderBy: [{ kelas: 'asc' }, { nis: 'asc' }, { mapel: 'asc' }],
      })

      const siswaList = kelas
        ? await db.siswa.findMany({ where: { kelas, status: 'aktif' }, orderBy: { nis: 'asc' } })
        : []

      const groupedBySiswa = new Map<string, typeof nilaiData>()
      for (const n of nilaiData) {
        const key = `${n.nis}-${n.kelas}`
        if (!groupedBySiswa.has(key)) groupedBySiswa.set(key, [])
        groupedBySiswa.get(key)!.push(n)
      }

      const nilaiPerSiswa = Array.from(groupedBySiswa.entries()).map(([key, items]) => {
        const totalNilaiAkhir = items.reduce((sum, i) => sum + i.nilaiAkhir, 0)
        const rataRata = items.length > 0 ? Math.round((totalNilaiAkhir / items.length) * 100) / 100 : 0
        return {
          nis: items[0].nis,
          nama: items[0].nama,
          kelas: items[0].kelas,
          jumlahMapel: items.length,
          rataRata,
          nilaiTertinggi: Math.max(...items.map((i) => i.nilaiAkhir)),
          nilaiTerendah: Math.min(...items.map((i) => i.nilaiAkhir)),
          mapelLulus: items.filter((i) => i.nilaiAkhir >= 75).length,
          mapelTidakLulus: items.filter((i) => i.nilaiAkhir < 75).length,
          detailNilai: items,
        }
      })

      const overallStats = nilaiData.length > 0
        ? {
            rataRataKeseluruhan: Math.round((nilaiData.reduce((s, n) => s + n.nilaiAkhir, 0) / nilaiData.length) * 100) / 100,
            nilaiTertinggi: Math.max(...nilaiData.map((n) => n.nilaiAkhir)),
            nilaiTerendah: Math.min(...nilaiData.map((n) => n.nilaiAkhir)),
            lulus: nilaiData.filter((n) => n.nilaiAkhir >= 75).length,
            tidakLulus: nilaiData.filter((n) => n.nilaiAkhir < 75).length,
            totalSiswa: nilaiPerSiswa.length,
          }
        : { rataRataKeseluruhan: 0, nilaiTertinggi: 0, nilaiTerendah: 0, lulus: 0, tidakLulus: 0, totalSiswa: 0 }

      return NextResponse.json({
        tipe: 'nilai',
        data: nilaiPerSiswa,
        stats: overallStats,
        filters: { kelas, mapel, semester, tahunAjaran },
      })
    }

    if (tipe === 'absensi') {
      const whereSiswa: Record<string, unknown> = {}
      if (kelas) whereSiswa.kelas = kelas
      if (tanggalMulai && tanggalSelesai) {
        whereSiswa.tanggal = { gte: tanggalMulai, lte: tanggalSelesai }
      } else if (tanggalMulai) {
        whereSiswa.tanggal = { gte: tanggalMulai }
      } else if (tanggalSelesai) {
        whereSiswa.tanggal = { lte: tanggalSelesai }
      }

      const absensiData = await db.absensiSiswa.findMany({
        where: whereSiswa,
        orderBy: [{ tanggal: 'desc' }, { kelas: 'asc' }, { nis: 'asc' }],
      })

      const totalHadir = absensiData.filter((a) => a.status === 'Hadir').length
      const totalSakit = absensiData.filter((a) => a.status === 'Sakit').length
      const totalIzin = absensiData.filter((a) => a.status === 'Izin').length
      const totalAlpha = absensiData.filter((a) => a.status === 'Alpha').length
      const total = absensiData.length

      const groupedBySiswa = new Map<string, typeof absensiData>()
      for (const a of absensiData) {
        if (!groupedBySiswa.has(a.nis)) groupedBySiswa.set(a.nis, [])
        groupedBySiswa.get(a.nis)!.push(a)
      }

      const absensiPerSiswa = Array.from(groupedBySiswa.entries()).map(([nis, items]) => ({
        nis,
        nama: items[0].nama,
        kelas: items[0].kelas,
        hadir: items.filter((i) => i.status === 'Hadir').length,
        sakit: items.filter((i) => i.status === 'Sakit').length,
        izin: items.filter((i) => i.status === 'Izin').length,
        alpha: items.filter((i) => i.status === 'Alpha').length,
        totalHari: items.length,
        persentaseKehadiran: items.length > 0
          ? Math.round((items.filter((i) => i.status === 'Hadir').length / items.length) * 10000) / 100
          : 0,
      }))

      return NextResponse.json({
        tipe: 'absensi',
        data: absensiPerSiswa,
        summary: { total, hadir: totalHadir, sakit: totalSakit, izin: totalIzin, alpha: totalAlpha },
        filters: { kelas, tanggalMulai, tanggalSelesai },
      })
    }

    return NextResponse.json({ error: 'Tipe laporan tidak valid. Gunakan: nilai atau absensi' }, { status: 400 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
