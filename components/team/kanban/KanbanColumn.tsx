'use client';

import { Task, Member, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  members: Member[];
  onMoveTask: (taskId: string, status: TaskStatus) => void;
}

export function KanbanColumn({ title, status, tasks, members, onMoveTask }: KanbanColumnProps) {
  const columnColor = {
    todo: 'border-t-blue-500 bg-blue-50/10 dark:bg-blue-950/5',
    in_progress: 'border-t-amber-500 bg-amber-50/10 dark:bg-amber-950/5',
    review: 'border-t-purple-500 bg-purple-50/10 dark:bg-purple-950/5',
    done: 'border-t-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5',
  };

  return (
    <div className={`flex flex-col h-[520px] rounded-2xl border border-slate-100 dark:border-slate-800 border-t-4 p-4 shadow-sm ${columnColor[status]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
          {title}
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-850 text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-2">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
              Brak zadań
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                members={members}
                onMove={(nextStatus) => onMoveTask(task.id, nextStatus)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
