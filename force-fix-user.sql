-- ==========================================
-- SOLUSI PAMUNGKAS: PAKSA AKTIFKAN USER
-- ==========================================

-- 1. Hapus dulu data lama yang nyangkut (opsional, biar bersih)
-- DELETE FROM auth.users WHERE email = 'okedah@gmail.com';

-- 2. ATAU, JIKA INGIN MEMPERBAIKI USER YANG SUDAH ADA & GAGAL LOGIN:
-- (Ini akan mereset password menjadi 'password123' dan langsung mengaktifkan akun)

UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  encrypted_password = crypt('password123', gen_salt('bf')), -- Password jadi: password123
  raw_user_meta_data = '{"nis": "244455", "nama": "riyadhgntng", "kelas": "10 ipa 2"}'
WHERE email = 'okedah@gmail.com';

-- 3. Pastikan Profile Terbuat (Manual Insert/Update jika trigger gagal)
INSERT INTO public.profiles (id, email, role, nis, nama, kelas)
SELECT id, email, 'murid', '244455', 'riyadhgntng', '10 ipa 2'
FROM auth.users 
WHERE email = 'okedah@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET nis = EXCLUDED.nis, nama = EXCLUDED.nama, kelas = EXCLUDED.kelas;

-- SELESAI. SILAKAN LOGIN DENGAN:
-- Email: okedah@gmail.com
-- Pass: password123

