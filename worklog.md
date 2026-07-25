# Worklog - SIAKAD TUWERI RBAC Implementation

---
Task ID: 1
Agent: main
Task: Implement full RBAC system + guru absen masuk/pulang + fix prior bugs

Work Log:
- Fixed hydration mismatch in page.tsx using useSyncExternalStore
- Fixed SelectItem empty value error in Laporan.tsx (value="" → value="all")
- Removed demo content (128 Guru, 1560 Siswa, 48 Kelas) from login page
- Added Role, Permission, RolePermission, UserRole tables to Prisma schema
- Created src/lib/rbac.ts with permission cache, authenticate(), requirePermission(), requireAnyPermission(), createAuditLog(), withAuth() helper
- Updated src/lib/auth.ts with getUserWithPermissions(), initAuth(), reloadPermissions()
- Wrote comprehensive seed with 35 permissions, 10 roles, 8 users, 15 guru, 6 kelas, 12 mapel, 24 siswa
- Updated all 16 API routes with RBAC permission checks + audit logging
- Updated Zustand store with permissions[], isSuperAdmin, hasPermission() method
- Updated Sidebar with permission-based menu filtering (each menu item has a permission slug)
- Added user info badge in sidebar showing name + role name
- Built guru absen masuk/pulang UI on GuruDashboard with live clock, status cards, action buttons
- Added page-level access control in page.tsx (403 page with "Kembali ke Dashboard" button)
- Updated Navbar to show roleName from RBAC instead of hardcoded text
- Fixed super-admin wildcard permission (wildcard-all in DB → * in frontend)
- Verified RBAC via API tests: Super Admin=200, Guru users=403, Guru absen=201, Kepsek dashboard=200

Stage Summary:
- Full RBAC with 10 roles and 35+ permissions stored in database
- All API routes protected with permission checks, returning 403 when unauthorized
- All mutations logged to AuditLog
- Guru can absen masuk/pulang directly from dashboard with live time display
- Sidebar dynamically shows only menus user has permission for
- Login accounts: admin/admin123 (Super Admin), adminsekolah/admin123, ahmad/guru123, kepsek/kepsek123, etc.
- Lint passes clean
