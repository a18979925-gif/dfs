'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { AppShell } from '@/components/layouts/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Code,
  FolderGit2,
  Rocket,
  MessageSquare,
  BarChart3,
  Send,
  User,
  ArrowLeft,
  Paperclip,
  Download,
  Package,
} from 'lucide-react';
import { supabase, Chat, Message, Profile, App } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/dev/dashboard' },
  { icon: <FolderGit2 className="h-5 w-5" />, label: 'Projects', href: '/dev/projects' },
  { icon: <Rocket className="h-5 w-5" />, label: 'Publish App', href: '/dev/publish' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/dev/chats' },
];

export default function DevChatsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<(Chat & { otherUser?: Profile; app?: App | null })[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [dealPriceInput, setDealPriceInput] = useState('');

  // Derived state from messages
  const activeDeal = (() => {
    const statusMessages = messages
      .filter((m) => m.type === 'system')
      .map((m) => {
        try {
          return JSON.parse(m.content);
        } catch (e) {
          return null;
        }
      })
      .filter((content) => content && content.type === 'deal_status_update');

    if (statusMessages.length > 0) {
      const latest = statusMessages[statusMessages.length - 1];
      return {
        status: latest.status as 'negotiating' | 'agreed' | 'closed',
        price: latest.price as number,
      };
    }

    const selChat = chats.find((c) => c.id === selectedChatId);
    return {
      status: 'negotiating' as const,
      price: selChat?.app?.price || 0,
    };
  })();

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages();
      // Reset price input to default app price when selected chat changes
      const selChat = chats.find((c) => c.id === selectedChatId);
      if (selChat?.app) {
        setDealPriceInput(selChat.app.price.toString());
      }
    }
  }, [selectedChatId]);

  const fetchChats = async () => {
    const { data } = await supabase
      .from('chats')
      .select('*, app:apps(*)')
      .contains('participants', [user!.id])
      .order('updated_at', { ascending: false });

    if (data && data.length > 0) {
      const otherUserIds = data.map((c) =>
        c.participants.find((p: string) => p !== user!.id)
      );

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', otherUserIds);

      const chatsWithUsers = data.map((chat) => ({
        ...chat,
        otherUser: profiles?.find(
          (p) => p.id === chat.participants.find((p: string) => p !== user!.id)
        ),
      }));

      setChats(chatsWithUsers);
      if (!selectedChatId) {
        setSelectedChatId(chatsWithUsers[0]?.id);
      }
    }
    setLoading(false);
  };

  const updateDealStatus = async (status: 'negotiating' | 'agreed' | 'closed', price: number) => {
    if (!selectedChatId || !user) return;
    setSending(true);

    await supabase.from('messages').insert({
      chat_id: selectedChatId,
      sender_id: user.id,
      content: JSON.stringify({
        type: 'deal_status_update',
        status,
        price
      }),
      type: 'system',
    });

    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', selectedChatId);

    fetchMessages();
    setSending(false);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', selectedChatId)
      .order('created_at', { ascending: true });

    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChatId || !user) return;

    setSending(true);

    await supabase.from('messages').insert({
      chat_id: selectedChatId,
      sender_id: user.id,
      content: newMessage.trim(),
      type: 'text',
    });

    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', selectedChatId);

    setNewMessage('');
    fetchMessages();
    setSending(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChatId || !user) return;

    setSending(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      
      await supabase.from('messages').insert({
        chat_id: selectedChatId,
        sender_id: user.id,
        content: JSON.stringify({
          name: file.name,
          base64: base64String
        }),
        type: 'file',
      });

      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedChatId);

      fetchMessages();
      setSending(false);
    };
    reader.readAsDataURL(file);
  };
  const renderMessageContent = (message: Message, isOwn: boolean) => {
    if (message.type === 'system') {
      try {
        const payload = JSON.parse(message.content);
        if (payload.type === 'deal_status_update') {
          const statusColors = {
            negotiating: 'bg-amber-100/80 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
            agreed: 'bg-emerald-100/80 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
            closed: 'bg-slate-100/80 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
          };
          const statusLabels = {
            negotiating: 'Negocjacje w toku',
            agreed: 'Warunki zaakceptowane',
            closed: 'Zamknięte / Zakończone'
          };
          return (
            <div className={cn("flex flex-col items-center justify-center p-3 rounded-xl border text-center text-xs font-sans max-w-sm mx-auto shadow-sm my-2", statusColors[payload.status as 'negotiating' | 'agreed' | 'closed'])}>
              <span className="font-semibold text-xs mb-0.5">{statusLabels[payload.status as 'negotiating' | 'agreed' | 'closed']}</span>
              <span className="opacity-90">Ustalona cena: ${payload.price}</span>
            </div>
          );
        }
      } catch (e) {
        // Fallback to text
      }
      return <div className="text-center text-xs text-muted-foreground italic my-2">{message.content}</div>;
    }

    if (message.type === 'file') {
      try {
        const fileData = JSON.parse(message.content);
        
        const handleDownload = () => {
          const byteCharacters = atob(fileData.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/zip' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileData.name || 'app-delivery.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };

        return (
          <div className="flex flex-col gap-2 p-1 font-sans">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate max-w-[180px]">{fileData.name}</p>
                <p className="text-[10px] opacity-80">ZIP Archive</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownload}
              className="h-7 text-xs bg-white/20 hover:bg-white/30 text-white border-0 mt-1"
            >
              <Download className="h-3 w-3 mr-1" />
              Pobierz ZIP
            </Button>
          </div>
        );
      } catch (e) {
        return <p className="text-sm font-mono text-red-500">Błąd pliku</p>;
      }
    }

    return <p className="text-sm">{message.content}</p>;
  };

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-blue-600"
      brandIcon={<Code className="h-6 w-6" />}
      brandTitle="Developer Studio"
    >
      <Card className="h-[calc(100vh-200px)] min-h-[600px]">
        <div className="flex h-full">
          {/* Chat List */}
          <div className={cn(
            "w-80 border-r flex flex-col",
            selectedChatId && "hidden md:flex"
          )}>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : chats.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                      "w-full p-4 text-left border-b hover:bg-accent transition-colors",
                      selectedChatId === chat.id && "bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {chat.otherUser?.email || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.app_id ? 'About an app' : 'General'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat View */}
          <div className={cn(
            "flex-1 flex flex-col",
            !selectedChatId && "hidden md:flex"
          )}>
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedChatId(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedChat.otherUser?.email || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedChat.app_id ? 'About an app' : 'General conversation'}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <div className="flex-1 flex min-h-0">
                  {/* Left Column: Messages list & input */}
                  <div className="flex-grow flex flex-col min-h-0">
                    <ScrollArea className="flex-1 p-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          Start the conversation
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => {
                            const isOwn = message.sender_id === user?.id;
                            if (message.type === 'system') {
                              return (
                                <div key={message.id} className="flex justify-center w-full my-2">
                                  {renderMessageContent(message, isOwn)}
                                </div>
                              );
                            }
                            return (
                              <div
                                key={message.id}
                                className={cn(
                                  "flex",
                                  isOwn ? "justify-end" : "justify-start"
                                )}
                              >
                                <div
                                  className={cn(
                                    "max-w-[70%] rounded-lg px-4 py-2",
                                    isOwn
                                      ? "bg-blue-600 text-white"
                                      : "bg-muted"
                                  )}
                                >
                                  {renderMessageContent(message, isOwn)}
                                  <p className={cn(
                                    "text-[10px] mt-1",
                                    isOwn ? "text-blue-200" : "text-muted-foreground"
                                  )}>
                                    {new Date(message.created_at).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>

                    <div className="border-t p-4 bg-slate-50 dark:bg-slate-900/40">
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id="zip-upload"
                          accept=".zip"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 rounded-xl"
                          onClick={() => document.getElementById('zip-upload')?.click()}
                          disabled={sending}
                          title="Attach ZIP File"
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          className="rounded-xl bg-white dark:bg-slate-950"
                        />
                        <Button onClick={sendMessage} disabled={sending} className="rounded-xl">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: App Context & Deal Card Sidebar */}
                  <div className="hidden lg:flex w-80 flex-col bg-slate-50/50 dark:bg-slate-900/20 p-4 border-l space-y-4 shrink-0 overflow-y-auto">
                    {selectedChat.app ? (
                      <div className="space-y-4">
                        <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border space-y-2 shadow-sm">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Przypięta Aplikacja</span>
                          <h4 className="font-semibold text-sm">{selectedChat.app.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-3">{selectedChat.app.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedChat.app.tags?.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">{tag}</span>
                            ))}
                          </div>
                        </div>

                        {/* Deal Card */}
                        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-blue-900/40 space-y-3 shadow-md">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Karta Transakcji (Deal Card)</span>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Status transakcji:</p>
                            <span className={cn(
                              "text-xs px-2.5 py-1 rounded-full font-semibold inline-block",
                              activeDeal.status === 'negotiating' && "bg-amber-100 text-amber-800",
                              activeDeal.status === 'agreed' && "bg-emerald-100 text-emerald-800",
                              activeDeal.status === 'closed' && "bg-slate-100 text-slate-800"
                            )}>
                              {activeDeal.status === 'negotiating' ? 'Negocjacje' : activeDeal.status === 'agreed' ? 'Zaakceptowane' : 'Zamknięte'}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Ustalona cena:</p>
                            <p className="text-2xl font-bold">${activeDeal.price}</p>
                          </div>

                          <div className="border-t pt-3 space-y-3">
                            <p className="text-xs font-semibold">Aktualizuj stan rozmowy:</p>
                            <div className="space-y-2">
                              <div>
                                <label className="text-[10px] text-muted-foreground block mb-1">Wynegocjowana cena ($):</label>
                                <Input
                                  type="number"
                                  placeholder="Wpisz cenę..."
                                  value={dealPriceInput}
                                  onChange={(e) => setDealPriceInput(e.target.value)}
                                  className="h-8 text-xs rounded-lg"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <Button
                                  size="sm"
                                  onClick={() => updateDealStatus('agreed', Number(dealPriceInput))}
                                  disabled={sending || !dealPriceInput}
                                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                                >
                                  Akceptuj deal
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateDealStatus('closed', Number(dealPriceInput))}
                                  disabled={sending || !dealPriceInput}
                                  className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
                                >
                                  Zamknij
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-muted-foreground">
                        Brak powiązanej aplikacji dla tej rozmowy.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                  <p>Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
