'use client';

import { useState, useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Code,
  FolderGit2,
  Rocket,
  MessageSquare,
  BarChart3,
  Upload,
  DollarSign,
  Tag,
} from 'lucide-react';
import { supabase, Project } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

const sidebarItems = [
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/dev/dashboard' },
  { icon: <FolderGit2 className="h-5 w-5" />, label: 'Projects', href: '/dev/projects' },
  { icon: <Rocket className="h-5 w-5" />, label: 'Publish App', href: '/dev/publish' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/dev/chats' },
];

const availableTags = [
  'SaaS', 'E-commerce', 'Dashboard', 'CRM', 'Analytics',
  'Productivity', 'Finance', 'Health', 'Education', 'Entertainment',
  'Social', 'Messaging', 'IoT', 'AI', 'API',
];

export default function PublishPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [selectedProject, setSelectedProject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [priceType, setPriceType] = useState<'one_time' | 'subscription'>('one_time');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user!.id)
      .neq('status', 'archived')
      .order('updated_at', { ascending: false });

    setProjects(data || []);
    setLoading(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePublish = async () => {
    if (!selectedProject || !title.trim()) return;

    setPublishing(true);

    const { data, error } = await supabase
      .from('apps')
      .insert({
        project_id: selectedProject,
        dev_id: user!.id,
        title,
        description,
        price: parseFloat(price) || 0,
        price_type: priceType,
        tags: selectedTags,
        status: 'active',
      })
      .select()
      .single();

    if (data && !error) {
      // Update project status
      await supabase
        .from('projects')
        .update({ status: 'published' })
        .eq('id', selectedProject);

      router.push(`/dev/apps/${data.id}`);
    } else {
      setPublishing(false);
    }
  };

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-blue-600"
      brandIcon={<Code className="h-6 w-6" />}
      brandTitle="Developer Studio"
    >
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Publish to Marketplace
            </CardTitle>
            <CardDescription>
              Make your project available to buyers on the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderGit2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  You need a project to publish
                </p>
                <Button onClick={() => router.push('/dev/projects/new')}>
                  Create a Project
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Select Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project to publish" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-2">
                            <span>{project.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {project.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">App Title</Label>
                  <Input
                    id="title"
                    placeholder="My Awesome App"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your app..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Price Type</Label>
                    <Select value={priceType} onValueChange={(v) => setPriceType(v as 'one_time' | 'subscription')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one_time">One-time purchase</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={!selectedProject || !title.trim() || publishing}
                  >
                    {publishing ? 'Publishing...' : 'Publish App'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
