"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { getProfileById } from "@/lib/supabase/queries"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error: authError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !data.user) {
        if (authError?.message.includes("Email not confirmed")) {
          throw new Error("Email belum dikonfirmasi. Cek inbox/spam Anda.")
        }
        if (authError?.message.includes("rate limit")) {
          throw new Error("Terlalu banyak percobaan. Mohon tunggu beberapa saat sebelum mencoba lagi.")
        }
        throw new Error(authError?.message || "Login gagal")
      }

      const profile = await getProfileById(data.user.id)

      if (!profile) {
        throw new Error("Profile tidak ditemukan")
      }

      if (profile.role === "master") {
        router.push("/master")
      } else if (profile.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/murid")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className} {...props}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Masuk ke SAKTI</CardTitle>
          <CardDescription>
            Masukkan email dan password Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="nama@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  "Memproses..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
