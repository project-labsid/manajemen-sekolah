'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { UserCheck, School, GraduationCap, FileCheck, Megaphone, LogIn, LogOut, Clock, CheckCircle2, BookOpen, Users } from 'lucide-react'
import { toast } from 'sonner'

interface MapelItem {
  kodeMapel: string
  namaMapel: string
  guru: string
  kkm: number
}

interface KelasItem {
  kodeKelas: string
  namaKelas: string
  waliKelas?: string
}

export default function GuruDashboard() {
  const user = useAppStore((s) => s.user)
  const hasPerm = useAppStore((s) => s.hasPermission)
  const [absenToday, setAbsenToday] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [pengumuman, setPengumuman] = useState<any[]>([])
  const [myMapel, setMyMapel] = useState<MapelItem[]>([])
  const [myKelas, setMyKelas] = useState<KelasItem[]>([])
  const [loadingMasuk, setLoadingMasuk] = useState(false)
  const [loadingPulang, setLoadingPulang] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  // Live clock
  useEffect(() => {
    function tick() {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const today = new Date().toISOString().split('T')[0]
        const [dashRes, absenRes, pgmRes] = await Promise.all([
          api.get<any>('/dashboard'),
          api.get<{ data: any[] }>(`/absensi-guru?tanggal=${today}&nama=${encodeURIComponent(user?.nama || '')}`),
          api.get<{ data: any[] }>('/pengumuman?limit=5'),
        ])

        // Guru-specific data from dashboard API
        const s = dashRes.stats || {}
        setStats(s)
        setMyMapel(s.myMapel || [])
        setMyKelas(s.kelasList || [])

        // Pengumuman - use dashboard response if it includes full data, else use pengumuman API
        const pgmData = pgmRes.data?.slice(0, 5) || dashRes.recentPengumuman || []
        setPengumuman(pgmData)

        // Absen today
        if (dashRes.myAbsenToday) {
          setAbsenToday(dashRes.myAbsenToday)
        } else if (absenRes.data?.length > 0) {
          setAbsenToday(absenRes.data[0])
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (user) load()
  }, [user])

  const handleAbsenMasuk = async () => {
    setLoadingMasuk(true)
    try {
      const res = await api.post<any>('/absensi-guru', {
        namaGuru: user?.nama,
        nip: user?.nip || '',
        browser: navigator.userAgent,
      })
      setAbsenToday(res.data || res)
      toast.success(`Absen masuk berhasil! Jam: ${res.data?.jamMasuk || res.jamMasuk || ''}`)
    } catch (err: any) {
      toast.error(err.message || 'Gagal melakukan absen masuk')
    } finally {
      setLoadingMasuk(false)
    }
  }

  const handleAbsenPulang = async () => {
    if (!absenToday?.id) return
    setLoadingPulang(true)
    try {
      const res = await api.put<any>('/absensi-guru', {
        id: absenToday.id,
      })
      setAbsenToday(res.data || res)
      toast.success(`Absen pulang berhasil!`)
    } catch (err: any) {
      toast.error(err.message || 'Gagal melakukan absen pulang')
    } finally {
      setLoadingPulang(false)
    }
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat Pagi'
    if (h < 15) return 'Selamat Siang'
    if (h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  const firstName = user?.nama?.split(',')[0]?.split(' ')[0] || 'Bapak/Ibu'
  const hasMasuk = !!absenToday?.jamMasuk
  const hasPulang = !!absenToday?.jamPulang

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Greeting Banner */}
      <div className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a2540 0%, #1e3a8a 60%, #2563eb 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2l2 3.5-2 3z\' fill=\'%23fff\'/%3E%3C/svg%3E")' }} />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border-2 border-white/30">
            <span className="text-2xl md:text-3xl font-bold">{firstName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-blue-200 text-sm">{greeting()},</p>
            <h2 className="text-xl md:text-2xl font-bold mt-1">{user?.nama}, {user?.nama?.split(',')[1]?.trim() || ''}</h2>
            <p className="text-blue-200/80 text-sm mt-1 italic">&quot;Bekerja dengan Hati, Mendidik Sepenuh Hati&quot;</p>
            <p className="text-blue-200/60 text-xs mt-2">{user?.jabatan || user?.roleName || 'Guru'}</p>
          </div>
        </div>
      </div>

      {/* Absen Section — Prominent Card */}
      {(hasPerm('absensi-guru:clock-in') || hasPerm('absensi-guru:clock-out')) && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: '#0a2540' }} />
              <h3 className="text-sm font-semibold" style={{ color: '#0a2540' }}>Absensi Hari Ini</h3>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold tabular-nums" style={{ color: '#0a2540' }}>{currentTime}</div>
              <div className="text-[11px] text-muted-foreground">{currentDate}</div>
            </div>
          </div>

          {/* Status Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className={`rounded-xl p-4 text-center ${hasMasuk ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600'}`}>
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${hasMasuk ? 'bg-emerald-500 text-white' : 'bg-gray-300 dark:bg-slate-600 text-gray-500'}`}>
                <LogIn className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted-foreground">Jam Masuk</p>
              <span className={`text-lg font-bold mt-1 block ${hasMasuk ? 'text-emerald-600' : 'text-gray-400'}`}>{hasMasuk ? absenToday.jamMasuk : '--:--'}</span>
            </div>
            <div className={`rounded-xl p-4 text-center ${hasPulang ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600'}`}>
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${hasPulang ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-slate-600 text-gray-500'}`}>
                <LogOut className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted-foreground">Jam Pulang</p>
              <span className={`text-lg font-bold mt-1 block ${hasPulang ? 'text-blue-600' : 'text-gray-400'}`}>{hasPulang ? absenToday.jamPulang : '--:--'}</span>
            </div>
            <div className={`rounded-xl p-4 text-center ${hasMasuk && hasPulang ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600'}`}>
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${hasMasuk && hasPulang ? 'bg-amber-500 text-white' : 'bg-gray-300 dark:bg-slate-600 text-gray-500'}`}>
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted-foreground">Durasi</p>
              <span className={`text-lg font-bold mt-1 block ${hasMasuk && hasPulang ? 'text-amber-600' : 'text-gray-400'}`}>{hasMasuk && hasPulang ? absenToday.durasi : '--'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!hasMasuk && hasPerm('absensi-guru:clock-in') && (
              <button
                onClick={handleAbsenMasuk}
                disabled={loadingMasuk}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
              >
                {loadingMasuk ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {loadingMasuk ? 'Memproses...' : 'Absen Masuk'}
              </button>
            )}
            {hasMasuk && !hasPulang && hasPerm('absensi-guru:clock-out') && (
              <button
                onClick={handleAbsenPulang}
                disabled={loadingPulang}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}
              >
                {loadingPulang ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
                {loadingPulang ? 'Memproses...' : 'Absen Pulang'}
              </button>
            )}
            {hasMasuk && hasPulang && (
              <div className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Absensi hari ini lengkap
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Kelas Diampu</p>
            <School className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-lg font-bold block" style={{ color: '#2563eb' }}>{stats?.totalKelas || 0} Kelas</span>
          <p className="text-xs text-muted-foreground mt-1">Kelas yang diampu</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Jumlah Siswa</p>
            <GraduationCap className="w-5 h-5 text-purple-500" />
          </div>
          <span className="text-lg font-bold block" style={{ color: '#8b5cf6' }}>{stats?.totalSiswa?.toLocaleString() || 0} Siswa</span>
          <p className="text-xs text-muted-foreground mt-1">Di kelas yang diampu</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Nilai Diinput</p>
            <FileCheck className="w-5 h-5 text-orange-500" />
          </div>
          <span className="text-lg font-bold block" style={{ color: '#f59e0b' }}>{stats?.totalNilai || 0}</span>
          <p className="text-xs text-muted-foreground mt-1">Data nilai tersimpan</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Status Absen</p>
            <UserCheck className="w-5 h-5 text-green-500" />
          </div>
          {hasMasuk ? (
            <>
              <span className="text-lg font-bold text-green-600 block">Hadir {absenToday.jamMasuk}</span>
              {hasPulang && <p className="text-xs text-muted-foreground mt-1">Pulang: {absenToday.jamPulang}</p>}
            </>
          ) : (
            <span className="text-lg font-bold text-yellow-600 block">Belum Absen</span>
          )}
        </div>
      </div>

      {/* Kelas & Mapel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kelas List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <School className="w-4 h-4" style={{ color: '#0a2540' }} />
            <h3 className="text-sm font-semibold" style={{ color: '#0a2540' }}>Kelas Diampu</h3>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {myKelas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada kelas yang diampu</p>
            ) : (
              myKelas.map((k: KelasItem) => (
                <div key={k.kodeKelas} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600/50">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <School className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold block" style={{ color: '#1a1a2e' }}>{k.namaKelas}</span>
                    <span className="text-[11px] text-muted-foreground block">{k.kodeKelas}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mapel List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4" style={{ color: '#0a2540' }} />
            <h3 className="text-sm font-semibold" style={{ color: '#0a2540' }}>Mata Pelajaran</h3>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {myMapel.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada mata pelajaran</p>
            ) : (
              myMapel.map((m: MapelItem) => (
                <div key={m.kodeMapel} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600/50">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold block" style={{ color: '#1a1a2e' }}>{m.namaMapel}</span>
                    <span className="text-[11px] text-muted-foreground block">KKM: {m.kkm} • {m.kodeMapel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-4 h-4" style={{ color: '#0a2540' }} />
          <h3 className="text-sm font-semibold" style={{ color: '#0a2540' }}>Pengumuman Terbaru</h3>
        </div>
        <div className="space-y-3 max-h-[280px] overflow-y-auto">
          {pengumuman.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada pengumuman</p>
          ) : (
            pengumuman.map((p: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600/50">
                <p className="text-xs font-semibold" style={{ color: '#1a1a2e' }}>{p.judul}</p>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{p.isi}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">{p.tanggal}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}