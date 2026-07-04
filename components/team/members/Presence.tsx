'use client';

import { useTeam } from '../TeamProvider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials, getRandomColor } from '../utils';
import { Globe, Clock, Monitor } from 'lucide-react';

export function Presence() {
  const { members } = useTeam();

  const statusColors = {
    Available: 'bg-green-500 ring-green-150',
    Busy: 'bg-red-500 ring-red-150',
    Away: 'bg-amber-500 ring-amber-150',
    Idle: 'bg-slate-400 ring-slate-200',
    Meeting: 'bg-purple-500 ring-purple-150',
    'Working on': 'bg-blue-500 ring-blue-150',
  };

  const statusLabels = {
    Available: 'Dostępny',
    Busy: 'Zajęty',
    Away: 'Zaraz wracam',
    Idle: 'Nieaktywny',
    Meeting: 'Na spotkaniu',
    'Working on': 'Pracuje nad',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Status Obecności Zespołu</h3>
        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300">
          Aktywni: {members.filter((m) => m.status !== 'Idle').length}/{members.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="card-elevated hover-glow-dev bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <CardContent className="p-4 flex gap-4 items-start">
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shadow-md ${getRandomColor(member.id)}`}>
                  {getInitials(member.name)}
                </div>
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${statusColors[member.status]}`} />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm truncate text-slate-850 dark:text-slate-100">{member.name}</h4>
                  <Badge variant="outline" className="text-[10px] rounded-lg">
                    {member.role}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Monitor className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {statusLabels[member.status]} {member.workingOn && `: ${member.workingOn}`}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>{member.timezone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
