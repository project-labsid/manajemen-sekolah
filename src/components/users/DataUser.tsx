'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import { Plus, Search, Pencil, Trash2, X, Users, UserCog, Loader2, Shield, UserCheck, Eye, EyeOff } from 'lucide-react'

interface RoleItem {
  id: string
  slug: string
  nama: string
  deskripsi: string
}

interface UserRecord {
  id: string; nama: string; username: string; passwordText: string; role: string; status: string
  email: string; noHP: string; nip: string; jabatan: string; lastLogin: string | null; createdAt: string
}

const emptyForm = { nama: '', username: '', password: '', role: 'guru', email: '', noHP: '', nip: '', jabatan: '', status: 'aktif' }

const ROLE_COLORS: Record<string, string> = {
  'super-admin': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'admin': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'kepala-sekolah': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'wakil-kepala-sekolah': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'kurikulum': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'tata-usaha': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'operator': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'guru': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'wali-kelas': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'siswa': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'orang-tua': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
}

const DEFAULT_ROLE_COLOR = 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'

function getRoleBadgeClass(slug: string) {
  return ROLE_COLORS[slug] || DEFAULT_ROLE_COLOR
}

export default function DataUser() {
  const [data, setData] = useState<UserRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [roles, setRoles] = useState<RoleItem[]>([])
  const limit = 10

  const fetchRoles = useCallback(async () => {
    try {
      const res = await api.get<{ data: RoleItem[] }>('/roles')
      setRoles(res.data || [])
    } catch { /* silent */ }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set('search', search)
      if (roleFilter) params.set('role', roleFilter)
      const res = await api.get<{ data: UserRecord[]; total: number }>(`/users?${params}`)
      setData(res.data || [])
      setTotal(res.total || 0)
    } catch { toast.error('Gagal memuat data user') }
    finally { setLoading(false) }
  }, [page, search, roleFilter])

  useEffect(() => { fetchRoles() }, [fetchRoles])
  useEffect(() => { fetchData() }, [fetchData])

  const handleAdd = () => { setForm(emptyForm); setEditId(null); setShowPw(false); setShowModal(true) }
  const handleEdit = (u: UserRecord) => {
    setForm({ nama: u.nama, username: u.username, password: '', role: u.role, email: u.email, noHP: u.noHP, nip: u.nip, jabatan: u.jabatan, status: u.status })
    setEditId(u.id); setShowPw(false); setShowModal(true)
  }
  const handleSave = async () => {
    if (!form.nama || !form.username) { toast.error('Nama dan username wajib diisi'); return }
    if (!editId && !form.password) { toast.error('Password wajib diisi'); return }
    setSaving(true)
    try {
      if (editId) { await api.put('/users', { id: editId, ...form }); toast.success('User diperbarui') }
      else { await api.post('/users', form); toast.success('User ditambahkan') }
      setShowModal(false); fetchData()
    } catch (e: any) { toast.error(e.message || 'Gagal menyimpan') }
    finally { setSaving(false) }
  }
  const handleDelete = async () => {
    if (!deleteId) return
    setSaving(true)
    try { await api.delete(`/users?id=${deleteId}`); toast.success('User dihapus'); setShowDelete(false); setDeleteId(null); fetchData() }
    catch (e: any) { toast.error(e.message || 'Gagal menghapus') }
    finally { setSaving(false) }
  }

  const totalPages = Math.ceil(total / limit)
  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const labelCls = 'block text-sm font-medium mb-1.5'

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"><UserCog className="w-5 h-5 text-[#2563eb]" /></div>
          <div><h2 className="text-lg font-semibold" style={{ color: '#0a2540' }}>Data User</h2><p className="text-xs text-muted-foreground">Kelola akun pengguna sistem</p></div>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium bg-[#2563eb] hover:bg-[#1d4ed8]"><Plus className="w-4 h-4" /> Tambah User</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Users className="w-5 h-5" />, label: 'Total User', value: total, bg: 'bg-blue-50 dark:bg-blue-900/30', color: 'text-[#2563eb]' },
          { icon: <Shield className="w-5 h-5" />, label: 'Super Admin', value: data.filter(u => u.role === 'super-admin').length, bg: 'bg-purple-50 dark:bg-purple-900/30', color: 'text-purple-600' },
          { icon: <Shield className="w-5 h-5" />, label: 'Admin', value: data.filter(u => u.role === 'admin').length, bg: 'bg-blue-50 dark:bg-blue-900/30', color: 'text-[#2563eb]' },
          { icon: <UserCheck className="w-5 h-5" />, label: 'Guru & Wali Kelas', value: data.filter(u => u.role === 'guru' || u.role === 'wali-kelas').length, bg: 'bg-emerald-50 dark:bg-emerald-900/30', color: 'text-[#10b981]' },
          { icon: <UserCog className="w-5 h-5" />, label: 'Aktif', value: data.filter(u => u.status === 'aktif').length, bg: 'bg-amber-50 dark:bg-amber-900/30', color: 'text-[#f59e0b]' },
        ].map((c, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.color}`}>{c.icon}</div>
            <div><p className="text-xs text-muted-foreground">{c.label}</p><p className="text-xl font-bold">{c.value}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari nama atau username..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Role</option>
          {roles.map(r => <option key={r.slug} value={r.slug}>{r.nama}</option>)}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="siadak-table">
            <thead className="sticky top-0 z-10"><tr><th>No</th><th>Nama</th><th>Username</th><th>Password</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" /></td></tr>
              : data.length === 0 ? <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Tidak ada data</td></tr>
              : data.map((u, i) => (
                <tr key={u.id}>
                  <td className="text-center">{(page - 1) * limit + i + 1}</td>
                  <td className="font-medium">{u.nama}</td>
                  <td><code className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">{u.username}</code></td>
                  <td><code className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">{u.passwordText || '••••••••'}</code></td>
                  <td><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(u.role)}`}>{roles.find(r => r.slug === u.role)?.nama || u.role}</span></td>
                  <td><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${u.status === 'aktif' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>{u.status}</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(u)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { setDeleteId(u.id); setShowDelete(true) }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: '#0a2540' }}>{editId ? 'Edit User' : 'Tambah User'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>Nama</label><input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Username</label><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>{editId ? 'Password Baru (opsional)' : 'Password'}</label>
                <div className="relative"><input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls + ' pr-10'} placeholder={editId ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div><label className={labelCls}>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
                  <option value="">-- Pilih Role --</option>
                  {roles.map(r => <option key={r.slug} value={r.slug}>{r.nama}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>No. HP</label><input value={form.noHP} onChange={(e) => setForm({ ...form, noHP: e.target.value })} className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>NIP</label><input value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Jabatan</label><input value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} className={inputCls} /></div>
              </div>
              {editId && <div><label className={labelCls}>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">Batal</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setShowDelete(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#0a2540' }}>Hapus User</h3>
            <p className="text-sm text-muted-foreground mb-6">Apakah Anda yakin ingin menghapus user ini?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDelete(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-600">Batal</button>
              <button onClick={handleDelete} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}