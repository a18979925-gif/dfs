export type MemberRole = 'Owner' | 'Admin' | 'Lead' | 'Developer' | 'QA' | 'Designer' | 'Viewer' | 'Guest';

export type PresenceStatus = 'Available' | 'Busy' | 'Away' | 'Idle' | 'Meeting' | 'Working on';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  avatar: string;
  email: string;
  status: PresenceStatus;
  workingOn?: string;
  timezone: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  replies?: ChatMessage[];
  seenBy?: string[];
  delivered?: boolean;
}

export interface FileVersion {
  version: number;
  name: string;
  uploadedAt: string;
  size: string;
}

export interface SharedFile {
  id: string;
  name: string;
  size: string;
  uploaderId: string;
  uploadedAt: string;
  version: number;
  versions: FileVersion[];
  isFavorite: boolean;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}
