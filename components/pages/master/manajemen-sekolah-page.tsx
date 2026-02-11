import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield } from "lucide-react"
import Link from "next/link"
import { getTotalUsers, getTotalAdmins } from "@/lib/supabase/queries"

export async function ManajemenSekolahPageContent() {
  const totalMurid = await getTotalUsers()
  const totalAdmin = await getTotalAdmins()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Manajemen Sekolah</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/master/daftar-murid">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Murid</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMurid}</div>
                        <p className="text-xs text-muted-foreground">Termasuk semua siswa terdaftar</p>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/master/daftar-admin">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAdmin}</div>
                        <p className="text-xs text-muted-foreground">Admin dan Master Admin</p>
                    </CardContent>
                </Card>
            </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                        Ringkasan data sekolah Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                   <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Pilih menu di atas untuk mengelola data detail.
                   </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
