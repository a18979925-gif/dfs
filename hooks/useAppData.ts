import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { appService, wishlistService, analyticsService } from '@/lib/services';

/**
 * Main app data hook - manages all app state in one place
 */
export function useAppData() {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    loadUserData();
  }, [user?.id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [appsData, licensesData, wishlistData] = await Promise.all([
        appService.getFeaturedApps(24),
        appService.getBuyerLicenses(user!.id),
        wishlistService.getWishlist(user!.id),
      ]);

      setApps(appsData || []);
      setLicenses(licensesData || []);
      setWishlist(wishlistData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (appId: string) => {
    if (!user?.id) return;
    try {
      await wishlistService.add(user.id, appId);
      setWishlist([...wishlist, appId]);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const removeFromWishlist = async (appId: string) => {
    if (!user?.id) return;
    try {
      await wishlistService.remove(user.id, appId);
      setWishlist(wishlist.filter((id) => id !== appId));
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const trackView = (appId: string) => {
    analyticsService.trackView(appId, user?.id);
  };

  const trackDownload = (appId: string) => {
    if (user?.id) {
      analyticsService.trackDownload(appId, user.id);
    }
  };

  const refresh = () => loadUserData();

  return {
    apps,
    licenses,
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist: (appId: string) => wishlist.includes(appId),
    trackView,
    trackDownload,
    refresh,
  };
}
