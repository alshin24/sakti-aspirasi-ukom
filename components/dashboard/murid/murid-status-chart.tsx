"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getMuridStats } from "@/lib/supabase/queries"

interface MuridStatusChartProps {
  userId: string
}

export function MuridStatusChart({ userId }: MuridStatusChartProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const stats = await getMuridStats(userId)
        const chartData = [
          { name: "Pending", value: stats.pending, color: "#EAB308" }, // Yellow-500
          { name: "Disetujui", value: stats.approved, color: "#16A34A" }, // Green-600
          { name: "Ditolak", value: stats.rejected, color: "#DC2626" }, // Red-600
        ]
        setData(chartData.filter(d => d.value > 0))
      } catch (error) {
        console.error("Error loading chart data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [userId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Aspirasi</CardTitle>
          <CardDescription>Distribusi status aspirasi Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Aspirasi</CardTitle>
          <CardDescription>Distribusi status aspirasi Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Belum ada data untuk ditampilkan
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Aspirasi</CardTitle>
        <CardDescription>Distribusi status aspirasi Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
