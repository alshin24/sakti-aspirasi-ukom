# Kamus Data - SAKTI (Sarana Aspirasi Komunikasi Terpadu Intra-sekolah)

Dokumen ini berisi informasi teknis mengenai struktur basis data yang digunakan dalam sistem SAKTI.

---

## 1. Tabel: `profiles`
Menyimpan informasi profil pengguna (Murid, Admin, dan Master).

| Nama Kolom | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Berelasi dengan `auth.users` (Supabase) |
| `nis` | VARCHAR(50) | Nomor Induk Siswa | Unik (hanya untuk Murid) |
| `nama` | VARCHAR(255) | Nama Lengkap | |
| `kelas` | VARCHAR(50) | Kelas Siswa | Contoh: "12 RPL 1" |
| `email` | VARCHAR(255) | Alamat Email | Unik |
| `role` | ENUM | Peran Pengguna | Nilai: `murid`, `admin`, `master` |
| `created_at` | TIMESTAMPTZ | Waktu Pendaftaran | Default: `now()` |

---

## 2. Tabel: `aspirasi`
Menyimpan data aspirasi yang dikirimkan oleh murid.

| Nama Kolom | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Default: `uuid_generate_v4()` |
| `submitter_id` | UUID | ID Pengirim | Foreign Key ke `profiles.id` |
| `category` | ENUM | Kategori Aspirasi | Nilai: `fasilitas`, `akademik`, `ekstrakurikuler`, `lainnya` |
| `title` | VARCHAR(255) | Judul Aspirasi | |
| `content` | TEXT | Isi Aspirasi | Penjelasan detail |
| `location` | VARCHAR(255) | Lokasi Terkait | Opsional |
| `image_url` | TEXT | Link Foto | Opsional (Supabase Storage) |
| `status` | ENUM | Status Aspirasi | Nilai: `pending`, `approved`, `rejected` |
| `created_at` | TIMESTAMPTZ | Waktu Pengiriman | Default: `now()` |
| `updated_at` | TIMESTAMPTZ | Waktu Pembaruan | Diperbarui saat status berubah |

---

## 3. Tabel: `feedback`
Menyimpan tanggapan atau umpan balik dari admin terhadap aspirasi.

| Nama Kolom | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Default: `uuid_generate_v4()` |
| `aspirasi_id` | UUID | ID Aspirasi | Foreign Key ke `aspirasi.id` |
| `admin_id` | UUID | ID Admin | Foreign Key ke `profiles.id` |
| `content` | TEXT | Isi Tanggapan | |
| `created_at` | TIMESTAMPTZ | Waktu Tanggapan | Default: `now()` |

---

## 4. Tabel: `notifications`
Menyimpan notifikasi untuk pengguna.

| Nama Kolom | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Default: `uuid_generate_v4()` |
| `user_id` | UUID | ID Penerima | Foreign Key ke `profiles.id` |
| `title` | VARCHAR(255) | Judul Notifikasi | |
| `message` | TEXT | Isi Notifikasi | |
| `type` | VARCHAR(50) | Tipe Notifikasi | |
| `read` | BOOLEAN | Status Baca | Default: `false` |
| `created_at` | TIMESTAMPTZ | Waktu Notifikasi | Default: `now()` |
