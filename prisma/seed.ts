import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

// ── Permission definitions ──
const PERMISSIONS = [
  // Dashboard
  { slug: 'dashboard', nama: 'Dashboard', kategori: 'dashboard' },

  // Manajemen User & Role
  { slug: 'users', nama: 'Data User', kategori: 'users' },
  { slug: 'roles', nama: 'Manajemen Role', kategori: 'users' },
  { slug: 'permissions', nama: 'Manajemen Permission', kategori: 'users' },
  { slug: 'riwayat-login', nama: 'Riwayat Login', kategori: 'users' },

  // Data Master
  { slug: 'guru', nama: 'Data Guru', kategori: 'master' },
  { slug: 'guru:delete', nama: 'Hapus Guru', kategori: 'master' },
  { slug: 'siswa', nama: 'Data Siswa', kategori: 'master' },
  { slug: 'kelas', nama: 'Data Kelas', kategori: 'master' },
  { slug: 'mapel', nama: 'Mata Pelajaran', kategori: 'master' },
  { slug: 'tahun-ajaran', nama: 'Tahun Ajaran', kategori: 'master' },
  { slug: 'semester', nama: 'Semester', kategori: 'master' },

  // Nilai
  { slug: 'nilai', nama: 'Input Nilai', kategori: 'nilai' },
  { slug: 'nilai:edit', nama: 'Edit Nilai', kategori: 'nilai' },
  { slug: 'nilai:import', nama: 'Import Nilai', kategori: 'nilai' },
  { slug: 'nilai:export', nama: 'Export Nilai', kategori: 'nilai' },
  { slug: 'rekap-nilai', nama: 'Rekap Nilai', kategori: 'nilai' },

  // Absensi
  { slug: 'absensi-guru', nama: 'Absensi Guru', kategori: 'absensi' },
  { slug: 'absensi-guru:clock-in', nama: 'Absen Masuk', kategori: 'absensi' },
  { slug: 'absensi-guru:clock-out', nama: 'Absen Pulang', kategori: 'absensi' },
  { slug: 'absensi-siswa', nama: 'Absensi Siswa', kategori: 'absensi' },

  // Pengumuman
  { slug: 'pengumuman', nama: 'Lihat Pengumuman', kategori: 'pengumuman' },
  { slug: 'pengumuman:manage', nama: 'Kelola Pengumuman', kategori: 'pengumuman' },

  // Laporan
  { slug: 'laporan', nama: 'Laporan', kategori: 'laporan' },
  { slug: 'laporan:export', nama: 'Export Laporan', kategori: 'laporan' },

  // Sistem
  { slug: 'audit-log', nama: 'Audit Log', kategori: 'sistem' },
  { slug: 'backup', nama: 'Backup', kategori: 'sistem' },
  { slug: 'restore', nama: 'Restore', kategori: 'sistem' },
  { slug: 'pengaturan', nama: 'Pengaturan', kategori: 'sistem' },
  { slug: 'manajemen-sekolah', nama: 'Manajemen Sekolah', kategori: 'sistem' },

  // Profil (everyone)
  { slug: 'profil', nama: 'Profil', kategori: 'profil' },

  // Import/Export data
  { slug: 'import-data', nama: 'Import Data', kategori: 'data' },
  { slug: 'export-data', nama: 'Export Data', kategori: 'data' },
  { slug: 'cetak-dokumen', nama: 'Cetak Dokumen', kategori: 'data' },

  // Wildcard for super admin (not a real permission, used as sentinel)
  { slug: 'wildcard-all', nama: 'Akses Penuh (Super Admin)', kategori: 'sistem' },
]

// ── Role definitions with their permissions ──
const ROLES: { slug: string; nama: string; deskripsi: string; permissions: string[] }[] = [
  {
    slug: 'super-admin',
    nama: 'Super Admin',
    deskripsi: 'Akses penuh terhadap seluruh sistem',
    permissions: ['*'],
  },
  {
    slug: 'admin',
    nama: 'Admin Sekolah',
    deskripsi: 'Mengelola seluruh operasional sekolah',
    permissions: [
      'dashboard', 'users', 'riwayat-login',
      'guru', 'siswa', 'kelas', 'mapel', 'tahun-ajaran', 'semester',
      'nilai', 'nilai:edit', 'nilai:import', 'nilai:export', 'rekap-nilai',
      'absensi-guru', 'absensi-siswa',
      'pengumuman', 'pengumuman:manage',
      'laporan', 'laporan:export',
      'backup', 'restore', 'pengaturan', 'manajemen-sekolah',
      'import-data', 'export-data', 'cetak-dokumen',
      'profil',
    ],
  },
  {
    slug: 'operator',
    nama: 'Operator Sekolah',
    deskripsi: 'Membantu administrasi sekolah',
    permissions: [
      'dashboard',
      'guru', 'siswa',
      'import-data', 'export-data',
      'pengumuman', 'pengumuman:manage',
      'laporan', 'laporan:export',
      'profil',
    ],
  },
  {
    slug: 'kepala-sekolah',
    nama: 'Kepala Sekolah',
    deskripsi: 'Monitoring dan persetujuan',
    permissions: [
      'dashboard',
      'guru', 'siswa', 'nilai',
      'rekap-nilai',
      'absensi-guru', 'absensi-siswa',
      'pengumuman',
      'laporan', 'laporan:export', 'cetak-dokumen',
      'profil',
    ],
  },
  {
    slug: 'wakil-kepala-sekolah',
    nama: 'Wakil Kepala Sekolah',
    deskripsi: 'Supervisi akademik',
    permissions: [
      'dashboard',
      'guru', 'siswa', 'nilai',
      'rekap-nilai',
      'absensi-guru', 'absensi-siswa',
      'pengumuman', 'pengumuman:manage',
      'laporan', 'laporan:export', 'cetak-dokumen',
      'profil',
    ],
  },
  {
    slug: 'tata-usaha',
    nama: 'Tata Usaha',
    deskripsi: 'Mengelola administrasi sekolah',
    permissions: [
      'dashboard',
      'guru', 'siswa',
      'import-data', 'export-data', 'cetak-dokumen',
      'pengumuman', 'pengumuman:manage',
      'profil',
    ],
  },
  {
    slug: 'guru',
    nama: 'Guru',
    deskripsi: 'Guru mengajar',
    permissions: [
      'dashboard',
      'absensi-guru', 'absensi-guru:clock-in', 'absensi-guru:clock-out',
      'absensi-siswa',
      'nilai', 'nilai:edit', 'nilai:import', 'nilai:export',
      'rekap-nilai',
      'pengumuman',
      'profil',
    ],
  },
  {
    slug: 'wali-kelas',
    nama: 'Wali Kelas',
    deskripsi: 'Guru dengan hak tambahan wali kelas',
    permissions: [
      'dashboard',
      'absensi-guru', 'absensi-guru:clock-in', 'absensi-guru:clock-out',
      'absensi-siswa',
      'nilai', 'nilai:edit', 'nilai:import', 'nilai:export',
      'rekap-nilai',
      'pengumuman',
      'cetak-dokumen',
      'profil',
    ],
  },
  {
    slug: 'siswa',
    nama: 'Siswa',
    deskripsi: 'Siswa (opsional)',
    permissions: [
      'dashboard', 'nilai', 'absensi-siswa', 'pengumuman', 'profil',
    ],
  },
  {
    slug: 'orang-tua',
    nama: 'Orang Tua',
    deskripsi: 'Orang Tua (opsional)',
    permissions: [
      'dashboard', 'nilai', 'absensi-siswa', 'pengumuman', 'profil',
    ],
  },
]

async function main() {
  console.log('Seeding...')

  // Clear existing data
  await db.rolePermission.deleteMany()
  await db.userRole.deleteMany()
  await db.auditLog.deleteMany()
  await db.riwayatLogin.deleteMany()
  await db.backup.deleteMany()
  await db.jurnalMengajar.deleteMany()
  await db.alumni.deleteMany()
  await db.absensiSiswa.deleteMany()
  await db.absensiGuru.deleteMany()
  await db.nilai.deleteMany()
  await db.pengumuman.deleteMany()
  await db.user.deleteMany()
  await db.guru.deleteMany()
  await db.siswa.deleteMany()
  await db.mataPelajaran.deleteMany()
  await db.kelas.deleteMany()
  await db.semester.deleteMany()
  await db.tahunAjaran.deleteMany()
  await db.rolePermission.deleteMany()
  await db.permission.deleteMany()
  await db.role.deleteMany()

  // 1. Create permissions
  for (const p of PERMISSIONS) {
    await db.permission.upsert({
      where: { slug: p.slug },
      update: { nama: p.nama, kategori: p.kategori },
      create: p,
    })
  }
  console.log(`Created ${PERMISSIONS.length} permissions`)

  // 2. Create roles + link permissions
  for (const r of ROLES) {
    const role = await db.role.upsert({
      where: { slug: r.slug },
      update: { nama: r.nama, deskripsi: r.deskripsi },
      create: { slug: r.slug, nama: r.nama, deskripsi: r.deskripsi },
    })

    for (const ps of r.permissions) {
      if (ps === '*') {
        // Super admin gets the wildcard permission
        const wildcardPerm = await db.permission.findUnique({ where: { slug: 'wildcard-all' } })
        if (wildcardPerm) {
          await db.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: role.id, permissionId: wildcardPerm.id } },
            update: {},
            create: { roleId: role.id, permissionId: wildcardPerm.id },
          })
        }
        continue
      }
      const perm = await db.permission.findUnique({ where: { slug: ps } })
      if (perm) {
        await db.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        })
      }
    }
  }
  console.log(`Created ${ROLES.length} roles`)

  // 3. Create users
  const hashPw = (pw: string) => bcrypt.hashSync(pw, 10)

  const adminUser = await db.user.create({
    data: {
      nama: 'Super Admin',
      username: 'admin',
      password: hashPw('admin123'),
      passwordText: 'admin123',
      role: 'super-admin',
      email: 'admin@tuweri.sch.id',
      noHP: '081234567890',
      nip: '000000000',
      jabatan: 'Super Administrator',
    },
  })
  // Link super-admin role
  const saRole = await db.role.findUnique({ where: { slug: 'super-admin' } })
  if (saRole) {
    await db.userRole.create({
      data: { userId: adminUser.id, roleId: saRole.id },
    })
  }

  // Create sample users for each role
  const sampleUsers = [
    { nama: 'Budi Santoso', username: 'adminsekolah', pw: 'admin123', role: 'admin', nip: '198501012010011001', jabatan: 'Admin Sekolah' },
    { nama: 'Siti Aminah', username: 'operator', pw: 'operator123', role: 'operator', nip: '199001012015002001', jabatan: 'Operator' },
    { nama: 'Drs. Ahmad Hidayat, M.Pd', username: 'kepsek', pw: 'kepsek123', role: 'kepala-sekolah', nip: '197501012003121001', jabatan: 'Kepala Sekolah' },
    { nama: 'Ir. Rahmawati, M.Pd', username: 'wakasek', pw: 'wakasek123', role: 'wakil-kepala-sekolah', nip: '198001012005012001', jabatan: 'Wakil Kepala Sekolah' },
    { nama: 'Dewi Lestari', username: 'tu', pw: 'tu123', role: 'tata-usaha', nip: '199201012018002002', jabatan: 'Tata Usaha' },
    { nama: 'Ahmad Fauzi, S.Pd', username: 'ahmad', pw: 'guru123', role: 'guru', nip: '199001012015011001', jabatan: 'Guru Matematika' },
    { nama: 'Sri Wahyuni, S.Pd', username: 'sri', pw: 'guru123', role: 'wali-kelas', nip: '199201012020012002', jabatan: 'Guru / Wali Kelas' },
  ]

  for (const su of sampleUsers) {
    const u = await db.user.create({
      data: {
        nama: su.nama,
        username: su.username,
        password: hashPw(su.pw),
        passwordText: su.pw,
        role: su.role,
        nip: su.nip,
        jabatan: su.jabatan,
      },
    })
    // Link role
    const r = await db.role.findUnique({ where: { slug: su.role } })
    if (r) {
      await db.userRole.create({ data: { userId: u.id, roleId: r.id } })
    }
  }

  // 4. Create guru data
  const guruData = [
    { nip: '199001012015011001', nama: 'Ahmad Fauzi, S.Pd', mapel: 'Matematika', jenisKelamin: 'Laki-laki' },
    { nip: '199201012020012002', nama: 'Sri Wahyuni, S.Pd', mapel: 'Bahasa Indonesia', jenisKelamin: 'Perempuan' },
    { nip: '198803152010011003', nama: 'Bambang Irawan, M.Pd', mapel: 'Fisika', jenisKelamin: 'Laki-laki' },
    { nip: '199105202018012004', nama: 'Rina Susanti, S.Pd', mapel: 'Kimia', jenisKelamin: 'Perempuan' },
    { nip: '198706102009011005', nama: 'Hendra Wijaya, S.Si', mapel: 'Biologi', jenisKelamin: 'Laki-laki' },
    { nip: '199302152019012006', nama: 'Diana Putri, S.Pd', mapel: 'Bahasa Inggris', jenisKelamin: 'Perempuan' },
    { nip: '198511202008011007', nama: 'Agus Supriyadi, S.Pd', mapel: 'Sejarah', jenisKelamin: 'Laki-laki' },
    { nip: '199408252020012008', nama: 'Fitri Handayani, S.Pd', mapel: 'Ekonomi', jenisKelamin: 'Perempuan' },
    { nip: '198912302010011009', nama: 'Rudi Hartono, S.Pd', mapel: 'Geografi', jenisKelamin: 'Laki-laki' },
    { nip: '199505102021012010', nama: 'Lestari Ningrum, S.Pd', mapel: 'Sosiologi', jenisKelamin: 'Perempuan' },
    { nip: '198607152011011011', nama: 'Wahyu Prasetyo, S.Kom', mapel: 'Informatika', jenisKelamin: 'Laki-laki' },
    { nip: '199212202019012012', nama: 'Anita Sari, S.Pd', mapel: 'PKN', jenisKelamin: 'Perempuan' },
    { nip: '198410052007011013', nama: 'Darmawan, M.Pd', mapel: 'Seni Budaya', jenisKelamin: 'Laki-laki' },
    { nip: '199603012022012014', nama: 'Mega Silvia, S.Pd', mapel: 'PJOK', jenisKelamin: 'Perempuan' },
    { nip: '198908172012011015', nama: 'Fajar Nugroho, S.Ag', mapel: 'PAI', jenisKelamin: 'Laki-laki' },
  ]
  for (const g of guruData) {
    await db.guru.upsert({
      where: { nip: g.nip },
      update: g,
      create: g,
    })
  }

  // 5. Create kelas
  const kelasData = [
    { kodeKelas: '10A', namaKelas: 'X-A', waliKelas: 'Sri Wahyuni, S.Pd' },
    { kodeKelas: '10B', namaKelas: 'X-B', waliKelas: '' },
    { kodeKelas: '11A', namaKelas: 'XI-A', waliKelas: '' },
    { kodeKelas: '11B', namaKelas: 'XI-B', waliKelas: '' },
    { kodeKelas: '12A', namaKelas: 'XII-A', waliKelas: '' },
    { kodeKelas: '12B', namaKelas: 'XII-B', waliKelas: '' },
  ]
  for (const k of kelasData) {
    await db.kelas.upsert({ where: { kodeKelas: k.kodeKelas }, update: k, create: k })
  }

  // 6. Create mapel
  const mapelData = [
    { kodeMapel: 'MTK', namaMapel: 'Matematika', kkm: 75, guru: 'Ahmad Fauzi, S.Pd' },
    { kodeMapel: 'BIN', namaMapel: 'Bahasa Indonesia', kkm: 75, guru: 'Sri Wahyuni, S.Pd' },
    { kodeMapel: 'FIS', namaMapel: 'Fisika', kkm: 75, guru: 'Bambang Irawan, M.Pd' },
    { kodeMapel: 'KIM', namaMapel: 'Kimia', kkm: 75, guru: 'Rina Susanti, S.Pd' },
    { kodeMapel: 'BIO', namaMapel: 'Biologi', kkm: 75, guru: 'Hendra Wijaya, S.Si' },
    { kodeMapel: 'BIG', namaMapel: 'Bahasa Inggris', kkm: 75, guru: 'Diana Putri, S.Pd' },
    { kodeMapel: 'SEJ', namaMapel: 'Sejarah', kkm: 75, guru: 'Agus Supriyadi, S.Pd' },
    { kodeMapel: 'EKO', namaMapel: 'Ekonomi', kkm: 75, guru: 'Fitri Handayani, S.Pd' },
    { kodeMapel: 'GEO', namaMapel: 'Geografi', kkm: 75, guru: 'Rudi Hartono, S.Pd' },
    { kodeMapel: 'SOS', namaMapel: 'Sosiologi', kkm: 75, guru: 'Lestari Ningrum, S.Pd' },
    { kodeMapel: 'INF', namaMapel: 'Informatika', kkm: 75, guru: 'Wahyu Prasetyo, S.Kom' },
    { kodeMapel: 'PKN', namaMapel: 'PKN', kkm: 75, guru: 'Anita Sari, S.Pd' },
  ]
  for (const m of mapelData) {
    await db.mataPelajaran.upsert({ where: { kodeMapel: m.kodeMapel }, update: m, create: m })
  }

  // 7. Create siswa (4 per kelas)
  const namaSiswa = [
    'Andi Pratama', 'Budi Setiawan', 'Citra Dewi', 'Dian Permata',
    'Eko Saputra', 'Fani Oktavia', 'Gilang Ramadhan', 'Hani Mulyani',
    'Irfan Hakim', 'Joko Widodo', 'Kartika Sari', 'Lina Marlina',
    'Muhammad Rizki', 'Nur Aini', 'Oscar Pratama', 'Putri Amelia',
    'Qori Ananda', 'Rizky Aditya', 'Sinta Maharani', 'Taufik Hidayat',
    'Umar Faruq', 'Vina Oktaviani', 'Wahyu Setiabudi', 'Yuni Astuti',
  ]
  let siswaIdx = 0
  for (const k of kelasData) {
    for (let i = 0; i < 4; i++) {
      if (siswaIdx >= namaSiswa.length) break
      const nis = `2024${String(siswaIdx + 1).padStart(4, '0')}`
      await db.siswa.create({
        data: {
          nis,
          nama: namaSiswa[siswaIdx],
          kelas: k.kodeKelas,
        },
      })
      siswaIdx++
    }
  }

  // 8. Create tahun ajaran + semester
  await db.tahunAjaran.upsert({ where: { nama: '2024/2025' }, update: { status: 'aktif' }, create: { nama: '2024/2025', status: 'aktif' } })
  await db.tahunAjaran.upsert({ where: { nama: '2023/2024' }, update: { status: 'tidak' }, create: { nama: '2023/2024', status: 'tidak' } })
  await db.semester.upsert({ where: { semester: 'Ganjil' }, update: { status: 'tidak' }, create: { semester: 'Ganjil', status: 'tidak' } })
  await db.semester.upsert({ where: { semester: 'Genap' }, update: { status: 'aktif' }, create: { semester: 'Genap', status: 'aktif' } })

  // 9. Create sample pengumuman
  await db.pengumuman.create({
    data: {
      judul: 'Libur Hari Kemerdekaan',
      isi: 'Diberitahukan bahwa tanggal 17 Agustus 2025 libur nasional dalam rangka memperingati Hari Kemerdekaan RI ke-80.',
      tanggal: '2025-08-15',
    },
  })
  await db.pengumuman.create({
    data: {
      judul: 'Ujian Tengah Semester Ganjil',
      isi: 'UTS Ganjil akan dilaksanakan pada tanggal 6-11 Oktober 2025. Semua siswa diwajibkan hadir.',
      tanggal: '2025-09-25',
    },
  })

  console.log('Seed completed!')
  console.log('Super Admin: admin / admin123')
  console.log('Admin Sekolah: adminsekolah / admin123')
  console.log('Kepala Sekolah: kepsek / kepsek123')
  console.log('Guru: ahmad / guru123')
  console.log('Wali Kelas: sri / guru123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
