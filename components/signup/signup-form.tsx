"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus } from "lucide-react";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Validation
    if (!nis || !nama || !kelas || !email || !password || !confirmPassword) {
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
      // --- MOCK MODE START ---
      const { IS_MOCK_MODE } = await import("@/lib/mock-auth-config")
      if (IS_MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        localStorage.setItem("mock_session", "true")
        localStorage.setItem("mock_role", "murid")
        
        alert("[MOCK MODE] Akun berhasil dibuat! Mengalihkan ke dashboard...")
        router.push("/murid")
        return
      }
      // --- MOCK MODE END ---

      // 1. Create auth user with metadata
      // This will trigger handle_new_user to create the profile with this data
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nis,
            nama,
            kelas,
          },
        },
      })

      if (authError || !authData.user) {
        if (authError?.message.includes("rate limit")) {
          throw new Error("Terlalu banyak percobaan. Mohon tunggu beberapa saat sebelum mencoba lagi.")
        }
        throw new Error(authError?.message || "Gagal membuat akun")
      }

      // 2. Profile creation is handled by the database trigger

      if (authData.session) {
        // Jika email confirmation disabled (via SQL script), user langsung login!
        // Langsung redirect ke dashboard, SKIP login manual.
        alert("Akun berhasil dibuat! Mengalihkan ke dashboard...")
        router.push("/murid")
        return
      }

      alert("Akun berhasil dibuat! Silakan login.")
      router.push("/login")
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
          <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Buat akun untuk mulai menyampaikan aspirasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel>NIS</FieldLabel>
                <Input
                  type="text"
                  placeholder="Nomor Induk Siswa"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Nama Lengkap</FieldLabel>
                <Input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Kelas</FieldLabel>
                <Input
                  type="text"
                  placeholder="Contoh: 10 IPA 1, 11 IPS 2"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  required
                />
              </Field>

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
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                />
              </Field>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  "Membuat Akun..."
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Daftar
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
