'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';

interface FeaturedApp {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  badge: string;
  gradient: string;
}

interface FeaturedAppsCarouselProps {
  apps: FeaturedApp[];
}

export function FeaturedAppsCarousel({ apps }: FeaturedAppsCarouselProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {apps.slice(0, 2).map((app, index) => (
        <Card
          key={app.id}
          className={`overflow-hidden bg-gradient-to-br ${app.gradient} text-white border-0 cursor-pointer group hover:shadow-2xl transition-all duration-300 card-elevated`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl group-hover:translate-x-1 transition-transform">
                  {app.title}
                </CardTitle>
                <p className="text-white/80 text-sm mt-2">{app.description}</p>
              </div>
              <Badge className="bg-white/20 border-0 text-white">
                {app.badge}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">{app.rating}/5</span>
              </div>
              <Link href={`/viewer/app/${app.id}`}>
                <Button
                  variant="secondary"
                  className="gap-2 rounded-lg bg-white/90 text-slate-900 hover:bg-white"
                >
                  Odkryj
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
