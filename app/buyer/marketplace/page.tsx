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
  ShoppingBag,
  Store,
  Package,
  MessageSquare,
  Search,
  Star,
  Download,
  Sparkles,
  TrendingUp,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { supabase, App } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const sidebarItems = [
  { icon: <ShoppingBag className="h-5 w-5" />, label: 'Dashboard', href: '/buyer/dashboard' },
  { icon: <Store className="h-5 w-5" />, label: 'Marketplace', href: '/buyer/marketplace' },
  { icon: <Package className="h-5 w-5" />, label: 'Moje appki', href: '/buyer/my-apps' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chat', href: '/buyer/chats' },
];

export default function MarketplacePage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '4plus' | '3plus'>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'newest'>('downloads');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('apps')
      .select('*, dev:profiles!dev_id(email)')
      .eq('status', 'active')
      .order('downloads', { ascending: false });

    setApps(data || []);
    setLoading(false);
  };

  const allTags = Array.from(new Set(apps.flatMap((a) => a.tags))).slice(0, 8);

  const filteredApps = apps
    .filter((app) => {
      const matchesSearch = app.title.toLowerCase().includes(search.toLowerCase()) ||
        (app.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesTag = !selectedTag || app.tags.includes(selectedTag);
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && app.price === 0) ||
        (priceFilter === 'paid' && app.price > 0);
      const matchesRating =
        ratingFilter === 'all' ||
        (ratingFilter === '4plus' && app.rating >= 4) ||
        (ratingFilter === '3plus' && app.rating >= 3);
      return matchesSearch && matchesTag && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  const featuredApps = apps.slice(0, 3);

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
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 dark:from-white dark:via-emerald-200 dark:to-white bg-clip-text text-transparent">
          Odkrywaj aplikacje
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Znajdz gotowe rozwiazania i kup u zaufanych developerow
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Szukaj aplikacji..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={priceFilter} onValueChange={(val: any) => setPriceFilter(val)}>
            <SelectTrigger className="w-[135px] h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Cena" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie ceny</SelectItem>
              <SelectItem value="free">Darmowe</SelectItem>
              <SelectItem value="paid">Płatne</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={(val: any) => setRatingFilter(val)}>
            <SelectTrigger className="w-[135px] h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Ocena" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie oceny</SelectItem>
              <SelectItem value="4plus">★ 4.0 i więcej</SelectItem>
              <SelectItem value="3plus">★ 3.0 i więcej</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
            <SelectTrigger className="w-[150px] h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Sortuj według" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="downloads">Popularność</SelectItem>
              <SelectItem value="rating">Ocena</SelectItem>
              <SelectItem value="newest">Najnowsze</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8 animate-fade-up" style={{ animationDelay: '200ms', opacity: 0 }}>
        <Button
          variant={selectedTag === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTag(null)}
          className={cn(
            'rounded-full transition-all duration-200',
            selectedTag === null && 'bg-emerald-600 hover:bg-emerald-700'
          )}
        >
          Wszystkie
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={cn(
              'rounded-full transition-all duration-200',
              selectedTag === tag && 'bg-emerald-600 hover:bg-emerald-700'
            )}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Featured Apps */}
      {featuredApps.length > 0 && !search && !selectedTag && (
        <div className="mb-12 animate-fade-up" style={{ animationDelay: '300ms', opacity: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-semibold">Polecane</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredApps.map((app, index) => (
              <Link key={app.id} href={`/buyer/app/${app.id}`}>
                <Card className="card-elevated group cursor-pointer overflow-hidden animate-fade-up" style={{ animationDelay: `${(index + 4) * 100}ms`, opacity: 0 }}>
                  <div className="h-32 bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-lg">
                        <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                        {app.rating > 0 ? app.rating.toFixed(1) : 'Nowość'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold mb-1 group-hover:text-emerald-600 transition-colors">
                      {app.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {app.description || 'Brak opisu'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-emerald-600">
                        {app.price > 0 ? `$${app.price}` : 'Za darmo'}
                      </span>
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
        </div>
      )}

      {/* All Apps Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : filteredApps.length === 0 ? (
        <Card className="text-center py-12 card-elevated">
          <CardContent>
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
              <Store className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Brak wynikow</h3>
            <p className="text-muted-foreground">Sprobuj innej frazy lub filtru</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app, index) => (
            <Link key={app.id} href={`/buyer/app/${app.id}`}>
              <Card
                className="card-elevated group cursor-pointer animate-fade-up"
                style={{ animationDelay: `${(index + 5) * 50}ms`, opacity: 0 }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50">
                        <Store className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                          {app.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          by {app.dev?.email?.split('@')[0] || 'Dev'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">
                        {app.rating > 0 ? app.rating.toFixed(1) : '-'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {app.description || 'Brak opisu'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {app.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs rounded-full font-normal"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {app.price > 0 ? `$${app.price}` : 'Free'}
                      </p>
                      {app.price_type === 'subscription' && (
                        <p className="text-xs text-muted-foreground">/miesiac</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {app.downloads}
                      </div>
                      <Button size="sm" className="rounded-xl">
                        Zobacz
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}


