import { useEffect, useRef, useState } from 'react';
import { Download, Music2, Square } from 'lucide-react';
import { Button } from '@/components/ui';
import { TokyoFashionShowSynthEngine } from './runway-music-engine';
import { renderRunwayMusicWav } from './runway-music-export';

interface RunwayMusicPlayerProps {
  tempo: number;
}

export function RunwayMusicPlayer({ tempo }: RunwayMusicPlayerProps) {
  const engineRef = useRef<TokyoFashionShowSynthEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const effectiveTempo = Math.min(128, Math.max(118, tempo));

  if (!engineRef.current) {
    engineRef.current = new TokyoFashionShowSynthEngine();
  }

  useEffect(() => {
    engineRef.current?.setTempo(effectiveTempo);
  }, [effectiveTempo]);

  useEffect(() => {
    const engine = engineRef.current;
    return () => {
      void engine?.destroy();
    };
  }, []);

  const handleToggle = async () => {
    const engine = engineRef.current;
    if (!engine) return;

    setError(null);
    if (engine.isPlaying) {
      engine.stop();
      setIsPlaying(false);
      return;
    }

    try {
      await engine.start();
      setIsPlaying(engine.isPlaying);
    } catch (playbackError) {
      engine.stop();
      setIsPlaying(false);
      setError(
        playbackError instanceof Error
          ? playbackError.message
          : 'Unable to start Web Audio playback.',
      );
    }
  };

  const handleDownload = async () => {
    setError(null);
    setIsExporting(true);

    try {
      const wav = await renderRunwayMusicWav(effectiveTempo, 60);
      const url = URL.createObjectURL(wav);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `tokyo-party-runway-${effectiveTempo}bpm.wav`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch (renderError) {
      setError(
        renderError instanceof Error
          ? renderError.message
          : 'Unable to render the downloadable WAV file.',
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border border-primary/25 bg-primary/5 p-2.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          Party Runway Synth
        </span>
        <span className="font-mono text-[9px] uppercase text-primary">
          {isPlaying ? 'Running' : `${effectiveTempo} BPM`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={isPlaying ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => void handleToggle()}
          aria-pressed={isPlaying}
          className="justify-center font-mono text-[9px] tracking-wider"
        >
          {isPlaying ? <Square className="h-3 w-3" /> : <Music2 className="h-3 w-3" />}
          {isPlaying ? 'STOP' : 'PLAY'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isExporting}
          onClick={() => void handleDownload()}
          className="justify-center font-mono text-[9px] tracking-wider"
        >
          <Download className="h-3 w-3" />
          {isExporting ? 'RENDERING' : 'DOWNLOAD WAV'}
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[10px] leading-relaxed text-destructive">
          {error}
        </p>
      ) : (
        <p className="mt-2 font-mono text-[9px] leading-relaxed text-muted-foreground">
          Natural runway pace · four evolving phrases · 60-second WAV
        </p>
      )}
    </div>
  );
}