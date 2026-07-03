'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { AppShell } from '@/components/layouts/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ShoppingBag,
  Store,
  Package,
  MessageSquare,
  Star,
  Download,
  Play,
  ShoppingBasket,
  MessageCircle,
  Folder,
  FileCode,
  Terminal,
  PlayCircle,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase, App } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const sidebarItems = [
  { icon: <ShoppingBag className="h-5 w-5" />, label: 'Dashboard', href: '/buyer/dashboard' },
  { icon: <Store className="h-5 w-5" />, label: 'Marketplace', href: '/buyer/marketplace' },
  { icon: <Package className="h-5 w-5" />, label: 'My Apps', href: '/buyer/my-apps' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/buyer/chats' },
];

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const appId = params.id as string;

  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [owned, setOwned] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [previewFiles, setPreviewFiles] = useState<Record<string, string>>({});
  const [activePreviewFile, setActivePreviewFile] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['Sandbox active. Press Run to compile and start.']);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (appId && user) {
      fetchApp();
    }
  }, [appId, user]);

  const fetchApp = async () => {
    const { data } = await supabase
      .from('apps')
      .select('*, dev:profiles!dev_id(email)')
      .eq('id', appId)
      .single();

    if (data) {
      setApp(data);

      if (data.project_id) {
        const { data: proj } = await supabase
          .from('projects')
          .select('files')
          .eq('id', data.project_id)
          .maybeSingle();

        if (proj && proj.files && Object.keys(proj.files).length > 0) {
          const projectFiles = proj.files as Record<string, string>;
          setPreviewFiles(projectFiles);
          setActivePreviewFile(Object.keys(projectFiles)[0]);
        } else {
          const mockFiles = {
            'index.ts': `// Entry Point for ${data.title}\nimport { Server } from "./server";\n\nconst server = new Server();\nserver.start(3000);\n`,
            'server.ts': `// Express server setup\nexport class Server {\n  start(port: number) {\n    console.log("Server listening on port " + port);\n    console.log("Ready to handle marketplace requests for ${data.title}");\n  }\n}\n`,
            'README.md': `# ${data.title}\n\nTech Stack: ${data.tags?.join(', ') || 'TypeScript'}\n\nThis is an interactive demo preview sandbox.`,
          };
          setPreviewFiles(mockFiles);
          setActivePreviewFile('README.md');
        }
      } else {
        const mockFiles = {
          'index.ts': `// Sandbox Entry Point for ${data.title}\nconsole.log("Initializing local runtime...");\n`,
          'README.md': `# ${data.title}\n\nThis app was published directly. Start the sandbox console to see details.`,
        };
        setPreviewFiles(mockFiles);
        setActivePreviewFile('README.md');
      }

      // Check if user already owns this
      const { data: license } = await supabase
        .from('licenses')
        .select('id')
        .eq('user_id', user!.id)
        .eq('app_id', appId)
        .maybeSingle();

      setOwned(!!license);
    }
    setLoading(false);
  };

  const runDemo = () => {
    if (!app) return;
    setIsRunning(true);
    setConsoleLogs((prev) => [...prev, `> npm run start`, `[info] Compiling application files...`]);

    setTimeout(() => {
      setConsoleLogs((prev) => [
        ...prev,
        `[success] Compiled successfully.`,
        `[info] Sandbox Port: 3000`,
        `[log] Loading stack dependencies...`,
        `[log] Modules loaded successfully: ${app.tags?.join(', ') || 'none'}`
      ]);
      setIsRunning(false);
    }, 1200);
  };

  const handlePurchase = async () => {
    if (!user || !app) return;

    setPurchasing(true);

    const { error } = await supabase.from('licenses').insert({
      user_id: user.id,
      app_id: app.id,
      type: 'personal',
      price_paid: app.price,
    });

    if (!error) {
      setOwned(true);
    }
    setPurchasing(false);
  };

  const handleChat = async () => {
    if (!user || !app) return;

    // Create or get existing chat with developer
    const { data: existing } = await supabase
      .from('chats')
      .select('id')
      .contains('participants', [user.id, app.dev_id])
      .maybeSingle();

    let chatId = existing?.id;

    if (!existing) {
      const { data: newChat } = await supabase
        .from('chats')
        .insert({
          participants: [user.id, app.dev_id],
          app_id: app.id,
        })
        .select()
        .single();
      
      chatId = newChat?.id;

      if (newChat) {
        // Automatically send the template message to set context
        await supabase.from('messages').insert({
          chat_id: newChat.id,
          sender_id: user.id,
          content: `Hi, I'm interested in your app "${app.title}". Is it available? What price?`,
          type: 'text',
        });
      }
    }

    if (chatId) {
      router.push(`/buyer/chats?chatId=${chatId}`);
    }
  };

  if (loading) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="bg-emerald-600"
        brandIcon={<ShoppingBag className="h-6 w-6" />}
        brandTitle="Buyer Portal"
      >
        <div className="text-center py-12">Loading...</div>
      </AppShell>
    );
  }

  if (!app) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="bg-emerald-600"
        brandIcon={<ShoppingBag className="h-6 w-6" />}
        brandTitle="Buyer Portal"
      >
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">App not found</h3>
            <Button onClick={() => router.push('/buyer/marketplace')}>Back to Marketplace</Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-emerald-600"
      brandIcon={<ShoppingBag className="h-6 w-6" />}
      brandTitle="Buyer Portal"
    >
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{app.title}</CardTitle>
                  <CardDescription>by {app.dev?.email || 'Unknown Developer'}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {app.rating > 0 ? (
                    <>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{app.rating.toFixed(1)}</span>
                    </>
                  ) : (
                    <Badge variant="secondary">New</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {app.description || 'No description available'}
              </p>

              <div className="flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {app.downloads} downloads
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => setShowPreview(true)} className="w-full h-32 flex flex-col gap-2">
                <Play className="h-8 w-8" />
                <span>Try Demo</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 card-elevated">
            <CardHeader>
              <CardTitle>Kontakt z twórcą</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {app.price > 0 ? `$${app.price}` : 'Za darmo'}
                </p>
                {app.price_type === 'subscription' && (
                  <p className="text-xs text-muted-foreground">/miesiąc</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Aby uzyskać dostęp do tej aplikacji lub omówić warunki wdrożenia, skontaktuj się bezpośrednio z deweloperem.
              </p>

              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md text-white rounded-xl"
                onClick={handleChat}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                I'm Interested / Ask Developer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[600px] flex flex-col p-0 overflow-hidden bg-slate-900 text-slate-100 border-slate-800">
          <DialogHeader className="p-6 pb-2 border-b border-slate-800 bg-slate-950">
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>{app.title} - Interactive Preview Sandbox</span>
              <Button
                size="sm"
                onClick={runDemo}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 mr-6 h-8"
              >
                <PlayCircle className="h-4 w-4" />
                {isRunning ? 'Running...' : 'Run Sandbox'}
              </Button>
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Browse project files and execute simulated runtime tests.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex min-h-0">
            {/* File Sidebar */}
            <div className="w-1/3 border-r border-slate-800 bg-slate-950 flex flex-col">
              <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                Workspace Files
              </div>
              <ScrollArea className="flex-grow">
                <div className="p-2 space-y-1">
                  {Object.keys(previewFiles).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => setActivePreviewFile(filename)}
                      className={cn(
                        'w-full flex items-center gap-2 p-2 rounded text-left text-xs font-mono transition-colors',
                        activePreviewFile === filename
                          ? 'bg-blue-900/40 text-blue-300 font-semibold'
                          : 'hover:bg-slate-900 text-slate-400'
                      )}
                    >
                      {filename.endsWith('.md') ? (
                        <FileCode className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <FileCode className="h-3.5 w-3.5 text-blue-500" />
                      )}
                      <span className="truncate">{filename}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Code & Console Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
              {/* File Viewer */}
              <div className="flex-1 flex flex-col min-h-0 border-b border-slate-800">
                <div className="p-3 text-xs font-mono text-slate-400 bg-slate-900 border-b border-slate-800">
                  {activePreviewFile || 'No file selected'}
                </div>
                <ScrollArea className="flex-grow p-4 font-mono text-xs text-slate-300 whitespace-pre overflow-auto bg-slate-900">
                  <code>{activePreviewFile ? previewFiles[activePreviewFile] : '// Select a file to view code'}</code>
                </ScrollArea>
              </div>

              {/* Console logs */}
              <div className="h-44 bg-black p-3 font-mono text-[11px] flex flex-col">
                <div className="flex items-center gap-2 pb-1.5 text-slate-500 border-b border-slate-900 uppercase tracking-wider text-[10px] font-bold">
                  <Terminal className="h-3 w-3" />
                  Console Logs
                </div>
                <ScrollArea className="flex-grow mt-2">
                  <div className="space-y-1 text-slate-400">
                    {consoleLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          log.startsWith('>') && 'text-blue-400',
                          log.startsWith('[success]') && 'text-emerald-400',
                          log.startsWith('[error]') && 'text-red-400'
                        )}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
