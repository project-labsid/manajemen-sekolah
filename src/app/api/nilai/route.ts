import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, requireAnyPermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

function hitungPredikat(nilaiAkhir: number): string {
  if (nilaiAkhir >= 93) return 'A'
  if (nilaiAkhir >= 84) return 'B'
  if (nilaiAkhir >= 75) return 'C'
  return 'D'
}

function hitungRataRata(ph1: number, ph2: number, ph3: number, ph4: number): number {
  const sum = ph1 + ph2 + ph3 + ph4
  return sum / 4
}

function hitungNilaiAkhir(rataRata: number, pts: number, pas: number): number {
  return Math.round((rataRata * 0.4 + pts * 0.3 + pas * 0.3) * 100) / 100
}

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'nilai')

    const url = new URL(request.url)
    const kelas = url.searchParams.get('kelas') || ''
    const mapel = url.searchParams.get('mapel') || ''
    const semester = url.searchParams.get('semester') || ''
    const tahunAjaran = url.searchParams.get('tahunAjaran') || ''
    const nis = url.searchParams.get('nis') || ''

    const where: Record<string, unknown> = {}
    if (kelas) where.kelas = kelas
    if (mapel) where.mapel = mapel
    if (semester) where.semester = semester
    if (tahunAjaran) where.tahunAjaran = tahunAjaran
    if (nis) where.nis = nis

    const data = await db.nilai.findMany({
      where,
      orderBy: [{ nis: 'asc' }, { mapel: 'asc' }],
    })

    const kkmValue = mapel
      ? await db.mataPelajaran.findUnique({ where: { kodeMapel: mapel }, select: { kkm: true } })
      : null

    return NextResponse.json({
      data,
      kkm: kkmValue?.kkm || 75,
      total: data.length,
      rataRataKelas:
        data.length > 0
          ? Math.round((data.reduce((sum, n) => sum + n.nilaiAkhir, 0) / data.length) * 100) / 100
          : 0,
    })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requireAnyPermission(user, ['nilai', 'nilai:edit'])

    const body = await request.json()
    const {
      tahunAjaran, semester, kelas, mapel, guru,
      nis, nama, ph1, ph2, ph3, ph4, pts, pas, deskripsi,
    } = body

    if (!nis || !mapel || !kelas) {
      return NextResponse.json({ error: 'NIS, Mapel, dan Kelas wajib diisi' }, { status: 400 })
    }

    const rataRata = hitungRataRata(ph1 || 0, ph2 || 0, ph3 || 0, ph4 || 0)
    const nilaiAkhir = hitungNilaiAkhir(rataRata, pts || 0, pas || 0)
    const predikat = hitungPredikat(nilaiAkhir)

    const existing = await db.nilai.findFirst({
      where: { nis, mapel, kelas, semester: semester || 'Genap', tahunAjaran: tahunAjaran || '2023/2024' },
    })

    let data
    if (existing) {
      data = await db.nilai.update({
        where: { id: existing.id },
        data: {
          tahunAjaran: tahunAjaran || '2023/2024',
          semester: semester || 'Genap',
          kelas, mapel, guru: guru || '',
          nama: nama || '',
          ph1: ph1 || 0, ph2: ph2 || 0, ph3: ph3 || 0, ph4: ph4 || 0,
          pts: pts || 0, pas: pas || 0,
          rataRata, nilaiAkhir, predikat,
          deskripsi: deskripsi || '',
        },
      })
    } else {
      data = await db.nilai.create({
        data: {
          tahunAjaran: tahunAjaran || '2023/2024',
          semester: semester || 'Genap',
          kelas, mapel, guru: guru || '',
          nis, nama: nama || '',
          ph1: ph1 || 0, ph2: ph2 || 0, ph3: ph3 || 0, ph4: ph4 || 0,
          pts: pts || 0, pas: pas || 0,
          rataRata, nilaiAkhir, predikat,
          deskripsi: deskripsi || '',
        },
      })
    }

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: existing ? 'Update Nilai' : 'Tambah Nilai',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `${existing ? 'Mengupdate' : 'Menambahkan'} nilai ${nama || nis}, mapel ${mapel}, kelas ${kelas}`,
    })

    return NextResponse.json({ data, message: 'Nilai berhasil disimpan' }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requireAnyPermission(user, ['nilai', 'nilai:edit'])

    const body = await request.json()
    const { nilaiList } = body as { nilaiList: Array<Record<string, unknown>> }

    if (!nilaiList || !Array.isArray(nilaiList) || nilaiList.length === 0) {
      return NextResponse.json({ error: 'Data nilai wajib diisi' }, { status: 400 })
    }

    const results = []
    for (const item of nilaiList) {
      const {
        id, tahunAjaran, semester, kelas, mapel, guru,
        nis, nama, ph1, ph2, ph3, ph4, pts, pas, deskripsi,
      } = item

      const p1 = Number(ph1) || 0
      const p2 = Number(ph2) || 0
      const p3 = Number(ph3) || 0
      const p4 = Number(ph4) || 0
      const pPts = Number(pts) || 0
      const pPas = Number(pas) || 0

      const rataRata = hitungRataRata(p1, p2, p3, p4)
      const nilaiAkhir = hitungNilaiAkhir(rataRata, pPts, pPas)
      const predikat = hitungPredikat(nilaiAkhir)

      const updateData = {
        tahunAjaran: (tahunAjaran as string) || '2023/2024',
        semester: (semester as string) || 'Genap',
        kelas: kelas as string,
        mapel: mapel as string,
        guru: (guru as string) || '',
        nis: nis as string,
        nama: (nama as string) || '',
        ph1: p1, ph2: p2, ph3: p3, ph4: p4,
        pts: pPts, pas: pPas,
        rataRata, nilaiAkhir, predikat,
        deskripsi: (deskripsi as string) || '',
      }

      if (id) {
        const updated = await db.nilai.update({ where: { id: id as string }, data: updateData })
        results.push(updated)
      } else {
        const created = await db.nilai.create({ data: updateData })
        results.push(created)
      }
    }

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Batch Update Nilai',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Mengupdate ${results.length} data nilai`,
    })

    return NextResponse.json({ data: results, message: `${results.length} nilai berhasil disimpan` })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
