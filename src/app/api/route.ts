import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, initAuth, AuthError } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'dashboard')
    return NextResponse.json({ message: "Hello, world!" })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
