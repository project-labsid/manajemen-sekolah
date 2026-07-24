'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { UserCheck, School, GraduationCap, FileCheck, Megaphone } from 'lucide-react'

export default function GuruDashboard() {
  const user = useAppStore((s) => s.user)
  const [absenToday, setAbsenToday] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [pengumuman, setPengumuman] = useState<any[]>([])
  const [jadwal, setJadwal] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const today = new Date().toISOString().split('T')[0]
        const [dashRes, absenRes, pgmRes] = await Promise.all([
          api.get<any>('/dashboard'),
          api.get<{ data: any[] }>(`/absensi-guru?tanggal=${today}&nama=${encodeURIComponent(user?.nama || '')}`),
          api.get<{ data: any[] }>('/pengumuman?limit=5'),
        ])
        setStats(dashRes.stats)
        setPengumuman(pgmRes.data?.slice(0, 5) || dashRes.recentPengumuman || [])
        if (absenRes.data?.length > 0) {
          setAbsenToday(absenRes.data[0])
        }
        // Generate mock jadwal for demo
        setJadwal([
          { jam: '07:30 - 09:00', kelas: '12A', mapel: 'Matematika' },
          { jam: '09:15 - 10:45', kelas: '11B', mapel: 'Matematika' },
          { jam: '11:00 - 12:30', kelas: '10A', mapel: 'Matematika Lanjutan' },
        ])
      } catch (e) { console.error(e) }
    }
    if (user) load()
  }, [user])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat Pagi'
    if (h < 15) return 'Selamat Siang'
    if (h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  const firstName = user?.nama?.split(',')[0]?.split(' ')[0] || 'Bapak/Ibu'

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
            <p className="text-blue-200/60 text-xs mt-2">SMA Negeri 1 Contoh</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Absen Status */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Status Absen Hari Ini</p>
            <UserCheck className="w-5 h-5 text-green-500" />
          </div>
          {absenToday?.jamMasuk ? (
            <>
              <p className="text-lg font-bold text-green-600">Hadir {absenToday.jamMasuk}</p>
              {absenToday.jamPulang && <p className="text-xs text-muted-foreground mt-1">Pulang: {absenToday.jamPulang}</p>}
            </>
          ) : (
            <p className="text-lg font-bold text-yellow-600">Belum Absen</p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Kelas Diampu</p>
            <School className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-lg font-bold" style={{ color: '#2563eb' }}>3 Kelas</p>
          <p className="text-xs text-muted-foreground mt-1">12A, 11B, 10A</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Jumlah Siswa</p>
            <GraduationCap className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-lg font-bold" style={{ color: '#8b5cf6' }}>{stats?.totalSiswa?.toLocaleString() || '90'} Siswa</p>
          <p className="text-xs text-muted-foreground mt-1">Di 3 kelas</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Nilai Diinput</p>
            <FileCheck className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>{stats?.totalNilai || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Data nilai tersimpan</p>
        </div>
      </div>

      {/* Jadwal & Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#0a2540' }}>Jadwal Mengajar Hari Ini</h3>
          <div className="space-y-3">
            {jadwal.map((j, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                <div className="text-center min-w-[80px]">
                  <p className="text-xs font-bold" style={{ color: '#2563eb' }}>{j.jam.split(' - ')[0]}</p>
                  <p className="text-[10px] text-muted-foreground">s/d</p>
                  <p className="text-xs font-bold" style={{ color: '#2563eb' }}>{j.jam.split(' - ')[1]}</p>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-slate-600" />
                <div>
                  <p className="text-sm font-semibold">Kelas {j.kelas}</p>
                  <p className="text-xs text-muted-foreground">{j.mapel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
    </div>
  )
}
