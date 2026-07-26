---
Task ID: 2
Agent: Main Agent
Task: Fix all three issues: hydration error, logo replacement, guru data

Work Log:
- Verified AbsensiGuru.tsx hydration error was already fixed (p→span)
- Used z-ai image-edit CLI to remove background from uploaded logo IMG_20260725_195538_070.png
- Saved background-removed logo to /public/logo-no-bg.png
- Replaced /public/logo-tuweri.png with the new logo (also copied as logo.svg for login page)
- Updated Sidebar.tsx: changed logo path to /logo-no-bg.png, "TUWERI" → "MIS AL ASY'ARIYAH", subtitle → "Sistem Informasi Akademik"
- Updated LoginPage.tsx: changed logo path to /logo-no-bg.png, text → "MIS AL ASY'ARIYAH", subtitle → "Sistem Informasi Akademik"
- Updated Pengaturan.tsx: default school name → "MIS AL ASY'ARIYAH"
- Updated Pengaturan API: default school name → "MIS AL ASY'ARIYAH"
- Re-seeded database with correct data associations
- Verified guru dashboard API returns myMapel and kelasList correctly for ahmad (Matematika) and sri (B. Indonesia + X-A kelas)
- Verified all APIs work: dashboard, kelas, absensi-guru, pengumuman, nilai for guru role
- Ran lint - no errors
- Dev server running on port 3000, returns 200

Stage Summary:
- Background-removed logo deployed to /public/logo-no-bg.png and /public/logo-tuweri.png
- All branding updated to "MIS AL ASY'ARIYAH" across Sidebar, LoginPage, Pengaturan
- Guru dashboard correctly shows mapel and kelas data from dashboard API
- All API endpoints verified working for guru role (ahmad/guru123)
- No lint errors, server running cleanly
---
Task ID: 1
Agent: main
Task: Fix kelas and pelajaran not selectable by non-admin/superadmin roles

Work Log:
- Analyzed RBAC permissions: guru role lacked mapel permission, kelas API had overly restrictive data filtering
- Updated /api/mapel GET: broadened permissions to requireAnyPermission with mapel, nilai, absensi-siswa, rekap-nilai
- Added role-based filtering: guru/wali-kelas see only assigned mapel, other roles see all
- Updated /api/kelas GET: broadened permissions, non-admin roles now get all active kelas
- Fixed span nesting div (Skeleton) in AbsensiGuru.tsx
- Verified via agent-browser with 3 different role accounts

Stage Summary:
- Mapel API accessible by all non-admin roles that need it
- Kelas API returns all active kelas to all authenticated roles
- HTML nesting hydration error fixed
- Logo already correctly set up from previous session

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
- Note: `kurikulum` role doesn't exist in DB - user may need to create it first

Stage Summary:
- Store hasPermission no longer crashes when permissions array is undefined
- Pengumuman create/edit/delete now uses RBAC permission check
- Roles with access: super-admin, admin, operator, kepala-sekolah, wakil-kepala-sekolah, tata-usaha
- Lint passes clean
