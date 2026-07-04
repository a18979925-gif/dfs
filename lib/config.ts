// App Feature Flags & Config
export const APP_CONFIG = {
  features: {
    analytics: true,
    wishlist: true,
    recommendations: true,
    teamCollaboration: true,
    subscriptions: true,
    downloads: true,
    reviews: true,
    comparison: true,
  },
  analytics: {
    refreshInterval: 300000, // 5 minutes
    chartHeight: 256,
  },
  pagination: {
    defaultLimit: 5,
    maxLimit: 50,
  },
  storage: {
    wishlistKey: 'lifeflow_wishlist',
    filtersKey: 'lifeflow_filters',
  },
};

// Helper to format currency
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// Helper to format downloads
export function formatDownloads(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

// Helper to format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

// Helper to get rating color
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-emerald-500';
  if (rating >= 4) return 'text-blue-500';
  if (rating >= 3) return 'text-amber-500';
  return 'text-red-500';
}

// Helper to validate app data
export function validateApp(app: any): boolean {
  return app?.id && app?.title && app?.dev_id;
}
