"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/student/app-sidebar"
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
import { AspirasiForm } from "@/components/aspirasi/aspirasi-form"

export function KirimAspirasiPage() {
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

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile || profile.role !== "murid") {
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
                  <BreadcrumbLink href="/murid">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kirim Aspirasi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 max-w-3xl">
          <div className="mb-2">
            <h2 className="text-2xl font-bold">Kirim Aspirasi</h2>
            <p className="text-muted-foreground">Sampaikan ide atau keluhan Anda untuk kemajuan sekolah</p>
          </div>

          <AspirasiForm userId={userId} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
