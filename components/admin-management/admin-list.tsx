"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowDown } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { demoteToMurid } from "@/lib/supabase/queries"
import type { Profile } from "@/lib/supabase/queries"

interface AdminListProps {
  onUpdate: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function AdminList({ onUpdate, onSuccess, onError }: AdminListProps) {
  const [loading, setLoading] = useState(true)
  const [admins, setAdmins] = useState<Profile[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["admin", "master"])
      .order("created_at", { ascending: false })

    setAdmins(data || [])
    setLoading(false)
  }

  async function handleDemote(userId: string) {
    try {
      await demoteToMurid(userId)
      await loadData()
      onUpdate()
      onSuccess("Admin berhasil diturunkan menjadi murid")
    } catch (err: any) {
      onError(err.message || "Gagal menurunkan admin")
    }
  }

  if (loading) {
    return <div className="animate-pulse space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-muted rounded"></div>
      ))}
    </div>
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Tidak ada admin</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {admins.map((admin) => (
        <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium">{admin.nama || admin.email}</h4>
            <p className="text-sm text-muted-foreground">
              {admin.email}
              {admin.nis && <span> • NIS: {admin.nis}</span>}
              {admin.kelas && <span> • Kelas: {admin.kelas}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={admin.role === "master" ? "default" : "outline"}>{admin.role}</Badge>
            {admin.role === "admin" && (
              <Button variant="outline" size="sm" onClick={() => handleDemote(admin.id)}>
                <ArrowDown className="w-4 h-4 mr-1" />
                Turunkan
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
