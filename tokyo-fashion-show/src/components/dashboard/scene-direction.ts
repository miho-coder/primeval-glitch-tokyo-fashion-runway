import type {
  FashionLook,
  ProductionDirection,
  TimelineBeat,
} from '@workspace/api-client-react';

const scenePresets: Record<
  string,
  Pick<ProductionDirection, 'music' | 'tempo' | 'lighting' | 'lightingHex' | 'camera'>
> = {
  OPENING: {
    music: 'Filtered synthesizer pulse with soft noise percussion',
    tempo: 92,
    lighting: 'Deep forest green + backlit rain',
    lightingHex: '#071A12',
    camera: '35mm low-angle slow push + wet asphalt reflections',
  },
  'LOOK 01': {
    music: 'Warm bass pulse with a crisp electronic kick',
    tempo: 108,
    lighting: 'Forest green + neon-lime side light',
    lightingHex: '#B8FF5A',
    camera: '35mm full-body tracking + lateral sweeps',
  },
  'LOOK 02': {
    music: 'Syncopated dance-pop drums with a bright gated synthesizer',
    tempo: 126,
    lighting: 'Neon pink + high-voltage yellow strobe',
    lightingHex: '#FF2E9A',
    camera: '35mm diagonal dolly + glitch-frame jump cuts',
  },
  'LOOK 03': {
    music: 'Four-on-the-floor kick with a sustained lead synthesizer',
    tempo: 132,
    lighting: 'High-voltage yellow + lacquer-black backlight',
    lightingHex: '#F3FF19',
    camera: '35mm low-angle tracking + hair-trail lock-on',
  },
  'LOOK 04': {
    music: 'Polished clap pattern with a pulsing sub-bass line',
    tempo: 118,
    lighting: 'Magenta rain reflections + black softbox',
    lightingHex: '#FF2E9A',
    camera: '35mm macro detail into a rapid full-body pullback',
  },
  'LOOK 05': {
    music: 'Deep electronic bass with a restrained high-frequency texture',
    tempo: 100,
    lighting: 'Forest-green edge light + light-eating black',
    lightingHex: '#071A12',
    camera: '35mm locked portrait + pan across sleeve curvature',
  },
  'LOOK 06': {
    music: 'Chromatic synthesizer arpeggio with an accelerating dance beat',
    tempo: 138,
    lighting: 'Neon pink / cyan / acid-yellow polychrome flash',
    lightingHex: '#B8FF5A',
    camera: '35mm circular tracking + asphalt-level low angle',
  },
  'LOOK 07': {
    music: 'Filtered noise rhythm with a metallic synthesizer accent',
    tempo: 112,
    lighting: 'Silver-white backlight + neon-yellow rim',
    lightingHex: '#F3FF19',
    camera: '35mm frontal symmetric lock-off + rack focus to chrome hands',
  },
  FINALE: {
    music: 'Fast dance-pop groove with layered synthesizer arpeggios',
    tempo: 128,
    lighting: 'Forest green / neon pink / high-voltage yellow',
    lightingHex: '#FF2E9A',
    camera: '35mm low-angle 360° tracking + volumetric backlight',
  },
};

export function getSceneDirection(
  production: ProductionDirection,
  beat: TimelineBeat,
): ProductionDirection {
  const preset = scenePresets[beat.label] ?? scenePresets.OPENING;
  return {
    ...production,
    ...preset,
    background: production.background,
  };
}

export function getSceneLook(
  beat: TimelineBeat,
  looks: FashionLook[],
): FashionLook | undefined {
  if (beat.label === 'OPENING') return looks[0];
  if (beat.label === 'FINALE') return looks[looks.length - 1];

  const match = beat.label.match(/LOOK\s*0?(\d+)/i);
  const number = match ? Number(match[1]) : 1;
  return looks.find((look) => look.number === number) ?? looks[0];
}