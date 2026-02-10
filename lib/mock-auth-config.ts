// Set this to true to enable mock mode
export const IS_MOCK_MODE = false

export const MOCK_USER = {
    id: "mock-user-123",
    email: "mock@sekolah.sch.id",
    role: "murid",
    user_metadata: {
        nis: "123456",
        nama: "Murid Mock",
        kelas: "12 IPA 1",
    },
}

export const MOCK_ADMIN = {
    id: "mock-admin-123",
    email: "admin@sekolah.sch.id",
    role: "admin",
    user_metadata: {
        nama: "Admin Mock",
    },
}

export const MOCK_STATS = {
    total: 125,
    pending: 12,
    approved: 89,
    rejected: 24,
    approvedToday: 5
}

export const MOCK_ASPIRASI_LIST = [
    {
        id: "mock-asp-1",
        title: "[MOCK] AC Ruang Kelas Rusak",
        category: "fasilitas",
        status: "pending",
        created_at: new Date().toISOString(),
        submitter: { nama: "Budi Santoso", nis: "12345", email: "budi@mock.com" }
    },
    {
        id: "mock-asp-2",
        title: "[MOCK] Request Ekskul E-Sport",
        category: "ekstrakurikuler",
        status: "approved",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        submitter: { nama: "Siti Aminah", nis: "67890", email: "siti@mock.com" }
    },
    {
        id: "mock-asp-3",
        title: "[MOCK] Toilet Lantai 2 Kotor",
        category: "fasilitas",
        status: "rejected",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        submitter: { nama: "Rudi Hartono", nis: "11223", email: "rudi@mock.com" }
    }
]
