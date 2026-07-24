'use client'
import { useAppStore, type PageKey } from '@/lib/store'
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
  adminOnly?: boolean
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'guru', label: 'Data Guru', icon: <Users className="w-5 h-5" />, adminOnly: true },
  { key: 'siswa', label: 'Data Siswa', icon: <GraduationCap className="w-5 h-5" />, adminOnly: true },
  { key: 'kelas', label: 'Data Kelas', icon: <School className="w-5 h-5" />, adminOnly: true },
  { key: 'mapel', label: 'Mata Pelajaran', icon: <BookOpen className="w-5 h-5" />, adminOnly: true },
  { key: 'users', label: 'Data User', icon: <UserCog className="w-5 h-5" />, adminOnly: true },
  { key: 'nilai', label: 'Nilai', icon: <FileText className="w-5 h-5" /> },
  { key: 'rekap-nilai', label: 'Rekap Nilai', icon: <ClipboardList className="w-5 h-5" /> },
  { key: 'absensi-guru', label: 'Absensi Guru', icon: <UserCheck className="w-5 h-5" /> },
  { key: 'absensi-siswa', label: 'Absensi Siswa', icon: <UserX className="w-5 h-5" /> },
  { key: 'laporan', label: 'Laporan', icon: <BarChart3 className="w-5 h-5" /> },
  { key: 'pengumuman', label: 'Pengumuman', icon: <Megaphone className="w-5 h-5" />, adminOnly: true },
  { key: 'riwayat-login', label: 'Riwayat Login', icon: <History className="w-5 h-5" />, adminOnly: true },
  { key: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-5 h-5" />, adminOnly: true },
  { key: 'audit-log', label: 'Audit Log', icon: <Shield className="w-5 h-5" />, adminOnly: true },
  { key: 'profil', label: 'Profil', icon: <UserCircle className="w-5 h-5" /> },
]

export default function Sidebar() {
  const { currentPage, setPage, sidebarOpen, setSidebarOpen, user, darkMode, setDarkMode, logout } = useAppStore()
  const role = user?.role || 'guru'
  const filteredMenu = menuItems.filter((m) => !m.adminOnly || role === 'admin')

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
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">SIAKAD</h1>
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