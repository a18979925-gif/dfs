'use client';

import { useTeam } from './TeamProvider';
import { TeamSidebar } from './TeamSidebar';
import { TeamHeader } from './TeamHeader';
import { KanbanBoard } from './kanban/KanbanBoard';
import { ChatRoom } from './chat/ChatRoom';
import { FileShare } from './files/FileShare';
import { Presence } from './members/Presence';
import { ScreenShare } from './meeting/ScreenShare';
import { StandupTimer } from './meeting/StandupTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TeamWorkspace() {
  const { activeTab } = useTeam();

  return (
    <div className="space-y-6">
      <TeamHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <TeamSidebar />
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'kanban' && <KanbanBoard />}
          {activeTab === 'chat' && <ChatRoom />}
          {activeTab === 'files' && <FileShare />}
          {activeTab === 'presence' && <Presence />}
          
          {activeTab === 'meeting' && (
            <Tabs defaultValue="screen" className="w-full">
              <TabsList className="mb-6 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-1 max-w-[300px]">
                <TabsTrigger value="screen" className="rounded-lg">Share Screen</TabsTrigger>
                <TabsTrigger value="standup" className="rounded-lg">Daily Standup</TabsTrigger>
              </TabsList>
              <TabsContent value="screen">
                <ScreenShare />
              </TabsContent>
              <TabsContent value="standup">
                <StandupTimer />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
