# PRIMEVAL GLITCH: Tokyo Avant-Garde Cinema Runway

**Tokyo Virtual Fashion Show** is an AI-directed creative production application built with Replit and Google Gemini. It transforms a model profile and creative brief into a structured virtual runway production with fashion looks, camera direction, timeline playback, narration controls, and original code-synthesized music.

## Live project
- Interactive application: https://tokyo-virtual-fashion-show.replit.app
- Demonstration video: https://vimeo.com/1224149589?fl=pl&fe=sh

## Features
- AI-directed runway generation
- LOOK 10–20 collection management
- Interactive production dashboard and timeline
- Camera and creative direction
- English narration controls
- Runtime Web Audio soundtrack and downloadable WAV
- Photographic fallbacks when generation is unavailable

## Google Gemini runtime use
The API server imports and calls the official `@google/genai` SDK at runtime. Gemini interprets creative briefs and returns structured fashion-show plans and production descriptions. Image requests also use the Google GenAI client when configured. See `artifacts/api-server/src/lib/google-genai.ts` and `artifacts/api-server/src/routes/fashion-show.ts`.

Configure Replit AI Integrations (`AI_INTEGRATIONS_GEMINI_API_KEY` and `AI_INTEGRATIONS_GEMINI_BASE_URL`) or a direct `GOOGLE_API_KEY` / `GEMINI_API_KEY`. Never commit API keys.

## Technology
Replit, Replit Agent, React, TypeScript, Vite, Tailwind CSS, Express, Google Gemini via `@google/genai`, Replit AI Integrations, Web Audio API, and OfflineAudioContext.

## Structure
- `artifacts/tokyo-fashion-show`: React/Vite frontend
- `artifacts/api-server`: Express API and Gemini orchestration
- `lib/api-client-react`: React API client
- `lib/api-zod`: API validation schemas
- `lib/integrations-gemini-ai`: managed Gemini helpers
- `lib/db`: shared workspace package

## Install and run
Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
PORT=3001 pnpm --filter @workspace/api-server dev
# In a second terminal:
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/tokyo-fashion-show dev
```

The complete routed experience is designed for Replit artifact routing, which forwards `/api` to the API service. Use the hosted application above for judging.

## Verify
```bash
pnpm run typecheck
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/tokyo-fashion-show build
pnpm --filter @workspace/api-server build
```

## Disclosure
Gemini through Replit AI Integrations powers creative planning and structured generation. The soundtrack is synthesized in code with Web Audio. Demonstration narration used text-to-speech. The final video was edited manually in CyberLink PowerDirector with AI features disabled.

## Creator
Created by **Miho Kinomura AI**. As an AI Film Director and former fashion designer, I built this working AI-agent application in one week as a complete beginner. My focus is **AI × FASHION**.

## License
MIT — see [LICENSE](LICENSE).
