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
import { AlertCircle, Loader2, UserPlus } from "lucide-react"
import { promoteToAdmin } from "@/lib/supabase/queries"
import type { Profile } from "@/lib/supabase/queries"

interface PromoteMuridDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  murid: Profile | null
  onSuccess?: () => void
}

export function PromoteMuridDialog({ open, onOpenChange, murid, onSuccess }: PromoteMuridDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handlePromote() {
    if (!murid) return

    setLoading(true)
    setError("")

    try {
      await promoteToAdmin(murid.id)
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || "Gagal mempromosikan murid")
    } finally {
      setLoading(false)
    }
  }

  if (!murid) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promosikan ke Admin</DialogTitle>
          <DialogDescription>
            Konfirmasi promosi murid menjadi admin
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
              Anda akan mempromosikan murid berikut menjadi admin:
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{murid.nama || "Nama tidak tersedia"}</p>
              <p className="text-sm text-muted-foreground">{murid.email}</p>
              {murid.nis && <p className="text-sm text-muted-foreground">NIS: {murid.nis}</p>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Setelah dipromosikan, user akan memiliki akses ke Admin Panel.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handlePromote} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Promosikan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
