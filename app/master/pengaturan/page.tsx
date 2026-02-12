"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Globe, Lock, Mail, Server, AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PengaturanMasterPage() {
  const [userEmail, setUserEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
    }
    getUser()
  }, [])

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    if (!userEmail) {
      setMessage({ type: "error", text: "Email tidak ditemukan. Mohon refresh halaman atau login ulang." })
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi kata sandi tidak cocok" })
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Kata sandi baru minimal 6 karakter" })
      setLoading(false)
      return
    }

    try {
      // 1. Verify old password by attempting sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: oldPassword,
      })

      if (signInError) {
        throw new Error("Kata sandi lama salah atau terjadi kesalahan autentikasi.")
      }

      // 2. Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      setMessage({ type: "success", text: "Kata sandi berhasil diperbarui." })
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      console.error("Password change error:", err)
      setMessage({ type: "error", text: err.message || "Gagal mengubah kata sandi." })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Global</h1>
        <p className="text-muted-foreground">
          Konfigurasi sistem dan preferensi admin.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Identitas Sekolah</CardTitle>
            </div>
            <CardDescription>
              Informasi dasar yang tampil di aplikasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">Nama Sekolah</Label>
                <Input id="school-name" defaultValue="SMK SAKTI Gemolong" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-email">Email Resmi</Label>
                <Input id="school-email" defaultValue="info@sakti.sch.id" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" defaultValue="Jl. Raya Sukowati No. 123, Sragen" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Simpan Perubahan</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle>Sistem</CardTitle>
            </div>
            <CardDescription>
              Pengaturan operasional sistem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="maintenance" className="flex flex-col space-y-1">
                <span>Mode Pemeliharaan (Maintenance)</span>
                <span className="font-normal text-muted-foreground">
                  Jika aktif, hanya admin yang bisa mengakses aplikasi.
                </span>
              </Label>
              <Switch id="maintenance" />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="registration" className="flex flex-col space-y-1">
                <span>Pendaftaran Murid Baru</span>
                <span className="font-normal text-muted-foreground">
                  Izinkan murid untuk mendaftar/login secara mandiri.
                </span>
              </Label>
              <Switch id="registration" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Keamanan Admin</CardTitle>
            </div>
            <CardDescription>
              Ubah kata sandi akun master admin.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordChange}>
            <CardContent className="space-y-4">
              {message && (
                <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-green-500 text-green-700 bg-green-50" : ""}>
                  {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="current-pass">Kata Sandi Lama</Label>
                <Input 
                  id="current-pass" 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-pass">Kata Sandi Baru</Label>
                  <Input 
                    id="new-pass" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pass">Konfirmasi Kata Sandi</Label>
                  <Input 
                    id="confirm-pass" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Update Keamanan"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
