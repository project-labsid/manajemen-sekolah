import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'riwayat-login')

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const search = url.searchParams.get('search') || ''
    const where: Record<string, unknown> = {}
    if (search) { where.user = { contains: search } }
    const [data, total] = await Promise.all([
      db.riwayatLogin.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      db.riwayatLogin.count({ where }),
    ])
    return NextResponse.json({ data, total, page, limit })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
