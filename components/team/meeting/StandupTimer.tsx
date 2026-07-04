'use client';

import { useState, useEffect } from 'react';
import { useTeam } from '../TeamProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '../utils';

export function StandupTimer() {
  const { members } = useTeam();
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per person
  const [isRunning, setIsRunning] = useState(false);
  const [yesterdayText, setYesterdayText] = useState('');
  const [todayText, setTodayText] = useState('');
  const [blockersText, setBlockersText] = useState('');
  const [savedNotes, setSavedNotes] = useState<any[]>([]);

  const speaker = members[activeSpeakerIndex] || members[0];

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextSpeaker();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, activeSpeakerIndex]);

  const nextSpeaker = () => {
    // Save speaker standup notes if filled
    if (yesterdayText || todayText || blockersText) {
      setSavedNotes((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          name: speaker.name,
          yesterday: yesterdayText,
          today: todayText,
          blockers: blockersText,
        },
      ]);
      setYesterdayText('');
      setTodayText('');
      setBlockersText('');
    }

    setActiveSpeakerIndex((prev) => (prev + 1) % members.length);
    setTimeLeft(60);
  };

  const resetTimer = () => {
    setTimeLeft(60);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Daily Standup Scrum Timer
        </h2>
        <p className="text-xs text-muted-foreground">
          Pilnuj czasu wypowiedzi członków zespołu podczas codziennej synchronizacji
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Speaker Card */}
          <Card className="card-elevated border border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {getInitials(speaker?.name || '')}
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1 rounded-lg">
                    {speaker?.role}
                  </Badge>
                  <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">{speaker?.name}</h3>
                  <p className="text-xs text-muted-foreground">Mówi teraz...</p>
                </div>
              </div>

              {/* Countdown circle */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative">
                  <span className="text-2xl font-bold text-blue-600">{timeLeft}s</span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Limit: 60s</span>
                </div>

                <div className="flex gap-1.5 mt-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-blue-600" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-full"
                    onClick={nextSpeaker}
                  >
                    Następny
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scrum notes form */}
          <Card className="card-elevated border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-semibold text-sm">Notatki ze Standupu (Scrum Format)</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Co zrobiłem wczoraj?</label>
                  <input
                    type="text"
                    value={yesterdayText}
                    onChange={(e) => setYesterdayText(e.target.value)}
                    placeholder="Wczoraj zaimplementowałem..."
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Co zrobię dzisiaj?</label>
                  <input
                    type="text"
                    value={todayText}
                    onChange={(e) => setTodayText(e.target.value)}
                    placeholder="Dzisiaj zajmę się..."
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-500 block mb-1">Przeszkody (Blockers)</label>
                  <input
                    type="text"
                    value={blockersText}
                    onChange={(e) => setBlockersText(e.target.value)}
                    placeholder="Brak przeszkód / błąd z WebRTC..."
                    className="w-full h-10 px-3 rounded-lg border border-red-200 dark:border-red-900 bg-background text-xs focus:ring-2 focus:ring-red-500 focus:outline-none text-red-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Daily Standup Notes */}
        <div>
          <Card className="card-elevated border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-[480px] overflow-hidden flex flex-col">
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase pb-2 border-b">Dzisiejsze podsumowanie</h4>
              
              {savedNotes.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted-foreground">
                  Brak zapisanych wypowiedzi
                </div>
              ) : (
                savedNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-2 text-xs border border-slate-100/55 dark:border-slate-800/55">
                    <p className="font-semibold text-blue-600">{note.name}</p>
                    {note.yesterday && <p><strong>Wczoraj:</strong> {note.yesterday}</p>}
                    {note.today && <p><strong>Dzisiaj:</strong> {note.today}</p>}
                    {note.blockers && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <strong>Blocker:</strong> {note.blockers}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
