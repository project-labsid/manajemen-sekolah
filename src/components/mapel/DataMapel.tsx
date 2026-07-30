'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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

interface Mapel {
  id: string
  kodeMapel: string
  namaMapel: string
  kkm: number
  guru: string
  status: string
}

interface MapelResponse {
  data: Mapel[]
}

interface MapelForm {
  kodeMapel: string
  namaMapel: string
  kkm: string
  guru: string
  status: string
}

const EMPTY_FORM: MapelForm = {
  kodeMapel: '',
  namaMapel: '',
  kkm: '75',
  guru: '',
  status: 'aktif',
}

const PAGE_SIZE = 10

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DataMapel() {
  // ── Table state ──
  const [allMapel, setAllMapel] = useState<Mapel[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // ── Modal state ──
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<MapelForm>(EMPTY_FORM)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // ── Delete confirmation state ──
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<Mapel | null>(null)
  const [deleting, setDeleting] = useState(false)

  // ── Refs ──
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>()

  // ── Fetch data ──
  const fetchMapel = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<MapelResponse>('/mapel')
      const data = (res as MapelResponse).data
      setAllMapel(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Gagal memuat data mata pelajaran')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMapel()
  }, [fetchMapel])

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

  // ── Filtered & paginated data ──
  const filtered = allMapel.filter(
    (m) =>
      m.kodeMapel.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.namaMapel.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.guru.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  // ── Handlers ──
  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (item: Mapel) => {
    setEditingId(item.id)
    setForm({
      kodeMapel: item.kodeMapel,
      namaMapel: item.namaMapel,
      kkm: String(item.kkm),
      guru: item.guru,
      status: item.status,
    })
    setModalOpen(true)
  }

  const openDelete = (item: Mapel) => {
    setDeletingItem(item)
    setDeleteOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.kodeMapel.trim() || !form.namaMapel.trim()) {
      toast.error('Kode Mapel dan Nama Mapel wajib diisi')
      return
    }
    const kkm = parseInt(form.kkm, 10)
    if (isNaN(kkm) || kkm < 0 || kkm > 100) {
      toast.error('KKM harus berupa angka antara 0–100')
      return
    }

    setFormSubmitting(true)
    try {
      const payload = {
        kodeMapel: form.kodeMapel,
        namaMapel: form.namaMapel,
        kkm,
        guru: form.guru,
        status: form.status,
      }
      if (editingId) {
        await api.put('/mapel', { id: editingId, ...payload })
        toast.success('Mata Pelajaran berhasil diperbarui')
      } else {
        await api.post('/mapel', payload)
        toast.success('Mata Pelajaran berhasil ditambahkan')
      }
      setModalOpen(false)
      fetchMapel()
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Gagal menyimpan data'
      toast.error(message)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setDeleting(true)
    try {
      await api.del(`/mapel?id=${deletingItem.id}`)
      toast.success('Mata Pelajaran berhasil dihapus')
      setDeleteOpen(false)
      setDeletingItem(null)
      fetchMapel()
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Gagal menghapus data'
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  const updateField = (field: keyof MapelForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // ── Status badge helper ──
  const statusBadge = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'aktif')
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
          Aktif
        </Badge>
      )
    return (
      <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0">
        {status || 'Nonaktif'}
      </Badge>
    )
  }

  // ── Render ──
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Data Mata Pelajaran
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola data mata pelajaran sekolah
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari mata pelajaran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            <Button
              onClick={openAdd}
              className="bg-[#10b981] hover:bg-[#059669] text-white whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="overflow-x-auto">
          {loading ? (
            /* ── Skeleton ── */
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Inbox className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">Data tidak ditemukan</p>
              <p className="text-sm mt-1">
                {debouncedSearch
                  ? 'Coba ubah kata kunci pencarian'
                  : 'Belum ada data mata pelajaran'}
              </p>
            </div>
          ) : (
            <table className="siadak-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Mapel</th>
                  <th>Nama Mapel</th>
                  <th>KKM</th>
                  <th>Guru</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{(safePage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="font-medium">{item.kodeMapel}</td>
                    <td>{item.namaMapel}</td>
                    <td>{item.kkm}</td>
                    <td>{item.guru || '-'}</td>
                    <td>{statusBadge(item.status)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-blue-50 text-[#2563eb] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDelete(item)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-red-50 text-[#ef4444] transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-end mt-4 gap-2">
            <span className="text-sm text-muted-foreground">
              {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} dari{' '}
              {filtered.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[2rem] text-center">
              {safePage}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Perbarui informasi mata pelajaran di bawah ini.'
                : 'Isi form berikut untuk menambahkan mata pelajaran baru.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="kodeMapel">Kode Mapel</Label>
              <Input
                id="kodeMapel"
                placeholder="Contoh: MTK"
                value={form.kodeMapel}
                onChange={(e) => updateField('kodeMapel', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="namaMapel">Nama Mapel</Label>
              <Input
                id="namaMapel"
                placeholder="Contoh: Matematika"
                value={form.namaMapel}
                onChange={(e) => updateField('namaMapel', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kkm">KKM</Label>
              <Input
                id="kkm"
                type="number"
                min={0}
                max={100}
                placeholder="0 – 100"
                value={form.kkm}
                onChange={(e) => updateField('kkm', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guru">Guru</Label>
              <Input
                id="guru"
                placeholder="Nama guru pengampu"
                value={form.guru}
                onChange={(e) => updateField('guru', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusMapel">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => updateField('status', v)}
              >
                <SelectTrigger id="statusMapel">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
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
              className="bg-[#10b981] hover:bg-[#059669] text-white"
            >
              {formSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingId ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mata Pelajaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus mata pelajaran{' '}
              <span className="font-semibold text-foreground">
                {deletingItem?.namaMapel}
              </span>{' '}
              ({deletingItem?.kodeMapel})? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-[#ef4444] hover:bg-[#dc2626] text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
