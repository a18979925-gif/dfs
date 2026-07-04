'use client';

import { SharedFile, Member } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Download, FileCode, Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface FileCardProps {
  file: SharedFile;
  members: Member[];
  onToggleFav: () => void;
  onUploadNewVersion: (name: string, size: string) => void;
}

export function FileCard({ file, members, onToggleFav, onUploadNewVersion }: FileCardProps) {
  const uploader = members.find((m) => m.id === file.uploaderId);
  const [showVersions, setShowVersions] = useState(false);

  const simulateUpdate = () => {
    onUploadNewVersion(file.name, '9.5 KB');
  };

  return (
    <Card className="card-elevated hover-glow-dev bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
              <FileCode className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate max-w-[150px]" title={file.name}>
                {file.name}
              </h4>
              <p className="text-[11px] text-muted-foreground">{file.size} · v{file.version}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFav}
            className="h-8 w-8 text-amber-500"
          >
            <Star className={`h-4 w-4 ${file.isFavorite ? 'fill-amber-400' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-slate-50 dark:border-slate-800">
          <span>Przesłał: {uploader ? uploader.name : 'Unknown'}</span>
          <span>{file.uploadedAt}</span>
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowVersions(!showVersions)}
            className="h-7 text-[11px] rounded-lg gap-1 px-2"
          >
            <History className="h-3 w-3" />
            Historia
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={simulateUpdate}
            className="h-7 text-[11px] rounded-lg gap-1 px-2 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-950/30"
          >
            Aktualizuj
          </Button>

          <Button
            size="sm"
            className="h-7 text-[11px] rounded-lg gap-1 px-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-3 w-3" />
            Pobierz
          </Button>
        </div>

        {showVersions && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 animate-fade-in">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Historia wersji</p>
            {file.versions.map((ver) => (
              <div key={ver.version} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="font-medium text-slate-700 dark:text-slate-300">Wersja v{ver.version}</span>
                <span className="text-[10px] text-muted-foreground">{ver.uploadedAt} · {ver.size}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
