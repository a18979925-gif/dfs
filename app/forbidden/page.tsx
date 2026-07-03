import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldX, ArrowLeft, User } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <Card className="w-full max-w-md card-glass animate-scale-in text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
            <ShieldX className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Brak dostepu</CardTitle>
          <CardDescription>
            Nie masz uprawnien do wyswietlenia tej strony. Skontaktuj sie z administratorem jesli uwazasz, ze to blad.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/onboarding/role" className="block">
            <Button variant="default" className="w-full rounded-xl">
              <User className="h-4 w-4 mr-2" />
              Zmien role
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Inne konto
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
