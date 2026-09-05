import {
  GoogleGenAI,
  PersonGeneration,
  type GoogleGenAIOptions,
} from "@google/genai";

let geminiClient: GoogleGenAI | null | undefined;
let imagenClient: GoogleGenAI | null | undefined;

function getDirectGoogleApiKey(): string | undefined {
  return process.env["GOOGLE_API_KEY"] ?? process.env["GEMINI_API_KEY"];
}

function createGeminiClient(): GoogleGenAI | null {
  const directApiKey = getDirectGoogleApiKey();
  const managedApiKey = process.env["AI_INTEGRATIONS_GEMINI_API_KEY"];
  const apiKey = directApiKey ?? managedApiKey;
  if (!apiKey) return null;

  const options: GoogleGenAIOptions = { apiKey };

  // Replit's managed Gemini integration uses a proxy base URL. A direct
  // GOOGLE_API_KEY uses the Google Gen AI SDK's standard Gemini endpoint.
  if (!directApiKey) {
    const managedBaseUrl = process.env["AI_INTEGRATIONS_GEMINI_BASE_URL"];
    if (!managedBaseUrl) return null;
    options.httpOptions = {
      apiVersion: "",
      baseUrl: managedBaseUrl,
    };
  }

  return new GoogleGenAI(options);
}

function createImagenClient(): GoogleGenAI | null {
  const apiKey = getDirectGoogleApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export function getGeminiClient(): GoogleGenAI | null {
  if (geminiClient !== undefined) return geminiClient;

  try {
    geminiClient = createGeminiClient();
  } catch {
    // Leave the cache undefined so a later request can retry initialization.
    geminiClient = undefined;
    return null;
  }

  return geminiClient;
}

function getImagenClient(): GoogleGenAI | null {
  if (imagenClient !== undefined) return imagenClient;

  try {
    imagenClient = createImagenClient();
  } catch {
    imagenClient = undefined;
    return null;
  }

  return imagenClient;
}

function isTransientGeminiError(error: unknown): boolean {
  const candidate = error as { status?: number; message?: string };
  const status = candidate?.status;
  const message = String(candidate?.message ?? error ?? "").toUpperCase();
  return (
    status === 429 ||
    status === 503 ||
    message.includes("429") ||
    message.includes("503") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("UNAVAILABLE")
  );
}

async function withTransientRetry<T>(
  operation: () => Promise<T>,
): Promise<T> {
  const maxAttempts = 2;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isTransientGeminiError(error) || attempt === maxAttempts - 1) {
        throw error;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, 250 * 2 ** attempt),
      );
    }
  }
  throw new Error("Gemini request exhausted its retry budget.");
}

export async function generateFashionText(
  prompt: string,
): Promise<string | null> {
  const client = getGeminiClient();
  if (!client) return null;

  const response = await withTransientRetry(() =>
    client.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    }),
  );
  return response.text ?? null;
}

export async function generateFashionImage(
  prompt: string,
): Promise<{ b64Json: string; mimeType: string } | null> {
  const client = getImagenClient();
  if (!client) return null;

  const response = await withTransientRetry(() =>
    client.models.generateImages({
      model: process.env["IMAGEN_MODEL"] ?? "imagen-3.0-generate-002",
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "1:1",
        personGeneration: PersonGeneration.ALLOW_ADULT,
        outputMimeType: "image/png",
        includeRaiReason: true,
        enhancePrompt: true,
      },
    }),
  );

  const generatedImage = response.generatedImages?.[0];
  const imageBytes = generatedImage?.image?.imageBytes;

  if (!imageBytes) {
    if (generatedImage?.raiFilteredReason) {
      throw new Error(
        `Imagen generation was filtered: ${generatedImage.raiFilteredReason}`,
      );
    }
    return null;
  }

  return {
    b64Json: imageBytes,
    mimeType: generatedImage.image?.mimeType || "image/png",
  };
}