'use client';

import { AppShell } from '@/components/layouts/app-shell';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ShoppingBag,
  Store,
  FileText,
  MessageSquare,
  Download,
  TrendingUp,
  CreditCard,
  Package,
  ArrowRight,
  Sparkles,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, License } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/hooks/useWishlist';
import { DownloadHistoryPanel } from '@/components/download-history-panel';
import { SubscriptionManager } from '@/components/subscription-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: <ShoppingBag className="h-5 w-5" />, label: 'Dashboard', href: '/buyer/dashboard' },
  { icon: <Store className="h-5 w-5" />, label: 'Marketplace', href: '/buyer/marketplace' },
  { icon: <Package className="h-5 w-5" />, label: 'Moje appki', href: '/buyer/my-apps' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chat', href: '/buyer/chats' },
];

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, isInWishlist, addToWishlist, removeFromWishlist } = useWishlist(
    user?.id || ''
  );

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const { data } = await supabase
      .from('licenses')
      .select('*, app:apps(*)')
      .eq('user_id', user!.id)
      .order('purchased_at', { ascending: false })
      .limit(5);

    setLicenses(data || []);
    setLoading(false);
  };

  const totalSpent = licenses.reduce((sum, l) => sum + Number(l.price_paid), 0);
  const activeLicenses = licenses.filter((l) => !l.expires_at || new Date(l.expires_at) > new Date()).length;
  const monthlySubscriptions = licenses.filter((l) => l.app?.price_type === 'subscription').length;

  const stats = [
    { label: 'Posiadane app', value: licenses.length.toString(), icon: <Package className="h-5 w-5" />, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Wydano', value: `$${totalSpent.toFixed(0)}`, icon: <CreditCard className="h-5 w-5" />, gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Aktywnych', value: activeLicenses.toString(), icon: <TrendingUp className="h-5 w-5" />, gradient: 'from-violet-500 to-purple-500' },
    { label: 'Subskrypcji', value: monthlySubscriptions.toString(), icon: <MessageSquare className="h-5 w-5" />, gradient: 'from-amber-500 to-orange-500' },
  ];

  const mockDownloadHistory = [
    { id: '1', appTitle: 'App Pro', date: '2024-01-15', version: '2.1.0', status: 'completed' as const, size: '125MB' },
    { id: '2', appTitle: 'Builder Suite', date: '2024-01-14', version: '1.5.0', status: 'completed' as const, size: '89MB' },
  ];

  const mockSubscriptions = [
    { id: '1', appTitle: 'Premium Tools', price: 4.99, renewalDate: '2024-02-15', status: 'active' as const },
    { id: '2', appTitle: 'Cloud Sync', price: 9.99, renewalDate: '2024-02-10', status: 'expiring_soon' as const },
  ];

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="from-emerald-600 to-teal-600"
      brandIcon={<ShoppingBag className="h-6 w-6" />}
      brandTitle="Buyer Portal"
      brandGradient="from-white to-emerald-100"
    >
      {/* Hero */}
      <div className="mb-8 animate-fade-up" style={{ opacity: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 dark:from-white dark:via-emerald-200 dark:to-white bg-clip-text text-transparent">
              Witaj! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Twoje aplikacje i zakupy
            </p>
          </div>
          <Link href="/buyer/marketplace">
            <Button className="h-11 btn-shine bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
              <Store className="h-4 w-4 mr-2" />
              Przegladaj marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="card-elevated overflow-hidden animate-fade-up"
            style={{ animationDelay: `${(index + 1) * 100}ms`, opacity: 0 }}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={cn(
                    'p-3 rounded-xl bg-gradient-to-br text-white shadow-lg',
                    stat.gradient
                  )}
                >
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="apps" className="mb-8 animate-fade-up" style={{ animationDelay: '500ms', opacity: 0 }}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="apps">Twoje aplikacje</TabsTrigger>
          <TabsTrigger value="downloads">Historia pobierań</TabsTrigger>
          <TabsTrigger value="subscriptions">Subskrypcje</TabsTrigger>
        </TabsList>

        <TabsContent value="apps" className="space-y-4">
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                    <Package className="h-5 w-5 text-emerald-600" />
                  </div>
                  Twoje aplikacje
                </CardTitle>
                <CardDescription className="mt-1">Ostatnio zakupione</CardDescription>
              </div>
              <Link href="/buyer/my-apps">
                <Button variant="ghost" size="sm" className="rounded-lg">
                  Zobacz wszystkie
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Ładowanie...</div>
              ) : licenses.length === 0 ? (
                <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 mb-4">
                    <Sparkles className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-muted-foreground mb-4">Brak zakupionych aplikacji</p>
                  <Link href="/buyer/marketplace">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Store className="h-4 w-4 mr-2" />
                      Przeglądaj marketplace
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {licenses.map((license, index) => (
                    <div
                      key={license.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all animate-fade-up"
                      style={{ animationDelay: `${(index + 6) * 50}ms`, opacity: 0 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50">
                          <FileText className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium">{license.app?.title || 'Nieznana app'}</p>
                          <p className="text-xs text-muted-foreground">
                            {license.type === 'commercial' ? 'Komercyjna' : 'Prywatna'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            isInWishlist(license.app_id)
                              ? removeFromWishlist(license.app_id)
                              : addToWishlist(license.app_id)
                          }
                        >
                          <Heart
                            className={`h-4 w-4 ${isInWishlist(license.app_id) ? 'fill-red-500 text-red-500' : ''}`}
                          />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          <Download className="h-4 w-4 mr-1" />
                          Pobierz
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads">
          <DownloadHistoryPanel history={mockDownloadHistory} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionManager subscriptions={mockSubscriptions} />
        </TabsContent>
      </Tabs>

      {/* Sidebar */}
      <div className="space-y-6 animate-fade-up" style={{ animationDelay: '600ms', opacity: 0 }}>
        {/* Quick Actions */}
        <Card className="card-elevated bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-100 dark:border-emerald-900/50">
          <CardHeader>
            <CardTitle className="text-lg">Szybkie akcje</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Link href="/buyer/marketplace">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-1 rounded-xl bg-white/50 dark:bg-slate-900/50">
                <Store className="h-5 w-5" />
                <span className="text-xs">Marketplace</span>
              </Button>
            </Link>
            <Link href="/buyer/chats">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-1 rounded-xl bg-white/50 dark:bg-slate-900/50">
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Chat</span>
              </Button>
            </Link>
            <Link href="/buyer/my-apps">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-1 rounded-xl bg-white/50 dark:bg-slate-900/50">
                <Package className="h-5 w-5" />
                <span className="text-xs">Moje app</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1 rounded-xl bg-white/50 dark:bg-slate-900/50">
              <Download className="h-5 w-5" />
              <span className="text-xs">Pobierz</span>
            </Button>
          </CardContent>
        </Card>

        {/* Promo Card */}
        {licenses.length === 0 && (
          <Card className="card-elevated bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border-violet-100 dark:border-violet-900/50">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 text-white mb-4 shadow-lg shadow-violet-500/25">
                <Store className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-1">Znajdź idealną appkę</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Przeglądaj setki gotowych rozwiązań
              </p>
              <Link href="/buyer/marketplace">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                  Rozpocznij
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
