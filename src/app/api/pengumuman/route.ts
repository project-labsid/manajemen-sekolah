import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, initAuth, AuthError, createAuditLog } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'pengumuman')

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const where: any = { status: 'aktif' }

    const pengumuman = await db.pengumuman.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        judul: true,
        isi: true,
        lampiran: true,
        tanggal: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ data: pengumuman })
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
    const { judul, isi, tanggal, lampiran, status } = body

    if (!judul) {
      return NextResponse.json({ error: 'Judul pengumuman wajib diisi' }, { status: 400 })
    }

    const pengumuman = await db.pengumuman.create({
      data: {
        judul,
        isi: isi || '',
        tanggal: tanggal || new Date().toISOString().split('T')[0],
        lampiran: lampiran || '',
        status: status || 'aktif',
      },
    })

    await createAuditLog(user, 'CREATE', 'Pengumuman', `Membuat pengumuman: ${judul}`)

    return NextResponse.json({ data: pengumuman }, { status: 201 })
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
    const { id, judul, isi, tanggal, lampiran, status } = body

    if (!id) {
      return NextResponse.json({ error: 'ID pengumuman wajib diisi' }, { status: 400 })
    }

    const pengumuman = await db.pengumuman.update({
      where: { id },
      data: {
        ...(judul !== undefined && { judul }),
        ...(isi !== undefined && { isi }),
        ...(tanggal !== undefined && { tanggal }),
        ...(lampiran !== undefined && { lampiran }),
        ...(status !== undefined && { status }),
      },
    })

    await createAuditLog(user, 'UPDATE', 'Pengumuman', `Mengubah pengumuman: ${pengumuman.judul}`)

    return NextResponse.json({ data: pengumuman })
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
      return NextResponse.json({ error: 'ID pengumuman wajib diisi' }, { status: 400 })
    }

    const pengumuman = await db.pengumuman.findUnique({ where: { id } })
    if (!pengumuman) {
      return NextResponse.json({ error: 'Pengumuman tidak ditemukan' }, { status: 404 })
    }

    await db.pengumuman.delete({ where: { id } })
    await createAuditLog(user, 'DELETE', 'Pengumuman', `Menghapus pengumuman: ${pengumuman.judul}`)

    return NextResponse.json({ message: 'Pengumuman berhasil dihapus' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}