---
Task ID: 1
Agent: Main Agent
Task: Fix kelas and pelajaran not showing on guru account, fix hydration error, replace logos

Work Log:
- Analyzed screenshot showing empty kelas dropdown on Absensi Siswa page for guru account
- Identified root causes:
  1. Dashboard API returned only global stats, not guru-specific data (no kelas, mapel associations)
  2. Kelas API required 'kelas' permission which guru role doesn't have
  3. Mapel API required 'mapel' permission which guru role doesn't have
  4. Pengumuman API didn't return full 'isi' content in GET response
- Modified /api/dashboard to return guru-specific data (myMapel, kelasList, totalKelas, totalSiswa, totalNilai)
- Modified /api/kelas to allow guru role to access (filtered to their wali kelas + nilai kelas)
- Modified /api/mata-pelajaran to allow guru role to access (filtered to their subjects)
- Fixed /api/pengumuman to return full content (added 'isi' to select)
- Rewrote GuruDashboard.tsx to display kelas diampu and mata pelajaran cards with real data
- Fixed AbsensiGuru.tsx hydration error: changed <p> tags to <span> tags where Skeleton was nested inside
- Downloaded new logo from Google Drive (aaQOWzG68OR6K01aN) and replaced /public/logo-tuweri.png
- Verified all APIs return correct data via curl for both ahmad (guru) and sri (wali kelas)
- Re-seeded database and confirmed data integrity

Stage Summary:
- Guru dashboard now shows: real kelas count, siswa count, mapel list, kelas list, pengumuman
- Kelas and Mapel APIs filter data for guru role based on name associations
- No more <p> nesting <div> hydration error
- Logo replaced with new TUWERI logo from Google Drive
- All APIs verified with curl for guru accounts (ahmad/guru123, sri/guru123)
