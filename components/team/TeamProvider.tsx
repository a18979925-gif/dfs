'use client';

import React, { createContext, useContext, useState } from 'react';
import { Member, Task, ChatMessage, SharedFile, ActivityEvent } from './types';
import { INITIAL_MEMBERS, INITIAL_TASKS, INITIAL_MESSAGES, INITIAL_FILES } from './constants';

interface TeamContextType {
  members: Member[];
  tasks: Task[];
  messages: ChatMessage[];
  files: SharedFile[];
  events: ActivityEvent[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  moveTask: (taskId: string, status: Task['status']) => void;
  addMessage: (content: string, senderId: string) => void;
  addFile: (file: Omit<SharedFile, 'id' | 'version' | 'versions' | 'uploadedAt' | 'uploaderId' | 'isFavorite'>) => void;
  toggleFavoriteFile: (fileId: string) => void;
  addVersion: (fileId: string, name: string, size: string) => void;
  logActivity: (userId: string, action: string, target: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [files, setFiles] = useState<SharedFile[]>(INITIAL_FILES);
  const [events, setEvents] = useState<ActivityEvent[]>([
    {
      id: 'e1',
      userId: '1',
      userName: 'Andrzej',
      action: 'started',
      target: 'refactoring components',
      timestamp: '10:00',
    },
    {
      id: 'e2',
      userId: '2',
      userName: 'John Doe',
      action: 'joined',
      target: 'the workspace',
      timestamp: '10:15',
    },
  ]);
  const [activeTab, setActiveTab] = useState<string>('kanban');

  const logActivity = (userId: string, action: string, target: string) => {
    const user = members.find((m) => m.id === userId);
    const newEvent: ActivityEvent = {
      id: Math.random().toString(),
      userId,
      userName: user ? user.name : 'Unknown User',
      action,
      target,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const addMember = (m: Omit<Member, 'id'>) => {
    const id = (members.length + 1).toString();
    const newMember: Member = { ...m, id };
    setMembers((prev) => [...prev, newMember]);
    logActivity('1', 'invited', m.name);
  };

  const addTask = (t: Omit<Task, 'id'>) => {
    const id = 't' + (tasks.length + 1).toString();
    const newTask: Task = { ...t, id };
    setTasks((prev) => [...prev, newTask]);
    logActivity('1', 'created task', t.title);
  };

  const moveTask = (taskId: string, status: Task['status']) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    const statusLabels: Record<string, string> = {
      todo: 'Do zrobienia',
      in_progress: 'W toku',
      review: 'Do weryfikacji',
      done: 'Zakończone',
    };
    logActivity('1', 'moved task to', `${statusLabels[status]} (${task.title})`);
  };

  const addMessage = (content: string, senderId: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(),
      senderId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      delivered: true,
      seenBy: [senderId],
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addFile = (file: Omit<SharedFile, 'id' | 'version' | 'versions' | 'uploadedAt' | 'uploaderId' | 'isFavorite'>) => {
    const id = 'f' + (files.length + 1).toString();
    const dateStr = new Date().toISOString().split('T')[0];
    const newFile: SharedFile = {
      id,
      name: file.name,
      size: file.size,
      uploaderId: '1',
      uploadedAt: dateStr,
      version: 1,
      versions: [{ version: 1, name: file.name, uploadedAt: dateStr, size: file.size }],
      isFavorite: false,
    };
    setFiles((prev) => [...prev, newFile]);
    logActivity('1', 'uploaded file', file.name);
  };

  const toggleFavoriteFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const addVersion = (fileId: string, name: string, size: string) => {
    const dateStr = new Date().toISOString().split('T')[0];
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          const nextVer = f.version + 1;
          const nextVersions = [
            ...f.versions,
            { version: nextVer, name, uploadedAt: dateStr, size },
          ];
          return {
            ...f,
            name,
            size,
            version: nextVer,
            versions: nextVersions,
          };
        }
        return f;
      })
    );
    logActivity('1', 'uploaded new version of', name);
  };

  return (
    <TeamContext.Provider
      value={{
        members,
        tasks,
        messages,
        files,
        events,
        activeTab,
        setActiveTab,
        addMember,
        addTask,
        moveTask,
        addMessage,
        addFile,
        toggleFavoriteFile,
        addVersion,
        logActivity,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
