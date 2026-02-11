import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, MessageSquare, CheckCircle, Clock } from "lucide-react"
import { getDailyStats } from "@/lib/supabase/queries"

export async function StatistikHariIniPageContent() {
  const stats = await getDailyStats()

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
            <div className="text-2xl font-bold">{stats.aspirasiCreatedToday}</div>
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aspirasi Diselesaikan</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aspirasiResolvedToday}</div>
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aspirasiPending}</div>
            <p className="text-xs text-muted-foreground">Total saat ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Baru</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersCreatedToday}</div>
            <p className="text-xs text-muted-foreground">Terdaftar hari ini</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart removed for now as requested to separate components and focus on real data. 
          If user wants charts back with real data, we can implement it in a separate Client Component later. 
      */}
    </div>
  )
}
