'use client';

import { useTeam } from '../TeamProvider';
import { ChatMessageItem } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Activity } from 'lucide-react';

export function ChatRoom() {
  const { messages, members, addMessage, events } = useTeam();
  const currentUserId = '1'; // Andrzej is current user

  const handleSendMessage = (text: string) => {
    addMessage(text, currentUserId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">
      <div className="lg:col-span-2 flex flex-col border border-slate-150 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden h-full">
        <div className="flex items-center gap-2.5 p-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Czat Zespołu</h3>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                members={members}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </ScrollArea>

        <ChatInput onSend={handleSendMessage} />
      </div>

      {/* Activity Feed inside Chat Room */}
      <div className="flex flex-col border border-slate-150 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden h-full">
        <div className="flex items-center gap-2 p-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
          <Activity className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Dziennik Aktywności</h3>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {events.map((evt) => (
              <div key={evt.id} className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{evt.userName}</span>
                <span className="text-muted-foreground mx-1">{evt.action}</span>
                <span className="font-medium">{evt.target}</span>
                <span className="block text-[10px] text-muted-foreground mt-1">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
