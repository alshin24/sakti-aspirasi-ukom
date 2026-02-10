# ⚠️ Solusi Cepat Testing (Bypass Email & Rate Limit)

Saya mengerti frustrasi Anda karena testing terhalang rate limit dan email confirmation.

Saya telah membuat script SQL khusus untuk **BYPASS** semua hal tersebut agar Anda bisa tes aplikasi dengan lancar.

## Cara Menggunakan:

1.  Buka file `bypass-email.sql` yang baru saja saya buat di folder project Anda.
2.  Copy **SEMUA** isinya.
3.  Buka **Supabase Dashboard** -> **SQL Editor**.
4.  Paste dan klik **Run**.

## Apa yang akan terjadi?
*   **Auto-Confirm Email**: Setiap kali Anda signup user baru, emailnya akan langsung ter-verifikasi otomatis (tanpa perlu cek inbox).
*   **Fix Login Gagal**: User yang tadi gagal login karena "Email not confirmed" akan otomatis di-confirm juga.
*   **Bypass Rate Limit**: Karena Anda bisa membuat user baru dengan email sembarang (misal: `tes1@gmail.com`, `tes2@gmail.com`), Anda tidak perlu menunggu rate limit pada email lama.

Silakan jalankan script tersebut dan coba Signup lagi dengan email baru. Pasti lancar! 🚀
