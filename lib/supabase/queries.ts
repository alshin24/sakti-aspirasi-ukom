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
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (error) throw error
    return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
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
    const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })

    if (error) throw error
    return count || 0
}

export async function getTotalAdmins() {
    const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .in("role", ["admin", "master"])

    if (error) throw error
    return count || 0
}

export async function getAllAdmins() {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["admin", "master"])
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Profile[]
}

export async function getAllProfiles() {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Profile[]
}

export async function promoteToAdmin(userId: string) {
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
    const { data, error } = await supabase
        .from("aspirasi")
        .select("*")
        .eq("submitter_id", userId)
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Aspirasi[]
}

export async function getGlobalStats() {
    const { count: total } = await supabase
        .from("aspirasi")
        .select("*", { count: "exact", head: true })

    const { count: pending } = await supabase
        .from("aspirasi")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

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
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from("aspirasi")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true })

    if (error) throw error

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
    const { data, error } = await supabase
        .from("aspirasi")
        .insert(aspirasi)
        .select()
        .single()

    if (error) throw error
    return data as Aspirasi
}

export async function updateAspirasiStatus(id: string, status: AspirasiStatus) {
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
    const { data, error } = await supabase
        .from("feedback")
        .insert(feedback)
        .select()
        .single()

    if (error) throw error
    return data as Feedback
}

// ============================================
// ADMIN ACCOUNT CREATION
// ============================================

export async function createAdminAccount(adminData: {
    email: string
    password: string
    nama: string
}) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
            data: {
                nama: adminData.nama,
            },
        },
    })

    if (authError || !authData.user) {
        throw new Error(authError?.message || "Gagal membuat akun admin")
    }

    // Update profile role to admin
    const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", authData.user.id)
        .select()
        .single()

    if (profileError) {
        throw new Error("Gagal mengupdate role admin")
    }

    return profileData as Profile
}

// ============================================
// STATISTICS QUERIES
// ============================================

export async function getDailyStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    // 1. Total Aspirasi Masuk Hari Ini
    const { count: aspirasiCreatedToday, error: errCreated } = await supabase
        .from("aspirasi")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO)

    if (errCreated) throw errCreated

    // 2. Aspirasi Diselesaikan Hari Ini (Approved or Rejected)
    const { count: aspirasiResolvedToday, error: errResolved } = await supabase
        .from("aspirasi")
        .select("*", { count: "exact", head: true })
        .in("status", ["approved", "rejected"])
        .gte("updated_at", todayISO)

    if (errResolved) throw errResolved

    // 3. Menunggu Verifikasi (Total Pending currently)
    const { count: aspirasiPending, error: errPending } = await supabase
        .from("aspirasi")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

    if (errPending) throw errPending

    // 4. Pengguna Baru Hari Ini
    const { count: usersCreatedToday, error: errUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO)

    if (errUsers) throw errUsers

    return {
        aspirasiCreatedToday: aspirasiCreatedToday || 0,
        aspirasiResolvedToday: aspirasiResolvedToday || 0,
        aspirasiPending: aspirasiPending || 0,
        usersCreatedToday: usersCreatedToday || 0
    }
}

export async function getWeeklyActivityStats(days = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1) // +1 to include today and go back 6 days
    startDate.setHours(0, 0, 0, 0)
    const startDateISO = startDate.toISOString()

    // Incoming
    const { data: incomingData, error: incomingError } = await supabase
        .from("aspirasi")
        .select("created_at")
        .gte("created_at", startDateISO)

    if (incomingError) throw incomingError

    // Resolved (approved or rejected)
    const { data: resolvedData, error: resolvedError } = await supabase
        .from("aspirasi")
        .select("updated_at")
        .in("status", ["approved", "rejected"])
        .gte("updated_at", startDateISO)

    if (resolvedError) throw resolvedError

    // Group by date
    const statsMap = new Map<string, { incoming: number; resolved: number }>()

    // Initialize all days
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        const dateKey = d.toISOString().split('T')[0]
        statsMap.set(dateKey, { incoming: 0, resolved: 0 })
    }

    incomingData.forEach(item => {
        const dateKey = new Date(item.created_at).toISOString().split('T')[0]
        if (statsMap.has(dateKey)) {
            const current = statsMap.get(dateKey)!
            current.incoming += 1
        }
    })

    resolvedData.forEach(item => {
        const dateKey = new Date(item.updated_at).toISOString().split('T')[0]
        if (statsMap.has(dateKey)) {
            const current = statsMap.get(dateKey)!
            current.resolved += 1
        }
    })

    // Convert to array and format for Chart
    // Chart expects: { name: "Senin", aspirasi: 4, selesai: 2 }
    const result = Array.from(statsMap.entries()).map(([dateStr, counts]) => {
        const date = new Date(dateStr)
        const name = date.toLocaleDateString("id-ID", { weekday: 'long' })
        return {
            name,
            originalDate: dateStr, // keep for debugging or sorting if needed
            aspirasi: counts.incoming,
            selesai: counts.resolved
        }
    })

    return result
}
