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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { getAspirasiById, getFeedbackByAspirasiId } from "@/lib/supabase/queries"
import { AspirasiDetailView } from "@/components/aspirasi/aspirasi-detail-view"
import { FeedbackList } from "@/components/aspirasi/feedback-list"
import type { Aspirasi, Feedback } from "@/lib/supabase/queries"

interface AspirasiDetailPageProps {
  id: string
}

export function AspirasiDetailPage({ id }: AspirasiDetailPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [aspirasi, setAspirasi] = useState<Aspirasi | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      try {
        const aspirasiData = await getAspirasiById(id)

        if (aspirasiData.submitter_id !== user.id) {
          router.push("/murid/aspirasi-saya")
          return
        }

        setAspirasi(aspirasiData)

        const feedbackData = await getFeedbackByAspirasiId(id)
        setFeedback(feedbackData)
      } catch (error) {
        console.error("Error loading aspirasi:", error)
        router.push("/murid/aspirasi-saya")
      }

      setLoading(false)
    }
    init()
  }, [id, router])

  if (loading || !aspirasi) {
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
                  <BreadcrumbLink href="/murid/aspirasi-saya">Aspirasi Saya</BreadcrumbLink>
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
          <Button variant="ghost" onClick={() => router.push("/murid/aspirasi-saya")} className="w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <AspirasiDetailView aspirasi={aspirasi} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Feedback dari Admin
              </CardTitle>
              <CardDescription>Tanggapan dan komentar dari tim admin</CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackList
                feedback={feedback}
                emptyMessage={
                  aspirasi.status === "pending"
                    ? "Belum ada feedback dari admin. Aspirasi Anda sedang ditinjau."
                    : "Belum ada feedback dari admin"
                }
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
