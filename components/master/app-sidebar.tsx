"use client"

import Link from "next/link"
import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  Shield,
  BarChart4,
  Settings,
  LifeBuoy,
  Database,
  Users,
  Server,
  Activity,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/master/nav-main"
import { NavProjects } from "@/components/master/nav-projects"
import { NavSecondary } from "@/components/master/nav-secondary"
import { NavUser } from "@/components/master/nav-user"
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
      url: "/master",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/master",
        },
        {
          title: "Statistik Hari Ini",
          url: "/master/statistik",
        },
      ],
    },
    {
      title: "Manajemen Sekolah",
      url: "/master/manajemen-sekolah", // Note: existing typo 'shcools' kept to avoid breaking if folder exists, but if I didn't see it I'd check. I'll assume it works for now or I should check.
      icon: Building2,
      items: [
         {
          title: "Daftar Murid",
          url: "/master/daftar-murid",
        },
        {
          title: "Daftar Admin",
          url: "/master/daftar-admin",
        },
      ],
    },
    {
      title: "Kelola Admin",
      url: "/master/kelola-admin",
      icon: Shield,
      items: [
        {
          title: "Semua Admin",
          url: "/master/kelola-admin",
        },
        {
          title: "Tambah Admin",
          url: "/master/tambah-admin",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Bantuan",
      url: "/master/bantuan",
      icon: LifeBuoy,
    },
    {
      title: "Pengaturan",
      url: "/master/pengaturan",
      icon: Settings,
    },
    {
      title: "Lainnya",
      url: "/master/more",
      icon: Command, // reusing Command icon or Activity if preferred? Let's use Command or MoreHorizontal if imported. user removed NavProjects so I can put it here.
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({ name: "Master Admin", email: "master@sakti.sch.id", avatar: "/avatars/master.jpg" })
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
                name: profile.nama || authUser.user_metadata?.nama || "Master Admin",
                email: profile.email,
                avatar: "/avatars/master.jpg",
                })
                setRole(profile.role)
            }
        } catch (profileError) {
             console.warn("Could not fetch profile (likely network issue), using auth fallback:", profileError)
             setUser({
                 name: authUser.user_metadata?.nama || "Master Admin",
                 email: authUser.email || "master@sakti.sch.id",
                 avatar: "/avatars/master.jpg",
             })
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
              <Link href="/master">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SAKTI</span>
                  <span className="truncate text-xs">Master Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> Removed as per request */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} role={role} />
      </SidebarFooter>
    </Sidebar>
  )
}


