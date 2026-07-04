import { useEffect, useState } from 'react';
import { supabase, App } from '@/lib/supabase';

export interface AnalyticsData {
  daily_downloads: Array<{ date: string; count: number }>;
  revenue_trend: Array<{ date: string; amount: number }>;
  top_apps: App[];
  user_retention: number;
  conversion_rate: number;
  avg_rating_trend: Array<{ date: string; rating: number }>;
}

export function useAnalytics(userId: string) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    try {
      const { data: apps } = await supabase
        .from('apps')
        .select('*')
        .eq('dev_id', userId)
        .order('downloads', { ascending: false })
        .limit(5);

      const mockDailyDownloads = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
        count: Math.floor(Math.random() * 100) + 10,
      }));

      const mockRevenueTrend = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
        amount: Math.floor(Math.random() * 500) + 50,
      }));

      const mockRatingTrend = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
        rating: parseFloat((Math.random() * 2 + 3.5).toFixed(1)),
      }));

      setData({
        daily_downloads: mockDailyDownloads,
        revenue_trend: mockRevenueTrend,
        top_apps: apps || [],
        user_retention: 0.78,
        conversion_rate: 0.045,
        avg_rating_trend: mockRatingTrend,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
}
