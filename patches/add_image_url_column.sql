-- ============================================
-- FIX: Add missing image_url column to aspirasi table
-- ============================================

-- This script adds the 'image_url' column to the 'aspirasi' table.
-- This is required for the image upload feature to work.

ALTER TABLE aspirasi 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify it worked
-- You should see the column 'image_url' in the aspirasi table definition.
