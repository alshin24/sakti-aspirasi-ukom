"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Search, ArrowUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { promoteToAdmin } from "@/lib/supabase/queries"
import type { Profile } from "@/lib/supabase/queries"

interface MuridListProps {
  onUpdate: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function MuridList({ onUpdate, onSuccess, onError }: MuridListProps) {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "murid")
      .order("created_at", { ascending: false })

    setUsers(data || [])
    setLoading(false)
  }

  async function handlePromote(userId: string) {
    try {
      await promoteToAdmin(userId)
      await loadData()
      onUpdate()
      onSuccess("User berhasil dipromosikan menjadi admin")
    } catch (err: any) {
      onError(err.message || "Gagal mempromosikan user")
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      searchQuery === "" ||
      u.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.kelas?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-muted rounded"></div>
      ))}
    </div>
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari nama, NIS, kelas, atau email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{searchQuery ? "Tidak ada hasil pencarian" : "Tidak ada murid terdaftar"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
              <div className="flex-1">
                <h4 className="font-medium">{user.nama || user.email}</h4>
                <p className="text-sm text-muted-foreground">
                  {user.email}
                  {user.nis && <span> • NIS: {user.nis}</span>}
                  {user.kelas && <span> • Kelas: {user.kelas}</span>}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handlePromote(user.id)}>
                <ArrowUp className="w-4 h-4 mr-1" />
                Jadikan Admin
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
