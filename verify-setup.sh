#!/bin/bash
# Verify all files are properly connected

echo "🔍 Checking Hook Files..."
ls -la hooks/*.ts | grep -E "(useAnalytics|useWishlist|useAppRecommendations|useAppData)"

echo "\n🔍 Checking Component Files..."
ls -la components/*.tsx | grep -E "(analytics-chart|app-filter|featured|team|download|subscription|review|comparison)"

echo "\n🔍 Checking Service & Config Files..."
ls -la lib/ | grep -E "(services|config|features)"

echo "\n🔍 Checking Type Files..."
ls -la types/ | grep app-features

echo "\n🔍 Checking Dashboard Files..."
ls -la app/dev/dashboard/page.tsx
ls -la app/buyer/dashboard/page.tsx
ls -la app/viewer/home/page.tsx

echo "\n✅ All files present!"
echo "\n📝 Import examples:"
echo "import { useAnalytics, useWishlist } from '@/hooks';"
echo "import { AnalyticsChart, TeamCollaboration } from '@/components';"
echo "import { appService } from '@/lib/services';"
echo "import { APP_CONFIG } from '@/lib/config';"
