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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, AlertCircle } from "lucide-react"
import { getAspirasiById, getFeedbackByAspirasiId, updateAspirasiStatus } from "@/lib/supabase/queries"
import { AspirasiDetailView } from "@/components/aspirasi/aspirasi-detail-view"
import { FeedbackList } from "@/components/aspirasi/feedback-list"
import { FeedbackForm } from "@/components/aspirasi/feedback-form"
import type { Aspirasi, Feedback } from "@/lib/supabase/queries"

interface AdminAspirasiDetailPageProps {
  id: string
}

export function AdminAspirasiDetailPage({ id }: AdminAspirasiDetailPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [adminId, setAdminId] = useState<string | null>(null)
  const [aspirasi, setAspirasi] = useState<Aspirasi | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

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

      setAdminId(user.id)

      try {
        const aspirasiData = await getAspirasiById(id)
        setAspirasi(aspirasiData)

        const feedbackData = await getFeedbackByAspirasiId(id)
        setFeedback(feedbackData)
      } catch (error) {
        console.error("Error loading aspirasi:", error)
        router.push("/admin/kelola-aspirasi")
      }

      setLoading(false)
    }
    init()
  }, [id, router])

  async function handleStatusChange(status: "approved" | "rejected") {
    if (!aspirasi) return

    setError("")
    setSuccess("")

    try {
      await updateAspirasiStatus(aspirasi.id, status)
      setAspirasi({ ...aspirasi, status })
      setSuccess(`Aspirasi berhasil ${status === "approved" ? "disetujui" : "ditolak"}`)
    } catch (err: any) {
      setError(err.message || "Gagal mengubah status aspirasi")
    }
  }

  async function handleFeedbackSuccess() {
    setSuccess("Feedback berhasil ditambahkan")
    const feedbackData = await getFeedbackByAspirasiId(id)
    setFeedback(feedbackData)
  }

  if (loading || !aspirasi || !adminId) {
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
                  <BreadcrumbLink href="/admin/kelola-aspirasi">Kelola Aspirasi</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 max-w-4xl">
          <Button variant="ghost" onClick={() => router.push("/admin/kelola-aspirasi")} className="w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

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

          <AspirasiDetailView aspirasi={aspirasi} showSubmitter />

          {aspirasi.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Tindakan</CardTitle>
                <CardDescription>Setujui atau tolak aspirasi ini</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button onClick={() => handleStatusChange("approved")} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setujui
                </Button>
                <Button variant="destructive" onClick={() => handleStatusChange("rejected")} className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Feedback
              </CardTitle>
              <CardDescription>Berikan tanggapan atau komentar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FeedbackList feedback={feedback} />
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Tambah Feedback Baru</h4>
                <FeedbackForm
                  aspirasiId={aspirasi.id}
                  adminId={adminId}
                  onSuccess={handleFeedbackSuccess}
                  onError={setError}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
