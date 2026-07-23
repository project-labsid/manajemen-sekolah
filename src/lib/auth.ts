import crypto from 'crypto'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'siakad-secret-key-2024'

export interface JwtPayload {
  userId: string
  username: string
  role: string
  nama: string
  exp: number
}

export function signToken(payload: Omit<JwtPayload, 'exp'>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url')
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const [header, body, sig] = token.split('.')
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
    if (sig !== expectedSig) return null
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (payload.exp < Date.now()) return null
    return payload as JwtPayload
  } catch {
    return null
  }
}

export function getUserFromRequest(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  return verifyToken(token)
}

export function isAdmin(user: JwtPayload): boolean {
  return user.role === 'admin'
}
