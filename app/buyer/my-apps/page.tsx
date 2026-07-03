'use client';

import { useEffect, useState } from 'react';
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
  ShoppingBag,
  Store,
  Package,
  MessageSquare,
  Download,
  Calendar,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { supabase, License } from '@/lib/supabase';

const sidebarItems = [
  { icon: <ShoppingBag className="h-5 w-5" />, label: 'Dashboard', href: '/buyer/dashboard' },
  { icon: <Store className="h-5 w-5" />, label: 'Marketplace', href: '/buyer/marketplace' },
  { icon: <Package className="h-5 w-5" />, label: 'My Apps', href: '/buyer/my-apps' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/buyer/chats' },
];

interface MyAppItem {
  chatId: string;
  app: any;
  created_at: string;
}

export default function MyAppsPage() {
  const { user } = useAuth();
  const [myApps, setMyApps] = useState<MyAppItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyApps();
    }
  }, [user]);

  const fetchMyApps = async () => {
    const { data: chats } = await supabase
      .from('chats')
      .select('*, app:apps(*)')
      .contains('participants', [user!.id]);

    const appsInChat = chats
      ? chats
          .filter((c) => c.app !== null)
          .map((c) => ({
            chatId: c.id,
            app: c.app,
            created_at: c.created_at,
          }))
      : [];

    setMyApps(appsInChat);
    setLoading(false);
  };

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-emerald-600"
      brandIcon={<ShoppingBag className="h-6 w-6" />}
      brandTitle="Buyer Portal"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Moje Aplikacje</h1>
        <p className="text-muted-foreground">Aplikacje, o które pytałeś deweloperów lub które otrzymałeś w czacie</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Wczytywanie...</div>
      ) : myApps.length === 0 ? (
        <Card className="text-center py-12 card-elevated">
          <CardContent>
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Brak aplikacji</h3>
            <p className="text-muted-foreground mb-4">
              Nie rozmawiałeś jeszcze z żadnym deweloperem o aplikacjach.
            </p>
            <Link href="/buyer/marketplace">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                <Store className="h-4 w-4 mr-2" />
                Przeglądaj Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myApps.map((item) => (
            <Card key={item.chatId} className="card-elevated hover:border-emerald-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                      <Package className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.app?.title || 'Aplikacja'}</CardTitle>
                      <CardDescription>
                        Cena: {item.app?.price > 0 ? `$${item.app.price}` : 'Za darmo'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.app?.description || 'Brak opisu aplikacji.'}
                </p>
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-xs text-muted-foreground">
                    Rozpoczęto: {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <Link href={`/buyer/chats?chatId=${item.chatId}`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-xl">
                      <MessageSquare className="h-4 w-4" />
                      Pobierz ZIP / Otwórz czat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
