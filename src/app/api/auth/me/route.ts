import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid atau sudah expired' }, { status: 401 })
    }

    const fullUser = await db.user.findUnique({
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
      },
    })

    if (!fullUser) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ user: fullUser })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
