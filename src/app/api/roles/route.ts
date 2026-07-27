import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticate, initAuth, AuthError } from '@/lib/rbac'

export async function GET() {
  try {
    await initAuth()
    authenticate()

    const roles = await db.role.findMany({
      where: { status: 'aktif' },
      orderBy: { nama: 'asc' },
      select: { id: true, slug: true, nama: true, deskripsi: true },
    })

    return NextResponse.json({ data: roles })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Gagal memuat data role' }, { status: 500 })
  }
}