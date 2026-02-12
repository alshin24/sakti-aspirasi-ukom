"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Download, Loader2 } from "lucide-react"
import { getAspirasiForExport } from "@/lib/supabase/queries"
import { exportAspirasiToCSV, exportAspirasiToExcel } from "@/lib/export-utils"
import type { AspirasiCategory, AspirasiStatus } from "@/lib/supabase/queries"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [loading, setLoading] = useState(false)
  const [format, setFormat] = useState<"csv" | "excel">("csv")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [category, setCategory] = useState<AspirasiCategory | "all">("all")
  const [status, setStatus] = useState<AspirasiStatus | "all">("all")

  async function handleExport() {
    setLoading(true)
    try {
      const filters: any = {}
      if (startDate) filters.startDate = new Date(startDate).toISOString()
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filters.endDate = end.toISOString()
      }
      if (category !== "all") filters.category = category
      if (status !== "all") filters.status = status

      const data = await getAspirasiForExport(filters)

      if (format === "csv") {
        await exportAspirasiToCSV(data)
      } else {
        await exportAspirasiToExcel(data)
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Export error:", error)
      alert("Gagal mengekspor data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ekspor Data Aspirasi</DialogTitle>
          <DialogDescription>
            Pilih filter dan format untuk mengekspor data aspirasi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Field>
            <FieldLabel>Format</FieldLabel>
            <Select value={format} onValueChange={(val) => setFormat(val as "csv" | "excel")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Tanggal Mulai</FieldLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Tanggal Akhir</FieldLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Kategori</FieldLabel>
            <Select value={category} onValueChange={(val) => setCategory(val as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="fasilitas">Fasilitas</SelectItem>
                <SelectItem value="akademik">Akademik</SelectItem>
                <SelectItem value="ekstrakurikuler">Ekstrakurikuler</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={status} onValueChange={(val) => setStatus(val as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengekspor...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Ekspor
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
