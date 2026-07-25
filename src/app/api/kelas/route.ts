import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, requireAnyPermission, initAuth, AuthError, createAuditLog } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    // Allow guru to read kelas for absensi-siswa purposes
    await requireAnyPermission(user, ['kelas', 'absensi-siswa'])

    const isGuruRole = user.role !== 'super-admin' && user.role !== 'admin' && user.role !== 'operator'

    if (isGuruRole) {
      // For guru: return only kelas where they are wali kelas or have nilai records
      const userNama = user.nama || ''

      const [waliKelas, nilaiKelas] = await Promise.all([
        db.kelas.findMany({
          where: { waliKelas: userNama, status: 'aktif' },
        }),
        db.nilai.findMany({
          where: { guru: userNama },
          select: { kelas: true },
          distinct: ['kelas'],
        }),
      ])

      const allKodeKelas = [
        ...waliKelas.map(k => k.kodeKelas),
        ...nilaiKelas.map(n => n.kelas),
      ]

      const uniqueKodeKelas = [...new Set(allKodeKelas)]

      if (uniqueKodeKelas.length === 0) {
        return NextResponse.json({ data: [] })
      }

      const kelas = await db.kelas.findMany({
        where: { kodeKelas: { in: uniqueKodeKelas }, status: 'aktif' },
        orderBy: { kodeKelas: 'asc' },
      })

      return NextResponse.json({ data: kelas })
    }

    // Admin sees all kelas
    const kelas = await db.kelas.findMany({
      where: { status: 'aktif' },
      orderBy: { kodeKelas: 'asc' },
    })

    return NextResponse.json({ data: kelas })
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
    await requirePermission(user, 'kelas')

    const body = await request.json()
    const { kodeKelas, namaKelas, waliKelas } = body

    if (!kodeKelas || !namaKelas) {
      return NextResponse.json({ error: 'Kode kelas dan nama kelas wajib diisi' }, { status: 400 })
    }

    const existing = await db.kelas.findUnique({ where: { kodeKelas } })
    if (existing) {
      return NextResponse.json({ error: 'Kode kelas sudah digunakan' }, { status: 400 })
    }

    const kelas = await db.kelas.create({
      data: { kodeKelas, namaKelas, waliKelas: waliKelas || '' },
    })

    await createAuditLog(user, 'CREATE', 'Kelas', `Membuat kelas ${namaKelas} (${kodeKelas})`)

    return NextResponse.json({ data: kelas }, { status: 201 })
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
    await requirePermission(user, 'kelas')

    const body = await request.json()
    const { id, kodeKelas, namaKelas, waliKelas, status } = body

    if (!id) {
      return NextResponse.json({ error: 'ID kelas wajib diisi' }, { status: 400 })
    }

    const kelas = await db.kelas.update({
      where: { id },
      data: {
        ...(kodeKelas !== undefined && { kodeKelas }),
        ...(namaKelas !== undefined && { namaKelas }),
        ...(waliKelas !== undefined && { waliKelas }),
        ...(status !== undefined && { status }),
      },
    })

    await createAuditLog(user, 'UPDATE', 'Kelas', `Mengubah kelas ${kelas.namaKelas}`)

    return NextResponse.json({ data: kelas })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'kelas')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kelas wajib diisi' }, { status: 400 })
    }

    const kelas = await db.kelas.findUnique({ where: { id } })
    if (!kelas) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 })
    }

    await db.kelas.delete({ where: { id } })
    await createAuditLog(user, 'DELETE', 'Kelas', `Menghapus kelas ${kelas.namaKelas}`)

    return NextResponse.json({ message: 'Kelas berhasil dihapus' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function createAuditLog(user: any, action: string, modul: string, detail: string) {
  try {
    const { createAuditLog } = await import('@/lib/rbac')
    await createAuditLog(user, action, modul, detail)
  } catch { /* ignore audit log errors */ }
}