type WebkitAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export const RUNWAY_CHORD_PROGRESSION = [
  [57, 60, 64], // A minor: A3, C4, E4
  [53, 57, 60], // F major: F3, A3, C4
  [48, 52, 55], // C major: C3, E3, G3
  [55, 59, 62], // G major: G3, B3, D4
] as const;

export const RUNWAY_MELODY_SEQUENCE = [
  // Phrase A: restrained opening hook
  69, 0, 72, 76, 0, 72, 69, 0,
  67, 0, 69, 72, 0, 69, 67, 0,
  64, 0, 67, 69, 0, 67, 64, 0,
  67, 0, 71, 74, 0, 71, 67, 0,
  // Phrase B: brighter response
  72, 0, 76, 79, 76, 0, 72, 0,
  69, 0, 72, 77, 72, 0, 69, 0,
  67, 0, 72, 76, 72, 0, 67, 0,
  71, 0, 74, 79, 76, 74, 71, 0,
  // Phrase C: syncopated runway variation
  69, 72, 0, 76, 0, 79, 76, 0,
  65, 69, 0, 72, 0, 77, 72, 0,
  64, 67, 0, 72, 0, 76, 72, 0,
  67, 71, 0, 74, 76, 0, 74, 71,
  // Phrase D: lifted finale before the loop returns
  76, 0, 79, 81, 0, 79, 76, 72,
  77, 0, 81, 84, 0, 81, 77, 72,
  76, 0, 79, 84, 0, 79, 76, 72,
  74, 76, 79, 81, 79, 76, 74, 71,
] as const;

export class TokyoFashionShowSynthEngine {
  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private timerId: number | null = null;
  private currentStep = 0;
  private nextStepTime = 0;
  private tempo = 124;
  private playing = false;
  private activeSources = new Set<AudioScheduledSourceNode>();

  setTempo(tempo: number) {
    this.tempo = Math.min(180, Math.max(60, tempo));
  }

  get isPlaying() {
    return this.playing;
  }

  private initialize() {
    if (this.ctx) return;

    const AudioContextConstructor =
      window.AudioContext ?? (window as WebkitAudioWindow).webkitAudioContext;

    if (!AudioContextConstructor) {
      throw new Error('Web Audio is not supported in this browser.');
    }

    this.ctx = new AudioContextConstructor();
    this.compressor = this.ctx.createDynamicsCompressor();
    this.masterGain = this.ctx.createGain();

    this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(14, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(5, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.44, this.ctx.currentTime);

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  private midiToFrequency(note: number) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  private track(source: AudioScheduledSourceNode) {
    this.activeSources.add(source);
    source.addEventListener(
      'ended',
      () => {
        this.activeSources.delete(source);
      },
      { once: true },
    );
  }

  private playLead(note: number, time: number, duration: number) {
    if (!this.ctx || !this.compressor || note === 0) return;

    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const oscillators = [-7, 7].map((detune) => {
      const oscillator = this.ctx!.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(this.midiToFrequency(note), time);
      oscillator.detune.setValueAtTime(detune, time);
      oscillator.connect(filter);
      this.track(oscillator);
      return oscillator;
    });

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(700, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.055, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    filter.connect(gain);
    gain.connect(this.compressor);
    oscillators.forEach((oscillator) => {
      oscillator.start(time);
      oscillator.stop(time + duration);
    });
  }

  private playChord(notes: readonly number[], time: number, duration: number) {
    if (!this.ctx || !this.compressor) return;

    notes.forEach((note) => {
      const oscillator = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(this.midiToFrequency(note), time);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.018, time + 0.05);
      gain.gain.setValueAtTime(0.018, time + Math.max(0.06, duration - 0.08));
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(this.compressor!);
      oscillator.start(time);
      oscillator.stop(time + duration);
      this.track(oscillator);
    });
  }

  private playBass(rootNote: number, time: number, duration: number) {
    if (!this.ctx || !this.compressor) return;

    const oscillator = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(this.midiToFrequency(rootNote - 12), time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.11, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);
    oscillator.start(time);
    oscillator.stop(time + duration);
    this.track(oscillator);
  }

  private playKick(time: number) {
    if (!this.ctx || !this.compressor) return;

    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(155, time);
    oscillator.frequency.exponentialRampToValueAtTime(42, time + 0.11);
    gain.gain.setValueAtTime(0.38, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

    oscillator.connect(gain);
    gain.connect(this.compressor);
    oscillator.start(time);
    oscillator.stop(time + 0.19);
    this.track(oscillator);
  }

  private getNoiseBuffer() {
    if (!this.ctx) throw new Error('Audio engine is not initialized.');
    if (this.noiseBuffer) return this.noiseBuffer;

    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  private playNoisePercussion(
    time: number,
    duration: number,
    frequency: number,
    volume: number,
  ) {
    if (!this.ctx || !this.compressor) return;

    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    source.buffer = this.getNoiseBuffer();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);
    source.start(time);
    source.stop(time + duration);
    this.track(source);
  }

  private scheduleStep(step: number, time: number) {
    const chord =
      RUNWAY_CHORD_PROGRESSION[Math.floor(step / 16) % RUNWAY_CHORD_PROGRESSION.length] ??
      RUNWAY_CHORD_PROGRESSION[0];
    const stepDuration = 60 / this.tempo / 4;

    this.playLead(RUNWAY_MELODY_SEQUENCE[step] ?? 0, time, stepDuration * 0.72);

    if (step % 16 === 0) {
      this.playChord(chord, time, stepDuration * 15.5);
    }
    if (step % 2 === 0) {
      this.playBass(chord[0], time, stepDuration * 1.75);
    }
    if (step % 4 === 0) {
      this.playKick(time);
    }
    if (step % 4 === 2) {
      this.playNoisePercussion(time, 0.05, 7600, 0.05);
    }
    if (step % 8 === 4) {
      this.playNoisePercussion(time, 0.13, 1500, 0.085);
    }
    if (step % 2 === 1) {
      this.playNoisePercussion(time, 0.025, 9200, 0.012);
    }
  }

  private schedule = () => {
    if (!this.ctx || !this.playing) return;

    while (this.nextStepTime < this.ctx.currentTime + 0.1) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.nextStepTime += 60 / this.tempo / 4;
      this.currentStep = (this.currentStep + 1) % RUNWAY_MELODY_SEQUENCE.length;
    }

    this.timerId = window.setTimeout(this.schedule, 25);
  };

  async start() {
    this.initialize();
    if (!this.ctx || this.playing) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.playing = true;
    this.currentStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.04;
    this.schedule();
  }

  stop() {
    this.playing = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }

    this.activeSources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // A source that has already ended does not need additional cleanup.
      }
    });
    this.activeSources.clear();
    this.currentStep = 0;
  }

  async destroy() {
    this.stop();
    if (this.ctx && this.ctx.state !== 'closed') {
      await this.ctx.close();
    }
    this.ctx = null;
    this.compressor = null;
    this.masterGain = null;
    this.noiseBuffer = null;
  }
}