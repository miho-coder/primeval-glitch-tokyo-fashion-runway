export const timelineScripts = {
  part1: "Welcome to the live demo of 'PRIMEVAL GLITCH: Tokyo Avant-Garde Cinema Runway.' In this first part, we demonstrate how an advanced creative agent redefines the planning phase of a digital fashion production. First, we enter a model profile directly into the system. Watch as the agent analyzes the direction and begins orchestrating a complete virtual fashion show from scratch. Right here on the screen, the system composes high-concept visual direction, detailed model profiles, and technical clothing specifications. In the final phase, the agent structures the production into a live dashboard, creating the show's sequence, camera directions, and an actionable timeline.",
  part2: "Now, let us experience the final vision brought to life. Welcome to Shibuya, Tokyo—the epicenter of street fashion and the physical stage for this cyberpunk masterpiece. As the cinematic runway unfolds beneath iconic neon lights of pink, yellow, and vibrant lime green, the raw energy of the city collides with the digital world. Notice the breathtaking geometric matrix lines cutting through a sophisticated base of deep forest green and rich moss green. High-visibility fluorescent neon yellow highlights pierce through the dark rain, perfectly matching the futuristic architectural glasses and bold high-top sneakers. Every element is organized to turn a creative spark into a functional, structured blueprint for directors, developers, and designers alike. Thank you.",
  audienceImpact: "Tokyo Virtual Fashion Show is a functional creative production agent built with Replit and Gemini. The user begins by entering a model profile and selecting a visual direction. The agent transforms that creative input into structured fashion looks, English narration, music direction, camera instructions, and a complete production timeline. The application helps independent fashion designers and creative directors turn an initial concept into a structured, presentation-ready virtual runway production.",
} as const;

export const PROMO_VOICEOVER = {
  part1: {
    label: 'PART I / SYSTEM & LIVE DASHBOARD',
    playLabel: 'PLAY PART I',
    downloadLabel: 'DOWNLOAD PART I SCRIPT',
    statusLabel: 'PART I',
    text: timelineScripts.part1,
  },
  part2: {
    label: 'PART II / SHIBUYA CINEMATIC',
    playLabel: 'PLAY PART II',
    downloadLabel: 'DOWNLOAD PART II SCRIPT',
    statusLabel: 'PART II',
    text: timelineScripts.part2,
  },
  audienceImpact: {
    label: 'AUDIENCE & IMPACT',
    playLabel: 'PLAY AUDIENCE & IMPACT',
    downloadLabel: 'DOWNLOAD AUDIENCE & IMPACT SCRIPT',
    statusLabel: 'AUDIENCE & IMPACT',
    text: timelineScripts.audienceImpact,
  },
} as const;

export type PromoVoiceoverKey = keyof typeof PROMO_VOICEOVER;