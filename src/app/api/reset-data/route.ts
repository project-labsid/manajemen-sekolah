import { NextRequest, NextResponse } from 'next/server'
import { authenticate, createAuditLog, initAuth, AuthError, isSuperAdmin } from '@/lib/rbac'
import { db } from '@/lib/db'

/**
 * DELETE /api/reset-data
 * Super Admin only — resets all transactional data.
 * Keeps: Role, Permission, RolePermission, UserRole (for super-admin),
 *        User (super-admin only), SettingSekolah
 * Deletes everything else.
 */
export async function DELETE(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)

    if (!isSuperAdmin(user)) {
      return NextResponse.json({ error: 'Hanya Super Admin yang dapat mereset data' }, { status: 403 })
    }

    // Collect super-admin user IDs to preserve them
    const superAdmins = await db.user.findMany({
      where: { role: 'super-admin' },
      select: { id: true },
    })
    const superAdminIds = superAdmins.map((u) => u.id)

    // Delete in dependency order (children first)
    const deleteOps: Promise<unknown>[] = [
      // Audit & login history
      db.auditLog.deleteMany(),
      db.riwayatLogin.deleteMany(),

      // Attendance
      db.absensiGuru.deleteMany(),
      db.absensiSiswa.deleteMany(),

      // Grades
      db.nilai.deleteMany(),

      // Teaching journals
      db.jurnalMengajar.deleteMany(),

      // Announcements
      db.pengumuman.deleteMany(),

      // Backups
      db.backup.deleteMany(),

      // Alumni
      db.alumni.deleteMany(),

      // Students
      db.siswa.deleteMany(),

      // Teachers
      db.guru.deleteMany(),

      // Classes
      db.kelas.deleteMany(),

      // Subjects
      db.mataPelajaran.deleteMany(),

      // Academic year / semester
      db.tahunAjaran.deleteMany(),
      db.semester.deleteMany(),

      // Delete UserRole entries for non-super-admin users
      db.userRole.deleteMany({
        where: { userId: { not: { in: superAdminIds } } },
      }),

      // Delete all non-super-admin users
      db.user.deleteMany({
        where: { id: { not: { in: superAdminIds } } },
      }),
    ]

    await Promise.all(deleteOps)

    // Log the reset action
    await createAuditLog({
      user: user.nama,
      role: user.role,
      aktivitas: 'Reset Data Semua',
      ip: request.headers.get('x-forwarded-for') || '',
      detail: `Super Admin ${user.nama} melakukan reset seluruh data. Data sistem (roles, permissions, super admin) dipertahankan.`,
    })

    return NextResponse.json({
      message: 'Semua data berhasil direset. Data sistem (roles, permissions, super admin) dipertahankan.',
      preserved: {
        superAdminCount: superAdminIds.length,
        roles: 'dipertahankan',
        permissions: 'dipertahankan',
        settingSekolah: 'dipertahankan',
      },
    })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * GET /api/reset-data
 * Super Admin only — returns summary of what would be reset.
 */
export async function GET(request: NextRequest) {
  try {
    await initAuth()
    const user = authenticate(request)

    if (!isSuperAdmin(user)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const [
      totalUsers,
      totalSiswa,
      totalGuru,
      totalKelas,
      totalMapel,
      totalNilai,
      totalAbsensiGuru,
      totalAbsensiSiswa,
      totalPengumuman,
      totalAuditLog,
      totalJurnalMengajar,
      totalAlumni,
      totalRiwayatLogin,
      totalBackup,
      totalTahunAjaran,
      totalSemester,
      superAdminCount,
    ] = await Promise.all([
      db.user.count(),
      db.siswa.count(),
      db.guru.count(),
      db.kelas.count(),
      db.mataPelajaran.count(),
      db.nilai.count(),
      db.absensiGuru.count(),
      db.absensiSiswa.count(),
      db.pengumuman.count(),
      db.auditLog.count(),
      db.jurnalMengajar.count(),
      db.alumni.count(),
      db.riwayatLogin.count(),
      db.backup.count(),
      db.tahunAjaran.count(),
      db.semester.count(),
      db.user.count({ where: { role: 'super-admin' } }),
    ])

    return NextResponse.json({
      summary: {
        users: totalUsers,
        siswa: totalSiswa,
        guru: totalGuru,
        kelas: totalKelas,
        mataPelajaran: totalMapel,
        nilai: totalNilai,
        absensiGuru: totalAbsensiGuru,
        absensiSiswa: totalAbsensiSiswa,
        pengumuman: totalPengumuman,
        auditLog: totalAuditLog,
        jurnalMengajar: totalJurnalMengajar,
        alumni: totalAlumni,
        riwayatLogin: totalRiwayatLogin,
        backup: totalBackup,
        tahunAjaran: totalTahunAjaran,
        semester: totalSemester,
      },
      preserved: {
        superAdminCount,
        roles: 'dipertahankan',
        permissions: 'dipertahankan',
        settingSekolah: 'dipertahankan',
      },
    })
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
