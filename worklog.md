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
