'use client';

import { useState } from 'react';
import { useTeam } from '../TeamProvider';
import { MemberRole } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Check, Link as LinkIcon, RefreshCw, X } from 'lucide-react';

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PendingInvite {
  id: string;
  email: string;
  role: MemberRole;
  expiresAt: string;
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const { addMember } = useTeam();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('Developer');
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    { id: 'inv1', email: 'tester@dfs.com', role: 'QA', expiresAt: '24h' },
  ]);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Simulate adding to team
    const name = email.split('@')[0];
    addMember({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      role,
      avatar: name.slice(0, 2).toUpperCase(),
      email,
      status: 'Idle',
      timezone: 'GMT+2',
    });

    const newInv: PendingInvite = {
      id: Math.random().toString(),
      email,
      role,
      expiresAt: '24h',
    };
    setPendingInvites((prev) => [...prev, newInv]);

    setEmail('');
    setRole('Developer');
    onOpenChange(false);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText('https://dfs.com/invite/token-xyz123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cancelInvite = (id: string) => {
    setPendingInvites(pendingInvites.filter((inv) => inv.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Zaproś członka zespołu</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Adres E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@przyklad.com"
                className="pl-10 input-modern"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rola w zespole</Label>
            <select
              value={role}
              onChange={(e: any) => setRole(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="Lead">Lead Developer</option>
              <option value="Developer">Developer</option>
              <option value="QA">QA Specialist</option>
              <option value="Designer">UI/UX Designer</option>
              <option value="Viewer">Viewer</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={copyInviteLink}
              className="rounded-xl gap-1.5"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
              {copied ? 'Skopiowano!' : 'Kopiuj link'}
            </Button>
            <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
              Wyślij zaproszenie
            </Button>
          </div>
        </form>

        {pendingInvites.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase">Oczekujące zaproszenia</p>
            {pendingInvites.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                <div>
                  <p className="font-semibold">{inv.email}</p>
                  <p className="text-[10px] text-muted-foreground">{inv.role} · Wygaśnie za {inv.expiresAt}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-blue-500"
                    title="Wyślij ponownie"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => cancelInvite(inv.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-red-500"
                    title="Anuluj zaproszenie"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
