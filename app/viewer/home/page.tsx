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
} from 'lucide-react';
import Link from 'next/link';
import { supabase, App } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

const sidebarItems = [
  { icon: <Compass className="h-5 w-5" />, label: 'Odkrywaj', href: '/viewer/home' },
  { icon: <TrendingUp className="h-5 w-5" />, label: 'Trendy', href: '/viewer/trending' },
  { icon: <Sparkles className="h-5 w-5" />, label: 'Nowe', href: '/viewer/new' },
];

export default function ViewerHome() {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const { data } = await supabase
      .from('apps')
      .select('*, dev:profiles!dev_id(email)')
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(12);

    setApps(data || []);
    setLoading(false);
  };

  const filteredApps = apps.filter((app) =>
    app.title.toLowerCase().includes(search.toLowerCase())
  );

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
                Tryb podgladu
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                chcesz wiecej?
              </h1>
              <p className="text-white/80 text-lg mb-6">
                Zaloguj sie aby kupowac aplikacje, rozmawiac z developerami i miec
                pelny dostep do platformy
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 rounded-xl shadow-lg">
                    Zaloguj sie
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

      {/* Search */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Szukaj aplikacji..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-2xl"
          />
        </div>
      </div>

      {/* Apps Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-slate-600 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app, index) => (
            <Link key={app.id} href={`/viewer/app/${app.id}`}>
              <Card
                className="card-elevated group cursor-pointer animate-fade-up hover-glow-viewer"
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
                    {app.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{app.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Nowość</Badge>
                    )}
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
                    <p className="text-lg font-bold">
                      {app.price > 0 ? `$${app.price}` : 'Free'}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Download className="h-3 w-3" />
                        {app.downloads}
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Eye className="h-4 w-4 mr-1" />
                        Podglad
                      </Button>
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
            <p className="text-muted-foreground">Sprobuj innej frazy</p>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
