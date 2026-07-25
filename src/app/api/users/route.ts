import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { authenticate, requirePermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'users')

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const role = url.searchParams.get('role') || ''
    const where: Record<string, unknown> = {}
    if (search) { where.OR = [{ nama: { contains: search } }, { username: { contains: search } }] }
    if (role) { where.role = role }
    const [data, total] = await Promise.all([
      db.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      db.user.count({ where }),
    ])
    const safeData = data.map(u => { const { password, ...rest } = u; return { ...rest, passwordText: (u as any).passwordText || '••••••••' } })
    return NextResponse.json({ data: safeData, total, page, limit })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'users')

    const body = await request.json()
    const { nama, username, password, role, email, noHP, nip, jabatan } = body
    if (!nama || !username || !password) return NextResponse.json({ error: 'Nama, username, dan password wajib diisi' }, { status: 400 })
    const existing = await db.user.findUnique({ where: { username } })
    if (existing) return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 })
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await db.user.create({
      data: { nama, username, password: hashedPassword, passwordText: password, role: role || 'guru', status: 'aktif', email: email || '', noHP: noHP || '', nip: nip || '', jabatan: jabatan || '' },
    })
    await createAuditLog({ user: user.nama, role: user.role, aktivitas: 'Tambah User', ip: request.headers.get('x-forwarded-for') || '', detail: `Menambahkan user ${username} (${role || 'guru'})` })
    const { password: _, ...safeUser } = newUser
    return NextResponse.json({ data: { ...safeUser, passwordText: password }, message: 'User berhasil ditambahkan' }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'users')

    const body = await request.json()
    const { id, nama, username, email, noHP, nip, jabatan, status, password } = body
    if (!id) return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    const updateData: Record<string, string> = {}
    if (nama) updateData.nama = nama
    if (email !== undefined) updateData.email = email
    if (noHP !== undefined) updateData.noHP = noHP
    if (nip !== undefined) updateData.nip = nip
    if (jabatan !== undefined) updateData.jabatan = jabatan
    if (status) updateData.status = status
    if (username && username !== existing.username) {
      const taken = await db.user.findFirst({ where: { username, id: { not: id } } })
      if (taken) return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 })
      updateData.username = username
    }
    if (password) { updateData.password = await bcrypt.hash(password, 10); updateData.passwordText = password }
    const updated = await db.user.update({ where: { id }, data: updateData })
    await createAuditLog({ user: user.nama, role: user.role, aktivitas: 'Edit User', ip: request.headers.get('x-forwarded-for') || '', detail: `Mengedit user ${existing.username}` })
    const { password: _, ...safeUser } = updated
    return NextResponse.json({ data: { ...safeUser, passwordText: updateData.passwordText || (existing as any).passwordText || '••••••••' }, message: 'User berhasil diperbarui' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'users')

    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    const target = await db.user.findUnique({ where: { id } })
    if (!target) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    if (target.role === 'admin') return NextResponse.json({ error: 'Tidak dapat menghapus admin' }, { status: 403 })
    if (target.id === user.userId) return NextResponse.json({ error: 'Tidak dapat menghapus akun sendiri' }, { status: 403 })
    await db.user.delete({ where: { id } })
    await createAuditLog({ user: user.nama, role: user.role, aktivitas: 'Hapus User', ip: request.headers.get('x-forwarded-for') || '', detail: `Menghapus user ${target.username}` })
    return NextResponse.json({ message: 'User berhasil dihapus' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
