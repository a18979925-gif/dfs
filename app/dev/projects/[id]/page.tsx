'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { AppShell } from '@/components/layouts/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Code,
  FolderGit2,
  Rocket,
  MessageSquare,
  BarChart3,
  Save,
  Play,
  FileCode,
  Folder,
  ChevronRight,
  ChevronDown,
  Trash2,
  Plus,
  Upload,
  FolderPlus,
  FilePlus,
} from 'lucide-react';
import { supabase, Project } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';

const sidebarItems = [
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/dev/dashboard' },
  { icon: <FolderGit2 className="h-5 w-5" />, label: 'Projects', href: '/dev/projects' },
  { icon: <Rocket className="h-5 w-5" />, label: 'Publish App', href: '/dev/publish' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Chats', href: '/dev/chats' },
];

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

function buildFileTree(files: Record<string, string>): FileNode[] {
  const root: FileNode[] = [];

  Object.keys(files).sort().forEach((path) => {
    const parts = path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existing = current.find((n) => n.name === part);

      if (existing) {
        if (!isFile && existing.children) {
          current = existing.children;
        }
      } else {
        const node: FileNode = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };
        current.push(node);
        if (!isFile && node.children) {
          current = node.children;
        }
      }
    });
  });

  return root;
}

export default function ProjectEditorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [newFileName, setNewFileName] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  useEffect(() => {
    if (user && projectId) {
      fetchProject();
    }
  }, [user, projectId]);

  const fetchProject = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('owner_id', user!.id)
      .single();

    if (data) {
      setProject(data);
      setFiles(data.files as Record<string, string>);
      const fileKeys = Object.keys(data.files as Record<string, string>);
      if (fileKeys.length > 0) {
        setActiveFile(fileKeys[0]);
      }
    }
    setLoading(false);
  };

  const saveFiles = useCallback(async (newFiles: Record<string, string>) => {
    if (!project) return;
    setSaving(true);

    await supabase
      .from('projects')
      .update({
        files: newFiles,
        updated_at: new Date().toISOString(),
      })
      .eq('id', project.id);

    setSaving(false);
  }, [project]);

  const handleCodeChange = (content: string) => {
    if (!activeFile) return;
    const newFiles = { ...files, [activeFile]: content };
    setFiles(newFiles);

    // Debounced save
    setTimeout(() => saveFiles(newFiles), 500);
  };

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    let filePath = newFileName.trim();
    if (filePath.startsWith('/')) {
      filePath = filePath.slice(1);
    }
    if (files[filePath] !== undefined) {
      alert('File already exists');
      return;
    }
    const newFiles = { ...files, [filePath]: '' };
    setFiles(newFiles);
    setActiveFile(filePath);
    await saveFiles(newFiles);
    const parts = filePath.split('/');
    if (parts.length > 1) {
      const newExpanded = new Set(expandedFolders);
      for (let i = 1; i < parts.length; i++) {
        newExpanded.add(parts.slice(0, i).join('/'));
      }
      setExpandedFolders(newExpanded);
    }
    setNewFileName('');
    setIsAddingFile(false);
  };

  const handleAddFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    let folderPath = newFolderName.trim();
    if (folderPath.startsWith('/')) {
      folderPath = folderPath.slice(1);
    }
    if (folderPath.endsWith('/')) {
      folderPath = folderPath.slice(0, -1);
    }
    const placeholderPath = `${folderPath}/.keep`;
    if (files[placeholderPath] !== undefined) {
      alert('Folder already exists');
      return;
    }
    const newFiles = { ...files, [placeholderPath]: '' };
    setFiles(newFiles);
    await saveFiles(newFiles);
    const parts = folderPath.split('/');
    const newExpanded = new Set(expandedFolders);
    for (let i = 1; i <= parts.length; i++) {
      newExpanded.add(parts.slice(0, i).join('/'));
    }
    setExpandedFolders(newExpanded);
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  const handleDeletePath = async (path: string, type: 'file' | 'folder') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    let newFiles = { ...files };
    if (type === 'file') {
      delete newFiles[path];
      if (activeFile === path) {
        const remaining = Object.keys(newFiles);
        setActiveFile(remaining.length > 0 ? remaining[0] : null);
      }
    } else {
      const prefix = path + '/';
      Object.keys(newFiles).forEach((k) => {
        if (k === path || k.startsWith(prefix)) {
          delete newFiles[k];
        }
      });
      if (activeFile && (activeFile === path || activeFile.startsWith(prefix))) {
        const remaining = Object.keys(newFiles);
        setActiveFile(remaining.length > 0 ? remaining[0] : null);
      }
    }
    setFiles(newFiles);
    await saveFiles(newFiles);
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const zip = await JSZip.loadAsync(file);
      const newFiles = { ...files };
      const filePromises: Promise<{ path: string; content: string } | null>[] = [];
      zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
          const promise = zipEntry.async('string').then((content) => {
            return { path: relativePath, content };
          });
          filePromises.push(promise);
        }
      });
      const extracted = await Promise.all(filePromises);
      extracted.forEach((item) => {
        if (item) {
          newFiles[item.path] = item.content;
        }
      });
      setFiles(newFiles);
      const keys = Object.keys(newFiles);
      if (keys.length > 0 && (!activeFile || !newFiles[activeFile])) {
        setActiveFile(keys[0]);
      }
      await saveFiles(newFiles);
    } catch (err) {
      console.error('Failed to extract ZIP:', err);
      alert('Failed to parse ZIP file.');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (nodes: FileNode[], depth = 0): React.ReactNode => {
    return nodes.map((node) => (
      <div key={node.path} className="group/item relative">
        <div className="flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
          <button
            className={cn(
              'flex-1 flex items-center gap-2 py-1.5 px-2 text-sm text-left',
              activeFile === node.path && 'bg-blue-100 dark:bg-blue-900'
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(node.path);
              } else {
                setActiveFile(node.path);
              }
            }}
          >
            {node.type === 'folder' ? (
              <>
                {expandedFolders.has(node.path) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <Folder className="h-4 w-4 text-yellow-500" />
              </>
            ) : (
              <>
                <span className="w-3" />
                <FileCode className="h-4 w-4 text-blue-500" />
              </>
            )}
            <span className="truncate">{node.name}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePath(node.path, node.type);
            }}
            className="opacity-0 group-hover/item:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity mr-2"
            title={`Delete ${node.type}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        {node.type === 'folder' && node.children && expandedFolders.has(node.path) && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  const fileTree = buildFileTree(files);

  if (loading) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="bg-blue-600"
        brandIcon={<Code className="h-6 w-6" />}
        brandTitle="Developer Studio"
      >
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell
        sidebarItems={sidebarItems}
        headerColor="bg-blue-600"
        brandIcon={<Code className="h-6 w-6" />}
        brandTitle="Developer Studio"
      >
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <Button className="mt-4" onClick={() => router.push('/dev/projects')}>
            Back to Projects
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      sidebarItems={sidebarItems}
      headerColor="bg-blue-600"
      brandIcon={<Code className="h-6 w-6" />}
      brandTitle="Developer Studio"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            v{project.version} · {project.status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            {saving && (
              <>
                <Save className="h-3 w-3" />
                Saving...
              </>
            )}
          </div>
          <Button variant="outline" size="sm" disabled>
            <Play className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="rounded-lg border min-h-[600px]">
        {/* File Explorer */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-slate-50 dark:bg-slate-900 flex flex-col">
            <div className="p-2 border-b font-medium text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4" />
                Files
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setIsAddingFile(true);
                    setIsAddingFolder(false);
                  }}
                  title="New File"
                >
                  <FilePlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setIsAddingFolder(true);
                    setIsAddingFile(false);
                  }}
                  title="New Folder"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <label className="cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center justify-center h-7 w-7" title="Upload ZIP">
                  <Upload className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleZipUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Input forms for adding files/folders */}
            {isAddingFile && (
              <form onSubmit={handleAddFile} className="p-2 border-b bg-white dark:bg-slate-950 flex gap-1">
                <Input
                  size={1}
                  className="h-8 text-xs flex-1"
                  placeholder="src/utils.ts"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  autoFocus
                />
                <Button type="submit" size="sm" className="h-8 px-2 text-xs">Add</Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setIsAddingFile(false)}>Cancel</Button>
              </form>
            )}

            {isAddingFolder && (
              <form onSubmit={handleAddFolder} className="p-2 border-b bg-white dark:bg-slate-950 flex gap-1">
                <Input
                  size={1}
                  className="h-8 text-xs flex-1"
                  placeholder="components"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />
                <Button type="submit" size="sm" className="h-8 px-2 text-xs">Add</Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setIsAddingFolder(false)}>Cancel</Button>
              </form>
            )}

            <ScrollArea className="flex-1">
              <div className="py-1">{renderFileTree(fileTree)}</div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Code Editor */}
        <ResizablePanel defaultSize={50} minSize={30}>
          {activeFile ? (
            <div className="h-full flex flex-col">
              <div className="border-b px-4 py-2 font-mono text-sm bg-slate-100 dark:bg-slate-800">
                {activeFile}
              </div>
              <Textarea
                value={files[activeFile] || ''}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="flex-1 font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0 bg-white dark:bg-slate-950"
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a file to edit
            </div>
          )}
        </ResizablePanel>

        <ResizableHandle />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full bg-white dark:bg-slate-950 flex flex-col">
            <div className="border-b px-4 py-2 font-medium text-sm flex items-center gap-2 bg-slate-100 dark:bg-slate-800">
              <Play className="h-4 w-4" />
              Preview
            </div>
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Preview coming soon
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </AppShell>
  );
}
