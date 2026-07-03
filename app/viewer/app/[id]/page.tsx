'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { AppShell } from '@/components/layouts/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Eye,
  Compass,
  TrendingUp,
  Sparkles,
  Star,
  Play,
  Lock,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { supabase, App } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';

const sidebarItems = [
  { icon: <Compass className="h-5 w-5" />, label: 'Discover', href: '/viewer/home' },
  { icon: <TrendingUp className="h-5 w-5" />, label: 'Trending', href: '/viewer/trending' },
  { icon: <Sparkles className="h-5 w-5" />, label: 'New', href: '/viewer/new' },
];

export default function ViewerAppPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;

  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchApp();
  }, [appId]);

  const fetchApp = async () => {
    const { data } = await supabase
      .from('apps')
      .select('*, dev:profiles!dev_id(email)')
      .eq('id', appId)
      .single();

    setApp(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="bg-slate-600"
        brandIcon={<Eye className="h-6 w-6" />}
        brandTitle="App Explorer"
      >
        <div className="text-center py-12">Loading...</div>
      </AppShell>
    );
  }

  if (!app) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="bg-slate-600"
        brandIcon={<Eye className="h-6 w-6" />}
        brandTitle="App Explorer"
      >
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">App not found</h3>
            <Button onClick={() => router.push('/viewer/home')}>Back to Discover</Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-slate-600"
      brandIcon={<Eye className="h-6 w-6" />}
      brandTitle="App Explorer"
    >
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{app.title}</CardTitle>
                  <CardDescription>by {app.dev?.email || 'Unknown Developer'}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="py-1.5">
                    <Lock className="h-3 w-3 mr-1" />
                    Preview Mode
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {app.description || 'No description available'}
              </p>

              <div className="flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {app.rating > 0 ? app.rating.toFixed(1) : 'No ratings'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Try out the application demo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="w-full h-40 flex flex-col gap-2"
              >
                <Play className="h-12 w-12" />
                <span className="text-lg">Try Demo</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold">
                  {app.price > 0 ? `$${app.price}` : 'Free'}
                </p>
                {app.price_type === 'subscription' && (
                  <p className="text-sm text-muted-foreground">/month</p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Sign in to purchase this app
                </p>
              </div>

              <Link href="/login" className="block">
                <Button className="w-full">
                  Sign In to Purchase
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              {app.dev && (
                <Button variant="outline" className="w-full" disabled>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat (Sign in required)
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{app.title} - Demo</DialogTitle>
            <DialogDescription>
              Interactive preview of the application
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Preview mode</p>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access full features
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
