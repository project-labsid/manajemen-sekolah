'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { Save, School, BookOpen, Palette, Shield, Database, Building } from 'lucide-react'

type TabKey = 'sekolah' | 'akademik' | 'tampilan'

export default function Pengaturan() {
  const { user } = useAppStore()
  const isAdmin = user?.role === 'admin'
  const [activeTab, setActiveTab] = useState<TabKey>('sekolah')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    namaSekolah: '', alamat: '', npsn: '', email: '', website: '', telepon: '',
    kepalaSekolah: '', nipKepalaSekolah: '', moto: '', visi: '', misi: '',
    semesterAktif: 'Genap', tahunAjaranAktif: '2023/2024',
  })

  useEffect(() => { loadSettings() }, [])

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

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'sekolah', label: 'Data Sekolah', icon: <Building className="w-4 h-4" /> },
    { key: 'akademik', label: 'Akademik', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'tampilan', label: 'Tampilan', icon: <Palette className="w-4 h-4" /> },
  ]

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
        <div className="flex border-b border-gray-100 dark:border-slate-700 px-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all -mb-px ${
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
                  {['2022/2023','2023/2024','2024/2025'].map((t) => <option key={t} value={t}>{t}</option>)}
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

          {activeTab === 'tampilan' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Pengaturan tampilan aplikasi. Dark mode dapat diaktifkan melalui toggle di sidebar.</p>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600">
                <p className="text-sm font-medium" style={{ color: '#0a2540' }}>Tema Saat Ini</p>
                <p className="text-xs text-muted-foreground mt-1">Gunakan toggle Dark Mode di sidebar untuk mengubah tema.</p>
              </div>
            </div>
          )}

          {isAdmin && (
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
