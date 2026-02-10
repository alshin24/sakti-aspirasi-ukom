"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { getAspirasiByStatus, getAspirasiPerDay } from "@/lib/supabase/queries"

export function AdminAspirasiCharts() {
  const [loading, setLoading] = useState(true)
  const [statusData, setStatusData] = useState<any[]>([])
  const [trendData, setTrendData] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [statusCounts, dailyCounts] = await Promise.all([
          getAspirasiByStatus(),
          getAspirasiPerDay(7)
        ])

        const sData = [
          { name: "Pending", value: statusCounts.pending, color: "#EAB308" },
          { name: "Disetujui", value: statusCounts.approved, color: "#16A34A" },
          { name: "Ditolak", value: statusCounts.rejected, color: "#DC2626" },
        ].filter(d => d.value > 0)

        setStatusData(sData)
        setTrendData(dailyCounts)
      } catch (error) {
        console.error("Error loading chart data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tren Aspirasi</CardTitle>
            <CardDescription>Jumlah aspirasi 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full animate-pulse bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status</CardTitle>
            <CardDescription>Perbandingan status aspirasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full animate-pulse bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
       {/* Bar Chart - Trend Harian */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Aspirasi</CardTitle>
          <CardDescription>Jumlah aspirasi 7 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Jumlah Aspirasi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart - Status */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Status</CardTitle>
          <CardDescription>Perbandingan status semua aspirasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
             {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Belum ada data
                </div>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
