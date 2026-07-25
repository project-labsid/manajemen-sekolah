'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { History, Search, Clock, Globe, Users, Loader2 } from 'lucide-react'

interface RiwayatRecord {
  id: string; user: string; role: string; waktuLogin: string; ipAddress: string; userAgent: string; createdAt: string
}

function parseUA(ua: string): string {
  if (!ua) return '-'
  if (ua.includes('Firefox/')) return 'Firefox ' + (ua.split('Firefox/')[1]?.split(' ')[0] || '')
  if (ua.includes('Edg/')) return 'Edge ' + (ua.split('Edg/')[1]?.split(' ')[0] || '')
  if (ua.includes('Chrome/')) return 'Chrome ' + (ua.split('Chrome/')[1]?.split(' ')[0] || '')
  if (ua.includes('Safari/')) return 'Safari'
  return ua.slice(0, 50)
}

export default function RiwayatLogin() {
  const [data, setData] = useState<RiwayatRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const limit = 20

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set('search', search)
      const res = await api.get<{ data: RiwayatRecord[]; total: number }>(`/riwayat-login?${params}`)
      setData(res.data || [])
      setTotal(res.total || 0)
    } catch { toast.error('Gagal memuat riwayat login') }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchData() }, [fetchData])

  const today = new Date().toDateString()
  const weekAgo = new Date(Date.now() - 7 * 86400000)
  const loginHariIni = data.filter(d => new Date(d.waktuLogin).toDateString() === today).length
  const loginMingguIni = data.filter(d => new Date(d.waktuLogin) >= weekAgo).length
  const userUnik = new Set(data.map(d => d.user)).size
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center"><History className="w-5 h-5 text-[#8b5cf6]" /></div>
        <div><h2 className="text-lg font-semibold" style={{ color: '#0a2540' }}>Riwayat Login</h2><p className="text-xs text-muted-foreground">Catatan login seluruh pengguna</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center"><Clock className="w-5 h-5 text-[#10b981]" /></div>
          <div><p className="text-xs text-muted-foreground">Login Hari Ini</p><p className="text-xl font-bold">{loginHariIni}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"><Globe className="w-5 h-5 text-[#2563eb]" /></div>
          <div><p className="text-xs text-muted-foreground">Login Minggu Ini</p><p className="text-xl font-bold">{loginMingguIni}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center"><Users className="w-5 h-5 text-[#f59e0b]" /></div>
          <div><p className="text-xs text-muted-foreground">User Unik</p><p className="text-xl font-bold">{userUnik}</p></div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari nama user..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-md" />
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="siadak-table">
            <thead className="sticky top-0 z-10"><tr><th>No</th><th>User</th><th>Role</th><th>Waktu Login</th><th>IP Address</th><th>Browser/Device</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" /></td></tr>
              : data.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Tidak ada data</td></tr>
              : data.map((r, i) => (
                <tr key={r.id}>
                  <td className="text-center">{(page - 1) * limit + i + 1}</td>
                  <td className="font-medium">{r.user}</td>
                  <td><span className="inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">{r.role}</span></td>
                  <td className="text-sm">{(new Date(r.waktuLogin)).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td><code className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">{r.ipAddress || '-'}</code></td>
                  <td className="text-sm">{parseUA(r.userAgent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-muted-foreground">Menampilkan {data.length} dari {total}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-slate-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700">Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => { const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i; if (p > totalPages) return null; return <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-xs ${p === page ? 'bg-[#2563eb] text-white' : 'border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>{p}</button> })}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-slate-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
