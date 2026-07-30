import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  let url = process.env.DATABASE_URL || ''

  // For TiDB Cloud: add SSL in CODE (not in env var) to avoid Vercel mangling { } characters
  if (url.includes('tidbcloud.com')) {
    const baseUrl = url.split('?')[0]
    url = baseUrl + '?ssl={"rejectUnauthorized":true}'
  }

  return new PrismaClient({
    url,
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
