'use client';

import { useTeam } from '../TeamProvider';

export function useChat() {
  const { messages, addMessage } = useTeam();

  return {
    messages,
    sendMessage: (content: string, senderId: string) => addMessage(content, senderId),
  };
}
