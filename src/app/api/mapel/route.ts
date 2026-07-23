import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    const data = await db.mataPelajaran.findMany({
      orderBy: { namaMapel: 'asc' },
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
    const { kodeMapel, namaMapel, kkm, guru, status } = body

    if (!kodeMapel || !namaMapel) {
      return NextResponse.json({ error: 'Kode Mapel dan Nama Mapel wajib diisi' }, { status: 400 })
    }

    const existing = await db.mataPelajaran.findUnique({ where: { kodeMapel } })
    if (existing) {
      return NextResponse.json({ error: 'Kode Mapel sudah terdaftar' }, { status: 409 })
    }

    const mapel = await db.mataPelajaran.create({
      data: { kodeMapel, namaMapel, kkm: kkm || 75, guru, status: status || 'aktif' },
    })

    return NextResponse.json({ data: mapel, message: 'Mata Pelajaran berhasil ditambahkan' }, { status: 201 })
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
    const { id, kodeMapel, namaMapel, kkm, guru, status } = body

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.mataPelajaran.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Mata Pelajaran tidak ditemukan' }, { status: 404 })
    }

    if (kodeMapel && kodeMapel !== existing.kodeMapel) {
      const codeExists = await db.mataPelajaran.findUnique({ where: { kodeMapel } })
      if (codeExists) {
        return NextResponse.json({ error: 'Kode Mapel sudah digunakan' }, { status: 409 })
      }
    }

    const mapel = await db.mataPelajaran.update({
      where: { id },
      data: { kodeMapel, namaMapel, kkm, guru, status },
    })

    return NextResponse.json({ data: mapel, message: 'Mata Pelajaran berhasil diperbarui' })
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

    const existing = await db.mataPelajaran.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Mata Pelajaran tidak ditemukan' }, { status: 404 })
    }

    await db.mataPelajaran.delete({ where: { id } })

    return NextResponse.json({ message: 'Mata Pelajaran berhasil dihapus' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
