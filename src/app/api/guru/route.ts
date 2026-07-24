import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth'
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
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

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
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }
    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

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

    return NextResponse.json({ data: guru, message: 'Data guru berhasil ditambahkan' }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }
    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

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

    return NextResponse.json({ data: guru, message: 'Data guru berhasil diperbarui' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }
    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

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

    return NextResponse.json({ message: 'Data guru berhasil dihapus' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
