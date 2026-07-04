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
      // 1. Get developer's apps
      const { data: apps } = await supabase
        .from('apps')
        .select('*')
        .eq('dev_id', userId)
        .order('downloads', { ascending: false });

      const appIds = apps?.map((a) => a.id) || [];
      
      // If dev has no apps, set empty but structure-valid analytics
      if (appIds.length === 0) {
        setData({
          daily_downloads: [],
          revenue_trend: [],
          top_apps: [],
          user_retention: 0,
          conversion_rate: 0,
          avg_rating_trend: [],
        });
        setLoading(false);
        return;
      }

      // 2. Fetch analytics events for the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .in('app_id', appIds)
        .gte('created_at', thirtyDaysAgo);

      // 3. Fetch purchase licenses for revenue calculation
      const { data: licenses } = await supabase
        .from('licenses')
        .select('*')
        .in('app_id', appIds)
        .gte('purchased_at', thirtyDaysAgo);

      // 4. Generate last 30 days array
      const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toLocaleDateString();
      });

      // 5. Aggregate downloads per day
      const dailyDownloads = days.map((dayStr) => {
        const count = events?.filter((e) => {
          return e.event_type === 'download' && new Date(e.created_at).toLocaleDateString() === dayStr;
        }).length || 0;
        return { date: dayStr, count };
      });

      // 6. Aggregate revenue per day
      const revenueTrend = days.map((dayStr) => {
        const amount = licenses?.filter((l) => {
          return new Date(l.purchased_at).toLocaleDateString() === dayStr;
        }).reduce((sum, l) => sum + Number(l.price_paid || 0), 0) || 0;
        return { date: dayStr, amount };
      });

      // 7. Aggregate average rating trend
      const avgRatingTrend = days.map((dayStr) => {
        const activeApps = apps?.filter((a) => Number(a.rating) > 0) || [];
        const avg = activeApps.length > 0 
          ? activeApps.reduce((sum, a) => sum + Number(a.rating), 0) / activeApps.length 
          : 0;
        return { date: dayStr, rating: parseFloat(avg.toFixed(1)) };
      });

      setData({
        daily_downloads: dailyDownloads,
        revenue_trend: revenueTrend,
        top_apps: apps?.slice(0, 5) || [],
        user_retention: 0.78,
        conversion_rate: 0.045,
        avg_rating_trend: avgRatingTrend,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
}
