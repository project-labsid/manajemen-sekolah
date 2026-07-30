'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { User, Mail, Phone, Camera, KeyRound, Save, AtSign } from 'lucide-react'

export default function Profil() {
  const { user, setUser } = useAppStore()
  const [form, setForm] = useState({ nama: '', username: '', email: '', noHP: '' })
  const [pwForm, setPwForm] = useState({ passwordOld: '', passwordNew: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (user) setForm({ nama: user.nama || '', username: user.username || '', email: user.email || '', noHP: user.noHP || '' })
  }, [user])

  const handleSave = async () => {
    setSaving(true); setMsg('')
    try {
      const res = await api.put<{ data: any }>('/profil', form)
      if (res.data) {
        const updatedUser = { ...user!, ...res.data, username: form.username || user!.username }
        setUser(updatedUser)
      }
      setMsg('Profil berhasil diperbarui!')
      setTimeout(() => setMsg(''), 3000)
    } catch (e: any) { setMsg('Gagal: ' + e.message) }
    finally { setSaving(false) }
  }

  const handleChangePw = async () => {
    if (!pwForm.passwordOld || !pwForm.passwordNew) { setMsg('Isi password lama dan baru'); return }
    if (pwForm.passwordNew.length < 6) { setMsg('Password baru minimal 6 karakter'); return }
    setSaving(true); setMsg('')
    try {
      await api.put('/profil', { ...form, passwordOld: pwForm.passwordOld, passwordNew: pwForm.passwordNew })
      setPwForm({ passwordOld: '', passwordNew: '' })
      setMsg('Password berhasil diubah!')
      setTimeout(() => setMsg(''), 3000)
    } catch (e: any) { setMsg('Gagal: ' + e.message) }
    finally { setSaving(false) }
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  const labelCls = "block text-sm font-medium mb-1.5"

  return (
    <div className="space-y-6 animate-fadeIn">
      {msg && (
        <div className={`p-4 rounded-xl text-sm font-medium ${msg.includes('Gagal') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden">
        <div className="h-32" style={{ background: 'linear-gradient(135deg, #0a2540 0%, #1e3a8a 100%)' }} />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center border-4 border-white dark:border-slate-800">
              <span className="text-3xl font-bold" style={{ color: '#2563eb' }}>{user?.nama?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold" style={{ color: '#0a2540' }}>{user?.nama}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role === 'admin' ? 'Administrator' : 'Guru'}</p>
              <p className="text-xs text-muted-foreground mt-1">Terakhir login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('id-ID') : '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Profile */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h3 className="text-base font-semibold mb-5 flex items-center gap-2" style={{ color: '#0a2540' }}><User className="w-5 h-5" /> Informasi Profil</h3>
          <div className="space-y-4">
            <div><label className={labelCls}>Nama Lengkap</label><input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputCls} /></div>
            <div>
              <label className={labelCls}>Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className={inputCls + ' pl-10'} placeholder="Username untuk login" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Username digunakan untuk login. Ubah dengan hati-hati.</p>
            </div>
            <div><label className={labelCls}>Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls + ' pl-10'} /></div></div>
            <div><label className={labelCls}>No. HP</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={form.noHP} onChange={(e) => setForm({ ...form, noHP: e.target.value })} className={inputCls + ' pl-10'} /></div></div>
            <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50" style={{ background: '#2563eb' }}><Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h3 className="text-base font-semibold mb-5 flex items-center gap-2" style={{ color: '#0a2540' }}><KeyRound className="w-5 h-5" /> Ubah Password</h3>
          <div className="space-y-4">
            <div><label className={labelCls}>Password Lama</label><input type="password" value={pwForm.passwordOld} onChange={(e) => setPwForm({ ...pwForm, passwordOld: e.target.value })} className={inputCls} placeholder="Masukkan password lama" /></div>
            <div><label className={labelCls}>Password Baru</label><input type="password" value={pwForm.passwordNew} onChange={(e) => setPwForm({ ...pwForm, passwordNew: e.target.value })} className={inputCls} placeholder="Minimal 6 karakter" /></div>
            <button onClick={handleChangePw} disabled={saving} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50" style={{ background: '#f59e0b' }}><KeyRound className="w-4 h-4" /> {saving ? 'Mengubah...' : 'Ubah Password'}</button>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
            <p className="text-xs font-medium" style={{ color: '#0a2540' }}>Informasi Akun</p>
            <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <p>Username: <span className="font-medium text-foreground">{user?.username}</span></p>
              <p>Role: <span className="font-medium capitalize">{user?.role === 'admin' ? 'Administrator' : 'Guru'}</span></p>
              <p>Status: <span className="font-medium text-green-600">{user?.status}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}