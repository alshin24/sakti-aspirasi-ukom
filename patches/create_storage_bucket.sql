-- ============================================
-- FIX: Create Storage Bucket for Aspirasi Images
-- ============================================

-- This script creates the required 'aspirasi-images' storage bucket and sets up access policies.

-- 1. Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('aspirasi-images', 'aspirasi-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (usually enabled by default, but good to ensure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow authenticated users (Murid) to upload images
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'aspirasi-images');

-- 4. Policy: Allow public to view/download images
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'aspirasi-images');

-- 5. Policy: Allow Users to delete their own images (Optional but recommended)
DROP POLICY IF EXISTS "Allow users to delete own images" ON storage.objects;
CREATE POLICY "Allow users to delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'aspirasi-images' AND auth.uid() = owner);

-- After running this script, try uploading an image again.
