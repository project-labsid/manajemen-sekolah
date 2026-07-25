import crypto from 'crypto'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { loadPermissionCache, getUserPermissions, invalidatePermissionCache } from './rbac'

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

/** Get full user data with role info and permissions */
export async function getUserWithPermissions(payload: JwtPayload) {
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    include: {
      userRoles: {
        include: { role: { include: { permissions: { include: { permission: true } } } } },
      },
    },
  })
  if (!user) return null

  // Get permissions
  const perms = await getUserPermissions(user.role)
  const isSuperAdmin = user.role === 'super-admin' || perms.includes('*')

  // Get role name
  const roleName = await db.role.findUnique({ where: { slug: user.role } })

  return {
    id: user.id,
    nama: user.nama,
    username: user.username,
    role: user.role,
    roleName: roleName?.nama || user.role,
    email: user.email,
    noHP: user.noHP,
    foto: user.foto,
    status: user.status,
    lastLogin: user.lastLogin,
    nip: user.nip,
    jabatan: user.jabatan,
    permissions: isSuperAdmin ? ['*'] : perms,
    isSuperAdmin,
  }
}

/** Initialize RBAC cache on server startup */
export async function initAuth() {
  await loadPermissionCache()
}

/** Check and refresh cache if needed */
export async function ensureAuthCache() {
  const { hasPermission } = await import('./rbac')
  // Trigger cache load
  await hasPermission('__check__', '__nonexistent__')
}

/** Reload permissions (after role/permission changes) */
export async function reloadPermissions() {
  invalidatePermissionCache()
  await loadPermissionCache()
}
