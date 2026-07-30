import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, getUserWithPermissions, initAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    const user = await getUserWithPermissions(payload)
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
