"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createAdminAccount } from "@/lib/supabase/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react"

export function AddAdminForm() {
  const router = useRouter()
  const [nama, setNama] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!nama || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi")
      return
    }

    if (password !== confirmPassword) {
      setError("Password tidak sama")
      return
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setLoading(true)

    try {
      await createAdminAccount({
        email,
        password,
        nama,
      })

      setSuccess("Admin berhasil ditambahkan!")
      
      // Reset form
      setNama("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/master/daftar-admin")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Tambah Admin Baru
        </CardTitle>
        <CardDescription>
          Buat akun admin baru yang dapat mengelola aspirasi siswa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-300 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel>Nama Lengkap</FieldLabel>
              <Input
                type="text"
                placeholder="Masukkan nama lengkap admin"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="admin@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel>Konfirmasi Password</FieldLabel>
              <Input
                type="password"
                placeholder="Ketik ulang password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  "Membuat Akun..."
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tambah Admin
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/master/daftar-admin")}
                disabled={loading}
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
