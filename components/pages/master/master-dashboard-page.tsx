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
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MasterOverviewStats } from "@/components/dashboard/master/master-overview-stats"
import { AdminAspirasiCharts } from "@/components/dashboard/admin/admin-aspirasi-charts"

export function MasterDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // --- MOCK MODE START ---
      const { IS_MOCK_MODE } = await import("@/lib/mock-auth-config")
      if (IS_MOCK_MODE && localStorage.getItem("mock_session") === "true") {
         const role = localStorage.getItem("mock_role")
         if (role !== "master") {
             router.push("/login")
             return
         }
         setLoading(false)
         return
      }
      // --- MOCK MODE END ---

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Master</h2>
            <p className="text-muted-foreground">Kelola sistem dan pengguna</p>
          </div>

          <MasterOverviewStats />
          <AdminAspirasiCharts />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
