'use client';

import { ChatMessage as ChatMessageType, Member } from '../types';
import { getInitials, getRandomColor } from '../utils';
import { Check, CheckCheck } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  members: Member[];
  currentUserId: string;
}

export function ChatMessageItem({ message, members, currentUserId }: ChatMessageProps) {
  const sender = members.find((m) => m.id === message.senderId);
  const isMe = message.senderId === currentUserId;

  return (
    <div className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[11px] font-bold shadow-sm shrink-0 ${sender ? getRandomColor(sender.id) : 'from-slate-400 to-slate-500'}`}>
        {sender ? getInitials(sender.name) : '?'}
      </div>

      <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-350">
            {sender ? sender.name : 'Unknown User'}
          </span>
          <span className="text-[9px] text-muted-foreground">{message.timestamp}</span>
        </div>

        <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
          {message.content}
        </div>

        {isMe && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
            {message.seenBy && message.seenBy.length > 1 ? (
              <>
                <CheckCheck className="h-3 w-3 text-blue-500" />
                <span>Przeczytano</span>
              </>
            ) : (
              <>
                <Check className="h-3 w-3" />
                <span>Doręczono</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
