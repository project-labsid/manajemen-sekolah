# Task 5: API RBAC Updater

## Agent: api-rbac-updater

## Summary
Updated all 16 remaining API routes to use the RBAC permission system.

## Changes Made

### Infrastructure
- **src/lib/rbac.ts**: Added re-export of `initAuth` from `@/lib/auth` so all routes can import from a single module.

### Routes Updated (16 files)

| Route | GET | POST | PUT | DELETE |
|-------|-----|------|-----|--------|
| absensi-guru | `absensi-guru` | `absensi-guru:clock-in` + audit | `absensi-guru:clock-out` + audit | — |
| absensi-siswa | `absensi-siswa` | `absensi-siswa` + audit | `absensi-siswa` + audit | — |
| audit-log | `audit-log` | — | — | — |
| dashboard | `dashboard` | — | — | — |
| guru | `guru` | `guru` + audit | `guru` + audit | `guru` + `guru:delete` + audit |
| kelas | `kelas` | `kelas` + audit | `kelas` + audit | `kelas` + audit |
| laporan | `laporan` | — | — | — |
| mapel | `mapel` | `mapel` + audit | `mapel` + audit | `mapel` + audit |
| nilai | `nilai` | `nilai` + `nilai:edit` + audit | `nilai` + `nilai:edit` + audit | — |
| pengaturan | `pengaturan` | — | `pengaturan` + audit | — |
| pengumuman | `pengumuman` | `pengumuman:manage` + audit | `pengumuman:manage` + audit | `pengumuman:manage` + audit |
| profil | `profil` | `profil` | `profil` + audit | — |
| riwayat-login | `riwayat-login` | — | — | — |
| siswa | `siswa` | `siswa` + audit | `siswa` + audit | `siswa` + audit |
| users | `users` | `users` + audit (via createAuditLog) | `users` + audit (via createAuditLog) | `users` + audit (via createAuditLog) |
| api/route.ts (root) | `dashboard` | — | — | — |

### Pattern Applied
1. Import `{ authenticate, requirePermission, createAuditLog, initAuth, AuthError }` from `@/lib/rbac`
2. Call `await initAuth()` at start of each handler
3. Call `const user = authenticate(request)` (throws 401 if no token)
4. Call `await requirePermission(user, 'slug')` (throws 403 if no permission)
5. For mutation endpoints, call `createAuditLog(...)` after successful operation
6. Catch `AuthError` for 401/403 responses, other errors get 500

### Notes
- All existing business logic preserved intact
- `requireAnyPermission` used for DELETE guru (checks `guru` + `guru:delete`) and nilai POST/PUT (checks `nilai` + `nilai:edit`)
- users/route.ts: Replaced direct `db.auditLog.create` calls with `createAuditLog` helper
- Pre-existing lint error in rbac.ts (`no-unsafe-function-type` on `withAuth`) is NOT from this change
- auth/login, auth/me, and auth/logout were excluded per instructions
