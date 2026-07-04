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
  Code,
  FolderGit2,
  Upload,
  MessageSquare,
  BarChart3,
  Plus,
  Rocket,
  TrendingUp,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  Activity,
  Users,
  Target,
  Flame,
  GitBranch,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, Project, App } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsChart } from '@/components/analytics-chart';
import { TeamWorkspace, TeamProvider } from '@/components/team';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DESIGN_SYSTEM } from '@/lib/design-system';
import { SkeletonDashboard } from '@/components/skeleton-loaders';

const sidebarItems = [
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/dev/dashboard' },
  { icon: <FolderGit2 className="h-5 w-5" />, label: 'Projects', href: '/dev/projects' },
  { icon: <Rocket className="h-5 w-5" />, label: 'Publish App', href: '/dev/publish' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/dev/chats' },
];

function DevDashboardContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: analyticsData } = useAnalytics(user?.id || '');
  const [activeDashboardTab, setActiveDashboardTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user!.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    const { data: appsData } = await supabase
      .from('apps')
      .select('*')
      .eq('dev_id', user!.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    setProjects(projectsData || []);
    setApps(appsData || []);
    setLoading(false);
  };

  const activeProjects = projects.filter((p) => p.status !== 'archived').length;
  const publishedApps = apps.filter((a) => a.status === 'active').length;
  const totalDownloads = apps.reduce((sum, a) => sum + a.downloads, 0);
  const totalRevenue = apps.reduce((sum, a) => sum + (a.price * a.downloads), 0);
  const avgRating = apps.length > 0
    ? (apps.reduce((sum, a) => sum + a.rating, 0) / apps.length).toFixed(1)
    : '0.0';

  const statsData = [
    {
      label: 'Aktywne projekty',
      value: activeProjects.toString(),
      icon: <FolderGit2 className="h-5 w-5" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: '+5% wczoraj',
    },
    {
      label: 'Opublikowane app',
      value: publishedApps.toString(),
      icon: <Rocket className="h-5 w-5" />,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      trend: '+2 nowe',
    },
    {
      label: 'Pobran',
      value: totalDownloads.toString(),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      trend: '+12% wzrost',
    },
    {
      label: 'Przychód',
      value: `$${totalRevenue}`,
      icon: <Target className="h-5 w-5" />,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      trend: 'MTD',
    },
    {
      label: 'Średnia ocen',
      value: avgRating,
      icon: <Star className="h-5 w-5" />,
      color: 'from-pink-500 to-red-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      trend: `${apps.length} app`,
    },
  ];

  if (loading) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="from-blue-600 to-indigo-600"
        brandIcon={<Code className="h-6 w-6" />}
        brandTitle="Developer Studio"
        brandGradient="from-white to-blue-100"
      >
        <SkeletonDashboard />
      </AppShell>
    );
  }

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="from-blue-600 to-indigo-600"
      brandIcon={<Code className="h-6 w-6" />}
      brandTitle="Developer Studio"
      brandGradient="from-white to-blue-100"
    >
      <Tabs value={activeDashboardTab} onValueChange={setActiveDashboardTab} className="w-full">
        <TabsList className="mb-8 bg-slate-150/40 dark:bg-slate-800/40 rounded-xl p-1 max-w-[340px] border border-slate-100 dark:border-slate-800">
          <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">Pulpit i Statystyki</TabsTrigger>
          <TabsTrigger value="team-workspace" className="rounded-lg text-xs font-semibold">Workspace Zespołu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Hero Section */}
      <div className="mb-12 animate-fade-up" style={{ opacity: 0 }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
              Witaj z powrotem! 👋
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              Zarządzaj projektami, monitoruj wydajność i zarabiaj na aplikacjach
            </p>
          </div>
          <Link href="/dev/projects/new">
            <Button
              size="lg"
              className="h-12 px-6 rounded-xl btn-shine bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 text-white font-medium gap-2"
            >
              <Plus className="h-5 w-5" />
              Nowy projekt
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {statsData.map((stat, index) => (
          <Card
            key={stat.label}
            className={cn(
              'card-elevated overflow-hidden animate-fade-up hover-glow-dev group',
              stat.bgColor
            )}
            style={{ animationDelay: `${(index + 1) * 50}ms`, opacity: 0 }}
          >
            <CardContent className="pt-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    'p-3 rounded-xl bg-gradient-to-br text-white shadow-lg group-hover:scale-110 transition-transform duration-300',
                    stat.color
                  )}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                📈 {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      {analyticsData && (
        <div className="mb-12 animate-fade-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              Analityka ostatnich 30 dni
            </h2>
          </div>
          <Tabs defaultValue="downloads" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-1">
              <TabsTrigger value="downloads" className="rounded-lg gap-2">
                <TrendingUp className="h-4 w-4" />
                Pobierania
              </TabsTrigger>
              <TabsTrigger value="revenue" className="rounded-lg gap-2">
                <Target className="h-4 w-4" />
                Przychód
              </TabsTrigger>
              <TabsTrigger value="rating" className="rounded-lg gap-2">
                <Star className="h-4 w-4" />
                Oceny
              </TabsTrigger>
            </TabsList>
            <TabsContent value="downloads">
              <AnalyticsChart
                title="Pobierania"
                description="Liczba pobrań aplikacji w ostatnich 30 dniach"
                data={analyticsData.daily_downloads}
                type="line"
                xKey="date"
                dataKey="count"
              />
            </TabsContent>
            <TabsContent value="revenue">
              <AnalyticsChart
                title="Przychód"
                description="Przychód ze sprzedaży aplikacji"
                data={analyticsData.revenue_trend}
                type="bar"
                xKey="date"
                dataKey="amount"
              />
            </TabsContent>
            <TabsContent value="rating">
              <AnalyticsChart
                title="Średnia ocen"
                description="Średnia ocena użytkowników"
                data={analyticsData.avg_rating_trend}
                type="line"
                xKey="date"
                dataKey="rating"
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects & Apps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Projects Card */}
          <Card className="card-elevated animate-fade-up" style={{ animationDelay: '200ms', opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <FolderGit2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ostatnie projekty</CardTitle>
                  <CardDescription className="mt-1">Twoje aktywne projekty</CardDescription>
                </div>
              </div>
              <Link href="/dev/projects">
                <Button variant="ghost" size="sm" className="rounded-lg gap-1">
                  Wszystkie
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {projects.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                  <FolderGit2 className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-muted-foreground mb-4">Brak projektów</p>
                  <Link href="/dev/projects/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg gap-2">
                      <Plus className="h-4 w-4" />
                      Utwórz pierwszy projekt
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project, index) => (
                    <Link
                      key={project.id}
                      href={`/dev/projects/${project.id}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300 group animate-fade-up"
                      style={{ animationDelay: `${(index + 3) * 50}ms`, opacity: 0 }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <GitBranch className="h-4 w-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{project.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {project.status} • v{project.version}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="rounded-lg">
                        {project.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apps Card */}
          <Card className="card-elevated animate-fade-up" style={{ animationDelay: '300ms', opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                  <Rocket className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Aplikacje na rynku</CardTitle>
                  <CardDescription className="mt-1">Twoje opublikowane aplikacje</CardDescription>
                </div>
              </div>
              <Link href="/dev/publish">
                <Button variant="ghost" size="sm" className="rounded-lg gap-1">
                  Publikuj
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {apps.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                  <Rocket className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-muted-foreground mb-4">Brak opublikowanych aplikacji</p>
                  <Link href="/dev/publish">
                    <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg gap-2">
                      <Rocket className="h-4 w-4" />
                      Opublikuj aplikację
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {apps.map((app, index) => (
                    <Link
                      key={app.id}
                      href={`/dev/apps/${app.id}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300 group animate-fade-up"
                      style={{ animationDelay: `${(index + 4) * 50}ms`, opacity: 0 }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Flame className="h-4 w-4 text-violet-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{app.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.price > 0 ? `$${app.price}` : 'Darmowa'} • {app.downloads} ↓
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.rating > 0 && (
                          <Badge variant="outline" className="rounded-lg gap-1 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {app.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Team Workspace Promo */}
          <div className="animate-fade-up" style={{ animationDelay: '400ms', opacity: 0 }}>
            <Card className="card-elevated bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-1 text-sm">Centrum Zespołowe</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Współdziel ekran na żywo, zarządzaj zadaniami Kanban i rozmawiaj na czacie.
                </p>
                <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300">
                  Aktywne Teams + Asana
                </Badge>

                <Button
                  size="sm"
                  onClick={() => setActiveDashboardTab('team-workspace')}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Stwórz zespół
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card
            className="card-elevated bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900/50 animate-fade-up"
            style={{ animationDelay: '500ms', opacity: 0 }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-blue-600" />
                Szybkie akcje
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/dev/projects/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1.5 rounded-xl bg-white/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium">Nowy</span>
                </Button>
              </Link>
              <Link href="/dev/publish">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1.5 rounded-xl bg-white/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800">
                  <Upload className="h-5 w-5 text-violet-600" />
                  <span className="text-xs font-medium">Publikuj</span>
                </Button>
              </Link>
              <Link href="/dev/chats">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1.5 rounded-xl bg-white/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-medium">Chat</span>
                </Button>
              </Link>
              <Link href="/dev/dashboard">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1.5 rounded-xl bg-white/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-medium">Statystyki</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Promo Card */}
          {publishedApps === 0 && (
            <Card
              className="card-elevated bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border-violet-100 dark:border-violet-900/50 animate-fade-up"
              style={{ animationDelay: '600ms', opacity: 0 }}
            >
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 text-white mb-4 shadow-lg shadow-violet-500/25">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-1 text-base">Opublikuj swoją aplikację!</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Zarabiaj na kodzie i docieraj do tysięcy użytkowników
                </p>
                <Link href="/dev/publish">
                  <Button size="sm" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg font-medium gap-2">
                    Rozpocznij
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TabsContent>

    <TabsContent value="team-workspace" className="animate-fade-up">
      <TeamWorkspace />
    </TabsContent>
  </Tabs>
</AppShell>
  );
}

export default function DevDashboard() {
  return (
    <TeamProvider>
      <DevDashboardContent />
    </TeamProvider>
  );
}
