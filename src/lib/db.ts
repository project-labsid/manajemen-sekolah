import { PrismaClient } from '@prisma/client'
import { bindAdapter } from '@prisma/driver-adapter-utils'
import { TiDBCloudAdapter } from './tidb-adapter'

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || ''

  if (dbUrl.includes('tidbcloud.com')) {
    const adapter = new TiDBCloudAdapter(dbUrl)
    return new PrismaClient({
      adapter: bindAdapter(adapter),
      log: [],
    })
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db