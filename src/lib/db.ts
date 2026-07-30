import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || ''
  
  // Force SSL for TiDB Cloud / production databases
  let url = dbUrl
  if (dbUrl.includes('tidbcloud.com') || dbUrl.includes('aivencloud.com')) {
    // Remove existing ssl params
    url = url.split('?')[0]
    // Add SSL parameter for mysql2 driver
    url += '?sslaccept=strict'
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
