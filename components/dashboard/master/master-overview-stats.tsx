"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, FileText } from "lucide-react"
import { getTotalUsers, getTotalAdmins, getGlobalStats } from "@/lib/supabase/queries"

export function MasterOverviewStats() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, admins: 0, aspirasi: 0 })

  useEffect(() => {
    async function loadStats() {
      try {
        const [users, admins, globalStats] = await Promise.all([
          getTotalUsers(),
          getTotalAdmins(),
          getGlobalStats(),
        ])
        setStats({ users, admins, aspirasi: globalStats.total })
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
            <Users className="w-4 h-4" />
            Total Users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Total Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.admins}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Total Aspirasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.aspirasi}</div>
        </CardContent>
      </Card>
    </div>
  )
}
