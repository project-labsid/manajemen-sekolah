'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useAppStore, type PageKey } from '@/lib/store'
import { api } from '@/lib/api'
import LoginPage from '@/components/auth/LoginPage'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import AppFooter from '@/components/layout/Footer'

const AdminDashboard = dynamic(() => import('@/components/dashboard/AdminDashboard'), { ssr: false, loading: () => <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" /></div> })
const GuruDashboard = dynamic(() => import('@/components/dashboard/GuruDashboard'), { ssr: false, loading: () => <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" /></div> })
const DataGuru = dynamic(() => import('@/components/guru/DataGuru'), { ssr: false })
const DataSiswa = dynamic(() => import('@/components/siswa/DataSiswa'), { ssr: false })
const DataKelas = dynamic(() => import('@/components/kelas/DataKelas'), { ssr: false })
const DataMapel = dynamic(() => import('@/components/mapel/DataMapel'), { ssr: false })
const InputNilai = dynamic(() => import('@/components/nilai/InputNilai'), { ssr: false })
const RekapNilai = dynamic(() => import('@/components/nilai/RekapNilai'), { ssr: false })
const AbsensiGuru = dynamic(() => import('@/components/absensi/AbsensiGuru'), { ssr: false })
const AbsensiSiswa = dynamic(() => import('@/components/absensi/AbsensiSiswa'), { ssr: false })
const Laporan = dynamic(() => import('@/components/laporan/Laporan'), { ssr: false })
const Pengumuman = dynamic(() => import('@/components/pengumuman/Pengumuman'), { ssr: false })
const Pengaturan = dynamic(() => import('@/components/pengaturan/Pengaturan'), { ssr: false })
const AuditLog = dynamic(() => import('@/components/audit/AuditLog'), { ssr: false })
const Profil = dynamic(() => import('@/components/profil/Profil'), { ssr: false })
const DataUser = dynamic(() => import('@/components/users/DataUser'), { ssr: false })
const RiwayatLogin = dynamic(() => import('@/components/riwayat-login/RiwayatLogin'), { ssr: false })

function PageContent({ page }: { page: PageKey }) {
  switch (page) {
    case 'guru': return <DataGuru />
    case 'siswa': return <DataSiswa />
    case 'kelas': return <DataKelas />
    case 'mapel': return <DataMapel />
    case 'users': return <DataUser />
    case 'nilai': return <InputNilai />
    case 'rekap-nilai': return <RekapNilai />
    case 'absensi-guru': return <AbsensiGuru />
    case 'absensi-siswa': return <AbsensiSiswa />
    case 'laporan': return <Laporan />
    case 'pengumuman': return <Pengumuman />
    case 'riwayat-login': return <RiwayatLogin />
    case 'pengaturan': return <Pengaturan />
    case 'audit-log': return <AuditLog />
    case 'profil': return <Profil />
    default: return null
  }
}

export default function Home() {
  const { token, user, currentPage, darkMode } = useAppStore()

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    if (!token) return
    api.get<{ user: any }>('/auth/me').then((res) => {
      useAppStore.getState().setUser(res.user)
    }).catch(() => {
      useAppStore.getState().logout()
    })
  }, [token])

  if (!token || !user) return <LoginPage />

  return (
    <div className="min-h-screen flex bg-[#f4f6f9] dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[270px]">
        <Navbar />
        <main className="flex-1 p-4 lg:p-6">
          {currentPage === 'dashboard' ? (
            user.role === 'admin' ? <AdminDashboard /> : <GuruDashboard />
          ) : (
            <PageContent page={currentPage} />
          )}
        </main>
        <AppFooter />
      </div>
    </div>
  )
}