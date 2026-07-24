import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    const data = await db.kelas.findMany({
      orderBy: { kodeKelas: 'asc' },
    })

    return NextResponse.json({ data })
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

    return NextResponse.json({ data: kelas, message: 'Kelas berhasil ditambahkan' }, { status: 201 })
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

    return NextResponse.json({ data: kelas, message: 'Kelas berhasil diperbarui' })
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

    const existing = await db.kelas.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 })
    }

    await db.kelas.delete({ where: { id } })

    return NextResponse.json({ message: 'Kelas berhasil dihapus' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
