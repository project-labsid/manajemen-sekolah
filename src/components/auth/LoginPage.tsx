'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import Image from 'next/image'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setToken = useAppStore((s) => s.setToken)
  const setUser = useAppStore((s) => s.setUser)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post<{ token: string; user: any }>('/auth/login', { username, password })
      setToken(res.token)
      setUser(res.user)
    } catch (err: any) {
      setError(err.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a2540 0%, #1e3a8a 50%, #0d47a1 100%)' }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white text-center">
          <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border-2 border-white/20 overflow-hidden">
            <Image src="/logo-tuweri.png" alt="TUWERI Logo" width={96} height={96} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold mb-3">TUWERI</h1>
          <p className="text-lg font-medium opacity-90 mb-2">Sistem Informasi Akademik Sekolah</p>
          <div className="w-16 h-1 bg-blue-400 rounded-full my-4" />
          <p className="text-sm opacity-70 max-w-sm leading-relaxed">
            Membangun Pendidikan Lebih Baik untuk Masa Depan
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12" style={{ background: '#f8fafc' }}>
        <div className="w-full max-w-md animate-fadeIn">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 overflow-hidden" style={{ background: '#0a2540' }}>
              <Image src="/logo-tuweri.png" alt="TUWERI Logo" width={64} height={64} className="object-contain" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: '#0a2540' }}>TUWERI</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#0a2540' }}>Selamat Datang</h2>
            <p className="text-sm mb-8" style={{ color: '#64748b' }}>Silakan login untuk melanjutkan</p>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#334155' }}>Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:border-blue-500 transition-all"
                    style={{ borderColor: '#e2e8f0' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#334155' }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:border-blue-500 transition-all"
                    style={{ borderColor: '#e2e8f0' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#2563eb' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </span>
                ) : 'Login'}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-xs" style={{ color: '#94a3b8' }}>
            &copy; {currentYear} TUWERI SIAKAD v2.0.0
          </p>
        </div>
      </div>
    </div>
  )
}