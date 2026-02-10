-- ============================================
-- SAKTI Database Schema
-- Production-ready schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING OBJECTS (if re-running)
-- ============================================

-- Drop tables first (CASCADE will drop triggers and dependent objects)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS aspirasi CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop types
DROP TYPE IF EXISTS aspirasi_category CASCADE;
DROP TYPE IF EXISTS aspirasi_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ============================================
-- ENUMS
-- ============================================

-- Role enum
CREATE TYPE user_role AS ENUM ('murid', 'admin', 'master');

-- Aspirasi status enum
CREATE TYPE aspirasi_status AS ENUM ('pending', 'approved', 'rejected');

-- Aspirasi category enum
CREATE TYPE aspirasi_category AS ENUM ('fasilitas', 'akademik', 'ekstrakurikuler', 'lainnya');

-- ============================================
-- TABLES
-- ============================================

-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nis VARCHAR(50) UNIQUE,
  nama VARCHAR(255),
  kelas VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'murid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Aspirasi table
CREATE TABLE aspirasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category aspirasi_category NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  location VARCHAR(255),
  status aspirasi_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aspirasi_id UUID NOT NULL REFERENCES aspirasi(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_nis ON profiles(nis);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_aspirasi_submitter ON aspirasi(submitter_id);
CREATE INDEX idx_aspirasi_status ON aspirasi(status);
CREATE INDEX idx_aspirasi_created ON aspirasi(created_at DESC);
CREATE INDEX idx_feedback_aspirasi ON feedback(aspirasi_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at on aspirasi
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_aspirasi_updated_at
  BEFORE UPDATE ON aspirasi
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, nis, nama, kelas)
  VALUES (
    NEW.id, 
    NEW.email, 
    'murid',
    NEW.raw_user_meta_data->>'nis',
    NEW.raw_user_meta_data->>'nama',
    NEW.raw_user_meta_data->>'kelas'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- ============================================

-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE aspirasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Aspirasi policies
CREATE POLICY "Anyone can view aspirasi"
  ON aspirasi FOR SELECT
  USING (true);

CREATE POLICY "Murid can create own aspirasi"
  ON aspirasi FOR INSERT
  WITH CHECK (auth.uid() = submitter_id);

CREATE POLICY "Admins can update aspirasi"
  ON aspirasi FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master')
    )
  );

-- Feedback policies
CREATE POLICY "Anyone can view feedback"
  ON feedback FOR SELECT
  USING (true);

CREATE POLICY "Admins can create feedback"
  ON feedback FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master')
    )
  );

-- ============================================
-- SETUP INSTRUCTIONS
-- ============================================

-- 1. Copy this entire file
-- 2. Go to Supabase > SQL Editor
-- 3. Paste and run this script
-- 4. Verify tables created: profiles, aspirasi, feedback
-- 5. Test trigger: create auth user via signup
-- 6. Check profile auto-created with role = 'murid'
-- 7. To create admin/master:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
