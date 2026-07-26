import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, requireAnyPermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'absensi-guru')

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
    await requireAnyPermission(user, ['absensi-guru:clock-in', 'absensi-guru'])

    const body = await request.json()
    const { namaGuru, nip, latitude, longitude, alamat, browser, device, keterangan, jamMasuk: clientJamMasuk, status: reqStatus } = body

    if (!namaGuru) {
      return NextResponse.json({ error: 'Nama guru wajib diisi' }, { status: 400 })
    }

    const status = reqStatus || 'Hadir'

    // Sakit/Izin requires mandatory keterangan
    if ((status === 'Sakit' || status === 'Izin') && !keterangan) {
      return NextResponse.json({ error: 'Keterangan wajib diisi untuk status Sakit/Izin' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    // Use client-provided time if available, otherwise use server time
    const jamMasuk = (status === 'Hadir') ? (clientJamMasuk || new Date().toTimeString().slice(0, 5)) : ''

    const existing = await db.absensiGuru.findFirst({
      where: { tanggal: today, nip: nip || '' },
    })

    if (existing) {
      return NextResponse.json({ error: 'Absensi sudah tercatat hari ini' }, { status: 409 })
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
        status,
        latitude: latitude || '',
        longitude: longitude || '',
        alamat: alamat || '',
        browser: browser || '',
        device: device || '',
        ip,
        keterangan: keterangan || '',
      },
    })

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: `Absen Guru: ${status}`,
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Absensi guru: ${namaGuru}, status: ${status}`,
    })

    return NextResponse.json({ data: absensi, message: `Absensi ${status.toLowerCase()} berhasil dicatat` }, { status: 201 })
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
    await requireAnyPermission(user, ['absensi-guru:clock-out', 'absensi-guru'])

    const body = await request.json()
    const { id, keterangan, jamPulang: clientJamPulang } = body

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

    // Use client-provided time if available, otherwise use server time
    const jamPulang = clientJamPulang || new Date().toTimeString().slice(0, 5)

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

    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Clock Out Guru',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Clock out absensi guru: ${existing.namaGuru}`,
    })

    return NextResponse.json({ data: absensi, message: 'Absensi pulang berhasil dicatat' })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
