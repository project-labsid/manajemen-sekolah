'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { Plus, Search, Pencil, Trash2, Megaphone, X } from 'lucide-react'

export default function Pengumuman() {
  const { user } = useAppStore()
  const isAdmin = user?.role === 'admin'
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [modal, setModal] = useState(false)
  const [edit, setEdit] = useState<any>(null)
  const [form, setForm] = useState({ judul: '', isi: '', tanggal: new Date().toISOString().split('T')[0], status: 'aktif', lampiran: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const limit = 10

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ data: any[]; pagination: any }>(`/pengumuman?page=${page}&limit=${limit}&status=aktif`)
      setData(res.data || [])
      if (res.pagination) setTotalPages(res.pagination.totalPages || 1)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page])

  const openAdd = () => { setEdit(null); setForm({ judul: '', isi: '', tanggal: new Date().toISOString().split('T')[0], status: 'aktif', lampiran: '' }); setError(''); setModal(true) }
  const openEdit = (item: any) => { setEdit(item); setForm({ judul: item.judul, isi: item.isi, tanggal: item.tanggal, status: item.status, lampiran: item.lampiran || '' }); setError(''); setModal(true) }

  const handleSave = async () => {
    if (!form.judul.trim()) { setError('Judul wajib diisi'); return }
    setSaving(true); setError('')
    try {
      if (edit) { await api.put('/pengumuman', { id: edit.id, ...form }) }
      else { await api.post('/pengumuman', form) }
      setModal(false); load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengumuman ini?')) return
    try { await api.del(`/pengumuman?id=${id}`); load() } catch (e) { console.error(e) }
  }

  const filtered = data.filter((p) => p.judul.toLowerCase().includes(search.toLowerCase()) || p.isi.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari pengumuman..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {isAdmin && (
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90" style={{ background: '#10b981' }}>
              <Plus className="w-4 h-4" /> Buat Pengumuman
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? ([...Array(4)].map((_, i) => <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm animate-pulse"><div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3" /><div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2" /><div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" /></div>))
        : filtered.length === 0 ? (<div className="col-span-full text-center py-16"><Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-3" /><p className="text-muted-foreground">Belum ada pengumuman</p></div>)
        : (filtered.map((p: any, i: number) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#eff6ff' }}><Megaphone className="w-5 h-5" style={{ color: '#2563eb' }} /></div>
                <div><h3 className="text-sm font-semibold" style={{ color: '#0a2540' }}>{p.judul}</h3><p className="text-[11px] text-muted-foreground">{p.tanggal}</p></div>
              </div>
              {isAdmin && (<div className="flex gap-1"><button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"><Pencil className="w-4 h-4" style={{ color: '#2563eb' }} /></button><button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button></div>)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{p.isi}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">Aktif</span></div>
          </div>
        )))}
      </div>

      {totalPages > 1 && (<div className="flex justify-end gap-2"><button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-slate-600 disabled:opacity-40">Prev</button><span className="px-3 py-1.5 text-sm font-medium" style={{ color: '#2563eb' }}>{page}/{totalPages}</span><button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-slate-600 disabled:opacity-40">Next</button></div>)}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-semibold" style={{ color: '#0a2540' }}>{edit ? 'Edit' : 'Buat'} Pengumuman</h3><button onClick={() => setModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">{error}</div>}
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1.5">Judul *</label><input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Isi</label><textarea rows={5} value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5">Tanggal</label><input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">Batal</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
