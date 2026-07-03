'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Code, ShoppingBag, Eye, CheckCircle2, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Role } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { getRedirectPath } from '@/components/auth-guard';

const roles: { key: Role; label: string; description: string; icon: React.ReactNode; gradient: string; bgGradient: string }[] = [
  {
    key: 'DEVELOPER',
    label: 'Developer',
    description: 'Tworz, publikuj i sprzedawaj aplikacje',
    icon: <Code className="h-8 w-8" />,
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50',
  },
  {
    key: 'BUYER',
    label: 'Buyer',
    description: 'Kupuj gotowe aplikacje i rozwiazania',
    icon: <ShoppingBag className="h-8 w-8" />,
    gradient: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50',
  },
  {
    key: 'VIEWER',
    label: 'Viewer',
    description: 'Przegladaj i odkrywaj aplikacje',
    icon: <Eye className="h-8 w-8" />,
    gradient: 'from-slate-600 to-slate-500',
    bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50',
  },
];

export default function OnboardingRolePage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, updateRole, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user && user.role !== 'VIEWER') {
      router.push(getRedirectPath(user.role));
    }
  }, [user, authLoading, router]);

  const handleSelectRole = async () => {
    if (!selectedRole) return;
    setLoading(true);

    const { error } = await updateRole(selectedRole);
    if (error) {
      console.error('Error updating role:', error);
    }

    router.push(getRedirectPath(selectedRole));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.role !== 'VIEWER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-violet-400/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl card-glass animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-violet-800 dark:from-white dark:via-blue-200 dark:to-violet-200 bg-clip-text text-transparent">
              Wybierz swoja role
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Jak chcesz korzystac z platformy?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role, index) => (
                <button
                  key={role.key}
                  onClick={() => setSelectedRole(role.key)}
                  className={cn(
                    'relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 animate-fade-up',
                    selectedRole === role.key
                      ? cn('border-transparent bg-gradient-to-br shadow-lg scale-105', role.bgGradient)
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  )}
                  style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                >
                  {selectedRole === role.key && (
                    <div className="absolute -top-2 -right-2 p-1 rounded-full bg-white dark:bg-slate-900 shadow-lg">
                      <CheckCircle2 className={cn('h-5 w-5', role.key === 'DEVELOPER' ? 'text-blue-600' : role.key === 'BUYER' ? 'text-emerald-600' : 'text-slate-600')} />
                    </div>
                  )}
                  <div
                    className={cn(
                      'mb-4 p-4 rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform',
                      role.gradient,
                      selectedRole === role.key && 'scale-110'
                    )}
                  >
                    {role.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{role.label}</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>

            <Button
              onClick={handleSelectRole}
              disabled={!selectedRole || loading}
              size="lg"
              className={cn(
                'w-full h-12 rounded-xl btn-shine transition-all duration-300',
                selectedRole
                  ? selectedRole === 'DEVELOPER'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    : selectedRole === 'BUYER'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                    : 'bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600'
                  : ''
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  Kontynuuj
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
