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
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, Project, App } from '@/lib/supabase';

const sidebarItems = [
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/dev/dashboard' },
  { icon: <FolderGit2 className="h-5 w-5" />, label: 'Projects', href: '/dev/projects' },
  { icon: <Rocket className="h-5 w-5" />, label: 'Publish App', href: '/dev/publish' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/dev/chats' },
];

export default function DevDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

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
  const avgRating = apps.length > 0
    ? (apps.reduce((sum, a) => sum + a.rating, 0) / apps.length).toFixed(1)
    : '0.0';

  const statsData = [
    { label: 'Aktywne projekty', value: activeProjects.toString(), icon: <FolderGit2 className="h-5 w-5" />, color: 'from-blue-500 to-blue-600' },
    { label: 'Opublikowane app', value: publishedApps.toString(), icon: <Rocket className="h-5 w-5" />, color: 'from-violet-500 to-purple-600' },
    { label: 'Pobran', value: totalDownloads.toString(), icon: <TrendingUp className="h-5 w-5" />, color: 'from-emerald-500 to-teal-600' },
    { label: 'Srednia ocen', value: avgRating, icon: <Star className="h-5 w-5" />, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="from-blue-600 to-indigo-600"
      brandIcon={<Code className="h-6 w-6" />}
      brandTitle="Developer Studio"
      brandGradient="from-white to-blue-100"
    >
      {/* Hero Section */}
      <div className="mb-8 animate-fade-up" style={{ opacity: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
              Witaj z powrotem! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Buduj, publikuj i zarabiaj na aplikacjach
            </p>
          </div>
          <Link href="/dev/projects/new">
            <Button className="h-11 btn-shine bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
              <Plus className="h-4 w-4 mr-2" />
              Nowy projekt
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <Card
            key={stat.label}
            className="card-elevated overflow-hidden animate-fade-up hover-glow-dev"
            style={{ animationDelay: `${(index + 1) * 100}ms`, opacity: 0 }}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    'p-3 rounded-xl bg-gradient-to-br text-white shadow-lg',
                    stat.color
                  )}
                >
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Card */}
        <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '500ms', opacity: 0 }}>
          <Card className="card-elevated h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <FolderGit2 className="h-5 w-5 text-blue-600" />
                  </div>
                  Ostatnie projekty
                </CardTitle>
                <CardDescription className="mt-1">Twoje najnowsze prace</CardDescription>
              </div>
              <Link href="/dev/projects">
                <Button variant="ghost" size="sm" className="rounded-lg">
                  Zobacz wszystkie
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Ladowanie...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 mb-4">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-muted-foreground mb-4">Brak projektow</p>
                  <Link href="/dev/projects/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Utworz pierwszy projekt
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project, index) => (
                    <Link
                      key={project.id}
                      href={`/dev/projects/${project.id}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-200 group animate-fade-up"
                      style={{ animationDelay: `${(index + 6) * 50}ms`, opacity: 0 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
                          <FolderGit2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {project.status} · v{project.version}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apps Card */}
          <Card className="card-elevated mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                    <Rocket className="h-5 w-5 text-violet-600" />
                  </div>
                  Opublikowane aplikacje
                </CardTitle>
                <CardDescription className="mt-1">Twoje aplikacje dostępne na rynku</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Ładowanie...</div>
              ) : apps.length === 0 ? (
                <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <p className="text-muted-foreground mb-4">Brak opublikowanych aplikacji</p>
                  <Link href="/dev/publish">
                    <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                      Opublikuj pierwszą aplikację
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {apps.map((app, index) => (
                    <Link
                      key={app.id}
                      href={`/dev/apps/${app.id}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50">
                          <Rocket className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-medium">{app.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.price > 0 ? `$${app.price}` : 'Darmowa'} · {app.downloads} pobrań
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.rating > 0 && (
                          <div className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-current animate-pulse" />
                            {app.rating.toFixed(1)}
                          </div>
                        )}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6 animate-fade-up" style={{ animationDelay: '600ms', opacity: 0 }}>
          <Card className="card-elevated bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Szybkie akcje
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/dev/projects/new">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1 rounded-xl bg-white/50 dark:bg-slate-900/50">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Nowy</span>
                </Button>
              </Link>
              <Link href="/dev/publish">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1 rounded-xl bg-white/50 dark:bg-slate-900/50">
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Publikuj</span>
                </Button>
              </Link>
              <Link href="/dev/chats">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1 rounded-xl bg-white/50 dark:bg-slate-900/50">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs">Chat</span>
                </Button>
              </Link>
              <Link href="/dev/analytics">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1 rounded-xl bg-white/50 dark:bg-slate-900/50">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Statystyki</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {apps.length === 0 && (
            <Card className="card-elevated bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border-violet-100 dark:border-violet-900/50">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 text-white mb-4 shadow-lg shadow-violet-500/25">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-1">Opublikuj pierwsza appke!</h3>
                <p className="text-xs text-muted-foreground mb-4">
                    Zarabiaj na swoim kodzie
                </p>
                <Link href="/dev/publish">
                  <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Rozpocznij
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}

import { cn } from '@/lib/utils';
