import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Database, FileUp, History, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MoreAdminPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Menu Lainnya</h1>
            <p className="text-muted-foreground">
            Alat tambahan dan utilitas admin.
            </p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/master">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
            </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-primary" />
              Ekspor Data
            </CardTitle>
            <CardDescription>
              Unduh data aspirasi dalam format CSV/Excel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Unduh Laporan Bulanan</Button>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Riwayat Aktivitas
            </CardTitle>
            <CardDescription>
              Lihat log aktivitas admin dan perubahan sistem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Lihat Log Aktivitas</Button>
          </CardContent>
        </Card>

        <Card className="opacity-50">
           <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup & Restore
            </CardTitle>
            <CardDescription>
              Fitur ini ditangani otomatis oleh sistem pusat.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="ghost" disabled className="w-full">Tidak Tersedia</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
