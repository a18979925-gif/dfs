import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Role = 'DEVELOPER' | 'BUYER' | 'VIEWER';

export interface Profile {
  id: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  files: Record<string, unknown>;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface App {
  id: string;
  project_id: string | null;
  dev_id: string;
  title: string;
  description: string | null;
  price: number;
  price_type: 'one_time' | 'subscription';
  tags: string[];
  preview_url: string | null;
  screenshots: string[];
  rating: number;
  downloads: number;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
  updated_at: string;
  dev?: Profile;
}

export interface License {
  id: string;
  user_id: string;
  app_id: string;
  type: 'personal' | 'commercial';
  purchased_at: string;
  expires_at: string | null;
  price_paid: number;
  app?: App;
}

export interface Chat {
  id: string;
  participants: string[];
  app_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'file' | 'system';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'chat' | 'purchase' | 'system' | 'app_update';
  title: string;
  message: string | null;
  read: boolean;
  data: Record<string, unknown>;
  created_at: string;
}
