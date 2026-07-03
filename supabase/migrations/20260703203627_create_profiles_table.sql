/*
# Create profiles table for user roles

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, user email for convenience)
  - `role` (text, one of: DEVELOPER, BUYER, VIEWER)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

2. Security
- Enable RLS on `profiles`.
- Owner-scoped CRUD: each authenticated user can only access their own profile.
- INSERT policy uses DEFAULT auth.uid() so user_id is auto-filled.

3. Notes
- Role defaults to VIEWER for new users.
- Trigger ensures profile is created automatically on signup.
- Each user sees only their own profile row.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'VIEWER' CHECK (role IN ('DEVELOPER', 'BUYER', 'VIEWER')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger to create profile automatically on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'VIEWER');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();