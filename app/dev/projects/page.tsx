'use client';

import { AppShell } from '@/components/layouts/app-shell';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
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
  MoreVertical,
  FileCode,
  BarChart3,
  Rocket,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, Project } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const sidebarItems = [
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/dev/dashboard' },
  { icon: <FolderGit2 className="h-5 w-5" />, label: 'Projects', href: '/dev/projects' },
  { icon: <Rocket className="h-5 w-5" />, label: 'Publish App', href: '/dev/publish' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/dev/chats' },
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
      .order('updated_at', { ascending: false });

    setProjects(data || []);
    setLoading(false);
  };

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-blue-600"
      brandIcon={<Code className="h-6 w-6" />}
      brandTitle="Developer Studio"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your application projects</p>
        </div>
        <Link href="/dev/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FolderGit2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to start building
            </p>
            <Link href="/dev/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <FileCode className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="text-xs">
                        v{project.version} - {new Date(project.updated_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dev/projects/${project.id}`}>Open</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      project.status === 'draft'
                        ? 'secondary'
                        : project.status === 'published'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {project.status}
                  </Badge>
                  <Link href={`/dev/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                      Open Editor
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
