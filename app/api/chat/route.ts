import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  RateLimiter,
  getClientIdentifier,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import {
  generateGeminiText,
  DEFAULT_GEMINI_MODEL,
  type GeminiMessage,
} from "@/lib/gemini";

// Allow up to 20 chat messages per minute per user. AI calls are expensive,
// so this protects both our Gemini quota and the service from abuse.
const chatLimiter = new RateLimiter({ limit: 20, windowMs: 60_000 });

const SYSTEM_PROMPT = `You are an expert AI coding assistant embedded in CodeNest — a collaborative, browser-based IDE. Help developers with:
- Code explanations, debugging, and error fixing
- Architecture advice and best practices
- Writing clean, efficient, well-typed code
- Code reviews and performance optimizations
- Data structures & algorithms (explanations, complexity analysis, idiomatic solutions)

Always format code with proper markdown fenced code blocks including a language identifier.
Be concise but complete. If a request is ambiguous, state your assumption in one line, then answer.`;

interface ChatRequest {
  message: string;
  history?: GeminiMessage[];
  model?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Require an authenticated session before touching the AI provider.
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to use the AI assistant." },
        { status: 401 }
      );
    }

    // Throttle per user to prevent runaway Gemini usage.
    const identifier = getClientIdentifier(req, session.user.id);
    const rate = chatLimiter.check(identifier);
    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again shortly." },
        { status: 429, headers: rateLimitHeaders(rate) }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured (missing GEMINI_API_KEY)." },
        { status: 503 }
      );
    }

    const body: ChatRequest = await req.json();
    const { message, history = [], model } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // Keep only well-formed, recent history entries.
    const validHistory: GeminiMessage[] = Array.isArray(history)
      ? history
          .filter(
            (m) =>
              m &&
              typeof m.role === "string" &&
              typeof m.content === "string" &&
              (m.role === "user" || m.role === "assistant")
          )
          .slice(-10)
      : [];

    const messages: GeminiMessage[] = [
      ...validHistory,
      { role: "user", content: message.trim() },
    ];

    const { text, model: usedModel } = await generateGeminiText(messages, {
      model: model || DEFAULT_GEMINI_MODEL,
      system: SYSTEM_PROMPT,
      temperature: 0.7,
      // Thinking is disabled in the helper, so the full budget is the answer.
      maxOutputTokens: 4096,
    });

    return NextResponse.json(
      {
        response: text,
        model: usedModel,
        timestamp: new Date().toISOString(),
      },
      { headers: rateLimitHeaders(rate) }
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
