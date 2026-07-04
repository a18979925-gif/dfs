'use client';

import { useTeam } from './TeamProvider';
import { Button } from '@/components/ui/button';
import { KanbanSquare, MessageSquare, FolderGit, Users, Video } from 'lucide-react';

export function TeamSidebar() {
  const { activeTab, setActiveTab, messages, tasks, files } = useTeam();

  const items = [
    { id: 'kanban', label: 'Tablica Kanban', icon: <KanbanSquare className="h-4 w-4" />, count: tasks.filter((t) => t.status !== 'done').length },
    { id: 'chat', label: 'Czat Zespołu', icon: <MessageSquare className="h-4 w-4" />, count: messages.length },
    { id: 'files', label: 'Udostępnianie Plików', icon: <FolderGit className="h-4 w-4" />, count: files.length },
    { id: 'meeting', label: 'Teams / Spotkania', icon: <Video className="h-4 w-4" /> },
    { id: 'presence', label: 'Statusy / Obecność', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
      {items.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? 'default' : 'ghost'}
          onClick={() => setActiveTab(item.id)}
          className={`w-full justify-between h-10 px-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            {item.icon}
            {item.label}
          </div>
          {item.count !== undefined && item.count > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {item.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}
