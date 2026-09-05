import {
  RUNWAY_CHORD_PROGRESSION,
  RUNWAY_MELODY_SEQUENCE,
} from './runway-music-engine';

const midiToFrequency = (note: number) => 440 * Math.pow(2, (note - 69) / 12);

function connectEnvelope(
  context: OfflineAudioContext,
  destination: AudioNode,
  time: number,
  duration: number,
  peak: number,
) {
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(peak, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  gain.connect(destination);
  return gain;
}

function scheduleOscillator(
  context: OfflineAudioContext,
  destination: AudioNode,
  type: OscillatorType,
  frequency: number,
  time: number,
  duration: number,
  peak: number,
  detune = 0,
) {
  const oscillator = context.createOscillator();
  const gain = connectEnvelope(context, destination, time, duration, peak);
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, time);
  oscillator.detune.setValueAtTime(detune, time);
  oscillator.connect(gain);
  oscillator.start(time);
  oscillator.stop(time + duration);
}

function createNoiseBuffer(context: OfflineAudioContext) {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.2), context.sampleRate);
  const channel = buffer.getChannelData(0);
  let seed = 1979;

  for (let index = 0; index < channel.length; index += 1) {
    seed = (seed * 16807) % 2147483647;
    channel[index] = (seed / 2147483647) * 2 - 1;
  }

  return buffer;
}

function scheduleNoise(
  context: OfflineAudioContext,
  destination: AudioNode,
  noiseBuffer: AudioBuffer,
  time: number,
  duration: number,
  frequency: number,
  volume: number,
) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = noiseBuffer;
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(frequency, time);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(time);
  source.stop(time + duration);
}

function encodeWav(audioBuffer: AudioBuffer) {
  const channels = audioBuffer.numberOfChannels;
  const frameCount = audioBuffer.length;
  const bytesPerSample = 2;
  const dataSize = frameCount * channels * bytesPerSample;
  const output = new ArrayBuffer(44 + dataSize);
  const view = new DataView(output);

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const channelData = Array.from(
    { length: channels },
    (_, channel) => audioBuffer.getChannelData(channel),
  );
  let offset = 44;

  for (let frame = 0; frame < frameCount; frame += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][frame] ?? 0));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += bytesPerSample;
    }
  }

  return new Blob([output], { type: 'audio/wav' });
}

export async function renderRunwayMusicWav(tempo: number, durationSeconds = 60) {
  const sampleRate = 44_100;
  const context = new OfflineAudioContext(
    2,
    Math.ceil(sampleRate * durationSeconds),
    sampleRate,
  );
  const compressor = context.createDynamicsCompressor();
  const masterGain = context.createGain();
  const noiseBuffer = createNoiseBuffer(context);

  compressor.threshold.setValueAtTime(-18, 0);
  compressor.knee.setValueAtTime(14, 0);
  compressor.ratio.setValueAtTime(5, 0);
  masterGain.gain.setValueAtTime(0.44, 0);
  compressor.connect(masterGain);
  masterGain.connect(context.destination);

  const effectiveTempo = Math.min(128, Math.max(118, tempo));
  const stepDuration = 60 / effectiveTempo / 4;
  const totalSteps = Math.ceil(durationSeconds / stepDuration);

  for (let absoluteStep = 0; absoluteStep < totalSteps; absoluteStep += 1) {
    const step = absoluteStep % RUNWAY_MELODY_SEQUENCE.length;
    const time = absoluteStep * stepDuration;
    const chord =
      RUNWAY_CHORD_PROGRESSION[
        Math.floor(step / 16) % RUNWAY_CHORD_PROGRESSION.length
      ] ?? RUNWAY_CHORD_PROGRESSION[0];
    const melody = RUNWAY_MELODY_SEQUENCE[step] ?? 0;

    if (melody) {
      scheduleOscillator(
        context,
        compressor,
        'sawtooth',
        midiToFrequency(melody),
        time,
        stepDuration * 0.72,
        0.036,
        -7,
      );
      scheduleOscillator(
        context,
        compressor,
        'sawtooth',
        midiToFrequency(melody),
        time,
        stepDuration * 0.72,
        0.036,
        7,
      );
    }

    if (step % 16 === 0) {
      chord.forEach((note) => {
        scheduleOscillator(
          context,
          compressor,
          'triangle',
          midiToFrequency(note),
          time,
          stepDuration * 15.5,
          0.018,
        );
      });
    }

    if (step % 2 === 0) {
      scheduleOscillator(
        context,
        compressor,
        'sawtooth',
        midiToFrequency(chord[0] - 12),
        time,
        stepDuration * 1.75,
        0.09,
      );
    }

    if (step % 4 === 0) {
      const kick = context.createOscillator();
      const kickGain = context.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(155, time);
      kick.frequency.exponentialRampToValueAtTime(42, time + 0.11);
      kickGain.gain.setValueAtTime(0.38, time);
      kickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
      kick.connect(kickGain);
      kickGain.connect(compressor);
      kick.start(time);
      kick.stop(time + 0.19);
    }

    if (step % 4 === 2) {
      scheduleNoise(context, compressor, noiseBuffer, time, 0.05, 7600, 0.05);
    }
    if (step % 8 === 4) {
      scheduleNoise(context, compressor, noiseBuffer, time, 0.13, 1500, 0.085);
    }
    if (step % 2 === 1) {
      scheduleNoise(context, compressor, noiseBuffer, time, 0.025, 9200, 0.012);
    }
  }

  return encodeWav(await context.startRendering());
}