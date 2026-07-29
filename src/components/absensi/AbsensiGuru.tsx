'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  LogIn,
  LogOut,
  Clock,
  MapPin,
  Calendar,
  Monitor,
  Loader2,
  Inbox,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AbsensiGuruRecord {
  id: string
  tanggal: string
  namaGuru: string
  nip: string
  jamMasuk: string
  jamPulang: string
  durasi: string
  status: string
  latitude: string
  longitude: string
  alamat: string
  browser: string
  device: string
  ip: string
  keterangan: string
  createdAt: string
  roleUser?: string
  jabatanUser?: string
}

interface AbsensiResponse {
  data: AbsensiGuruRecord[]
  tanggal: string
}

/* ------------------------------------------------------------------ */
/*  Role display helpers                                               */
/* ------------------------------------------------------------------ */

const ROLE_LABELS: Record<string, string> = {
  'super-admin': 'Super Admin',
  'admin': 'Admin',
  'kepala-sekolah': 'Kepala Sekolah',
  'wakil-kepala-sekolah': 'Wakil Kepala Sekolah',
  'kurikulum': 'Kurikulum',
  'tata-usaha': 'Tata Usaha',
  'operator': 'Operator',
  'guru': 'Guru',
  'wali-kelas': 'Wali Kelas',
}

const ROLE_COLORS: Record<string, string> = {
  'super-admin': 'bg-purple-100 text-purple-700',
  'admin': 'bg-rose-100 text-rose-700',
  'kepala-sekolah': 'bg-amber-100 text-amber-700',
  'wakil-kepala-sekolah': 'bg-orange-100 text-orange-700',
  'kurikulum': 'bg-cyan-100 text-cyan-700',
  'tata-usaha': 'bg-teal-100 text-teal-700',
  'operator': 'bg-indigo-100 text-indigo-700',
  'guru': 'bg-emerald-100 text-emerald-700',
  'wali-kelas': 'bg-sky-100 text-sky-700',
}

function getRoleBadge(roleSlug?: string) {
  if (!roleSlug) return null
  const label = ROLE_LABELS[roleSlug] || roleSlug
  const color = ROLE_COLORS[roleSlug] || 'bg-gray-100 text-gray-600'
  return <Badge className={`${color} hover:${color} border-0 text-[11px]`}>{label}</Badge>
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function formatDateDisplay(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return format(date, 'EEEE, dd MMMM yyyy', { locale: localeId })
  } catch {
    return dateStr
  }
}

function getBrowserInfo(): string {
  if (typeof navigator === 'undefined') return ''
  const ua = navigator.userAgent
  if (ua.includes('Firefox/')) return 'Firefox ' + ua.split('Firefox/')[1]?.split(' ')[0]
  if (ua.includes('Edg/')) return 'Edge ' + ua.split('Edg/')[1]?.split(' ')[0]
  if (ua.includes('Chrome/')) return 'Chrome ' + ua.split('Chrome/')[1]?.split(' ')[0]
  if (ua.includes('Safari/')) return 'Safari ' + ua.split('Version/')[1]?.split(' ')[0]
  return 'Unknown'
}

function getDeviceInfo(): string {
  if (typeof navigator === 'undefined') return ''
  const ua = navigator.userAgent
  if (/iPhone|iPad/.test(ua)) return 'iOS Device'
  if (/Android/.test(ua)) return 'Android Device'
  if (/Windows/.test(ua)) return 'Windows PC'
  if (/Mac/.test(ua)) return 'Mac'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown Device'
}

function getLocalTime(): string {
  const now = new Date()
  return now.toTimeString().slice(0, 5)
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Hadir':
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
          {status}
        </Badge>
      )
    case 'Sudah Pulang':
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
          {status}
        </Badge>
      )
    case 'Tidak Hadir':
    case 'Izin':
    case 'Sakit':
    case 'Alpha':
      return (
        <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0">
          {status}
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0">
          {status || '-'}
        </Badge>
      )
  }
}

function calculateDuration(jamMasuk: string, jamPulang: string): string {
  if (!jamMasuk || !jamPulang) return '-'
  try {
    const [h1, m1] = jamMasuk.split(':').map(Number)
    const [h2, m2] = jamPulang.split(':').map(Number)
    const diffMs = (h2 * 60 + m2 - h1 * 60 - m1) * 60 * 1000
    if (diffMs <= 0) return '-'
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) return `${hours} jam ${minutes} menit`
    return `${minutes} menit`
  } catch {
    return '-'
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AbsensiGuru() {
  const user = useAppStore((s) => s.user)
  // Roles that see rekap (all staff attendance)
  const isRekapViewer = ['super-admin', 'admin', 'kepala-sekolah', 'wakil-kepala-sekolah'].includes(user?.role || '')

  // ── State ──
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dateOpen, setDateOpen] = useState(false)
  const [records, setRecords] = useState<AbsensiGuruRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingMasuk, setSubmittingMasuk] = useState(false)
  const [submittingPulang, setSubmittingPulang] = useState(false)

  // ── Pulang dialog ──
  const [pulangDialogOpen, setPulangDialogOpen] = useState(false)
  const [pulangKeterangan, setPulangKeterangan] = useState('')
  const [pulangRecordId, setPulangRecordId] = useState<string | null>(null)
  const [pulangJam, setPulangJam] = useState('')

  // ── Sakit/Izin dialog ──
  const [sakitIzinDialogOpen, setSakitIzinDialogOpen] = useState(false)
  const [sakitIzinStatus, setSakitIzinStatus] = useState<'Sakit' | 'Izin'>('Sakit')
  const [sakitIzinKeterangan, setSakitIzinKeterangan] = useState('')
  const [submittingSakitIzin, setSubmittingSakitIzin] = useState(false)

  // ── Compute: today string for the selected date ──
  const selectedDateStr = useMemo(
    () => format(selectedDate, 'yyyy-MM-dd'),
    [selectedDate],
  )
  const isToday = selectedDateStr === getTodayString()

  // ── Compute: own today's record (exclude fake pending entries) ──
  const myTodayRecord = useMemo(() => {
    if (isRekapViewer && !isToday) return null
    return records.find(
      (r) => r.namaGuru === user?.nama && !r.id.startsWith('pending-'),
    ) || null
  }, [records, user, isRekapViewer, isToday])

  // ── Compute: own info cards data ──
  const ownJamMasuk = myTodayRecord?.jamMasuk || '-'
  const ownJamPulang = myTodayRecord?.jamPulang || '-'
  const ownDurasi = myTodayRecord?.durasi ||
    (myTodayRecord?.jamMasuk && !myTodayRecord?.jamPulang
      ? 'Masih bekerja'
      : '-')
  const ownStatus = myTodayRecord?.status || 'Tidak Hadir'

  // ── Can absen masuk? (only on today, no existing record) ──
  const canAbsenMasuk = isToday && !myTodayRecord
  // ── Can absen pulang? (today, has record, not yet clocked out) ──
  const canAbsenPulang = isToday && myTodayRecord && !myTodayRecord.jamPulang
  // ── Can sakit/izin? (today, no record yet) ──
  const canSakitIzin = isToday && !myTodayRecord

  // ── Geolocation ──
  const getGeolocation = useCallback((): Promise<{ latitude: string; longitude: string }> => {
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        resolve({ latitude: '', longitude: '' })
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: String(pos.coords.latitude),
            longitude: String(pos.coords.longitude),
          })
        },
        () => {
          resolve({ latitude: '', longitude: '' })
        },
        { enableHighAccuracy: false, timeout: 5000 },
      )
    })
  }, [])

  // ── Fetch attendance records ──
  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ tanggal: selectedDateStr })
      const res = await api.get<AbsensiResponse>(`/absensi-guru?${params.toString()}`)
      const absensiRes = res as unknown as AbsensiResponse & { isRekap?: boolean }
      const data = Array.isArray(absensiRes.data) ? absensiRes.data : []

      if (isRekapViewer) {
        // Admin/rekap: API already returns merged data (all staff + attendance status)
        setRecords(data)
      } else {
        // Non-admin: only show own record
        const filtered = data.filter((r) => r.namaGuru === user?.nama)
        setRecords(filtered)
      }
    } catch {
      toast.error('Gagal memuat data absensi')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [selectedDateStr, isRekapViewer, user])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  // ── Handle Absen Masuk ──
  const handleAbsenMasuk = useCallback(async () => {
    if (!user) return

    setSubmittingMasuk(true)
    try {
      const geo = await getGeolocation()
      const browser = getBrowserInfo()
      const device = getDeviceInfo()
      const jamMasuk = getLocalTime()

      await api.post('/absensi-guru', {
        namaGuru: user.nama,
        nip: user.nip || user.username || '',
        jamMasuk,
        latitude: geo.latitude,
        longitude: geo.longitude,
        browser,
        device,
        keterangan: '',
      })

      toast.success('Absen masuk berhasil dicatat!')
      fetchRecords()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal melakukan absen masuk'
      toast.error(message)
    } finally {
      setSubmittingMasuk(false)
    }
  }, [user, getGeolocation, fetchRecords])

  // ── Handle Absen Pulang: open dialog ──
  const handleOpenPulangDialog = useCallback(() => {
    if (!myTodayRecord || myTodayRecord.id.startsWith('pending-')) return
    setPulangRecordId(myTodayRecord.id)
    setPulangKeterangan('')
    setPulangJam(getLocalTime())
    setPulangDialogOpen(true)
  }, [myTodayRecord])

  // ── Handle Absen Pulang: submit ──
  const handleAbsenPulang = useCallback(async () => {
    if (!pulangRecordId || pulangRecordId.startsWith('pending-')) return

    setSubmittingPulang(true)
    try {
      await api.put('/absensi-guru', {
        id: pulangRecordId,
        jamPulang: pulangJam,
        keterangan: pulangKeterangan,
      })

      toast.success('Absen pulang berhasil dicatat!')
      setPulangDialogOpen(false)
      setPulangKeterangan('')
      setPulangRecordId(null)
      setPulangJam('')
      fetchRecords()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal melakukan absen pulang'
      toast.error(message)
    } finally {
      setSubmittingPulang(false)
    }
  }, [pulangRecordId, pulangKeterangan, fetchRecords])

  // ── Handle Sakit/Izin Submit ──
  const handleSakitIzin = useCallback(async () => {
    if (!user) return
    if (!sakitIzinKeterangan.trim()) {
      toast.error('Keterangan wajib diisi untuk Sakit/Izin')
      return
    }

    setSubmittingSakitIzin(true)
    try {
      await api.post('/absensi-guru', {
        namaGuru: user.nama,
        nip: user.nip || user.username || '',
        status: sakitIzinStatus,
        keterangan: sakitIzinKeterangan.trim(),
      })

      toast.success(`Absen ${sakitIzinStatus.toLowerCase()} berhasil dicatat!`)
      setSakitIzinDialogOpen(false)
      setSakitIzinKeterangan('')
      fetchRecords()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Gagal melakukan absen ${sakitIzinStatus.toLowerCase()}`
      toast.error(message)
    } finally {
      setSubmittingSakitIzin(false)
    }
  }, [user, sakitIzinStatus, sakitIzinKeterangan, fetchRecords])

  // ── Render ──
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── Action Buttons (ALL users, today only) ── */}
      {isToday && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Absen Masuk Button */}
          <button
            type="button"
            disabled={!canAbsenMasuk || submittingMasuk}
            onClick={handleAbsenMasuk}
            className={
              'relative flex items-center justify-center gap-3 rounded-2xl p-5 sm:p-6 text-white font-semibold text-base transition-all shadow-sm '
              +
              (canAbsenMasuk && !submittingMasuk
                ? 'bg-[#10b981] hover:bg-[#059669] hover:shadow-md active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed opacity-60')
            }
          >
            {submittingMasuk ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <LogIn className="h-6 w-6" />
            )}
            <span>{submittingMasuk ? 'Memproses...' : 'Absen Masuk'}</span>
            {!canAbsenMasuk && !submittingMasuk && myTodayRecord?.jamMasuk && (
              <span className="absolute top-2 right-3 text-xs font-normal opacity-80">
                Sudah diabsen
              </span>
            )}
          </button>

          {/* Absen Pulang Button */}
          <button
            type="button"
            disabled={!canAbsenPulang || submittingPulang}
            onClick={handleOpenPulangDialog}
            className={
              'relative flex items-center justify-center gap-3 rounded-2xl p-5 sm:p-6 text-white font-semibold text-base transition-all shadow-sm '
              +
              (canAbsenPulang && !submittingPulang
                ? 'bg-[#ef4444] hover:bg-[#dc2626] hover:shadow-md active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed opacity-60')
            }
          >
            {submittingPulang ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <LogOut className="h-6 w-6" />
            )}
            <span>{submittingPulang ? 'Memproses...' : 'Absen Pulang'}</span>
            {!canAbsenPulang && !submittingPulang && myTodayRecord?.jamPulang && (
              <span className="absolute top-2 right-3 text-xs font-normal opacity-80">
                Sudah pulang
              </span>
            )}
          </button>

          {/* Sakit/Izin Button */}
          <button
            type="button"
            disabled={!canSakitIzin || submittingSakitIzin}
            onClick={() => {
              setSakitIzinStatus('Sakit')
              setSakitIzinKeterangan('')
              setSakitIzinDialogOpen(true)
            }}
            className={
              'relative flex items-center justify-center gap-3 rounded-2xl p-5 sm:p-6 text-white font-semibold text-base transition-all shadow-sm '
              +
              (canSakitIzin && !submittingSakitIzin
                ? 'bg-[#f59e0b] hover:bg-[#d97706] hover:shadow-md active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed opacity-60')
            }
          >
            {submittingSakitIzin ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
            <span>{submittingSakitIzin ? 'Memproses...' : 'Sakit / Izin'}</span>
            {!canSakitIzin && !submittingSakitIzin && myTodayRecord && (
              <span className="absolute top-2 right-3 text-xs font-normal opacity-80">
                Sudah absen
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── Info Cards Row (own summary, shown for all on today) ── */}
      {isToday && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Jam Masuk */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-[#10b981]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Jam Masuk</p>
              <div className="text-lg sm:text-xl font-bold text-foreground truncate">
                {loading ? <Skeleton className="h-6 w-16 inline-block" /> : ownJamMasuk}
              </div>
            </div>
          </div>

          {/* Jam Pulang */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <LogOut className="h-6 w-6 text-[#ef4444]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Jam Pulang</p>
              <div className="text-lg sm:text-xl font-bold text-foreground truncate">
                {loading ? <Skeleton className="h-6 w-16 inline-block" /> : ownJamPulang}
              </div>
            </div>
          </div>

          {/* Durasi Kerja */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="h-6 w-6 text-[#f59e0b]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Durasi Kerja</p>
              <div className="text-lg sm:text-xl font-bold text-foreground truncate">
                {loading ? <Skeleton className="h-6 w-20 inline-block" /> : ownDurasi}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <div className="mt-0.5">
                {loading ? (
                  <Skeleton className="h-6 w-20 inline-block" />
                ) : (
                  getStatusBadge(ownStatus)
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Date Picker + Filter Card ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#10b981]" />
            <h2 className="text-lg font-semibold text-foreground">
              {isRekapViewer ? 'Rekap Absensi Pegawai' : 'Riwayat Absensi Saya'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Tanggal:</span>
            </div>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[220px] justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDateDisplay(selectedDateStr)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarUI
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    if (d) {
                      setSelectedDate(d)
                      setDateOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Display selected date summary for rekap viewers */}
        {isRekapViewer && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>
              Menampilkan data:{' '}
              <span className="font-semibold text-foreground">
                {formatDateDisplay(selectedDateStr)}
              </span>
            </span>
            <span className="text-border">|</span>
            <span>
              Total:{' '}
              <span className="font-semibold text-foreground">
                {records.length} pegawai
              </span>
            </span>
          </div>
        )}
      </div>

      {/* ── Attendance Table ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          {loading ? (
            /* ── Skeleton ── */
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Inbox className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">{isRekapViewer ? 'Belum Ada Data Pegawai' : 'Belum Ada Data Absensi'}</p>
              <p className="text-sm mt-1">
                {isRekapViewer
                  ? 'Belum ada pegawai yang aktif'
                  : 'Anda belum melakukan absensi hari ini'}
              </p>
            </div>
          ) : (
            /* ── Data Table ── */
            <table className="siadak-table">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  {isRekapViewer && <th>Role</th>}
                  <th>NIP/Username</th>
                  <th>Jam Masuk</th>
                  <th>Jam Pulang</th>
                  <th>Durasi</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="font-medium">{idx + 1}</td>
                    <td className="font-medium">{item.namaGuru}</td>
                    {isRekapViewer && <td>{getRoleBadge(item.roleUser)}</td>}
                    <td className="font-mono text-sm">{item.nip || '-'}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-emerald-500" />
                        {item.jamMasuk || '-'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-red-500" />
                        {item.jamPulang || '-'}
                      </div>
                    </td>
                    <td>{item.durasi || calculateDuration(item.jamMasuk, item.jamPulang)}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="max-w-[200px] truncate">{item.keterangan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        {!loading && records.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Menampilkan{' '}
              <span className="font-semibold text-foreground">{records.length}</span>{' '}
              {isRekapViewer ? 'data absensi pegawai' : 'data absensi'}
            </p>
            {isRekapViewer && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Hadir: {records.filter((r) => r.status === 'Hadir' || r.status === 'Sudah Pulang').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <span>Sakit/Izin: {records.filter((r) => r.status === 'Sakit' || r.status === 'Izin').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  <span>Tidak Hadir: {records.filter((r) => r.status === 'Tidak Hadir' || r.status === 'Alpha').length}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Absen Pulang Dialog ── */}
      <Dialog open={pulangDialogOpen} onOpenChange={setPulangDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-[#ef4444]" />
              Konfirmasi Absen Pulang
            </DialogTitle>
            <DialogDescription>
              Anda akan mencatat absen pulang pada pukul{' '}
              <span className="font-semibold text-foreground">
                {pulangJam}
              </span>
              . Tambahkan keterangan jika diperlukan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Info summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3">
                <p className="text-xs text-emerald-600 font-medium">Jam Masuk</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {myTodayRecord?.jamMasuk || '-'}
                </p>
              </div>
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-3">
                <p className="text-xs text-red-600 font-medium">Jam Pulang</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-400">
                  {pulangJam}
                </p>
              </div>
            </div>

            {/* Location & device info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Monitor className="h-4 w-4" />
              <span>{getBrowserInfo()} &middot; {getDeviceInfo()}</span>
            </div>

            {/* Keterangan */}
            <div className="space-y-2">
              <Label htmlFor="pulang-keterangan">Keterangan (opsional)</Label>
              <Textarea
                id="pulang-keterangan"
                placeholder="Tuliskan keterangan kegiatan hari ini..."
                value={pulangKeterangan}
                onChange={(e) => setPulangKeterangan(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setPulangDialogOpen(false)}
              disabled={submittingPulang}
            >
              Batal
            </Button>
            <Button
              onClick={handleAbsenPulang}
              disabled={submittingPulang}
              className="bg-[#ef4444] hover:bg-[#dc2626] text-white"
            >
              {submittingPulang ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              {submittingPulang ? 'Memproses...' : 'Absen Pulang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Sakit/Izin Dialog ── */}
      <Dialog open={sakitIzinDialogOpen} onOpenChange={setSakitIzinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#f59e0b]" />
              Absen Sakit / Izin
            </DialogTitle>
            <DialogDescription>
              Pilih status dan isi keterangan wajib untuk mencatat ketidakhadiran Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Status selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSakitIzinStatus('Sakit')}
                className={`p-4 rounded-xl border-2 text-center font-semibold transition-all ${
                  sakitIzinStatus === 'Sakit'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 text-gray-600 dark:text-slate-400'
                }`}
              >
                <p className="text-lg">🤒</p>
                <p className="text-sm mt-1">Sakit</p>
              </button>
              <button
                type="button"
                onClick={() => setSakitIzinStatus('Izin')}
                className={`p-4 rounded-xl border-2 text-center font-semibold transition-all ${
                  sakitIzinStatus === 'Izin'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 text-gray-600 dark:text-slate-400'
                }`}
              >
                <p className="text-lg">📋</p>
                <p className="text-sm mt-1">Izin</p>
              </button>
            </div>

            {/* Keterangan (mandatory) */}
            <div className="space-y-2">
              <Label htmlFor="sakit-izin-keterangan">
                Keterangan <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="sakit-izin-keterangan"
                placeholder={`Alasan ${sakitIzinStatus.toLowerCase()} Anda...`}
                value={sakitIzinKeterangan}
                onChange={(e) => setSakitIzinKeterangan(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Keterangan wajib diisi untuk status {sakitIzinStatus}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSakitIzinDialogOpen(false)}
              disabled={submittingSakitIzin}
            >
              Batal
            </Button>
            <Button
              onClick={handleSakitIzin}
              disabled={submittingSakitIzin || !sakitIzinKeterangan.trim()}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white"
            >
              {submittingSakitIzin ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              {submittingSakitIzin ? 'Memproses...' : `Kirim ${sakitIzinStatus}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
