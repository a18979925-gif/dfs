/*
# Create marketplace and platform tables

1. New Tables
- `projects` - Developer projects (mini Git-like file management)
  - `id` (uuid, primary key)
  - `owner_id` (uuid, references profiles)
  - `name` (text)
  - `description` (text)
  - `status` (text: draft, published, archived)
  - `files` (jsonb, file tree structure)
  - `created_at`, `updated_at` (timestamps)

- `apps` - Published applications in marketplace
  - `id` (uuid, primary key)
  - `project_id` (uuid, references projects)
  - `dev_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `price` (decimal)
  - `price_type` (text: one_time, subscription)
  - `tags` (text array)
  - `preview_url` (text)
  - `screenshots` (text array)
  - `rating` (decimal, default 0)
  - `downloads` (integer, default 0)
  - `status` (text: active, suspended)
  - `created_at`, `updated_at` (timestamps)

- `licenses` - User licenses for purchased apps
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `app_id` (uuid, references apps)
  - `type` (text: personal, commercial)
  - `purchased_at` (timestamp)
  - `expires_at` (timestamp, nullable)
  - `price_paid` (decimal)

- `chats` - Chat conversations
  - `id` (uuid, primary key)
  - `participants` (uuid array)
  - `app_id` (uuid, nullable, references apps)
  - `created_at`, `updated_at` (timestamps)

- `messages` - Chat messages
  - `id` (uuid, primary key)
  - `chat_id` (uuid, references chats)
  - `sender_id` (uuid, references profiles)
  - `content` (text)
  - `type` (text: text, file, system)
  - `created_at` (timestamp)

- `notifications` - User notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `type` (text: chat, purchase, system)
  - `title` (text)
  - `message` (text)
  - `read` (boolean, default false)
  - `created_at` (timestamp)

- `analytics_events` - Platform analytics
  - `id` (uuid, primary key)
  - `event_type` (text)
  - `user_id` (uuid, nullable)
  - `app_id` (uuid, nullable)
  - `metadata` (jsonb)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables
- Owner-scoped policies for projects, licenses
- Developer-scoped for apps (can only manage own apps)
- Participant-scoped for chats and messages
- User-scoped for notifications

3. Indexes
- apps tags for search
- messages chat_id for conversation queries
- notifications user_id for quick lookup
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  files jsonb DEFAULT '{}',
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  dev_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price decimal(10, 2) DEFAULT 0,
  price_type text NOT NULL DEFAULT 'one_time' CHECK (price_type IN ('one_time', 'subscription')),
  tags text[] DEFAULT '{}',
  preview_url text,
  screenshots text[] DEFAULT '{}',
  rating decimal(2, 1) DEFAULT 0,
  downloads integer DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- Everyone can view active apps
DROP POLICY IF EXISTS "select_active_apps" ON apps;
CREATE POLICY "select_active_apps" ON apps FOR SELECT
  TO authenticated, anon USING (status = 'active');

-- Developers can see their own apps regardless of status
DROP POLICY IF EXISTS "select_own_apps" ON apps;
CREATE POLICY "select_own_apps" ON apps FOR SELECT
  TO authenticated USING (auth.uid() = dev_id);

-- Developers can insert apps
DROP POLICY IF EXISTS "insert_own_apps" ON apps;
CREATE POLICY "insert_own_apps" ON apps FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = dev_id);

-- Developers can update their own apps
DROP POLICY IF EXISTS "update_own_apps" ON apps;
CREATE POLICY "update_own_apps" ON apps FOR UPDATE
  TO authenticated USING (auth.uid() = dev_id) WITH CHECK (auth.uid() = dev_id);

-- Only dev can delete their apps
DROP POLICY IF EXISTS "delete_own_apps" ON apps;
CREATE POLICY "delete_own_apps" ON apps FOR DELETE
  TO authenticated USING (auth.uid() = dev_id);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'personal' CHECK (type IN ('personal', 'commercial')),
  purchased_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  price_paid decimal(10, 2) DEFAULT 0,
  UNIQUE(user_id, app_id)
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_licenses" ON licenses;
CREATE POLICY "select_own_licenses" ON licenses FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM apps WHERE apps.id = licenses.app_id AND apps.dev_id = auth.uid()
  ));

DROP POLICY IF EXISTS "insert_own_licenses" ON licenses;
CREATE POLICY "insert_own_licenses" ON licenses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participants uuid[] NOT NULL,
  app_id uuid REFERENCES apps(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_participant_chats" ON chats;
CREATE POLICY "select_participant_chats" ON chats FOR SELECT
  TO authenticated USING (auth.uid() = ANY(participants));

DROP POLICY IF EXISTS "insert_participant_chats" ON chats;
CREATE POLICY "insert_participant_chats" ON chats FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = ANY(participants));

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'file', 'system')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_chat_messages" ON messages;
CREATE POLICY "select_chat_messages" ON messages FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND auth.uid() = ANY(chats.participants)
  ));

DROP POLICY IF EXISTS "insert_chat_messages" ON messages;
CREATE POLICY "insert_chat_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND auth.uid() = ANY(chats.participants)
  ));

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('chat', 'purchase', 'system', 'app_update')),
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  app_id uuid REFERENCES apps(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_analytics_events" ON analytics_events;
CREATE POLICY "insert_analytics_events" ON analytics_events FOR INSERT
  TO authenticated WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "select_analytics_events" ON analytics_events;
CREATE POLICY "select_analytics_events" ON analytics_events FOR SELECT
  TO authenticated USING (
    app_id IS NULL OR EXISTS (
      SELECT 1 FROM apps WHERE apps.id = analytics_events.app_id AND apps.dev_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_apps_tags ON apps USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_participants ON chats USING gin(participants);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_dev_id ON apps(dev_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);