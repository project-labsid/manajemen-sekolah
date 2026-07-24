import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding...')
  await prisma.auditLog.deleteMany()
  await prisma.riwayatLogin.deleteMany()
  await prisma.absensiSiswa.deleteMany()
  await prisma.absensiGuru.deleteMany()
  await prisma.nilai.deleteMany()
  await prisma.pengumuman.deleteMany()
  await prisma.user.deleteMany()
  await prisma.siswa.deleteMany()
  await prisma.kelas.deleteMany()
  await prisma.mataPelajaran.deleteMany()
  await prisma.guru.deleteMany()
  await prisma.settingSekolah.deleteMany()

  await prisma.settingSekolah.create({
    data: { namaSekolah: 'SMA Negeri 1 Contoh', npsn: '12345678', alamat: 'Jl. Pendidikan No. 1, Jakarta', email: 'info@sman1contoh.sch.id', website: 'www.sman1contoh.sch.id', telepon: '021-12345678', kepalaSekolah: 'Dr. Hj. Siti Aminah, M.Pd', nipKepalaSekolah: '196801011990032001', moto: 'Unggul, Berkarakter, Berprestasi', visi: 'Mewujudkan sekolah unggul', misi: '1. Meningkatkan mutu\n2. Menumbuhkan akhlak mulia\n3. Mengembangkan potensi siswa', semesterAktif: 'Ganjil', tahunAjaranAktif: '2024/2025' }
  })

  const adminPw = 'admin123'
  const guruPw = 'guru123'

  await prisma.user.create({
    data: { nama: 'Administrator', username: 'admin', password: await bcrypt.hash(adminPw, 10), passwordText: adminPw, role: 'admin', status: 'aktif', email: 'admin@siakad.id', noHP: '081234567890', jabatan: 'Super Admin' }
  })

  const guruData = [
    { nama: 'Ahmad Fauzi, S.Pd', username: 'ahmad', nip: '198505012010011001', jabatan: 'Guru Matematika', email: 'ahmad@siakad.id', noHP: '081298765432' },
    { nama: 'Siti Nurhaliza, S.Pd', username: 'siti', nip: '198703152011012002', jabatan: 'Guru Fisika', email: 'siti@siakad.id', noHP: '081311223344' },
    { nama: 'Budi Santoso, M.Pd', username: 'budi', nip: '198209202012011003', jabatan: 'Guru Bahasa Indonesia', email: 'budi@siakad.id', noHP: '081455667788' },
    { nama: 'Dewi Lestari, S.Pd', username: 'dewi', nip: '199001152015012001', jabatan: 'Guru Bahasa Inggris', email: 'dewi@siakad.id', noHP: '081566778899' },
    { nama: 'Eko Prasetyo, S.Pd', username: 'eko', nip: '198812102014011002', jabatan: 'Guru PKN', email: 'eko@siakad.id', noHP: '081677889900' },
    { nama: 'Fitri Handayani, M.Pd', username: 'fitri', nip: '198607222013012001', jabatan: 'Guru Biologi', email: 'fitri@siakad.id', noHP: '081788990011' },
    { nama: 'Gunawan Wibowo, S.Pd', username: 'gunawan', nip: '199205012018011001', jabatan: 'Guru Kimia', email: 'gunawan@siakad.id', noHP: '081899001122' },
    { nama: 'Hani Mulyani, S.Pd', username: 'hani', nip: '199103152019012002', jabatan: 'Guru Sejarah', email: 'hani@siakad.id', noHP: '081900112233' },
    { nama: 'Irfan Hakim, M.Pd', username: 'irfan', nip: '198508202012011003', jabatan: 'Guru Matematika', email: 'irfan@siakad.id', noHP: '082001223344' },
    { nama: 'Joko Widodo, S.Pd', username: 'joko', nip: '198910152015011001', jabatan: 'Guru Penjaskes', email: 'joko@siakad.id', noHP: '082112334455' },
    { nama: 'Kartika Sari, S.Pd', username: 'kartika', nip: '199207202020012001', jabatan: 'Guru Seni Budaya', email: 'kartika@siakad.id', noHP: '082123445566' },
    { nama: 'Lukman Hakim, M.Pd', username: 'lukman', nip: '198604302013011002', jabatan: 'Guru Fisika', email: 'lukman@siakad.id', noHP: '082134556677' },
    { nama: 'Maya Anggraini, S.Pd', username: 'maya', nip: '199309252021012001', jabatan: 'Guru BK', email: 'maya@siakad.id', noHP: '082145667788' },
    { nama: 'Nurul Hidayah, S.Pd', username: 'nurul', nip: '199106102019012002', jabatan: 'Guru Agama', email: 'nurul@siakad.id', noHP: '082156778899' },
    { nama: 'Oscar Pratama, M.Pd', username: 'oscar', nip: '198711302014011001', jabatan: 'Guru TIK', email: 'oscar@siakad.id', noHP: '082167889900' },
  ]

  for (const g of guruData) {
    await prisma.user.create({
      data: { nama: g.nama, username: g.username, password: await bcrypt.hash(guruPw, 10), passwordText: guruPw, role: 'guru', status: 'aktif', email: g.email, noHP: g.noHP, nip: g.nip, jabatan: g.jabatan }
    })
    await prisma.guru.create({
      data: { nip: g.nip, nama: g.nama, gelar: g.jabatan, jenisKelamin: ['Siti','Dewi','Fitri','Hani','Kartika','Maya','Nurul'].some(n => g.nama.includes(n)) ? 'Perempuan' : 'Laki-laki', mapel: g.jabatan.replace('Guru ', ''), status: 'aktif' }
    })
  }

  const kelasData = [
    { kodeKelas: '10A', namaKelas: 'X-A', waliKelas: 'Ahmad Fauzi, S.Pd' },
    { kodeKelas: '10B', namaKelas: 'X-B', waliKelas: 'Siti Nurhaliza, S.Pd' },
    { kodeKelas: '11A', namaKelas: 'XI-A', waliKelas: 'Budi Santoso, M.Pd' },
    { kodeKelas: '11B', namaKelas: 'XI-B', waliKelas: 'Dewi Lestari, S.Pd' },
    { kodeKelas: '12A', namaKelas: 'XII-A', waliKelas: 'Eko Prasetyo, S.Pd' },
    { kodeKelas: '12B', namaKelas: 'XII-B', waliKelas: 'Fitri Handayani, M.Pd' },
  ]
  for (const k of kelasData) await prisma.kelas.create({ data: { ...k, status: 'aktif' } })

  const mapelData = [
    { kodeMapel: 'MTK', namaMapel: 'Matematika', kkm: 75, guru: 'Ahmad Fauzi, S.Pd' },
    { kodeMapel: 'FIS', namaMapel: 'Fisika', kkm: 75, guru: 'Siti Nurhaliza, S.Pd' },
    { kodeMapel: 'BIN', namaMapel: 'Bahasa Indonesia', kkm: 75, guru: 'Budi Santoso, M.Pd' },
    { kodeMapel: 'BIG', namaMapel: 'Bahasa Inggris', kkm: 75, guru: 'Dewi Lestari, S.Pd' },
    { kodeMapel: 'PKN', namaMapel: 'PKN', kkm: 75, guru: 'Eko Prasetyo, S.Pd' },
    { kodeMapel: 'BIO', namaMapel: 'Biologi', kkm: 75, guru: 'Fitri Handayani, M.Pd' },
    { kodeMapel: 'KIM', namaMapel: 'Kimia', kkm: 75, guru: 'Gunawan Wibowo, S.Pd' },
    { kodeMapel: 'SEJ', namaMapel: 'Sejarah', kkm: 75, guru: 'Hani Mulyani, S.Pd' },
    { kodeMapel: 'PJK', namaMapel: 'Penjaskes', kkm: 75, guru: 'Joko Widodo, S.Pd' },
    { kodeMapel: 'SBD', namaMapel: 'Seni Budaya', kkm: 75, guru: 'Kartika Sari, S.Pd' },
    { kodeMapel: 'AGM', namaMapel: 'Pendidikan Agama', kkm: 75, guru: 'Nurul Hidayah, S.Pd' },
    { kodeMapel: 'TIK', namaMapel: 'Teknologi Informasi', kkm: 75, guru: 'Oscar Pratama, M.Pd' },
  ]
  for (const m of mapelData) await prisma.mataPelajaran.create({ data: { ...m, status: 'aktif' } })

  const siswaNames = [
    { nama: 'Andi Saputra', kelas: '10A', jk: 'L' }, { nama: 'Bella Permata', kelas: '10A', jk: 'P' },
    { nama: 'Candra Wijaya', kelas: '10A', jk: 'L' }, { nama: 'Dina Amelia', kelas: '10A', jk: 'P' },
    { nama: 'Erik Setiawan', kelas: '10B', jk: 'L' }, { nama: 'Fani Oktavia', kelas: '10B', jk: 'P' },
    { nama: 'Galih Pratama', kelas: '10B', jk: 'L' }, { nama: 'Hesti Rahayu', kelas: '10B', jk: 'P' },
    { nama: 'Irfan Maulana', kelas: '11A', jk: 'L' }, { nama: 'Jasmine Putri', kelas: '11A', jk: 'P' },
    { nama: 'Kevin Ardiansyah', kelas: '11A', jk: 'L' }, { nama: 'Laras Wulandari', kelas: '11A', jk: 'P' },
    { nama: 'Muhammad Rizki', kelas: '11B', jk: 'L' }, { nama: 'Nadia Safitri', kelas: '11B', jk: 'P' },
    { nama: 'Omar Faruq', kelas: '11B', jk: 'L' },
    { nama: 'Putri Amelia', kelas: '12A', jk: 'P' },
    { nama: 'Qori Akbar', kelas: '12A', jk: 'L' },
    { nama: 'Ratna Dewi', kelas: '12A', jk: 'P' },
    { nama: 'Surya Pratama', kelas: '12B', jk: 'L' }, { nama: 'Tania Putri', kelas: '12B', jk: 'P' },
    { nama: 'Umar Hakim', kelas: '12B', jk: 'L' }, { nama: 'Vina Melati', kelas: '12B', jk: 'P' },
    { nama: 'Wahyu Hidayat', kelas: '12A', jk: 'L' }, { nama: 'Xena Maharani', kelas: '10A', jk: 'P' },
  ]

  const today = new Date().toISOString().split('T')[0]
  const statuses = ['Hadir','Hadir','Hadir','Hadir','Hadir','Hadir','Sakit','Izin','Alpha','Hadir','Hadir','Hadir']

  for (let i = 0; i < siswaNames.length; i++) {
    const s = siswaNames[i]
    const nis = String(1001 + i)
    await prisma.siswa.create({ data: { nis, nama: s.nama, jenisKelamin: s.jk === 'L' ? 'Laki-laki' : 'Perempuan', kelas: s.kelas, status: 'aktif' } })
    const status = statuses[i % statuses.length] || 'Hadir'
    await prisma.absensiSiswa.create({ data: { tanggal: today, kelas: s.kelas, nis, nama: s.nama, status, keterangan: status !== 'Hadir' ? status : '', guru: 'Ahmad Fauzi, S.Pd' } })
  }

  for (let i = 0; i < 5; i++) {
    const s = siswaNames[i]
    const ph = () => Math.floor(Math.random() * 20) + 70
    const vals = [ph(), ph(), ph(), ph(), ph(), ph()]
    const rata = vals.reduce((a, b) => a + b, 0) / 6
    await prisma.nilai.create({
      data: { tahunAjaran: '2024/2025', semester: 'Ganjil', kelas: '10A', mapel: 'Matematika', guru: 'Ahmad Fauzi, S.Pd', nis: String(1001 + i), nama: s.nama, ph1: vals[0], ph2: vals[1], ph3: vals[2], ph4: vals[3], pts: vals[4], pas: vals[5], rataRata: rata, nilaiAkhir: rata, predikat: rata >= 90 ? 'A' : rata >= 80 ? 'B' : rata >= 70 ? 'C' : 'D' }
    })
  }

  for (let i = 0; i < 5; i++) {
    const g = guruData[i]
    const jm = `07:${String(i).padStart(2, '0')}`
    const jp = i < 3 ? `15:${String(30 + i * 5).padStart(2, '0')}` : ''
    await prisma.absensiGuru.create({ data: { tanggal: today, namaGuru: g.nama, nip: g.nip, jamMasuk: jm, jamPulang: jp, durasi: jp ? `${8-i} jam ${30+i*5} menit` : '', status: jp ? 'Sudah Pulang' : 'Hadir', browser: 'Chrome', device: 'Windows PC', ip: '192.168.1.' + (100 + i) } })
  }

  await prisma.pengumuman.createMany({ data: [
    { judul: 'Libur Nasional - Hari Kemerdekaan', isi: 'Diberitahukan bahwa tanggal 17 Agustus sekolah libur.', tanggal: today, status: 'aktif' },
    { judul: 'Jadwal UAS Semester Ganjil 2024/2025', isi: 'UAS dilaksanakan tanggal 2-13 Desember 2024.', tanggal: today, status: 'aktif' },
    { judul: 'Pendaftaran Ekskul Semester 2', isi: 'Pendaftaran ekskul dibuka mulai 5 Januari 2025.', tanggal: today, status: 'aktif' },
  ] })

  await prisma.auditLog.createMany({ data: [
    { tanggal: today, user: 'Administrator', role: 'admin', aktivitas: 'Login', ip: '192.168.1.1', detail: 'Admin berhasil login' },
  ] })

  await prisma.riwayatLogin.createMany({ data: [
    { user: 'Administrator', role: 'admin', waktuLogin: new Date().toISOString(), ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0 Chrome/120' },
    { user: 'Ahmad Fauzi, S.Pd', role: 'guru', waktuLogin: new Date(Date.now() - 3600000).toISOString(), ipAddress: '192.168.1.10', userAgent: 'Mozilla/5.0 Firefox/121' },
    { user: 'Siti Nurhaliza, S.Pd', role: 'guru', waktuLogin: new Date(Date.now() - 7200000).toISOString(), ipAddress: '192.168.1.11', userAgent: 'Mozilla/5.0 Chrome/120' },
  ] })

  console.log('Seed completed!')
  console.log('Admin: admin / admin123')
  console.log('Guru: ahmad / guru123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
