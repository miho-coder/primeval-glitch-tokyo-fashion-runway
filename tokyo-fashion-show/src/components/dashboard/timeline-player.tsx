import { useState, useEffect, useRef, useCallback } from 'react';
import { TimelineBeat } from '@workspace/api-client-react';
import { Play, Pause, Square, Clock, Volume2, VolumeX, Mic, Download } from 'lucide-react';
import { Button } from '@/components/ui';
import {
  PROMO_VOICEOVER,
  type PromoVoiceoverKey,
} from '@/data/voiceover-script';

interface Props {
  beats: TimelineBeat[];
  activeBeatIndex: number;
  onSelect: (index: number) => void;
}

type CaptureState = 'idle' | 'requesting' | 'recording' | 'ready' | 'error';

export function TimelinePlayer({ beats, activeBeatIndex, onSelect }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1 for current beat
  const [isNarrating, setIsNarrating] = useState(false);
  const [activeVoiceover, setActiveVoiceover] = useState<PromoVoiceoverKey | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [captureState, setCaptureState] = useState<CaptureState>('idle');
  const [captureStatus, setCaptureStatus] = useState('READY');
  const [captureUrl, setCaptureUrl] = useState<string | null>(null);
  const [isDialogPending, setIsDialogPending] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveTimerRef = useRef<number | null>(null);
  const captureRecorderRef = useRef<MediaRecorder | null>(null);
  const captureStreamRef = useRef<MediaStream | null>(null);
  const captureChunksRef = useRef<Blob[]>([]);
  const captureUrlRef = useRef<string | null>(null);

  // Mock durations if not easily parsable. Let's assume each beat is 5 seconds for simulation.
  const BEAT_DURATION_MS = 5000;

  const clearKeepAliveTimer = useCallback(() => {
    if (keepAliveTimerRef.current !== null) {
      window.clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  }, []);

  const detachUtteranceHandlers = useCallback((utterance: SpeechSynthesisUtterance | null) => {
    if (!utterance) return;
    utterance.onstart = null;
    utterance.onend = null;
    utterance.onerror = null;
  }, []);

  const speakText = useCallback((text: string, voiceoverKey: PromoVoiceoverKey | null = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Detach callbacks before canceling so interrupted utterances cannot retain
    // React closures or mutate the state of a newer scene.
    detachUtteranceHandlers(utteranceRef.current);
    window.speechSynthesis.cancel();
    clearKeepAliveTimer();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    console.info(
      '[Available Voices Selection]:',
      voices.map((voice) => `${voice.name} (${voice.lang})`),
    );

    const selectedVoice =
      voices.find(
        (voice) => voice.lang.startsWith('en') && /zira/i.test(voice.name),
      ) ??
      voices.find(
        (voice) =>
          voice.lang.startsWith('en') &&
          /google/i.test(voice.name) &&
          /female/i.test(voice.name),
      ) ??
      voices.find((voice) => voice.lang.startsWith('en')) ??
      null;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.onstart = () => {
      if (utteranceRef.current !== utterance) return;
      setIsNarrating(true);
      setActiveVoiceover(voiceoverKey);
      console.info(`[SpeechSynthesis] Started: ${voiceoverKey ?? 'ACTIVE SCENE'}`);
      clearKeepAliveTimer();
      keepAliveTimerRef.current = window.setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearKeepAliveTimer();
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 14000);
    };
    utterance.onend = () => {
      console.info(`[SpeechSynthesis] Ended: ${voiceoverKey ?? 'ACTIVE SCENE'}`);
      const isCurrentUtterance = utteranceRef.current === utterance;
      detachUtteranceHandlers(utterance);
      if (!isCurrentUtterance) return;
      utteranceRef.current = null;
      clearKeepAliveTimer();
      setIsNarrating(false);
      setActiveVoiceover(null);
    };
    utterance.onerror = (event) => {
      if (event.error !== 'interrupted') {
        console.warn(
          `[SpeechSynthesis] Voice playback issue in ${voiceoverKey ?? 'ACTIVE SCENE'}:`,
          event.error,
        );
      }
      const isCurrentUtterance = utteranceRef.current === utterance;
      detachUtteranceHandlers(utterance);
      if (!isCurrentUtterance) return;
      utteranceRef.current = null;
      clearKeepAliveTimer();
      setIsNarrating(false);
      setActiveVoiceover(null);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [clearKeepAliveTimer, detachUtteranceHandlers]);

  const speakBeat = useCallback((beat: TimelineBeat | undefined) => {
    if (beat) speakText(beat.narration);
  }, [speakText]);

  const stopNarration = useCallback(() => {
    // Detach first: speechSynthesis.cancel() may synchronously emit an
    // interruption event in some browsers.
    detachUtteranceHandlers(utteranceRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearKeepAliveTimer();
    utteranceRef.current = null;
    setIsNarrating(false);
    setActiveVoiceover(null);
  }, [clearKeepAliveTimer, detachUtteranceHandlers]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    stopNarration();
  }, [stopNarration]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    } else {
      const startIndex = activeBeatIndex >= 0 ? activeBeatIndex : 0;
      onSelect(startIndex);
      setIsPlaying(true);
      startTimeRef.current = performance.now() - (progress * BEAT_DURATION_MS);
      requestAnimationFrame(updateLoop);
    }
  };

  const updateLoop = (now: number) => {
    if (!startTimeRef.current) return;
    
    const elapsed = now - startTimeRef.current;
    const currentProg = elapsed / BEAT_DURATION_MS;

    if (currentProg >= 1.0) {
      // Next beat
      const next = activeBeatIndex + 1;
      if (next >= beats.length) {
        setIsPlaying(false);
        setProgress(0);
        return;
      }
      onSelect(next);
      setProgress(0);
      startTimeRef.current = now;
    } else {
      setProgress(currentProg);
    }

    if (isPlaying) {
      timerRef.current = requestAnimationFrame(updateLoop);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = requestAnimationFrame(updateLoop);
    } else {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isPlaying, activeBeatIndex]);

  const activeBeat = activeBeatIndex >= 0 ? beats[activeBeatIndex] : null;

  const selectBeat = (index: number) => {
    const shouldContinueNarrating = isNarrating;
    onSelect(index);
    setProgress(0);
    startTimeRef.current = isPlaying ? performance.now() : null;
    if (shouldContinueNarrating) {
      speakBeat(beats[index]);
    }
  };

  const toggleNarration = () => {
    if (isNarrating) {
      stopNarration();
      return;
    }
    speakBeat(activeBeat ?? beats[0]);
  };

  const playPromoVoiceover = (key: PromoVoiceoverKey) => {
    speakText(PROMO_VOICEOVER[key].text, key);
  };

  const downloadVoiceoverScript = (key: PromoVoiceoverKey) => {
    const script = PROMO_VOICEOVER[key];
    const blob = new Blob([script.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `primeval-glitch-${key}-voiceover.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDownloadStatus(`${script.statusLabel} SCRIPT DOWNLOADED`);
    window.setTimeout(() => setDownloadStatus(null), 3000);
  };

  const stopAudioCapture = useCallback(() => {
    const recorder = captureRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      return;
    }
    captureStreamRef.current?.getTracks().forEach((track) => track.stop());
    captureStreamRef.current = null;
    if (captureState === 'recording' || captureState === 'requesting') {
      setCaptureState('idle');
      setCaptureStatus('READY');
    }
  }, [captureState]);

  const startAudioCapture = useCallback(async () => {
    if (isDialogPending || captureState === 'requesting' || captureState === 'recording') {
      return;
    }

    if (
      typeof window === 'undefined' ||
      !navigator.mediaDevices?.getDisplayMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setCaptureState('error');
      setCaptureStatus('TAB AUDIO CAPTURE IS NOT SUPPORTED IN THIS BROWSER');
      return;
    }

    if (captureUrlRef.current) {
      URL.revokeObjectURL(captureUrlRef.current);
      captureUrlRef.current = null;
      setCaptureUrl(null);
    }

    setCaptureState('requesting');
    setIsDialogPending(true);
    setCaptureStatus('SELECT THIS TAB AND ENABLE AUDIO SHARING');

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      setIsDialogPending(false);
      captureStreamRef.current = displayStream;

      if (displayStream.getAudioTracks().length === 0) {
        displayStream.getTracks().forEach((track) => track.stop());
        captureStreamRef.current = null;
        setCaptureState('error');
        setCaptureStatus(
          '⚠️ Error: Tab Audio was not enabled! Please retry and check the share audio box.',
        );
        return;
      }

      const audioStream = new MediaStream(displayStream.getAudioTracks());
      const supportedMimeType = ['audio/webm;codecs=opus', 'audio/webm'].find((mimeType) =>
        MediaRecorder.isTypeSupported(mimeType),
      );
      const recorder = supportedMimeType
        ? new MediaRecorder(audioStream, { mimeType: supportedMimeType })
        : new MediaRecorder(audioStream);

      captureChunksRef.current = [];
      captureRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          captureChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(captureChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        const nextUrl = URL.createObjectURL(audioBlob);
        if (captureUrlRef.current) {
          URL.revokeObjectURL(captureUrlRef.current);
        }
        captureUrlRef.current = nextUrl;
        setCaptureUrl(nextUrl);
        setCaptureState('ready');
        setCaptureStatus('CAPTURE COMPLETE — AUDIO ASSET READY');
        captureRecorderRef.current = null;
        captureStreamRef.current?.getTracks().forEach((track) => track.stop());
        captureStreamRef.current = null;
      };
      recorder.onerror = () => {
        setCaptureState('error');
        setCaptureStatus('CAPTURE FAILED — TRY SHARING THIS TAB WITH AUDIO');
        captureRecorderRef.current = null;
        captureStreamRef.current?.getTracks().forEach((track) => track.stop());
        captureStreamRef.current = null;
      };

      const videoTrack = displayStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.addEventListener('ended', stopAudioCapture, { once: true });
      }
      recorder.start(250);
      setCaptureState('recording');
      setCaptureStatus('RECORDING TAB AUDIO — PLAY A VOICEOVER, THEN STOP & SAVE');
    } catch (error) {
      captureStreamRef.current?.getTracks().forEach((track) => track.stop());
      captureStreamRef.current = null;
      setIsDialogPending(false);
      setCaptureState('idle');
      stop();
      setCaptureStatus(
        error instanceof DOMException &&
        (error.name === 'AbortError' || error.name === 'NotAllowedError')
          ? 'Status: Share Canceled. Ready for retry.'
          : 'CAPTURE COULD NOT START — TRY AGAIN',
      );
    }
  }, [captureState, isDialogPending, stop, stopAudioCapture]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    const warmVoiceCatalog = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener('voiceschanged', warmVoiceCatalog);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', warmVoiceCatalog);
      stopNarration();
    };
  }, [stopNarration]);

  useEffect(() => {
    return () => {
      const recorder = captureRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
      }
      captureStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (captureUrlRef.current) {
        URL.revokeObjectURL(captureUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-mono text-sm font-bold tracking-widest uppercase">Timeline</h2>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className={`h-7 w-7 p-0 ${isNarrating ? 'border-primary text-primary' : ''}`}
            onClick={toggleNarration}
            aria-label={isNarrating ? 'Stop English female narration' : 'Play English female narration'}
            title={isNarrating ? 'Stop English female narration' : 'Play English female narration'}
          >
            {isNarrating ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={togglePlay}>
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={stop}>
            <Square className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Selected scene / narration */}
      <div className="min-h-32 border-b border-border bg-black flex flex-col items-center justify-center gap-2 p-4 relative overflow-hidden">
        {activeBeat ? (
          <>
            <div className="w-full shrink-0 text-left text-[10px] font-mono text-primary animate-pulse uppercase">
              {isPlaying ? 'REC' : 'SELECTED'} // {activeBeat.time}
            </div>
            <p className="w-full max-w-[95%] break-words text-center text-sm font-medium leading-relaxed glitch-text">
              "{activeBeat.narration}"
            </p>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary/80">
              {isNarrating
                ? activeVoiceover
                  ? `${PROMO_VOICEOVER[activeVoiceover].label} / LIVE`
                  : 'ENGLISH FEMALE VOICE / LIVE'
                : 'ENGLISH FEMALE VOICE / READY'}
            </span>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {(Object.keys(PROMO_VOICEOVER) as PromoVoiceoverKey[]).map((key) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 font-mono text-[9px] uppercase tracking-wide text-muted-foreground hover:text-primary"
                  onClick={() => playPromoVoiceover(key)}
                  aria-label={`Play ${PROMO_VOICEOVER[key].label} voiceover`}
                >
                  {PROMO_VOICEOVER[key].playLabel}
                </Button>
              ))}
            </div>
            <div className="mt-3 w-full max-w-[95%] border border-border/70 bg-secondary/10 p-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  Presentation Voiceover Downloads
                </span>
                <span className="font-mono text-[9px] uppercase text-primary/70">
                  EDIT READY
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                Download the approved English script for timing against your edit.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(Object.keys(PROMO_VOICEOVER) as PromoVoiceoverKey[]).map((key) => (
                  <Button
                    key={`download-${key}`}
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 font-mono text-[9px] uppercase tracking-wide"
                    onClick={() => downloadVoiceoverScript(key)}
                  >
                    {PROMO_VOICEOVER[key].downloadLabel}
                  </Button>
                ))}
              </div>
              {downloadStatus && (
                <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-primary">
                  {downloadStatus}
                </p>
              )}
            </div>
            <div className="mt-3 w-full max-w-[95%] border border-primary/40 bg-black/60 p-2.5">
              <div className="flex items-center gap-2">
                <Mic className="h-3 w-3 text-primary" />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
                  Safe Audio Capture Extractor
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                Share this tab with audio enabled, play a voiceover, then save the captured track.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 font-mono text-[9px] uppercase tracking-wide text-primary"
                  onClick={startAudioCapture}
                  disabled={isDialogPending || captureState === 'recording'}
                >
                  <Mic className="mr-1 h-3 w-3" />
                  1. START RECORDING
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 font-mono text-[9px] uppercase tracking-wide !border-foreground !bg-transparent !text-foreground hover:!bg-foreground hover:!text-background"
                  onClick={stopAudioCapture}
                  disabled={captureState !== 'recording'}
                >
                  <Square className="mr-1 h-3 w-3" />
                  2. STOP & SAVE
                </Button>
              </div>
              <div className="mt-2 font-mono text-[9px] tracking-widest text-primary/90">
                {captureStatus.startsWith('Status:') ? captureStatus : `STATUS: ${captureStatus}`}
              </div>
              {captureUrl && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <audio controls src={captureUrl} className="h-7 max-w-full" />
                  <a
                    href={captureUrl}
                    download="primeval-glitch-captured-voiceover.webm"
                    className="inline-flex h-6 items-center border border-primary/60 px-2 font-mono text-[9px] uppercase tracking-wide text-primary hover:bg-primary/10"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    SAVE AUDIO ASSET
                  </a>
                </div>
              )}
            </div>
            {/* Progress bar for current beat */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </>
        ) : (
          <div className="font-mono text-xs text-muted-foreground uppercase opacity-50">
            System Standby
          </div>
        )}
      </div>

      {/* Beats List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {beats.map((beat, idx) => {
          const isActive = idx === activeBeatIndex;
          const isPast = activeBeatIndex !== -1 && idx < activeBeatIndex;
          
          return (
            <button
              type="button"
              key={idx}
              onClick={() => selectBeat(idx)}
              aria-pressed={isActive}
              className={`w-full text-left p-3 border transition-colors ${
                isActive 
                  ? 'border-primary bg-primary/10' 
                  : isPast 
                    ? 'border-border/30 opacity-50' 
                    : 'border-border bg-background/50 hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`font-mono text-xs font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {beat.time}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-secondary text-secondary-foreground">
                  {beat.type}
                </span>
              </div>
              <h4 className="text-xs font-bold uppercase mb-1">{beat.label}</h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2">{beat.description}</p>
              <span className={`mt-2 block font-mono text-[9px] uppercase tracking-widest ${isActive ? 'text-primary' : 'text-muted-foreground/60'}`}>
                {isActive ? 'ACTIVE STAGE / SELECTED' : 'SELECT STAGE'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
