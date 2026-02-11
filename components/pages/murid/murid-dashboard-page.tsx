"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppSidebar } from "@/components/student/app-sidebar"
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
import { MuridStats } from "@/components/dashboard/murid/murid-stats"
import { MuridStatusChart } from "@/components/dashboard/murid/murid-status-chart"
import { MuridRecentAspirasi } from "@/components/dashboard/murid/murid-recent-aspirasi"
import { MuridSubmitCTA } from "@/components/dashboard/murid/murid-submit-cta"

export function MuridDashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // --- MOCK MODE START ---
      const { IS_MOCK_MODE, MOCK_USER } = await import("@/lib/mock-auth-config")
      if (IS_MOCK_MODE && localStorage.getItem("mock_session") === "true") {
        const mockRole = localStorage.getItem("mock_role")
        if (mockRole !== "murid") {
          router.push("/login")
          return
        }
        setUserId(MOCK_USER.id)
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

      // Check if user has 'murid' role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile || profile.role !== "murid") {
        // Redirect to appropriate dashboard based on role
        if (profile?.role === "master") {
          router.push("/master")
        } else if (profile?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/login")
        }
        return
      }

      setUserId(user.id)
      setLoading(false)
    }
    init()
  }, [router])

  if (loading || !userId) {
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
                    <Link href="/murid">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Murid</h2>
            <p className="text-muted-foreground">Selamat datang di sistem SAKTI</p>
          </div>

          <MuridStats userId={userId} />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <MuridStatusChart userId={userId} />
              <MuridSubmitCTA />
            </div>
            <MuridRecentAspirasi userId={userId} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
