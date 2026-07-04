/**
 * Global exports for clean imports throughout the app
 * Import from @/features instead of scattered paths
 */

// ============= HOOKS =============
export {
  useAnalytics,
  useWishlist,
  useAppRecommendations,
  useAppData,
} from '@/hooks';

// ============= COMPONENTS =============
export {
  AnalyticsChart,
  AppComparisonModal,
  AppFilter,
  DownloadHistoryPanel,
  FeaturedAppsCarousel,
  ReviewCard,
  SubscriptionManager,
  TeamCollaboration,
} from '@/components';

// ============= SERVICES =============
export {
  appService,
  wishlistService,
  analyticsService,
} from '@/lib/services';

// ============= UTILITIES =============
export {
  APP_CONFIG,
  formatCurrency,
  formatDownloads,
  formatDate,
  getRatingColor,
  validateApp,
} from '@/lib/config';

// ============= TYPES =============
export type {
  AppWithMetadata,
  FilterState,
  AnalyticsMetrics,
  TeamMember,
  DownloadRecord,
  SubscriptionRecord,
  UserReview,
} from '@/types/app-features';
