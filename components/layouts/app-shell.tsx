'use client';

import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';
import { LogOut, Menu, Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { supabase, Notification } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, MailOpen } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  sidebarItems: {
    icon: ReactNode;
    label: string;
    href: string;
  }[];
  headerColor?: string;
  brandIcon: ReactNode;
  brandTitle: string;
  brandGradient?: string;
}

export function AppShell({
  children,
  sidebarItems,
  headerColor = 'from-blue-600 to-blue-500',
  brandIcon,
  brandTitle,
  brandGradient = 'from-white to-blue-100',
}: AppShellProps) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();

      const channel = supabase
        .channel(`realtime:notifications:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user!.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={cn('flex flex-col gap-1 px-3', mobile ? 'py-4' : 'py-4')}>
      {sidebarItems.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => mobile && setSidebarOpen(false)}
          className={cn(
            'sidebar-item',
            pathname === item.href && 'active bg-accent',
            'animate-fade-up'
          )}
          style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  const renderNotifications = (isMobile: boolean) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'rounded-xl relative',
            isMobile ? 'text-white hover:bg-white/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
              {unreadCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 overflow-hidden shadow-xl border">
        <div className="p-3 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <span className="font-semibold text-sm">Powiadomienia</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 text-xs text-blue-600 px-2 hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              Odczytaj wszystkie
            </Button>
          )}
        </div>
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground gap-2">
              <MailOpen className="h-8 w-8 text-slate-300" />
              <p className="text-xs">Brak powiadomień</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  className={cn(
                    'p-3 text-left transition-colors cursor-pointer flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-900',
                    !n.read && 'bg-blue-50/40 dark:bg-blue-950/15'
                  )}
                >
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/80">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-64 md:flex-col">
        <div className="flex-1 flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50">
          {/* Logo */}
          <div
            className={cn(
              'flex items-center gap-3 p-5 border-b border-slate-200/50 dark:border-slate-800/50',
              'bg-gradient-to-r',
              headerColor
            )}
          >
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur text-white shadow-lg">
              {brandIcon}
            </div>
            <span className={cn('font-bold text-lg bg-gradient-to-r bg-clip-text text-transparent', brandGradient)}>
              {brandTitle}
            </span>
          </div>
          <Sidebar />
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className={cn(
          'sticky top-0 z-40 md:hidden border-b border-slate-200/50 dark:border-slate-800/50',
          'bg-gradient-to-r',
          headerColor
        )}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-white dark:bg-slate-900">
              <div
                className={cn(
                  'flex items-center gap-3 p-5 border-b',
                  'bg-gradient-to-r',
                  headerColor
                )}
              >
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur text-white">
                  {brandIcon}
                </div>
                <span className={cn('font-bold text-lg bg-gradient-to-r bg-clip-text text-transparent', brandGradient)}>
                  {brandTitle}
                </span>
              </div>
              <Sidebar mobile />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            {renderNotifications(true)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20 rounded-xl px-2">
                  <Avatar className="h-8 w-8 ring-2 ring-white/30">
                    <AvatarFallback className="bg-white/20 text-white text-sm font-medium">
                      {user?.email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                  <p className="font-medium">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1 rounded-md">
                    {user?.role}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-lg">
                  <LogOut className="h-4 w-4 mr-2" />
                  Wyloguj sie
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:sticky md:top-0 md:z-30 md:flex md:items-center md:justify-end md:px-6 md:py-3 ml-64 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          {renderNotifications(false)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-xl px-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {user?.email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{user?.email}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded-md">
                    {user?.role}
                  </Badge>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="rounded-lg">
                <LogOut className="h-4 w-4 mr-2" />
                Wyloguj sie
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        <div className="container mx-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
