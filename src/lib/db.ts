import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  let url = process.env.DATABASE_URL || ''

  // Fix for Supabase connection pooler (Supavisor)
  if (url.includes('supabase.co')) {
    const sep = url.includes('?') ? '&' : '?'
    if (!url.includes('sslmode')) url += sep + 'sslmode=require'
    if (!url.includes('pgbouncer')) url += '&pgbouncer=true'
  }

  return new PrismaClient({
    datasourceUrl: url,
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db