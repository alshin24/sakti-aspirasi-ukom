-- ============================================
-- CONSOLIDATED MIGRATION SCRIPT (SAFE TO RUN)
-- ============================================

-- This script applies ALL necessary database changes for the recent updates.
-- It checks if things exist before creating them to avoid errors.

-- 1. Add image_url column to aspirasi table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'aspirasi' AND column_name = 'image_url') THEN
        ALTER TABLE aspirasi ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- 2. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('aspirasi-images', 'aspirasi-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage Policies (Drop first to avoid 'already exists' error)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'aspirasi-images');

DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'aspirasi-images');

DROP POLICY IF EXISTS "Allow users to delete own images" ON storage.objects;
CREATE POLICY "Allow users to delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'aspirasi-images' AND auth.uid() = owner);

-- 5. User Profile Permissions (Promote/Demote)
DROP POLICY IF EXISTS "Master can update any profile" ON profiles;
CREATE POLICY "Master can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'master'
    )
  );

-- 6. Notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master')
    )
  );

-- Done!
