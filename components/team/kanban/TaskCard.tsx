'use client';

import { Task, Member } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  members: Member[];
  onMove: (status: Task['status']) => void;
}

export function TaskCard({ task, members, onMove }: TaskCardProps) {
  const assignee = members.find((m) => m.id === task.assigneeId);
  const nextStatuses: Record<Task['status'], { next: Task['status']; label: string } | null> = {
    todo: { next: 'in_progress', label: 'Start' },
    in_progress: { next: 'review', label: 'Review' },
    review: { next: 'done', label: 'Zakończ' },
    done: null,
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-300',
  };

  return (
    <Card className="card-elevated hover-glow-dev bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={`rounded-full px-2 py-0 text-[10px] font-semibold uppercase ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {task.dueDate}
            </div>
          )}
        </div>

        <h4 className="font-semibold text-sm leading-snug text-slate-850 dark:text-slate-100 line-clamp-2">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="font-medium">{assignee ? assignee.name : 'Nieprzypisane'}</span>
          </div>

          {nextStatuses[task.status] && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMove(nextStatuses[task.status]!.next)}
              className="h-7 text-[11px] rounded-lg gap-1 px-2 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-950/30"
            >
              {nextStatuses[task.status]!.label}
              <ArrowRight className="h-3 w-3 text-blue-600" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
