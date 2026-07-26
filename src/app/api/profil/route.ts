import { NextRequest, NextResponse } from 'next/server'
import { authenticate, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    // All authenticated users can view their own profile

    const profile = await db.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        email: true,
        noHP: true,
        foto: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profil tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ data: profile })
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
    // All authenticated users can edit their own profile

    const body = await request.json()
    const { nama, email, noHP, foto, passwordOld, passwordNew } = body

    const updateData: Record<string, string> = {}
    if (nama !== undefined) updateData.nama = nama
    if (email !== undefined) updateData.email = email
    if (noHP !== undefined) updateData.noHP = noHP
    if (foto !== undefined) updateData.foto = foto

    if (passwordOld && passwordNew) {
      const existingUser = await db.user.findUnique({ where: { id: user.userId } })
      if (!existingUser) {
        return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
      }

      const validOld = await bcrypt.compare(passwordOld, existingUser.password)
      if (!validOld) {
        return NextResponse.json({ error: 'Password lama tidak sesuai' }, { status: 400 })
      }

      if (passwordNew.length < 6) {
        return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 })
      }

      updateData.password = await bcrypt.hash(passwordNew, 10)
    }

    const profile = await db.user.update({
      where: { id: user.userId },
      data: updateData,
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        email: true,
        noHP: true,
        foto: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Update Profil',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: 'Memperbarui profil pribadi',
    })

    return NextResponse.json({ data: profile, message: 'Profil berhasil diperbarui' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
