-- ========================================
-- SIAKAD Database - MySQL Script
-- Generated for phpMyAdmin import
-- ========================================

CREATE DATABASE IF NOT EXISTS `siakad_sdmi` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `siakad_sdmi`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------
-- 1. SettingSekolah
-- ----------------------------------------
DROP TABLE IF EXISTS `SettingSekolah`;
CREATE TABLE `SettingSekolah` (
  `id` VARCHAR(191) PRIMARY KEY,
  `namaSekolah` TEXT,
  `logo` TEXT,
  `alamat` TEXT,
  `npsn` VARCHAR(191),
  `email` VARCHAR(191),
  `website` VARCHAR(191),
  `telepon` VARCHAR(191),
  `kepalaSekolah` VARCHAR(191),
  `nipKepalaSekolah` VARCHAR(191),
  `motto` TEXT,
  `visi` TEXT,
  `misi` TEXT,
  `semesterAktif` VARCHAR(191),
  `tahunAjaranAktif` VARCHAR(191),
  `tema` VARCHAR(191),
  `darkMode` BOOLEAN DEFAULT 0,
  `createdAt` DATETIME,
  `updatedAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `SettingSekolah` (`id`, `namaSekolah`, `logo`, `alamat`, `npsn`, `email`, `website`, `telepon`, `kepalaSekolah`, `nipKepalaSekolah`, `motto`, `visi`, `misi`, `semesterAktif`, `tahunAjaranAktif`, `tema`, `darkMode`, `createdAt`, `updatedAt`) VALUES
('seed-setting-001', 'MIS AL ASY''ARIYAH', '', '', '', '', '', '', '', '', '', '', '', 'Genap', '2024/2025', 'light', 0, NOW(), NOW());

-- ----------------------------------------
-- 2. Role
-- ----------------------------------------
DROP TABLE IF EXISTS `Role`;
CREATE TABLE `Role` (
  `id` VARCHAR(191) PRIMARY KEY,
  `slug` VARCHAR(191) UNIQUE,
  `nama` VARCHAR(191),
  `deskripsi` TEXT,
  `status` VARCHAR(191),
  `createdAt` DATETIME,
  `updatedAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Role` (`id`, `slug`, `nama`, `deskripsi`, `status`, `createdAt`, `updatedAt`) VALUES
('seed-role-001', 'super-admin', 'Super Admin', 'Akses penuh terhadap seluruh sistem', 'aktif', NOW(), NOW()),
('seed-role-002', 'admin', 'Admin Sekolah', 'Mengelola seluruh operasional sekolah', 'aktif', NOW(), NOW()),
('seed-role-003', 'operator', 'Operator Sekolah', 'Membantu administrasi sekolah', 'aktif', NOW(), NOW()),
('seed-role-004', 'kepala-sekolah', 'Kepala Sekolah', 'Monitoring dan persetujuan', 'aktif', NOW(), NOW()),
('seed-role-005', 'wakil-kepala-sekolah', 'Wakil Kepala Sekolah', 'Supervisi akademik', 'aktif', NOW(), NOW()),
('seed-role-006', 'tata-usaha', 'Tata Usaha', 'Mengelola administrasi sekolah', 'aktif', NOW(), NOW()),
('seed-role-007', 'guru', 'Guru', 'Guru mengajar', 'aktif', NOW(), NOW()),
('seed-role-008', 'wali-kelas', 'Wali Kelas', 'Guru dengan hak tambahan wali kelas', 'aktif', NOW(), NOW()),
('seed-role-009', 'siswa', 'Siswa', 'Siswa (opsional)', 'aktif', NOW(), NOW()),
('seed-role-010', 'orang-tua', 'Orang Tua', 'Orang Tua (opsional)', 'aktif', NOW(), NOW());

-- ----------------------------------------
-- 3. Permission
-- ----------------------------------------
DROP TABLE IF EXISTS `Permission`;
CREATE TABLE `Permission` (
  `id` VARCHAR(191) PRIMARY KEY,
  `slug` VARCHAR(191) UNIQUE,
  `nama` VARCHAR(191),
  `kategori` VARCHAR(191),
  `status` VARCHAR(191),
  `createdAt` DATETIME,
  `updatedAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Permission` (`id`, `slug`, `nama`, `kategori`, `status`, `createdAt`, `updatedAt`) VALUES
('seed-perm-001', 'dashboard', 'Dashboard', 'dashboard', 'aktif', NOW(), NOW()),
('seed-perm-002', 'users', 'Data User', 'users', 'aktif', NOW(), NOW()),
('seed-perm-003', 'roles', 'Manajemen Role', 'users', 'aktif', NOW(), NOW()),
('seed-perm-004', 'permissions', 'Manajemen Permission', 'users', 'aktif', NOW(), NOW()),
('seed-perm-005', 'riwayat-login', 'Riwayat Login', 'users', 'aktif', NOW(), NOW()),
('seed-perm-006', 'guru', 'Data Guru', 'master', 'aktif', NOW(), NOW()),
('seed-perm-007', 'guru:delete', 'Hapus Guru', 'master', 'aktif', NOW(), NOW()),
('seed-perm-008', 'siswa', 'Data Siswa', 'master', 'aktif', NOW(), NOW()),
('seed-perm-009', 'kelas', 'Data Kelas', 'master', 'aktif', NOW(), NOW()),
('seed-perm-010', 'mapel', 'Mata Pelajaran', 'master', 'aktif', NOW(), NOW()),
('seed-perm-011', 'tahun-ajaran', 'Tahun Ajaran', 'master', 'aktif', NOW(), NOW()),
('seed-perm-012', 'semester', 'Semester', 'master', 'aktif', NOW(), NOW()),
('seed-perm-013', 'nilai', 'Input Nilai', 'nilai', 'aktif', NOW(), NOW()),
('seed-perm-014', 'nilai:edit', 'Edit Nilai', 'nilai', 'aktif', NOW(), NOW()),
('seed-perm-015', 'nilai:import', 'Import Nilai', 'nilai', 'aktif', NOW(), NOW()),
('seed-perm-016', 'nilai:export', 'Export Nilai', 'nilai', 'aktif', NOW(), NOW()),
('seed-perm-017', 'rekap-nilai', 'Rekap Nilai', 'nilai', 'aktif', NOW(), NOW()),
('seed-perm-018', 'absensi-guru', 'Absensi Guru', 'absensi', 'aktif', NOW(), NOW()),
('seed-perm-019', 'absensi-guru:clock-in', 'Absen Masuk', 'absensi', 'aktif', NOW(), NOW()),
('seed-perm-020', 'absensi-guru:clock-out', 'Absen Pulang', 'absensi', 'aktif', NOW(), NOW()),
('seed-perm-021', 'absensi-siswa', 'Absensi Siswa', 'absensi', 'aktif', NOW(), NOW()),
('seed-perm-022', 'pengumuman', 'Lihat Pengumuman', 'pengumuman', 'aktif', NOW(), NOW()),
('seed-perm-023', 'pengumuman:manage', 'Kelola Pengumuman', 'pengumuman', 'aktif', NOW(), NOW()),
('seed-perm-024', 'laporan', 'Laporan', 'laporan', 'aktif', NOW(), NOW()),
('seed-perm-025', 'laporan:export', 'Export Laporan', 'laporan', 'aktif', NOW(), NOW()),
('seed-perm-026', 'audit-log', 'Audit Log', 'sistem', 'aktif', NOW(), NOW()),
('seed-perm-027', 'backup', 'Backup', 'sistem', 'aktif', NOW(), NOW()),
('seed-perm-028', 'restore', 'Restore', 'sistem', 'aktif', NOW(), NOW()),
('seed-perm-029', 'pengaturan', 'Pengaturan', 'sistem', 'aktif', NOW(), NOW()),
('seed-perm-030', 'manajemen-sekolah', 'Manajemen Sekolah', 'sistem', 'aktif', NOW(), NOW()),
('seed-perm-031', 'profil', 'Profil', 'profil', 'aktif', NOW(), NOW()),
('seed-perm-032', 'import-data', 'Import Data', 'data', 'aktif', NOW(), NOW()),
('seed-perm-033', 'export-data', 'Export Data', 'data', 'aktif', NOW(), NOW()),
('seed-perm-034', 'cetak-dokumen', 'Cetak Dokumen', 'data', 'aktif', NOW(), NOW()),
('seed-perm-035', 'wildcard-all', 'Akses Penuh (Super Admin)', 'sistem', 'aktif', NOW(), NOW());

-- ----------------------------------------
-- 4. RolePermission
-- ----------------------------------------
DROP TABLE IF EXISTS `RolePermission`;
CREATE TABLE `RolePermission` (
  `id` VARCHAR(191) PRIMARY KEY,
  `roleId` VARCHAR(191),
  `permissionId` VARCHAR(191),
  `createdAt` DATETIME,
  UNIQUE KEY `unique_role_permission` (`roleId`, `permissionId`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permissionId`) REFERENCES `Permission` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `RolePermission` (`id`, `roleId`, `permissionId`, `createdAt`) VALUES
-- super-admin: wildcard-all only
('seed-rp-0001', 'seed-role-001', 'seed-perm-035', NOW()),
-- admin: dashboard, users, riwayat-login, guru, siswa, kelas, mapel, tahun-ajaran, semester, nilai, nilai:edit, nilai:import, nilai:export, rekap-nilai, absensi-guru, absensi-siswa, pengumuman, pengumuman:manage, laporan, laporan:export, backup, restore, pengaturan, manajemen-sekolah, import-data, export-data, cetak-dokumen, profil
('seed-rp-0002', 'seed-role-002', 'seed-perm-001', NOW()),
('seed-rp-0003', 'seed-role-002', 'seed-perm-002', NOW()),
('seed-rp-0004', 'seed-role-002', 'seed-perm-005', NOW()),
('seed-rp-0005', 'seed-role-002', 'seed-perm-006', NOW()),
('seed-rp-0006', 'seed-role-002', 'seed-perm-008', NOW()),
('seed-rp-0007', 'seed-role-002', 'seed-perm-009', NOW()),
('seed-rp-0008', 'seed-role-002', 'seed-perm-010', NOW()),
('seed-rp-0009', 'seed-role-002', 'seed-perm-011', NOW()),
('seed-rp-0010', 'seed-role-002', 'seed-perm-012', NOW()),
('seed-rp-0011', 'seed-role-002', 'seed-perm-013', NOW()),
('seed-rp-0012', 'seed-role-002', 'seed-perm-014', NOW()),
('seed-rp-0013', 'seed-role-002', 'seed-perm-015', NOW()),
('seed-rp-0014', 'seed-role-002', 'seed-perm-016', NOW()),
('seed-rp-0015', 'seed-role-002', 'seed-perm-017', NOW()),
('seed-rp-0016', 'seed-role-002', 'seed-perm-018', NOW()),
('seed-rp-0017', 'seed-role-002', 'seed-perm-021', NOW()),
('seed-rp-0018', 'seed-role-002', 'seed-perm-022', NOW()),
('seed-rp-0019', 'seed-role-002', 'seed-perm-023', NOW()),
('seed-rp-0020', 'seed-role-002', 'seed-perm-024', NOW()),
('seed-rp-0021', 'seed-role-002', 'seed-perm-025', NOW()),
('seed-rp-0022', 'seed-role-002', 'seed-perm-027', NOW()),
('seed-rp-0023', 'seed-role-002', 'seed-perm-028', NOW()),
('seed-rp-0024', 'seed-role-002', 'seed-perm-029', NOW()),
('seed-rp-0025', 'seed-role-002', 'seed-perm-030', NOW()),
('seed-rp-0026', 'seed-role-002', 'seed-perm-032', NOW()),
('seed-rp-0027', 'seed-role-002', 'seed-perm-033', NOW()),
('seed-rp-0028', 'seed-role-002', 'seed-perm-034', NOW()),
('seed-rp-0029', 'seed-role-002', 'seed-perm-031', NOW()),
-- operator: dashboard, guru, siswa, import-data, export-data, pengumuman, pengumuman:manage, laporan, laporan:export, profil
('seed-rp-0030', 'seed-role-003', 'seed-perm-001', NOW()),
('seed-rp-0031', 'seed-role-003', 'seed-perm-006', NOW()),
('seed-rp-0032', 'seed-role-003', 'seed-perm-008', NOW()),
('seed-rp-0033', 'seed-role-003', 'seed-perm-032', NOW()),
('seed-rp-0034', 'seed-role-003', 'seed-perm-033', NOW()),
('seed-rp-0035', 'seed-role-003', 'seed-perm-022', NOW()),
('seed-rp-0036', 'seed-role-003', 'seed-perm-023', NOW()),
('seed-rp-0037', 'seed-role-003', 'seed-perm-024', NOW()),
('seed-rp-0038', 'seed-role-003', 'seed-perm-025', NOW()),
('seed-rp-0039', 'seed-role-003', 'seed-perm-031', NOW()),
-- kepala-sekolah: dashboard, guru, siswa, nilai, rekap-nilai, absensi-guru, absensi-siswa, pengumuman, laporan, laporan:export, cetak-dokumen, profil
('seed-rp-0040', 'seed-role-004', 'seed-perm-001', NOW()),
('seed-rp-0041', 'seed-role-004', 'seed-perm-006', NOW()),
('seed-rp-0042', 'seed-role-004', 'seed-perm-008', NOW()),
('seed-rp-0043', 'seed-role-004', 'seed-perm-013', NOW()),
('seed-rp-0044', 'seed-role-004', 'seed-perm-017', NOW()),
('seed-rp-0045', 'seed-role-004', 'seed-perm-018', NOW()),
('seed-rp-0046', 'seed-role-004', 'seed-perm-021', NOW()),
('seed-rp-0047', 'seed-role-004', 'seed-perm-022', NOW()),
('seed-rp-0048', 'seed-role-004', 'seed-perm-024', NOW()),
('seed-rp-0049', 'seed-role-004', 'seed-perm-025', NOW()),
('seed-rp-0050', 'seed-role-004', 'seed-perm-034', NOW()),
('seed-rp-0051', 'seed-role-004', 'seed-perm-031', NOW()),
-- wakil-kepala-sekolah: dashboard, guru, siswa, nilai, rekap-nilai, absensi-guru, absensi-siswa, pengumuman, pengumuman:manage, laporan, laporan:export, cetak-dokumen, profil
('seed-rp-0052', 'seed-role-005', 'seed-perm-001', NOW()),
('seed-rp-0053', 'seed-role-005', 'seed-perm-006', NOW()),
('seed-rp-0054', 'seed-role-005', 'seed-perm-008', NOW()),
('seed-rp-0055', 'seed-role-005', 'seed-perm-013', NOW()),
('seed-rp-0056', 'seed-role-005', 'seed-perm-017', NOW()),
('seed-rp-0057', 'seed-role-005', 'seed-perm-018', NOW()),
('seed-rp-0058', 'seed-role-005', 'seed-perm-021', NOW()),
('seed-rp-0059', 'seed-role-005', 'seed-perm-022', NOW()),
('seed-rp-0060', 'seed-role-005', 'seed-perm-023', NOW()),
('seed-rp-0061', 'seed-role-005', 'seed-perm-024', NOW()),
('seed-rp-0062', 'seed-role-005', 'seed-perm-025', NOW()),
('seed-rp-0063', 'seed-role-005', 'seed-perm-034', NOW()),
('seed-rp-0064', 'seed-role-005', 'seed-perm-031', NOW()),
-- tata-usaha: dashboard, guru, siswa, import-data, export-data, cetak-dokumen, pengumuman, pengumuman:manage, profil
('seed-rp-0065', 'seed-role-006', 'seed-perm-001', NOW()),
('seed-rp-0066', 'seed-role-006', 'seed-perm-006', NOW()),
('seed-rp-0067', 'seed-role-006', 'seed-perm-008', NOW()),
('seed-rp-0068', 'seed-role-006', 'seed-perm-032', NOW()),
('seed-rp-0069', 'seed-role-006', 'seed-perm-033', NOW()),
('seed-rp-0070', 'seed-role-006', 'seed-perm-034', NOW()),
('seed-rp-0071', 'seed-role-006', 'seed-perm-022', NOW()),
('seed-rp-0072', 'seed-role-006', 'seed-perm-023', NOW()),
('seed-rp-0073', 'seed-role-006', 'seed-perm-031', NOW()),
-- guru: dashboard, absensi-guru, absensi-guru:clock-in, absensi-guru:clock-out, absensi-siswa, nilai, nilai:edit, nilai:import, nilai:export, rekap-nilai, pengumuman, profil
('seed-rp-0074', 'seed-role-007', 'seed-perm-001', NOW()),
('seed-rp-0075', 'seed-role-007', 'seed-perm-018', NOW()),
('seed-rp-0076', 'seed-role-007', 'seed-perm-019', NOW()),
('seed-rp-0077', 'seed-role-007', 'seed-perm-020', NOW()),
('seed-rp-0078', 'seed-role-007', 'seed-perm-021', NOW()),
('seed-rp-0079', 'seed-role-007', 'seed-perm-013', NOW()),
('seed-rp-0080', 'seed-role-007', 'seed-perm-014', NOW()),
('seed-rp-0081', 'seed-role-007', 'seed-perm-015', NOW()),
('seed-rp-0082', 'seed-role-007', 'seed-perm-016', NOW()),
('seed-rp-0083', 'seed-role-007', 'seed-perm-017', NOW()),
('seed-rp-0084', 'seed-role-007', 'seed-perm-022', NOW()),
('seed-rp-0085', 'seed-role-007', 'seed-perm-031', NOW()),
-- wali-kelas: dashboard, absensi-guru, absensi-guru:clock-in, absensi-guru:clock-out, absensi-siswa, nilai, nilai:edit, nilai:import, nilai:export, rekap-nilai, pengumuman, cetak-dokumen, profil
('seed-rp-0086', 'seed-role-008', 'seed-perm-001', NOW()),
('seed-rp-0087', 'seed-role-008', 'seed-perm-018', NOW()),
('seed-rp-0088', 'seed-role-008', 'seed-perm-019', NOW()),
('seed-rp-0089', 'seed-role-008', 'seed-perm-020', NOW()),
('seed-rp-0090', 'seed-role-008', 'seed-perm-021', NOW()),
('seed-rp-0091', 'seed-role-008', 'seed-perm-013', NOW()),
('seed-rp-0092', 'seed-role-008', 'seed-perm-014', NOW()),
('seed-rp-0093', 'seed-role-008', 'seed-perm-015', NOW()),
('seed-rp-0094', 'seed-role-008', 'seed-perm-016', NOW()),
('seed-rp-0095', 'seed-role-008', 'seed-perm-017', NOW()),
('seed-rp-0096', 'seed-role-008', 'seed-perm-022', NOW()),
('seed-rp-0097', 'seed-role-008', 'seed-perm-034', NOW()),
('seed-rp-0098', 'seed-role-008', 'seed-perm-031', NOW()),
-- siswa: dashboard, nilai, absensi-siswa, pengumuman, profil
('seed-rp-0099', 'seed-role-009', 'seed-perm-001', NOW()),
('seed-rp-0100', 'seed-role-009', 'seed-perm-013', NOW()),
('seed-rp-0101', 'seed-role-009', 'seed-perm-021', NOW()),
('seed-rp-0102', 'seed-role-009', 'seed-perm-022', NOW()),
('seed-rp-0103', 'seed-role-009', 'seed-perm-031', NOW()),
-- orang-tua: dashboard, nilai, absensi-siswa, pengumuman, profil
('seed-rp-0104', 'seed-role-010', 'seed-perm-001', NOW()),
('seed-rp-0105', 'seed-role-010', 'seed-perm-013', NOW()),
('seed-rp-0106', 'seed-role-010', 'seed-perm-021', NOW()),
('seed-rp-0107', 'seed-role-010', 'seed-perm-022', NOW()),
('seed-rp-0108', 'seed-role-010', 'seed-perm-031', NOW());

-- ----------------------------------------
-- 5. User
-- ----------------------------------------
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nama` VARCHAR(191),
  `username` VARCHAR(191) UNIQUE,
  `password` TEXT,
  `passwordText` TEXT,
  `role` VARCHAR(191),
  `status` VARCHAR(191),
  `foto` TEXT,
  `email` VARCHAR(191),
  `noHP` VARCHAR(191),
  `nip` VARCHAR(191),
  `jabatan` VARCHAR(191),
  `lastLogin` DATETIME NULL,
  `createdAt` DATETIME,
  `updatedAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `User` (`id`, `nama`, `username`, `password`, `passwordText`, `role`, `status`, `foto`, `email`, `noHP`, `nip`, `jabatan`, `lastLogin`, `createdAt`, `updatedAt`) VALUES
('seed-user-001', 'Super Admin', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin123', 'super-admin', 'aktif', '', 'admin@tuweri.sch.id', '081234567890', '000000000', 'Super Administrator', NULL, NOW(), NOW()),
('seed-user-002', 'Budi Santoso', 'adminsekolah', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin123', 'admin', 'aktif', '', '', '', '198501012010011001', 'Admin Sekolah', NULL, NOW(), NOW()),
('seed-user-003', 'Siti Aminah', 'operator', '$2a$10$Hx8yKVZ6RqMDjXGXFJW5XejlJh3RZyKZ1sK0bKNq8MbWKkNqFOqeC', 'operator123', 'operator', 'aktif', '', '', '', '199001012015002001', 'Operator', NULL, NOW(), NOW()),
('seed-user-004', 'Drs. Ahmad Hidayat, M.Pd', 'kepsek', '$2a$10$pVJK6GTMK3oFaVfYi7YqIeWcHm5QJC6FqCLMbPqs7RqCJxNTVOaOi', 'kepsek123', 'kepala-sekolah', 'aktif', '', '', '', '197501012003121001', 'Kepala Sekolah', NULL, NOW(), NOW()),
('seed-user-005', 'Ir. Rahmawati, M.Pd', 'wakasek', '$2a$10$LKP9hU9r8BqHGaNSkKBvXesmzWYmZ1YVJQLNRPOy5FPqjZrVEMlGi', 'wakasek123', 'wakil-kepala-sekolah', 'aktif', '', '', '', '198001012005012001', 'Wakil Kepala Sekolah', NULL, NOW(), NOW()),
('seed-user-006', 'Dewi Lestari', 'tu', '$2a$10$kL5nFjX7K0sHGM9YpXMROeXc3Vb1W6KZ4QNbLsPq5RMoHqXUNlOaG', 'tu123', 'tata-usaha', 'aktif', '', '', '', '199201012018002002', 'Tata Usaha', NULL, NOW(), NOW()),
('seed-user-007', 'Ahmad Fauzi, S.Pd', 'ahmad', '$2a$10$ZK8vHJR5aF0WOGTqrEmkSO7mQyKN6LnL5pV3XkFBpqCiJrTkNqYGq', 'guru123', 'guru', 'aktif', '', '', '', '199001012015011001', 'Guru Matematika', NULL, NOW(), NOW()),
('seed-user-008', 'Sri Wahyuni, S.Pd', 'sri', '$2a$10$ZK8vHJR5aF0WOGTqrEmkSO7mQyKN6LnL5pV3XkFBpqCiJrTkNqYGq', 'guru123', 'wali-kelas', 'aktif', '', '', '', '199201012020012002', 'Guru / Wali Kelas', NULL, NOW(), NOW());

-- ----------------------------------------
-- 6. UserRole
-- ----------------------------------------
DROP TABLE IF EXISTS `UserRole`;
CREATE TABLE `UserRole` (
  `id` VARCHAR(191) PRIMARY KEY,
  `userId` VARCHAR(191),
  `roleId` VARCHAR(191),
  `createdAt` DATETIME,
  UNIQUE KEY `unique_user_role` (`userId`, `roleId`),
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `UserRole` (`id`, `userId`, `roleId`, `createdAt`) VALUES
('seed-ur-001', 'seed-user-001', 'seed-role-001', NOW()),
('seed-ur-002', 'seed-user-002', 'seed-role-002', NOW()),
('seed-ur-003', 'seed-user-003', 'seed-role-003', NOW()),
('seed-ur-004', 'seed-user-004', 'seed-role-004', NOW()),
('seed-ur-005', 'seed-user-005', 'seed-role-005', NOW()),
('seed-ur-006', 'seed-user-006', 'seed-role-006', NOW()),
('seed-ur-007', 'seed-user-007', 'seed-role-007', NOW()),
('seed-ur-008', 'seed-user-008', 'seed-role-008', NOW());

-- ----------------------------------------
-- 7. Guru
-- ----------------------------------------
DROP TABLE IF EXISTS `Guru`;
CREATE TABLE `Guru` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nip` VARCHAR(191) UNIQUE,
  `nama` VARCHAR(191),
  `gelar` VARCHAR(191),
  `jenisKelamin` VARCHAR(191),
  `tempatLahir` VARCHAR(191),
  `tanggalLahir` VARCHAR(191),
  `alamat` TEXT,
  `email` VARCHAR(191),
  `noHP` VARCHAR(191),
  `mapel` VARCHAR(191),
  `status` VARCHAR(191),
  `foto` TEXT,
  `createdAt` DATETIME,
  `updatedAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Guru` (`id`, `nip`, `nama`, `gelar`, `jenisKelamin`, `tempatLahir`, `tanggalLahir`, `alamat`, `email`, `noHP`, `mapel`, `status`, `foto`, `createdAt`, `updatedAt`) VALUES
('seed-guru-001', '199001012015011001', 'Ahmad Fauzi, S.Pd', '', 'Laki-laki', '', '', '', '', '', 'Matematika', 'aktif', '', NOW(), NOW()),
('seed-guru-002', '199201012020012002', 'Sri Wahyuni, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Bahasa Indonesia', 'aktif', '', NOW(), NOW()),
('seed-guru-003', '198803152010011003', 'Bambang Irawan, M.Pd', '', 'Laki-laki', '', '', '', '', '', 'Fisika', 'aktif', '', NOW(), NOW()),
('seed-guru-004', '199105202018012004', 'Rina Susanti, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Kimia', 'aktif', '', NOW(), NOW()),
('seed-guru-005', '198706102009011005', 'Hendra Wijaya, S.Si', '', 'Laki-laki', '', '', '', '', '', 'Biologi', 'aktif', '', NOW(), NOW()),
('seed-guru-006', '199302152019012006', 'Diana Putri, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Bahasa Inggris', 'aktif', '', NOW(), NOW()),
('seed-guru-007', '198511202008011007', 'Agus Supriyadi, S.Pd', '', 'Laki-laki', '', '', '', '', '', 'Sejarah', 'aktif', '', NOW(), NOW()),
('seed-guru-008', '199408252020012008', 'Fitri Handayani, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Ekonomi', 'aktif', '', NOW(), NOW()),
('seed-guru-009', '198912302010011009', 'Rudi Hartono, S.Pd', '', 'Laki-laki', '', '', '', '', '', 'Geografi', 'aktif', '', NOW(), NOW()),
('seed-guru-010', '199505102021012010', 'Lestari Ningrum, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Sosiologi', 'aktif', '', NOW(), NOW()),
('seed-guru-011', '198607152011011011', 'Wahyu Prasetyo, S.Kom', '', 'Laki-laki', '', '', '', '', '', 'Informatika', 'aktif', '', NOW(), NOW()),
('seed-guru-012', '199212202019012012', 'Anita Sari, S.Pd', '', 'Perempuan', '', '', '', '', '', 'PKN', 'aktif', '', NOW(), NOW()),
('seed-guru-013', '198410052007011013', 'Darmawan, M.Pd', '', 'Laki-laki', '', '', '', '', '', 'Seni Budaya', 'aktif', '', NOW(), NOW()),
('seed-guru-014', '199603012022012014', 'Mega Silvia, S.Pd', '', 'Perempuan', '', '', '', '', '', 'PJOK', 'aktif', '', NOW(), NOW()),
('seed-guru-015', '198908172012011015', 'Fajar Nugroho, S.Ag', '', 'Laki-laki', '', '', '', '', '', 'PAI', 'aktif', '', NOW(), NOW());

-- ----------------------------------------
-- 8. Siswa
-- ----------------------------------------
DROP TABLE IF EXISTS `Siswa`;
CREATE TABLE `Siswa` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nis` VARCHAR(191) UNIQUE,
  `nisn` VARCHAR(191),
  `nama` VARCHAR(191),
  `jenisKelamin` VARCHAR(191),
  `tempatLahir` VARCHAR(191),
  `tanggalLahir` VARCHAR(191),
  `agama` VARCHAR(191),
  `alamat` TEXT,
  `namaAyah` VARCHAR(191),
  `namaIbu` VARCHAR(191),
  `noHP` VARCHAR(191),
  `kelas` VARCHAR(191),
  `status` VARCHAR(191),
  `foto` TEXT,
  `createdAt` DATETIME,
  `updatedAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Siswa` (`id`, `nis`, `nisn`, `nama`, `jenisKelamin`, `tempatLahir`, `tanggalLahir`, `agama`, `alamat`, `namaAyah`, `namaIbu`, `noHP`, `kelas`, `status`, `foto`, `createdAt`, `updatedAt`) VALUES
('seed-siswa-001', '20240001', '', 'Andi Pratama', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10A', 'aktif', '', NOW(), NOW()),
('seed-siswa-002', '20240002', '', 'Budi Setiawan', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10A', 'aktif', '', NOW(), NOW()),
('seed-siswa-003', '20240003', '', 'Citra Dewi', 'Perempuan', '', '', 'Islam', '', '', '', '', '10A', 'aktif', '', NOW(), NOW()),
('seed-siswa-004', '20240004', '', 'Dian Permata', 'Perempuan', '', '', 'Islam', '', '', '', '', '10A', 'aktif', '', NOW(), NOW()),
('seed-siswa-005', '20240005', '', 'Eko Saputra', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10B', 'aktif', '', NOW(), NOW()),
('seed-siswa-006', '20240006', '', 'Fani Oktavia', 'Perempuan', '', '', 'Islam', '', '', '', '', '10B', 'aktif', '', NOW(), NOW()),
('seed-siswa-007', '20240007', '', 'Gilang Ramadhan', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10B', 'aktif', '', NOW(), NOW()),
('seed-siswa-008', '20240008', '', 'Hani Mulyani', 'Perempuan', '', '', 'Islam', '', '', '', '', '10B', 'aktif', '', NOW(), NOW()),
('seed-siswa-009', '20240009', '', 'Irfan Hakim', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11A', 'aktif', '', NOW(), NOW()),
('seed-siswa-010', '20240010', '', 'Joko Widodo', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11A', 'aktif', '', NOW(), NOW()),
('seed-siswa-011', '20240011', '', 'Kartika Sari', 'Perempuan', '', '', 'Islam', '', '', '', '', '11A', 'aktif', '', NOW(), NOW()),
('seed-siswa-012', '20240012', '', 'Lina Marlina', 'Perempuan', '', '', 'Islam', '', '', '', '', '11A', 'aktif', '', NOW(), NOW()),
('seed-siswa-013', '20240013', '', 'Muhammad Rizki', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11B', 'aktif', '', NOW(), NOW()),
('seed-siswa-014', '20240014', '', 'Nur Aini', 'Perempuan', '', '', 'Islam', '', '', '', '', '11B', 'aktif', '', NOW(), NOW()),
('seed-siswa-015', '20240015', '', 'Oscar Pratama', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11B', 'aktif', '', NOW(), NOW()),
('seed-siswa-016', '20240016', '', 'Putri Amelia', 'Perempuan', '', '', 'Islam', '', '', '', '', '11B', 'aktif', '', NOW(), NOW()),
('seed-siswa-017', '20240017', '', 'Qori Ananda', 'Perempuan', '', '', 'Islam', '', '', '', '', '12A', 'aktif', '', NOW(), NOW()),
('seed-siswa-018', '20240018', '', 'Rizky Aditya', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12A', 'aktif', '', NOW(), NOW()),
('seed-siswa-019', '20240019', '', 'Sinta Maharani', 'Perempuan', '', '', 'Islam', '', '', '', '', '12A', 'aktif', '', NOW(), NOW()),
('seed-siswa-020', '20240020', '', 'Taufik Hidayat', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12A', 'aktif', '', NOW(), NOW()),
('seed-siswa-021', '20240021', '', 'Umar Faruq', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12B', 'aktif', '', NOW(), NOW()),
('seed-siswa-022', '20240022', '', 'Vina Oktaviani', 'Perempuan', '', '', 'Islam', '', '', '', '', '12B', 'aktif', '', NOW(), NOW()),
('seed-siswa-023', '20240023', '', 'Wahyu Setiabudi', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12B', 'aktif', '', NOW(), NOW()),
('seed-siswa-024', '20240024', '', 'Yuni Astuti', 'Perempuan', '', '', 'Islam', '', '', '', '', '12B', 'aktif', '', NOW(), NOW());

-- ----------------------------------------
-- 9. Kelas
-- ----------------------------------------
DROP TABLE IF EXISTS `Kelas`;
CREATE TABLE `Kelas` (
  `id` VARCHAR(191) PRIMARY KEY,
  `kodeKelas` VARCHAR(191) UNIQUE,
  `namaKelas` VARCHAR(191),
  `waliKelas` VARCHAR(191),
  `status` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Kelas` (`id`, `kodeKelas`, `namaKelas`, `waliKelas`, `status`) VALUES
('seed-kelas-001', '10A', 'X-A', 'Sri Wahyuni, S.Pd', 'aktif'),
('seed-kelas-002', '10B', 'X-B', '', 'aktif'),
('seed-kelas-003', '11A', 'XI-A', '', 'aktif'),
('seed-kelas-004', '11B', 'XI-B', '', 'aktif'),
('seed-kelas-005', '12A', 'XII-A', '', 'aktif'),
('seed-kelas-006', '12B', 'XII-B', '', 'aktif');

-- ----------------------------------------
-- 10. MataPelajaran
-- ----------------------------------------
DROP TABLE IF EXISTS `MataPelajaran`;
CREATE TABLE `MataPelajaran` (
  `id` VARCHAR(191) PRIMARY KEY,
  `kodeMapel` VARCHAR(191) UNIQUE,
  `namaMapel` VARCHAR(191),
  `kkm` INT,
  `guru` VARCHAR(191),
  `status` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `MataPelajaran` (`id`, `kodeMapel`, `namaMapel`, `kkm`, `guru`, `status`) VALUES
('seed-mapel-001', 'MTK', 'Matematika', 75, 'Ahmad Fauzi, S.Pd', 'aktif'),
('seed-mapel-002', 'BIN', 'Bahasa Indonesia', 75, 'Sri Wahyuni, S.Pd', 'aktif'),
('seed-mapel-003', 'FIS', 'Fisika', 75, 'Bambang Irawan, M.Pd', 'aktif'),
('seed-mapel-004', 'KIM', 'Kimia', 75, 'Rina Susanti, S.Pd', 'aktif'),
('seed-mapel-005', 'BIO', 'Biologi', 75, 'Hendra Wijaya, S.Si', 'aktif'),
('seed-mapel-006', 'BIG', 'Bahasa Inggris', 75, 'Diana Putri, S.Pd', 'aktif'),
('seed-mapel-007', 'SEJ', 'Sejarah', 75, 'Agus Supriyadi, S.Pd', 'aktif'),
('seed-mapel-008', 'EKO', 'Ekonomi', 75, 'Fitri Handayani, S.Pd', 'aktif'),
('seed-mapel-009', 'GEO', 'Geografi', 75, 'Rudi Hartono, S.Pd', 'aktif'),
('seed-mapel-010', 'SOS', 'Sosiologi', 75, 'Lestari Ningrum, S.Pd', 'aktif'),
('seed-mapel-011', 'INF', 'Informatika', 75, 'Wahyu Prasetyo, S.Kom', 'aktif'),
('seed-mapel-012', 'PKN', 'PKN', 75, 'Anita Sari, S.Pd', 'aktif');

-- ----------------------------------------
-- 11. TahunAjaran
-- ----------------------------------------
DROP TABLE IF EXISTS `TahunAjaran`;
CREATE TABLE `TahunAjaran` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nama` VARCHAR(191) UNIQUE,
  `status` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `TahunAjaran` (`id`, `nama`, `status`) VALUES
('seed-ta-001', '2024/2025', 'aktif'),
('seed-ta-002', '2023/2024', 'tidak');

-- ----------------------------------------
-- 12. Semester
-- ----------------------------------------
DROP TABLE IF EXISTS `Semester`;
CREATE TABLE `Semester` (
  `id` VARCHAR(191) PRIMARY KEY,
  `semester` VARCHAR(191) UNIQUE,
  `status` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Semester` (`id`, `semester`, `status`) VALUES
('seed-sem-001', 'Ganjil', 'tidak'),
('seed-sem-002', 'Genap', 'aktif');

-- ----------------------------------------
-- 13. Nilai
-- ----------------------------------------
DROP TABLE IF EXISTS `Nilai`;
CREATE TABLE `Nilai` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tahunAjaran` VARCHAR(191),
  `semester` VARCHAR(191),
  `kelas` VARCHAR(191),
  `mapel` VARCHAR(191),
  `guru` VARCHAR(191),
  `nis` VARCHAR(191),
  `nama` VARCHAR(191),
  `ph1` DOUBLE DEFAULT 0,
  `ph2` DOUBLE DEFAULT 0,
  `ph3` DOUBLE DEFAULT 0,
  `ph4` DOUBLE DEFAULT 0,
  `pts` DOUBLE DEFAULT 0,
  `pas` DOUBLE DEFAULT 0,
  `rataRata` DOUBLE DEFAULT 0,
  `nilaiAkhir` DOUBLE DEFAULT 0,
  `predikat` VARCHAR(191),
  `deskripsi` TEXT,
  `createdAt` DATETIME,
  `updatedAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------
-- 14. AbsensiGuru
-- ----------------------------------------
DROP TABLE IF EXISTS `AbsensiGuru`;
CREATE TABLE `AbsensiGuru` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tanggal` VARCHAR(191),
  `namaGuru` VARCHAR(191),
  `nip` VARCHAR(191),
  `jamMasuk` VARCHAR(191),
  `jamPulang` VARCHAR(191),
  `durasi` VARCHAR(191),
  `status` VARCHAR(191),
  `latitude` VARCHAR(191),
  `longitude` VARCHAR(191),
  `alamat` TEXT,
  `browser` VARCHAR(191),
  `device` VARCHAR(191),
  `ip` VARCHAR(191),
  `keterangan` TEXT,
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------
-- 15. AbsensiSiswa
-- ----------------------------------------
DROP TABLE IF EXISTS `AbsensiSiswa`;
CREATE TABLE `AbsensiSiswa` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tanggal` VARCHAR(191),
  `kelas` VARCHAR(191),
  `nis` VARCHAR(191),
  `nama` VARCHAR(191),
  `status` VARCHAR(191),
  `keterangan` VARCHAR(191),
  `guru` VARCHAR(191),
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------
-- 16. Pengumuman
-- ----------------------------------------
DROP TABLE IF EXISTS `Pengumuman`;
CREATE TABLE `Pengumuman` (
  `id` VARCHAR(191) PRIMARY KEY,
  `judul` VARCHAR(191),
  `isi` TEXT,
  `lampiran` TEXT,
  `tanggal` VARCHAR(191),
  `status` VARCHAR(191),
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Pengumuman` (`id`, `judul`, `isi`, `lampiran`, `tanggal`, `status`, `createdAt`) VALUES
('seed-pengumuman-001', 'Libur Hari Kemerdekaan', 'Diberitahukan bahwa tanggal 17 Agustus 2025 libur nasional dalam rangka memperingati Hari Kemerdekaan RI ke-80.', '', '2025-08-15', 'aktif', NOW()),
('seed-pengumuman-002', 'Ujian Tengah Semester Ganjil', 'UTS Ganjil akan dilaksanakan pada tanggal 6-11 Oktober 2025. Semua siswa diwajibkan hadir.', '', '2025-09-25', 'aktif', NOW());

-- ----------------------------------------
-- 17. AuditLog
-- ----------------------------------------
DROP TABLE IF EXISTS `AuditLog`;
CREATE TABLE `AuditLog` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tanggal` VARCHAR(191),
  `user` VARCHAR(191),
  `role` VARCHAR(191),
  `aktivitas` VARCHAR(191),
  `ip` VARCHAR(191),
  `detail` TEXT,
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------
-- 18. Backup
-- ----------------------------------------
DROP TABLE IF EXISTS `Backup`;
CREATE TABLE `Backup` (
  `id` VARCHAR(191) PRIMARY KEY,
  `namaFile` VARCHAR(191),
  `ukuran` VARCHAR(191),
  `tanggalBackup` VARCHAR(191),
  `status` VARCHAR(191),
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------
-- 19. Alumni
-- ----------------------------------------
DROP TABLE IF EXISTS `Alumni`;
CREATE TABLE `Alumni` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nis` VARCHAR(191),
  `nama` VARCHAR(191),
  `tahunLulus` VARCHAR(191),
  `keterangan` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------
-- 20. JurnalMengajar
-- ----------------------------------------
DROP TABLE IF EXISTS `JurnalMengajar`;
CREATE TABLE `JurnalMengajar` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tanggal` VARCHAR(191),
  `guru` VARCHAR(191),
  `kelas` VARCHAR(191),
  `mapel` VARCHAR(191),
  `materi` TEXT,
  `keterangan` TEXT,
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------
-- 21. RiwayatLogin
-- ----------------------------------------
DROP TABLE IF EXISTS `RiwayatLogin`;
CREATE TABLE `RiwayatLogin` (
  `id` VARCHAR(191) PRIMARY KEY,
  `user` VARCHAR(191),
  `role` VARCHAR(191),
  `waktuLogin` VARCHAR(191),
  `ipAddress` VARCHAR(191),
  `userAgent` VARCHAR(191),
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
