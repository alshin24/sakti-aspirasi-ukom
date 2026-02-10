"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { getLatestAspirasi } from "@/lib/supabase/queries"
import { AspirasiCard } from "@/components/aspirasi/aspirasi-card"
import type { Aspirasi } from "@/lib/supabase/queries"

export function AdminLatestAspirasi() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [aspirasi, setAspirasi] = useState<Aspirasi[]>([])

  useEffect(() => {
    async function loadAspirasi() {
      try {
        const data = await getLatestAspirasi(5)
        setAspirasi(data)
      } catch (error) {
        console.error("Error loading aspirasi:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAspirasi()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aspirasi Terbaru</CardTitle>
          <CardDescription>5 aspirasi terakhir dari semua murid</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Aspirasi Terbaru</CardTitle>
            <CardDescription>5 aspirasi terakhir dari semua murid</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/kelola-aspirasi")}>
            Lihat Semua
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {aspirasi.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada aspirasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {aspirasi.map((item) => (
              <AspirasiCard
                key={item.id}
                aspirasi={item}
                onViewDetail={(id) => router.push(`/admin/kelola-aspirasi/${id}`)}
                showSubmitter
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
