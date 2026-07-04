// Extended types for all features

export interface AppWithMetadata {
  id: string;
  title: string;
  description: string | null;
  price: number;
  price_type: 'one_time' | 'subscription';
  rating: number;
  downloads: number;
  tags: string[];
  status: 'active' | 'suspended' | 'pending';
  dev_id: string;
  created_at: string;
  dev?: {
    email: string;
  };
}

export interface FilterState {
  priceRange: [number, number];
  rating: number;
  categories: string[];
  sortBy: 'rating' | 'price' | 'downloads' | 'newest';
}

export interface AnalyticsMetrics {
  daily_downloads: Array<{ date: string; count: number }>;
  revenue_trend: Array<{ date: string; amount: number }>;
  avg_rating_trend: Array<{ date: string; rating: number }>;
  user_retention: number;
  conversion_rate: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'developer' | 'designer';
  avatar?: string;
  email: string;
}

export interface DownloadRecord {
  id: string;
  appTitle: string;
  date: string;
  version: string;
  status: 'completed' | 'in_progress' | 'failed';
  size: string;
}

export interface SubscriptionRecord {
  id: string;
  appTitle: string;
  price: number;
  renewalDate: string;
  status: 'active' | 'expiring_soon' | 'cancelled';
}

export interface UserReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  date: string;
  verified: boolean;
}
