# Flowchart dan Alur Sistem - SAKTI

Dokumen ini menjelaskan alur kerja sistem SAKTI untuk tiga peran utama: Murid, Admin, dan Master.

---

## 1. Alur Pengguna (Flowchart)

Anda dapat menyalin kode Mermaid di bawah ini ke [Mermaid Live Editor](https://mermaid.live/) untuk menghasilkan gambar flowchart yang profesional.

```mermaid
graph TD
    A[Mulai] --> B{Sudah Login?}
    B -- Belum --> C[Halaman Login / Signup]
    C --> D[Verifikasi Kredensial]
    D --> B
    
    B -- Sudah --> E{Peran User?}
    
    %% Alur Murid
    E -- Murid --> F[Dashboard Murid]
    F --> F1[Kirim Aspirasi Baru]
    F --> F2[Lihat Status Aspirasi Saya]
    F --> F3[Lihat Notifikasi]
    F1 --> F1a[Isi Form & Upload Foto]
    F1a --> F1b[Simpan ke Database - Status: Pending]
    
    %% Alur Admin
    E -- Admin --> G[Dashboard Admin]
    G --> G1[Laporan Aspirasi Masuk]
    G --> G2[Pilih Aspirasi 'Pending']
    G2 --> G3{Keputusan Admin}
    G3 -- Setuju --> G3a[Ubah Status: Approved]
    G3 -- Tolak --> G3b[Ubah Status: Rejected]
    G3a --> G4[Beri Feedback/Tanggapan]
    G3b --> G4
    G4 --> G5[Kirim Notifikasi ke Murid]
    
    %% Alur Master
    E -- Master --> H[Dashboard Master]
    H --> H1[Lihat Statistik Global]
    H --> H2[Kelola Akun Admin]
    H2 --> H2a[Tambah Admin Baru]
    H2 --> H2b[Hapus/Promosi Admin]
    H --> H3[Manajemen Data Sekolah]
    
    F1b --> Z[Selesai]
    G5 --> Z
    H3 --> Z
```

---

## 2. Deskripsi Alur Kerja

### A. Alur Murid (Student Flow)
1. **Registrasi**: Murid mendaftar menggunakan NIS, Nama, email, dan password.
2. **Dashboard**: Menampilkan ringkasan jumlah aspirasi yang telah dikirim.
3. **Kirim Aspirasi**: Murid mengisi kategori (Fasilitas, Akademik, dll), judul, isi, lokasi, dan opsional foto.
4. **Tracking**: Murid dapat memantau apakah aspirasi mereka masih diproses (Pending), diterima (Approved), atau ditolak (Rejected).

### B. Alur Admin (Admin Flow)
1. **Verifikasi**: Admin meninjau aspirasi yang masuk dari murid.
2. **Manajemen Status**: Admin mengubah status aspirasi sesuai kebijakan sekolah.
3. **Feedback**: Admin memberikan penjelasan mengapa suatu aspirasi disetujui atau ditolak agar murid mendapatkan informasi yang jelas.

### C. Alur Master (Master Flow)
1. **Supervisi**: Memantau seluruh aktivitas sistem melalui dashboard statistik.
2. **Kontrol Akses**: Memiliki wewenang untuk menambahkan atau merubah peran pengguna lain menjadi Admin.
3. **Data Master**: Mengelola data dasar yang dibutuhkan oleh sistem.
