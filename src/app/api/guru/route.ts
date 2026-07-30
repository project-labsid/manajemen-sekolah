import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, requireAnyPermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

function getPaginationParams(request: NextRequest) {
  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '20')))
  const search = url.searchParams.get('search') || ''
  return { page, limit, search, skip: (page - 1) * limit }
}

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'guru')

    const { page, limit, search, skip } = getPaginationParams(request)

    const where = {
      status: { not: 'dihapus' },
      ...(search
        ? {
            OR: [
              { nama: { contains: search } },
              { nip: { contains: search } },
              { email: { contains: search } },
              { mapel: { contains: search } },
            ],
          }
        : {}),
    }

    const [data, total] = await Promise.all([
      db.guru.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.guru.count({ where }),
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
    await requirePermission(user, 'guru')

    const body = await request.json()
    const { nip, nama, gelar, jenisKelamin, tempatLahir, tanggalLahir, alamat, email, noHP, mapel, status, foto } = body

    if (!nip || !nama) {
      return NextResponse.json({ error: 'NIP dan Nama wajib diisi' }, { status: 400 })
    }

    const existing = await db.guru.findUnique({ where: { nip } })
    if (existing) {
      return NextResponse.json({ error: 'NIP sudah terdaftar' }, { status: 409 })
    }

    const guru = await db.guru.create({
      data: { nip, nama, gelar, jenisKelamin, tempatLahir, tanggalLahir, alamat, email, noHP, mapel, status: status || 'aktif', foto },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Tambah Guru',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menambahkan guru: ${nama} (NIP: ${nip})`,
    })

    return NextResponse.json({ data: guru, message: 'Data guru berhasil ditambahkan' }, { status: 201 })
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
    await requirePermission(user, 'guru')

    const body = await request.json()
    const { id, nip, nama, gelar, jenisKelamin, tempatLahir, tanggalLahir, alamat, email, noHP, mapel, status, foto } = body

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.guru.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Data guru tidak ditemukan' }, { status: 404 })
    }

    if (nip && nip !== existing.nip) {
      const nipExists = await db.guru.findUnique({ where: { nip } })
      if (nipExists) {
        return NextResponse.json({ error: 'NIP sudah digunakan guru lain' }, { status: 409 })
      }
    }

    const guru = await db.guru.update({
      where: { id },
      data: { nip, nama, gelar, jenisKelamin, tempatLahir, tanggalLahir, alamat, email, noHP, mapel, status, foto },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Edit Guru',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Mengedit guru: ${existing.nama} (NIP: ${existing.nip})`,
    })

    return NextResponse.json({ data: guru, message: 'Data guru berhasil diperbarui' })
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
    await requireAnyPermission(user, ['guru', 'guru:delete'])

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.guru.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Data guru tidak ditemukan' }, { status: 404 })
    }

    await db.guru.update({
      where: { id },
      data: { status: 'dihapus' },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Hapus Guru',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menghapus guru: ${existing.nama} (NIP: ${existing.nip})`,
    })

    return NextResponse.json({ message: 'Data guru berhasil dihapus' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
