import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'pengumuman')

    const url = new URL(request.url)
    const status = url.searchParams.get('status') || ''
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '20')))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [data, total] = await Promise.all([
      db.pengumuman.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.pengumuman.count({ where }),
    ])

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
    await requirePermission(user, 'pengumuman:manage')

    const body = await request.json()
    const { judul, isi, lampiran, tanggal, status } = body

    if (!judul) {
      return NextResponse.json({ error: 'Judul wajib diisi' }, { status: 400 })
    }

    const pengumuman = await db.pengumuman.create({
      data: {
        judul,
        isi: isi || '',
        lampiran: lampiran || '',
        tanggal: tanggal || new Date().toISOString().split('T')[0],
        status: status || 'aktif',
      },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Tambah Pengumuman',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menambahkan pengumuman: ${judul}`,
    })

    return NextResponse.json({ data: pengumuman, message: 'Pengumuman berhasil ditambahkan' }, { status: 201 })
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
    await requirePermission(user, 'pengumuman:manage')

    const body = await request.json()
    const { id, judul, isi, lampiran, tanggal, status } = body

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.pengumuman.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Pengumuman tidak ditemukan' }, { status: 404 })
    }

    const pengumuman = await db.pengumuman.update({
      where: { id },
      data: { judul, isi, lampiran, tanggal, status },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Edit Pengumuman',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Mengedit pengumuman: ${existing.judul}`,
    })

    return NextResponse.json({ data: pengumuman, message: 'Pengumuman berhasil diperbarui' })
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
    await requirePermission(user, 'pengumuman:manage')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.pengumuman.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Pengumuman tidak ditemukan' }, { status: 404 })
    }

    await db.pengumuman.delete({ where: { id } })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Hapus Pengumuman',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menghapus pengumuman: ${existing.judul}`,
    })

    return NextResponse.json({ message: 'Pengumuman berhasil dihapus' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
