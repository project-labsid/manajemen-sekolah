'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Shield, Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function AuditLog() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => {
    const timer = setTimeout(() => { if (page === 1) { load() } else { setPage(1) } }, 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => { load() }, [page])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ data: any[]; pagination: any }>(`/audit-log?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`)
      setData(res.data || [])
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1)
        setTotal(res.pagination.total || 0)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const aktivitasColor = (a: string) => {
    if (a.includes('Login') || a.includes('Hapus')) return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
    if (a.includes('Tambah') || a.includes('Buat') || a.includes('Import')) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
    if (a.includes('Edit') || a.includes('Update')) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
    return 'text-gray-600 bg-gray-50 dark:bg-slate-700 dark:text-gray-300'
  }

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pageNumbers.push(i)
    else if (pageNumbers[pageNumbers.length - 1] !== '...') pageNumbers.push('...')
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#eff6ff' }}><Shield className="w-5 h-5" style={{ color: '#2563eb' }} /></div>
            <div><h3 className="text-sm font-semibold" style={{ color: '#0a2540' }}>Audit Log</h3><p className="text-[11px] text-muted-foreground">Riwayat aktivitas sistem ({total} entri)</p></div>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari log..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="siadak-table">
            <thead><tr><th>No</th><th>Tanggal</th><th>User</th><th>Role</th><th>Aktivitas</th><th>Detail</th><th>IP</th></tr></thead>
            <tbody>
              {loading ? ([...Array(8)].map((_, i) => <tr key={i}><td colSpan={7}><div className="h-8 bg-gray-100 dark:bg-slate-700 rounded animate-pulse my-1" /></td></tr>))
              : data.length === 0 ? (<tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Tidak ada log ditemukan</td></tr>)
              : (data.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{from + i}</td>
                  <td className="whitespace-nowrap text-xs">{item.tanggal}</td>
                  <td className="font-medium">{item.user}</td>
                  <td><span className="capitalize text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700">{item.role}</span></td>
                  <td><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${aktivitasColor(item.aktivitas)}`}>{item.aktivitas}</span></td>
                  <td className="max-w-[200px] truncate text-xs text-muted-foreground">{item.detail}</td>
                  <td className="text-xs text-muted-foreground font-mono">{item.ip}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-muted-foreground">Menampilkan {from}–{to} dari {total}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-600 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
              {pageNumbers.map((p, i) => typeof p === 'number' ? (
                <button key={i} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === page ? 'text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`} style={p === page ? { background: '#2563eb' } : undefined}>{p}</button>
              ) : (<span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground">...</span>))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-600 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
