import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken, getUserWithPermissions, initAuth, reloadPermissions } from '@/lib/auth'
import { createAuditLog } from '@/lib/rbac'

export async function POST(request: NextRequest) {
  try {
    await initAuth()

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { username } })

    if (!user) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    if (user.status !== 'aktif') {
      return NextResponse.json({ error: 'Akun tidak aktif. Hubungi administrator.' }, { status: 403 })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      nama: user.nama,
    })

    const now = new Date()
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const userAgent = request.headers.get('user-agent') || ''

    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: now },
    })

    await db.riwayatLogin.create({
      data: {
        user: user.nama,
        role: user.role,
        waktuLogin: now.toISOString(),
        ipAddress: ip,
        userAgent,
      },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Login',
      ip,
      detail: `User ${user.username} berhasil login`,
    })

    // Get permissions
    const fullUser = await getUserWithPermissions({
      userId: user.id, username: user.username, role: user.role, nama: user.nama, exp: 0,
    })

    return NextResponse.json({
      token,
      user: fullUser,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
