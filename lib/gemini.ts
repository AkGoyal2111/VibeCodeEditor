/**
 * Thin wrapper over the free-tier Google Gemini REST API.
 *
 * It tries a preferred model then falls through a best-first list on quota
 * (429 / RESOURCE_EXHAUSTED) and not-found (404) errors, so a single exhausted
 * model never takes the whole feature down.
 */

// Best-first list of models available on the Gemini free tier.
export const FREE_GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
] as const;

export type GeminiModel = (typeof FREE_GEMINI_MODELS)[number];

export const DEFAULT_GEMINI_MODEL: GeminiModel = "gemini-2.5-flash";

export interface GeminiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GeminiCallOptions {
  /** Preferred model; defaults to gemini-2.5-flash. */
  model?: string;
  /** Optional system instruction. */
  system?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiResult {
  text: string;
  /** The model that actually produced the response (after any fallback). */
  model: string;
}

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

function isFallbackError(message: string): boolean {
  return (
    message.includes("429") ||
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("not supported")
  );
}

async function callModel(
  modelId: string,
  messages: GeminiMessage[],
  apiKey: string,
  opts: GeminiCallOptions
): Promise<GeminiResult> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `${ENDPOINT}/${modelId}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        ...(opts.system
          ? { systemInstruction: { parts: [{ text: opts.system }] } }
          : {}),
        generationConfig: {
          temperature: opts.temperature ?? 0.7,
          maxOutputTokens: opts.maxOutputTokens ?? 2048,
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini ${modelId} error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const text: string | undefined =
    data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const finish = data.candidates?.[0]?.finishReason;
    throw new Error(`Empty response from ${modelId}${finish ? ` (${finish})` : ""}`);
  }
  return { text: text.trim(), model: modelId };
}

/**
 * Generate a completion, retrying across the free model list on quota errors.
 * Throws if the API key is missing or every model fails.
 */
export async function generateGeminiText(
  messages: GeminiMessage[],
  opts: GeminiCallOptions = {}
): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }

  const preferred =
    opts.model && FREE_GEMINI_MODELS.includes(opts.model as GeminiModel)
      ? (opts.model as GeminiModel)
      : DEFAULT_GEMINI_MODEL;

  const order = [
    preferred,
    ...FREE_GEMINI_MODELS.filter((m) => m !== preferred),
  ];

  let lastError: unknown;
  for (const model of order) {
    try {
      return await callModel(model, messages, apiKey, opts);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (isFallbackError(msg)) continue;
      throw err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("All Gemini models failed");
}
