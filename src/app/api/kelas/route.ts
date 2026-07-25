import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'kelas')

    const data = await db.kelas.findMany({
      orderBy: { kodeKelas: 'asc' },
    })

    return NextResponse.json({ data })
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
    const { kodeKelas, namaKelas, waliKelas, status } = body

    if (!kodeKelas || !namaKelas) {
      return NextResponse.json({ error: 'Kode Kelas dan Nama Kelas wajib diisi' }, { status: 400 })
    }

    const existing = await db.kelas.findUnique({ where: { kodeKelas } })
    if (existing) {
      return NextResponse.json({ error: 'Kode Kelas sudah terdaftar' }, { status: 409 })
    }

    const kelas = await db.kelas.create({
      data: { kodeKelas, namaKelas, waliKelas, status: status || 'aktif' },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Tambah Kelas',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menambahkan kelas: ${namaKelas} (${kodeKelas})`,
    })

    return NextResponse.json({ data: kelas, message: 'Kelas berhasil ditambahkan' }, { status: 201 })
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
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.kelas.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 })
    }

    if (kodeKelas && kodeKelas !== existing.kodeKelas) {
      const codeExists = await db.kelas.findUnique({ where: { kodeKelas } })
      if (codeExists) {
        return NextResponse.json({ error: 'Kode Kelas sudah digunakan' }, { status: 409 })
      }
    }

    const kelas = await db.kelas.update({
      where: { id },
      data: { kodeKelas, namaKelas, waliKelas, status },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Edit Kelas',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Mengedit kelas: ${existing.namaKelas} (${existing.kodeKelas})`,
    })

    return NextResponse.json({ data: kelas, message: 'Kelas berhasil diperbarui' })
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
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.kelas.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 })
    }

    await db.kelas.delete({ where: { id } })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Hapus Kelas',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menghapus kelas: ${existing.namaKelas} (${existing.kodeKelas})`,
    })

    return NextResponse.json({ message: 'Kelas berhasil dihapus' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
