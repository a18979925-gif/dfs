import { useState, useEffect } from 'react';
import { supabase, App } from '@/lib/supabase';

export function useAppRecommendations(userId: string | undefined, limit: number = 5) {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      // Get user's previous purchases
      const { data: licenses } = await supabase
        .from('licenses')
        .select('app_id')
        .eq('user_id', userId);

      const purchasedAppIds = licenses?.map((l) => l.app_id) || [];

      // Get top-rated apps not yet purchased
      const { data: recommendedApps } = await supabase
        .from('apps')
        .select('*')
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .limit(limit * 2);

      const filtered = (recommendedApps || [])
        .filter((app) => !purchasedAppIds.includes(app.id))
        .slice(0, limit);

      setApps(filtered);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return { apps, loading };
}
