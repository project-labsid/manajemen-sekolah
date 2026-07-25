import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIS AL ASY'ARIYAH - Sistem Informasi Akademik",
  description: "Sistem Informasi Akademik MIS AL ASY'ARIYAH. Kelola data guru, siswa, nilai, absensi, dan laporan sekolah.",
  keywords: ["SIADAK", "MIS AL ASY'ARIYAH", "Sistem Informasi Akademik", "Next.js", "TypeScript"],
  authors: [{ name: "MIS AL ASY'ARIYAH" }],
  icons: {
    icon: "/logo-no-bg.png",
  },
  openGraph: {
    title: "MIS AL ASY'ARIYAH - Sistem Informasi Akademik",
    description: "Sistem Informasi Akademik MIS AL ASY'ARIYAH",
    siteName: "MIS AL ASY'ARIYAH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIS AL ASY'ARIYAH - Sistem Informasi Akademik",
    description: "Sistem Informasi Akademik MIS AL ASY'ARIYAH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
