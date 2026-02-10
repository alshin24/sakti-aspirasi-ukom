"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle } from "lucide-react"
import { getGlobalStats } from "@/lib/supabase/queries"

export function AdminGlobalStats() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, approvedToday: 0 })

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getGlobalStats()
        setStats(data)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Total Aspirasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            Menunggu Review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Disetujui Hari Ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approvedToday}</div>
        </CardContent>
      </Card>
    </div>
  )
}
