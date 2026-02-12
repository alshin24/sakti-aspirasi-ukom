-- ============================================
-- FIX: Allow Master role to update profiles
-- ============================================

-- This policy is required for the "promote to admin" and "demote to murid" features to work.
-- By default, users can only update their own profile. This policy allows masters to update any profile.

-- 1. Create the policy
CREATE POLICY "Master can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'master'
    )
  );

-- 2. Ensure RLS is enabled (it should be, but just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Verify it works
-- You can now use the Promote/Demote features in the Master Panel.
