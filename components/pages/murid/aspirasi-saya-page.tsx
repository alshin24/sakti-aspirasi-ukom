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
import { Button } from "@/components/ui/button"
import { MessageSquarePlus } from "lucide-react"
import { AspirasiFilters } from "@/components/aspirasi/aspirasi-filters"
import { AspirasiList } from "@/components/aspirasi/aspirasi-list"
import type { Aspirasi, AspirasiStatus } from "@/lib/supabase/queries"

export function AspirasiSayaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [aspirasi, setAspirasi] = useState<Aspirasi[]>([])
  const [filter, setFilter] = useState<"all" | AspirasiStatus>("all")

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

      setLoading(true)
      try {
        // Use the centralized query function which handles Mock Mode
        const { getMuridAspirasi } = await import("@/lib/supabase/queries")
        const data = await getMuridAspirasi(user.id)
        setAspirasi(data || [])
      } catch (error) {
        console.error("Error loading aspirasi:", error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  const filteredAspirasi = filter === "all" ? aspirasi : aspirasi.filter((a) => a.status === filter)

  const counts = {
    all: aspirasi.length,
    pending: aspirasi.filter((a) => a.status === "pending").length,
    approved: aspirasi.filter((a) => a.status === "approved").length,
    rejected: aspirasi.filter((a) => a.status === "rejected").length,
  }

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
                  <BreadcrumbLink href="/murid">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Aspirasi Saya</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Aspirasi Saya</h2>
              <p className="text-muted-foreground">Semua aspirasi yang sudah Anda kirim</p>
            </div>
            <Button onClick={() => router.push("/murid/kirim-aspirasi")}>
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Kirim Baru
            </Button>
          </div>

          <AspirasiFilters currentFilter={filter} onFilterChange={setFilter} counts={counts} />

          <AspirasiList
            aspirasi={filteredAspirasi}
            onViewDetail={(id) => router.push(`/murid/aspirasi-saya/${id}`)}
            emptyMessage={
              filter === "all"
                ? "Belum ada aspirasi. Kirim aspirasi pertama Anda!"
                : `Tidak ada aspirasi dengan status ${filter}`
            }
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
