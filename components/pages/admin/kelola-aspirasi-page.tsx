"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
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
import { AspirasiSearch } from "@/components/aspirasi/aspirasi-search"
import { AspirasiFilters } from "@/components/aspirasi/aspirasi-filters"
import { AspirasiList } from "@/components/aspirasi/aspirasi-list"
import type { Aspirasi, AspirasiStatus } from "@/lib/supabase/queries"

export function KelolaAspirasiPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [aspirasi, setAspirasi] = useState<Aspirasi[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | AspirasiStatus>("all")

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

      if (!profile || (profile.role !== "admin" && profile.role !== "master")) {
        router.push("/login")
        return
      }

      const { data } = await supabase
        .from("aspirasi")
        .select(`
          *,
          submitter:profiles!aspirasi_submitter_id_fkey(id, nis, nama, email)
        `)
        .order("created_at", { ascending: false })

      setAspirasi((data as Aspirasi[]) || [])
      setLoading(false)
    }
    init()
  }, [router])

  const filteredAspirasi = aspirasi.filter((a) => {
    const matchesSearch =
      searchQuery === "" ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.submitter?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.submitter?.nis?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filter === "all" || a.status === filter

    return matchesSearch && matchesFilter
  })

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
                  <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kelola Aspirasi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h2 className="text-2xl font-bold">Kelola Aspirasi</h2>
            <p className="text-muted-foreground">Tinjau dan kelola semua aspirasi dari murid</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <AspirasiSearch value={searchQuery} onChange={setSearchQuery} placeholder="Cari judul, isi, atau nama murid..." />
          </div>

          <AspirasiFilters currentFilter={filter} onFilterChange={setFilter} counts={counts} />

          <AspirasiList
            aspirasi={filteredAspirasi}
            onViewDetail={(id) => router.push(`/admin/kelola-aspirasi/${id}`)}
            showSubmitter
            emptyMessage={
              searchQuery || filter !== "all"
                ? "Tidak ada aspirasi yang sesuai dengan filter"
                : "Belum ada aspirasi dari murid"
            }
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
