'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Plus,
  Search,
  FileSpreadsheet,
  Download,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Inbox,
  Loader2,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

// ── Types ────────────────────────────────────────────────────────────────────

interface Siswa {
  id: number
  nis: string
  nisn: string
  nama: string
  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string
  agama: string
  alamat: string
  namaAyah: string
  namaIbu: string
  noHp: string
  kelasId: number
  kelas?: string
  status: string
}

interface Kelas {
  id: number
  nama: string
}

interface SiswaResponse {
  data: Siswa[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface FormData {
  nis: string
  nisn: string
  nama: string
  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string
  agama: string
  alamat: string
  namaAyah: string
  namaIbu: string
  noHp: string
  kelasId: string
  status: string
}

const AGAMA_OPTIONS = [
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Budha',
  'Konghucu',
]

const EMPTY_FORM: FormData = {
  nis: '',
  nisn: '',
  nama: '',
  jenisKelamin: '',
  tempatLahir: '',
  tanggalLahir: '',
  agama: '',
  alamat: '',
  namaAyah: '',
  namaIbu: '',
  noHp: '',
  kelasId: '',
  status: 'Aktif',
}

const PAGE_LIMIT = 10

// ── Component ───────────────────────────────────────────────────────────────

export default function DataSiswa() {
  // ── Table state ──
  const [siswaList, setSiswaList] = useState<Siswa[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterKelas, setFilterKelas] = useState('')
  const [loading, setLoading] = useState(true)

  // ── Kelas dropdown data ──
  const [kelasList, setKelasList] = useState<Kelas[]>([])

  // ── Modal state ──
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // ── Delete confirmation state ──
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<Siswa | null>(null)
  const [deleting, setDeleting] = useState(false)

  // ── Refs ──
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>()

  // ── Fetch kelas list ──
  const fetchKelas = useCallback(async () => {
    try {
      const res = await api.get<Kelas[]>('/kelas')
      setKelasList(Array.isArray(res) ? res : (res as unknown as { data: Kelas[] }).data ?? [])
    } catch {
      // silently fail, dropdown will just be empty
    }
  }, [])

  // ── Fetch siswa list ──
  const fetchSiswa = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(PAGE_LIMIT))
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (filterKelas) params.set('kelas', filterKelas)

      const res = await api.get<SiswaResponse>(`/siswa?${params.toString()}`)
      const data = res as SiswaResponse
      setSiswaList(data.data ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch {
      toast.error('Gagal memuat data siswa')
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, filterKelas])

  // ── Debounced search ──
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [search])

  // ── Data fetching effects ──
  useEffect(() => {
    fetchKelas()
  }, [fetchKelas])

  useEffect(() => {
    fetchSiswa()
  }, [fetchSiswa])

  // ── Helpers ──
  const getKelasNama = (kelasId: number) => {
    const k = kelasList.find((k) => k.id === kelasId)
    return k?.nama ?? kelasId.toString()
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEditModal = (siswa: Siswa) => {
    setEditingId(siswa.id)
    setForm({
      nis: siswa.nis,
      nisn: siswa.nisn,
      nama: siswa.nama,
      jenisKelamin: siswa.jenisKelamin,
      tempatLahir: siswa.tempatLahir,
      tanggalLahir: siswa.tanggalLahir,
      agama: siswa.agama,
      alamat: siswa.alamat,
      namaAyah: siswa.namaAyah,
      namaIbu: siswa.namaIbu,
      noHp: siswa.noHp,
      kelasId: String(siswa.kelasId),
      status: siswa.status,
    })
    setModalOpen(true)
  }

  const handleFormChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.nis.trim() || !form.nisn.trim() || !form.nama.trim()) {
      toast.error('NIS, NISN, dan Nama wajib diisi')
      return
    }
    if (!form.kelasId) {
      toast.error('Kelas wajib dipilih')
      return
    }

    setFormSubmitting(true)
    try {
      const payload = {
        ...form,
        kelasId: Number(form.kelasId),
      }
      if (editingId) {
        await api.put('/siswa', { id: editingId, ...payload })
        toast.success('Data siswa berhasil diperbarui')
      } else {
        await api.post('/siswa', payload)
        toast.success('Data siswa berhasil ditambahkan')
      }
      setModalOpen(false)
      fetchSiswa()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan data')
    } finally {
      setFormSubmitting(false)
    }
  }

  const confirmDelete = (siswa: Siswa) => {
    setDeletingItem(siswa)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setDeleting(true)
    try {
      await api.del(`/siswa?id=${deletingItem.id}`)
      toast.success('Data siswa berhasil dihapus')
      setDeleteOpen(false)
      setDeletingItem(null)
      fetchSiswa()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus data')
    } finally {
      setDeleting(false)
    }
  }

  const handleImportExcel = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const token = (await import('@/lib/store')).useAppStore.getState().token
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch('/api/siswa/import', {
        method: 'POST',
        headers,
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Gagal import')
      toast.success('Data berhasil diimport')
      fetchSiswa()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengimport file')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleExportExcel = async () => {
    try {
      const token = (await import('@/lib/store')).useAppStore.getState().token
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      const params = new URLSearchParams()
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (filterKelas) params.set('kelas', filterKelas)
      const res = await fetch(`/api/siswa/export?${params.toString()}`, { headers })
      if (!res.ok) throw new Error('Gagal export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'data-siswa.xlsx'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data berhasil diexport')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengexport data')
    }
  }

  // ── Pagination range ──
  const startIdx = (page - 1) * PAGE_LIMIT
  const endIdx = Math.min(startIdx + PAGE_LIMIT, total)

  return (
    <section className="w-full" style={{ backgroundColor: '#f4f6f9' }}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: '#0a2540' }}
          >
            Data Siswa
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#0a2540' }}>
            Kelola data siswa sekolah dengan mudah
          </p>
        </div>

        {/* ── Card ── */}
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          {/* ── Action Bar ── */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={openAddModal}
                className="gap-1.5 text-white"
                style={{ backgroundColor: '#10b981' }}
              >
                <Plus className="size-4" />
                Tambah
              </Button>
              <Button
                variant="outline"
                onClick={handleImportExcel}
                className="gap-1.5"
                style={{ color: '#0a2540', borderColor: '#d1d5db' }}
              >
                <FileSpreadsheet className="size-4" />
                Import Excel
              </Button>
              <Button
                variant="outline"
                onClick={handleExportExcel}
                className="gap-1.5"
                style={{ color: '#0a2540', borderColor: '#d1d5db' }}
              >
                <Download className="size-4" />
                Export Excel
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Right: search + filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Cari siswa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-56 pl-9"
                />
              </div>
              <Select value={filterKelas} onValueChange={(v) => { setFilterKelas(v); setPage(1) }}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Semua Kelas</SelectItem>
                  {kelasList.map((k) => (
                    <SelectItem key={k.id} value={String(k.id)}>
                      {k.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            {loading ? (
              /* Skeleton */
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : siswaList.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="mb-4 flex size-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#f0fdf4' }}
                >
                  <Inbox className="size-8" style={{ color: '#10b981' }} />
                </div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: '#0a2540' }}
                >
                  Data Kosong
                </h3>
                <p className="mt-1 max-w-xs text-sm text-gray-500">
                  {debouncedSearch || filterKelas
                    ? 'Tidak ditemukan siswa yang sesuai dengan filter.'
                    : 'Belum ada data siswa. Klik tombol Tambah untuk menambahkan siswa baru.'}
                </p>
              </div>
            ) : (
              <table className="siadak-table w-full text-sm">
                <thead>
                  <tr
                    className="border-b text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: '#0a2540', backgroundColor: '#f9fafb' }}
                  >
                    <th className="px-3 py-3">No</th>
                    <th className="px-3 py-3">NIS</th>
                    <th className="px-3 py-3">NISN</th>
                    <th className="px-3 py-3">Nama</th>
                    <th className="px-3 py-3">JK</th>
                    <th className="px-3 py-3">Kelas</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {siswaList.map((siswa, idx) => (
                    <tr
                      key={siswa.id}
                      className="border-b transition-colors last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-3 py-3" style={{ color: '#0a2540' }}>
                        {startIdx + idx + 1}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#0a2540' }}>
                        {siswa.nis}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#0a2540' }}>
                        {siswa.nisn}
                      </td>
                      <td
                        className="px-3 py-3 font-medium"
                        style={{ color: '#0a2540' }}
                      >
                        {siswa.nama}
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          className={
                            siswa.jenisKelamin === 'L'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-pink-100 text-pink-700'
                          }
                        >
                          {siswa.jenisKelamin === 'L' ? 'L' : 'P'}
                        </Badge>
                      </td>
                      <td className="px-3 py-3" style={{ color: '#0a2540' }}>
                        {siswa.kelas ?? getKelasNama(siswa.kelasId)}
                      </td>
                      <td className="px-3 py-3">
                        {siswa.status === 'Aktif' ? (
                          <Badge className="bg-green-100 text-green-700">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            Nonaktif
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(siswa)}
                            className="rounded-lg p-1.5 transition-colors hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="size-4" style={{ color: '#2563eb' }} />
                          </button>
                          <button
                            onClick={() => confirmDelete(siswa)}
                            className="rounded-lg p-1.5 transition-colors hover:bg-red-50"
                            title="Hapus"
                          >
                            <Trash2 className="size-4" style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Pagination ── */}
          {!loading && siswaList.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Menampilkan {startIdx + 1}–{endIdx} dari {total} data
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true
                    if (p === 1 || p === totalPages) return true
                    return Math.abs(p - page) <= 1
                  })
                  .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                    if (i > 0) {
                      const prev = arr[i - 1]
                      if (p - prev > 1) acc.push('ellipsis')
                    }
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item, i) =>
                    item === 'ellipsis' ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="flex size-8 items-center justify-center text-sm text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={
                          'flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ' +
                          (page === item
                            ? ' text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-100')
                        }
                        style={
                          page === item
                            ? { backgroundColor: '#10b981' }
                            : undefined
                        }
                      >
                        {item}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: '#0a2540' }}>
              {editingId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Perbarui informasi siswa di bawah ini.'
                : 'Isi form berikut untuk menambahkan siswa baru.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* NIS */}
            <div className="space-y-1.5">
              <Label htmlFor="nis">
                NIS <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="nis"
                placeholder="Nomor Induk Siswa"
                value={form.nis}
                onChange={(e) => handleFormChange('nis', e.target.value)}
              />
            </div>

            {/* NISN */}
            <div className="space-y-1.5">
              <Label htmlFor="nisn">
                NISN <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="nisn"
                placeholder="NISN"
                value={form.nisn}
                onChange={(e) => handleFormChange('nisn', e.target.value)}
              />
            </div>

            {/* Nama */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="nama">
                Nama Lengkap <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="nama"
                placeholder="Nama lengkap siswa"
                value={form.nama}
                onChange={(e) => handleFormChange('nama', e.target.value)}
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-1.5">
              <Label>Jenis Kelamin</Label>
              <Select
                value={form.jenisKelamin}
                onValueChange={(v) => handleFormChange('jenisKelamin', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Agama */}
            <div className="space-y-1.5">
              <Label>Agama</Label>
              <Select
                value={form.agama}
                onValueChange={(v) => handleFormChange('agama', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih agama" />
                </SelectTrigger>
                <SelectContent>
                  {AGAMA_OPTIONS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tempat Lahir */}
            <div className="space-y-1.5">
              <Label htmlFor="tempatLahir">Tempat Lahir</Label>
              <Input
                id="tempatLahir"
                placeholder="Kota tempat lahir"
                value={form.tempatLahir}
                onChange={(e) => handleFormChange('tempatLahir', e.target.value)}
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-1.5">
              <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
              <Input
                id="tanggalLahir"
                type="date"
                value={form.tanggalLahir}
                onChange={(e) => handleFormChange('tanggalLahir', e.target.value)}
              />
            </div>

            {/* Alamat */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                placeholder="Alamat lengkap siswa"
                rows={3}
                value={form.alamat}
                onChange={(e) => handleFormChange('alamat', e.target.value)}
              />
            </div>

            {/* Nama Ayah */}
            <div className="space-y-1.5">
              <Label htmlFor="namaAyah">Nama Ayah</Label>
              <Input
                id="namaAyah"
                placeholder="Nama ayah"
                value={form.namaAyah}
                onChange={(e) => handleFormChange('namaAyah', e.target.value)}
              />
            </div>

            {/* Nama Ibu */}
            <div className="space-y-1.5">
              <Label htmlFor="namaIbu">Nama Ibu</Label>
              <Input
                id="namaIbu"
                placeholder="Nama ibu"
                value={form.namaIbu}
                onChange={(e) => handleFormChange('namaIbu', e.target.value)}
              />
            </div>

            {/* No HP */}
            <div className="space-y-1.5">
              <Label htmlFor="noHp">No. HP</Label>
              <Input
                id="noHp"
                placeholder="08xxxxxxxxxx"
                value={form.noHp}
                onChange={(e) => handleFormChange('noHp', e.target.value)}
              />
            </div>

            {/* Kelas */}
            <div className="space-y-1.5">
              <Label>Kelas <span style={{ color: '#ef4444' }}>*</span></Label>
              <Select
                value={form.kelasId}
                onValueChange={(v) => handleFormChange('kelasId', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {kelasList.map((k) => (
                    <SelectItem key={k.id} value={String(k.id)}>
                      {k.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => handleFormChange('status', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={formSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={formSubmitting}
              className="gap-1.5 text-white"
              style={{ backgroundColor: '#10b981' }}
            >
              {formSubmitting && <Loader2 className="size-4 animate-spin" />}
              {editingId ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#0a2540' }}>
              Hapus Data Siswa?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data siswa{' '}
              <span className="font-semibold" style={{ color: '#0a2540' }}>
                {deletingItem?.nama}
              </span>{' '}
              ? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="gap-1.5 bg-red-500 text-white hover:bg-red-600"
              style={{ backgroundColor: '#ef4444' }}
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
