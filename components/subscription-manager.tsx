'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Subscription {
  id: string;
  appTitle: string;
  price: number;
  renewalDate: string;
  status: 'active' | 'expiring_soon' | 'cancelled';
}

interface SubscriptionManagerProps {
  subscriptions: Subscription[];
  onCancel?: (id: string) => void;
  onRenew?: (id: string) => void;
}

export function SubscriptionManager({
  subscriptions,
  onCancel,
  onRenew,
}: SubscriptionManagerProps) {
  const statusConfig = {
    active: {
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Aktywna',
    },
    expiring_soon: {
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Wkrótce wygaśnie',
    },
    cancelled: {
      badge: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
      icon: <Clock className="h-4 w-4" />,
      label: 'Anulowana',
    },
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg">Subskrypcje</CardTitle>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Brak aktywnych subskrypcji
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => {
              const config = statusConfig[sub.status];
              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {config.icon}
                    <div>
                      <p className="text-sm font-medium">{sub.appTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        Odnawia się {sub.renewalDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">${sub.price}/msc</span>
                    <Badge className={config.badge} variant="outline">
                      {config.label}
                    </Badge>
                    {sub.status === 'active' && onCancel && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancel(sub.id)}
                        className="h-8"
                      >
                        Anuluj
                      </Button>
                    )}
                    {sub.status === 'expiring_soon' && onRenew && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRenew(sub.id)}
                        className="h-8"
                      >
                        Odnów
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
