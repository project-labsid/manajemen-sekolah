'use client'
import { useAppStore } from '@/lib/store'
import {
  Users, ClipboardList, FileText, BarChart3, Download,
  Database, LayoutDashboard, Moon, Smartphone, Shield
} from 'lucide-react'

const features = [
  { icon: <Users className="w-6 h-6" />, label: 'Manajemen Data', desc: 'Guru, Siswa, Kelas' },
  { icon: <FileText className="w-6 h-6" />, label: 'Nilai & Rekap', desc: 'Input & Analisis' },
  { icon: <ClipboardList className="w-6 h-6" />, label: 'Absensi', desc: 'Guru & Siswa' },
  { icon: <BarChart3 className="w-6 h-6" />, label: 'Laporan', desc: 'Export PDF & Excel' },
  { icon: <Download className="w-6 h-6" />, label: 'Import & Export', desc: 'Data Massal' },
  { icon: <Database className="w-6 h-6" />, label: 'Backup & Restore', desc: 'Keamanan Data' },
  { icon: <LayoutDashboard className="w-6 h-6" />, label: 'Dashboard Realtime', desc: 'Statistik Live' },
  { icon: <Moon className="w-6 h-6" />, label: 'Dark Mode', desc: 'Tema Gelap' },
  { icon: <Smartphone className="w-6 h-6" />, label: 'PWA Ready', desc: 'Install App' },
  { icon: <Shield className="w-6 h-6" />, label: 'Keamanan Tinggi', desc: 'JWT & Audit' },
]

export default function AppFooter() {
  return (
    <footer className="mt-auto">
      {/* Feature Cards Grid */}
      <div className="px-4 lg:px-6 pb-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#0a2540' }}>Fitur Utama</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-default"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  {f.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#1a1a2e' }}>{f.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-4 lg:px-6 pb-4">
        <div className="rounded-xl py-3 px-5 text-center text-xs text-white/80" style={{ background: '#0a2540' }}>
          &copy; 2024 SIAKAD Sekolah. All rights reserved. | Dibangun untuk Pendidikan yang Lebih Baik | v1.0.0
        </div>
      </div>
    </footer>
  )
}
