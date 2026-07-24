---
Task ID: 1
Agent: Main
Task: Fix ChunkLoadError, remove demo from login, add TUWERI logo

Work Log:
- Audited all key project files (page.tsx, schema.prisma, seed.ts, store.ts, api.ts, all API routes, all components)
- Confirmed no file corruption from previous session
- Cleaned corrupted .next cache to fix ChunkLoadError
- Generated TUWERI logo using AI image generation (saved to public/logo-tuweri.png)
- Rewrote LoginPage.tsx: removed demo credentials box, added TUWERI logo via Next.js Image component
- Updated Sidebar.tsx: replaced GraduationCap icon with TUWERI logo image, changed branding text
- Updated Footer.tsx: changed copyright to TUWERI SIAKAD
- Updated Navbar.tsx: added missing page titles for 'users' and 'riwayat-login'
- Fixed package.json dev script (removed double-redirect that was causing issues)
- Ran prisma db push (schema already in sync)
- Ran prisma seed (admin + 15 guru + 6 kelas + 12 mapel + 24 siswa + absensi + nilai + pengumuman)
- Rebuilt production bundle (next build)
- Verified via agent-browser: login page shows TUWERI heading, username/password fields, Login button, NO demo text

Stage Summary:
- ChunkLoadError: Fixed by cleaning .next cache
- Demo text: Removed from login page
- TUWERI logo: Added to login page (left panel + mobile), sidebar header, and branding throughout
- Database: Seeded with complete sample data
- App builds successfully with all 22 routes
- Login page verified working with correct TUWERI branding
