import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, requireAnyPermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    // Allow mapel, nilai, absensi-siswa, rekap-nilai permissions to read mapel
    await requireAnyPermission(user, ['mapel', 'nilai', 'absensi-siswa', 'rekap-nilai'])

    const isAdminLike = user.role === 'super-admin' || user.role === 'admin' || user.role === 'operator'
    const isGuruRole = user.role === 'guru' || user.role === 'wali-kelas'

    let data
    if (isGuruRole) {
      // For guru: return only mapel assigned to them
      // Try multiple name matching strategies
      const userRecord = await db.user.findUnique({ where: { id: user.userId }, select: { nama: true, nip: true, username: true } })
      const guruNames = new Set<string>()
      if (user.nama) guruNames.add(user.nama)
      if (userRecord?.nama && userRecord.nama !== user.nama) guruNames.add(userRecord.nama)
      // Try matching via NIP in Guru table
      const identifiers = [userRecord?.nip, userRecord?.username, user.username].filter(Boolean) as string[]
      if (identifiers.length > 0) {
        const gurus = await db.guru.findMany({
          where: { OR: identifiers.map(id => ({ nip: id })) },
          select: { nama: true },
        })
        for (const g of gurus) guruNames.add(g.nama)
      }
      // Also try by exact nama in Guru table
      if (user.nama) {
        const guruByName = await db.guru.findFirst({ where: { nama: user.nama }, select: { nama: true } })
        if (guruByName) guruNames.add(guruByName.nama)
      }

      const namesArr = Array.from(guruNames).filter(Boolean)
      data = namesArr.length > 0
        ? await db.mataPelajaran.findMany({
            where: { guru: { in: namesArr } },
            orderBy: { namaMapel: 'asc' },
          })
        : []
    } else {
      // Admin and other roles see all mapel
      data = await db.mataPelajaran.findMany({
        orderBy: { namaMapel: 'asc' },
      })
    }

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
    await requirePermission(user, 'mapel')

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

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Tambah Mata Pelajaran',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menambahkan mata pelajaran: ${namaMapel} (${kodeMapel})`,
    })

    return NextResponse.json({ data: mapel, message: 'Mata Pelajaran berhasil ditambahkan' }, { status: 201 })
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
    await requirePermission(user, 'mapel')

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

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Edit Mata Pelajaran',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Mengedit mata pelajaran: ${existing.namaMapel} (${existing.kodeMapel})`,
    })

    return NextResponse.json({ data: mapel, message: 'Mata Pelajaran berhasil diperbarui' })
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
    await requirePermission(user, 'mapel')

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

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Hapus Mata Pelajaran',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Menghapus mata pelajaran: ${existing.namaMapel} (${existing.kodeMapel})`,
    })

    return NextResponse.json({ message: 'Mata Pelajaran berhasil dihapus' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
