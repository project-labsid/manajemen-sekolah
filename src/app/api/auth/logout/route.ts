import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { getWIBDate } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (user) {
      const now = new Date()
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
      await db.auditLog.create({
        data: {
          tanggal: getWIBDate(),
          user: user.nama,
          role: user.role,
          aktivitas: 'Logout',
          ip,
          detail: `User ${user.username} logout`,
        },
      })
    }
    return NextResponse.json({ message: 'Logout berhasil' })
  } catch {
    return NextResponse.json({ message: 'Logout berhasil' })
  }
}
