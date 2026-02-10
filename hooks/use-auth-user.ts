"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export function useAuthUser() {
  const [user, setUser] = useState<{
    name: string
    email: string
    avatar: string
  } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return

      setUser({
        name: data.user.email?.split("@")[0] ?? "User",
        email: data.user.email ?? "",
        avatar: "/avatar.png",
      })
    })
  }, [])

  return user
}
