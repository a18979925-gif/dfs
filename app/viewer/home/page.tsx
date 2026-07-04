'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { AppShell } from '@/components/layouts/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Search,
  Star,
  Download,
  Lock,
  ArrowRight,
  Rocket,
  Zap,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { supabase, App } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { FeaturedAppsCarousel } from '@/components/featured-apps-carousel';
import { AppFilter } from '@/components/app-filter';
import { useWishlist } from '@/hooks/useWishlist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppComparisonModal } from '@/components/app-comparison-modal';

const sidebarItems = [
  { icon: <Compass className="h-5 w-5" />, label: 'Odkrywaj', href: '/viewer/home' },
  { icon: <TrendingUp className="h-5 w-5" />, label: 'Trendy', href: '/viewer/trending' },
  { icon: <Sparkles className="h-5 w-5" />, label: 'Nowe', href: '/viewer/new' },
];

export default function ViewerHome() {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { wishlist, isInWishlist, addToWishlist, removeFromWishlist } = useWishlist(
    user?.id || ''
  );
  const [compareApps, setCompareApps] = useState<App[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompareApp = (app: App) => {
    if (compareApps.some((a) => a.id === app.id)) {
      setCompareApps(compareApps.filter((a) => a.id !== app.id));
    } else {
      if (compareApps.length >= 3) {
        alert('Możesz porównać maksymalnie 3 aplikacje jednocześnie');
        return;
      }
      setCompareApps([...compareApps, app]);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    const results = apps.filter((app) =>
      app.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredApps(results);
  }, [search, apps]);

  const fetchApps = async () => {
    const { data } = await supabase
      .from('apps')
      .select('*, dev:profiles!dev_id(email)')
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(24);

    setApps(data || []);
    setLoading(false);
  };

  const handleFilterChange = (filters: any) => {
    let results = [...apps];

    // Filter by price
    results = results.filter(
      (app) => app.price >= filters.priceRange[0] && app.price <= filters.priceRange[1]
    );

    // Filter by rating
    if (filters.rating > 0) {
      results = results.filter((app) => app.rating >= filters.rating);
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      results = results.filter((app) =>
        app.tags.some((tag) => filters.categories.includes(tag))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'downloads':
        results.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
      default:
        results.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredApps(results);
  };

  const featuredApps = [
    {
      id: apps[0]?.id || '1',
      title: apps[0]?.title || 'Premium Pro',
      description: apps[0]?.description || 'Najwyżej oceniana aplikacja na rynku',
      image: '',
      rating: apps[0]?.rating || 4.9,
      badge: 'Polecana',
      gradient: 'from-blue-600 via-violet-600 to-purple-700',
    },
    {
      id: apps[1]?.id || '2',
      title: apps[1]?.title || 'New Trend',
      description: apps[1]?.description || 'Najczęściej pobierana w tym tygodniu',
      image: '',
      rating: apps[1]?.rating || 4.7,
      badge: 'Trending',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    },
  ];

  const categories = Array.from(
    new Set(apps.flatMap((app) => app.tags || []))
  ).slice(0, 10);

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="from-slate-600 to-slate-500"
      brandIcon={<Eye className="h-6 w-6" />}
      brandTitle="App Explorer"
      brandGradient="from-white to-slate-200"
    >
      {/* Hero with CTA */}
      <div className="relative mb-8 animate-fade-up" style={{ opacity: 0 }}>
        <Card className="overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 border-0 text-white shadow-2xl shadow-violet-500/20">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-2xl">
              <Badge className="bg-white/20 border-0 mb-4 rounded-full">
                Tryb podglądu
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                chcesz więcej?
              </h1>
              <p className="text-white/80 text-lg mb-6">
                Zaloguj się aby kupować aplikacje, rozmawiać z developerami i mieć
                pełny dostęp do platformy
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 rounded-xl shadow-lg">
                    Zaloguj się
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-xl">
                  <Zap className="h-4 w-4 mr-2" />
                  Funkcje
                </Button>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </CardContent>
        </Card>
      </div>

      {/* Featured Apps */}
      {apps.length > 0 && (
        <FeaturedAppsCarousel apps={featuredApps} />
      )}

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-8 animate-fade-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Szukaj aplikacji..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-2xl"
          />
        </div>
        <AppFilter onFilterChange={handleFilterChange} categories={categories} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Wszystkie ({filteredApps.length})</TabsTrigger>
          <TabsTrigger value="trending">Trendy</TabsTrigger>
          <TabsTrigger value="free">Darmowe</TabsTrigger>
          <TabsTrigger value="wishlist">Ulubione ({wishlist.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-slate-600 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app, index) => (
                <Link key={app.id} href={`/viewer/app/${app.id}`}>
                  <Card
                    className="card-elevated group cursor-pointer animate-fade-up hover-glow-viewer h-full transition-all hover:shadow-lg"
                    style={{ animationDelay: `${(index + 2) * 100}ms`, opacity: 0 }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg group-hover:text-slate-600 transition-colors">
                            {app.title}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            by {app.dev?.email?.split('@')[0] || 'Dev'}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleCompareApp(app);
                            }}
                            title="Porównaj aplikację"
                          >
                            <SlidersHorizontal
                              className={`h-4 w-4 ${compareApps.some((a) => a.id === app.id) ? 'text-blue-600' : ''}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              isInWishlist(app.id)
                                ? removeFromWishlist(app.id)
                                : addToWishlist(app.id);
                            }}
                          >
                            <Heart
                              className={`h-4 w-4 ${isInWishlist(app.id) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {app.description || 'Brak opisu'}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {app.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs rounded-full font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex flex-col">
                          <p className="text-lg font-bold">
                            {app.price > 0 ? `$${app.price}` : 'Free'}
                          </p>
                          {app.rating > 0 && (
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-medium">{app.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Download className="h-3 w-3" />
                          {app.downloads}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {filteredApps.length === 0 && !loading && (
            <Card className="text-center py-12 card-elevated">
              <CardContent>
                <Compass className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nie znaleziono</h3>
                <p className="text-muted-foreground">Spróbuj innej frazy</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps
              .filter((a) => a.downloads > 100)
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 9)
              .map((app, index) => (
                <Link key={app.id} href={`/viewer/app/${app.id}`}>
                  <Card className="card-elevated group cursor-pointer animate-fade-up h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{app.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge>{app.downloads} pobierań</Badge>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="free">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps
              .filter((a) => a.price === 0)
              .map((app, index) => (
                <Link key={app.id} href={`/viewer/app/${app.id}`}>
                  <Card className="card-elevated group cursor-pointer animate-fade-up h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{app.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                        Darmowa
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="wishlist">
          {wishlist.length === 0 ? (
            <Card className="text-center py-12 card-elevated">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Pusta lista ulubionych</h3>
                <p className="text-muted-foreground mb-4">Dodaj aplikacje do listy ulubionych</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps
                .filter((a) => wishlist.includes(a.id))
                .map((app) => (
                  <Link key={app.id} href={`/viewer/app/${app.id}`}>
                    <Card className="card-elevated group cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{app.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{app.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {compareApps.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Card className="shadow-2xl border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-sm font-medium">
                Wybrano {compareApps.length} {compareApps.length === 1 ? 'aplikację' : 'aplikacje'} do porównania
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCompareApps([])}
                  className="rounded-lg"
                >
                  Wyczyść
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsCompareOpen(true)}
                  disabled={compareApps.length < 2}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Porównaj ({compareApps.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AppComparisonModal
        apps={compareApps}
        open={isCompareOpen}
        onOpenChange={setIsCompareOpen}
      />
    </AppShell>
  );
}
