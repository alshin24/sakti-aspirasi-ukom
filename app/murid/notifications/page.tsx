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
import { getNotifications, markNotificationRead, getUnreadNotificationsCount } from "@/lib/supabase/queries"
import type { Notification } from "@/lib/supabase/queries"
import { Bell, CheckCircle, XCircle, Info } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])

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
      
      // Load notifications
      try {
        const notifs = await getNotifications(user.id)
        setNotifications(notifs)
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }
    init()
  }, [router])

  async function handleMarkAsRead(notificationId: string) {
    try {
      await markNotificationRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

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
                  <BreadcrumbPage>Notifikasi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 max-w-4xl">
          <div className="mb-2">
            <h2 className="text-2xl font-bold">Notifikasi</h2>
            <p className="text-muted-foreground">Update terbaru tentang aspirasi Anda</p>
          </div>

          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Belum ada notifikasi</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {notification.message}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.created_at).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Tandai Dibaca
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
