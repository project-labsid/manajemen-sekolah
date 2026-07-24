import { create } from 'zustand'

export type PageKey =
  | 'dashboard'
  | 'guru'
  | 'siswa'
  | 'kelas'
  | 'mapel'
  | 'nilai'
  | 'rekap-nilai'
  | 'absensi-guru'
  | 'absensi-siswa'
  | 'laporan'
  | 'pengumuman'
  | 'pengaturan'
  | 'audit-log'
  | 'profil'

export interface User {
  id: string
  nama: string
  username: string
  role: string
  email: string
  noHP: string
  foto: string
  status: string
  lastLogin: string | null
}

interface AppState {
  token: string | null
  user: User | null
  currentPage: PageKey
  sidebarOpen: boolean
  darkMode: boolean
  setToken: (t: string | null) => void
  setUser: (u: User | null) => void
  setPage: (p: PageKey) => void
  toggleSidebar: () => void
  setSidebarOpen: (o: boolean) => void
  setDarkMode: (d: boolean) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('siakad_token') : null,
  user: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('siakad_user') || 'null')
    : null,
  currentPage: 'dashboard',
  sidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 1024 : true,
  darkMode: typeof window !== 'undefined'
    ? localStorage.getItem('siakad_dark') === 'true'
    : false,
  setToken: (t) => {
    if (t) localStorage.setItem('siakad_token', t)
    else localStorage.removeItem('siakad_token')
    set({ token: t })
  },
  setUser: (u) => {
    if (u) localStorage.setItem('siakad_user', JSON.stringify(u))
    else localStorage.removeItem('siakad_user')
    set({ user: u })
  },
  setPage: (p) => set({ currentPage: p }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (o) => set({ sidebarOpen: o }),
  setDarkMode: (d) => {
    localStorage.setItem('siakad_dark', String(d))
    if (d) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    set({ darkMode: d })
  },
  logout: () => {
    localStorage.removeItem('siakad_token')
    localStorage.removeItem('siakad_user')
    set({ token: null, user: null, currentPage: 'dashboard' })
  },
}))
