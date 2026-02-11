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
        {
          title: "Statistik Hari Ini",
          url: "/admin/statistik",
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
      title: "Pengaturan",
      url: "/admin/pengaturan",
      icon: Settings,
    },
    {
      title: "Lainnya",
      url: "/admin/more",
      icon: Command, 
    },
  ],
  projects: [], 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({ name: "Admin", email: "admin@sakti.sch.id", avatar: "/avatars/admin.jpg" })
  const [role, setRole] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
           console.log("No authenticated user found or auth error:", authError?.message)
           return
        }

        try {
            const profile = await getProfileById(authUser.id)
            if (profile) {
                setUser({
                name: profile.nama || authUser.user_metadata?.nama || "Admin",
                email: profile.email,
                avatar: "/avatars/admin.jpg",
                })
                setRole(profile.role)
            }
        } catch (profileError) {
            console.warn("Could not fetch profile (likely network issue), using auth fallback:", profileError)
            // Fallback to auth metadata if profile fetch fails
            setUser({
                name: authUser.user_metadata?.nama || "Admin",
                email: authUser.email || "admin@sakti.sch.id",
                avatar: "/avatars/admin.jpg",
            })
            // We can try to infer role or leave it null/default
            // For admin panel, maybe unsafe to assume role without checking DB, 
            // but for UI display it's better than crashing.
        }

      } catch (error) {
        console.error("Unexpected error in sidebar:", error)
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


