'use client';

import { Member } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Shield } from 'lucide-react';
import { getInitials, getRandomColor } from '../utils';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
      <CardContent className="p-3 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0 ${getRandomColor(member.id)}`}>
          {getInitials(member.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100">{member.name}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
            <Shield className="h-3 w-3" />
            <span className="capitalize">{member.role}</span>
          </div>
        </div>
        <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-blue-600 transition-colors">
          <Mail className="h-4 w-4" />
        </a>
      </CardContent>
    </Card>
  );
}
