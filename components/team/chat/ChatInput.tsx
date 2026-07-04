'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  const handleEmojiClick = () => {
    setText((prev) => prev + ' 🚀');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center p-3 border-t bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleEmojiClick}
        className="rounded-full shrink-0"
        title="Wstaw emoji"
      >
        <Smile className="h-5 w-5 text-muted-foreground" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full shrink-0"
        title="Załącz plik"
      >
        <Paperclip className="h-5 w-5 text-muted-foreground" />
      </Button>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Napisz do zespołu..."
        className="flex-1 h-10 px-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shrink-0">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
