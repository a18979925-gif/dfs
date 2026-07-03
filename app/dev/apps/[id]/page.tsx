'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { AppShell } from '@/components/layouts/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Code,
  FolderGit2,
  Rocket,
  MessageSquare,
  BarChart3,
  Star,
  Download,
  Play,
  Save,
  Trash2,
  ArrowLeft,
  DollarSign,
  TrendingUp,
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

const sidebarItems = [
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/dev/dashboard' },
  { icon: <FolderGit2 className="h-5 w-5" />, label: 'Projects', href: '/dev/projects' },
  { icon: <Rocket className="h-5 w-5" />, label: 'Publish App', href: '/dev/publish' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/dev/chats' },
];

export default function DevAppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const appId = params.id as string;

  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('0');
  const [updating, setUpdating] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (appId && user) {
      fetchApp();
    }
  }, [appId, user]);

  const fetchApp = async () => {
    const { data } = await supabase
      .from('apps')
      .select('*')
      .eq('id', appId)
      .eq('dev_id', user!.id)
      .single();

    if (data) {
      setApp(data);
      setPrice(data.price.toString());
    }
    setLoading(false);
  };

  const handleUpdatePrice = async () => {
    if (!app) return;
    setUpdating(true);

    const { error } = await supabase
      .from('apps')
      .update({
        price: parseFloat(price) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', app.id);

    if (!error) {
      setApp((prev) => prev ? { ...prev, price: parseFloat(price) || 0 } : null);
      alert('Price updated successfully!');
    } else {
      alert('Failed to update price.');
    }
    setUpdating(false);
  };

  const handleUnpublish = async () => {
    if (!app || !confirm('Are you sure you want to delete this app from the marketplace?')) return;
    setUnpublishing(true);

    const { error } = await supabase
      .from('apps')
      .delete()
      .eq('id', app.id);

    if (!error) {
      // Restore status of the linked project if any
      if (app.project_id) {
        await supabase
          .from('projects')
          .update({ status: 'draft' })
          .eq('id', app.project_id);
      }
      router.push('/dev/dashboard');
    } else {
      alert('Failed to unpublish app.');
      setUnpublishing(false);
    }
  };

  if (loading) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="bg-blue-600"
        brandIcon={<Code className="h-6 w-6" />}
        brandTitle="Developer Studio"
      >
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </AppShell>
    );
  }

  if (!app) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="bg-blue-600"
        brandIcon={<Code className="h-6 w-6" />}
        brandTitle="Developer Studio"
      >
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">App not found</h3>
            <Button onClick={() => router.push('/dev/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const simulatedRevenue = app.downloads * app.price;

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-blue-600"
      brandIcon={<Code className="h-6 w-6" />}
      brandTitle="Developer Studio"
    >
      <Button variant="ghost" onClick={() => router.push('/dev/dashboard')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{app.title}</CardTitle>
                  <CardDescription>Published on {new Date(app.created_at).toLocaleDateString()}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="capitalize" variant={app.status === 'active' ? 'default' : 'secondary'}>
                    {app.status}
                  </Badge>
                  {app.rating > 0 && (
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                      <Star className="h-3 w-3 fill-current" />
                      {app.rating.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Description</Label>
                <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                  {app.description || 'No description provided.'}
                </p>
              </div>

              {app.tags && app.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold">Tags</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {app.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>Test the published application instance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => setShowPreview(true)} className="w-full h-32 flex flex-col gap-2">
                <Play className="h-8 w-8 text-blue-600" />
                <span>Run App Preview</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Downloads</p>
                    <p className="text-xl font-bold">{app.downloads}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Simulated Revenue</p>
                    <p className="text-xl font-bold">${simulatedRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Pricing</CardTitle>
              <CardDescription>Modify price tier or type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-9"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleUpdatePrice} disabled={updating} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {updating ? 'Saving...' : 'Update Price'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>Permanently remove the app from marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleUnpublish} disabled={unpublishing} className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                {unpublishing ? 'Unpublishing...' : 'Unpublish App'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{app.title} - Preview</DialogTitle>
            <DialogDescription>
              Interactive demo of the application
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Interactive preview component ready for integration</p>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
