---
Task ID: 4
Agent: Main
Task: Perbaiki dropdown role kosong dan validasi role saat buat user

Work Log:
- Diagnosa: dropdown role kosong karena fetchRoles API call gagal silent
- Hapus dependensi API /api/roles, gunakan hardcoded ALL_ROLES constant langsung di komponen
- Ubah emptyForm.role dari 'guru' ke '' (memaksa user memilih role)
- Tambah validasi frontend: 'Role wajib dipilih' sebelum simpan
- Tambah validasi backend: role wajib diisi (return 400 jika kosong)
- Tambah field role di PUT endpoint agar role bisa diubah saat edit
- Hapus fallback role || 'guru' di backend create
- Tambah label merah * di field Role

Stage Summary:
- Dropdown sekarang selalu menampilkan 10 role tanpa dependensi API
- User tidak bisa disimpan tanpa memilih role
- Edit user sekarang bisa mengubah role
- Masalah 'user tidak bisa absen' disebabkan user dibuat tanpa role (sekarang dicegah)

---
Task ID: 3

Work Log:
- Verified store.ts permissions fix already in place (|| [] fallback)
- Verified pengumuman role restriction already in place
- Verified logo background already removed

- Fixed Rekap Nilai: Changed /api/nilai GET from requirePermission('nilai') to requireAnyPermission(['nilai', 'rekap-nilai']) so users with rekap-nilai permission can fetch nilai data
- Fixed Absen Siswa: Added nis and nama fields to handleSimpan absensiList (was missing, causing backend to fail finding/creating records with correct nis)
- Fixed Absen Siswa permissions: Changed from requirePermission('absensi-siswa') to requireAnyPermission(['absensi-siswa', 'absensi-siswa:view']) for GET/POST/PUT to allow non-wali-kelas guru
- Fixed Profil: Removed requirePermission('profil') from GET/PUT handlers so all authenticated users can view/edit their profile
- Fixed Profil page access: Added special case in page.tsx to skip permission check for 'profil' page
- Made Bell icon clickable: Added onClick={() => setPage('pengumuman')} with title tooltip in Navbar.tsx
- Added Riwayat Login DELETE: Added DELETE endpoint to /api/riwayat-login/route.ts (superadmin only) and delete button column in RiwayatLogin.tsx (visible only to super-admin role)
- Fixed Guru subject display: Updated /api/mapel GET to match guru names via multiple strategies (user.nama, Guru table by NIP, Guru table by exact name)
- Fixed Dashboard guru mapel: Applied same multi-strategy name matching in /api/dashboard/route.ts for mapel, nilai, and kelas queries
- Added guru filter to /api/nilai GET endpoint (new ?guru= query param)
- Fixed Guru attendance permissions: Changed absensi-guru POST from requirePermission('absensi-guru:clock-in') to requireAnyPermission(['absensi-guru:clock-in', 'absensi-guru']), same for PUT
- Added Sakit/Izin option for guru attendance: New dialog in AbsensiGuru.tsx with status selection (Sakit/Izin), mandatory keterangan, and API support (status field in POST, server-side validation)
- Added Jadwal Pelajaran Saya: New section in GuruDashboard.tsx showing each mapel with associated kelas (derived from nilai records)
- Added CalendarDays icon import for jadwal section
- Ran bun run lint - clean, bunx next build - successful
- Dev server has pre-existing Turbopack crash issue (confirmed by testing original code)

Stage Summary:
- 13 fixes/features implemented across 13 files
- Rekap nilai: users with rekap-nilai permission can now fetch data
- Absen siswa: all statuses (Hadir/Sakit/Izin/Alpha) now save correctly (nis/nama were missing from API payload)
- Non-wali-kelas guru can now access absensi siswa (broadened permission check)
- All authenticated users can edit their own profile (removed permission requirement)
- Bell icon navigates to pengumuman page
- Superadmin can delete riwayat login entries
- Guru subject display uses multi-strategy name matching (user.nama + Guru table NIP linkage)
- Guru attendance: accepts base 'absensi-guru' permission alongside specific clock-in/clock-out permissions
- Sakit/Izin: new dialog with mandatory keterangan, server-side validation
- Jadwal pelajaran: per-teacher view showing mapel with associated kelas
---
Task ID: 1
Agent: Main
Task: Fix hasPermission crash + Pengumuman role access

Work Log:
- Fixed `user.permissions.includes()` crash in store.ts by adding `|| []` fallback for undefined permissions
- Changed `const perms = user.permissions || []` before calling `.includes()`
- Updated Pengumuman component to use `hasPermission('pengumuman:manage')` instead of hardcoded `isAdmin` check
- Added `pengumuman:manage` permission to `kepala-sekolah` role in database
- Confirmed `super-admin` (wildcard), `admin`, `wakil-kepala-sekolah` already have the permission

Stage Summary:
- Store hasPermission no longer crashes when permissions array is undefined
- Pengumuman create/edit/delete now uses RBAC permission check
- Lihat catatan terbaru untuk detail lengkap
---
Task ID: 1
Agent: main
Task: Fix kelas and pelajaran not selectable by non-admin/superadmin roles

Work Log:
- Updated /api/mapel GET: broadened permissions, added role-based filtering
- Updated /api/kelas GET: broadened permissions, non-admin roles get all active kelas
- Fixed span nesting div (Skeleton) in AbsensiGuru.tsx


Stage Summary:
- Mapel API accessible by all non-admin roles
- Kelas API returns all active kelas to all authenticated roles
---
Task ID: 2
Agent: Main Agent
Task: Fix all three issues: hydration error, logo replacement, guru data

Work Log:
- Verified hydration error already fixed
- Used z-ai image-edit to remove background from logo
- Updated all branding to MIS AL ASY'ARIYAH
- Re-seeded database with correct data associations


Stage Summary:
- Background-removed logo deployed
- All branding updated across Sidebar, LoginPage, Pengaturan
- Guru dashboard correctly shows mapel and kelas data
