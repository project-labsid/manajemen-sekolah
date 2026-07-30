import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'pengaturan')

    let setting = await db.settingSekolah.findFirst()

    if (!setting) {
      setting = await db.settingSekolah.create({ data: {} })
    }

    return NextResponse.json({ data: setting })
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
    await requirePermission(user, 'pengaturan')

    const body = await request.json()
    const {
      namaSekolah, logo, alamat, npsn, email, website, telepon,
      kepalaSekolah, nipKepalaSekolah, moto, visi, misi,
      semesterAktif, tahunAjaranAktif, tema, darkMode,
    } = body

    let setting = await db.settingSekolah.findFirst()

    if (!setting) {
      setting = await db.settingSekolah.create({
        data: {
          namaSekolah, logo, alamat, npsn, email, website, telepon,
          kepalaSekolah, nipKepalaSekolah, moto, visi, misi,
          semesterAktif, tahunAjaranAktif, tema, darkMode,
        },
      })
    } else {
      setting = await db.settingSekolah.update({
        where: { id: setting.id },
        data: {
          namaSekolah, logo, alamat, npsn, email, website, telepon,
          kepalaSekolah, nipKepalaSekolah, moto, visi, misi,
          semesterAktif, tahunAjaranAktif, tema, darkMode,
        },
      })
    }

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Update Pengaturan',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: 'Memperbarui pengaturan sekolah',
    })

    return NextResponse.json({ data: setting, message: 'Pengaturan berhasil disimpan' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
