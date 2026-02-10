"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, CheckCircle, AlertCircle } from "lucide-react"
import { updateProfile } from "@/lib/supabase/queries"
import type { Profile } from "@/lib/supabase/queries"

interface ProfileEditFormProps {
  profile: Profile
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [nis, setNis] = useState(profile.nis || "")
  const [nama, setNama] = useState(profile.nama || "")
  const [kelas, setKelas] = useState(profile.kelas || "")

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!nis.trim() || !nama.trim() || !kelas.trim()) {
      setError("NIS, Nama, dan Kelas wajib diisi")
      return
    }

    setSaving(true)

    try {
      await updateProfile(profile.id, {
        nis: nis.trim(),
        nama: nama.trim(),
        kelas: kelas.trim(),
      })

      setSuccess("Profil berhasil diperbarui")
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui profil")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informasi Akun
        </CardTitle>
        <CardDescription>Update data profil Anda</CardDescription>
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
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">Email tidak dapat diubah</p>
            </Field>

            <Field>
              <FieldLabel>NIS *</FieldLabel>
              <Input
                type="text"
                placeholder="Nomor Induk Siswa"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Nama Lengkap *</FieldLabel>
              <Input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Kelas *</FieldLabel>
              <Input
                type="text"
                placeholder="Contoh: 10 IPA 1, 11 IPS 2"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                required
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/murid/dashboard")}
                disabled={saving}
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
