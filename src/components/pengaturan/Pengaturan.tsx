'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { Save, School, BookOpen, Palette, Building, Users, ChevronRight, Search, Plus, Pencil, Trash2, X, Eye, EyeOff, Loader2, UserCog } from 'lucide-react'
import { toast } from 'sonner'

const currentYear = new Date().getFullYear()
const tahunAjaranList = [
  `${currentYear - 2}/${currentYear - 1}`,
  `${currentYear - 1}/${currentYear}`,
  `${currentYear}/${currentYear + 1}`,
  `${currentYear + 1}/${currentYear + 2}`,
]

type TabKey = 'sekolah' | 'akademik' | 'tampilan' | 'guru-profiles'

export default function Pengaturan() {
  const { user } = useAppStore()
  const isAdmin = user?.role === 'admin'
  const [activeTab, setActiveTab] = useState<TabKey>('sekolah')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    namaSekolah: '', alamat: '', npsn: '', email: '', website: '', telepon: '',
    kepalaSekolah: '', nipKepalaSekolah: '', moto: '', visi: '', misi: '',
    semesterAktif: 'Ganjil', tahunAjaranAktif: `${currentYear - 1}/${currentYear}`,
  })

  // Guru profiles state
  const [guruList, setGuruList] = useState<any[]>([])
  const [searchGuru, setSearchGuru] = useState('')
  const [editGuru, setEditGuru] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [savingGuru, setSavingGuru] = useState(false)

  useEffect(() => { loadSettings() }, [])
  useEffect(() => { if (activeTab === 'guru-profiles') loadGuruList() }, [activeTab])

  const loadSettings = async () => {
    try {
      const res = await api.get<{ data: any }>('/pengaturan')
      if (res.data) setForm((f) => ({ ...f, ...res.data }))
    } catch (e) { console.error(e) }
  }

  const handleSave = async () => {
    if (!isAdmin) return
    setSaving(true); setMsg('')
    try {
      await api.put('/pengaturan', form)
      setMsg('Pengaturan berhasil disimpan!')
      setTimeout(() => setMsg(''), 3000)
    } catch (e: any) { setMsg('Gagal: ' + e.message) }
    finally { setSaving(false) }
  }

  const loadGuruList = async () => {
    try {
      const res = await api.get<{ data: any[] }>('/users?role=guru')
      setGuruList(res.data || [])
    } catch { setGuruList([]) }
  }

  const filteredGuru = guruList.filter(g =>
    g.nama.toLowerCase().includes(searchGuru.toLowerCase()) ||
    g.username.toLowerCase().includes(searchGuru.toLowerCase())
  )

  const handleSaveGuruProfile = async () => {
    if (!editGuru) return
    setSavingGuru(true)
    try {
      await api.put('/users', editGuru)
      toast.success(`Profil ${editGuru.nama} berhasil diperbarui`)
      setEditGuru(null)
      loadGuruList()
    } catch (e: any) {
      toast.error(e.message || 'Gagal memperbarui profil')
    } finally { setSavingGuru(false) }
  }

  const handleResetGuruPassword = async (guruUser: any) => {
    const newPw = 'guru123'
    setSavingGuru(true)
    try {
      await api.put('/users', { id: guruUser.id, password: newPw })
      toast.success(`Password ${guruUser.nama} berhasil direset ke: ${newPw}`)
    } catch (e: any) {
      toast.error(e.message || 'Gagal reset password')
    } finally { setSavingGuru(false) }
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { key: 'sekolah', label: 'Data Sekolah', icon: <Building className="w-4 h-4" /> },
    { key: 'akademik', label: 'Akademik', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'guru-profiles', label: 'Profil Guru', icon: <UserCog className="w-4 h-4" />, adminOnly: true },
    { key: 'tampilan', label: 'Tampilan', icon: <Palette className="w-4 h-4" /> },
  ]

  const visibleTabs = isAdmin ? tabs : tabs.filter(t => !t.adminOnly)

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  const labelCls = "block text-sm font-medium mb-1.5"

  return (
    <div className="space-y-6 animate-fadeIn">
      {msg && (
        <div className={`p-4 rounded-xl text-sm font-medium ${msg.includes('Gagal') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 dark:border-slate-700 px-6 overflow-x-auto">
          {visibleTabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${
                activeTab === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'sekolah' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className={labelCls}>Nama Sekolah</label><input value={form.namaSekolah} onChange={(e) => setForm({ ...form, namaSekolah: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>NPSN</label><input value={form.npsn} onChange={(e) => setForm({ ...form, npsn: e.target.value })} className={inputCls} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Alamat</label><textarea rows={2} value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} className={inputCls + ' resize-none'} /></div>
              <div><label className={labelCls}>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Website</label><input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Telepon</label><input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Kepala Sekolah</label><input value={form.kepalaSekolah} onChange={(e) => setForm({ ...form, kepalaSekolah: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>NIP Kepala Sekolah</label><input value={form.nipKepalaSekolah} onChange={(e) => setForm({ ...form, nipKepalaSekolah: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Moto</label><input value={form.moto} onChange={(e) => setForm({ ...form, moto: e.target.value })} className={inputCls} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Visi</label><textarea rows={2} value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })} className={inputCls + ' resize-none'} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Misi</label><textarea rows={3} value={form.misi} onChange={(e) => setForm({ ...form, misi: e.target.value })} className={inputCls + ' resize-none'} /></div>
            </div>
          )}

          {activeTab === 'akademik' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Tahun Ajaran Aktif</label>
                <select value={form.tahunAjaranAktif} onChange={(e) => setForm({ ...form, tahunAjaranAktif: e.target.value })} className={inputCls}>
                  {tahunAjaranList.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Semester Aktif</label>
                <select value={form.semesterAktif} onChange={(e) => setForm({ ...form, semesterAktif: e.target.value })} className={inputCls}>
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'guru-profiles' && isAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Kelola profil akun guru. Ubah nama, username, email, dan password guru.</p>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Cari guru..." value={searchGuru} onChange={(e) => setSearchGuru(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-xl border border-gray-100 dark:border-slate-700">
                <table className="siadak-table">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuru.map((g, i) => (
                      <tr key={g.id}>
                        <td className="text-center">{i + 1}</td>
                        <td className="font-medium">{g.nama}</td>
                        <td><code className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">{g.username}</code></td>
                        <td className="capitalize">{g.role}</td>
                        <td>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${g.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {g.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setEditGuru({ ...g, _newPassword: '' })}
                              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors" title="Edit Profil">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleResetGuruPassword(g)}
                              className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-600 transition-colors" title="Reset Password">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredGuru.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Tidak ada data guru</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Edit Guru Modal */}
              {editGuru && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setEditGuru(null)}>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold" style={{ color: '#0a2540' }}>Edit Profil - {editGuru.nama}</h3>
                      <button onClick={() => setEditGuru(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                      <div><label className={labelCls}>Nama</label><input value={editGuru.nama} onChange={(e) => setEditGuru({ ...editGuru, nama: e.target.value })} className={inputCls} /></div>
                      <div><label className={labelCls}>Username</label><input value={editGuru.username} onChange={(e) => setEditGuru({ ...editGuru, username: e.target.value })} className={inputCls} /></div>
                      <div><label className={labelCls}>Email</label><input type="email" value={editGuru.email || ''} onChange={(e) => setEditGuru({ ...editGuru, email: e.target.value })} className={inputCls} /></div>
                      <div><label className={labelCls}>No. HP</label><input value={editGuru.noHP || ''} onChange={(e) => setEditGuru({ ...editGuru, noHP: e.target.value })} className={inputCls} /></div>
                      <div><label className={labelCls}>Password Baru</label>
                        <div className="relative">
                          <input type={showPassword ? 'text' : 'password'} value={editGuru._newPassword || ''} onChange={(e) => setEditGuru({ ...editGuru, _newPassword: e.target.value })} className={inputCls + ' pr-10'} placeholder="Kosongkan jika tidak diubah" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Status</label>
                        <select value={editGuru.status} onChange={(e) => setEditGuru({ ...editGuru, status: e.target.value })} className={inputCls}>
                          <option value="aktif">Aktif</option>
                          <option value="nonaktif">Nonaktif</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setEditGuru(null)} className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Batal</button>
                      <button onClick={handleSaveGuruProfile} disabled={savingGuru} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>
                        {savingGuru ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tampilan' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Pengaturan tampilan aplikasi. Dark mode dapat diaktifkan melalui toggle di sidebar.</p>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600">
                <p className="text-sm font-medium" style={{ color: '#0a2540' }}>Tema Saat Ini</p>
                <p className="text-xs text-muted-foreground mt-1">Gunakan toggle Dark Mode di sidebar untuk mengubah tema.</p>
              </div>
            </div>
          )}

          {isAdmin && activeTab !== 'guru-profiles' && (
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>
                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          )}

          {!isAdmin && <p className="text-sm text-yellow-600 mt-4">Hanya administrator yang dapat mengubah pengaturan sekolah.</p>}
        </div>
      </div>
    </div>
  )
}