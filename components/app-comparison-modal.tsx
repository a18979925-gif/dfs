'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { App } from '@/lib/supabase';
import { CheckCircle2, X, Star, Download } from 'lucide-react';

interface ComparisonModalProps {
  apps: App[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppComparisonModal({
  apps,
  open,
  onOpenChange,
}: ComparisonModalProps) {
  const features = ['price', 'rating', 'downloads', 'tags', 'type'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Porównaj aplikacje</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Cecha</th>
                {apps.map((app) => (
                  <th key={app.id} className="text-center py-3 px-4 font-semibold">
                    <div className="text-xs font-normal text-muted-foreground truncate">
                      {app.title}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-medium capitalize">{feature}</td>
                  {apps.map((app) => (
                    <td key={app.id} className="text-center py-3 px-4">
                      {feature === 'price' && `$${app.price}`}
                      {feature === 'rating' && (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {app.rating.toFixed(1)}
                        </div>
                      )}
                      {feature === 'downloads' && (
                        <div className="flex items-center justify-center gap-1">
                          <Download className="h-4 w-4" />
                          {app.downloads}
                        </div>
                      )}
                      {feature === 'tags' && (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {app.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {feature === 'type' && (
                        <Badge
                          variant={app.price_type === 'subscription' ? 'default' : 'secondary'}
                        >
                          {app.price_type === 'subscription' ? 'Sub' : 'One-time'}
                        </Badge>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zamknij
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
