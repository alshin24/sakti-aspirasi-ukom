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
import { Send, AlertCircle, CheckCircle, Image as ImageIcon, X } from "lucide-react"
import { submitAspirasi, uploadAspirasiImage } from "@/lib/supabase/queries"
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, dll)")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB")
      return
    }

    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setError("")
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
  }

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
      let imageUrl: string | undefined = undefined

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true)
        try {
          imageUrl = await uploadAspirasiImage(imageFile)
        } catch (err: any) {
          setError(`Gagal mengupload gambar: ${err.message}`)
          setSubmitting(false)
          setUploadingImage(false)
          return
        }
        setUploadingImage(false)
      }

      await submitAspirasi({
        submitter_id: userId,
        category,
        title: title.trim(),
        content: content.trim(),
        location: location.trim() || undefined,
        image_url: imageUrl,
      })

      setSuccess(true)
      setTitle("")
      setContent("")
      setLocation("")
      setCategory("fasilitas")
      setImageFile(null)
      setImagePreview(null)

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

            <Field>
              <FieldLabel>Gambar (Opsional)</FieldLabel>
              <div className="space-y-2">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-auto max-h-64 rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Pilih Gambar
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Format: JPG, PNG. Maksimal 5MB.
                </p>
              </div>
            </Field>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting || uploadingImage} className="flex-1">
                {uploadingImage ? (
                  "Mengupload gambar..."
                ) : submitting ? (
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
                onClick={() => router.push("/murid")}
                disabled={submitting || uploadingImage}
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
