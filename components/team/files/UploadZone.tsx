'use client';

import { useState } from 'react';
import { UploadCloud, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onUpload: (name: string, size: string) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUpload(file.name, (file.size / 1024).toFixed(1) + ' KB');
    }
  };

  const triggerUpload = () => {
    const names = ['index.tsx', 'app-shell.tsx', 'utils.ts', 'useAuth.ts', 'route.ts'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    onUpload(randomName, (Math.random() * 15 + 2).toFixed(1) + ' KB');
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[180px] ${isDragActive ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20'}`}
    >
      <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
      <h3 className="font-semibold text-sm mb-1">Przeciągnij i upuść pliki</h3>
      <p className="text-xs text-muted-foreground mb-4">Obsługiwane pliki: ts, tsx, js, json, css, md (Max 10MB)</p>
      
      <Button
        type="button"
        onClick={triggerUpload}
        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
      >
        <FileCode className="h-4 w-4 mr-2" />
        Wybierz plik z komputera
      </Button>
    </div>
  );
}
