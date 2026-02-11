"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { supabase } from "@/lib/supabase/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AdminGlobalStats } from "@/components/dashboard/admin/admin-global-stats"
import { AdminLatestAspirasi } from "@/components/dashboard/admin/admin-latest-aspirasi"
import { AdminAspirasiCharts } from "@/components/dashboard/admin/admin-aspirasi-charts"

export function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // --- MOCK MODE START ---
      const { IS_MOCK_MODE } = await import("@/lib/mock-auth-config")
      if (IS_MOCK_MODE && localStorage.getItem("mock_session") === "true") {
        const role = localStorage.getItem("mock_role")
        if (role !== "admin" && role !== "master") {
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

      if (!profile || (profile.role !== "admin" && profile.role !== "master")) {
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
                  <BreadcrumbLink asChild>
                    <Link href="/admin">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Admin</h2>
            <p className="text-muted-foreground">Kelola dan tinjau aspirasi dari semua murid</p>
          </div>

          <AdminGlobalStats />
          <AdminAspirasiCharts />
          <AdminLatestAspirasi />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
