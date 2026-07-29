import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requirePermission, requireAnyPermission, createAuditLog, initAuth, AuthError } from '@/lib/rbac'
import { db } from '@/lib/db'

// Staff roles that can do attendance (exclude siswa and orang-tua)
const STAFF_ROLES = [
  'super-admin', 'admin', 'kepala-sekolah', 'wakil-kepala-sekolah',
  'kurikulum', 'tata-usaha', 'operator', 'guru', 'wali-kelas',
]

// Roles that can see rekap (all staff attendance)
const REKAP_VIEWER_ROLES = ['super-admin', 'admin', 'kepala-sekolah', 'wakil-kepala-sekolah']

export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)
    await requirePermission(user, 'absensi-guru')

    const url = new URL(request.url)
    const tanggal = url.searchParams.get('tanggal') || new Date().toISOString().split('T')[0]
    const nama = url.searchParams.get('nama') || ''

    const isRekapViewer = REKAP_VIEWER_ROLES.includes(user.role)

    // Fetch existing attendance records for that date
    const where: Record<string, unknown> = { tanggal }
    if (nama) {
      where.namaGuru = { contains: nama }
    }

    if (isRekapViewer) {
      // Admin/rekap viewer: get ALL staff users merged with attendance
      const [staffUsers, attendanceRecords] = await Promise.all([
        // Get all active staff users (exclude siswa and orang-tua)
        db.user.findMany({
          where: {
            role: { in: STAFF_ROLES },
            status: 'aktif',
            ...(nama ? { nama: { contains: nama } } : {}),
          },
          orderBy: { nama: 'asc' },
          select: { id: true, nama: true, username: true, nip: true, jabatan: true, role: true },
        }),
        // Get attendance records for that date
        db.absensiGuru.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        }),
      ])

      // Build maps for flexible matching: by NIP, by nama, by username
      const attendanceByNip = new Map<string, typeof attendanceRecords[0]>()
      const attendanceByNama = new Map<string, typeof attendanceRecords[0]>()
      for (const record of attendanceRecords) {
        if (record.nip) attendanceByNip.set(record.nip, record)
        attendanceByNama.set(record.namaGuru, record)
      }

      // Track which attendance IDs have been matched
      const matchedIds = new Set<string>()

      // Merge: for each staff user, find their attendance record
      const mergedData: Record<string, unknown>[] = staffUsers.map((su) => {
        // Try matching by NIP first, then by nama, then by username
        let attendance = su.nip ? attendanceByNip.get(su.nip) : null
        if (!attendance) attendance = attendanceByNama.get(su.nama)
        if (!attendance && su.username) attendance = attendanceByNip.get(su.username)

        if (attendance) {
          matchedIds.add(attendance.id)
          return { ...attendance, roleUser: su.role, jabatanUser: su.jabatan }
        }
        // No attendance record → Tidak Hadir
        return {
          id: `pending-${su.id}`,
          tanggal,
          namaGuru: su.nama,
          nip: su.nip || su.username || '',
          jamMasuk: '',
          jamPulang: '',
          durasi: '',
          status: 'Tidak Hadir',
          latitude: '',
          longitude: '',
          alamat: '',
          browser: '',
          device: '',
          ip: '',
          keterangan: '',
          createdAt: new Date().toISOString(),
          roleUser: su.role,
          jabatanUser: su.jabatan,
        }
      })

      // Also include attendance records not yet matched (from names not in the User table)
      for (const record of attendanceRecords) {
        if (!matchedIds.has(record.id)) {
          mergedData.push({ ...record, roleUser: '', jabatanUser: '' })
        }
      }

      return NextResponse.json({ data: mergedData, tanggal, isRekap: true })
    } else {
      // Non-admin staff: only show own records
      const data = await db.absensiGuru.findMany({
        where: { ...where, namaGuru: user.nama },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ data, tanggal, isRekap: false })
    }
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
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 })
    }

    const status = reqStatus || 'Hadir'

    // Sakit/Izin requires mandatory keterangan
    if ((status === 'Sakit' || status === 'Izin') && !keterangan) {
      return NextResponse.json({ error: 'Keterangan wajib diisi untuk status Sakit/Izin' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    // Use client-provided time if available, otherwise use server time
    const jamMasuk = (status === 'Hadir') ? (clientJamMasuk || new Date().toTimeString().slice(0, 5)) : ''

    // Check for duplicate: same date + (NIP if provided, or nama)
    const existingWhere: Record<string, unknown> = { tanggal: today }
    if (nip) {
      existingWhere.nip = nip
    } else {
      existingWhere.namaGuru = namaGuru
    }
    const existing = await db.absensiGuru.findFirst({ where: existingWhere })

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
      aktivitas: `Absen: ${status}`,
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Absensi: ${namaGuru} (${user.roleName || user.role}), status: ${status}`,
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
      aktivitas: 'Clock Out',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Clock out absensi: ${existing.namaGuru}`,
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
