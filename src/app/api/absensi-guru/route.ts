import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    const url = new URL(request.url)
    const tanggal = url.searchParams.get('tanggal') || new Date().toISOString().split('T')[0]
    const nama = url.searchParams.get('nama') || ''

    const where: Record<string, unknown> = { tanggal }
    if (nama) {
      where.namaGuru = { contains: nama }
    }

    const data = await db.absensiGuru.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data, tanggal })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    const body = await request.json()
    const { namaGuru, nip, latitude, longitude, alamat, browser, device, keterangan } = body

    if (!namaGuru) {
      return NextResponse.json({ error: 'Nama guru wajib diisi' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    const now = new Date()
    const jamMasuk = now.toTimeString().slice(0, 5)

    const existing = await db.absensiGuru.findFirst({
      where: { tanggal: today, nip: nip || '' },
    })

    if (existing) {
      return NextResponse.json({ error: 'Absensi masuk sudah tercatat hari ini' }, { status: 409 })
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''

    const absensi = await db.absensiGuru.create({
      data: {
        tanggal: today,
        namaGuru,
        nip: nip || '',
        jamMasuk,
        jamPulang: '',
        durasi: '',
        status: 'Hadir',
        latitude: latitude || '',
        longitude: longitude || '',
        alamat: alamat || '',
        browser: browser || '',
        device: device || '',
        ip,
        keterangan: keterangan || '',
      },
    })

    return NextResponse.json({ data: absensi, message: 'Absensi masuk berhasil dicatat' }, { status: 201 })
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

    const body = await request.json()
    const { id, keterangan } = body

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const existing = await db.absensiGuru.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Data absensi tidak ditemukan' }, { status: 404 })
    }

    if (existing.jamPulang) {
      return NextResponse.json({ error: 'Absensi pulang sudah tercatat' }, { status: 409 })
    }

    const now = new Date()
    const jamPulang = now.toTimeString().slice(0, 5)

    const jamMasukTime = new Date(`1970-01-01T${existing.jamMasuk}:00`)
    const jamPulangTime = new Date(`1970-01-01T${jamPulang}:00`)
    const diffMs = jamPulangTime.getTime() - jamMasukTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const durasi = `${diffHours} jam ${diffMinutes} menit`

    const absensi = await db.absensiGuru.update({
      where: { id },
      data: {
        jamPulang,
        durasi,
        keterangan: keterangan || existing.keterangan,
      },
    })

    return NextResponse.json({ data: absensi, message: 'Absensi pulang berhasil dicatat' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
