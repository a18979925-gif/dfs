'use client';

import { useState } from 'react';
import { useTeam } from '../TeamProvider';
import { KanbanColumn } from './KanbanColumn';
import { TaskStatus, TaskPriority } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

export function KanbanBoard() {
  const { tasks, members, addTask, moveTask } = useTeam();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newAssignee, setNewAssignee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle,
      description: newDesc,
      status: 'todo',
      priority: newPriority,
      assigneeId: newAssignee || undefined,
      dueDate: new Date().toISOString().split('T')[0],
    });

    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setNewAssignee('');
    setShowAddForm(false);
  };

  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'Do zrobienia', status: 'todo' },
    { title: 'W toku', status: 'in_progress' },
    { title: 'Weryfikacja', status: 'review' },
    { title: 'Zakończone', status: 'done' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Tablica Kanban (Asana Mode)
          </h2>
          <p className="text-xs text-muted-foreground">
            Zarządzaj zadaniami zespołu i śledź postępy sprintu
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/25"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? 'Anuluj' : 'Nowe Zadanie'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="card-glass border border-blue-100 dark:border-blue-900/50 animate-scale-in max-w-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Dodaj nowe zadanie</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Tytuł zadania</Label>
                <Input
                  id="task-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Co należy zrobić?"
                  required
                  className="input-modern"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-desc">Opis</Label>
                <textarea
                  id="task-desc"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Szczegóły zadania..."
                  className="w-full min-h-[80px] rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priorytet</Label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Przypisz do</Label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="">Wybierz członka...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11">
                Utwórz zadanie
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={tasks.filter((t) => t.status === col.status)}
            members={members}
            onMoveTask={moveTask}
          />
        ))}
      </div>
    </div>
  );
}
