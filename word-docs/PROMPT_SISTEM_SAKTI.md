# PROMPT MASTER: Spesifikasi Teknis Sistem SAKTI

Gunakan dokumen ini sebagai panduan utama atau instruksi prompt untuk membangun kembali, menjelaskan, atau mengembangkan sistem SAKTI (Sarana Aspirasi Komunikasi Terpadu Intra-sekolah).

---

## 1. Ringkasan Sistem
**SAKTI** adalah platform manajemen aspirasi sekolah berbasis web yang memungkinkan murid menyampaikan masukan, sementara pihak sekolah (Admin & Master) dapat meninjau dan menindaklanjuti masukan tersebut secara transparan.

**Stack Teknologi:**
- **Frontend:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage).
- **Icons:** Lucide React.
- **Charts:** Recharts.

---

## 2. Kamus Data (Database Schema)

### A. Tabel: `profiles`
Menyimpan identitas pengguna yang terintegrasi dengan `auth.users` Supabase.
- `id` (UUID, PK): Relasi ke `auth.users.id`.
- `nis` (VARCHAR, Unique): Nomor Induk Siswa.
- `nama` (VARCHAR): Nama lengkap pengguna.
- `kelas` (VARCHAR): Kelas (misal: 10 IPA 1).
- `email` (VARCHAR): Email aktif.
- `role` (ENUM): `murid`, `admin`, `master`.
- `created_at` (TIMESTAMPTZ): Waktu akun dibuat.

### B. Tabel: `aspirasi`
Menyimpan data aspirasi dari murid.
- `id` (UUID, PK): ID unik aspirasi.
- `submitter_id` (UUID, FK): Relasi ke `profiles.id`.
- `category` (ENUM): `fasilitas`, `akademik`, `ekstrakurikuler`, `lainnya`.
- `title` (VARCHAR): Judul pengaduan/aspirasi.
- `content` (TEXT): Detail aspirasi.
- `location` (VARCHAR): Lokasi fisik (opsional).
- `image_url` (TEXT): Link foto bukti (Supabase Storage).
- `status` (ENUM): `pending`, `approved`, `rejected`.
- `created_at` (TIMESTAMPTZ): Waktu kirim.
- `updated_at` (TIMESTAMPTZ): Waktu pembaruan status.

### C. Tabel: `feedback`
Tanggapan admin terhadap aspirasi.
- `id` (UUID, PK).
- `aspirasi_id` (UUID, FK): Relasi ke `aspirasi.id`.
- `admin_id` (UUID, FK): Relasi ke `profiles.id`.
- `content` (TEXT): Isi tanggapan.
- `created_at` (TIMESTAMPTZ).

### D. Tabel: `notifications`
- `id` (UUID, PK).
- `user_id` (UUID, FK): Penerima notifikasi.
- `title` (VARCHAR), `message` (TEXT).
- `type` (VARCHAR), `read` (BOOLEAN).

---

## 3. Alur Kerja Sistem (Flowchart)

### A. Alur Autentikasi & Redirect
1. **Landing Page (`/`)**: Menampilkan landing page publik.
2. **Login (`/login`)**:
   - Jika kredensial valid, sistem mengecek `role` di tabel `profiles`.
   - **Redirect:**
     - `role: master` -> `/master`
     - `role: admin` -> `/admin`
     - `role: murid` -> `/murid`
3. **Signup (`/signup`)**: Pendaftaran khusus murid. Menggunakan trigger database `handle_new_user` untuk otomatis membuat entry di tabel `profiles` setelah registasi `auth.users`.

### B. Alur Murid (Student Flow)
- **Kirim Aspirasi:** Memasukkan data -> Upload foto ke folder `aspirasi-images` di Storage -> Insert ke tabel `aspirasi` (status default: `pending`).
- **Monitoring:** Melihat daftar aspirasi pribadi dan statusnya.
- **Notifikasi:** Mendapatkan update saat Admin memberikan feedback atau merubah status.

### C. Alur Admin (Staff Flow)
- **Moderasi:** Melihat semua aspirasi yang masuk.
- **Validasi:** Mengubah status menjadi `approved` atau `rejected` dan wajib memberikan `feedback`.
- **Statistik:** Melihat ringkasan harian (aspirasi masuk, selesai, pending).
- **Ekspor:** Mengunduh data aspirasi dalam format CSV/Excel.

### D. Alur Master (Super Admin Flow)
- **User Management:**
  - `Promote` murid menjadi admin.
  - `Demote` admin kembali menjadi murid.
  - Tambah akun admin baru secara langsung.
- **System Stats:** Melihat data pertumbuhan pengguna dan total aktivitas sistem secara global.

---

## 4. Keamanan & Aturan Bisnis (RLS)
Sistem menggunakan **Row Level Security (RLS)** di Supabase:
- `profiles`: Semua pengguna dapat melihat profil untuk relasi nama, tapi hanya pemilik (atau Master) yang bisa mengubah.
- `aspirasi`: Semua user yang terautentikasi bisa melihat (SELECT), tapi hanya Murid yang bisa INSERT datanya sendiri, dan hanya Admin/Master yang bisa UPDATE status.
- `feedback`: Semua bisa melihat, hanya Admin/Master yang bisa INSERT.

---
*Dokumen ini disusun untuk memberikan gambaran arsitektur lengkap sistem SAKTI.*
