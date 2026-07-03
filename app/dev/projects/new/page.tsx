'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { AppShell } from '@/components/layouts/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Code,
  FolderGit2,
  Plus,
  Rocket,
  MessageSquare,
  BarChart3,
  FileCode,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const sidebarItems = [
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/dev/dashboard' },
  { icon: <FolderGit2 className="h-5 w-5" />, label: 'Projects', href: '/dev/projects' },
  { icon: <Rocket className="h-5 w-5" />, label: 'Publish App', href: '/dev/publish' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/dev/chats' },
];

const defaultFiles = {
  'src/index.ts': `// Welcome to your project\nconsole.log('Hello, World!');\n`,
  'src/app.ts': `// Your application code\nexport function App() {\n  return 'My App';\n}\n`,
  'package.json': JSON.stringify({ name: 'my-app', version: '1.0.0' }, null, 2),
  'README.md': '# My Project\n\nA new application project.\n',
};

export default function NewProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        owner_id: user!.id,
        files: defaultFiles,
        status: 'draft',
      })
      .select()
      .single();

    if (data && !error) {
      router.push(`/dev/projects/${data.id}`);
    } else {
      setLoading(false);
    }
  };

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-blue-600"
      brandIcon={<Code className="h-6 w-6" />}
      brandTitle="Developer Studio"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Project
          </CardTitle>
          <CardDescription>
            Start a new application project with a ready-to-use file structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="my-awesome-app"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Initial Files</Label>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-sm font-mono">
              <div className="text-muted-foreground">
                {Object.keys(defaultFiles).map((file) => (
                  <div key={file} className="flex items-center gap-2 py-0.5">
                    <FileCode className="h-4 w-4" />
                    {file}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim() || loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
