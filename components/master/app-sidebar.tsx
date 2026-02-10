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

const data = {
  user: {
    name: "Master Admin",
    email: "master@sakti.sch.id",
    avatar: "/avatars/master.jpg",
  },
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
      ],
    },
    {
      title: "Manajemen Sekolah",
      url: "/master/shcools",
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
      ],
    },
  ],
  navSecondary: [
    {
      title: "System Logs",
      url: "/master/logs",
      icon: Activity,
    },
    {
      title: "Pengaturan Global",
      url: "/master/settings",
      icon: Settings,
    },
  ],
  projects: [
    {
      name: "Database Health",
      url: "/master/system/database",
      icon: Database,
    },
    {
      name: "Pengguna Aktif",
      url: "/master/users/active",
      icon: Users,
    },
    {
      name: "Server Status",
      url: "/master/system/servers",
      icon: Server,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
