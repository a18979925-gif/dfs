'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, RotateCcw, Download } from 'lucide-react';

interface DownloadHistory {
  id: string;
  appTitle: string;
  date: string;
  version: string;
  status: 'completed' | 'in_progress' | 'failed';
  size: string;
}

interface DownloadHistoryProps {
  history: DownloadHistory[];
  onRetry?: (id: string) => void;
}

export function DownloadHistoryPanel({ history, onRetry }: DownloadHistoryProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Historia pobierań
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Brak historii pobierań
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.appTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.date} · v{item.version} ({item.size})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[item.status]} variant="outline">
                    {item.status === 'completed' && 'Ukończone'}
                    {item.status === 'in_progress' && 'W trakcie'}
                    {item.status === 'failed' && 'Nieudane'}
                  </Badge>
                  {item.status === 'failed' && onRetry && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRetry(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
