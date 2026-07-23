import { db } from '../src/lib/db'
import { hashSync } from 'bcryptjs'

async function main() {
  // Setting Sekolah
  await db.settingSekolah.upsert({
    where: { id: 'setting-1' },
    update: {},
    create: {
      id: 'setting-1',
      namaSekolah: 'SMA Negeri 1 Contoh',
      logo: '',
      alamat: 'Jl. Pendidikan No. 1, Jakarta Selatan',
      npsn: '20100001',
      email: 'info@sman1contoh.sch.id',
      website: 'www.sman1contoh.sch.id',
      telepon: '021-1234567',
      kepalaSekolah: 'Drs. Bambang Supriadi, M.Pd',
      nipKepalaSekolah: '196801011990031001',
      moto: 'Cerdas, Berkarakter, Berprestasi',
      visi: 'Menjadi sekolah unggulan yang menghasilkan lulusan cerdas, berkarakter, dan berwawasan global',
      misi: '1. Menyelenggarakan pendidikan berkualitas 2. Mengembangkan potensi siswa 3. Membangun karakter mulia 4. Menciptakan lingkungan belajar kondusif',
      semesterAktif: 'Genap',
      tahunAjaranAktif: '2023/2024',
      tema: 'light',
      darkMode: false,
    },
  })

  // Users (Admin + Guru)
  const adminPw = hashSync('admin123', 10)
  const guruPw = hashSync('guru123', 10)

  await db.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: 'user-admin',
      nama: 'Administrator',
      username: 'admin',
      password: adminPw,
      role: 'admin',
      status: 'aktif',
      foto: '',
      email: 'admin@sman1contoh.sch.id',
      noHP: '081234567890',
    },
  })

  await db.user.upsert({
    where: { username: 'ahmad' },
    update: {},
    create: {
      id: 'user-guru1',
      nama: 'Ahmad Fauzi, S.Pd',
      username: 'ahmad',
      password: guruPw,
      role: 'guru',
      status: 'aktif',
      foto: '',
      email: 'ahmad@sman1contoh.sch.id',
      noHP: '081234567891',
    },
  })

  // Tahun Ajaran
  const taList = ['2022/2023', '2023/2024', '2024/2025']
  for (const ta of taList) {
    await db.tahunAjaran.upsert({
      where: { nama: ta },
      update: {},
      create: { nama: ta, status: ta === '2023/2024' ? 'aktif' : 'nonaktif' },
    })
  }

  // Semester
  await db.semester.upsert({
    where: { semester: 'Ganjil' },
    update: {},
    create: { semester: 'Ganjil', status: 'nonaktif' },
  })
  await db.semester.upsert({
    where: { semester: 'Genap' },
    update: {},
    create: { semester: 'Genap', status: 'aktif' },
  })

  // Mata Pelajaran
  const mapelList = [
    { kode: 'MTK', nama: 'Matematika', kkm: 75, guru: 'Ahmad Fauzi, S.Pd' },
    { kode: 'BIO', nama: 'Biologi', kkm: 75, guru: 'Siti Rahmawati, S.Si' },
    { kode: 'FIS', nama: 'Fisika', kkm: 75, guru: 'Budi Santoso, S.Pd' },
    { kode: 'KIM', nama: 'Kimia', kkm: 75, guru: 'Dewi Lestari, S.Si' },
    { kode: 'BHS', nama: 'Bahasa Indonesia', kkm: 75, guru: 'Rina Wati, S.Pd' },
    { kode: 'BIG', nama: 'Bahasa Inggris', kkm: 75, guru: 'James Halim, S.Pd' },
    { kode: 'SEJ', nama: 'Sejarah', kkm: 75, guru: 'Agus Prasetyo, S.Pd' },
    { kode: 'GEO', nama: 'Geografi', kkm: 75, guru: 'Fitri Handayani, S.Pd' },
    { kode: 'EKO', nama: 'Ekonomi', kkm: 75, guru: 'Hendra Wijaya, S.Pd' },
    { kode: 'SOS', nama: 'Sosiologi', kkm: 75, guru: 'Maya Sari, S.Pd' },
    { kode: 'PKN', nama: 'PKN', kkm: 75, guru: 'Taufik Rahman, S.Pd' },
    { kode: 'PEN', nama: 'Pendidikan Agama', kkm: 75, guru: 'Ustadz Hadi, S.Ag' },
    { kode: 'SBK', nama: 'Seni Budaya', kkm: 75, guru: 'Lina Marlina, S.Pd' },
    { kode: 'PJK', nama: 'PJOK', kkm: 75, guru: 'Dedi Kurniawan, S.Pd' },
    { kode: 'TIK', nama: 'Informatika', kkm: 75, guru: 'Reza Firmansyah, S.Kom' },
    { kode: 'MTK2', nama: 'Matematika Lanjutan', kkm: 75, guru: 'Ahmad Fauzi, S.Pd' },
  ]
  for (const m of mapelList) {
    await db.mataPelajaran.upsert({
      where: { kodeMapel: m.kode },
      update: {},
      create: { kodeMapel: m.kode, namaMapel: m.nama, kkm: m.kkm, guru: m.guru, status: 'aktif' },
    })
  }

  // Kelas
  const kelasList = ['10A','10B','10C','10D','11A','11B','11C','11D','12A','12B','12C','12D']
  const waliKelasList = ['Ahmad Fauzi, S.Pd','Siti Rahmawati, S.Si','Budi Santoso, S.Pd','Dewi Lestari, S.Si','Rina Wati, S.Pd','James Halim, S.Pd','Agus Prasetyo, S.Pd','Fitri Handayani, S.Pd','Hendra Wijaya, S.Pd','Maya Sari, S.Pd','Taufik Rahman, S.Pd','Ustadz Hadi, S.Ag']
  for (let i = 0; i < kelasList.length; i++) {
    await db.kelas.upsert({
      where: { kodeKelas: kelasList[i] },
      update: {},
      create: { kodeKelas: kelasList[i], namaKelas: `Kelas ${kelasList[i]}`, waliKelas: waliKelasList[i], status: 'aktif' },
    })
  }

  // Guru
  const guruList = [
    { nip: '198001012005011001', nama: 'Ahmad Fauzi', gelar: 'S.Pd', jk: 'Laki-laki', mapel: 'Matematika, Matematika Lanjutan' },
    { nip: '198205152006042001', nama: 'Siti Rahmawati', gelar: 'S.Si', jk: 'Perempuan', mapel: 'Biologi' },
    { nip: '197908202007011002', nama: 'Budi Santoso', gelar: 'S.Pd', jk: 'Laki-laki', mapel: 'Fisika' },
    { nip: '198312102008012003', nama: 'Dewi Lestari', gelar: 'S.Si', jk: 'Perempuan', mapel: 'Kimia' },
    { nip: '198106302009011004', nama: 'Rina Wati', gelar: 'S.Pd', jk: 'Perempuan', mapel: 'Bahasa Indonesia' },
    { nip: '198507252010011005', nama: 'James Halim', gelar: 'S.Pd', jk: 'Laki-laki', mapel: 'Bahasa Inggris' },
    { nip: '197804152011011006', nama: 'Agus Prasetyo', gelar: 'S.Pd', jk: 'Laki-laki', mapel: 'Sejarah' },
    { nip: '198209052012012007', nama: 'Fitri Handayani', gelar: 'S.Pd', jk: 'Perempuan', mapel: 'Geografi' },
    { nip: '198001012013011008', nama: 'Hendra Wijaya', gelar: 'S.Pd', jk: 'Laki-laki', mapel: 'Ekonomi' },
    { nip: '198312102014012009', nama: 'Maya Sari', gelar: 'S.Pd', jk: 'Perempuan', mapel: 'Sosiologi' },
    { nip: '197908202015011010', nama: 'Taufik Rahman', gelar: 'S.Pd', jk: 'Laki-laki', mapel: 'PKN' },
    { nip: '198106302016011011', nama: 'Ustadz Hadi', gelar: 'S.Ag', jk: 'Laki-laki', mapel: 'Pendidikan Agama' },
    { nip: '198507252017011012', nama: 'Lina Marlina', gelar: 'S.Pd', jk: 'Perempuan', mapel: 'Seni Budaya' },
    { nip: '197804152018011013', nama: 'Dedi Kurniawan', gelar: 'S.Pd', jk: 'Laki-laki', mapel: 'PJOK' },
    { nip: '198209052019011014', nama: 'Reza Firmansyah', gelar: 'S.Kom', jk: 'Laki-laki', mapel: 'Informatika' },
  ]
  for (const g of guruList) {
    await db.guru.upsert({
      where: { nip: g.nip },
      update: {},
      create: {
        nip: g.nip, nama: g.nama, gelar: g.gelar, jenisKelamin: g.jk,
        tempatLahir: 'Jakarta', tanggalLahir: '1980-01-01', alamat: 'Jakarta',
        email: `${g.nama.toLowerCase().replace(/ /g,'.')}@sman1contoh.sch.id`,
        noHP: '081234567890', mapel: g.mapel, status: 'aktif',
      },
    })
  }

  // Siswa - generate 130 students across classes
  const namaDepan = ['Andi','Budi','Citra','Dina','Eka','Fajar','Gita','Hana','Irfan','Joko','Kartika','Lina','Maya','Nadia','Oscar','Putri','Qori','Rizki','Sari','Tono','Umar','Vina','Wati','Xena','Yudi','Zahra','Arif','Bayu','Cahya','Dewi','Elsa','Firman','Gilang','Hadi','Indah','Joni','Kevin','Laila','Mira','Nur','Oki','Pram','Qori','Rani','Sinta','Tina','Umi','Vera','Wulan','Yanti','Zaki']
  const namaBelakang = ['Pratama','Saputra','Kusuma','Lestari','Wijaya','Sari','Putri','Hidayat','Rahman','Kurniawan','Pertiwi','Nugraha','Santoso','Wibowo','Hakim','Permana','Setiawan','Susanto','Ramadhan','Firmansyah']
  let nisCounter = 1001
  for (const kelas of kelasList) {
    const count = kelas.startsWith('12') ? 10 : kelas.startsWith('11') ? 12 : 10
    for (let i = 0; i < count; i++) {
      const nama = `${namaDepan[(nisCounter - 1001) % namaDepan.length]} ${namaBelakang[(nisCounter - 1001) % namaBelakang.length]}`
      const nis = `2024${String(nisCounter).padStart(4, '0')}`
      const jk = i % 3 === 0 ? 'Perempuan' : 'Laki-laki'
      await db.siswa.create({
        data: {
          nis, nisn: `00${nis}`, nama, jenisKelamin: jk,
          tempatLahir: 'Jakarta', tanggalLahir: '2007-01-15',
          agama: 'Islam', alamat: 'Jakarta', kelas, status: 'aktif',
        },
      })
      nisCounter++
    }
  }

  // Nilai - generate for class 12A Matematika
  const siswa12A = await db.siswa.findMany({ where: { kelas: '12A' } })
  for (const s of siswa12A) {
    const ph1 = Math.round(70 + Math.random() * 30)
    const ph2 = Math.round(65 + Math.random() * 35)
    const ph3 = Math.round(60 + Math.random() * 40)
    const pts = Math.round(60 + Math.random() * 40)
    const pas = Math.round(55 + Math.random() * 45)
    const rata = Math.round((ph1 + ph2 + ph3 + pts + pas) / 5 * 10) / 10
    const na = Math.round((ph1 * 0.15 + ph2 * 0.15 + ph3 * 0.15 + pts * 0.25 + pas * 0.3) * 10) / 10
    const predikat = na >= 90 ? 'A' : na >= 80 ? 'B+' : na >= 70 ? 'B' : na >= 60 ? 'C' : 'D'
    await db.nilai.create({
      data: {
        tahunAjaran: '2023/2024', semester: 'Genap', kelas: '12A',
        mapel: 'Matematika', guru: 'Ahmad Fauzi, S.Pd',
        nis: s.nis, nama: s.nama,
        ph1, ph2, ph3, ph4: 0, pts, pas, rataRata: rata, nilaiAkhir: na, predikat,
        deskripsi: na >= 75 ? 'Tuntas' : 'Belum Tuntas',
      },
    })
  }

  // Absensi Guru hari ini
  const today = new Date().toISOString().split('T')[0]
  const gurus = await db.guru.findMany()
  for (let i = 0; i < gurus.length; i++) {
    const hadir = i < 12
    await db.absensiGuru.create({
      data: {
        tanggal: today, namaGuru: `${gurus[i].nama}, ${gurus[i].gelar}`,
        nip: gurus[i].nip, jamMasuk: hadir ? '07:30' : '',
        jamPulang: i < 10 ? '16:00' : '',
        durasi: i < 10 ? '8 Jam 30 Menit' : '',
        status: hadir ? (i < 10 ? 'Hadir' : 'Sudah Pulang') : 'Tidak Hadir',
        browser: 'Chrome', device: 'Desktop', ip: '192.168.1.100',
      },
    })
  }

  // Absensi Siswa hari ini
  const allSiswa = await db.siswa.findMany()
  for (const s of allSiswa) {
    const rand = Math.random()
    const status = rand > 0.95 ? 'Alpha' : rand > 0.9 ? 'Sakit' : rand > 0.85 ? 'Izin' : 'Hadir'
    await db.absensiSiswa.create({
      data: {
        tanggal: today, kelas: s.kelas, nis: s.nis, nama: s.nama,
        status, guru: 'Ahmad Fauzi, S.Pd',
      },
    })
  }

  // Pengumuman
  await db.pengumuman.createMany({
    data: [
      { judul: 'Ujian Akhir Semester Genap 2024', isi: 'UAS Genap akan dilaksanakan pada tanggal 10-20 Juni 2024. Seluruh siswa wajib hadir 30 menit sebelum ujian dimulai.', tanggal: today, status: 'aktif' },
      { judul: 'Libur Hari Raya Idul Fitri', isi: 'Diberitahukan bahwa libur Hari Raya Idul Fitri 1445 H mulai tanggal 8-15 April 2024.', tanggal: '2024-04-01', status: 'aktif' },
      { judul: 'Pendaftaran Ekskul Semester Genap', isi: 'Pendaftaran ekstrakurikuler semester genap dibuka mulai 15 Januari 2024. Hubungi wali kelas masing-masing.', tanggal: '2024-01-10', status: 'aktif' },
    ],
  })

  // Audit log
  await db.auditLog.createMany({
    data: [
      { tanggal: today, user: 'Administrator', role: 'admin', aktivitas: 'Login', ip: '192.168.1.100', detail: 'Admin berhasil login' },
      { tanggal: today, user: 'Administrator', role: 'admin', aktivitas: 'Lihat Dashboard', ip: '192.168.1.100', detail: 'Membuka halaman dashboard' },
    ],
  })

  console.log('✅ Seed data berhasil ditambahkan!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
