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
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AddAdminForm } from "@/components/admin-management/add-admin-form"

export function TambahAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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
                  <BreadcrumbLink href="/master/daftar-admin">Daftar Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tambah Admin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Button variant="ghost" onClick={() => router.push("/master/daftar-admin")} className="w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div>
            <h2 className="text-2xl font-bold">Tambah Admin Baru</h2>
            <p className="text-muted-foreground">Buat akun admin baru untuk mengelola sistem aspirasi</p>
          </div>

          <AddAdminForm />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
