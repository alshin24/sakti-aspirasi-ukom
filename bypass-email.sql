-- ==========================================
-- SCRIPT: BYPASS EMAIL CONFIRMATION
-- Jalankan script ini di Supabase SQL Editor
-- agar tidak perlu cek email saat testing.
-- ==========================================

-- 1. Buat trigger untuk otomatis confirm email setiap kali user sign up
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Pasang trigger ke tabel auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_email();

-- 3. (Opsional) Confirm semua user yang sudah ada (termasuk yang gagal login tadi)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 4. Pastikan RLS tidak memblokir update profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Selesai! Sekarang coba Signup dengan email baru, 
-- Anda akan langsung bisa Login tanpa cek inbox.
