"use client"

import Link from "next/link"
import * as React from "react"
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  BarChart3,
  Settings,
  LifeBuoy,
  Send,
  Shield,
  TrendingUp,
  Clock,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/admin/nav-main"
import { NavProjects } from "@/components/admin/nav-projects"
import { NavSecondary } from "@/components/admin/nav-secondary"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase/client"
import { getProfileById } from "@/lib/supabase/queries"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
      ],
    },
    {
      title: "Kelola Aspirasi",
      url: "/admin/kelola-aspirasi",
      icon: MessageSquare,
      items: [
        {
          title: "Semua Aspirasi",
          url: "/admin/kelola-aspirasi",
        },
      ],
    },
    {
      title: "Kelola Pengguna",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "Semua Pengguna",
          url: "/admin/users",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Bantuan",
      url: "/admin/help",
      icon: LifeBuoy,
    },
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
  projects: [
    {
      name: "Statistik Hari Ini",
      url: "/admin/stats/today",
      icon: TrendingUp,
    },
    {
      name: "Aktivitas Terkini",
      url: "/admin/activity",
      icon: Clock,
    },
    {
      name: "Keamanan Sistem",
      url: "/admin/security",
      icon: Shield,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({ name: "Admin", email: "admin@sakti.sch.id", avatar: "/avatars/admin.jpg" })
  const [role, setRole] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const profile = await getProfileById(authUser.id)
          if (profile) {
            setUser({
              name: profile.nama || "Admin",
              email: profile.email,
              avatar: "/avatars/admin.jpg",
            })
            setRole(profile.role)
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    fetchUser()
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SAKTI</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} role={role} />
      </SidebarFooter>
    </Sidebar>
  )
}


