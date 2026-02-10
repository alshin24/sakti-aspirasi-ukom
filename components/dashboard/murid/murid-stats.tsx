"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { getMuridStats } from "@/lib/supabase/queries"

interface MuridStatsProps {
  userId: string
}

export function MuridStats({ userId }: MuridStatsProps) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getMuridStats(userId)
        setStats(data)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [userId])

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 bg-muted rounded w-20"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-12"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
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
            Pending
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
            Disetujui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approved}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            Ditolak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rejected}</div>
        </CardContent>
      </Card>
    </div>
  )
}
