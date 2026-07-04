'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card className="card-elevated p-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

export function SkeletonAppCard() {
  return (
    <Card className="card-elevated p-4 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-6 w-6 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-24 rounded-lg" />
      </div>
    </Card>
  );
}

export function SkeletonAnalyticsChart() {
  return (
    <Card className="card-elevated p-6 space-y-4">
      <Skeleton className="h-8 w-40 rounded-lg" />
      <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
    </Card>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-5 w-96 rounded-lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonAnalyticsChart key={i} />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonAppCard key={i} />
      ))}
    </div>
  );
}
