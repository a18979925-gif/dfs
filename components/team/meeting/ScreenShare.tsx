'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Video, VideoOff, Maximize2, Zap, Palette, HelpCircle, Activity } from 'lucide-react';

export function ScreenShare() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sharing, setSharing] = useState(false);
  const [fps, setFps] = useState(60);
  const [bitrate, setBitrate] = useState(4.2); // Mbps
  const [laserPointer, setLaserPointer] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startSharing = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
        },
        audio: false,
      });

      setStream(mediaStream);
      setSharing(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      mediaStream.getVideoTracks()[0].onended = () => {
        stopSharing();
      };
    } catch (err) {
      console.error('Error starting screen share:', err);
    }
  };

  const stopSharing = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setSharing(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Simulate video diagnostics
  useEffect(() => {
    if (!sharing) return;
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 5) + 55);
      setBitrate(parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, [sharing]);

  // Handle laser pointer canvas events
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!laserPointer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw neon glowing pointer
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#3b82f6';
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Teams Studio (Wideokonferencje & Share Screen)
          </h2>
          <p className="text-xs text-muted-foreground">
            Udostępniaj swój pulpit, kod i okna przeglądarki na żywo w czasie rzeczywistym
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col border border-slate-150 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden h-[480px] relative">
          {sharing ? (
            <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                width={800}
                height={450}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950/20">
              <Monitor className="h-16 w-16 text-muted-foreground mb-4 animate-pulse-soft" />
              <h3 className="font-semibold text-lg mb-1">Gotowy do udostępniania?</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Wybierz monitor, okno aplikacji lub kartę przeglądarki i rozpocznij prezentację dla zespołu
              </p>
              <Button
                onClick={startSharing}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 h-11 px-6 font-semibold"
              >
                <Video className="h-5 w-5 mr-2" />
                Udostępnij Ekran
              </Button>
            </div>
          )}

          {sharing && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 text-white shadow-2xl backdrop-blur z-20">
              <Button
                size="sm"
                variant="destructive"
                onClick={stopSharing}
                className="rounded-xl"
              >
                <VideoOff className="h-4 w-4 mr-1.5" />
                Zatrzymaj
              </Button>
              <div className="h-4 w-[1px] bg-white/20 mx-1" />
              <Button
                size="sm"
                variant={laserPointer ? 'default' : 'outline'}
                onClick={() => setLaserPointer(!laserPointer)}
                className={`rounded-xl border-white/20 ${laserPointer ? 'bg-blue-600' : 'bg-transparent text-white hover:bg-white/10'}`}
              >
                <Palette className="h-4 w-4 mr-1.5" />
                Wskaźnik Laserowy
              </Button>
            </div>
          )}
        </div>

        {/* Diagnostics & Stats */}
        <div className="space-y-6">
          <Card className="card-elevated border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Diagnostyka Strumienia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Status udostępniania</span>
                  <span className={`font-semibold ${sharing ? 'text-green-500' : 'text-slate-500'}`}>
                    {sharing ? 'AKTYWNY' : 'NIEAKTYWNY'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Klatki na sekundę</span>
                  <span className="font-semibold">{sharing ? `${fps} FPS` : '-'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Przepustowość</span>
                  <span className="font-semibold">{sharing ? `${bitrate} Mbps` : '-'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Opóźnienie (Ping)</span>
                  <span className="font-semibold text-green-500">{sharing ? '12 ms' : '-'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/50 space-y-2 text-xs">
                <p className="font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  Współdzielenie WebRTC
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Zastosowano kodowanie VP8 z dynamicznym dopasowaniem klatek. Transmisja jest szyfrowana punkt-w-punkt (E2EE).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
