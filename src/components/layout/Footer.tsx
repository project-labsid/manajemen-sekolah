'use client'

export default function AppFooter() {
  return (
    <footer className="mt-auto">
      <div className="px-4 lg:px-6 pb-4">
        <div className="rounded-xl py-3 px-5 text-center text-xs text-white/80" style={{ background: '#0a2540' }}>
          &copy; {new Date().getFullYear()} SIAKAD Sekolah. All rights reserved. | Dibangun untuk Pendidikan yang Lebih Baik | v2.0.0
        </div>
      </div>
    </footer>
  )
}
