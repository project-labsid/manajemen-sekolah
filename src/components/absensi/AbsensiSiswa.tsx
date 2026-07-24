'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { UserCheck, Calendar, Save, CheckCircle, Loader2, Inbox } from 'lucide-react'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
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

interface Kelas {
  id: string
  kodeKelas: string
  namaKelas: string
  waliKelas: string
  status: string
}

interface KelasResponse {
  data: Kelas[]
}

interface Siswa {
  id: number
  nis: string
  nama: string
  kelasId: number
  kelas?: string
  status: string
}

interface SiswaResponse {
  data: Siswa[]
}

interface AbsensiRecord {
  id: string
  siswaId: number
  tanggal: string
  kelas: string
  status: string
  keterangan: string
}

interface AbsensiResponse {
  data: AbsensiRecord[]
}

type StatusType = 'Hadir' | 'Sakit' | 'Izin' | 'Alpha'

interface AbsensiRow {
  siswaId: number
  nis: string
  nama: string
  status: StatusType
  keterangan: string
  absensiId?: string
}

const STATUS_OPTIONS: StatusType[] = ['Hadir', 'Sakit', 'Izin', 'Alpha']

const STATUS_COLORS: Record<StatusType, string> = {
  Hadir: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Sakit: 'bg-amber-100 text-amber-700 border-amber-200',
  Izin: 'bg-purple-100 text-purple-700 border-purple-200',
  Alpha: 'bg-red-100 text-red-600 border-red-200',
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AbsensiSiswa() {
  // ── Filter state ──
  const [tanggal, setTanggal] = useState<string>(getTodayString())
  const [selectedKelas, setSelectedKelas] = useState<string>('')
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loadingKelas, setLoadingKelas] = useState(true)

  // ── Table state ──
  const [rows, setRows] = useState<AbsensiRow[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // ── Save state ──
  const [saving, setSaving] = useState(false)

  // ── Fetch kelas list on mount ──
  const fetchKelas = useCallback(async () => {
    setLoadingKelas(true)
    try {
      const res = await api.get<KelasResponse>('/kelas')
      const data = (res as KelasResponse).data
      setKelasList(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Gagal memuat data kelas')
    } finally {
      setLoadingKelas(false)
    }
  }, [])

  useEffect(() => {
    fetchKelas()
  }, [fetchKelas])

  // ── Summary counts (live) ──
  const summary = useMemo(() => {
    const counts = { Hadir: 0, Sakit: 0, Izin: 0, Alpha: 0 }
    for (const row of rows) {
      if (row.status in counts) {
        counts[row.status]++
      }
    }
    return counts
  }, [rows])

  // ── Handle Tampilkan (load students) ──
  const handleTampilkan = useCallback(async () => {
    if (!selectedKelas) {
      toast.error('Pilih kelas terlebih dahulu')
      return
    }
    if (!tanggal) {
      toast.error('Tanggal harus diisi')
      return
    }

    setLoadingData(true)
    setDataLoaded(false)

    try {
      // Fetch siswa for the selected kelas
      const siswaRes = await api.get<SiswaResponse>(
        `/siswa?kelas=${encodeURIComponent(selectedKelas)}&limit=100`,
      )
      const siswaData = Array.isArray((siswaRes as SiswaResponse).data)
        ? (siswaRes as SiswaResponse).data
        : []

      // Fetch existing absensi for this tanggal & kelas
      const absensiRes = await api.get<AbsensiResponse>(
        `/absensi-siswa?tanggal=${encodeURIComponent(tanggal)}&kelas=${encodeURIComponent(selectedKelas)}`,
      )
      const absensiData = Array.isArray((absensiRes as AbsensiResponse).data)
        ? (absensiRes as AbsensiResponse).data
        : []

      // Build a map of siswaId -> absensi record
      const absensiMap = new Map<number, AbsensiRecord>()
      for (const a of absensiData) {
        absensiMap.set(a.siswaId, a)
      }

      // Merge: create rows with existing absensi data if any
      const merged: AbsensiRow[] = siswaData.map((s) => {
        const existing = absensiMap.get(s.id)
        return {
          siswaId: s.id,
          nis: s.nis || '-',
          nama: s.nama,
          status: (existing?.status as StatusType) || 'Hadir',
          keterangan: existing?.keterangan || '',
          absensiId: existing?.id,
        }
      })

      setRows(merged)
      setDataLoaded(true)
    } catch {
      toast.error('Gagal memuat data siswa')
      setRows([])
    } finally {
      setLoadingData(false)
    }
  }, [selectedKelas, tanggal])

  // ── Handle Tandai Semua Hadir ──
  const handleTandaiSemuaHadir = useCallback(() => {
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        status: 'Hadir' as StatusType,
      })),
    )
    toast.success('Semua siswa ditandai Hadir')
  }, [])

  // ── Update a single row's status ──
  const updateRowStatus = useCallback((siswaId: number, status: StatusType) => {
    setRows((prev) =>
      prev.map((row) =>
        row.siswaId === siswaId ? { ...row, status } : row,
      ),
    )
  }, [])

  // ── Update a single row's keterangan ──
  const updateRowKeterangan = useCallback((siswaId: number, keterangan: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.siswaId === siswaId ? { ...row, keterangan } : row,
      ),
    )
  }, [])

  // ── Handle Save ──
  const handleSimpan = useCallback(async () => {
    if (rows.length === 0) {
      toast.error('Belum ada data untuk disimpan')
      return
    }
    if (!tanggal) {
      toast.error('Tanggal harus diisi')
      return
    }

    setSaving(true)
    try {
      const absensiList = rows.map((row) => ({
        siswaId: row.siswaId,
        tanggal,
        kelas: selectedKelas,
        status: row.status,
        keterangan: row.keterangan,
        ...(row.absensiId ? { id: row.absensiId } : {}),
      }))

      await api.put('/absensi-siswa', { absensiList })
      toast.success('Absensi siswa berhasil disimpan!')

      // Re-fetch to get updated IDs
      await handleTampilkan()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan absensi'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }, [rows, tanggal, selectedKelas, handleTampilkan])

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="h-5 w-5 text-[#2563eb] flex-shrink-0" />
            <h2 className="text-lg font-semibold text-foreground whitespace-nowrap">
              Absensi Siswa
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full sm:w-auto">
            {/* Date input */}
            <div className="space-y-1.5">
              <Label htmlFor="tanggal-absensi" className="text-sm">
                Tanggal
              </Label>
              <Input
                id="tanggal-absensi"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full sm:w-44"
              />
            </div>

            {/* Kelas dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="kelas-absensi" className="text-sm">
                Kelas
              </Label>
              {loadingKelas ? (
                <Skeleton className="h-9 w-48" />
              ) : (
                <Select
                  value={selectedKelas}
                  onValueChange={setSelectedKelas}
                >
                  <SelectTrigger id="kelas-absensi" className="w-full sm:w-48">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {kelasList
                      .filter((k) => k.status === 'aktif')
                      .map((k) => (
                        <SelectItem key={k.id} value={k.kodeKelas}>
                          {k.namaKelas}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Tampilkan button */}
            <Button
              onClick={handleTampilkan}
              disabled={loadingData || !selectedKelas}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white whitespace-nowrap h-9"
            >
              {loadingData ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Tampilkan
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tandai Semua Hadir + Summary Cards ── */}
      <div className="space-y-4">
        {/* Tandai Semua Hadir button */}
        {dataLoaded && rows.length > 0 && (
          <Button
            onClick={handleTandaiSemuaHadir}
            className="bg-[#10b981] hover:bg-[#059669] text-white font-semibold h-10 px-5"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Tandai Semua Hadir
          </Button>
        )}

        {/* Summary Cards */}
        {dataLoaded && rows.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Hadir */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-[#10b981]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Hadir</p>
                <p className="text-xl sm:text-2xl font-bold text-[#10b981]">
                  {summary.Hadir}
                </p>
              </div>
            </div>

            {/* Sakit */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Sakit</p>
                <p className="text-xl sm:text-2xl font-bold text-[#f59e0b]">
                  {summary.Sakit}
                </p>
              </div>
            </div>

            {/* Izin */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#8b5cf6]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Izin</p>
                <p className="text-xl sm:text-2xl font-bold text-[#8b5cf6]">
                  {summary.Izin}
                </p>
              </div>
            </div>

            {/* Alpha */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-[#ef4444]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Alpha</p>
                <p className="text-xl sm:text-2xl font-bold text-[#ef4444]">
                  {summary.Alpha}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Attendance Table ── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          {loadingData ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : dataLoaded && rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Inbox className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">Tidak Ada Data Siswa</p>
              <p className="text-sm mt-1">
                Belum ada siswa terdaftar di kelas ini
              </p>
            </div>
          ) : dataLoaded && rows.length > 0 ? (
            <table className="siadak-table">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th>No</th>
                  <th>NIS</th>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.siswaId}>
                    <td className="font-medium text-center w-12">{idx + 1}</td>
                    <td className="font-mono text-sm w-24">{row.nis}</td>
                    <td className="font-medium">{row.nama}</td>
                    <td className="w-40">
                      <Select
                        value={row.status}
                        onValueChange={(v) =>
                          updateRowStatus(row.siswaId, v as StatusType)
                        }
                      >
                        <SelectTrigger
                          className={`h-8 text-xs font-medium border ${STATUS_COLORS[row.status]}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              <span
                                className={`inline-flex items-center gap-1.5`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    s === 'Hadir'
                                      ? 'bg-emerald-500'
                                      : s === 'Sakit'
                                        ? 'bg-amber-500'
                                        : s === 'Izin'
                                          ? 'bg-purple-500'
                                          : 'bg-red-500'
                                  }`}
                                />
                                {s}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="w-56">
                      <Input
                        type="text"
                        placeholder="Keterangan..."
                        value={row.keterangan}
                        onChange={(e) =>
                          updateRowKeterangan(row.siswaId, e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Calendar className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">Pilih Kelas & Tanggal</p>
              <p className="text-sm mt-1">
                Pilih kelas dan tanggal, lalu klik &quot;Tampilkan&quot; untuk memulai absensi
              </p>
            </div>
          )}
        </div>

        {/* Table footer with count */}
        {dataLoaded && rows.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Menampilkan{' '}
              <span className="font-semibold text-foreground">{rows.length}</span>{' '}
              siswa
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Hadir: {summary.Hadir}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-amber-500" />
                <span>Sakit: {summary.Sakit}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-purple-500" />
                <span>Izin: {summary.Izin}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-red-500" />
                <span>Alpha: {summary.Alpha}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Simpan Button ── */}
      {dataLoaded && rows.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleSimpan}
            disabled={saving}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold h-10 px-6"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      )}
    </div>
  )
}
