import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, MessageSquare, CheckCircle, Clock } from "lucide-react"
import { getDailyStats, getWeeklyActivityStats } from "@/lib/supabase/queries"
import { StatistikChart } from "./statistik-chart"

export async function StatistikMasterPageContent() {
  const [dailyStats, weeklyStats] = await Promise.all([
    getDailyStats(),
    getWeeklyActivityStats(7)
  ])

  // Calculate trends
  const todayStats = weeklyStats[weeklyStats.length - 1]
  const yesterdayStats = weeklyStats[weeklyStats.length - 2]

  const incomingTrend = yesterdayStats.aspirasi > 0 
    ? ((todayStats.aspirasi - yesterdayStats.aspirasi) / yesterdayStats.aspirasi) * 100 
    : 0
  
  const resolvedTrend = yesterdayStats.selesai > 0
    ? ((todayStats.selesai - yesterdayStats.selesai) / yesterdayStats.selesai) * 100
    : 0

  return (
    <div className="container mx-auto max-w-6xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Statistik Hari Ini</h1>
        <p className="text-muted-foreground">
          Ringkasan aktivitas aspirasi dan penggunaan aplikasi hari ini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aspirasi Masuk</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.aspirasiCreatedToday}</div>
            <p className="text-xs text-muted-foreground">
              {incomingTrend !== 0 ? (
                <span className={incomingTrend > 0 ? "text-green-600" : "text-red-600"}>
                  {incomingTrend > 0 ? "+" : ""}{incomingTrend.toFixed(1)}% dari kemarin
                </span>
              ) : (
                "Sama dengan kemarin"
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aspirasi Diselesaikan</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.aspirasiResolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              {resolvedTrend !== 0 ? (
                <span className={resolvedTrend > 0 ? "text-green-600" : "text-red-600"}>
                  {resolvedTrend > 0 ? "+" : ""}{resolvedTrend.toFixed(1)}% dari kemarin
                </span>
              ) : (
                "Sama dengan kemarin"
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.aspirasiPending}</div>
            <p className="text-xs text-muted-foreground">Total saat ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Baru</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.usersCreatedToday}</div>
            <p className="text-xs text-muted-foreground">Terdaftar hari ini</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Tren Mingguan</CardTitle>
          <CardDescription>
            Perbandingan jumlah aspirasi masuk dan diselesaikan dalam 7 hari terakhir.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <StatistikChart data={weeklyStats} />
        </CardContent>
      </Card>
    </div>
  )
}
