# Task 2: Build ALL API Routes
## Agent: fullstack-developer
### Status: Completed

Built 16 API route files + auth middleware for SIAKAD school management system.

### Key files:
- `src/lib/auth.ts` — JWT middleware (crypto HMAC-SHA256, 24h expiry)
- `src/app/api/auth/login/route.ts` — POST login with bcrypt, RiwayatLogin + AuditLog
- `src/app/api/auth/logout/route.ts` — POST logout
- `src/app/api/auth/me/route.ts` — GET current user
- `src/app/api/dashboard/route.ts` — GET aggregated stats
- `src/app/api/guru/route.ts` — CRUD with search/pagination
- `src/app/api/siswa/route.ts` — CRUD with search/pagination/kelas filter
- `src/app/api/kelas/route.ts` — CRUD
- `src/app/api/mapel/route.ts` — CRUD
- `src/app/api/nilai/route.ts` — GET/POST/PUT with auto rataRata/nilaiAkhir/predikat
- `src/app/api/absensi-guru/route.ts` — GET/POST(masuk)/PUT(pulang)
- `src/app/api/absensi-siswa/route.ts` — GET/POST/PUT batch
- `src/app/api/pengumuman/route.ts` — CRUD
- `src/app/api/pengaturan/route.ts` — GET/PUT school settings
- `src/app/api/profil/route.ts` — GET/PUT profile + password change
- `src/app/api/audit-log/route.ts` — GET admin-only
- `src/app/api/laporan/route.ts` — GET nilai/absensi reports

All routes pass ESLint. DB is in sync.