'use client';

import { useState, useEffect } from 'react';
import { useTeam } from './TeamProvider';
import { Button } from '@/components/ui/button';
import { InviteModal } from './members/InviteModal';
import { Bell, Command, UserPlus, Terminal, Search, AlertCircle, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function TeamHeader() {
  const { setActiveTab } = useTeam();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { label: 'Otwórz Tablicę Kanban', action: () => { setActiveTab('kanban'); setPaletteOpen(false); } },
    { label: 'Otwórz Czat Zespołowy', action: () => { setActiveTab('chat'); setPaletteOpen(false); } },
    { label: 'Otwórz Udostępnianie Plików', action: () => { setActiveTab('files'); setPaletteOpen(false); } },
    { label: 'Uruchom Teams / Udostępnij ekran', action: () => { setActiveTab('meeting'); setPaletteOpen(false); } },
    { label: 'Zaproś nowego członka', action: () => { setPaletteOpen(false); setInviteOpen(true); } },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setPaletteOpen(true)}
          className="rounded-xl h-10 px-3 border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs text-muted-foreground flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          <span>Wyszukaj...</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            Ctrl+K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setInviteOpen(true)}
          className="rounded-xl h-10 px-3 border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 gap-1.5"
        >
          <UserPlus className="h-4 w-4" />
          Zaproś dewelopera
        </Button>

        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-blue-600" />
        </Button>
      </div>

      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />

      {/* Command Palette Modal */}
      <Dialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <DialogContent className="max-w-md p-4 bg-white dark:bg-slate-900 border dark:border-slate-800">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <Command className="h-4 w-4 text-blue-600" />
              Paleta poleceń
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-3">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wpisz komendę..."
              className="input-modern"
              autoFocus
            />

            <div className="space-y-1 max-h-[220px] overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <p className="text-xs text-muted-foreground p-3 text-center">Brak pasujących poleceń</p>
              ) : (
                filteredCommands.map((c, i) => (
                  <button
                    key={i}
                    onClick={c.action}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs font-medium transition-colors"
                  >
                    {c.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
