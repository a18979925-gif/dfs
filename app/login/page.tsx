'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { getRedirectPath } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  Loader2,
  Sparkles,
  Code,
  ShoppingBag,
  Eye,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'VIEWER') {
        router.push('/onboarding/role');
      } else {
        router.push(getRedirectPath(user.role));
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div className="max-w-md text-center animate-fade-up">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 mb-8">
              <Sparkles className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
              Platforma App
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Twórz, publikuj i sprzedawaj aplikacje w jednym miejscu
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 mb-2">
                  <Code className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Developer</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 mb-2">
                  <ShoppingBag className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Buyer</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/50 mb-2">
                  <Eye className="h-5 w-5 text-slate-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Viewer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
          <Card className="w-full max-w-md card-glass animate-scale-in">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden flex items-center justify-center mb-6">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                  <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Witaj ponownie</CardTitle>
              <CardDescription>
                Zaloguj się na swoje konto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ty@przyklad.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Haslo</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Wpisz haslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="input-modern"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 btn-shine bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Logowanie...
                    </>
                  ) : (
                    <>
                      Zaloguj sie
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">lub</span>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Nie masz konta?{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Zarejestruj sie
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
