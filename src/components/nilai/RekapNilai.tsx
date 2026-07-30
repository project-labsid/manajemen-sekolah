'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Filter,
  Download,
  FileText,
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  Loader2,
  Inbox,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

interface NilaiItem {
  id: string
  tahunAjaran: string
  semester: string
  kelas: string
  mapel: string
  guru: string
  nis: string
  nama: string
  ph1: number
  ph2: number
  ph3: number
  ph4: number
  pts: number
  pas: number
  rataRata: number
  nilaiAkhir: number
  predikat: string
  deskripsi: string
}

interface NilaiResponse {
  data: NilaiItem[]
  kkm: number
  total: number
  rataRataKelas: number
}

interface KelasResponse {
  data: KelasItem[]
}

interface MapelResponse {
  data: MapelItem[]
}

interface SummaryStats {
  rataRataKelas: number
  nilaiTertinggi: number
  nilaiTerendah: number
  siswaTuntas: number
  totalSiswa: number
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

function getPredikatColor(predikat: string): string {
  switch (predikat) {
    case 'A':
      return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0'
    case 'B':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0'
    case 'C':
      return 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0'
    case 'D':
      return 'bg-red-100 text-red-600 hover:bg-red-100 border-0'
    default:
      return 'bg-gray-100 text-gray-600 hover:bg-gray-100 border-0'
  }
}

function getDeskripsiBadge(deskripsi: string, kkm: number, nilaiAkhir: number) {
  const isTuntas = nilaiAkhir >= kkm
  if (isTuntas) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
        Tuntas
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0">
      Belum Tuntas
    </Badge>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RekapNilai() {
  // ── Filter state ──
  const [tahunAjaran, setTahunAjaran] = useState('2024/2025')
  const [semester, setSemester] = useState('Ganjil')
  const [kelas, setKelas] = useState('')
  const [mapel, setMapel] = useState('')

  // ── Dropdown data ──
  const [kelasList, setKelasList] = useState<KelasItem[]>([])
  const [mapelList, setMapelList] = useState<MapelItem[]>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState(true)

  // ── Table data ──
  const [nilaiData, setNilaiData] = useState<NilaiItem[]>([])
  const [kkm, setKkm] = useState(75)
  const [loadingNilai, setLoadingNilai] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

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

  // ── Fetch nilai data ──
  const fetchNilai = useCallback(async () => {
    if (!kelas || !mapel) {
      toast.error('Pilih Kelas dan Mata Pelajaran terlebih dahulu')
      return
    }

    setLoadingNilai(true)
    setHasSearched(true)
    try {
      const params = new URLSearchParams({
        kelas,
        mapel,
        semester,
        tahunAjaran,
      })
      const res = await api.get<NilaiResponse>(`/nilai?${params.toString()}`)
      const nilaiRes = res as NilaiResponse
      setNilaiData(Array.isArray(nilaiRes.data) ? nilaiRes.data : [])
      setKkm(nilaiRes.kkm || 75)
    } catch {
      toast.error('Gagal memuat data nilai')
      setNilaiData([])
    } finally {
      setLoadingNilai(false)
    }
  }, [kelas, mapel, semester, tahunAjaran])

  // ── Calculate summary stats ──
  const summaryStats: SummaryStats = useMemo(() => {
    if (nilaiData.length === 0) {
      return {
        rataRataKelas: 0,
        nilaiTertinggi: 0,
        nilaiTerendah: 0,
        siswaTuntas: 0,
        totalSiswa: 0,
      }
    }

    const nilaiAkhirs = nilaiData.map((n) => n.nilaiAkhir)
    const rataRataKelas =
      Math.round(
        (nilaiAkhirs.reduce((sum, v) => sum + v, 0) / nilaiAkhirs.length) * 100,
      ) / 100
    const nilaiTertinggi = Math.max(...nilaiAkhirs)
    const nilaiTerendah = Math.min(...nilaiAkhirs)
    const siswaTuntas = nilaiAkhirs.filter((v) => v >= kkm).length

    return {
      rataRataKelas,
      nilaiTertinggi,
      nilaiTerendah,
      siswaTuntas,
      totalSiswa: nilaiData.length,
    }
  }, [nilaiData, kkm])

  // ── Export CSV ──
  const handleExportCSV = useCallback(() => {
    if (nilaiData.length === 0) {
      toast.error('Tidak ada data untuk diekspor')
      return
    }

    const headers = [
      'No',
      'NIS',
      'Nama',
      'PH1',
      'PH2',
      'PH3',
      'PH4',
      'PTS',
      'PAS',
      'Rata-Rata',
      'Nilai Akhir',
      'Predikat',
      'Deskripsi',
    ]

    const rows = nilaiData.map((item, idx) => [
      idx + 1,
      item.nis,
      item.nama,
      item.ph1,
      item.ph2,
      item.ph3,
      item.ph4,
      item.pts,
      item.pas,
      item.rataRata,
      item.nilaiAkhir,
      item.predikat,
      item.nilaiAkhir >= kkm ? 'Tuntas' : 'Belum Tuntas',
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

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Rekap_Nilai_${kelas}_${mapel}_${semester}_${tahunAjaran.replace('/', '-')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Data berhasil diekspor ke CSV')
  }, [nilaiData, kelas, mapel, semester, tahunAjaran, kkm])

  // ── Export PDF (placeholder) ──
  const handleExportPDF = useCallback(() => {
    toast.info('Fitur export PDF akan segera tersedia. Gunakan export CSV sebagai alternatif.')
  }, [])

  // ── Render ──
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#2563eb]" />
          <h2 className="text-lg font-semibold text-foreground">Filter Rekap Nilai</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Tahun Ajaran */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Tahun Ajaran</label>
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

          {/* Semester */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Semester</label>
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

          {/* Kelas */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Kelas</label>
            <Select value={kelas} onValueChange={setKelas}>
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

          {/* Mapel */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Mata Pelajaran</label>
            <Select value={mapel} onValueChange={setMapel}>
              <SelectTrigger className="w-full" disabled={loadingDropdowns}>
                <SelectValue placeholder={loadingDropdowns ? 'Memuat...' : 'Pilih Mapel'} />
              </SelectTrigger>
              <SelectContent>
                {mapelList.map((m) => (
                  <SelectItem key={m.kodeMapel} value={m.kodeMapel}>
                    {m.namaMapel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Button Tampilkan */}
          <div className="space-y-1.5 flex items-end">
            <Button
              onClick={fetchNilai}
              disabled={loadingNilai || loadingDropdowns}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            >
              {loadingNilai ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Filter className="h-4 w-4 mr-2" />
              )}
              Tampilkan
            </Button>
          </div>
        </div>
      </div>

      {/* ── Summary Metric Cards ── */}
      {hasSearched && !loadingNilai && nilaiData.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rata-rata Kelas */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rata-rata Kelas</p>
              <p className="text-2xl font-bold text-[#2563eb]">{summaryStats.rataRataKelas}</p>
            </div>
          </div>

          {/* Tertinggi */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Award className="h-6 w-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tertinggi</p>
              <p className="text-2xl font-bold text-[#10b981]">{summaryStats.nilaiTertinggi}</p>
            </div>
          </div>

          {/* Terendah */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-[#ef4444]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Terendah</p>
              <p className="text-2xl font-bold text-[#ef4444]">{summaryStats.nilaiTerendah}</p>
            </div>
          </div>

          {/* Siswa Tuntas */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Siswa Tuntas</p>
              <p className="text-2xl font-bold text-[#8b5cf6]">
                {summaryStats.siswaTuntas}/{summaryStats.totalSiswa}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Table Card ── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          {loadingNilai ? (
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
              <Filter className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">Pilih Filter Terlebih Dahulu</p>
              <p className="text-sm mt-1">
                Pilih kelas dan mata pelajaran, lalu klik &quot;Tampilkan&quot; untuk melihat rekap nilai
              </p>
            </div>
          ) : nilaiData.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Inbox className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">Data Tidak Ditemukan</p>
              <p className="text-sm mt-1">
                Belum ada data nilai untuk filter yang dipilih
              </p>
            </div>
          ) : (
            /* ── Data Table ── */
            <table className="siadak-table">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th>No</th>
                  <th>NIS</th>
                  <th>Nama</th>
                  <th>PH1</th>
                  <th>PH2</th>
                  <th>PH3</th>
                  <th>PH4</th>
                  <th>PTS</th>
                  <th>PAS</th>
                  <th>Rata-Rata</th>
                  <th>Nilai Akhir</th>
                  <th>Predikat</th>
                  <th>Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {nilaiData.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="font-medium">{idx + 1}</td>
                    <td className="font-mono text-sm">{item.nis}</td>
                    <td className="font-medium">{item.nama}</td>
                    <td>{item.ph1}</td>
                    <td>{item.ph2}</td>
                    <td>{item.ph3}</td>
                    <td>{item.ph4}</td>
                    <td>{item.pts}</td>
                    <td>{item.pas}</td>
                    <td>{item.rataRata}</td>
                    <td className="font-semibold">{item.nilaiAkhir}</td>
                    <td>
                      <Badge className={getPredikatColor(item.predikat)}>
                        {item.predikat}
                      </Badge>
                    </td>
                    <td>{getDeskripsiBadge(item.deskripsi, kkm, item.nilaiAkhir)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Bottom Actions ── */}
        {hasSearched && !loadingNilai && nilaiData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{nilaiData.length}</span> data
              nilai &middot; KKM: <span className="font-semibold text-foreground">{kkm}</span>
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExportCSV}
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
