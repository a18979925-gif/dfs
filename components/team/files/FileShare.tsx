'use client';

import { useState } from 'react';
import { useTeam } from '../TeamProvider';
import { UploadZone } from './UploadZone';
import { FileCard } from './FileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';

export function FileShare() {
  const { files, members, addFile, toggleFavoriteFile, addVersion } = useTeam();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const handleUpload = (name: string, size: string) => {
    addFile({ name, size });
  };

  const displayedFiles = filter === 'all' ? files : files.filter((f) => f.isFavorite);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Udostępnianie Plików i Wersjonowanie
        </h2>
        <p className="text-xs text-muted-foreground">
          Zarządzaj wersjami plików źródłowych i zasobami zespołu deweloperskiego
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={(val: any) => setFilter(val)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Wszystkie pliki ({files.length})</TabsTrigger>
              <TabsTrigger value="favorites">Ulubione ({files.filter((f) => f.isFavorite).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {displayedFiles.length === 0 ? (
                <Card className="text-center py-12 card-elevated">
                  <CardContent>
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm text-muted-foreground">Brak plików w repozytorium</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      members={members}
                      onToggleFav={() => toggleFavoriteFile(file.id)}
                      onUploadNewVersion={(name, size) => addVersion(file.id, name, size)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {displayedFiles.length === 0 ? (
                <Card className="text-center py-12 card-elevated">
                  <CardContent>
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm text-muted-foreground">Brak ulubionych plików</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      members={members}
                      onToggleFav={() => toggleFavoriteFile(file.id)}
                      onUploadNewVersion={(name, size) => addVersion(file.id, name, size)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <UploadZone onUpload={handleUpload} />
        </div>
      </div>
    </div>
  );
}
