'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

interface TeamCollaborationProps {
  teamMembers: TeamMember[];
  onInvite?: () => void;
}

export function TeamCollaboration({ teamMembers, onInvite }: TeamCollaborationProps) {
  const [invited, setInvited] = useState<string[]>([]);

  return (
    <Card className="card-elevated bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Zespół</span>
          <Button variant="outline" size="sm" className="rounded-lg" onClick={onInvite}>
            + Dodaj członka
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {teamMembers.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">Pracujesz sam? Zaproś zespół!</p>
            <Button size="sm" onClick={onInvite}>
              Zaproś pierwszego członka
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/75 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-xs font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
