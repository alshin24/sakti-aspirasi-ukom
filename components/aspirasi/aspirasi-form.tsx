"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, AlertCircle, CheckCircle } from "lucide-react"
import { submitAspirasi } from "@/lib/supabase/queries"
import type { AspirasiCategory } from "@/lib/supabase/queries"

interface AspirasiFormProps {
  userId: string
  onSuccess?: () => void
}

export function AspirasiForm({ userId, onSuccess }: AspirasiFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [category, setCategory] = useState<AspirasiCategory>("fasilitas")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!title.trim() || !content.trim()) {
      setError("Judul dan isi aspirasi wajib diisi")
      return
    }

    setSubmitting(true)

    try {
      await submitAspirasi({
        submitter_id: userId,
        category,
        title: title.trim(),
        content: content.trim(),
        location: location.trim() || undefined,
      })

      setSuccess(true)
      setTitle("")
      setContent("")
      setLocation("")
      setCategory("fasilitas")

      if (onSuccess) {
        onSuccess()
      } else {
        setTimeout(() => {
          router.push("/murid/aspirasi-saya")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengirim aspirasi")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Aspirasi</CardTitle>
        <CardDescription>Isi form di bawah dengan jelas dan lengkap</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-300 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Aspirasi berhasil dikirim! Mengarahkan ke halaman aspirasi saya...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Kategori</FieldLabel>
              <Select value={category} onValueChange={(val) => setCategory(val as AspirasiCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fasilitas">Fasilitas</SelectItem>
                  <SelectItem value="akademik">Akademik</SelectItem>
                  <SelectItem value="ekstrakurikuler">Ekstrakurikuler</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Judul Aspirasi *</FieldLabel>
              <Input
                type="text"
                placeholder="Contoh: Penambahan AC di kelas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={255}
              />
            </Field>

            <Field>
              <FieldLabel>Lokasi (Opsional)</FieldLabel>
              <Input
                type="text"
                placeholder="Contoh: Ruang kelas 10 IPA 1"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={255}
              />
            </Field>

            <Field>
              <FieldLabel>Isi Aspirasi *</FieldLabel>
              <Textarea
                placeholder="Jelaskan aspirasi Anda secara detail..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">{content.length} karakter</p>
            </Field>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? (
                  "Mengirim..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Aspirasi
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/murid/dashboard")}
                disabled={submitting}
              >
                Batal
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
