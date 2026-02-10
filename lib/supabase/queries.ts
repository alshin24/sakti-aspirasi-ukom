import { supabase } from "./client"

// ============================================
// TYPES
// ============================================

export type UserRole = "murid" | "admin" | "master"
export type AspirasiStatus = "pending" | "approved" | "rejected"
export type AspirasiCategory = "fasilitas" | "akademik" | "ekstrakurikuler" | "lainnya"

export interface Profile {
    id: string
    nis: string | null
    nama: string | null
    kelas: string | null
    email: string
    role: UserRole
    created_at: string
}

export interface Aspirasi {
    id: string
    submitter_id: string
    category: AspirasiCategory
    title: string
    content: string
    location: string | null
    status: AspirasiStatus
    created_at: string
    updated_at: string
    submitter?: {
        nama: string | null
        nis: string | null
        email: string
    }
}

export interface Feedback {
    id: string
    aspirasi_id: string
    admin_id: string
    content: string
    created_at: string
    admin?: {
        nama: string | null
        email: string
    }
}

// ============================================
// PROFILE QUERIES
// ============================================

export async function getProfileById(userId: string) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_USER, MOCK_ADMIN } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        if (userId === MOCK_USER.id) return MOCK_USER as unknown as Profile
        if (userId === MOCK_ADMIN.id) return MOCK_ADMIN as unknown as Profile
        // Default fallback for testing
        return MOCK_USER as unknown as Profile
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (error) throw error
    return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_USER } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return {
            ...MOCK_USER,
            ...updates
        } as unknown as Profile
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single()

    if (error) throw error
    return data as Profile
}

export async function getTotalUsers() {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_STATS } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        return 156 // Mock total users
    }
    // --- MOCK MODE END ---

    const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })

    if (error) throw error
    return count || 0
}

export async function getTotalAdmins() {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        return 12 // Mock total admins
    }
    // --- MOCK MODE END ---

    const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .in("role", ["admin", "master"])

    if (error) throw error
    return count || 0
}

export async function getAllAdmins() {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_ADMIN } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        // Return a list containing the mock admin
        return [
            {
                id: MOCK_ADMIN.id,
                email: MOCK_ADMIN.email,
                role: MOCK_ADMIN.role,
                nama: MOCK_ADMIN.user_metadata.nama,
                created_at: new Date().toISOString()
            }
        ] as Profile[]
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["admin", "master"])
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Profile[]
}

export async function promoteToAdmin(userId: string) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_USER } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return {
            ...MOCK_USER,
            role: "admin"
        } as unknown as Profile
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", userId)
        .select()
        .single()

    if (error) throw error
    return data as Profile
}

export async function demoteToMurid(userId: string) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_ADMIN } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return {
            ...MOCK_ADMIN,
            role: "murid"
        } as unknown as Profile
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("profiles")
        .update({ role: "murid" })
        .eq("id", userId)
        .select()
        .single()

    if (error) throw error
    return data as Profile
}

// ============================================
// ASPIRASI QUERIES
// ============================================

export async function getMuridStats(userId: string) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_STATS } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        let total = 15
        let pending = 2

        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mock_aspirasi_list")
            if (stored) {
                const list = JSON.parse(stored)
                total += list.length
                pending += list.filter((a: any) => a.status === "pending").length
            }
        }

        return {
            total,
            pending,
            approved: 10,
            rejected: 3
        }
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("aspirasi")
        .select("status")
        .eq("submitter_id", userId)

    if (error) throw error

    const stats = {
        total: data.length,
        pending: data.filter((a) => a.status === "pending").length,
        approved: data.filter((a) => a.status === "approved").length,
        rejected: data.filter((a) => a.status === "rejected").length,
    }

    return stats
}

export async function getMuridRecentAspirasi(userId: string, limit = 5) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_ASPIRASI_LIST } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mock_aspirasi_list")
            const localList = stored ? JSON.parse(stored) : []
            // Merge with static mock list
            return [...localList, ...MOCK_ASPIRASI_LIST] as any[]
        }
        return MOCK_ASPIRASI_LIST as any[]
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("aspirasi")
        .select("*")
        .eq("submitter_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

    if (error) throw error
    return data as Aspirasi[]
}

export async function getMuridAspirasi(userId: string) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_ASPIRASI_LIST } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mock_aspirasi_list")
            const localList = stored ? JSON.parse(stored) : []
            // Merge with static mock list
            return [...localList, ...MOCK_ASPIRASI_LIST] as any[]
        }
        return MOCK_ASPIRASI_LIST as any[]
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("aspirasi")
        .select("*")
        .eq("submitter_id", userId)
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Aspirasi[]
}

export async function getGlobalStats() {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_STATS } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        return {
            total: MOCK_STATS.total,
            pending: MOCK_STATS.pending,
            approvedToday: MOCK_STATS.approvedToday
        }
    }
    // --- MOCK MODE END ---

    // Total aspirasi
    const { count: total } = await supabase
        .from("aspirasi")
        .select("*", { count: "exact", head: true })

    // Pending count
    const { count: pending } = await supabase
        .from("aspirasi")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

    // Approved today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: approvedToday } = await supabase
        .from("aspirasi")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .gte("updated_at", today.toISOString())

    return {
        total: total || 0,
        pending: pending || 0,
        approvedToday: approvedToday || 0,
    }
}

export async function getLatestAspirasi(limit = 5) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_ASPIRASI_LIST } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        // cast to any or correct type
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mock_aspirasi_list")
            const localList = stored ? JSON.parse(stored) : []
            return [...localList, ...MOCK_ASPIRASI_LIST] as any[]
        }
        return MOCK_ASPIRASI_LIST as any[]
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("aspirasi")
        .select(`
      *,
      submitter:profiles!submitter_id(nama, nis, email)
    `)
        .order("created_at", { ascending: false })
        .limit(limit)

    if (error) throw error
    return data as Aspirasi[]
}

export async function getAspirasiByStatus() {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_STATS } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        return {
            pending: MOCK_STATS.pending,
            approved: MOCK_STATS.approved,
            rejected: MOCK_STATS.rejected
        }
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("aspirasi")
        .select("status")

    if (error) throw error

    const counts = {
        pending: data.filter((a) => a.status === "pending").length,
        approved: data.filter((a) => a.status === "approved").length,
        rejected: data.filter((a) => a.status === "rejected").length,
    }

    return counts
}

export async function getAspirasiPerDay(days = 7) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        // Return dummy implementation
        const dummy: { date: string, count: number }[] = []
        for (let i = 0; i < 7; i++) {
            dummy.push({
                date: new Date(Date.now() - i * 86400000).toLocaleDateString("id-ID"),
                count: Math.floor(Math.random() * 10)
            })
        }
        return dummy.reverse()
    }
    // --- MOCK MODE END ---

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from("aspirasi")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true })

    if (error) throw error

    // Group by day
    const dailyCounts: Record<string, number> = {}
    data.forEach((item) => {
        const date = new Date(item.created_at).toLocaleDateString("id-ID")
        dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    return Object.entries(dailyCounts).map(([date, count]) => ({
        date,
        count,
    }))
}

export async function getAllAspirasi() {
    const { data, error } = await supabase
        .from("aspirasi")
        .select(`
      *,
      submitter:profiles!submitter_id(nama, nis, email)
    `)
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Aspirasi[]
}

export async function getAspirasiById(id: string) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_ASPIRASI_LIST } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        // Check localStorage first
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mock_aspirasi_list")
            const localList = stored ? JSON.parse(stored) : []
            const localItem = localList.find((a: any) => a.id === id)
            if (localItem) return localItem
        }

        const mockItem = MOCK_ASPIRASI_LIST.find(a => a.id === id)
        if (mockItem) return mockItem as any

        // Fallback for newly created mock items that aren't in the list
        if (id.startsWith("mock-")) {
            return {
                id,
                title: "[MOCK] Detail Aspirasi",
                category: "fasilitas",
                content: "Ini adalah konten dummy untuk aspirasi mock yang tidak ada di list statis.",
                location: "Lokasi Mock",
                status: "pending",
                created_at: new Date().toISOString(),
                submitter: {
                    nama: "User Mock",
                    email: "mock@example.com",
                    nis: "12345"
                }
            } as any
        }
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("aspirasi")
        .select(`
      *,
      submitter:profiles!submitter_id(nama, nis, email)
    `)
        .eq("id", id)
        .single()

    if (error) throw error
    return data as Aspirasi
}

export async function submitAspirasi(aspirasi: {
    submitter_id: string
    category: AspirasiCategory
    title: string
    content: string
    location?: string
}) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_USER } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        // Simulasi network delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const newAspirasi = {
            id: `mock-asp-new-${Date.now()}`,
            submitter_id: aspirasi.submitter_id,
            category: aspirasi.category,
            title: aspirasi.title,
            content: aspirasi.content,
            location: aspirasi.location || null,
            status: "pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            submitter: {
                nama: MOCK_USER.user_metadata.nama,
                nis: MOCK_USER.user_metadata.nis,
                email: MOCK_USER.email
            }
        } as Aspirasi

        // Save to localStorage
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mock_aspirasi_list")
            const list = stored ? JSON.parse(stored) : []
            list.unshift(newAspirasi) // Add to beginning
            localStorage.setItem("mock_aspirasi_list", JSON.stringify(list))
        }

        return newAspirasi
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("aspirasi")
        .insert(aspirasi)
        .select()
        .single()

    if (error) throw error
    return data as Aspirasi
}

export async function updateAspirasiStatus(id: string, status: AspirasiStatus) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return {
            id,
            status,
            updated_at: new Date().toISOString()
        } as any
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("aspirasi")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data as Aspirasi
}

// ============================================
// FEEDBACK QUERIES
// ============================================

export async function getFeedbackByAspirasiId(aspirasiId: string) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_ADMIN } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        // Return kosong or dummy feedback
        return [
            {
                id: "mock-fb-1",
                aspirasi_id: aspirasiId,
                admin_id: MOCK_ADMIN.id,
                content: "[MOCK] Terima kasih aspirasinya, akan kami tinjau.",
                created_at: new Date().toISOString(),
                admin: {
                    nama: MOCK_ADMIN.user_metadata.nama,
                    email: MOCK_ADMIN.email
                }
            }
        ] as Feedback[]
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("feedback")
        .select(`
      *,
      admin:profiles!admin_id(nama, email)
    `)
        .eq("aspirasi_id", aspirasiId)
        .order("created_at", { ascending: true })

    if (error) throw error
    return data as Feedback[]
}

export async function addFeedback(feedback: {
    aspirasi_id: string
    admin_id: string
    content: string
}) {
    // --- MOCK MODE START ---
    const { IS_MOCK_MODE, MOCK_ADMIN } = await import("../mock-auth-config")
    if (IS_MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return {
            id: `mock-feedback-${Date.now()}`,
            aspirasi_id: feedback.aspirasi_id,
            admin_id: feedback.admin_id,
            content: feedback.content,
            created_at: new Date().toISOString(),
            admin: {
                nama: MOCK_ADMIN.user_metadata.nama,
                email: MOCK_ADMIN.email
            }
        } as Feedback
    }
    // --- MOCK MODE END ---

    const { data, error } = await supabase
        .from("feedback")
        .insert(feedback)
        .select()
        .single()

    if (error) throw error
    return data as Feedback
}
