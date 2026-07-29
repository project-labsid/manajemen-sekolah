-- ========================================
-- SIAKAD Database - MySQL Script
-- Generated for phpMyAdmin import
-- ========================================

CREATE DATABASE IF NOT EXISTS `siakad_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `siakad_db`;

SET FOREIGN_KEY_CHECKS = 0;

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
('cmrzmpiqw0000rq9oro04azc7', 'SMA Negeri 1 Contoh', '', 'Jl. Pendidikan No. 1, Jakarta', '12345678', 'info@sman1contoh.sch.id', 'www.sman1contoh.sch.id', '021-12345678', 'Dr. Hj. Siti Aminah, M.Pd', '196801011990032001', 'Unggul, Berkarakter, Berprestasi', 'Mewujudkan sekolah unggul', '1. Meningkatkan mutu
2. Menumbuhkan akhlak mulia
3. Mengembangkan potensi siswa', 'Ganjil', '2024/2025', 'light', 0, '2026-07-25 00:26:31', '2026-07-25 00:26:31');

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
('cms0a4rpl000zoqreosxvvhnr', 'super-admin', 'Super Admin', 'Akses penuh terhadap seluruh sistem', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpo0012oqre8nqfkmsu', 'admin', 'Admin Sekolah', 'Mengelola seluruh operasional sekolah', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rqn002noqre3k7wuv52', 'operator', 'Operator Sekolah', 'Membantu administrasi sekolah', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rri0038oqrejlxnfc1m', 'kepala-sekolah', 'Kepala Sekolah', 'Monitoring dan persetujuan', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rs4003xoqrextrwgv51', 'wakil-kepala-sekolah', 'Wakil Kepala Sekolah', 'Supervisi akademik', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rsm004ooqresucpvkix', 'tata-usaha', 'Tata Usaha', 'Mengelola administrasi sekolah', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rsy0057oqreh7a100h3', 'guru', 'Guru', 'Guru mengajar', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rty005woqrethr8v369', 'wali-kelas', 'Wali Kelas', 'Guru dengan hak tambahan wali kelas', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4ruf006noqrehd112m3o', 'siswa', 'Siswa', 'Siswa (opsional)', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4run006yoqreyl5qthxq', 'orang-tua', 'Orang Tua', 'Orang Tua (opsional)', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14');

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
('cms0a4rom0000oqree5nvmin5', 'dashboard', 'Dashboard', 'dashboard', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4ron0001oqre8qxnqs2e', 'users', 'Data User', 'users', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rop0002oqredg4o40ca', 'roles', 'Manajemen Role', 'users', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rot0003oqreduz7b8hi', 'permissions', 'Manajemen Permission', 'users', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4row0004oqre41li4gy2', 'riwayat-login', 'Riwayat Login', 'users', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4roy0005oqrech6yzsc4', 'guru', 'Data Guru', 'master', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4roy0006oqreyhg6w0ma', 'guru:delete', 'Hapus Guru', 'master', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4roz0007oqreloc8wjni', 'siswa', 'Data Siswa', 'master', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp00008oqres2tzkpc2', 'kelas', 'Data Kelas', 'master', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp00009oqrej5r94h7i', 'mapel', 'Mata Pelajaran', 'master', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp1000aoqrevo087ylr', 'tahun-ajaran', 'Tahun Ajaran', 'master', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp2000boqred3506vpf', 'semester', 'Semester', 'master', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp3000coqrev23byr1n', 'nilai', 'Input Nilai', 'nilai', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp5000doqrect2lqp8n', 'nilai:edit', 'Edit Nilai', 'nilai', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp6000eoqre2inyzewd', 'nilai:import', 'Import Nilai', 'nilai', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp7000foqreqty1hme9', 'nilai:export', 'Export Nilai', 'nilai', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp7000goqrejedutnou', 'rekap-nilai', 'Rekap Nilai', 'nilai', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp8000hoqreyt8uzw4n', 'absensi-guru', 'Absensi Guru', 'absensi', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp8000ioqre70ht783h', 'absensi-guru:clock-in', 'Absen Masuk', 'absensi', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp9000joqreepqxpzwi', 'absensi-guru:clock-out', 'Absen Pulang', 'absensi', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rp9000koqre48cc96ky', 'absensi-siswa', 'Absensi Siswa', 'absensi', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpa000loqre2jpjli87', 'pengumuman', 'Lihat Pengumuman', 'pengumuman', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpa000moqregnwpmv33', 'pengumuman:manage', 'Kelola Pengumuman', 'pengumuman', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpb000noqreeczeapmu', 'laporan', 'Laporan', 'laporan', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpb000ooqre3915tno2', 'laporan:export', 'Export Laporan', 'laporan', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpc000poqrekuhqw769', 'audit-log', 'Audit Log', 'sistem', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpd000qoqreyvvv8zci', 'backup', 'Backup', 'sistem', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpe000roqreunhdvmut', 'restore', 'Restore', 'sistem', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpe000soqreujhq5zn3', 'pengaturan', 'Pengaturan', 'sistem', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpf000toqrea5tjujgq', 'manajemen-sekolah', 'Manajemen Sekolah', 'sistem', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpg000uoqretgh9omzc', 'profil', 'Profil', 'profil', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rph000voqre3cbslofu', 'import-data', 'Import Data', 'data', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpi000woqren59wy284', 'export-data', 'Export Data', 'data', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpi000xoqrer3hci9fl', 'cetak-dokumen', 'Cetak Dokumen', 'data', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4rpj000yoqre0o8zc6yu', 'wildcard-all', 'Akses Penuh (Super Admin)', 'sistem', 'aktif', '2026-07-25 11:22:14', '2026-07-25 11:22:14');

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
('cms0a4rxa0079oqrepzj50s1p', 'Super Admin', 'admin', '$2b$10$UzPArLNuHLa/X0WbhVwrfOwMKl0.UVWY/lWWrW4BYflNB1ay32pY.', 'admin123', 'super-admin', 'aktif', '', 'admin@tuweri.sch.id', '081234567890', '000000000', 'Super Administrator', '2026-07-29 03:45:21', '2026-07-25 11:22:14', '2026-07-29 03:45:21'),
('cms0a4rz9007coqren4d60eok', 'Budi Santoso', 'adminsekolah', '$2b$10$cLla.bif1uouw92c2Hyo4OskTErsf5Fm/7wb8.P.F7tCNH2Ccfdru', 'admin123', 'admin', 'aktif', '', '', '', '198501012010011001', 'Admin Sekolah', '2026-07-28 09:06:09', '2026-07-25 11:22:14', '2026-07-28 09:06:09'),
('cms0a4s18007foqreghyoyggi', 'Siti Aminah', 'operator', '$2b$10$HgLMP8mNng7MjQfH5Epo.O4zt7enk0X2ILqRiGr.AuztUGDQZWUSG', 'operator123', 'operator', 'aktif', '', '', '', '199001012015002001', 'Operator', NULL, '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4s36007ioqreqz3onkuf', 'Drs. Ahmad Hidayat, M.Pd', 'kepsek', '$2b$10$PMnoJmgTOxJTp3e33eag/OuraB3.rZsJpcjFl9Z7ll73V8oXlxY.e', 'kepsek123', 'kepala-sekolah', 'aktif', '', '', '', '197501012003121001', 'Kepala Sekolah', '2026-07-27 08:21:15', '2026-07-25 11:22:14', '2026-07-27 08:21:15'),
('cms0a4s55007loqreiztfmkfq', 'Ir. Rahmawati, M.Pd', 'wakasek', '$2b$10$i8RBtT4TxlnSbQsAlGTot.46b/RBQ56QJMTgzfGzZiOmGS977rl7u', 'wakasek123', 'wakil-kepala-sekolah', 'aktif', '', '', '', '198001012005012001', 'Wakil Kepala Sekolah', NULL, '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4s73007ooqre2glazbyi', 'Dewi Lestari', 'tu', '$2b$10$Udx83dPP5wxDboTciH729.SMmB8Wvnp44libqNBJJnsKLUZjvdTj6', 'tu123', 'tata-usaha', 'aktif', '', '', '', '199201012018002002', 'Tata Usaha', '2026-07-27 08:15:08', '2026-07-25 11:22:14', '2026-07-27 08:15:08'),
('cms0a4s92007roqreqy9gcub1', 'Ahmad Fauzi, S.Pd', 'ahmad', '$2b$10$AdbHnTPa3iXJGe0CnPSHWeulf7T32OGXXXuw3HyDALhB5wPhgBoNW', 'guru123', 'guru', 'aktif', '', '', '', '199001012015011001', 'Guru Matematika', '2026-07-26 17:42:22', '2026-07-25 11:22:14', '2026-07-26 17:42:22'),
('cms0a4sb0007uoqre6f2ermtd', 'Sri Wahyuni, S.Pd', 'sri', '$2b$10$JB1CFaOW2Mw5h.vh2h1B8uvh1QVvc03yjD55DzDij3e.YOAKPWSnS', 'guru123', 'wali-kelas', 'aktif', '', '', '', '199201012020012002', 'Guru / Wali Kelas', '2026-07-26 16:44:51', '2026-07-25 11:22:14', '2026-07-26 16:44:51'),
('cms38npg9000er0vrsogwcctg', 'Nisa Aulia', 'nisaaulia', '$2b$10$8s9vxQCyMeZX8bYFiq9ATumLhqOdysS/ku3hWtn6ZNZKkoHmBCEp6', 'Nisa123', 'admin', 'aktif', '', 'nisaaulia@gmail.com', '-', '-', 'guru', '2026-07-28 18:55:12', '2026-07-27 13:04:17', '2026-07-28 18:55:12'),
('cms4flbsc0002m4fe70sny42e', 'Nisa Aulia', 'nisa', '$2b$10$A6mR0/NDr3mkGlThegowb.f.3SG15wU8z3VQVm6jWzI.psOiRCEli', 'nisa123', 'guru', 'aktif', '', '', '', '199501012020012003', 'Guru Bahasa Arab', NULL, '2026-07-28 09:06:09', '2026-07-28 09:06:09');

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
('cms0a4rpn0011oqre40g83bnn', 'cms0a4rpl000zoqreosxvvhnr', 'cms0a4rpj000yoqre0o8zc6yu', '2026-07-25 11:22:14'),
('cms0a4rpq0014oqre4qyv19yq', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4rpr0016oqre97yivgqm', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4ron0001oqre8qxnqs2e', '2026-07-25 11:22:14'),
('cms0a4rps0018oqreq33ooflk', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4row0004oqre41li4gy2', '2026-07-25 11:22:14'),
('cms0a4rps001aoqresq0ypesj', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4roy0005oqrech6yzsc4', '2026-07-25 11:22:14'),
('cms0a4rpu001coqre5ntw4fii', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4roz0007oqreloc8wjni', '2026-07-25 11:22:14'),
('cms0a4rpv001eoqred5tgxiq4', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp00008oqres2tzkpc2', '2026-07-25 11:22:14'),
('cms0a4rpw001goqre962jsaxv', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp00009oqrej5r94h7i', '2026-07-25 11:22:14'),
('cms0a4rpy001ioqreqss2yo30', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp1000aoqrevo087ylr', '2026-07-25 11:22:14'),
('cms0a4rpy001koqre8opclbh4', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp2000boqred3506vpf', '2026-07-25 11:22:14'),
('cms0a4rpz001moqrexep3misp', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp3000coqrev23byr1n', '2026-07-25 11:22:14'),
('cms0a4rq1001ooqre3bqeijzb', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp5000doqrect2lqp8n', '2026-07-25 11:22:14'),
('cms0a4rq2001qoqre2k7rko1v', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp6000eoqre2inyzewd', '2026-07-25 11:22:14'),
('cms0a4rq3001soqredbl53jn2', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp7000foqreqty1hme9', '2026-07-25 11:22:14'),
('cms0a4rq4001uoqre8i3blvzy', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp7000goqrejedutnou', '2026-07-25 11:22:14'),
('cms0a4rq5001woqre3aslrl7p', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp8000hoqreyt8uzw4n', '2026-07-25 11:22:14'),
('cms0a4rq6001yoqreb3xs4tcc', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rp9000koqre48cc96ky', '2026-07-25 11:22:14'),
('cms0a4rq70020oqreycm6ugyo', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4rq80022oqrexis01z4n', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpa000moqregnwpmv33', '2026-07-25 11:22:14'),
('cms0a4rq90024oqre7ke7395a', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpb000noqreeczeapmu', '2026-07-25 11:22:14'),
('cms0a4rqa0026oqreeewcr3tt', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpb000ooqre3915tno2', '2026-07-25 11:22:14'),
('cms0a4rqe0028oqre49c4i1sh', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpd000qoqreyvvv8zci', '2026-07-25 11:22:14'),
('cms0a4rqf002aoqrem143hk13', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpe000roqreunhdvmut', '2026-07-25 11:22:14'),
('cms0a4rqh002coqreo6ott7pe', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpe000soqreujhq5zn3', '2026-07-25 11:22:14'),
('cms0a4rqi002eoqrepugqneaw', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpf000toqrea5tjujgq', '2026-07-25 11:22:14'),
('cms0a4rqj002goqremfxhwzfu', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rph000voqre3cbslofu', '2026-07-25 11:22:14'),
('cms0a4rqk002ioqrezrbbl5a3', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpi000woqren59wy284', '2026-07-25 11:22:14'),
('cms0a4rql002koqreh6kbuyy9', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpi000xoqrer3hci9fl', '2026-07-25 11:22:14'),
('cms0a4rqm002moqre3jf94slm', 'cms0a4rpo0012oqre8nqfkmsu', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms0a4rqo002poqrew0vxyxeb', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4rr6002roqrednin3868', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4roy0005oqrech6yzsc4', '2026-07-25 11:22:14'),
('cms0a4rr8002toqrevrvaewqe', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4roz0007oqreloc8wjni', '2026-07-25 11:22:14'),
('cms0a4rr9002voqrey9e6r8wq', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rph000voqre3cbslofu', '2026-07-25 11:22:14'),
('cms0a4rrb002xoqre9wxq483v', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rpi000woqren59wy284', '2026-07-25 11:22:14'),
('cms0a4rrc002zoqreijsi9jty', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4rrd0031oqrelhg0hq97', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rpa000moqregnwpmv33', '2026-07-25 11:22:14'),
('cms0a4rre0033oqrethftyujb', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rpb000noqreeczeapmu', '2026-07-25 11:22:14'),
('cms0a4rrg0035oqre1q93dh8w', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rpb000ooqre3915tno2', '2026-07-25 11:22:14'),
('cms0a4rrh0037oqrefdrazwga', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms0a4rrk003aoqrexb3fkkjq', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4rrm003coqre5rrg0ycd', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4roy0005oqrech6yzsc4', '2026-07-25 11:22:14'),
('cms0a4rro003eoqrevpbabzb9', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4roz0007oqreloc8wjni', '2026-07-25 11:22:14'),
('cms0a4rrp003goqrek2jvusbu', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rp3000coqrev23byr1n', '2026-07-25 11:22:14'),
('cms0a4rrr003ioqre3qwxk9x4', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rp7000goqrejedutnou', '2026-07-25 11:22:14'),
('cms0a4rrs003koqrez7a4lrx1', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rp8000hoqreyt8uzw4n', '2026-07-25 11:22:14'),
('cms0a4rrt003moqref2clbd0c', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rp9000koqre48cc96ky', '2026-07-25 11:22:14'),
('cms0a4rru003ooqre3gj8oz2d', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4rry003qoqrehhwja37r', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rpb000noqreeczeapmu', '2026-07-25 11:22:14'),
('cms0a4rs0003soqremd52pu2f', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rpb000ooqre3915tno2', '2026-07-25 11:22:14'),
('cms0a4rs2003uoqreih8xli82', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rpi000xoqrer3hci9fl', '2026-07-25 11:22:14'),
('cms0a4rs3003woqresjoyfxr8', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms0a4rs5003zoqre7app3q8d', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4rs60041oqreyfpceuiq', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4roy0005oqrech6yzsc4', '2026-07-25 11:22:14'),
('cms0a4rs80043oqrey70c7pok', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4roz0007oqreloc8wjni', '2026-07-25 11:22:14'),
('cms0a4rs90045oqrebvyq7su2', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rp3000coqrev23byr1n', '2026-07-25 11:22:14'),
('cms0a4rsa0047oqrez786c0e7', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rp7000goqrejedutnou', '2026-07-25 11:22:14'),
('cms0a4rsb0049oqretz9pfskx', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rp8000hoqreyt8uzw4n', '2026-07-25 11:22:14'),
('cms0a4rsb004boqre8peadjgn', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rp9000koqre48cc96ky', '2026-07-25 11:22:14'),
('cms0a4rsd004doqrevod0xwe6', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4rse004foqreqqy94epj', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rpa000moqregnwpmv33', '2026-07-25 11:22:14'),
('cms0a4rsg004hoqrexqr0fj3x', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rpb000noqreeczeapmu', '2026-07-25 11:22:14'),
('cms0a4rsi004joqresh5bjrwx', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rpb000ooqre3915tno2', '2026-07-25 11:22:14'),
('cms0a4rsj004loqreq3jqonwh', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rpi000xoqrer3hci9fl', '2026-07-25 11:22:14'),
('cms0a4rsl004noqre7qiodax8', 'cms0a4rs4003xoqrextrwgv51', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms0a4rsn004qoqre4ti8agsb', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4rso004soqrew1d2jift', 'cms0a4rsm004ooqresucpvkix', 'cms0a4roy0005oqrech6yzsc4', '2026-07-25 11:22:14'),
('cms0a4rsq004uoqreo879obxa', 'cms0a4rsm004ooqresucpvkix', 'cms0a4roz0007oqreloc8wjni', '2026-07-25 11:22:14'),
('cms0a4rsr004woqre5djizw7y', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rph000voqre3cbslofu', '2026-07-25 11:22:14'),
('cms0a4rss004yoqre8ehutiqd', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rpi000woqren59wy284', '2026-07-25 11:22:14'),
('cms0a4rst0050oqreng3y8zmm', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rpi000xoqrer3hci9fl', '2026-07-25 11:22:14'),
('cms0a4rsu0052oqre1q37rfjf', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4rsw0054oqreen7tr2hj', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rpa000moqregnwpmv33', '2026-07-25 11:22:14'),
('cms0a4rsx0056oqredamwd1hq', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms0a4rsz0059oqrewvzocxc9', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4rt0005boqre41xzrtja', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp8000hoqreyt8uzw4n', '2026-07-25 11:22:14'),
('cms0a4rt2005doqrecnmnrlxj', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp8000ioqre70ht783h', '2026-07-25 11:22:14'),
('cms0a4rt3005foqre5zmpgikr', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp9000joqreepqxpzwi', '2026-07-25 11:22:14'),
('cms0a4rt5005hoqrew3vseg9a', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp9000koqre48cc96ky', '2026-07-25 11:22:14'),
('cms0a4rt6005joqres5nip2d7', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp3000coqrev23byr1n', '2026-07-25 11:22:14'),
('cms0a4rt7005loqre8jar40rk', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp5000doqrect2lqp8n', '2026-07-25 11:22:14'),
('cms0a4rt8005noqreaub650l7', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp6000eoqre2inyzewd', '2026-07-25 11:22:14'),
('cms0a4rta005poqreswzsgyh7', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp7000foqreqty1hme9', '2026-07-25 11:22:14'),
('cms0a4rtb005roqreo3rldkpo', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rp7000goqrejedutnou', '2026-07-25 11:22:14'),
('cms0a4rtc005toqrelpa738jt', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4rtx005voqre7ilaa1wc', 'cms0a4rsy0057oqreh7a100h3', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms0a4rtz005yoqrexh82dfpf', 'cms0a4rty005woqrethr8v369', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4ru00060oqrem4cl8w10', 'cms0a4rty005woqrethr8v369', 'cms0a4rp8000hoqreyt8uzw4n', '2026-07-25 11:22:14'),
('cms0a4ru20062oqrepe5ugyay', 'cms0a4rty005woqrethr8v369', 'cms0a4rp8000ioqre70ht783h', '2026-07-25 11:22:14'),
('cms0a4ru30064oqresgqxwpms', 'cms0a4rty005woqrethr8v369', 'cms0a4rp9000joqreepqxpzwi', '2026-07-25 11:22:14'),
('cms0a4ru40066oqrekamqw2w1', 'cms0a4rty005woqrethr8v369', 'cms0a4rp9000koqre48cc96ky', '2026-07-25 11:22:14'),
('cms0a4ru50068oqrepeuriv6n', 'cms0a4rty005woqrethr8v369', 'cms0a4rp3000coqrev23byr1n', '2026-07-25 11:22:14'),
('cms0a4ru6006aoqrexmmylz0n', 'cms0a4rty005woqrethr8v369', 'cms0a4rp5000doqrect2lqp8n', '2026-07-25 11:22:14'),
('cms0a4ru8006coqrehgneli8l', 'cms0a4rty005woqrethr8v369', 'cms0a4rp6000eoqre2inyzewd', '2026-07-25 11:22:14'),
('cms0a4ru9006eoqregphgi1re', 'cms0a4rty005woqrethr8v369', 'cms0a4rp7000foqreqty1hme9', '2026-07-25 11:22:14'),
('cms0a4rua006goqrevvy12rek', 'cms0a4rty005woqrethr8v369', 'cms0a4rp7000goqrejedutnou', '2026-07-25 11:22:14'),
('cms0a4ruc006ioqrecwc1bbyw', 'cms0a4rty005woqrethr8v369', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4rud006koqrehg3niqmy', 'cms0a4rty005woqrethr8v369', 'cms0a4rpi000xoqrer3hci9fl', '2026-07-25 11:22:14'),
('cms0a4rue006moqreix40mjyh', 'cms0a4rty005woqrethr8v369', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms0a4rug006poqrefi7n4aku', 'cms0a4ruf006noqrehd112m3o', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4ruh006roqrebuyutd83', 'cms0a4ruf006noqrehd112m3o', 'cms0a4rp3000coqrev23byr1n', '2026-07-25 11:22:14'),
('cms0a4ruj006toqrefwoimyjs', 'cms0a4ruf006noqrehd112m3o', 'cms0a4rp9000koqre48cc96ky', '2026-07-25 11:22:14'),
('cms0a4ruk006voqre7t24fyqg', 'cms0a4ruf006noqrehd112m3o', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4rul006xoqrel8wkjcty', 'cms0a4ruf006noqrehd112m3o', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms0a4ruo0070oqrejcyf5crk', 'cms0a4run006yoqreyl5qthxq', 'cms0a4rom0000oqree5nvmin5', '2026-07-25 11:22:14'),
('cms0a4rup0072oqreoihkf2bs', 'cms0a4run006yoqreyl5qthxq', 'cms0a4rp3000coqrev23byr1n', '2026-07-25 11:22:14'),
('cms0a4ruq0074oqregr1m0lrm', 'cms0a4run006yoqreyl5qthxq', 'cms0a4rp9000koqre48cc96ky', '2026-07-25 11:22:14'),
('cms0a4rur0076oqrep10out9j', 'cms0a4run006yoqreyl5qthxq', 'cms0a4rpa000loqre2jpjli87', '2026-07-25 11:22:14'),
('cms0a4ruv0078oqrefs7gmkr0', 'cms0a4run006yoqreyl5qthxq', 'cms0a4rpg000uoqretgh9omzc', '2026-07-25 11:22:14'),
('cms1s5fsz0001p6illexogu50', 'cms0a4rri0038oqrejlxnfc1m', 'cms0a4rpa000moqregnwpmv33', '2026-07-26 12:34:24'),
('cms50zpyw0001s3dw8ku1l0dm', 'cms0a4rpl000zoqreosxvvhnr', 'cms0a4rp8000hoqreyt8uzw4n', '2026-07-28 19:05:13'),
('cms50zpyy0003s3dwrt2xnygm', 'cms0a4rpl000zoqreosxvvhnr', 'cms0a4rp8000ioqre70ht783h', '2026-07-28 19:05:13'),
('cms50zpyz0005s3dwis0t18ri', 'cms0a4rpl000zoqreosxvvhnr', 'cms0a4rp9000joqreepqxpzwi', '2026-07-28 19:05:13'),
('cms50zpz10007s3dwy28xcugz', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rp8000hoqreyt8uzw4n', '2026-07-28 19:05:13'),
('cms50zpz30009s3dwe8jhlqh5', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rp8000ioqre70ht783h', '2026-07-28 19:05:13'),
('cms50zpz5000bs3dwjy45gy6c', 'cms0a4rqn002noqre3k7wuv52', 'cms0a4rp9000joqreepqxpzwi', '2026-07-28 19:05:13'),
('cms50zpz7000ds3dwolvnpl9q', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rp8000hoqreyt8uzw4n', '2026-07-28 19:05:13'),
('cms50zpz7000fs3dwrc7x7iw1', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rp8000ioqre70ht783h', '2026-07-28 19:05:13'),
('cms50zpz9000hs3dwllyn88fz', 'cms0a4rsm004ooqresucpvkix', 'cms0a4rp9000joqreepqxpzwi', '2026-07-28 19:05:13');

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
('cms0a4rxb007boqre97cdxp3h', 'cms0a4rxa0079oqrepzj50s1p', 'cms0a4rpl000zoqreosxvvhnr', '2026-07-25 11:22:14'),
('cms0a4rza007eoqre7b225ubl', 'cms0a4rz9007coqren4d60eok', 'cms0a4rpo0012oqre8nqfkmsu', '2026-07-25 11:22:14'),
('cms0a4s19007hoqre7elu7wey', 'cms0a4s18007foqreghyoyggi', 'cms0a4rqn002noqre3k7wuv52', '2026-07-25 11:22:14'),
('cms0a4s37007koqrebm7zb7il', 'cms0a4s36007ioqreqz3onkuf', 'cms0a4rri0038oqrejlxnfc1m', '2026-07-25 11:22:14'),
('cms0a4s56007noqretv5gq4pm', 'cms0a4s55007loqreiztfmkfq', 'cms0a4rs4003xoqrextrwgv51', '2026-07-25 11:22:14'),
('cms0a4s75007qoqree8lhk2k6', 'cms0a4s73007ooqre2glazbyi', 'cms0a4rsm004ooqresucpvkix', '2026-07-25 11:22:14'),
('cms0a4s93007toqreghk1ipp5', 'cms0a4s92007roqreqy9gcub1', 'cms0a4rsy0057oqreh7a100h3', '2026-07-25 11:22:14'),
('cms0a4sb2007woqre8tu03yw7', 'cms0a4sb0007uoqre6f2ermtd', 'cms0a4rty005woqrethr8v369', '2026-07-25 11:22:14');

DROP TABLE IF EXISTS `Guru`;
CREATE TABLE `Guru` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nip` VARCHAR(191) UNIQUE,
  `nama` VARCHAR(191),
  `gelar` VARCHAR(191),
  `jenisKelamin` VARCHAR(191),
  `tempatLahir` VARCHAR(191),
  `tanggalLahir` DATE,
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
('cms0a4sb2007xoqresvypsfev', '199001012015011001', 'Ahmad Fauzi, S.Pd', '', 'Laki-laki', '', '', '', '', '', 'Matematika', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb3007yoqrerva4phln', '199201012020012002', 'Sri Wahyuni, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Bahasa Indonesia', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb3007zoqrekh3vnp5t', '198803152010011003', 'Bambang Irawan, M.Pd', '', 'Laki-laki', '', '', '', '', '', 'Fisika', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb40080oqrejtv58k8h', '199105202018012004', 'Rina Susanti, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Kimia', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb50081oqreyjl0pi7x', '198706102009011005', 'Hendra Wijaya, S.Si', '', 'Laki-laki', '', '', '', '', '', 'Biologi', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb50082oqrely5d4yea', '199302152019012006', 'Diana Putri, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Bahasa Inggris', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb50083oqref2jys1or', '198511202008011007', 'Agus Supriyadi, S.Pd', '', 'Laki-laki', '', '', '', '', '', 'Sejarah', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb60084oqres2pxzxrp', '199408252020012008', 'Fitri Handayani, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Ekonomi', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb70085oqre0ap1qrz2', '198912302010011009', 'Rudi Hartono, S.Pd', '', 'Laki-laki', '', '', '', '', '', 'Geografi', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb70086oqre8rpopfxi', '199505102021012010', 'Lestari Ningrum, S.Pd', '', 'Perempuan', '', '', '', '', '', 'Sosiologi', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb80087oqrer4fx4ekn', '198607152011011011', 'Wahyu Prasetyo, S.Kom', '', 'Laki-laki', '', '', '', '', '', 'Informatika', 'aktif', '', '2026-07-25 11:22:14', '2026-07-25 11:22:14'),
('cms0a4sb90088oqreuykyq3l6', '199212202019012012', 'Anita Sari, S.Pd', '', 'Perempuan', '', '', '', 'sekolah@gmail.com', '', 'PKN', 'Aktif', '', '2026-07-25 11:22:14', '2026-07-26 13:14:54'),
('cms0a4sb90089oqrezyrileuz', '198410052007011013', 'Darmawan, M.Pd', '', 'Laki-laki', '', '', '', 'sekolah@gmail.com', '', 'Seni Budaya', 'Aktif', '', '2026-07-25 11:22:14', '2026-07-26 13:14:12'),
('cms0a4sba008aoqreiymyufy7', '199603012022012014', 'Mega Silvia, S.Pd', '', 'P', '', '', '', 'sekolah@gmail.com', '', 'PJOK', 'Aktif', '', '2026-07-25 11:22:14', '2026-07-26 13:14:37'),
('cms0a4sba008boqreul21qmze', '198908172012011015', 'Fajar Nugroho, S.Ag', '', 'Laki-laki', '', '', '', 'selolah@gmail.com', '', 'PAI', 'Aktif', '', '2026-07-25 11:22:14', '2026-07-26 13:13:43');

DROP TABLE IF EXISTS `Siswa`;
CREATE TABLE `Siswa` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nis` VARCHAR(191) UNIQUE,
  `nisn` VARCHAR(191),
  `nama` VARCHAR(191),
  `jenisKelamin` VARCHAR(191),
  `tempatLahir` VARCHAR(191),
  `tanggalLahir` DATE,
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
('cms0a4sbk008uoqredcp1wzfm', '20240001', '', 'Andi Pratama', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbl008voqrezo3586c9', '20240002', '', 'Budi Setiawan', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbl008woqreqcpnf2f2', '20240003', '', 'Citra Dewi', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbm008xoqrem91b1a86', '20240004', '', 'Dian Permata', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbm008yoqrehxc5d9cr', '20240005', '', 'Eko Saputra', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbn008zoqrebbj56s1t', '20240006', '', 'Fani Oktavia', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbn0090oqreycegpfj9', '20240007', '', 'Gilang Ramadhan', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbo0091oqrelgsre3x7', '20240008', '', 'Hani Mulyani', 'Laki-laki', '', '', 'Islam', '', '', '', '', '10B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbo0092oqreeucd53j8', '20240009', '', 'Irfan Hakim', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbo0093oqrejaqjljzp', '20240010', '', 'Joko Widodo', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbp0094oqrekmvz5xw8', '20240011', '', 'Kartika Sari', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbp0095oqrez6fx5223', '20240012', '', 'Lina Marlina', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbq0096oqrewjxvkf5x', '20240013', '', 'Muhammad Rizki', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbq0097oqrehbwy5xxl', '20240014', '', 'Nur Aini', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbq0098oqrexkqk9opw', '20240015', '', 'Oscar Pratama', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbr0099oqreqej9e9de', '20240016', '', 'Putri Amelia', 'Laki-laki', '', '', 'Islam', '', '', '', '', '11B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbr009aoqrebz8mpd2x', '20240017', '', 'Qori Ananda', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbs009boqre9rhp5r3m', '20240018', '', 'Rizky Aditya', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbs009coqrekalq5lky', '20240019', '', 'Sinta Maharani', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbt009doqrehlmolaql', '20240020', '', 'Taufik Hidayat', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12A', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbt009eoqreon6ssx9h', '20240021', '', 'Umar Faruq', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbt009foqre96kmlm4z', '20240022', '', 'Vina Oktaviani', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbu009goqrepw413lmu', '20240023', '', 'Wahyu Setiabudi', 'Laki-laki', '', '', 'Islam', '', '', '', '', '12B', 'aktif', '', '2026-07-25 11:22:15', '2026-07-25 11:22:15'),
('cms0a4sbu009hoqrettx81xc3', '20240024', '2113111', 'Yuni Astuti', 'P', '', '', 'Islam', '', '', '', '', '1', 'aktif', '', '2026-07-25 11:22:15', '2026-07-26 13:15:10'),
('cms0j5adv0007rqtk4fib6at0', '127492', '73628191', 'Amid', 'L', 'Purwakarta ', '2026-07-25', 'Islam', 'Hakaluva', 'Babak', 'Jahah', '', '1', 'aktif', '', '2026-07-25 15:34:34', '2026-07-26 13:15:19');

DROP TABLE IF EXISTS `Kelas`;
CREATE TABLE `Kelas` (
  `id` VARCHAR(191) PRIMARY KEY,
  `kodeKelas` VARCHAR(191) UNIQUE,
  `namaKelas` VARCHAR(191),
  `waliKelas` VARCHAR(191),
  `status` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Kelas` (`id`, `kodeKelas`, `namaKelas`, `waliKelas`, `status`) VALUES 
('cms0a4sbb008coqrefatetp1a', '10A', 'X-A', 'Sri Wahyuni, S.Pd', 'aktif'),
('cms0a4sbc008doqreksdhxrbz', '10B', 'X-B', '', 'aktif'),
('cms0a4sbc008eoqrep53dmt27', '11A', 'XI-A', '', 'aktif'),
('cms0a4sbc008foqre1cc8vocl', '11B', 'XI-B', '', 'aktif'),
('cms0a4sbd008goqre4km84a8c', '12A', 'XII-A', '', 'aktif'),
('cms0j3vmm0004rqtk9gb9qjxs', '1', 'Kelas 1', 'Siti', 'aktif'),
('cms1n645b0009p6to9o58wnhd', '2', 'kelas 2', 'sri', 'aktif');

DROP TABLE IF EXISTS `MataPelajaran`;
CREATE TABLE `MataPelajaran` (
  `id` VARCHAR(191) PRIMARY KEY,
  `kodeMapel` VARCHAR(191) UNIQUE,
  `namaMapel` VARCHAR(191),
  `kkm` INT DEFAULT 75,
  `guru` VARCHAR(191),
  `status` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `MataPelajaran` (`id`, `kodeMapel`, `namaMapel`, `kkm`, `guru`, `status`) VALUES 
('cms0a4sbe008ioqreaxttd4pg', 'MTK', 'Matematika', 75, 'Ahmad Fauzi, S.Pd', 'aktif'),
('cms0a4sbe008joqrepe89k8uw', 'BIN', 'Bahasa Indonesia', 75, 'Sri Wahyuni, S.Pd', 'aktif'),
('cms0a4sbf008koqreo2kwfcrc', 'FIS', 'Fisika', 75, 'Bambang Irawan, M.Pd', 'aktif'),
('cms0a4sbf008loqreykjh5uoj', 'KIM', 'Kimia', 75, 'Rina Susanti, S.Pd', 'aktif'),
('cms0a4sbg008moqrebe7agu2j', 'BIO', 'Biologi', 75, 'Hendra Wijaya, S.Si', 'aktif'),
('cms0a4sbg008noqred8i9xuu0', 'BIG', 'Bahasa Inggris', 75, 'Diana Putri, S.Pd', 'aktif'),
('cms0a4sbh008ooqrejdd1z3qn', 'SEJ', 'Sejarah', 75, 'Agus Supriyadi, S.Pd', 'aktif'),
('cms0a4sbi008poqre1pnshx6a', 'EKO', 'Ekonomi', 75, 'Fitri Handayani, S.Pd', 'aktif'),
('cms0a4sbi008qoqrewmz23rqj', 'GEO', 'Geografi', 75, 'Rudi Hartono, S.Pd', 'aktif'),
('cms0a4sbj008roqrexmdaij2t', 'SOS', 'Sosiologi', 75, 'Lestari Ningrum, S.Pd', 'aktif'),
('cms0a4sbj008soqrebjyvgsyt', 'INF', 'Informatika', 75, 'Wahyu Prasetyo, S.Kom', 'aktif'),
('cms0a4sbk008toqre81fuee3o', 'PKN', 'PKN', 75, 'Anita Sari, S.Pd', 'aktif');

DROP TABLE IF EXISTS `TahunAjaran`;
CREATE TABLE `TahunAjaran` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nama` VARCHAR(191) UNIQUE,
  `status` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `TahunAjaran` (`id`, `nama`, `status`) VALUES 
('cms0a4sbv009ioqrekppjch6p', '2024/2025', 'aktif'),
('cms0a4sbv009joqrerk7k5ow5', '2023/2024', 'tidak');

DROP TABLE IF EXISTS `Semester`;
CREATE TABLE `Semester` (
  `id` VARCHAR(191) PRIMARY KEY,
  `semester` VARCHAR(191) UNIQUE,
  `status` VARCHAR(191)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Semester` (`id`, `semester`, `status`) VALUES 
('cms0a4sbw009koqre2szd10w0', 'Ganjil', 'tidak'),
('cms0a4sbw009loqre9q6uvnnt', 'Genap', 'aktif');

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

DROP TABLE IF EXISTS `AbsensiGuru`;
CREATE TABLE `AbsensiGuru` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tanggal` DATE,
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

INSERT INTO `AbsensiGuru` (`id`, `tanggal`, `namaGuru`, `nip`, `jamMasuk`, `jamPulang`, `durasi`, `status`, `latitude`, `longitude`, `alamat`, `browser`, `device`, `ip`, `keterangan`, `createdAt`) VALUES 
('cms14y28d0000m6tk3qoehn5d', '2026-07-26', 'Sri Wahyuni, S.Pd', '199201012020012002', '01:44', '10:11', '8 jam 27 menit', 'Hadir', '', '', '', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '', '21.0.0.1', '', '2026-07-26 01:44:49'),
('cms1qsayk000ip6toqqtfrr6s', '2026-07-26', 'Super Admin', 'admin', '18:55', '23:39', '4 jam 44 menit', 'Hadir', '-6.5401915', '107.448717', '', 'Chrome 150.0.0.0', 'Windows PC', '21.0.0.1', '', '2026-07-26 11:56:12'),
('cms1ti3qt0010p6toytmm6ipf', '2026-07-26', 'Ahmad Fauzi, S.Pd', '199001012015011001', '13:12', '17:42', '4 jam 30 menit', 'Hadir', '', '', '', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '', '21.0.0.1', '', '2026-07-26 13:12:15'),
('cms2y63210000r0vrz58y9ied', '2026-07-27', 'Ahmad Fauzi, S.Pd', '199001012015011001', '08:10', '', '', 'Hadir', '', '', '', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '', '21.0.0.1', '', '2026-07-27 08:10:38'),
('cms330nzs0008r0vrv59r1piz', '2026-07-27', 'Drs. Ahmad Hidayat, M.Pd', 'kepsek', '17:25', '19:54', '2 jam 29 menit', 'Hadir', '-6.5401915', '107.448717', '', 'Chrome 150.0.0.0', 'Windows PC', '21.0.0.1', '', '2026-07-27 10:26:23'),
('cms38z0vh000nr0vrfestiaeo', '2026-07-27', 'Super Admin', 'admin', '20:12', '23:06', '2 jam 54 menit', 'Hadir', '', '', '', 'Chrome 150.0.0.0', 'Windows PC', '21.0.0.1', '', '2026-07-27 13:13:05');

DROP TABLE IF EXISTS `AbsensiSiswa`;
CREATE TABLE `AbsensiSiswa` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tanggal` DATE,
  `kelas` VARCHAR(191),
  `nis` VARCHAR(191),
  `nama` VARCHAR(191),
  `status` VARCHAR(191),
  `keterangan` TEXT,
  `guru` VARCHAR(191),
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `AbsensiSiswa` (`id`, `tanggal`, `kelas`, `nis`, `nama`, `status`, `keterangan`, `guru`, `createdAt`) VALUES 
('cms1qsupk000kp6toy295hmbr', '2026-07-26', '1', '', '', 'Hadir', '', 'Drs. Ahmad Hidayat, M.Pd', '2026-07-26 11:56:37'),
('cms1qtfhy000np6toxt2f6zat', '2026-07-26', '10A', '', '', 'Hadir', '', 'Super Admin', '2026-07-26 11:57:04'),
('cms3312uh000ar0vr7x98hhat', '2026-07-27', '1', '127492', 'Amid', 'Sakit', '', 'Drs. Ahmad Hidayat, M.Pd', '2026-07-27 10:26:43'),
('cms3312ui000br0vr526vudrg', '2026-07-27', '1', '20240024', 'Yuni Astuti', 'Hadir', '', 'Drs. Ahmad Hidayat, M.Pd', '2026-07-27 10:26:43'),
('cms38xyfw000ir0vrj2e9kvxr', '2026-07-27', '11A', '20240012', 'Lina Marlina', 'Sakit', '', 'Nisa Aulia', '2026-07-27 13:12:15'),
('cms38xyfz000jr0vrarh7tzzy', '2026-07-27', '11A', '20240010', 'Joko Widodo', 'Hadir', '', 'Nisa Aulia', '2026-07-27 13:12:15'),
('cms38xyg0000kr0vrrpfq4upi', '2026-07-27', '11A', '20240011', 'Kartika Sari', 'Alpha', '', 'Nisa Aulia', '2026-07-27 13:12:15'),
('cms38xyg2000lr0vr9018k8qm', '2026-07-27', '11A', '20240009', 'Irfan Hakim', 'Hadir', '', 'Nisa Aulia', '2026-07-27 13:12:15');

DROP TABLE IF EXISTS `Pengumuman`;
CREATE TABLE `Pengumuman` (
  `id` VARCHAR(191) PRIMARY KEY,
  `judul` VARCHAR(191),
  `isi` TEXT,
  `lampiran` TEXT,
  `tanggal` DATE,
  `status` VARCHAR(191),
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `AuditLog`;
CREATE TABLE `AuditLog` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tanggal` DATETIME,
  `user` VARCHAR(191),
  `role` VARCHAR(191),
  `aktivitas` TEXT,
  `ip` VARCHAR(191),
  `detail` TEXT,
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `AuditLog` (`id`, `tanggal`, `user`, `role`, `aktivitas`, `ip`, `detail`, `createdAt`) VALUES 
('cms0a4suy0015oqtj2y2be5mk', '2026-07-25', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Login', '::1', 'User sri berhasil login', '2026-07-25 11:22:15'),
('cms0a4v7k0017oqtjmviv9it4', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 11:22:18'),
('cms0a4vk60019oqtjb8s0zux2', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 11:22:19'),
('cms0a5188001boqtjzcmbmhjm', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 11:22:26'),
('cms0a53x6001doqtjm1ca35sx', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 11:22:30'),
('cms0a54gm001foqtj6n0w1mvj', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 11:22:30'),
('cms0a5hq7001hoqtj8jadaa2a', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 11:22:47'),
('cms0ei2kj0001scdef112dv8w', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 13:24:33'),
('cms0evq870001scjf8d3ehqn0', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 13:35:10'),
('cms0ewsut0003scjfas1bu94m', '2026-07-25', 'Super Admin', 'super-admin', 'Login', '::1', 'User admin berhasil login', '2026-07-25 13:36:00'),
('cms0iyd6d0001rqtk1krrpczv', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '21.0.0.1', 'User ahmad berhasil login', '2026-07-25 15:29:11'),
('cms0izlc00003rqtk01clq8ll', '2026-07-25', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-25 15:30:09'),
('cms0j5adw0008rqtkawklnno5', '2026-07-25', 'Super Admin', 'super-admin', 'Tambah Siswa', '21.0.0.1', 'Menambahkan siswa: Amid (NIS: 127492)', '2026-07-25 15:34:34'),
('cms0j5w9n0009rqtklsle37e2', '2026-07-25', 'Super Admin', 'super-admin', 'Edit Mata Pelajaran', '21.0.0.1', 'Mengedit mata pelajaran: Bahasa Indonesia (BIN)', '2026-07-25 15:35:03'),
('cms0j6qcj000brqtkiaradt1a', '2026-07-25', 'Budi Santoso', 'admin', 'Login', '21.0.0.1', 'User adminsekolah berhasil login', '2026-07-25 15:35:42'),
('cms0j8ki4000drqtks3japeko', '2026-07-25', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Login', '21.0.0.1', 'User sri berhasil login', '2026-07-25 15:37:08'),
('cms0k81wt000frqtk7qo7ymx1', '2026-07-25', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '::1', 'User ahmad berhasil login', '2026-07-25 16:04:43'),
('cms0kal2c000hrqtk3vlko2q6', '2026-07-25', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Login', '::1', 'User sri berhasil login', '2026-07-25 16:06:41'),
('cms0kborh000jrqtkg62320lo', '2026-07-25', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Login', '::1', 'User kepsek berhasil login', '2026-07-25 16:07:33'),
('cms14y28f0001m6tkof2eu3wy', '2026-07-26', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Clock In Guru', '21.0.0.1', 'Clock in absensi guru: Sri Wahyuni, S.Pd', '2026-07-26 01:44:49'),
('cms14z6o80003m6tkorpnjkqp', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-26 01:45:41'),
('cms17cj1n0005m6tk1dc111dn', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-26 02:52:03'),
('cms17e1of0006m6tkiqbt9pok', '2026-07-26', 'Super Admin', 'super-admin', 'Edit Siswa', '21.0.0.1', 'Mengedit siswa: Amid (NIS: 127492)', '2026-07-26 02:53:14'),
('cms1n19i60001p6toha7o3654', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-26 10:11:11'),
('cms1n24vn0003p6toktmwiw6z', '2026-07-26', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Login', '21.0.0.1', 'User sri berhasil login', '2026-07-26 10:11:52'),
('cms1n26tl0004p6to2wskvtbv', '2026-07-26', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Clock Out Guru', '21.0.0.1', 'Clock out absensi guru: Sri Wahyuni, S.Pd', '2026-07-26 10:11:55'),
('cms1n3t700006p6to7152zwx0', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-26 10:13:10'),
('cms1nfoku000dp6tomwpiwun8', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '::1', 'User admin berhasil login', '2026-07-26 10:22:24'),
('cms1ng79t000fp6tozx62lgrg', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '::1', 'User admin berhasil login', '2026-07-26 10:22:48'),
('cms1ohfy3000gp6tolk2o0wb3', '2026-07-26', 'Super Admin', 'super-admin', 'Edit Siswa', '21.0.0.1', 'Mengedit siswa: Yuni Astuti (NIS: 20240024)', '2026-07-26 10:51:46'),
('cms1ohn0i000hp6toie4itdbz', '2026-07-26', 'Super Admin', 'super-admin', 'Edit Siswa', '21.0.0.1', 'Mengedit siswa: Yuni Astuti (NIS: 20240024)', '2026-07-26 10:51:55'),
('cms1qsaym000jp6to6147zhjw', '2026-07-26', 'Super Admin', 'super-admin', 'Clock In Guru', '21.0.0.1', 'Clock in absensi guru: Super Admin', '2026-07-26 11:56:12'),
('cms1qsupm000lp6ton6if22uz', '2026-07-26', 'Super Admin', 'super-admin', 'Update Absensi Siswa', '21.0.0.1', 'Mengupdate 1 data absensi siswa', '2026-07-26 11:56:37'),
('cms1qt1eg000mp6toqezr73xs', '2026-07-26', 'Super Admin', 'super-admin', 'Update Absensi Siswa', '21.0.0.1', 'Mengupdate 1 data absensi siswa', '2026-07-26 11:56:46'),
('cms1qtfi2000op6toitpoar1f', '2026-07-26', 'Super Admin', 'super-admin', 'Update Absensi Siswa', '21.0.0.1', 'Mengupdate 4 data absensi siswa', '2026-07-26 11:57:04'),
('cms1qto9v000pp6tot0jn4tko', '2026-07-26', 'Super Admin', 'super-admin', 'Update Absensi Siswa', '21.0.0.1', 'Mengupdate 4 data absensi siswa', '2026-07-26 11:57:16'),
('cms1tb228000rp6towvt2rej8', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-26 13:06:46'),
('cms1tgqxh000xp6tolrg3kkz4', '2026-07-26', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Login', '21.0.0.1', 'User sri berhasil login', '2026-07-26 13:11:11'),
('cms1ti2cc000zp6toaxso7kb1', '2026-07-26', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '21.0.0.1', 'User ahmad berhasil login', '2026-07-26 13:12:13'),
('cms1ti3qv0011p6toip0j01z8', '2026-07-26', 'Ahmad Fauzi, S.Pd', 'guru', 'Clock In Guru', '21.0.0.1', 'Clock in absensi guru: Ahmad Fauzi, S.Pd', '2026-07-26 13:12:15'),
('cms1tj3n10013p6tovv800z36', '2026-07-26', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Login', '21.0.0.1', 'User kepsek berhasil login', '2026-07-26 13:13:01'),
('cms1tjzxj0014p6to8pl8p3ip', '2026-07-26', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Edit Guru', '21.0.0.1', 'Mengedit guru: Fajar Nugroho, S.Ag (NIP: 198908172012011015)', '2026-07-26 13:13:43'),
('cms1tklxt0015p6to99lbdzw0', '2026-07-26', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Edit Guru', '21.0.0.1', 'Mengedit guru: Darmawan, M.Pd (NIP: 198410052007011013)', '2026-07-26 13:14:12'),
('cms1tl5bd0016p6to1qx54b3s', '2026-07-26', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Edit Guru', '21.0.0.1', 'Mengedit guru: Mega Silvia, S.Pd (NIP: 199603012022012014)', '2026-07-26 13:14:37'),
('cms1tlip20017p6to6o6jnaaa', '2026-07-26', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Edit Guru', '21.0.0.1', 'Mengedit guru: Anita Sari, S.Pd (NIP: 199212202019012012)', '2026-07-26 13:14:54'),
('cms1tlusm0018p6topnvhoajf', '2026-07-26', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Edit Siswa', '21.0.0.1', 'Mengedit siswa: Yuni Astuti (NIS: 20240024)', '2026-07-26 13:15:10'),
('cms1tm1to0019p6toytyrxor1', '2026-07-26', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Edit Siswa', '21.0.0.1', 'Mengedit siswa: Amid (NIS: 127492)', '2026-07-26 13:15:19'),
('cms1tn0ww001ap6to43siiwnr', '2026-07-26', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Update Absensi Siswa', '21.0.0.1', 'Mengupdate 2 data absensi siswa', '2026-07-26 13:16:04'),
('cms1tsllm001cp6to0u0ixij4', '2026-07-26', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Login', '21.0.0.1', 'User sri berhasil login', '2026-07-26 13:20:24'),
('cms20uzug0001p6zewax62gmh', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '::1', 'User admin berhasil login', '2026-07-26 16:38:14'),
('cms20v3090003p6zetqa224eq', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '::1', 'User admin berhasil login', '2026-07-26 16:38:18'),
('cms20xk220004p6ze8lyo7nuj', '2026-07-26', 'Super Admin', 'super-admin', 'Clock Out Guru', '21.0.0.1', 'Clock out absensi guru: Super Admin', '2026-07-26 16:40:13'),
('cms2108dz0006p6zecd95jngu', '2026-07-26', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Login', '::1', 'User sri berhasil login', '2026-07-26 16:42:18'),
('cms212w6x0008p6zeb2jho7rw', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '::1', 'User admin berhasil login', '2026-07-26 16:44:22'),
('cms213ide000ap6ze5ia1or9e', '2026-07-26', 'Sri Wahyuni, S.Pd', 'wali-kelas', 'Login', '::1', 'User sri berhasil login', '2026-07-26 16:44:51'),
('cms21lmn6000cp6zenbojsyh5', '2026-07-26', 'Super Admin', 'super-admin', 'Login', '::1', 'User admin berhasil login', '2026-07-26 16:58:56'),
('cms235h1n0001q5ujiiu9v5dc', '2026-07-26', 'Ahmad Fauzi, S.Pd', 'guru', 'Login', '21.0.0.1', 'User ahmad berhasil login', '2026-07-26 17:42:22'),
('cms235j4q0002q5ujnj6mu88s', '2026-07-26', 'Ahmad Fauzi, S.Pd', 'guru', 'Clock Out Guru', '21.0.0.1', 'Clock out absensi guru: Ahmad Fauzi, S.Pd', '2026-07-26 17:42:24'),
('cms2y63220001r0vrj5u7j6tf', '2026-07-27', 'Ahmad Fauzi, S.Pd', 'guru', 'Absen Guru: Hadir', '21.0.0.1', 'Absensi guru: Ahmad Fauzi, S.Pd, status: Hadir', '2026-07-27 08:10:38'),
('cms2y6ev80003r0vr61r2cqb1', '2026-07-27', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-27 08:10:54'),
('cms2ybv920005r0vrt8kjytzb', '2026-07-27', 'Dewi Lestari', 'tata-usaha', 'Login', '21.0.0.1', 'User tu berhasil login', '2026-07-27 08:15:08'),
('cms2yjqqi0007r0vrjau52vuk', '2026-07-27', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Login', '21.0.0.1', 'User kepsek berhasil login', '2026-07-27 08:21:15'),
('cms330nzu0009r0vrgu3l0bub', '2026-07-27', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Absen Guru: Hadir', '21.0.0.1', 'Absensi guru: Drs. Ahmad Hidayat, M.Pd, status: Hadir', '2026-07-27 10:26:23'),
('cms3312uj000cr0vrtipef9rt', '2026-07-27', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Update Absensi Siswa', '21.0.0.1', 'Mengupdate 2 data absensi siswa', '2026-07-27 10:26:43'),
('cms38cijw000dr0vreieefuvx', '2026-07-27', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', 'Clock Out Guru', '21.0.0.1', 'Clock out absensi guru: Drs. Ahmad Hidayat, M.Pd', '2026-07-27 12:55:34'),
('cms38npgb000fr0vr2283ddxr', '2026-07-27', 'Super Admin', 'super-admin', 'Tambah User', '21.0.0.1', 'Menambahkan user nisaaulia (admin)', '2026-07-27 13:04:17'),
('cms38v16d000hr0vrf38sk8sn', '2026-07-27', 'Nisa Aulia', 'admin', 'Login', '21.0.0.1', 'User nisaaulia berhasil login', '2026-07-27 13:09:58'),
('cms38xyg3000mr0vr8si5kjov', '2026-07-27', 'Nisa Aulia', 'admin', 'Update Absensi Siswa', '21.0.0.1', 'Mengupdate 4 data absensi siswa', '2026-07-27 13:12:15'),
('cms38z0vl000or0vrz0kuskzq', '2026-07-27', 'Super Admin', 'super-admin', 'Absen Guru: Hadir', '21.0.0.1', 'Absensi guru: Super Admin, status: Hadir', '2026-07-27 13:13:05'),
('cms3f7eqv0000l1usonzaoyg4', '2026-07-27', 'Super Admin', 'super-admin', 'Clock Out Guru', '21.0.0.1', 'Clock out absensi guru: Super Admin', '2026-07-27 16:07:33'),
('cms4erf640001m4uobi9afyxf', '2026-07-28', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-28 08:42:54'),
('cms4fkauf0001m49n0omw58wr', '2026-07-28', 'Budi Santoso', 'admin', 'Login', '::1', 'User adminsekolah berhasil login', '2026-07-28 09:05:21'),
('cms4flbmf0001m4fe9dpub2am', '2026-07-28', 'Budi Santoso', 'admin', 'Login', '::1', 'User adminsekolah berhasil login', '2026-07-28 09:06:09'),
('cms4flbsd0003m4febvbkb38d', '2026-07-28', 'Budi Santoso', 'admin', 'Tambah User', '::1', 'Menambahkan user nisa (guru)', '2026-07-28 09:06:09'),
('cms50muwb0001s3vr98o70lvs', '2026-07-28', 'Nisa Aulia', 'admin', 'Login', '21.0.0.1', 'User nisaaulia berhasil login', '2026-07-28 18:55:12'),
('cms51szkv0001s3hpa5riw2zh', '2026-07-28', 'Super Admin', 'super-admin', 'Login', '::1', 'User admin berhasil login', '2026-07-28 19:27:58'),
('cms5jkmjt0001qktzotunn8ig', '2026-07-29', 'Super Admin', 'super-admin', 'Login', '21.0.0.1', 'User admin berhasil login', '2026-07-29 03:45:21');

DROP TABLE IF EXISTS `Backup`;
CREATE TABLE `Backup` (
  `id` VARCHAR(191) PRIMARY KEY,
  `namaFile` VARCHAR(191),
  `ukuran` VARCHAR(191),
  `tanggalBackup` DATETIME,
  `status` VARCHAR(191),
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `Alumni`;
CREATE TABLE `Alumni` (
  `id` VARCHAR(191) PRIMARY KEY,
  `nis` VARCHAR(191),
  `nama` VARCHAR(191),
  `tahunLulus` VARCHAR(191),
  `keterangan` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `JurnalMengajar`;
CREATE TABLE `JurnalMengajar` (
  `id` VARCHAR(191) PRIMARY KEY,
  `tanggal` DATE,
  `guru` VARCHAR(191),
  `kelas` VARCHAR(191),
  `mapel` VARCHAR(191),
  `materi` TEXT,
  `keterangan` TEXT,
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `RiwayatLogin`;
CREATE TABLE `RiwayatLogin` (
  `id` VARCHAR(191) PRIMARY KEY,
  `user` VARCHAR(191),
  `role` VARCHAR(191),
  `waktuLogin` DATETIME,
  `ipAddress` VARCHAR(191),
  `userAgent` TEXT,
  `createdAt` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `RiwayatLogin` (`id`, `user`, `role`, `waktuLogin`, `ipAddress`, `userAgent`, `createdAt`) VALUES 
('cms0a4vk50018oqtjmg6acdm7', 'Ahmad Fauzi, S.Pd', 'guru', '2026-07-25 11:22:19', '::1', 'curl/8.14.1', '2026-07-25 11:22:19'),
('cms0a5187001aoqtjqiqlxph2', 'Ahmad Fauzi, S.Pd', 'guru', '2026-07-25 11:22:26', '::1', 'curl/8.14.1', '2026-07-25 11:22:26'),
('cms0a53x6001coqtjcavns22w', 'Ahmad Fauzi, S.Pd', 'guru', '2026-07-25 11:22:30', '::1', 'curl/8.14.1', '2026-07-25 11:22:30'),
('cms0a54gl001eoqtjtoq7188x', 'Ahmad Fauzi, S.Pd', 'guru', '2026-07-25 11:22:30', '::1', 'curl/8.14.1', '2026-07-25 11:22:30'),
('cms0a5hq6001goqtj5ld3xjhn', 'Ahmad Fauzi, S.Pd', 'guru', '2026-07-25 11:22:47', '::1', 'curl/8.14.1', '2026-07-25 11:22:47'),
('cms0ei2kh0000scde1ptgug31', 'Ahmad Fauzi, S.Pd', 'guru', '2026-07-25 13:24:33', '::1', 'curl/8.14.1', '2026-07-25 13:24:33'),
('cms0evq840000scjf6gl3klji', 'Ahmad Fauzi, S.Pd', 'guru', '2026-07-25 13:35:10', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36', '2026-07-25 13:35:10'),
('cms0ewsus0002scjf1ark0m26', 'Super Admin', 'super-admin', '2026-07-25 13:36:00', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36', '2026-07-25 13:36:00'),
('cms0iyd6c0000rqtkfqrreyqq', 'Ahmad Fauzi, S.Pd', 'guru', '2026-07-25 15:29:11', '21.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '2026-07-25 15:29:11'),
('cms0izlbz0002rqtkx6376smt', 'Super Admin', 'super-admin', '2026-07-25 15:30:09', '21.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '2026-07-25 15:30:09'),
('cms0kal2b000grqtkrqt3fbqq', 'Sri Wahyuni, S.Pd', 'wali-kelas', '2026-07-25 16:06:41', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36', '2026-07-25 16:06:41'),
('cms0kborg000irqtktikw7444', 'Drs. Ahmad Hidayat, M.Pd', 'kepala-sekolah', '2026-07-25 16:07:33', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36', '2026-07-25 16:07:33'),
('cms14z6o80002m6tk6fwvk1fk', 'Super Admin', 'super-admin', '2026-07-26 01:45:41', '21.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '2026-07-26 01:45:41'),
('cms4fkaue0000m49nvoncitm7', 'Budi Santoso', 'admin', '2026-07-28 09:05:21', '::1', 'curl/8.14.1', '2026-07-28 09:05:21'),
('cms4flbme0000m4febg16n7c5', 'Budi Santoso', 'admin', '2026-07-28 09:06:09', '::1', 'curl/8.14.1', '2026-07-28 09:06:09'),
('cms50muwa0000s3vrigw58uax', 'Nisa Aulia', 'admin', '2026-07-28 18:55:12', '21.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-28 18:55:12'),
('cms51szkt0000s3hp9eyzzhat', 'Super Admin', 'super-admin', '2026-07-28 19:27:58', '::1', 'curl/8.14.1', '2026-07-28 19:27:58'),
('cms5jkmjr0000qktz3eyjw42n', 'Super Admin', 'super-admin', '2026-07-29 03:45:21', '21.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-29 03:45:21');

SET FOREIGN_KEY_CHECKS = 1;
