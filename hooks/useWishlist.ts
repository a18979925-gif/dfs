import { useState, useEffect } from 'react';
import { supabase, License } from '@/lib/supabase';

export function useWishlist(userId: string) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      const { data } = await supabase
        .from('wishlist')
        .select('app_id')
        .eq('user_id', userId);
      setWishlist(data?.map((w) => w.app_id) || []);
    } catch {
      console.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (appId: string) => {
    try {
      await supabase
        .from('wishlist')
        .insert({ user_id: userId, app_id: appId });
      setWishlist([...wishlist, appId]);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (appId: string) => {
    try {
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('app_id', appId);
      setWishlist(wishlist.filter((id) => id !== appId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist: (appId: string) => wishlist.includes(appId),
  };
}
