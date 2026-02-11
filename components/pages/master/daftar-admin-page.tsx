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
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { AdminList } from "@/components/admin-management/admin-list"

export function DaftarAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

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

  function handleUpdate() {
    setRefreshKey((prev) => prev + 1)
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
                  <BreadcrumbLink href="/master/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/master/kelola-admin">Kelola Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Daftar Admin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Button variant="ghost" onClick={() => router.push("/master/kelola-admin")} className="w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Daftar Admin</h2>
              <p className="text-muted-foreground">Kelola dan turunkan admin sistem</p>
            </div>
            <Button onClick={() => router.push("/master/tambah-admin")}>
              <Shield className="w-4 h-4 mr-2" />
              Tambah Admin Baru
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-300 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin Aktif
              </CardTitle>
              <CardDescription>Daftar admin dan master yang terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminList key={refreshKey} onUpdate={handleUpdate} onSuccess={setSuccess} onError={setError} />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
