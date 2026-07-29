import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Simple query to test database connection
    await db.$queryRaw`SELECT 1 as ok`
    return NextResponse.json({ status: 'ok', database: 'connected' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { status: 'error', database: 'disconnected', error: message },
      { status: 503 },
    )
  }
}
