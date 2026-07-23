import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    let setting = await db.settingSekolah.findFirst()

    if (!setting) {
      setting = await db.settingSekolah.create({ data: {} })
    }

    return NextResponse.json({ data: setting })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }
    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

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

    return NextResponse.json({ data: setting, message: 'Pengaturan berhasil disimpan' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
