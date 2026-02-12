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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, UserMinus } from "lucide-react"
import { demoteToMurid } from "@/lib/supabase/queries"
import type { Profile } from "@/lib/supabase/queries"

interface DemoteAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin: Profile | null
  onSuccess?: () => void
}

export function DemoteAdminDialog({ open, onOpenChange, admin, onSuccess }: DemoteAdminDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleDemote() {
    if (!admin) return

    setLoading(true)
    setError("")

    try {
      await demoteToMurid(admin.id)
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || "Gagal menurunkan admin")
    } finally {
      setLoading(false)
    }
  }

  if (!admin) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Turunkan ke Murid</DialogTitle>
          <DialogDescription>
            Konfirmasi penurunan admin menjadi murid
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="text-sm">
              Anda akan menurunkan admin berikut menjadi murid:
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{admin.nama || "Nama tidak tersedia"}</p>
              <p className="text-sm text-muted-foreground">{admin.email}</p>
              {admin.nis && <p className="text-sm text-muted-foreground">NIS: {admin.nis}</p>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Setelah diturunkan, user akan kehilangan akses ke Admin Panel.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDemote} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <UserMinus className="w-4 h-4 mr-2" />
                Turunkan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
