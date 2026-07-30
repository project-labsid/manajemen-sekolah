import { PrismaClient } from '@prisma/client'
import { PrismaTiDBCloudServerless } from '@tidbcloud/serverless'

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || ''

  // Use TiDB Cloud Serverless adapter for TiDB Cloud (handles SSL automatically via HTTPS)
  if (dbUrl.includes('tidbcloud.com')) {
    return new PrismaClient({
      adapter: new PrismaTiDBCloudServerless({ url: dbUrl }),
      log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    })
  }

  // Standard MySQL connection for local development
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
