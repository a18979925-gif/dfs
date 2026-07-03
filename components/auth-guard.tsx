'use client';

import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Role } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    router.push('/forbidden');
    return null;
  }

  return <>{children}</>;
}

export function useRoleGuard(allowedRoles: Role[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function getRedirectPath(role: Role): string {
  if (role === 'DEVELOPER') return '/dev/dashboard';
  if (role === 'BUYER') return '/buyer/dashboard';
  return '/viewer/home';
}
