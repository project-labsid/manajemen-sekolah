'use client'
import { useAppStore, type PageKey } from '@/lib/store'
import Image from 'next/image'
import {
  LayoutDashboard, Users, GraduationCap, School, BookOpen,
  FileText, ClipboardList, UserCheck, UserX, BarChart3,
  Megaphone, Settings, Shield, UserCircle, LogOut, X, Sun, Moon,
  UserCog, History
} from 'lucide-react'

interface MenuItem {
  key: PageKey
  label: string
  icon: React.ReactNode
  permission: string  // RBAC permission slug
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, permission: 'dashboard' },
  { key: 'users', label: 'Data User', icon: <UserCog className="w-5 h-5" />, permission: 'users' },
  { key: 'guru', label: 'Data Guru', icon: <Users className="w-5 h-5" />, permission: 'guru' },
  { key: 'siswa', label: 'Data Siswa', icon: <GraduationCap className="w-5 h-5" />, permission: 'siswa' },
  { key: 'kelas', label: 'Data Kelas', icon: <School className="w-5 h-5" />, permission: 'kelas' },
  { key: 'mapel', label: 'Mata Pelajaran', icon: <BookOpen className="w-5 h-5" />, permission: 'mapel' },
  { key: 'nilai', label: 'Nilai', icon: <FileText className="w-5 h-5" />, permission: 'nilai' },
  { key: 'rekap-nilai', label: 'Rekap Nilai', icon: <ClipboardList className="w-5 h-5" />, permission: 'rekap-nilai' },
  { key: 'absensi-guru', label: 'Absensi Guru', icon: <UserCheck className="w-5 h-5" />, permission: 'absensi-guru' },
  { key: 'absensi-siswa', label: 'Absensi Siswa', icon: <UserX className="w-5 h-5" />, permission: 'absensi-siswa' },
  { key: 'laporan', label: 'Laporan', icon: <BarChart3 className="w-5 h-5" />, permission: 'laporan' },
  { key: 'pengumuman', label: 'Pengumuman', icon: <Megaphone className="w-5 h-5" />, permission: 'pengumuman' },
  { key: 'riwayat-login', label: 'Riwayat Login', icon: <History className="w-5 h-5" />, permission: 'riwayat-login' },
  { key: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-5 h-5" />, permission: 'pengaturan' },
  { key: 'audit-log', label: 'Audit Log', icon: <Shield className="w-5 h-5" />, permission: 'audit-log' },
  { key: 'profil', label: 'Profil', icon: <UserCircle className="w-5 h-5" />, permission: 'profil' },
]

export default function Sidebar() {
  const { currentPage, setPage, sidebarOpen, setSidebarOpen, user, darkMode, setDarkMode, logout, hasPermission } = useAppStore()

  const filteredMenu = menuItems.filter((m) => hasPermission(m.permission))

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-[270px]`}
        style={{ background: 'linear-gradient(180deg, #0a2540 0%, #0d1b2a 100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
              <Image src="/logo-tuweri.png" alt="TUWERI" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">TUWERI</h1>
              <p className="text-blue-300 text-[10px] opacity-70">Sistem Informasi Akademik</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Badge */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.nama?.charAt(0) || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.nama || 'User'}</p>
              <p className="text-blue-300/60 text-[10px] truncate">{user?.roleName || user?.role || ''}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredMenu.map((item) => {
            const active = currentPage === item.key
            return (
              <button
                key={item.key}
                onClick={() => {
                  setPage(item.key)
                  if (window.innerWidth < 1024) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-100/70 hover:bg-white/10 hover:text-white transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => { logout() }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300/80 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}