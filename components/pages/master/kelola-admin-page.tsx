"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/master/app-sidebar"
import { supabase } from "@/lib/supabase/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users } from "lucide-react"

export function KelolaAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [adminCount, setAdminCount] = useState(0)
  const [muridCount, setMuridCount] = useState(0)

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (!profile || profile.role !== "master") {
        router.push("/login")
        return
      }

      const { count: adminCnt } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .in("role", ["admin", "master"])

      const { count: muridCnt } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "murid")

      setAdminCount(adminCnt || 0)
      setMuridCount(muridCnt || 0)
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Memuat...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/master">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kelola Admin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h2 className="text-2xl font-bold">Kelola Admin</h2>
            <p className="text-muted-foreground">Kelola admin dan promosi user</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => router.push("/master/daftar-admin")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Daftar Admin
                </CardTitle>
                <CardDescription>Lihat dan kelola admin aktif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{adminCount}</div>
                <p className="text-sm text-muted-foreground">Admin aktif (termasuk master)</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => router.push("/master/daftar-murid")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Daftar Murid
                </CardTitle>
                <CardDescription>Promosikan murid menjadi admin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{muridCount}</div>
                <p className="text-sm text-muted-foreground">Murid terdaftar</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
