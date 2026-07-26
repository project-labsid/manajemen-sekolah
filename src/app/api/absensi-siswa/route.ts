import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requireAnyPermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requireAnyPermission(user, ['absensi-siswa', 'absensi-siswa:view'])

    const url = new URL(request.url)
    const tanggal = url.searchParams.get('tanggal') || new Date().toISOString().split('T')[0]
    const kelas = url.searchParams.get('kelas') || ''

    const where: Record<string, unknown> = { tanggal }
    if (kelas) {
      where.kelas = kelas
    }

    const data = await db.absensiSiswa.findMany({
      where,
      orderBy: [{ kelas: 'asc' }, { nis: 'asc' }],
    })

    const summary = {
      hadir: data.filter((d) => d.status === 'Hadir').length,
      sakit: data.filter((d) => d.status === 'Sakit').length,
      izin: data.filter((d) => d.status === 'Izin').length,
      alpha: data.filter((d) => d.status === 'Alpha').length,
      total: data.length,
    }

    return NextResponse.json({ data, summary, tanggal })
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
    await requireAnyPermission(user, ['absensi-siswa', 'absensi-siswa:view'])

    const body = await request.json()
    const { tanggal, kelas, nis, nama, status, keterangan, guru } = body

    if (!tanggal || !kelas || !nis || !status) {
      return NextResponse.json({ error: 'Tanggal, Kelas, NIS, dan Status wajib diisi' }, { status: 400 })
    }

    const existing = await db.absensiSiswa.findFirst({
      where: { tanggal, kelas, nis },
    })

    if (existing) {
      return NextResponse.json({ error: 'Absensi siswa sudah tercatat. Gunakan PUT untuk mengubah.' }, { status: 409 })
    }

    const absensi = await db.absensiSiswa.create({
      data: {
        tanggal,
        kelas,
        nis,
        nama: nama || '',
        status,
        keterangan: keterangan || '',
        guru: guru || user.nama,
      },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Tambah Absensi Siswa',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menambahkan absensi siswa NIS ${nis}, kelas ${kelas}, status ${status}`,
    })

    return NextResponse.json({ data: absensi, message: 'Absensi siswa berhasil dicatat' }, { status: 201 })
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
    await requireAnyPermission(user, ['absensi-siswa', 'absensi-siswa:view'])

    const body = await request.json()
    const { absensiList } = body as { absensiList: Array<Record<string, unknown>> }

    if (!absensiList || !Array.isArray(absensiList) || absensiList.length === 0) {
      return NextResponse.json({ error: 'Data absensi wajib diisi' }, { status: 400 })
    }

    const results = []
    for (const item of absensiList) {
      const { id, tanggal, kelas, nis, nama, status, keterangan, guru } = item

      if (id) {
        const updated = await db.absensiSiswa.update({
          where: { id: id as string },
          data: {
            status: status as string,
            keterangan: (keterangan as string) || '',
            guru: (guru as string) || user.nama,
          },
        })
        results.push(updated)
      } else {
        const existing = await db.absensiSiswa.findFirst({
          where: { tanggal: tanggal as string, kelas: kelas as string, nis: nis as string },
        })
        if (existing) {
          const updated = await db.absensiSiswa.update({
            where: { id: existing.id },
            data: {
              status: status as string,
              keterangan: (keterangan as string) || '',
              nama: (nama as string) || existing.nama,
              guru: (guru as string) || user.nama,
            },
          })
          results.push(updated)
        } else {
          const created = await db.absensiSiswa.create({
            data: {
              tanggal: tanggal as string,
              kelas: kelas as string,
              nis: nis as string,
              nama: (nama as string) || '',
              status: status as string,
              keterangan: (keterangan as string) || '',
              guru: (guru as string) || user.nama,
            },
          })
          results.push(created)
        }
      }
    }

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Update Absensi Siswa',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Mengupdate ${results.length} data absensi siswa`,
    })

    return NextResponse.json({ data: results, message: `${results.length} absensi berhasil disimpan` })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
