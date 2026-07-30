'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  BarChart3,
  Download,
  FileText,
  Filter,
  Loader2,
  Inbox,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Users,
  TrendingUp,
} from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TipeLaporan = 'nilai' | 'absensi'

interface KelasItem {
  id: string
  kodeKelas: string
  namaKelas: string
  waliKelas: string
  status: string
}

interface MapelItem {
  id: string
  kodeMapel: string
  namaMapel: string
  kkm: number
  guru: string
  status: string
}

interface NilaiPerSiswa {
  nis: string
  nama: string
  kelas: string
  jumlahMapel: number
  rataRata: number
  nilaiTertinggi: number
  nilaiTerendah: number
  mapelLulus: number
  mapelTidakLulus: number
  detailNilai: {
    id: string
    mapel: string
    nilaiAkhir: number
    predikat: string
    rataRata: number
  }[]
}

interface NilaiStats {
  rataRataKeseluruhan: number
  nilaiTertinggi: number
  nilaiTerendah: number
  lulus: number
  tidakLulus: number
  totalSiswa: number
}

interface NilaiLaporanResponse {
  tipe: 'nilai'
  data: NilaiPerSiswa[]
  stats: NilaiStats
  filters: {
    kelas: string
    mapel: string
    semester: string
    tahunAjaran: string
  }
}

interface AbsensiPerSiswa {
  nis: string
  nama: string
  kelas: string
  hadir: number
  sakit: number
  izin: number
  alpha: number
  totalHari: number
  persentaseKehadiran: number
}

interface AbsensiSummary {
  total: number
  hadir: number
  sakit: number
  izin: number
  alpha: number
}

interface AbsensiLaporanResponse {
  tipe: 'absensi'
  data: AbsensiPerSiswa[]
  summary: AbsensiSummary
  filters: {
    kelas: string
    tanggalMulai: string
    tanggalSelesai: string
  }
}

type LaporanResponse = NilaiLaporanResponse | AbsensiLaporanResponse

interface KelasResponse {
  data: KelasItem[]
}

interface MapelResponse {
  data: MapelItem[]
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TAHUN_AJARAN_OPTIONS = [
  '2024/2025',
  '2023/2024',
  '2022/2023',
  '2021/2022',
  '2020/2021',
]

const SEMESTER_OPTIONS = ['Ganjil', 'Genap']

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getPredikatFromRataRata(rata: number): string {
  if (rata >= 90) return 'A'
  if (rata >= 80) return 'B'
  if (rata >= 70) return 'C'
  return 'D'
}

function getPredikatBadge(predikat: string) {
  const colors: Record<string, string> = {
    A: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0',
    B: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0',
    C: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
    D: 'bg-red-100 text-red-600 hover:bg-red-100 border-0',
  }
  return (
    <Badge className={colors[predikat] || 'bg-gray-100 text-gray-600 hover:bg-gray-100 border-0'}>
      {predikat}
    </Badge>
  )
}

function getStatusLulusBadge(lulus: boolean) {
  if (lulus) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
        Lulus
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0">
      Tidak Lulus
    </Badge>
  )
}

function getPersentaseColor(pct: number): string {
  if (pct >= 80) return 'text-emerald-600'
  if (pct >= 60) return 'text-amber-600'
  return 'text-red-600'
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Laporan() {
  // ── Report type ──
  const [tipe, setTipe] = useState<TipeLaporan>('nilai')

  // ── Nilai filter state ──
  const [tahunAjaran, setTahunAjaran] = useState('2024/2025')
  const [semester, setSemester] = useState('Ganjil')
  const [nilaiKelas, setNilaiKelas] = useState('')
  const [nilaiMapel, setNilaiMapel] = useState('all')

  // ── Absensi filter state ──
  const [absensiKelas, setAbsensiKelas] = useState('')
  const [tanggalMulai, setTanggalMulai] = useState('')
  const [tanggalSelesai, setTanggalSelesai] = useState('')

  // ── Dropdown data ──
  const [kelasList, setKelasList] = useState<KelasItem[]>([])
  const [mapelList, setMapelList] = useState<MapelItem[]>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState(true)

  // ── Result state ──
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [nilaiResult, setNilaiResult] = useState<NilaiLaporanResponse | null>(null)
  const [absensiResult, setAbsensiResult] = useState<AbsensiLaporanResponse | null>(null)

  // ── Fetch kelas & mapel dropdowns ──
  const fetchDropdowns = useCallback(async () => {
    setLoadingDropdowns(true)
    try {
      const [kelasRes, mapelRes] = await Promise.all([
        api.get<KelasResponse>('/kelas'),
        api.get<MapelResponse>('/mapel'),
      ])
      const kelasData = (kelasRes as KelasResponse).data
      const mapelData = (mapelRes as MapelResponse).data
      setKelasList(Array.isArray(kelasData) ? kelasData : [])
      setMapelList(Array.isArray(mapelData) ? mapelData : [])
    } catch {
      toast.error('Gagal memuat data referensi')
    } finally {
      setLoadingDropdowns(false)
    }
  }, [])

  useEffect(() => {
    fetchDropdowns()
  }, [fetchDropdowns])

  // ── Reset results on type change ──
  useEffect(() => {
    setHasSearched(false)
    setNilaiResult(null)
    setAbsensiResult(null)
  }, [tipe])

  // ── Validate & fetch ──
  const handleTampilkan = useCallback(async () => {
    if (tipe === 'nilai') {
      if (!nilaiKelas) {
        toast.error('Pilih Kelas terlebih dahulu')
        return
      }
      setLoading(true)
      setHasSearched(true)
      try {
        const params = new URLSearchParams({
          tipe: 'nilai',
          kelas: nilaiKelas,
          ...(nilaiMapel && nilaiMapel !== 'all' ? { mapel: nilaiMapel } : {}),
          semester,
          tahunAjaran,
        })
        const res = await api.get<NilaiLaporanResponse>(`/laporan?${params.toString()}`)
        setNilaiResult(res as NilaiLaporanResponse)
      } catch {
        toast.error('Gagal memuat laporan nilai')
        setNilaiResult(null)
      } finally {
        setLoading(false)
      }
    } else {
      if (!absensiKelas) {
        toast.error('Pilih Kelas terlebih dahulu')
        return
      }
      if (!tanggalMulai || !tanggalSelesai) {
        toast.error('Tanggal Mulai dan Tanggal Selesai wajib diisi')
        return
      }
      if (tanggalMulai > tanggalSelesai) {
        toast.error('Tanggal Mulai tidak boleh lebih dari Tanggal Selesai')
        return
      }
      setLoading(true)
      setHasSearched(true)
      try {
        const params = new URLSearchParams({
          tipe: 'absensi',
          kelas: absensiKelas,
          tanggalMulai,
          tanggalSelesai,
        })
        const res = await api.get<AbsensiLaporanResponse>(`/laporan?${params.toString()}`)
        setAbsensiResult(res as AbsensiLaporanResponse)
      } catch {
        toast.error('Gagal memuat laporan absensi')
        setAbsensiResult(null)
      } finally {
        setLoading(false)
      }
    }
  }, [tipe, tahunAjaran, semester, nilaiKelas, nilaiMapel, absensiKelas, tanggalMulai, tanggalSelesai])

  // ── Export Excel (CSV) ──
  const handleExportExcel = useCallback(() => {
    if (tipe === 'nilai') {
      if (!nilaiResult || nilaiResult.data.length === 0) {
        toast.error('Tidak ada data untuk diekspor')
        return
      }
      const headers = ['No', 'NIS', 'Nama', 'Kelas', 'Jumlah Mapel', 'Rata-Rata', 'Nilai Tertinggi', 'Nilai Terendah', 'Mapel Lulus', 'Mapel Tidak Lulus', 'Predikat', 'Status Lulus']
      const rows = nilaiResult.data.map((item, idx) => [
        idx + 1,
        item.nis,
        item.nama,
        item.kelas,
        item.jumlahMapel,
        item.rataRata,
        item.nilaiTertinggi,
        item.nilaiTerendah,
        item.mapelLulus,
        item.mapelTidakLulus,
        getPredikatFromRataRata(item.rataRata),
        item.mapelTidakLulus === 0 ? 'Lulus' : 'Tidak Lulus',
      ])
      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => {
            const str = String(cell)
            return str.includes(',') || str.includes('"') || str.includes('\n')
              ? `"${str.replace(/"/g, '""')}"`
              : str
          }).join(','),
        ),
      ].join('\n')
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Laporan_Nilai_${nilaiKelas}_${semester}_${tahunAjaran.replace('/', '-')}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      if (!absensiResult || absensiResult.data.length === 0) {
        toast.error('Tidak ada data untuk diekspor')
        return
      }
      const headers = ['No', 'NIS', 'Nama', 'Kelas', 'Hadir', 'Sakit', 'Izin', 'Alpha', 'Total', 'Persentase Kehadiran (%)']
      const rows = absensiResult.data.map((item, idx) => [
        idx + 1,
        item.nis,
        item.nama,
        item.kelas,
        item.hadir,
        item.sakit,
        item.izin,
        item.alpha,
        item.totalHari,
        item.persentaseKehadiran,
      ])
      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => {
            const str = String(cell)
            return str.includes(',') || str.includes('"') || str.includes('\n')
              ? `"${str.replace(/"/g, '""')}"`
              : str
          }).join(','),
        ),
      ].join('\n')
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Laporan_Absensi_${absensiKelas}_${tanggalMulai}_sd_${tanggalSelesai}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    toast.success('Data berhasil diekspor ke Excel')
  }, [tipe, nilaiResult, absensiResult, nilaiKelas, semester, tahunAjaran, absensiKelas, tanggalMulai, tanggalSelesai])

  // ── Export PDF (placeholder) ──
  const handleExportPDF = useCallback(() => {
    toast.info('Fitur export PDF akan segera tersedia. Gunakan Export Excel sebagai alternatif.')
  }, [])

  // ── Derived data ──
  const nilaiData = nilaiResult?.data ?? []
  const absensiData = absensiResult?.data ?? []
  const hasData = tipe === 'nilai' ? nilaiData.length > 0 : absensiData.length > 0

  // ── Render ──
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── Report Type Selector ── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-[#2563eb]" />
          <h2 className="text-lg font-semibold text-foreground">Laporan SIAKAD</h2>
        </div>

        <RadioGroup
          value={tipe}
          onValueChange={(v) => setTipe(v as TipeLaporan)}
          className="flex flex-col sm:flex-row gap-3"
        >
          <label
            htmlFor="tipe-nilai"
            className={[
              'flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all',
              tipe === 'nilai'
                ? 'border-[#2563eb] bg-blue-50'
                : 'border-border bg-white hover:border-muted-foreground/30',
            ].join(' ')}
          >
            <RadioGroupItem value="nilai" id="tipe-nilai" />
            <div className="flex items-center gap-2">
              <BarChart3 className={`h-5 w-5 ${tipe === 'nilai' ? 'text-[#2563eb]' : 'text-muted-foreground'}`} />
              <span className={`font-medium ${tipe === 'nilai' ? 'text-[#2563eb]' : 'text-muted-foreground'}`}>
                Laporan Nilai
              </span>
            </div>
          </label>

          <label
            htmlFor="tipe-absensi"
            className={[
              'flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all',
              tipe === 'absensi'
                ? 'border-[#2563eb] bg-blue-50'
                : 'border-border bg-white hover:border-muted-foreground/30',
            ].join(' ')}
          >
            <RadioGroupItem value="absensi" id="tipe-absensi" />
            <div className="flex items-center gap-2">
              <CalendarDays className={`h-5 w-5 ${tipe === 'absensi' ? 'text-[#2563eb]' : 'text-muted-foreground'}`} />
              <span className={`font-medium ${tipe === 'absensi' ? 'text-[#2563eb]' : 'text-muted-foreground'}`}>
                Laporan Absensi
              </span>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* ── Filter Card ── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#2563eb]" />
          <h2 className="text-lg font-semibold text-foreground">
            Filter {tipe === 'nilai' ? 'Laporan Nilai' : 'Laporan Absensi'}
          </h2>
        </div>

        {tipe === 'nilai' ? (
          /* ── Nilai Filters ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Tahun Ajaran</Label>
              <Select value={tahunAjaran} onValueChange={setTahunAjaran}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {TAHUN_AJARAN_OPTIONS.map((ta) => (
                    <SelectItem key={ta} value={ta}>
                      {ta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTER_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Kelas</Label>
              <Select value={nilaiKelas} onValueChange={setNilaiKelas}>
                <SelectTrigger className="w-full" disabled={loadingDropdowns}>
                  <SelectValue placeholder={loadingDropdowns ? 'Memuat...' : 'Pilih Kelas'} />
                </SelectTrigger>
                <SelectContent>
                  {kelasList.map((k) => (
                    <SelectItem key={k.kodeKelas} value={k.kodeKelas}>
                      {k.namaKelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Mata Pelajaran</Label>
              <Select value={nilaiMapel} onValueChange={setNilaiMapel}>
                <SelectTrigger className="w-full" disabled={loadingDropdowns}>
                  <SelectValue placeholder={loadingDropdowns ? 'Memuat...' : 'Semua Mapel'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mapel</SelectItem>
                  {mapelList.map((m) => (
                    <SelectItem key={m.kodeMapel} value={m.kodeMapel}>
                      {m.namaMapel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 flex items-end">
              <Button
                onClick={handleTampilkan}
                disabled={loading || loadingDropdowns}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Filter className="h-4 w-4 mr-2" />
                )}
                Tampilkan
              </Button>
            </div>
          </div>
        ) : (
          /* ── Absensi Filters ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Kelas</Label>
              <Select value={absensiKelas} onValueChange={setAbsensiKelas}>
                <SelectTrigger className="w-full" disabled={loadingDropdowns}>
                  <SelectValue placeholder={loadingDropdowns ? 'Memuat...' : 'Pilih Kelas'} />
                </SelectTrigger>
                <SelectContent>
                  {kelasList.map((k) => (
                    <SelectItem key={k.kodeKelas} value={k.kodeKelas}>
                      {k.namaKelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Tanggal Mulai</Label>
              <Input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Tanggal Selesai</Label>
              <Input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
              />
            </div>

            <div className="lg:col-span-2 space-y-1.5 flex items-end">
              <Button
                onClick={handleTampilkan}
                disabled={loading || loadingDropdowns}
                className="w-full sm:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Filter className="h-4 w-4 mr-2" />
                )}
                Tampilkan
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Nilai: Summary Stats ── */}
      {tipe === 'nilai' && hasSearched && !loading && nilaiResult && nilaiData.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Siswa</p>
              <p className="text-2xl font-bold text-[#2563eb]">{nilaiResult.stats.totalSiswa}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rata-Rata</p>
              <p className="text-2xl font-bold text-[#10b981]">{nilaiResult.stats.rataRataKeseluruhan}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Nilai Tertinggi</p>
              <p className="text-2xl font-bold text-[#2563eb]">{nilaiResult.stats.nilaiTertinggi}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-[#ef4444]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Nilai Terendah</p>
              <p className="text-2xl font-bold text-[#ef4444]">{nilaiResult.stats.nilaiTerendah}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Siswa Lulus</p>
              <p className="text-2xl font-bold text-[#10b981]">
                {nilaiResult.stats.lulus}/{nilaiResult.stats.totalSiswa}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Absensi: Summary Stats ── */}
      {tipe === 'absensi' && hasSearched && !loading && absensiResult && absensiData.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Hari</p>
              <p className="text-2xl font-bold text-[#2563eb]">{absensiResult.summary.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Hadir</p>
              <p className="text-2xl font-bold text-[#10b981]">{absensiResult.summary.hadir}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Sakit</p>
              <p className="text-2xl font-bold text-[#f59e0b]">{absensiResult.summary.sakit}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#f97316]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Izin</p>
              <p className="text-2xl font-bold text-[#f97316]">{absensiResult.summary.izin}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-[#ef4444]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Alpha</p>
              <p className="text-2xl font-bold text-[#ef4444]">{absensiResult.summary.alpha}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Results Table Card ── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          {loading ? (
            /* ── Skeleton ── */
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !hasSearched ? (
            /* ── Initial state ── */
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <BarChart3 className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">Pilih Filter Terlebih Dahulu</p>
              <p className="text-sm mt-1 text-center">
                Pilih jenis laporan, atur filter, lalu klik &quot;Tampilkan&quot; untuk melihat data
              </p>
            </div>
          ) : !hasData ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Inbox className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">Data Tidak Ditemukan</p>
              <p className="text-sm mt-1">Belum ada data untuk filter yang dipilih</p>
            </div>
          ) : tipe === 'nilai' ? (
            /* ── Nilai Table ── */
            <table className="siadak-table">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th>No</th>
                  <th>NIS</th>
                  <th>Nama</th>
                  <th>Rata-Rata</th>
                  <th>Nilai Akhir</th>
                  <th>Predikat</th>
                  <th>Status Lulus</th>
                </tr>
              </thead>
              <tbody>
                {nilaiData.map((item, idx) => {
                  const predikat = getPredikatFromRataRata(item.rataRata)
                  const lulus = item.mapelTidakLulus === 0
                  return (
                    <tr key={item.nis}>
                      <td className="font-medium">{idx + 1}</td>
                      <td className="font-mono text-sm">{item.nis}</td>
                      <td className="font-medium">{item.nama}</td>
                      <td className="font-semibold">{item.rataRata}</td>
                      <td className="font-semibold">{item.nilaiTertinggi}</td>
                      <td>{getPredikatBadge(predikat)}</td>
                      <td>{getStatusLulusBadge(lulus)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            /* ── Absensi Table ── */
            <table className="siadak-table">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th>No</th>
                  <th>NIS</th>
                  <th>Nama</th>
                  <th>Hadir</th>
                  <th>Sakit</th>
                  <th>Izin</th>
                  <th>Alpha</th>
                  <th>Total</th>
                  <th>Persentase</th>
                </tr>
              </thead>
              <tbody>
                {absensiData.map((item, idx) => (
                  <tr key={item.nis}>
                    <td className="font-medium">{idx + 1}</td>
                    <td className="font-mono text-sm">{item.nis}</td>
                    <td className="font-medium">{item.nama}</td>
                    <td>
                      <span className="text-emerald-600 font-semibold">{item.hadir}</span>
                    </td>
                    <td>
                      <span className="text-amber-600 font-semibold">{item.sakit}</span>
                    </td>
                    <td>
                      <span className="text-orange-600 font-semibold">{item.izin}</span>
                    </td>
                    <td>
                      <span className="text-red-600 font-semibold">{item.alpha}</span>
                    </td>
                    <td className="font-semibold">{item.totalHari}</td>
                    <td>
                      <span className={`font-bold ${getPersentaseColor(item.persentaseKehadiran)}`}>
                        {item.persentaseKehadiran}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom Actions */}
        {hasSearched && !loading && hasData && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Menampilkan{' '}
              <span className="font-semibold text-foreground">
                {tipe === 'nilai' ? nilaiData.length : absensiData.length}
              </span>{' '}
              data {tipe === 'nilai' ? 'nilai' : 'absensi'}
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExportExcel}
                className="bg-[#10b981] hover:bg-[#059669] text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button
                onClick={handleExportPDF}
                className="bg-[#ef4444] hover:bg-[#dc2626] text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
