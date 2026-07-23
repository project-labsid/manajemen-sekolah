'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { Users, GraduationCap, School, BookOpen, UserCheck, UserX, Clock, AlertTriangle, FileCheck } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface DashStats {
  totalGuru: number
  totalSiswa: number
  totalKelas: number
  totalMapel: number
  guruHadir: number
  guruTidakHadir: number
  guruSudahPulang: number
  siswaHadir: number
  siswaSakit: number
  siswaIzin: number
  siswaAlpha: number
  totalNilai: number
  rataRataKeseluruhan: number
  persentaseLulus: number
  pengumumanAktif: number
}

const COLORS = ['#2563eb','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899','#f97316']

function MetricCard({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color + '15', color }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashStats | null>(null)
  const [pengumuman, setPengumuman] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [dashRes, pgmRes] = await Promise.all([
          api.get<{ stats: DashStats; recentPengumuman: any[]; siswaPerKelas: any[] }>('/dashboard'),
          api.get<{ data: any[] }>('/pengumuman?limit=5'),
        ])
        setStats(dashRes.stats)
        setPengumuman(pgmRes.data?.slice(0, 5) || dashRes.recentPengumuman || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(7)].map((_, i) => <div key={i} className="h-28 bg-gray-100 dark:bg-slate-800 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (!stats) return <p className="text-muted-foreground">Gagal memuat dashboard</p>

  const kehadiranGuru = [
    { name: 'Hadir', value: stats.guruHadir + stats.guruSudahPulang },
    { name: 'Tidak Hadir', value: stats.guruTidakHadir },
  ]

  const kehadiranSiswa = [
    { name: 'Hadir', value: stats.siswaHadir, fill: '#10b981' },
    { name: 'Izin', value: stats.siswaIzin, fill: '#8b5cf6' },
    { name: 'Sakit', value: stats.siswaSakit, fill: '#f59e0b' },
    { name: 'Alpha', value: stats.siswaAlpha, fill: '#ef4444' },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Row 1: 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<Users className="w-5 h-5" />} label="Jumlah Guru" value={stats.totalGuru} color="#2563eb" sub="Guru terdaftar" />
        <MetricCard icon={<GraduationCap className="w-5 h-5" />} label="Jumlah Siswa" value={stats.totalSiswa.toLocaleString()} color="#10b981" sub="Siswa aktif" />
        <MetricCard icon={<School className="w-5 h-5" />} label="Jumlah Kelas" value={stats.totalKelas} color="#8b5cf6" sub="Kelas aktif" />
        <MetricCard icon={<BookOpen className="w-5 h-5" />} label="Mata Pelajaran" value={stats.totalMapel} color="#f59e0b" sub="Mapel aktif" />
      </div>

      {/* Row 2: 7 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <MetricCard icon={<UserCheck className="w-4 h-4" />} label="Guru Hadir" value={stats.guruHadir} color="#10b981" />
        <MetricCard icon={<UserX className="w-4 h-4" />} label="Guru Tidak Hadir" value={stats.guruTidakHadir} color="#ef4444" />
        <MetricCard icon={<Clock className="w-4 h-4" />} label="Guru Sudah Pulang" value={stats.guruSudahPulang} color="#2563eb" />
        <MetricCard icon={<AlertTriangle className="w-4 h-4" />} label="Siswa Sakit" value={stats.siswaSakit} color="#f59e0b" />
        <MetricCard icon={<Users className="w-4 h-4" />} label="Siswa Izin" value={stats.siswaIzin} color="#8b5cf6" />
        <MetricCard icon={<UserCheck className="w-4 h-4" />} label="Siswa Hadir" value={stats.siswaHadir.toLocaleString()} color="#10b981" />
        <MetricCard icon={<FileCheck className="w-4 h-4" />} label="Nilai Diinput" value={stats.totalNilai} color="#2563eb" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut: Kehadiran Guru */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#0a2540' }}>Kehadiran Guru Hari Ini</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kehadiranGuru}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Kehadiran Siswa */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#0a2540' }}>Kehadiran Siswa Hari Ini</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kehadiranSiswa}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {kehadiranSiswa.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Pengumuman */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#0a2540' }}>Pengumuman Terbaru</h3>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {pengumuman.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada pengumuman</p>
            ) : (
              pengumuman.map((p: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600/50">
                  <p className="text-xs font-semibold truncate" style={{ color: '#1a1a2e' }}>{p.judul}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{p.tanggal}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50 text-center">
          <p className="text-xs text-muted-foreground">Rata-rata Keseluruhan</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#2563eb' }}>{stats.rataRataKeseluruhan.toFixed(1)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50 text-center">
          <p className="text-xs text-muted-foreground">Persentase Lulus</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#10b981' }}>{stats.persentaseLulus.toFixed(1)}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50 text-center">
          <p className="text-xs text-muted-foreground">Total Nilai</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#8b5cf6' }}>{stats.totalNilai}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50 text-center">
          <p className="text-xs text-muted-foreground">Pengumuman Aktif</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#f59e0b' }}>{stats.pengumumanAktif}</p>
        </div>
      </div>
    </div>
  )
}
