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
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Key } from "lucide-react"
import type { Profile } from "@/lib/supabase/queries"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: Profile | null
  onSuccess?: () => void
}

export function ChangePasswordDialog({ open, onOpenChange, user, onSuccess }: ChangePasswordDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleChangePassword() {
    if (!user) return

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok")
      return
    }

    setLoading(true)
    setError("")

    try {
      // In a production app, you'd call an API route that uses Supabase Admin API
      // For now, we'll show a message that this needs backend implementation
      setError("Fitur ini memerlukan implementasi backend dengan Supabase Admin API")
      
      // Placeholder for actual implementation:
      // const response = await fetch('/api/admin/change-password', {
      //   method: 'POST',
      //   body: JSON.stringify({ userId: user.id, newPassword })
      // })
      
    } catch (err: any) {
      setError(err.message || "Gagal mengubah password")
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setNewPassword("")
    setConfirmPassword("")
    setError("")
    onOpenChange(false)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ganti Password</DialogTitle>
          <DialogDescription>
            Ubah password untuk user terpilih
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-3 rounded-md">
            <p className="font-semibold text-sm">{user.nama || "Nama tidak tersedia"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <Field>
            <FieldLabel>Password Baru *</FieldLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              minLength={6}
            />
          </Field>

          <Field>
            <FieldLabel>Konfirmasi Password *</FieldLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang password"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleChangePassword} disabled={loading || !newPassword || !confirmPassword}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                Ganti Password
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
