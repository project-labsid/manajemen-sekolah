'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Download,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Guru {
  id: number
  nip: string
  nama: string
  gelar: string
  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string
  alamat: string
  email: string
  noHp: string
  mapel: string
  status: string
}

interface GuruResponse {
  data: Guru[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface GuruForm {
  nip: string
  nama: string
  gelar: string
  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string
  alamat: string
  email: string
  noHp: string
  mapel: string
  status: string
}

const EMPTY_FORM: GuruForm = {
  nip: '',
  nama: '',
  gelar: '',
  jenisKelamin: 'L',
  tempatLahir: '',
  tanggalLahir: '',
  alamat: '',
  email: '',
  noHp: '',
  mapel: '',
  status: 'Aktif',
}

const LIMIT = 10

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DataGuru() {
  /* ---- state ---- */
  const [data, setData] = useState<Guru[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // modal
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<GuruForm>({ ...EMPTY_FORM })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof GuruForm, string>>>({})

  // delete
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteName, setDeleteName] = useState('')
  const [deleting, setDeleting] = useState(false)

  // ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---- debounce ---- */
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 400)
  }, [])

  /* ---- fetch ---- */
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<GuruResponse>(
        `/guru?page=${page}&limit=${LIMIT}&search=${encodeURIComponent(debouncedSearch)}`
      )
      setData(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat data guru'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  /* ---- pagination helpers ---- */
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('...')
      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (page < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  /* ---- CRUD ---- */
  const openAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setFormErrors({})
    setFormOpen(true)
  }

  const openEdit = (g: Guru) => {
    setEditingId(g.id)
    setForm({
      nip: g.nip,
      nama: g.nama,
      gelar: g.gelar,
      jenisKelamin: g.jenisKelamin,
      tempatLahir: g.tempatLahir,
      tanggalLahir: g.tanggalLahir,
      alamat: g.alamat,
      email: g.email,
      noHp: g.noHp,
      mapel: g.mapel,
      status: g.status,
    })
    setFormErrors({})
    setFormOpen(true)
  }

  const validate = (): boolean => {
    const errors: Partial<Record<keyof GuruForm, string>> = {}
    if (!form.nip.trim()) errors.nip = 'NIP wajib diisi'
    if (!form.nama.trim()) errors.nama = 'Nama wajib diisi'
    if (!form.email.trim()) {
      errors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Format email tidak valid'
    }
    if (!(form.noHp || '').trim()) errors.noHp = 'No HP wajib diisi'
    if (!(form.mapel || '').trim()) errors.mapel = 'Mapel wajib diisi'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      if (editingId) {
        await api.put('/guru', { id: editingId, ...form })
        toast.success('Data guru berhasil diperbarui')
      } else {
        await api.post('/guru', form)
        toast.success('Data guru berhasil ditambahkan')
      }
      setFormOpen(false)
      fetchData()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan data guru'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const openDelete = (g: Guru) => {
    setDeleteId(g.id)
    setDeleteName(g.nama)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.del(`/guru?id=${deleteId}`)
      toast.success('Data guru berhasil dihapus')
      setDeleteOpen(false)
      fetchData()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus data guru'
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  /* ---- export / import ---- */
  const handleExport = async () => {
    try {
      const res = await fetch('/api/guru/export', {
        headers: {
          Authorization: `Bearer ${(await import('@/lib/store')).useAppStore.getState().token}`,
        },
      })
      if (!res.ok) throw new Error('Gagal mengekspor data')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'data-guru.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Data berhasil diekspor')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengekspor data'
      toast.error(message)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/guru/import', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${(await import('@/lib/store')).useAppStore.getState().token}`,
        },
        body: formData,
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Gagal mengimpor data')
      }
      toast.success('Data berhasil diimpor')
      fetchData()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengimpor data'
      toast.error(message)
    } finally {
      // reset file input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /* ---- update form field ---- */
  const setField = <K extends keyof GuruForm>(key: K, value: GuruForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  /* ---- render ---- */
  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: '#f4f6f9' }}
    >
      {/* ---------- Action Bar ---------- */}
      <div
        className="rounded-2xl bg-white p-4 shadow-sm md:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* left: title + buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h1 className="text-xl font-bold" style={{ color: '#0a2540' }}>
              Data Guru
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={openAdd}
                className="gap-2 text-white"
                style={{ backgroundColor: '#10b981' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
              >
                <Plus className="size-4" />
                Tambah
              </Button>

              <Button
                variant="outline"
                className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />
                Import Excel
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImport}
              />

              <Button
                variant="outline"
                className="gap-2 border-sky-300 text-sky-700 hover:bg-sky-50"
                onClick={handleExport}
              >
                <Download className="size-4" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* right: search */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari guru..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9"
            />
            {search && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSearch('')
                  setDebouncedSearch('')
                  setPage(1)
                }}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm md:p-6">
        <div className="overflow-x-auto">
          <table className="siadak-table w-full text-sm">
            <thead>
              <tr
                className="border-b text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#0a2540', borderBottomColor: '#e2e8f0' }}
              >
                <th className="whitespace-nowrap px-4 py-3">No</th>
                <th className="whitespace-nowrap px-4 py-3">NIP</th>
                <th className="whitespace-nowrap px-4 py-3">Nama</th>
                <th className="whitespace-nowrap px-4 py-3">Mapel</th>
                <th className="whitespace-nowrap px-4 py-3">Email</th>
                <th className="whitespace-nowrap px-4 py-3">No HP</th>
                <th className="whitespace-nowrap px-4 py-3">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-6" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-36" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Skeleton className="size-8 rounded-md" />
                        <Skeleton className="size-8 rounded-md" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    Tidak ada data guru ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((g, idx) => (
                  <tr
                    key={g.id}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-3 text-gray-500">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium" style={{ color: '#0a2540' }}>
                      {g.nip}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium" style={{ color: '#0a2540' }}>
                      {g.nama}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {g.mapel}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {g.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {g.noHp}
                    </td>
                    <td className="px-4 py-3">
                      {g.status === 'Aktif' ? (
                        <Badge
                          className="bg-emerald-100 text-emerald-700 border-emerald-200"
                        >
                          Aktif
                        </Badge>
                      ) : (
                        <Badge
                          className="bg-red-100 text-red-700 border-red-200"
                        >
                          Nonaktif
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title="Edit"
                          className="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-sky-50 hover:text-sky-600"
                          onClick={() => openEdit(g)}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Hapus"
                          className="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          onClick={() => openDelete(g)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ---------- Pagination ---------- */}
        {!loading && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-end gap-1">
            <button
              type="button"
              disabled={page <= 1}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </button>

            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex size-9 items-center justify-center text-gray-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={
                    p === page
                      ? 'inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-white'
                      : 'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100'
                  }
                  style={
                    p === page
                      ? { backgroundColor: '#0a2540' }
                      : undefined
                  }
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {/* info text */}
        {!loading && data.length > 0 && (
          <div className="mt-2 text-right text-xs text-gray-400">
            Menampilkan {(page - 1) * LIMIT + 1}–
            {Math.min(page * LIMIT, total)} dari {total} data
          </div>
        )}
      </div>

      {/* ==================== ADD / EDIT MODAL ==================== */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && setFormOpen(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: '#0a2540' }}>
              {editingId ? 'Edit Data Guru' : 'Tambah Data Guru'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Perbarui informasi data guru di bawah ini.'
                : 'Isi form di bawah ini untuk menambahkan guru baru.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 sm:grid-cols-2">
            {/* NIP */}
            <div className="space-y-1.5">
              <Label htmlFor="nip">
                NIP <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nip"
                placeholder="Masukkan NIP"
                value={form.nip}
                onChange={(e) => setField('nip', e.target.value)}
              />
              {formErrors.nip && (
                <p className="text-xs text-red-500">{formErrors.nip}</p>
              )}
            </div>

            {/* Nama */}
            <div className="space-y-1.5">
              <Label htmlFor="nama">
                Nama <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                value={form.nama}
                onChange={(e) => setField('nama', e.target.value)}
              />
              {formErrors.nama && (
                <p className="text-xs text-red-500">{formErrors.nama}</p>
              )}
            </div>

            {/* Gelar */}
            <div className="space-y-1.5">
              <Label htmlFor="gelar">Gelar</Label>
              <Input
                id="gelar"
                placeholder="Contoh: S.Pd, M.Pd"
                value={form.gelar}
                onChange={(e) => setField('gelar', e.target.value)}
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-1.5">
              <Label>Jenis Kelamin</Label>
              <Select
                value={form.jenisKelamin}
                onValueChange={(v) => setField('jenisKelamin', v)}
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

            {/* Tempat Lahir */}
            <div className="space-y-1.5">
              <Label htmlFor="tempatLahir">Tempat Lahir</Label>
              <Input
                id="tempatLahir"
                placeholder="Masukkan tempat lahir"
                value={form.tempatLahir}
                onChange={(e) => setField('tempatLahir', e.target.value)}
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-1.5">
              <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
              <Input
                id="tanggalLahir"
                type="date"
                value={form.tanggalLahir}
                onChange={(e) => setField('tanggalLahir', e.target.value)}
              />
            </div>

            {/* Alamat — full width */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                placeholder="Masukkan alamat lengkap"
                value={form.alamat}
                onChange={(e) => setField('alamat', e.target.value)}
                rows={2}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* No HP */}
            <div className="space-y-1.5">
              <Label htmlFor="noHp">
                No HP <span className="text-red-500">*</span>
              </Label>
              <Input
                id="noHp"
                placeholder="08xxxxxxxxxx"
                value={form.noHp}
                onChange={(e) => setField('noHp', e.target.value)}
              />
              {formErrors.noHp && (
                <p className="text-xs text-red-500">{formErrors.noHp}</p>
              )}
            </div>

            {/* Mapel */}
            <div className="space-y-1.5">
              <Label htmlFor="mapel">
                Mata Pelajaran <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mapel"
                placeholder="Masukkan mata pelajaran"
                value={form.mapel}
                onChange={(e) => setField('mapel', e.target.value)}
              />
              {formErrors.mapel && (
                <p className="text-xs text-red-500">{formErrors.mapel}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setField('status', v)}
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

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="text-white"
              style={{ backgroundColor: '#10b981' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
            >
              {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== DELETE CONFIRMATION ==================== */}
      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#0a2540' }}>
              Hapus Data Guru
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data guru{' '}
              <span className="font-semibold text-gray-900">{deleteName}</span>? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-300"
            >
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
