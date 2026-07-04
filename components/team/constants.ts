import { Member, Task, SharedFile, ChatMessage } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Andrzej',
    role: 'Owner',
    avatar: 'A',
    email: 'andrzej@dfs.com',
    status: 'Available',
    workingOn: 'Refaktoryzacja Dashboardu Zespołowego',
    timezone: 'GMT+2',
  },
  {
    id: '2',
    name: 'John Doe',
    role: 'Lead',
    avatar: 'JD',
    email: 'john@dfs.com',
    status: 'Meeting',
    workingOn: 'Scrum daily sync',
    timezone: 'GMT+2',
  },
  {
    id: '3',
    name: 'Anna Kowalska',
    role: 'Designer',
    avatar: 'AK',
    email: 'anna@dfs.com',
    status: 'Working on',
    workingOn: 'Projektowanie UI dla karuzeli i filtrów',
    timezone: 'GMT+1',
  },
  {
    id: '4',
    name: 'Mike Smith',
    role: 'Developer',
    avatar: 'MS',
    email: 'mike@dfs.com',
    status: 'Busy',
    workingOn: 'Optymalizacja zapytań Supabase',
    timezone: 'GMT-5',
  },
  {
    id: '5',
    name: 'Tom Novak',
    role: 'QA',
    avatar: 'TN',
    email: 'tom@dfs.com',
    status: 'Idle',
    workingOn: 'Testy integracyjne WebRTC',
    timezone: 'GMT+2',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Dodać wsparcie dla WebRTC w ScreenShare',
    description: 'Należy użyć navigator.mediaDevices.getDisplayMedia w celu przechwytywania strumienia wideo.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: '1',
    dueDate: '2026-07-10',
  },
  {
    id: 't2',
    title: 'Zaprojektować ramy współpracy zespołowej (UI)',
    description: 'Stworzyć spójny system design-tokens dla trybu team mode.',
    status: 'done',
    priority: 'medium',
    assigneeId: '3',
    dueDate: '2026-07-03',
  },
  {
    id: 't3',
    title: 'Dostosować zapytania analityki 30 dniowej',
    description: 'Dynamicznie pobierać zdarzenia z tabeli analytics_events i licenses.',
    status: 'done',
    priority: 'high',
    assigneeId: '4',
    dueDate: '2026-07-04',
  },
  {
    id: 't4',
    title: 'Wdrożyć Command Palette (CTRL+K)',
    description: 'Szybkie akcje w workspace, np. zaproszenie członka, przejście do kanbana.',
    status: 'todo',
    priority: 'low',
    assigneeId: '1',
    dueDate: '2026-07-15',
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: '2',
    content: 'Cześć zespół! Czy WebRTC Screen Share jest gotowy?',
    timestamp: '10:30',
    seenBy: ['1', '3', '4'],
    delivered: true,
  },
  {
    id: 'm2',
    senderId: '1',
    content: 'Tak John, wdrożyłem natywne przechwytywanie ekranu w przeglądarce.',
    timestamp: '10:32',
    seenBy: ['2', '3', '4'],
    delivered: true,
  },
];

export const INITIAL_FILES: SharedFile[] = [
  {
    id: 'f1',
    name: 'globals.css',
    size: '8.3 KB',
    uploaderId: '1',
    uploadedAt: '2026-07-03',
    version: 3,
    versions: [
      { version: 1, name: 'globals.css', uploadedAt: '2026-07-03', size: '7.1 KB' },
      { version: 2, name: 'globals.css', uploadedAt: '2026-07-03', size: '8.0 KB' },
      { version: 3, name: 'globals.css', uploadedAt: '2026-07-03', size: '8.3 KB' },
    ],
    isFavorite: true,
  },
  {
    id: 'f2',
    name: 'README.md',
    size: '1.2 KB',
    uploaderId: '2',
    uploadedAt: '2026-07-02',
    version: 1,
    versions: [
      { version: 1, name: 'README.md', uploadedAt: '2026-07-02', size: '1.2 KB' },
    ],
    isFavorite: false,
  },
];
