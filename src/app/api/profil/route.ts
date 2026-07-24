import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

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

    return NextResponse.json({ data: profile, message: 'Profil berhasil diperbarui' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
