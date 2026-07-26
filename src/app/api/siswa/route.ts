import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, requireAnyPermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    // Allow access if user has 'siswa' or 'absensi-siswa' permission
    await requireAnyPermission(user, ['siswa', 'absensi-siswa'])</arg_value>  

    const url = new URL(request.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '20')))
    const search = url.searchParams.get('search') || ''
    const kelas = url.searchParams.get('kelas') || ''
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {
      status: { not: 'dihapus' },
    }

    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { nis: { contains: search } },
        { nisn: { contains: search } },
      ]
    }

    if (kelas) {
      where.kelas = kelas
    }

    const [data, total] = await Promise.all([
      db.siswa.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.siswa.count({ where }),
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
    await requirePermission(user, 'siswa')

    const body = await request.json()
    const { nis, nisn, nama, jenisKelamin, tempatLahir, tanggalLahir, agama, alamat, namaAyah, namaIbu, noHP, kelas, status, foto } = body

    if (!nis || !nama) {
      return NextResponse.json({ error: 'NIS dan Nama wajib diisi' }, { status: 400 })
    }

    const existing = await db.siswa.findUnique({ where: { nis } })
    if (existing) {
      return NextResponse.json({ error: 'NIS sudah terdaftar' }, { status: 409 })
    }

    const siswa = await db.siswa.create({
      data: { nis, nisn, nama, jenisKelamin, tempatLahir, tanggalLahir, agama, alamat, namaAyah, namaIbu, noHP, kelas, status: status || 'aktif', foto },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Tambah Siswa',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menambahkan siswa: ${nama} (NIS: ${nis})`,
    })

    return NextResponse.json({ data: siswa, message: 'Data siswa berhasil ditambahkan' }, { status: 201 })
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
    await requirePermission(user, 'siswa')

    const body = await request.json()
    const { id, nis, nisn, nama, jenisKelamin, tempatLahir, tanggalLahir, agama, alamat, namaAyah, namaIbu, noHP, kelas, status, foto } = body

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.siswa.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 })
    }

    if (nis && nis !== existing.nis) {
      const nisExists = await db.siswa.findUnique({ where: { nis } })
      if (nisExists) {
        return NextResponse.json({ error: 'NIS sudah digunakan siswa lain' }, { status: 409 })
      }
    }

    const siswa = await db.siswa.update({
      where: { id },
      data: { nis, nisn, nama, jenisKelamin, tempatLahir, tanggalLahir, agama, alamat, namaAyah, namaIbu, noHP, kelas, status, foto },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Edit Siswa',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Mengedit siswa: ${existing.nama} (NIS: ${existing.nis})`,
    })

    return NextResponse.json({ data: siswa, message: 'Data siswa berhasil diperbarui' })
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
    await requirePermission(user, 'siswa')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.siswa.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 })
    }

    await db.siswa.update({
      where: { id },
      data: { status: 'dihapus' },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Hapus Siswa',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menghapus siswa: ${existing.nama} (NIS: ${existing.nis})`,
    })

    return NextResponse.json({ message: 'Data siswa berhasil dihapus' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
