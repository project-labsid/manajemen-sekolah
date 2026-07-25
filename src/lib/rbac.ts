import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, type JwtPayload, initAuth as _initAuth } from '@/lib/auth'

// Re-export initAuth for convenience
export const initAuth = _initAuth

// ── Permission cache (in-memory, refreshed on server start) ──
let permissionCache: Map<string, Set<string>> = new Map()
let cacheLoaded = false

export async function loadPermissionCache() {
  const rolePermissions = await db.rolePermission.findMany({
    include: { role: true, permission: true },
  })
  permissionCache.clear()
  for (const rp of rolePermissions) {
    if (rp.role.status !== 'aktif') continue
    const existing = permissionCache.get(rp.role.slug) || new Set<string>()
    existing.add(rp.permission.slug)
    permissionCache.set(rp.role.slug, existing)
  }
  cacheLoaded = true
}

async function ensureCache() {
  if (!cacheLoaded) await loadPermissionCache()
}

/** Check if a role slug has a specific permission */
export async function hasPermission(roleSlug: string, permissionSlug: string): Promise<boolean> {
  await ensureCache()
  const perms = permissionCache.get(roleSlug)
  if (!perms) return false
  if (perms.has('wildcard-all')) return true // super admin wildcard
  return perms.has(permissionSlug)
}

/** Check if role has ANY of the given permissions */
export async function hasAnyPermission(roleSlug: string, slugs: string[]): Promise<boolean> {
  await ensureCache()
  const perms = permissionCache.get(roleSlug)
  if (!perms) return false
  if (perms.has('wildcard-all')) return true
  return slugs.some((s) => perms.has(s))
}

/** Get all permission slugs for a role */
export async function getPermissionsForRole(roleSlug: string): Promise<string[]> {
  await ensureCache()
  const perms = permissionCache.get(roleSlug)
  if (!perms) return []
  if (perms.has('wildcard-all')) return ['*'] // signal to frontend that this is super admin
  return Array.from(perms)
}

/** Get all permissions for a user (by their role slug) */
export async function getUserPermissions(userRole: string): Promise<string[]> {
  // Also check UserRole table for additional roles
  const userRoles = await db.userRole.findMany({
    where: { user: { role: userRole } },
    include: { role: true },
  })
  await ensureCache()
  const allPerms = new Set<string>()
  const mainPerms = permissionCache.get(userRole)
  if (mainPerms) for (const p of mainPerms) allPerms.add(p)
  for (const ur of userRoles) {
    if (ur.role.status !== 'aktif') continue
    const rp = permissionCache.get(ur.role.slug)
    if (rp) for (const p of rp) allPerms.add(p)
  }
  if (allPerms.has('wildcard-all')) return ['*']
  return Array.from(allPerms)
}

/** Invalidate cache (after role/permission changes) */
export function invalidatePermissionCache() {
  cacheLoaded = false
  permissionCache.clear()
}

// ── API Route Helpers ──

interface AuthResult {
  user: JwtPayload
  req: NextRequest
}

/** Authenticate request — returns user or throws 401 */
export function authenticate(request: NextRequest): JwtPayload {
  const user = getUserFromRequest(request)
  if (!user) {
    throw new AuthError('Token tidak valid', 401)
  }
  return user
}

/** Require specific permission — call after authenticate() */
export async function requirePermission(user: JwtPayload, permissionSlug: string): Promise<void> {
  const ok = await hasPermission(user.role, permissionSlug)
  if (!ok) {
    throw new AuthError('Anda tidak memiliki akses untuk melakukan ini', 403)
  }
}

/** Require ANY of the listed permissions */
export async function requireAnyPermission(user: JwtPayload, slugs: string[]): Promise<void> {
  const ok = await hasAnyPermission(user.role, slugs)
  if (!ok) {
    throw new AuthError('Anda tidak memiliki akses untuk melakukan ini', 403)
  }
}

/** Check if user is super admin */
export function isSuperAdmin(user: JwtPayload): boolean {
  return user.role === 'super-admin'
}

/** Create audit log entry */
export async function createAuditLog(data: {
  user: string
  role: string
  aktivitas: string
  ip: string
  detail?: string
}) {
  try {
    await db.auditLog.create({
      data: {
        tanggal: new Date().toISOString().split('T')[0],
        ...data,
      },
    })
  } catch {
    // Audit log failure should not break the main flow
  }
}

/** Wrap an API handler with auth + permission + audit logging */
export function withAuth(permission?: string | string[]) {
  return function (handler: (request: NextRequest, ctx: AuthContext, ...args: unknown[]) => Promise<NextResponse>) {
    return async function (request: NextRequest, ...args: unknown[]) {
      try {
        const user = authenticate(request)

        if (permission) {
          if (Array.isArray(permission)) {
            await requireAnyPermission(user, permission)
          } else {
            await requirePermission(user, permission)
          }
        }

        // Inject request metadata
        const ctx = {
          user,
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        }

        return await handler(request, ctx, ...args)
      } catch (error: unknown) {
        if (error instanceof AuthError) {
          return NextResponse.json({ error: error.message }, { status: error.statusCode })
        }
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
        return NextResponse.json({ error: message }, { status: 500 })
      }
    }
  }
}

// ── Custom error class ──
export class AuthError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AuthError'
  }
}

// ── Exported context type for handlers ──
export interface AuthContext {
  user: JwtPayload
  ip: string
}
