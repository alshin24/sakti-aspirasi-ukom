"use client"

import Link from "next/link"
import * as React from "react"
import {
  LayoutDashboard,
  MessageSquarePlus,
  MessageSquare,
  Bell,
  Settings,
  LifeBuoy,
  Send,
  BookOpen,
  Clock,
  CheckCircle2,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/student/nav-main"
import { NavProjects } from "@/components/student/nav-projects"
import { NavSecondary } from "@/components/student/nav-secondary"
import { supabase } from "@/lib/supabase/client"
import { NavUser } from "@/components/student/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/murid",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Beranda",
          url: "/murid",
        },
        {
          title: "Profil Saya",
          url: "/murid/profil",
        },
      ],
    },
    {
      title: "Ajukan Aspirasi",
      url: "/murid/kirim-aspirasi",
      icon: MessageSquarePlus,
      items: [
        {
          title: "Aspirasi Baru",
          url: "/murid/kirim-aspirasi",
        },
      ],
    },
    {
      title: "Aspirasi Saya",
      url: "/murid/aspirasi-saya",
      icon: MessageSquare,
      items: [
        {
          title: "Semua",
          url: "/murid/aspirasi-saya",
        },
      ],
    },
    {
      title: "Notifikasi",
      url: "/murid/notifications",
      icon: Bell,
      items: [
        {
          title: "Semua Notifikasi",
          url: "/murid/notifications",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Panduan",
      url: "/murid/help",
      icon: BookOpen,
    },
    {
      title: "Pengaturan",
      url: "/murid/settings",
      icon: Settings,
    },
  ],
  projects: [
    {
      title: "Disetujui", // Changed form name to title to match interface if needed, or keep name
      name: "Disetujui",
      url: "/murid/aspirasi-saya", // Redirect to list for now
      icon: CheckCircle2,
    },
    {
        name: "Bantuan",
        url: "/murid/help",
        icon: LifeBuoy,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState("")

  React.useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setEmail(user.email ?? "")

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setRole(profile?.role ?? "")
    }

    loadUser()
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/murid">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SAKTI</span>
                  <span className="truncate text-xs">Murid Panel</span>
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
        <NavUser email={email} role={role} />
      </SidebarFooter>
    </Sidebar>
  )
}
