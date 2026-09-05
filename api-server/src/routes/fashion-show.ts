import { Router, type IRouter } from "express";
import {
  GenerateFashionLookBody,
  GenerateFashionLookResponse,
  GenerateFashionShowBody,
  GenerateFashionShowResponse,
  GetCurrentFashionShowResponse,
} from "@workspace/api-zod";
import {
  generateFashionImage,
  generateFashionText,
  getGeminiClient,
} from "../lib/google-genai";

const router: IRouter = Router();

const signatureModelFeatures = [
  "A 180cm+ Japanese non-binary / transgender high-fashion model with a small head and extreme runway proportions.",
  "Androgynous facial architecture where masculine and feminine codes coexist in one striking face.",
  "Wide-set eyes, ultra-short horizontal blunt bangs, and skin-close shaved sides.",
  "A glossy, perfectly straight black mane flowing to the back.",
  "Oversized statement earrings paired with bizarre neon-tech sneakers.",
];

const fixedShibuyaBackground =
  "Shibuya night neon street after rain, with wet asphalt reflections and cinematic cyberpunk depth.";

const curatedShibuyaEditorialFallbacks = [
  {
    searchQuery:
      "shibuya night neon fashion editorial japanese androgynous model",
    imageUrl: "/extended-look-10.png",
  },
  {
    searchQuery:
      "avant-garde runway tokyo high fashion non-binary neon editorial",
    imageUrl: "/extended-look-11.png",
  },
  {
    searchQuery:
      "shibuya rainy night couture japanese transgender fashion editorial",
    imageUrl: "/extended-look-12.png",
  },
  {
    searchQuery:
      "shibuya neon portrait avant-garde japanese androgynous couture",
    imageUrl: "/extended-look-13.png",
  },
  {
    searchQuery:
      "tokyo night black sculptural fashion editorial non-binary model",
    imageUrl: "/extended-look-14.png",
  },
  {
    searchQuery:
      "japanese glitch couture neon balloon sleeves shibuya editorial",
    imageUrl: "/extended-look-15.png",
  },
  {
    searchQuery:
      "monochrome cyber couture silver trousers shibuya night editorial",
    imageUrl: "/extended-look-16.png",
  },
];

const fallbackLookImages = curatedShibuyaEditorialFallbacks.map(
  ({ imageUrl }) => imageUrl,
);

function containsRestrictedScript(value: unknown): boolean {
  return /[\u3040-\u30ff\u3400-\u9fff]/u.test(JSON.stringify(value));
}

function buildLookImagePrompt(
  look: Record<string, unknown>,
  modelName: string,
  conceptDirection: string,
): string {
  const materials = Array.isArray(look.materials)
    ? look.materials.join(", ")
    : "";

  return `
REAL HIGH-CONCEPT FASHION EDITORIAL PHOTOGRAPHY ONLY. Photorealistic, ultra-high-resolution 35mm fashion photograph with natural skin, real textile fibers, and physically believable studio lighting. Absolutely no illustration, anime, cartoon, CGI, 3D render, digital painting, casual street snapshot, daytime streetwear, or synthetic-looking character.

The model is a young, 180cm+ tall, extremely slender androgynous Japanese non-binary/transgender high-fashion model with a small head and striking high-fashion proportions, blending masculine and feminine facial features. Strictly Japanese appearance, no Western or other ethnicities. The model is named ${modelName}, with striking wide-set eyes, ultra-short sharp horizontal black blunt bangs, skin-close shaved sides, and a very long glossy straight black mane flowing down the back.

The model wears the Tokyo avant-garde look "${String(look.name ?? "")}": ${String(look.description ?? "")}
Materials and construction: ${materials}.
Show direction: ${conceptDirection}.

Essential visual codes: oversized statement earrings; sacred gender-neutral European aristocratic high frilled collar; dramatic balloon puff short sleeves; distorted high-waisted wide-leg trousers; heavily raised 3D Japanese embroidery physically swelling from primeval forest green fabric; explosive flat 16-bit glitch fragments in neon pink and high-voltage yellow; ultra-light carbon-fiber frames piercing through the garment; bizarre futuristic high-tech sneakers with neon accents.

Set the entire scene in ${fixedShibuyaBackground} Use a high-end editorial runway composition, not a casual street snap: raw human energy versus AI, extreme tactile contrast, hyper-detailed couture, dramatic cyberpunk lighting, 35mm fashion photography, editorial composition, no text, no logo, no watermark, premium 1:1 square lookbook frame. Preserve the look as realistic high-end fashion photography, never an illustration.
`.trim();
}

const sampleShow = {
  id: "show-tokyo-001",
  title: "PRIMEVAL GLITCH: Tokyo Avant-Garde Cinema Runway",
  subtitle:
    "A 15-minute, seven-chapter collision of 3D tactile Japanese embroidery and 16-bit digital glitch.",
  status: "SHOW READY",
  generatedAt: "2026-09-02T10:30:00+09:00",
  model: {
    name: "Ren Mizuhara",
    gender: "Non-binary / transgender expression",
    bodyType: "180cm+, small-headed, extremely slender",
    aesthetics: ["Cyberpunk", "Decora", "Gothic Tech"],
    features: signatureModelFeatures,
  },
  concept: {
    logline:
      "A Tokyo anomaly born from primeval forest green enters Shibuya after rain, collecting the city’s emotions in pink memory and yellow voltage.",
    direction:
      "Stage raw human energy against AI digital noise: 3D tactile Japanese embroidery collides with flat 16-bit glitch fragments until every stride mutates the garment into an urban light source.",
    palette: ["#071A12", "#FF2E9A", "#F3FF19", "#B8FF5A"],
    venue: fixedShibuyaBackground,
  },
  looks: [
    {
      number: 1,
      name: "Primeval Glitch Aristocrat",
      category: "NEO ARISTOCRATIC GLITCH",
      description:
        "A sacred, gender-neutral aristocratic S/S top in primeval forest green: a high frill collar, monumental balloon puff sleeves, distorted high-waisted wide trousers, and 3D tactile Japanese embroidery swelling like terrain.",
      materials: ["3D tactile Japanese embroidery", "Forest-green textured satin", "Ultra-light carbon frame"],
      imageUrl: fallbackLookImages[0],
      accent: "#B8FF5A",
    },
    {
      number: 2,
      name: "Pink Voltage Decora",
      category: "16-BIT DECO COUTURE",
      description:
        "Flat 16-bit digital glitch fragments in neon pink and high-voltage yellow explode across raised forest-green embroidery. Giant earrings and distorted sleeves break the boundary between pixel and volume.",
      materials: ["Neon-pink digital print", "Foam silicone embroidery", "Balloon taffeta"],
      imageUrl: fallbackLookImages[1],
      accent: "#FF2E9A",
    },
    {
      number: 3,
      name: "Yellow Thunder Mane",
      category: "CYBER BOTANICAL",
      description:
        "Ultra-light carbon ribs pierce the garment while a lacquer-black mane and neon-yellow glitch fragments extend into space. Luminous tech sneakers leave an afterimage in the low 35mm frame.",
      materials: ["Carbon fiber", "Gloss-black hair fiber", "Neon-accented tech mesh"],
      imageUrl: fallbackLookImages[2],
      accent: "#F3FF19",
    },
    {
      number: 4,
      name: "Black Mirror Earring Reliquary",
      category: "NEON RELIQUARY PORTRAIT",
      description:
        "Lacquer-black puff sleeves expand like a shrine around the body, concentrating monumental earrings, transparent eyewear, and a chrome chest object into one ritual portrait.",
      materials: ["Black gloss satin", "Transparent resin eyewear", "Chrome wire sculpture"],
      imageUrl: fallbackLookImages[3],
      accent: "#FF2E9A",
    },
    {
      number: 5,
      name: "Lacquer Balloon Singularity",
      category: "BLACK VOLUME SINGULARITY",
      description:
        "Liquid-black monumental sleeves merge with high-waisted trousers, sealing the body inside a volume that reflects only the wet Shibuya light.",
      materials: ["Black latex satin", "Compressed wool rib", "Shape-memory carbon core"],
      imageUrl: fallbackLookImages[4],
      accent: "#071A12",
    },
    {
      number: 6,
      name: "Fluorescent Mandala Pixel Bloom",
      category: "PIXEL BLOOM BAROQUE",
      description:
        "Neon pink, cyan, and acid-yellow pixels invade deep green and gold jacquard. Spherical sleeves and platform tech sneakers fuse baroque ceremony with a game-world glitch.",
      materials: ["Deep-green gold jacquard", "16-bit foam print", "Neon balloon taffeta"],
      imageUrl: fallbackLookImages[5],
      accent: "#B8FF5A",
    },
    {
      number: 7,
      name: "Silver Prosthesis Zero Finale",
      category: "MONOCHROME CYBER FINALE",
      description:
        "Monumental black balloon sleeves meet silver wide-leg trousers in an extreme monochrome. Chrome prosthetic hands and a single black visor sever the final boundary between human and AI.",
      materials: ["Black tech satin", "Silver liquid twill", "Chrome prosthetic components"],
      imageUrl: fallbackLookImages[6],
      accent: "#F3FF19",
    },
  ],
  timeline: [
    {
      time: "00:00",
      label: "OPENING",
      type: "Opening",
      description: "In the rain-wet neon street, monumental earrings appear before the body. A low 35mm frame lifts the model from the asphalt reflection.",
      narration: "Tokyo never sleeps. Beneath the city, the forest is growing a body without a name.",
      duration: "1:10",
    },
    {
      time: "01:10",
      label: "LOOK 01",
      type: "Primeval Glitch Aristocrat",
      description: "Volumetric side light sculpts the raised embroidery and high frill collar in forest green.",
      narration: "The first arrival is not a garment. Primeval green presses outward through the skin of the city.",
      duration: "1:45",
    },
    {
      time: "02:55",
      label: "LOOK 02",
      type: "Pink Voltage Decora",
      description: "Neon pink and high-voltage yellow 16-bit glitch jumps from signage to garment, covering tactile embroidery in flat noise.",
      narration: "Human feeling does not lose heat when it becomes a pixel. It becomes excessive, unmistakably Tokyo.",
      duration: "1:45",
    },
    {
      time: "04:40",
      label: "LOOK 03",
      type: "Yellow Thunder Mane",
      description: "Neon-yellow volumetric light and a tracking camera amplify the carbon frame and long black mane.",
      narration: "A living stride breaks the expected outline. What remains is the charged trail of hair.",
      duration: "1:45",
    },
    {
      time: "06:25",
      label: "LOOK 04",
      type: "Black Mirror Earring Reliquary",
      description: "The camera closes in on the face, monumental earrings, and chrome chest object as rain and neon ripple across black sleeves.",
      narration: "The body does not wear the ornament. The ornament chooses the body and leads it into Tokyo night.",
      duration: "1:45",
    },
    {
      time: "08:10",
      label: "LOOK 05",
      type: "Lacquer Balloon Singularity",
      description: "The lighting drops into forest green; only pink reflections on black curves reveal the monumental silhouette.",
      narration: "Black absorbs the light. Inside it, the human outline quietly multiplies.",
      duration: "1:45",
    },
    {
      time: "09:55",
      label: "LOOK 06",
      type: "Fluorescent Mandala Pixel Bloom",
      description: "Glitch fragments sync with the rain, scattering neon data pollen from spherical sleeves onto the street.",
      narration: "Future noise blooms inside an ancient pattern. Error becomes ornament; ornament becomes life.",
      duration: "1:45",
    },
    {
      time: "11:40",
      label: "LOOK 07",
      type: "Silver Prosthesis Zero Finale",
      description: "Hard backlight cuts the silver trousers and chrome hands while every Shibuya neon converges inside the black visor.",
      narration: "The final hand belongs neither to human nor machine. It becomes the future only when it touches.",
      duration: "1:45",
    },
    {
      time: "13:25",
      label: "FINALE",
      type: "Finale",
      description: "Forest green, neon pink, and voltage yellow flash together as a botanical Tokyo dissolves into an impossible backdrop.",
      narration: "This is not the future. It is Tokyo after human heat and digital noise dance in the same garment.",
      duration: "1:10",
    },
  ],
  production: {
    music: "Fast dance-pop groove with layered synthesizer arpeggios",
    tempo: 128,
    lighting: "Forest green / neon pink / high-voltage yellow",
    lightingHex: "#FF2E9A",
    background: fixedShibuyaBackground,
    camera: "35mm low-angle tracking + volumetric backlight",
  },
};

function createFallbackShow(
  modelName: string,
  aesthetics: string[],
) {
  return GenerateFashionShowResponse.parse({
    ...sampleShow,
    id: `fallback-show-${Date.now()}`,
    status: "CURATED PHOTOGRAPHIC FALLBACK",
    generatedAt: new Date().toISOString(),
    model: {
      ...sampleShow.model,
      name: modelName,
      gender: "Non-binary / transgender expression",
      bodyType: "180cm+, small-headed, extremely slender",
      aesthetics,
    },
  });
}

function createFallbackLook(lookNumber: number) {
  const sourceLook =
    sampleShow.looks.find((look) => look.number === lookNumber) ??
    sampleShow.looks[0];

  return GenerateFashionLookResponse.parse({
    ...sourceLook,
    number: lookNumber,
  });
}

router.get("/fashion-shows/current", (_req, res) => {
  res.json(GetCurrentFashionShowResponse.parse(sampleShow));
});

router.post("/fashion-shows/generate", async (req, res) => {
  const parsed = GenerateFashionShowBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please review the model profile." });
    return;
  }

  const { modelName, aesthetics, notes } = parsed.data;
  if (!getGeminiClient()) {
    res.json(createFallbackShow(modelName, aesthetics));
    return;
  }

  const prompt = `
You are the creative director of an experimental Tokyo fashion cinema runway.
Design a strange, beautiful, and physically stageable 15-minute show with exactly seven looks.
Every user-facing string in the JSON must be polished, editorial high-fashion English. Never output Japanese text.

Model name: ${modelName}
Gender expression: Non-binary / transgender expression. This fixed visual direction overrides conflicting input.
Body type: 180cm+, small-headed, extremely slender. This fixed visual direction overrides conflicting input.
Subculture aura: ${aesthetics.join(", ")}
Direction notes: ${notes || "None"}

Apply these signature visual codes throughout:
- The model is a young, 180cm+ tall, extremely slender androgynous Japanese non-binary/transgender high-fashion model with a small head and striking runway proportions, blending masculine and feminine facial features. Strictly Japanese appearance, no Western or other ethnicities.
- Express masculine and feminine architecture within the same face, with striking wide-set eyes.
- Use ultra-short horizontal black blunt bangs, skin-close shaved sides, and a glossy straight black mane flowing down the back.
- Make oversized ornamental statement earrings a dominant styling code.
- Reference sacred gender-neutral European aristocratic dress through high frill collars, monumental balloon puff short sleeves, and distorted high-waisted wide-leg trousers.
- Build the primary surface in deep primeval forest green with physically raised, 3D tactile Japanese embroidery.
- Collide that materiality with flat 16-bit digital glitch fragments in neon pink and high-voltage yellow, pierced by ultra-light carbon frames.
- Complete every silhouette with bizarre futuristic high-tech sneakers carrying neon accents.
- The background is fixed to a Shibuya night neon street after rain, with wet asphalt reflections and dramatic cyberpunk depth. Hyper-detailed high-concept fashion editorial, shot on 35mm. Never use a casual street snapshot, daytime setting, or generic studio background.

Return JSON only. Structure:
{
  "title": "A short English title",
  "subtitle": "One editorial English sentence",
  "concept": {
    "logline": "The narrative core in English",
    "direction": "The overall runway direction in English",
    "palette": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"],
    "venue": "The virtual venue in English"
  },
  "looks": [
    {
      "number": 1,
      "name": "English look name",
      "category": "Short uppercase English category",
      "description": "High-fashion design description in English",
      "materials": ["English material 1", "English material 2", "English material 3"],
      "accent": "#RRGGBB"
    }
  ],
  "timeline": [
    {
      "time": "00:00",
      "label": "OPENING",
      "type": "English scene type",
      "description": "Stage direction in English",
      "narration": "Cinematic English voiceover",
      "duration": "1:00"
    }
  ],
  "production": {
    "music": "Music direction in English",
    "tempo": 120,
    "lighting": "Lighting cue in English",
    "lightingHex": "#RRGGBB",
    "background": "Background in English",
    "camera": "Camera direction in English"
  }
}
Include exactly seven looks numbered 1 through 7 without duplicates. Include exactly nine timeline beats: OPENING, LOOK 01 through LOOK 07, and FINALE.
`;

  try {
    const generated = JSON.parse(
      (await generateFashionText(prompt)) ?? "{}",
    ) as Record<string, unknown>;
    if (containsRestrictedScript(generated)) {
      throw new Error("Generated show contained restricted script content.");
    }
    const generatedLookSource = Array.isArray(generated.looks)
      ? generated.looks
      : [];
    const generatedLooks = sampleShow.looks.map((fallbackLook, index) => ({
      ...fallbackLook,
      ...((generatedLookSource[index] as Record<string, unknown> | undefined) ??
        {}),
      number: index + 1,
    }));
    const conceptDirection =
      typeof (generated.concept as Record<string, unknown> | undefined)
        ?.direction === "string"
        ? String(
            (generated.concept as Record<string, unknown>).direction,
          )
        : "";
    const looks = await Promise.all(
      generatedLooks.map(async (look, index) => {
        const lookRecord = look as Record<string, unknown>;
        let imageUrl =
          fallbackLookImages[index] ?? fallbackLookImages[0];

        try {
          const image = await generateFashionImage(
            buildLookImagePrompt(lookRecord, modelName, conceptDirection),
          );
          if (image) {
            imageUrl = `data:${image.mimeType};base64,${image.b64Json}`;
          }
        } catch (imageError) {
          req.log.warn(
            { err: imageError, lookNumber: index + 1 },
            "Fashion image generation failed; using fallback",
          );
        }

        return {
          ...lookRecord,
          imageUrl,
        };
      }),
    );

    const output = GenerateFashionShowResponse.parse({
      ...generated,
      title: "PRIMEVAL GLITCH: Tokyo Avant-Garde Cinema Runway",
      id: `show-${Date.now()}`,
      status: "AGENTIC SHOW GENERATED",
      generatedAt: new Date().toISOString(),
      model: {
        name: modelName,
        gender: "Non-binary / transgender expression",
        bodyType: "180cm+, small-headed, extremely slender",
        aesthetics,
        features: signatureModelFeatures,
      },
      concept: {
        ...(generated.concept as Record<string, unknown>),
        venue: fixedShibuyaBackground,
      },
      looks,
      timeline:
        Array.isArray(generated.timeline) && generated.timeline.length === 9
          ? generated.timeline
          : sampleShow.timeline,
      production: {
        ...(generated.production as Record<string, unknown>),
        background: fixedShibuyaBackground,
        camera:
          "35mm low-angle full-body fashion editorial tracking with dramatic Shibuya neon reflections",
      },
    });
    res.json(output);
  } catch (error) {
    req.log.warn(
      { err: error },
      "Fashion show generation failed; using photographic fallback",
    );
    res.json(createFallbackShow(modelName, aesthetics));
  }
});

router.post("/fashion-shows/generate-look", async (req, res) => {
  const parsed = GenerateFashionLookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please review the look-generation input." });
    return;
  }

  const { lookNumber, theme, modelName, aesthetics } = parsed.data;
  if (!getGeminiClient()) {
    res.json(createFallbackLook(lookNumber));
    return;
  }
  const copyPrompt = `
Create Look ${lookNumber} for a Tokyo virtual fashion cinema runway under this direction: "${theme}".
Model: ${modelName}. Subculture aura: ${aesthetics.join(", ")}.
Every string must be polished high-fashion English. Never output Japanese text.
Return JSON only: {"name":"English look name","category":"UPPERCASE ENGLISH CATEGORY","description":"High-fashion English design description","materials":["English material 1","English material 2","English material 3"],"accent":"#RRGGBB"}
`;

  try {
    const copy = JSON.parse(
      (await generateFashionText(copyPrompt)) ?? "{}",
    ) as Record<string, unknown>;
    if (containsRestrictedScript(copy)) {
      throw new Error("Generated look contained restricted script content.");
    }
    let imageUrl =
      fallbackLookImages[lookNumber - 1] ?? fallbackLookImages[0];
    try {
      const image = await generateFashionImage(
        buildLookImagePrompt(copy, modelName, theme),
      );
      if (image) {
        imageUrl = `data:${image.mimeType};base64,${image.b64Json}`;
      }
    } catch (imageError) {
      req.log.warn(
        { err: imageError, lookNumber },
        "Fashion image regeneration failed; using fallback",
      );
    }
    const output = GenerateFashionLookResponse.parse({
      ...copy,
      number: lookNumber,
      imageUrl,
    });
    res.json(output);
  } catch (error) {
    req.log.warn(
      { err: error, lookNumber },
      "Fashion look generation failed; using photographic fallback",
    );
    res.json(createFallbackLook(lookNumber));
  }
});

export default router;