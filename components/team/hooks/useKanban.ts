'use client';

import { useTeam } from '../TeamProvider';
import { TaskStatus, Task } from '../types';

export function useKanban() {
  const { tasks, addTask, moveTask } = useTeam();

  return {
    tasks,
    addTask: (task: Omit<Task, 'id'>) => addTask(task),
    updateTaskStatus: (taskId: string, status: TaskStatus) => moveTask(taskId, status),
  };
}
