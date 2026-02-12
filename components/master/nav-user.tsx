"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"

export function NavUser({
  user,
  role,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  role?: string | null
}) {
  const { isMobile } = useSidebar()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  // Determine badge color and label based on role
  const getRoleBadge = () => {
    if (!role) return null // Show nothing while loading
    
    switch (role.toLowerCase()) {
      case "master":
        return { label: "Master", color: "bg-purple-600" }
      case "admin":
        return { label: "Admin", color: "bg-blue-600" }
      case "murid":
        return { label: "Murid", color: "bg-green-600" }
      default:
        return { label: role, color: "secondary" }
    }
  }

  const roleBadge = getRoleBadge()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {role === "master" ? "MA" : role === "admin" ? "AD" : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium">{user.name}</span>
                  {roleBadge && (
                    <Badge 
                      variant={roleBadge.color === "secondary" ? "secondary" : "default"} 
                      className={`text-[10px] px-1 py-0 h-4 ${roleBadge.color !== "secondary" ? roleBadge.color : ""}`}
                    >
                      {roleBadge.label}
                    </Badge>
                  )}
                </div>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {role === "master" ? "MA" : role === "admin" ? "AD" : "US"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="truncate font-medium">{user.name}</span>
                    {roleBadge && (
                      <Badge 
                        variant={roleBadge.color === "secondary" ? "secondary" : "default"} 
                        className={`text-[10px] px-1 py-0 h-4 ${roleBadge.color !== "secondary" ? roleBadge.color : ""}`}
                      >
                        {roleBadge.label}
                      </Badge>
                    )}
                  </div>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <BadgeCheck />
                Akun
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem>
                <Bell />
                Notifikasi
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

