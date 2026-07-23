'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Save,
  RotateCcw,
  Download,
  Filter,
  Calculator,
  Loader2,
  Inbox,
  GraduationCap,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
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

// ── Types ────────────────────────────────────────────────────────────────────

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

interface SiswaItem {
  id: string
  nis: string
  nama: string
  kelas: string
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

interface SiswaRow {
  nis: string
  nama: string
  existingId: string | null
  ph1: string
  ph2: string
  ph3: string
  ph4: string
  pts: string
  pas: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const TAHUN_AJARAN_LIST = ['2022/2023', '2023/2024', '2024/2025']
const SEMESTER_LIST = ['Ganjil', 'Genap']

function parseNum(val: string): number {
  const n = parseFloat(val)
  return isNaN(n) ? 0 : n
}

function clampScore(val: string): string {
  const n = parseFloat(val)
  if (val === '' || isNaN(n)) return ''
  if (n < 0) return '0'
  if (n > 100) return '100'
  return String(Math.round(n))
}

function hitungRataRata(ph1: number, ph2: number, ph3: number, ph4: number): number {
  return Math.round(((ph1 + ph2 + ph3 + ph4) / 4) * 100) / 100
}

function hitungNilaiAkhir(rataRata: number, pts: number, pas: number): number {
  return Math.round((rataRata * 0.4 + pts * 0.3 + pas * 0.3) * 100) / 100
}

function hitungPredikat(nilaiAkhir: number): string {
  if (nilaiAkhir >= 90) return 'A'
  if (nilaiAkhir >= 80) return 'B+'
  if (nilaiAkhir >= 70) return 'B'
  if (nilaiAkhir >= 60) return 'C'
  return 'D'
}

function predikatBadgeClass(predikat: string): string {
  switch (predikat) {
    case 'A':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'B+':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'B':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'C':
      return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'D':
      return 'bg-red-100 text-red-700 border-red-200'
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200'
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function InputNilai() {
  const user = useAppStore((s) => s.user)

  // ── Filter state ──────────────────────────────────────────────────────────
  const [tahunAjaran, setTahunAjaran] = useState('2024/2025')
  const [semester, setSemester] = useState('Ganjil')
  const [kelas, setKelas] = useState('')
  const [mapel, setMapel] = useState('')

  // ── Reference data ────────────────────────────────────────────────────────
  const [kelasList, setKelasList] = useState<KelasItem[]>([])
  const [mapelList, setMapelList] = useState<MapelItem[]>([])

  // ── Table data ────────────────────────────────────────────────────────────
  const [rows, setRows] = useState<SiswaRow[]>([])
  const [loaded, setLoaded] = useState(false)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [loadingFilters, setLoadingFilters] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [saving, setSaving] = useState(false)

  // ── Fetch kelas & mapel on mount ──────────────────────────────────────────
  useEffect(() => {
    async function loadRefData() {
      setLoadingFilters(true)
      try {
        const [kelasRes, mapelRes] = await Promise.all([
          api.get<{ data: KelasItem[] }>('/kelas'),
          api.get<{ data: MapelItem[] }>('/mapel'),
        ])
        setKelasList(kelasRes.data ?? [])
        setMapelList(mapelRes.data ?? [])
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memuat data referensi'
        toast.error(msg)
      } finally {
        setLoadingFilters(false)
      }
    }
    loadRefData()
  }, [])

  // ── Load siswa & existing nilai ───────────────────────────────────────────
  const handleTampilkan = useCallback(async () => {
    if (!kelas || !mapel) {
      toast.warning('Pilih Kelas dan Mata Pelajaran terlebih dahulu')
      return
    }
    setLoadingData(true)
    setLoaded(false)
    try {
      // Fetch siswa with limit=100 to get all in one page
      const siswaRes = await api.get<{
        data: SiswaItem[]
        pagination: { total: number; totalPages: number }
      }>(`/siswa?kelas=${encodeURIComponent(kelas)}&limit=100`)

      const siswaData = siswaRes.data ?? []

      if (siswaData.length === 0) {
        setRows([])
        setLoaded(true)
        setLoadingData(false)
        toast.info('Tidak ada siswa di kelas ini')
        return
      }

      // Fetch existing nilai for this combination
      const nilaiRes = await api.get<{ data: NilaiItem[] }>(
        `/nilai?kelas=${encodeURIComponent(kelas)}&mapel=${encodeURIComponent(mapel)}&semester=${encodeURIComponent(semester)}&tahunAjaran=${encodeURIComponent(tahunAjaran)}`
      )
      const nilaiData = nilaiRes.data ?? []

      // Build a lookup by NIS
      const nilaiMap = new Map<string, NilaiItem>()
      for (const n of nilaiData) {
        nilaiMap.set(n.nis, n)
      }

      // Merge siswa with existing nilai
      const merged: SiswaRow[] = siswaData.map((s) => {
        const existing = nilaiMap.get(s.nis)
        return {
          nis: s.nis,
          nama: s.nama,
          existingId: existing?.id ?? null,
          ph1: existing ? String(existing.ph1) : '',
          ph2: existing ? String(existing.ph2) : '',
          ph3: existing ? String(existing.ph3) : '',
          ph4: existing ? String(existing.ph4) : '',
          pts: existing ? String(existing.pts) : '',
          pas: existing ? String(existing.pas) : '',
        }
      })

      setRows(merged)
      setLoaded(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data siswa'
      toast.error(msg)
    } finally {
      setLoadingData(false)
    }
  }, [kelas, mapel, semester, tahunAjaran])

  // ── Score change handler ──────────────────────────────────────────────────
  const handleScoreChange = useCallback(
    (index: number, field: keyof Pick<SiswaRow, 'ph1' | 'ph2' | 'ph3' | 'ph4' | 'pts' | 'pas'>, raw: string) => {
      // Allow empty, or clamp to 0-100 integers
      let val = raw
      if (val !== '') {
        val = clampScore(val)
      }
      setRows((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], [field]: val }
        return next
      })
    },
    []
  )

  // ── Computed row values ───────────────────────────────────────────────────
  const computedRows = useMemo(() => {
    return rows.map((r) => {
      const p1 = parseNum(r.ph1)
      const p2 = parseNum(r.ph2)
      const p3 = parseNum(r.ph3)
      const p4 = parseNum(r.ph4)
      const pts = parseNum(r.pts)
      const pas = parseNum(r.pas)

      const hasAny = r.ph1 !== '' || r.ph2 !== '' || r.ph3 !== '' || r.ph4 !== '' || r.pts !== '' || r.pas !== ''
      const rataRata = hasAny ? hitungRataRata(p1, p2, p3, p4) : 0
      const nilaiAkhir = hasAny ? hitungNilaiAkhir(rataRata, pts, pas) : 0
      const predikat = hasAny ? hitungPredikat(nilaiAkhir) : ''

      return { ...r, rataRata, nilaiAkhir, predikat }
    })
  }, [rows])

  // ── Simpan (Save) ─────────────────────────────────────────────────────────
  const handleSimpan = useCallback(async () => {
    if (rows.length === 0) {
      toast.warning('Belum ada data untuk disimpan')
      return
    }

    setSaving(true)
    try {
      const nilaiList = computedRows.map((r) => ({
        id: r.existingId,
        tahunAjaran,
        semester,
        kelas,
        mapel,
        guru: user?.nama ?? '',
        nis: r.nis,
        nama: r.nama,
        ph1: parseNum(r.ph1),
        ph2: parseNum(r.ph2),
        ph3: parseNum(r.ph3),
        ph4: parseNum(r.ph4),
        pts: parseNum(r.pts),
        pas: parseNum(r.pas),
      }))

      const res = await api.put<{ data: NilaiItem[]; message: string }>('/nilai', { nilaiList })
      toast.success(res.message || 'Nilai berhasil disimpan')

      // Refresh to get IDs
      await handleTampilkan()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan nilai'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }, [rows, computedRows, tahunAjaran, semester, kelas, mapel, user, handleTampilkan])

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        ph1: '',
        ph2: '',
        ph3: '',
        ph4: '',
        pts: '',
        pas: '',
      }))
    )
    toast.info('Semua nilai telah direset')
  }, [])

  // ── Export Excel (CSV) ────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    if (computedRows.length === 0) {
      toast.warning('Tidak ada data untuk diekspor')
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
    ]

    const csvRows = computedRows.map((r, i) => {
      return [
        i + 1,
        r.nis,
        r.nama,
        r.ph1,
        r.ph2,
        r.ph3,
        r.ph4,
        r.pts,
        r.pas,
        r.rataRata,
        r.nilaiAkhir,
        r.predikat,
      ].join(',')
    })

    const csv = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Nilai_${kelas}_${mapel}_${semester}_${tahunAjaran}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Data berhasil diekspor')
  }, [computedRows, kelas, mapel, semester, tahunAjaran])

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderScoreInput = (
    index: number,
    field: keyof Pick<SiswaRow, 'ph1' | 'ph2' | 'ph3' | 'ph4' | 'pts' | 'pas'>
  ) => (
    <input
      type="number"
      min={0}
      max={100}
      step={1}
      value={rows[index][field]}
      onChange={(e) => handleScoreChange(index, field, e.target.value)}
      className="w-16 h-8 text-center text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  )

  // ── Loading skeleton for filter bar ───────────────────────────────────────
  if (loadingFilters) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap gap-4 items-end">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[160px]">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 space-y-6" style={{ backgroundColor: '#f4f6f9', minHeight: '100%' }}>
      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-800">Filter Data Nilai</h2>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          {/* Tahun Ajaran */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Tahun Ajaran
            </label>
            <Select value={tahunAjaran} onValueChange={setTahunAjaran}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tahun Ajaran" />
              </SelectTrigger>
              <SelectContent>
                {TAHUN_AJARAN_LIST.map((ta) => (
                  <SelectItem key={ta} value={ta}>
                    {ta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Semester</label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Semester" />
              </SelectTrigger>
              <SelectContent>
                {SEMESTER_LIST.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kelas */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Kelas</label>
            <Select value={kelas} onValueChange={setKelas}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kelas" />
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
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Mata Pelajaran
            </label>
            <Select value={mapel} onValueChange={setMapel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Mapel" />
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

          {/* Tampilkan Button */}
          <div>
            <Button
              onClick={handleTampilkan}
              disabled={loadingData}
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-5"
            >
              {loadingData ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              ) : (
                <Filter className="w-4 h-4 mr-1.5" />
              )}
              Tampilkan
            </Button>
          </div>
        </div>
      </div>

      {/* ── Table Card ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        {/* Table Header Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-800">
              Input Nilai Siswa
            </h2>
            {loaded && rows.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {rows.length} siswa
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calculator className="w-3.5 h-3.5" />
            <span>Rata-Rata = 40% × Rata PH + 30% × PTS + 30% × PAS</span>
          </div>
        </div>

        {/* Loading State */}
        {loadingData && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500">Memuat data siswa...</p>
          </div>
        )}

        {/* Empty State — not yet loaded */}
        {!loadingData && !loaded && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <Inbox className="w-16 h-16" />
            <p className="text-sm font-medium">Pilih filter dan klik &quot;Tampilkan&quot; untuk memuat data</p>
            <p className="text-xs">Data siswa akan ditampilkan sesuai kelas dan mata pelajaran yang dipilih</p>
          </div>
        )}

        {/* Empty State — loaded but no students */}
        {!loadingData && loaded && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <Inbox className="w-16 h-16" />
            <p className="text-sm font-medium">Tidak ada data siswa untuk kelas ini</p>
            <p className="text-xs">Pastikan kelas yang dipilih memiliki siswa terdaftar</p>
          </div>
        )}

        {/* Table */}
        {!loadingData && loaded && rows.length > 0 && (
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="siadak-table w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50">
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 border-b border-gray-200 min-w-[40px]">
                    No
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 border-b border-gray-200 min-w-[80px]">
                    NIS
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 border-b border-gray-200 min-w-[180px]">
                    Nama
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-blue-600 border-b border-gray-200 min-w-[72px]">
                    PH1
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-blue-600 border-b border-gray-200 min-w-[72px]">
                    PH2
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-blue-600 border-b border-gray-200 min-w-[72px]">
                    PH3
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-blue-600 border-b border-gray-200 min-w-[72px]">
                    PH4
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-purple-600 border-b border-gray-200 min-w-[72px]">
                    PTS
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-purple-600 border-b border-gray-200 min-w-[72px]">
                    PAS
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 border-b border-gray-200 min-w-[85px]">
                    Rata-Rata
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 border-b border-gray-200 min-w-[85px]">
                    Nilai Akhir
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 border-b border-gray-200 min-w-[70px]">
                    Predikat
                  </th>
                </tr>
              </thead>
              <tbody>
                {computedRows.map((row, idx) => (
                  <tr
                    key={row.nis}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  >
                    {/* No */}
                    <td className="px-3 py-2.5 text-center text-gray-500 border-b border-gray-100">
                      {idx + 1}
                    </td>

                    {/* NIS */}
                    <td className="px-3 py-2.5 text-left font-mono text-gray-700 border-b border-gray-100">
                      {row.nis}
                    </td>

                    {/* Nama */}
                    <td className="px-3 py-2.5 text-left font-medium text-gray-800 border-b border-gray-100">
                      {row.nama}
                    </td>

                    {/* PH1 - PH4 */}
                    <td className="px-3 py-1.5 text-center border-b border-gray-100">
                      {renderScoreInput(idx, 'ph1')}
                    </td>
                    <td className="px-3 py-1.5 text-center border-b border-gray-100">
                      {renderScoreInput(idx, 'ph2')}
                    </td>
                    <td className="px-3 py-1.5 text-center border-b border-gray-100">
                      {renderScoreInput(idx, 'ph3')}
                    </td>
                    <td className="px-3 py-1.5 text-center border-b border-gray-100">
                      {renderScoreInput(idx, 'ph4')}
                    </td>

                    {/* PTS */}
                    <td className="px-3 py-1.5 text-center border-b border-gray-100">
                      {renderScoreInput(idx, 'pts')}
                    </td>

                    {/* PAS */}
                    <td className="px-3 py-1.5 text-center border-b border-gray-100">
                      {renderScoreInput(idx, 'pas')}
                    </td>

                    {/* Rata-Rata */}
                    <td className="px-3 py-2.5 text-center font-medium text-gray-700 border-b border-gray-100">
                      {row.predikat ? row.rataRata : <span className="text-gray-300">-</span>}
                    </td>

                    {/* Nilai Akhir */}
                    <td className="px-3 py-2.5 text-center font-bold text-gray-800 border-b border-gray-100">
                      {row.predikat ? row.nilaiAkhir : <span className="text-gray-300">-</span>}
                    </td>

                    {/* Predikat */}
                    <td className="px-3 py-2.5 text-center border-b border-gray-100">
                      {row.predikat ? (
                        <Badge
                          variant="outline"
                          className={`font-bold text-xs px-2.5 py-0.5 ${predikatBadgeClass(row.predikat)}`}
                        >
                          {row.predikat}
                        </Badge>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Bottom Action Bar ─────────────────────────────────────────────── */}
      {loaded && rows.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex flex-wrap gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={saving}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={saving}
              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 gap-1.5"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </Button>

            <Button
              onClick={handleSimpan}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 min-w-[120px]"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
