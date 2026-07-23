# SIAKAD Worklog

## Task 2: Build ALL API Routes
**Agent**: fullstack-developer
**Status**: ✅ Completed

### Files Created

#### Auth Middleware
- `src/lib/auth.ts` — JWT sign/verify using crypto HMAC-SHA256 with base64url encoding. Exports `signToken`, `verifyToken`, `getUserFromRequest`, `isAdmin`. 24h token expiry.

#### Auth API Routes
- `src/app/api/auth/login/route.ts` — POST login: validates username/password with bcryptjs, returns JWT + user data, logs to RiwayatLogin + AuditLog, updates lastLogin.
- `src/app/api/auth/logout/route.ts` — POST logout: logs audit entry, returns success.
- `src/app/api/auth/me/route.ts` — GET current user: decodes Bearer token, returns full user profile from DB.

#### Data API Routes
- `src/app/api/dashboard/route.ts` — GET aggregated stats: counts (guru, siswa, kelas, mapel), today's absensi, nilai averages, pass percentage, recent pengumuman, siswa per kelas.
- `src/app/api/guru/route.ts` — Full CRUD: GET (search + pagination), POST (create), PUT (update), DELETE (soft delete). Admin-only for mutations.
- `src/app/api/siswa/route.ts` — Full CRUD: GET (search + pagination + kelas filter), POST, PUT, DELETE (soft delete). Admin-only for mutations.
- `src/app/api/kelas/route.ts` — Full CRUD: GET (all, sorted), POST, PUT, DELETE (hard delete). Admin-only for mutations.
- `src/app/api/mapel/route.ts` — Full CRUD: GET (all, sorted), POST, PUT, DELETE (hard delete). Admin-only for mutations.
- `src/app/api/nilai/route.ts` — GET (filter by kelas/mapel/semester/tahunAjaran/nis), POST (upsert single nilai), PUT (batch save). Auto-calculates rataRata, nilaiAkhir, predikat.
- `src/app/api/absensi-guru/route.ts` — GET (filter by date/nama), POST (clock in), PUT (clock out with auto duration calc).
- `src/app/api/absensi-siswa/route.ts` — GET (filter by date/kelas with summary), POST (single), PUT (batch upsert).
- `src/app/api/pengumuman/route.ts` — Full CRUD: GET (with pagination + status filter), POST, PUT, DELETE. Admin-only for mutations.
- `src/app/api/pengaturan/route.ts` — GET (school settings, auto-creates if none), PUT (update all fields). Admin-only.
- `src/app/api/profil/route.ts` — GET (user profile), PUT (update profile + optional password change with old password verification).
- `src/app/api/audit-log/route.ts` — GET (paginated, search, admin-only).
- `src/app/api/laporan/route.ts` — GET report data with `tipe=nilai` (grouped by student, pass/fail stats) or `tipe=absensi` (per-student attendance with percentages).

### Design Decisions
- **Soft delete** for Guru and Siswa (sets status to 'dihapus'), **hard delete** for Kelas, Mapel, Pengumuman.
- **Nilai calculation**: rataRata = avg(PH1-PH4), nilaiAkhir = rataRata*0.4 + PTS*0.3 + PAS*0.3, predikat: A≥93, B≥84, C≥75, D<75.
- **No foreign key relations** in Prisma schema — kelas/mapel fields are strings, so aggregate queries use manual grouping.
- All routes use `getUserFromRequest()` for auth, return 401/403 appropriately.
- Lint passes with zero errors.
