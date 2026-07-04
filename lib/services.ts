import { supabase } from '@/lib/supabase';
import { App, License } from '@/lib/supabase';

/**
 * App Service - handles all app-related operations
 */

export const appService = {
  // Fetch featured apps
  async getFeaturedApps(limit = 5) {
    const { data, error } = await supabase
      .from('apps')
      .select('*, dev:profiles!dev_id(email)')
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Search apps
  async searchApps(query: string) {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('status', 'active')
      .ilike('title', `%${query}%`)
      .order('rating', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  },

  // Get apps by developer
  async getDevApps(devId: string) {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('dev_id', devId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get buyer licenses
  async getBuyerLicenses(userId: string) {
    const { data, error } = await supabase
      .from('licenses')
      .select('*, app:apps(*)')
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

/**
 * Wishlist Service
 */
export const wishlistService = {
  // Get wishlist
  async getWishlist(userId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('app_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map((w) => w.app_id) || [];
  },

  // Add to wishlist
  async add(userId: string, appId: string) {
    const { error } = await supabase
      .from('wishlist')
      .insert({ user_id: userId, app_id: appId });

    if (error) throw error;
  },

  // Remove from wishlist
  async remove(userId: string, appId: string) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('app_id', appId);

    if (error) throw error;
  },
};

/**
 * Analytics Service
 */
export const analyticsService = {
  // Track app view
  async trackView(appId: string, userId?: string) {
    const { error } = await supabase
      .from('analytics')
      .insert({
        app_id: appId,
        user_id: userId,
        event_type: 'view',
        created_at: new Date().toISOString(),
      });

    if (error) console.error('Analytics error:', error);
  },

  // Track download
  async trackDownload(appId: string, userId: string) {
    const { error } = await supabase
      .from('analytics')
      .insert({
        app_id: appId,
        user_id: userId,
        event_type: 'download',
        created_at: new Date().toISOString(),
      });

    if (error) console.error('Analytics error:', error);
  },

  // Get dev analytics
  async getDevAnalytics(devId: string) {
    const { data, error } = await supabase
      .from('apps')
      .select('downloads, rating, created_at')
      .eq('dev_id', devId);

    if (error) throw error;
    return data;
  },
};
