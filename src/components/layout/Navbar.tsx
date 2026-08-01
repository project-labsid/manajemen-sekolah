'use client'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Menu, Bell, ChevronDown } from 'lucide-react'

const TZ = 'Asia/Jakarta' as const

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  guru: 'Data Guru',
  siswa: 'Data Siswa',
  kelas: 'Data Kelas',
  mapel: 'Mata Pelajaran',
  nilai: 'Input Nilai',
  'rekap-nilai': 'Rekap Nilai',
  'absensi-guru': 'Absensi',
  'absensi-siswa': 'Absensi Siswa',
  laporan: 'Laporan',
  pengumuman: 'Pengumuman',
  pengaturan: 'Pengaturan Sekolah',
  'audit-log': 'Audit Log',
  profil: 'Profil',
  users: 'Data User',
  'riwayat-login': 'Riwayat Login',
}

export default function Navbar() {
  const { user, currentPage, toggleSidebar, setPage } = useAppStore()
  const [time, setTime] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('id-ID', { timeZone: TZ }))
      const dayName = now.toLocaleDateString('id-ID', { timeZone: TZ, weekday: 'long' })
      const day = now.toLocaleDateString('id-ID', { timeZone: TZ, day: 'numeric' })
      const month = now.toLocaleDateString('id-ID', { timeZone: TZ, month: 'long' })
      const year = now.toLocaleDateString('id-ID', { timeZone: TZ, year: 'numeric' })
      setDateStr(`${dayName}, ${day} ${month} ${year} - ${now.toLocaleTimeString('id-ID', { timeZone: TZ })}`)
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#0a2540' }}>
              {PAGE_TITLES[currentPage] || 'Dashboard'}
            </h2>
            <p className="text-[11px] text-muted-foreground hidden sm:block">{dateStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => setPage('pengumuman')}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Pengumuman"
          >
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: '#2563eb' }}>
                {user?.nama?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-tight" style={{ color: '#1a1a2e' }}>{user?.nama || 'User'}</p>
                <p className="text-[10px]" style={{ color: '#64748b' }}>{user?.roleName || user?.role || 'User'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-50 py-1 animate-fadeIn">
                  <button
                    onClick={() => { setPage('profil'); setShowUserMenu(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Profil Saya
                  </button>
                  <button
                    onClick={() => { useAppStore.getState().logout(); setShowUserMenu(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
