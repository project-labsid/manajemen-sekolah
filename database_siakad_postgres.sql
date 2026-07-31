-- SettingSekolah
CREATE TABLE "SettingSekolah" (
  "id" TEXT PRIMARY KEY,
  "namaSekolah" TEXT DEFAULT 'MIS AL ASY''ARIYAH',
  "logo" TEXT DEFAULT '',
  "alamat" TEXT DEFAULT '',
  "npsn" TEXT DEFAULT '',
  "email" TEXT DEFAULT '',
  "website" TEXT DEFAULT '',
  "telepon" TEXT DEFAULT '',
  "kepalaSekolah" TEXT DEFAULT '',
  "nipKepalaSekolah" TEXT DEFAULT '',
  "motto" TEXT DEFAULT '',
  "visi" TEXT DEFAULT '',
  "misi" TEXT DEFAULT '',
  "semesterAktif" TEXT DEFAULT 'Genap',
  "tahunAjaranAktif" TEXT DEFAULT '2024/2025',
  "tema" TEXT DEFAULT 'light',
  "darkMode" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) DEFAULT NOW()
);
INSERT INTO "SettingSekolah" ("id", "namaSekolah", "semesterAktif", "tahunAjaranAktif", "tema", "darkMode") VALUES
('seed-setting-001', 'MIS AL ASY''ARIYAH', 'Genap', '2024/2025', 'light', FALSE);

-- Role
CREATE TABLE "Role" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT UNIQUE,
  "nama" TEXT NOT NULL,
  "deskripsi" TEXT DEFAULT '',
  "status" TEXT DEFAULT 'aktif',
  "createdAt" TIMESTAMP(3) DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) DEFAULT NOW()
);
INSERT INTO "Role" ("id", "slug", "nama", "deskripsi") VALUES
('role-001', 'super-admin', 'Super Admin', 'Akses penuh terhadap seluruh sistem'),
('role-002', 'admin', 'Admin Sekolah', 'Mengelola seluruh operasional sekolah'),
('role-003', 'operator', 'Operator Sekolah', 'Membantu administrasi sekolah'),
('role-004', 'kepala-sekolah', 'Kepala Sekolah', 'Monitoring dan persetujuan'),
('role-005', 'wakil-kepala-sekolah', 'Wakil Kepala Sekolah', 'Supervisi akademik'),
('role-006', 'tata-usaha', 'Tata Usaha', 'Mengelola administrasi sekolah'),
('role-007', 'guru', 'Guru', 'Guru mengajar'),
('role-008', 'wali-kelas', 'Wali Kelas', 'Guru dengan hak tambahan wali kelas'),
('role-009', 'siswa', 'Siswa', 'Siswa (opsional)'),
('role-010', 'orang-tua', 'Orang Tua', 'Orang Tua (opsional)');

-- Permission
CREATE TABLE "Permission" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT UNIQUE,
  "nama" TEXT NOT NULL,
  "kategori" TEXT DEFAULT 'umum',
  "status" TEXT DEFAULT 'aktif',
  "createdAt" TIMESTAMP(3) DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) DEFAULT NOW()
);
INSERT INTO "Permission" ("id", "slug", "nama", "kategori") VALUES
('perm-001', 'dashboard', 'Dashboard', 'dashboard'),
('perm-002', 'users', 'Data User', 'users'),
('perm-003', 'roles', 'Manajemen Role', 'users'),
('perm-004', 'permissions', 'Manajemen Permission', 'users'),
('perm-005', 'riwayat-login', 'Riwayat Login', 'users'),
('perm-006', 'guru', 'Data Guru', 'master'),
('perm-007', 'guru:delete', 'Hapus Guru', 'master'),
('perm-008', 'siswa', 'Data Siswa', 'master'),
('perm-009', 'kelas', 'Data Kelas', 'master'),
('perm-010', 'mapel', 'Mata Pelajaran', 'master'),
('perm-011', 'tahun-ajaran', 'Tahun Ajaran', 'master'),
('perm-012', 'semester', 'Semester', 'master'),
('perm-013', 'nilai', 'Input Nilai', 'nilai'),
('perm-014', 'nilai:edit', 'Edit Nilai', 'nilai'),
('perm-015', 'nilai:import', 'Import Nilai', 'nilai'),
('perm-016', 'nilai:export', 'Export Nilai', 'nilai'),
('perm-017', 'rekap-nilai', 'Rekap Nilai', 'nilai'),
('perm-018', 'absensi-guru', 'Absensi Guru', 'absensi'),
('perm-019', 'absensi-guru:clock-in', 'Absen Masuk', 'absensi'),
('perm-020', 'absensi-guru:clock-out', 'Absen Pulang', 'absensi'),
('perm-021', 'absensi-siswa', 'Absensi Siswa', 'absensi'),
('perm-022', 'pengumuman', 'Lihat Pengumuman', 'pengumuman'),
('perm-023', 'pengumuman:manage', 'Kelola Pengumuman', 'pengumuman'),
('perm-024', 'laporan', 'Laporan', 'laporan'),
('perm-025', 'laporan:export', 'Export Laporan', 'laporan'),
('perm-026', 'audit-log', 'Audit Log', 'sistem'),
('perm-027', 'backup', 'Backup', 'sistem'),
('perm-028', 'restore', 'Restore', 'sistem'),
('perm-029', 'pengaturan', 'Pengaturan', 'sistem'),
('perm-030', 'manajemen-sekolah', 'Manajemen Sekolah', 'sistem'),
('perm-031', 'profil', 'Profil', 'profil'),
('perm-032', 'import-data', 'Import Data', 'data'),
('perm-033', 'export-data', 'Export Data', 'data'),
('perm-034', 'cetak-dokumen', 'Cetak Dokumen', 'data'),
('perm-035', 'wildcard-all', 'Akses Penuh (Super Admin)', 'sistem');

-- RolePermission
CREATE TABLE "RolePermission" (
  "id" TEXT PRIMARY KEY,
  "roleId" TEXT NOT NULL,
  "permissionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT NOW(),
  CONSTRAINT "RolePermission_roleId_permissionId_key" UNIQUE ("roleId", "permissionId")
);

INSERT INTO "RolePermission" ("id", "roleId", "permissionId")
SELECT 'rp-sa-' || ROW_NUMBER() OVER (), 'role-001', "id" FROM "Permission";

INSERT INTO "RolePermission" ("id", "roleId", "permissionId") VALUES
('rp-ad-1', 'role-002', 'perm-001'), ('rp-ad-2', 'role-002', 'perm-002'), ('rp-ad-3', 'role-002', 'perm-005'),
('rp-ad-4', 'role-002', 'perm-006'), ('rp-ad-5', 'role-002', 'perm-008'), ('rp-ad-6', 'role-002', 'perm-009'),
('rp-ad-7', 'role-002', 'perm-010'), ('rp-ad-8', 'role-002', 'perm-011'), ('rp-ad-9', 'role-002', 'perm-012'),
('rp-ad-10', 'role-002', 'perm-013'), ('rp-ad-11', 'role-002', 'perm-014'), ('rp-ad-12', 'role-002', 'perm-015'),
('rp-ad-13', 'role-002', 'perm-016'), ('rp-ad-14', 'role-002', 'perm-017'), ('rp-ad-15', 'role-002', 'perm-018'),
('rp-ad-16', 'role-002', 'perm-021'), ('rp-ad-17', 'role-002', 'perm-022'), ('rp-ad-18', 'role-002', 'perm-023'),
('rp-ad-19', 'role-002', 'perm-024'), ('rp-ad-20', 'role-002', 'perm-025'), ('rp-ad-21', 'role-002', 'perm-027'),
('rp-ad-22', 'role-002', 'perm-028'), ('rp-ad-23', 'role-002', 'perm-029'), ('rp-ad-24', 'role-002', 'perm-030'),
('rp-ad-25', 'role-002', 'perm-032'), ('rp-ad-26', 'role-002', 'perm-033'), ('rp-ad-27', 'role-002', 'perm-034'),
('rp-ad-28', 'role-002', 'perm-031'),
('rp-ks-1', 'role-004', 'perm-001'), ('rp-ks-2', 'role-004', 'perm-006'), ('rp-ks-3', 'role-004', 'perm-008'),
('rp-ks-4', 'role-004', 'perm-013'), ('rp-ks-5', 'role-004', 'perm-017'), ('rp-ks-6', 'role-004', 'perm-018'),
('rp-ks-7', 'role-004', 'perm-021'), ('rp-ks-8', 'role-004', 'perm-022'), ('rp-ks-9', 'role-004', 'perm-024'),
('rp-ks-10', 'role-004', 'perm-025'), ('rp-ks-11', 'role-004', 'perm-034'), ('rp-ks-12', 'role-004', 'perm-031'),
('rp-gr-1', 'role-007', 'perm-001'), ('rp-gr-2', 'role-007', 'perm-018'), ('rp-gr-3', 'role-007', 'perm-019'),
('rp-gr-4', 'role-007', 'perm-020'), ('rp-gr-5', 'role-007', 'perm-021'), ('rp-gr-6', 'role-007', 'perm-013'),
('rp-gr-7', 'role-007', 'perm-014'), ('rp-gr-8', 'role-007', 'perm-015'), ('rp-gr-9', 'role-007', 'perm-016'),
('rp-gr-10', 'role-007', 'perm-017'), ('rp-gr-11', 'role-007', 'perm-022'), ('rp-gr-12', 'role-007', 'perm-031'),
('rp-wk-1', 'role-008', 'perm-001'), ('rp-wk-2', 'role-008', 'perm-018'), ('rp-wk-3', 'role-008', 'perm-019'),
('rp-wk-4', 'role-008', 'perm-020'), ('rp-wk-5', 'role-008', 'perm-021'), ('rp-wk-6', 'role-008', 'perm-013'),
('rp-wk-7', 'role-008', 'perm-014'), ('rp-wk-8', 'role-008', 'perm-015'), ('rp-wk-9', 'role-008', 'perm-016'),
('rp-wk-10', 'role-008', 'perm-017'), ('rp-wk-11', 'role-008', 'perm-022'), ('rp-wk-12', 'role-008', 'perm-034'),
('rp-wk-13', 'role-008', 'perm-031'),
('rp-op-1', 'role-003', 'perm-001'), ('rp-op-2', 'role-003', 'perm-006'), ('rp-op-3', 'role-003', 'perm-008'),
('rp-op-4', 'role-003', 'perm-032'), ('rp-op-5', 'role-003', 'perm-033'), ('rp-op-6', 'role-003', 'perm-022'),
('rp-op-7', 'role-003', 'perm-023'), ('rp-op-8', 'role-003', 'perm-024'), ('rp-op-9', 'role-003', 'perm-025'),
('rp-op-10', 'role-003', 'perm-031'),
('rp-wk2-1', 'role-005', 'perm-001'), ('rp-wk2-2', 'role-005', 'perm-006'), ('rp-wk2-3', 'role-005', 'perm-008'),
('rp-wk2-4', 'role-005', 'perm-013'), ('rp-wk2-5', 'role-005', 'perm-017'), ('rp-wk2-6', 'role-005', 'perm-018'),
('rp-wk2-7', 'role-005', 'perm-021'), ('rp-wk2-8', 'role-005', 'perm-022'), ('rp-wk2-9', 'role-005', 'perm-023'),
('rp-wk2-10', 'role-005', 'perm-024'), ('rp-wk2-11', 'role-005', 'perm-025'), ('rp-wk2-12', 'role-005', 'perm-034'),
('rp-wk2-13', 'role-005', 'perm-031'),
('rp-tu-1', 'role-006', 'perm-001'), ('rp-tu-2', 'role-006', 'perm-006'), ('rp-tu-3', 'role-006', 'perm-008'),
('rp-tu-4', 'role-006', 'perm-032'), ('rp-tu-5', 'role-006', 'perm-033'), ('rp-tu-6', 'role-006', 'perm-034'),
('rp-tu-7', 'role-006', 'perm-022'), ('rp-tu-8', 'role-006', 'perm-023'), ('rp-tu-9', 'role-006', 'perm-031'),
('rp-sw-1', 'role-009', 'perm-001'), ('rp-sw-2', 'role-009', 'perm-013'), ('rp-sw-3', 'role-009', 'perm-021'),
('rp-sw-4', 'role-009', 'perm-022'), ('rp-sw-5', 'role-009', 'perm-031'),
('rp-ot-1', 'role-010', 'perm-001'), ('rp-ot-2', 'role-010', 'perm-013'), ('rp-ot-3', 'role-010', 'perm-021'),
('rp-ot-4', 'role-010', 'perm-022'), ('rp-ot-5', 'role-010', 'perm-031');

-- UserRole
CREATE TABLE "UserRole" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT NOW(),
  CONSTRAINT "UserRole_userId_roleId_key" UNIQUE ("userId", "roleId")
);

-- User
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "nama" TEXT NOT NULL,
  "username" TEXT UNIQUE,
  "password" TEXT NOT NULL,
  "passwordText" TEXT DEFAULT '',
  "role" TEXT DEFAULT 'guru',
  "status" TEXT DEFAULT 'aktif',
  "foto" TEXT DEFAULT '',
  "email" TEXT DEFAULT '',
  "noHP" TEXT DEFAULT '',
  "nip" TEXT DEFAULT '',
  "jabatan" TEXT DEFAULT '',
  "lastLogin" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) DEFAULT NOW()
);

INSERT INTO "User" ("id", "nama", "username", "password", "passwordText", "role", "email", "noHP", "nip", "jabatan") VALUES
('user-001', 'Super Admin', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin123', 'super-admin', 'admin@tuweri.sch.id', '081234567890', '000000000', 'Super Administrator'),
('user-002', 'Budi Santoso', 'adminsekolah', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin123', 'admin', '', '', '198501012010011001', 'Admin Sekolah'),
('user-003', 'Siti Aminah', 'operator', '$2a$10$YVw7xR5l2KqN8Z3pFmHhXejjJvM0sTuK6yL9wOaR4EcGnIdBkQ3u', 'operator123', 'operator', '', '', '199001012015002001', 'Operator'),
('user-004', 'Drs. Ahmad Hidayat, M.Pd', 'kepsek', '$2a$10$kP3vR7Xn2Q4mW8sL6jFnNOeIuK5xM1oP9qR3wE7yA6sD4fG8hJ0i', 'kepsek123', 'kepala-sekolah', '', '', '197501012003121001', 'Kepala Sekolah'),
('user-005', 'Ir. Rahmawati, M.Pd', 'wakasek', '$2a$10$mK8nW4xL6pR2qN5oF9gHiPeJrT7uY0aO8sD3vE6wB5cA9fG2hK1j', 'wakasek123', 'wakil-kepala-sekolah', '', '', '198001012005012001', 'Wakil Kepala Sekolah'),
('user-006', 'Dewi Lestari', 'tu', '$2a$10$nL9oX5yM7qR3pN6oG0hIjOfKsT8vX1bN7rE4wD6cA0fG3hJ2iK0l', 'tu123', 'tata-usaha', '', '', '199201012018002002', 'Tata Usaha'),
('user-007', 'Ahmad Fauzi, S.Pd', 'ahmad', '$2a$10$pM7nW6xL5qR2oN4oF8gHkNeJrS6uY0aO7sD2vE5wB4cA8fG1hJ3i', 'guru123', 'guru', '', '', '199001012015011001', 'Guru Matematika'),
('user-008', 'Sri Wahyuni, S.Pd', 'sri', '$2a$10$oS6mW5xK4qR1oN3oF9gHkNeJrS5uY0aO7sD2vE5wB4cA8fG1hJ3i', 'guru123', 'wali-kelas', '', '', '199201012020012002', 'Guru / Wali Kelas');

INSERT INTO "UserRole" ("id", "userId", "roleId") VALUES
('ur-001', 'user-001', 'role-001'), ('ur-002', 'user-002', 'role-002'),
('ur-003', 'user-003', 'role-003'), ('ur-004', 'user-004', 'role-004'),
('ur-005', 'user-005', 'role-005'), ('ur-006', 'user-006', 'role-006'),
('ur-007', 'user-007', 'role-007'), ('ur-008', 'user-008', 'role-008');

-- Guru
CREATE TABLE "Guru" (
  "id" TEXT PRIMARY KEY, "nip" TEXT UNIQUE, "nama" TEXT NOT NULL, "gelar" TEXT DEFAULT '',
  "jenisKelamin" TEXT DEFAULT 'Laki-laki', "tempatLahir" TEXT DEFAULT '', "tanggalLahir" TEXT DEFAULT '',
  "alamat" TEXT DEFAULT '', "email" TEXT DEFAULT '', "noHP" TEXT DEFAULT '', "mapel" TEXT DEFAULT '',
  "status" TEXT DEFAULT 'aktif', "foto" TEXT DEFAULT '',
  "createdAt" TIMESTAMP(3) DEFAULT NOW(), "updatedAt" TIMESTAMP(3) DEFAULT NOW()
);
INSERT INTO "Guru" ("id", "nip", "nama", "jenisKelamin", "mapel") VALUES
('guru-001', '199001012015011001', 'Ahmad Fauzi, S.Pd', 'Laki-laki', 'Matematika'),
('guru-002', '199201012020012002', 'Sri Wahyuni, S.Pd', 'Perempuan', 'Bahasa Indonesia'),
('guru-003', '198803152010011003', 'Bambang Irawan, M.Pd', 'Laki-laki', 'Fisika'),
('guru-004', '199105202018012004', 'Rina Susanti, S.Pd', 'Perempuan', 'Kimia'),
('guru-005', '198706102009011005', 'Hendra Wijaya, S.Si', 'Laki-laki', 'Biologi'),
('guru-006', '199302152019012006', 'Diana Putri, S.Pd', 'Perempuan', 'Bahasa Inggris'),
('guru-007', '198511202008011007', 'Agus Supriyadi, S.Pd', 'Laki-laki', 'Sejarah'),
('guru-008', '199408252020012008', 'Fitri Handayani, S.Pd', 'Perempuan', 'Ekonomi'),
('guru-009', '198912302010011009', 'Rudi Hartono, S.Pd', 'Laki-laki', 'Geografi'),
('guru-010', '199505102021012010', 'Lestari Ningrum, S.Pd', 'Perempuan', 'Sosiologi'),
('guru-011', '198607152011011011', 'Wahyu Prasetyo, S.Kom', 'Laki-laki', 'Informatika'),
('guru-012', '199212202019012012', 'Anita Sari, S.Pd', 'Perempuan', 'PKN'),
('guru-013', '198410052007011013', 'Darmawan, M.Pd', 'Laki-laki', 'Seni Budaya'),
('guru-014', '199603012022012014', 'Mega Silvia, S.Pd', 'Perempuan', 'PJOK'),
('guru-015', '198908172012011015', 'Fajar Nugroho, S.Ag', 'Laki-laki', 'PAI');

-- Siswa
CREATE TABLE "Siswa" (
  "id" TEXT PRIMARY KEY, "nis" TEXT UNIQUE, "nisn" TEXT DEFAULT '', "nama" TEXT NOT NULL,
  "jenisKelamin" TEXT DEFAULT 'Laki-laki', "tempatLahir" TEXT DEFAULT '', "tanggalLahir" TEXT DEFAULT '',
  "agama" TEXT DEFAULT 'Islam', "alamat" TEXT DEFAULT '', "namaAyah" TEXT DEFAULT '', "namaIbu" TEXT DEFAULT '',
  "noHP" TEXT DEFAULT '', "kelas" TEXT DEFAULT '', "status" TEXT DEFAULT 'aktif', "foto" TEXT DEFAULT '',
  "createdAt" TIMESTAMP(3) DEFAULT NOW(), "updatedAt" TIMESTAMP(3) DEFAULT NOW()
);
INSERT INTO "Siswa" ("id", "nis", "nama", "kelas") VALUES
('sw-001', '20240001', 'Andi Pratama', '1A'), ('sw-002', '20240002', 'Budi Setiawan', '1A'),
('sw-003', '20240003', 'Citra Dewi', '1A'), ('sw-004', '20240004', 'Dian Permata', '1A'),
('sw-005', '20240005', 'Eko Saputra', '1B'), ('sw-006', '20240006', 'Fani Oktavia', '1B'),
('sw-007', '20240007', 'Gilang Ramadhan', '1B'), ('sw-008', '20240008', 'Hani Mulyani', '1B'),
('sw-009', '20240009', 'Irfan Hakim', '2A'), ('sw-010', '20240010', 'Joko Widodo', '2A'),
('sw-011', '20240011', 'Kartika Sari', '2A'), ('sw-012', '20240012', 'Lina Marlina', '2A'),
('sw-013', '20240013', 'Muhammad Rizki', '3A'), ('sw-014', '20240014', 'Nur Aini', '3A'),
('sw-015', '20240015', 'Oscar Pratama', '3A'), ('sw-016', '20240016', 'Putri Amelia', '3A'),
('sw-017', '20240017', 'Qori Ananda', '4A'), ('sw-018', '20240018', 'Rizky Aditya', '4A'),
('sw-019', '20240019', 'Sinta Maharani', '4A'), ('sw-020', '20240020', 'Taufik Hidayat', '4A'),
('sw-021', '20240021', 'Umar Faruq', '5A'), ('sw-022', '20240022', 'Vina Oktaviani', '5A'),
('sw-023', '20240023', 'Wahyu Setiabudi', '5A'), ('sw-024', '20240024', 'Yuni Astuti', '5A');

-- Kelas
CREATE TABLE "Kelas" (
  "id" TEXT PRIMARY KEY, "kodeKelas" TEXT UNIQUE, "namaKelas" TEXT NOT NULL,
  "waliKelas" TEXT DEFAULT '', "status" TEXT DEFAULT 'aktif'
);
INSERT INTO "Kelas" ("id", "kodeKelas", "namaKelas", "waliKelas") VALUES
('kelas-001', '1A', 'I-A', 'Sri Wahyuni, S.Pd'), ('kelas-002', '1B', 'I-B', ''),
('kelas-003', '2A', 'II-A', ''), ('kelas-004', '2B', 'II-B', ''),
('kelas-005', '3A', 'III-A', ''), ('kelas-006', '4A', 'IV-A', '');

-- MataPelajaran
CREATE TABLE "MataPelajaran" (
  "id" TEXT PRIMARY KEY, "kodeMapel" TEXT UNIQUE, "namaMapel" TEXT NOT NULL,
  "kkm" INTEGER DEFAULT 75, "guru" TEXT DEFAULT '', "status" TEXT DEFAULT 'aktif'
);
INSERT INTO "MataPelajaran" ("id", "kodeMapel", "namaMapel", "kkm", "guru") VALUES
('mapel-001', 'MTK', 'Matematika', 75, 'Ahmad Fauzi, S.Pd'),
('mapel-002', 'BIN', 'Bahasa Indonesia', 75, 'Sri Wahyuni, S.Pd'),
('mapel-003', 'FIS', 'Fisika', 75, 'Bambang Irawan, M.Pd'),
('mapel-004', 'KIM', 'Kimia', 75, 'Rina Susanti, S.Pd'),
('mapel-005', 'BIO', 'Biologi', 75, 'Hendra Wijaya, S.Si'),
('mapel-006', 'BIG', 'Bahasa Inggris', 75, 'Diana Putri, S.Pd'),
('mapel-007', 'SEJ', 'Sejarah', 75, 'Agus Supriyadi, S.Pd'),
('mapel-008', 'EKO', 'Ekonomi', 75, 'Fitri Handayani, S.Pd'),
('mapel-009', 'GEO', 'Geografi', 75, 'Rudi Hartono, S.Pd'),
('mapel-010', 'SOS', 'Sosiologi', 75, 'Lestari Ningrum, S.Pd'),
('mapel-011', 'INF', 'Informatika', 75, 'Wahyu Prasetyo, S.Kom'),
('mapel-012', 'PKN', 'PKN', 75, 'Anita Sari, S.Pd');

-- TahunAjaran
CREATE TABLE "TahunAjaran" ("id" TEXT PRIMARY KEY, "nama" TEXT UNIQUE, "status" TEXT DEFAULT 'aktif');
INSERT INTO "TahunAjaran" VALUES ('ta-001', '2024/2025', 'aktif'), ('ta-002', '2023/2024', 'tidak');

-- Semester
CREATE TABLE "Semester" ("id" TEXT PRIMARY KEY, "semester" TEXT UNIQUE, "status" TEXT DEFAULT 'aktif');
INSERT INTO "Semester" VALUES ('sem-001', 'Ganjil', 'tidak'), ('sem-002', 'Genap', 'aktif');

-- Nilai
CREATE TABLE "Nilai" (
  "id" TEXT PRIMARY KEY, "tahunAjaran" TEXT DEFAULT '2024/2025', "semester" TEXT DEFAULT 'Genap',
  "kelas" TEXT DEFAULT '', "mapel" TEXT DEFAULT '', "guru" TEXT DEFAULT '', "nis" TEXT DEFAULT '',
  "nama" TEXT DEFAULT '', "ph1" DOUBLE PRECISION DEFAULT 0, "ph2" DOUBLE PRECISION DEFAULT 0,
  "ph3" DOUBLE PRECISION DEFAULT 0, "ph4" DOUBLE PRECISION DEFAULT 0, "pts" DOUBLE PRECISION DEFAULT 0,
  "pas" DOUBLE PRECISION DEFAULT 0, "rataRata" DOUBLE PRECISION DEFAULT 0, "nilaiAkhir" DOUBLE PRECISION DEFAULT 0,
  "predikat" TEXT DEFAULT '', "deskripsi" TEXT DEFAULT '',
  "createdAt" TIMESTAMP(3) DEFAULT NOW(), "updatedAt" TIMESTAMP(3) DEFAULT NOW()
);

-- AbsensiGuru
CREATE TABLE "AbsensiGuru" (
  "id" TEXT PRIMARY KEY, "tanggal" TEXT DEFAULT '', "namaGuru" TEXT DEFAULT '', "nip" TEXT DEFAULT '',
  "jamMasuk" TEXT DEFAULT '', "jamPulang" TEXT DEFAULT '', "durasi" TEXT DEFAULT '', "status" TEXT DEFAULT '',
  "latitude" TEXT DEFAULT '', "longitude" TEXT DEFAULT '', "alamat" TEXT DEFAULT '',
  "browser" TEXT DEFAULT '', "device" TEXT DEFAULT '', "ip" TEXT DEFAULT '', "keterangan" TEXT DEFAULT '',
  "createdAt" TIMESTAMP(3) DEFAULT NOW()
);

-- AbsensiSiswa
CREATE TABLE "AbsensiSiswa" (
  "id" TEXT PRIMARY KEY, "tanggal" TEXT DEFAULT '', "kelas" TEXT DEFAULT '', "nis" TEXT DEFAULT '',
  "nama" TEXT DEFAULT '', "status" TEXT DEFAULT 'Hadir', "keterangan" TEXT DEFAULT '', "guru" TEXT DEFAULT '',
  "createdAt" TIMESTAMP(3) DEFAULT NOW()
);

-- Pengumuman
CREATE TABLE "Pengumuman" (
  "id" TEXT PRIMARY KEY, "judul" TEXT NOT NULL, "isi" TEXT DEFAULT '',
  "lampiran" TEXT DEFAULT '', "tanggal" TEXT DEFAULT '', "status" TEXT DEFAULT 'aktif',
  "createdAt" TIMESTAMP(3) DEFAULT NOW()
);
INSERT INTO "Pengumuman" VALUES
('peng-001', 'Libur Hari Kemerdekaan', 'Diberitahukan bahwa tanggal 17 Agustus 2025 libur nasional dalam rangka memperingati Hari Kemerdekaan RI ke-80.', '', '2025-08-15', 'aktif', NOW()),
('peng-002', 'Ujian Tengah Semester Ganjil', 'UTS Ganjil akan dilaksanakan pada tanggal 6-11 Oktober 2025. Semua siswa diwajibkan hadir.', '', '2025-09-25', 'aktif', NOW());

-- AuditLog
CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY, "tanggal" TEXT DEFAULT '', "user" TEXT DEFAULT '', "role" TEXT DEFAULT '',
  "aktivitas" TEXT DEFAULT '', "ip" TEXT DEFAULT '', "detail" TEXT DEFAULT '',
  "createdAt" TIMESTAMP(3) DEFAULT NOW()
);

-- Backup
CREATE TABLE "Backup" (
  "id" TEXT PRIMARY KEY, "namaFile" TEXT DEFAULT '', "ukuran" TEXT DEFAULT '',
  "tanggalBackup" TEXT DEFAULT '', "status" TEXT DEFAULT 'aktif',
  "createdAt" TIMESTAMP(3) DEFAULT NOW()
);

-- Alumni
CREATE TABLE "Alumni" (
  "id" TEXT PRIMARY KEY, "nis" TEXT DEFAULT '', "nama" TEXT DEFAULT '',
  "tahunLulus" TEXT DEFAULT '', "keterangan" TEXT DEFAULT ''
);

-- JurnalMengajar
CREATE TABLE "JurnalMengajar" (
  "id" TEXT PRIMARY KEY, "tanggal" TEXT DEFAULT '', "guru" TEXT DEFAULT '', "kelas" TEXT DEFAULT '',
  "mapel" TEXT DEFAULT '', "materi" TEXT DEFAULT '', "keterangan" TEXT DEFAULT '',
  "createdAt" TIMESTAMP(3) DEFAULT NOW()
);

-- RiwayatLogin
CREATE TABLE "RiwayatLogin" (
  "id" TEXT PRIMARY KEY, "user" TEXT DEFAULT '', "role" TEXT DEFAULT '', "waktuLogin" TEXT DEFAULT '',
  "ipAddress" TEXT DEFAULT '', "userAgent" TEXT DEFAULT '', "createdAt" TIMESTAMP(3) DEFAULT NOW()
);