export interface ExtendedLook {
  number: number;
  title: string;
  modelType: string;
  colorPalette: string;
  specs: string;
  cameraDirection: string;
  imageSrc: string;
}

export const extendedLookbook: ExtendedLook[] = [
  {
    number: 10,
    title: 'LOOK 10: Shibuya Embroidered Vanguard',
    modelType: 'Androgynous Female (Three-Quarter Solo Portrait)',
    colorPalette: 'Deep Forest Green, Rich Moss Green, Fluorescent Neon Yellow, Neon Pink, Electric Lime',
    specs: 'A single androgynous model turns toward the camera in a premium 1:1 square portrait at rainy Shibuya Crossing. The sculptural deep-forest-green coat is covered with dimensional embroidery and pixel-like neon pink, yellow, and electric-lime accents. The image emphasizes the garment surface, silhouette, and reflective city atmosphere without claiming a full-body or footwear view.',
    cameraDirection: 'Eye-level 1:1 three-quarter portrait preserving the complete original square frame, with the model centered against softly focused Shibuya lights and rain reflections.',
    imageSrc: new URL('../assets/extended-look-10.png', import.meta.url).href,
  },
  {
    number: 11,
    title: 'LOOK 11: Rainline Profile',
    modelType: 'Androgynous Male (Profile Portrait)',
    colorPalette: 'Midnight Black, Steel Blue, Cyan Light, Soft Magenta',
    specs: 'A single androgynous model is shown in sharp side profile wearing a glossy black high-collar garment. Wet hair, a long metallic earring, and cool city streaks create a restrained counterpoint to the brighter runway looks.',
    cameraDirection: 'Eye-level 1:1 profile portrait with the face held in crisp focus against horizontal Shibuya motion blur.',
    imageSrc: new URL('../assets/extended-look-11.png', import.meta.url).href,
  },
  {
    number: 12,
    title: 'LOOK 12: Crimson Twin Signal',
    modelType: 'Androgynous Runway Duo (Red & Pink)',
    colorPalette: 'Crimson Red, Electric Pink, Silver Chrome, Neon Violet',
    specs: 'Two models advance together in sculptural red and saturated-pink outerwear. Mirrored eyewear, strong shoulders, and glossy layered textiles create a synchronized dual-look statement beneath the Shibuya screens.',
    cameraDirection: 'Low-angle 1:1 two-model portrait that preserves both garments and the dense neon architecture above them.',
    imageSrc: new URL('../assets/extended-look-12.png', import.meta.url).href,
  },
  {
    number: 13,
    title: 'LOOK 13: Electric Lime Formation',
    modelType: 'Androgynous Runway Ensemble',
    colorPalette: 'Deep Forest Green, Electric Lime, Black, Neon Pink',
    specs: 'A coordinated group crosses the wet plaza in dark architectural tailoring edged with fluorescent lime. The lead pair and repeating background silhouettes turn the square frame into a disciplined runway formation.',
    cameraDirection: 'Centered low-angle 1:1 ensemble view with full silhouettes, lime footwear, and mirrored pavement visible.',
    imageSrc: new URL('../assets/extended-look-13.png', import.meta.url).href,
  },
  {
    number: 14,
    title: 'LOOK 14: Processional Shadow',
    modelType: 'Androgynous Male Lead with Runway Ensemble',
    colorPalette: 'Black, Deep Forest Green, Crimson, Wet Asphalt',
    specs: 'A dark, elongated lead silhouette advances ahead of a coordinated model procession. Controlled flashes of green and crimson embroidery break through the near-black tailoring while rain reflections extend the figures into the street.',
    cameraDirection: 'Low eye-level 1:1 full-body runway composition with the lead model centered and the ensemble receding behind.',
    imageSrc: new URL('../assets/extended-look-14.png', import.meta.url).href,
  },
  {
    number: 15,
    title: 'LOOK 15: Crimson Pixel Armor',
    modelType: 'Punk Female (Three-Quarter Portrait)',
    colorPalette: 'Crimson Red, Hot Pink, Black, Amber Neon',
    specs: 'A punk model with a sculpted crimson crop wears a high-gloss red garment fragmented by pixel-like illuminated accents. The asymmetric silhouette and metallic jewelry create an intense solo runway portrait.',
    cameraDirection: 'Three-quarter 1:1 portrait with the face and illuminated shoulder held sharply against saturated Shibuya bokeh.',
    imageSrc: new URL('../assets/extended-look-15.png', import.meta.url).href,
  },
  {
    number: 16,
    title: 'Macro Persona (Female Close-Up)',
    modelType: 'Punk Female (Macro Portrait)',
    colorPalette: 'Vibrant Neon Pink, Deep Crimson Red, Cyber Purple',
    specs: 'Intensely hyper-flashy 1:1 square close-up macro portrait. Short horizontal blunt fringe with shaved sides. Raindrops glisten on skin under intense pink and crimson neon.',
    cameraDirection: 'Centered tight square close-up portrait, capturing fierce eyes locking onto the camera lens.',
    imageSrc: new URL('../assets/extended-look-16.png', import.meta.url).href,
  },
  {
    number: 17,
    title: 'LOOK 17: Shibuya Neon Grid',
    modelType: 'Aerial Runway Environment',
    colorPalette: 'Hot Pink, Electric Lime, White, Midnight Black',
    specs: 'An elevated view transforms Shibuya Crossing into a luminous geometric grid. Pink and lime screens surround the empty wet intersection, establishing the urban runway environment before the next entrance.',
    cameraDirection: 'High-angle aerial 1:1 city composition centered on the crossing geometry and reflective streets.',
    imageSrc: new URL('../assets/extended-look-17.png', import.meta.url).href,
  },
  {
    number: 18,
    title: 'LOOK 18: Lime Vector Step',
    modelType: 'Footwear & Textile Detail',
    colorPalette: 'Fluorescent Lime, Black, Forest Green, Neon Pink',
    specs: 'A sculptural fluorescent-lime high-top sneaker anchors the frame beneath black trousers traced with green geometric lines. The wet street mirrors the shoe and surrounding signs, turning the footwear into the central runway object.',
    cameraDirection: 'Ground-level 1:1 footwear close-up with the complete shoe, trouser hem, and pavement reflection visible.',
    imageSrc: new URL('../assets/extended-look-18.png', import.meta.url).href,
  },
  {
    number: 19,
    title: 'LOOK 19: Black Rain Vanguard',
    modelType: 'Androgynous Female (Full-Body Runway Portrait)',
    colorPalette: 'Gloss Black, Crimson, Hot Pink, Fluorescent Yellow',
    specs: 'A single model cuts through a rain puddle in a long black architectural garment with glossy layered texture and restrained red-pink accents. The moving hem and reflected city light create a forceful late-show silhouette.',
    cameraDirection: 'Low-angle 1:1 full-body runway frame with the model, sweeping garment, and water splash preserved.',
    imageSrc: new URL('../assets/extended-look-19.png', import.meta.url).href,
  },
  {
    number: 20,
    title: 'LOOK 20: Neon Rain Corridor',
    modelType: 'Runway Background / Audience',
    colorPalette: 'Neon Pink, Electric Lime, Fluorescent Yellow',
    specs: 'An empty rain-soaked Shibuya corridor becomes the closing runway environment, reflecting saturated pink, lime, and yellow light across the street and canal-like pavement.',
    cameraDirection: 'Centered 1:1 wide environment view holding the illuminated vanishing point as the final background plate.',
    imageSrc: new URL('../assets/extended-look-20.png', import.meta.url).href,
  },
];
