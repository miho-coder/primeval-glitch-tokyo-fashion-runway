import type { FashionShow, FashionShowInput } from '@workspace/api-client-react';

const curatedShibuyaEditorialFallbacks = [
  {
    searchQuery: 'shibuya night neon fashion editorial japanese androgynous model',
    imageUrl: '/extended-look-10.png',
  },
  {
    searchQuery: 'avant-garde runway tokyo high fashion non-binary neon editorial',
    imageUrl: '/extended-look-11.png',
  },
  {
    searchQuery: 'shibuya rainy night couture japanese transgender fashion editorial',
    imageUrl: '/extended-look-12.png',
  },
  {
    searchQuery: 'shibuya neon portrait avant-garde japanese androgynous couture',
    imageUrl: '/extended-look-13.png',
  },
  {
    searchQuery: 'tokyo night black sculptural fashion editorial non-binary model',
    imageUrl: '/extended-look-14.png',
  },
  {
    searchQuery: 'japanese glitch couture neon balloon sleeves shibuya editorial',
    imageUrl: '/extended-look-15.png',
  },
  {
    searchQuery: 'monochrome cyber couture silver trousers shibuya night editorial',
    imageUrl: '/extended-look-16.png',
  },
];

export function createDemoShow(input: FashionShowInput): FashionShow {
  const modelName = input.modelName.trim() || 'Ren Mizuhara';
  const aesthetics = input.aesthetics.length > 0
    ? input.aesthetics
    : ['Cyberpunk', 'Decora', 'Gothic Tech'];

  return {
    id: `demo-show-${Date.now()}`,
    title: 'PRIMEVAL GLITCH: Tokyo Avant-Garde Cinema Runway',
    subtitle: 'A 15-minute, seven-chapter collision of 3D tactile Japanese embroidery and 16-bit digital glitch.',
    status: 'CURATED FALLBACK / SHOW READY',
    generatedAt: new Date().toISOString(),
    model: {
      name: modelName,
      gender: 'Non-binary / transgender expression',
      bodyType: '180cm+, small-headed, extremely slender',
      aesthetics,
      features: [
        'A 180cm+ Japanese non-binary / transgender high-fashion model with a small head and extreme runway proportions.',
        'Androgynous facial architecture where masculine and feminine codes coexist in one striking face.',
        'Wide-set eyes, ultra-short horizontal blunt bangs, and skin-close shaved sides.',
        'A glossy, perfectly straight black mane flowing to the back.',
        'Oversized statement earrings paired with bizarre neon-tech sneakers.',
      ],
    },
    concept: {
      logline:
        'A Tokyo anomaly born from primeval forest green enters Shibuya after rain, collecting the city’s emotions in pink memory and yellow voltage.',
      direction:
        'Stage raw human energy against AI digital noise: 3D tactile Japanese embroidery collides with flat 16-bit glitch fragments until every stride mutates the garment into an urban light source.',
      palette: ['#071A12', '#FF2E9A', '#F3FF19', '#B8FF5A'],
      venue: 'Shibuya night neon street after rain, with wet asphalt reflections and cinematic cyberpunk depth',
    },
    looks: [
      {
        number: 1,
        name: 'Primeval Glitch Aristocrat',
        category: 'NEO ARISTOCRATIC GLITCH',
        description:
          'A sacred, gender-neutral aristocratic S/S top in primeval forest green: a high frill collar, monumental balloon puff sleeves, distorted high-waisted wide trousers, and 3D tactile Japanese embroidery swelling like terrain.',
        materials: ['3D tactile Japanese embroidery', 'Forest-green textured satin', 'Ultra-light carbon frame'],
        imageUrl: curatedShibuyaEditorialFallbacks[0].imageUrl,
        accent: '#B8FF5A',
      },
      {
        number: 2,
        name: 'Pink Voltage Decora',
        category: '16-BIT DECO COUTURE',
        description:
          'Flat 16-bit digital glitch fragments in neon pink and high-voltage yellow explode across raised forest-green embroidery. Giant earrings and distorted sleeves break the boundary between pixel and volume.',
        materials: ['Neon-pink digital print', 'Foam silicone embroidery', 'Balloon taffeta'],
        imageUrl: curatedShibuyaEditorialFallbacks[1].imageUrl,
        accent: '#FF2E9A',
      },
      {
        number: 3,
        name: 'Yellow Thunder Mane',
        category: 'CYBER BOTANICAL',
        description:
          'Ultra-light carbon ribs pierce the garment while a lacquer-black mane and neon-yellow glitch fragments extend into space. Luminous tech sneakers leave an afterimage in the low 35mm frame.',
        materials: ['Carbon fiber', 'Gloss-black hair fiber', 'Neon-accented tech mesh'],
        imageUrl: curatedShibuyaEditorialFallbacks[2].imageUrl,
        accent: '#F3FF19',
      },
      {
        number: 4,
        name: 'Black Mirror Earring Reliquary',
        category: 'NEON RELIQUARY PORTRAIT',
        description:
          'Lacquer-black puff sleeves expand like a shrine around the body, concentrating monumental earrings, transparent eyewear, and a chrome chest object into one ritual portrait.',
        materials: ['Black gloss satin', 'Transparent resin eyewear', 'Chrome wire sculpture'],
        imageUrl: curatedShibuyaEditorialFallbacks[3].imageUrl,
        accent: '#FF2E9A',
      },
      {
        number: 5,
        name: 'Lacquer Balloon Singularity',
        category: 'BLACK VOLUME SINGULARITY',
        description:
          'Liquid-black monumental sleeves merge with high-waisted trousers, sealing the body inside a volume that reflects only the wet Shibuya light.',
        materials: ['Black latex satin', 'Compressed wool rib', 'Shape-memory carbon core'],
        imageUrl: curatedShibuyaEditorialFallbacks[4].imageUrl,
        accent: '#071A12',
      },
      {
        number: 6,
        name: 'Fluorescent Mandala Pixel Bloom',
        category: 'PIXEL BLOOM BAROQUE',
        description:
          'Neon pink, cyan, and acid-yellow pixels invade deep green and gold jacquard. Spherical sleeves and platform tech sneakers fuse baroque ceremony with a game-world glitch.',
        materials: ['Deep-green gold jacquard', '16-bit foam print', 'Neon balloon taffeta'],
        imageUrl: curatedShibuyaEditorialFallbacks[5].imageUrl,
        accent: '#B8FF5A',
      },
      {
        number: 7,
        name: 'Silver Prosthesis Zero Finale',
        category: 'MONOCHROME CYBER FINALE',
        description:
          'Monumental black balloon sleeves meet silver wide-leg trousers in an extreme monochrome. Chrome prosthetic hands and a single black visor sever the final boundary between human and AI.',
        materials: ['Black tech satin', 'Silver liquid twill', 'Chrome prosthetic components'],
        imageUrl: curatedShibuyaEditorialFallbacks[6].imageUrl,
        accent: '#F3FF19',
      },
    ],
    timeline: [
      {
        time: '00:00',
        label: 'OPENING',
        type: 'Opening',
        description: 'In the rain-wet neon street, monumental earrings appear before the body. A low 35mm frame lifts the model from the asphalt reflection.',
        narration: 'Tokyo never sleeps. Beneath the city, the forest is growing a body without a name.',
        duration: '1:10',
      },
      {
        time: '01:10',
        label: 'LOOK 01',
        type: 'Primeval Glitch Aristocrat',
        description: 'Volumetric side light sculpts the raised embroidery and high frill collar in forest green.',
        narration: 'The first arrival is not a garment. Primeval green presses outward through the skin of the city.',
        duration: '1:45',
      },
      {
        time: '02:55',
        label: 'LOOK 02',
        type: 'Pink Voltage Decora',
        description: 'Neon pink and high-voltage yellow 16-bit glitch jumps from signage to garment, covering tactile embroidery in flat noise.',
        narration: 'Human feeling does not lose heat when it becomes a pixel. It becomes excessive, unmistakably Tokyo.',
        duration: '1:45',
      },
      {
        time: '04:40',
        label: 'LOOK 03',
        type: 'Yellow Thunder Mane',
        description: 'Neon-yellow volumetric light and a tracking camera amplify the carbon frame and long black mane.',
        narration: 'A living stride breaks the expected outline. What remains is the charged trail of hair.',
        duration: '1:45',
      },
      {
        time: '06:25',
        label: 'LOOK 04',
        type: 'Black Mirror Earring Reliquary',
        description: 'The camera closes in on the face, monumental earrings, and chrome chest object as rain and neon ripple across black sleeves.',
        narration: 'The body does not wear the ornament. The ornament chooses the body and leads it into Tokyo night.',
        duration: '1:45',
      },
      {
        time: '08:10',
        label: 'LOOK 05',
        type: 'Lacquer Balloon Singularity',
        description: 'The lighting drops into forest green; only pink reflections on black curves reveal the monumental silhouette.',
        narration: 'Black absorbs the light. Inside it, the human outline quietly multiplies.',
        duration: '1:45',
      },
      {
        time: '09:55',
        label: 'LOOK 06',
        type: 'Fluorescent Mandala Pixel Bloom',
        description: 'Glitch fragments sync with the rain, scattering neon data pollen from spherical sleeves onto the street.',
        narration: 'Future noise blooms inside an ancient pattern. Error becomes ornament; ornament becomes life.',
        duration: '1:45',
      },
      {
        time: '11:40',
        label: 'LOOK 07',
        type: 'Silver Prosthesis Zero Finale',
        description: 'Hard backlight cuts the silver trousers and chrome hands while every Shibuya neon converges inside the black visor.',
        narration: 'The final hand belongs neither to human nor machine. It becomes the future only when it touches.',
        duration: '1:45',
      },
      {
        time: '13:25',
        label: 'FINALE',
        type: 'Finale',
        description: 'Forest green, neon pink, and voltage yellow flash together as a botanical Tokyo dissolves into an impossible backdrop.',
        narration: 'This is not the future. It is Tokyo after human heat and digital noise dance in the same garment.',
        duration: '1:10',
      },
    ],
    production: {
      music: 'Fast dance-pop groove with layered synthesizer arpeggios',
      tempo: 128,
      lighting: 'Forest green / neon pink / high-voltage yellow',
      lightingHex: '#FF2E9A',
      background: 'Shibuya night neon street after rain, with wet asphalt reflections and cinematic cyberpunk depth',
      camera: '35mm low-angle tracking + volumetric backlight',
    },
  };
}