import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  RateLimiter,
  getClientIdentifier,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import {
  analyzeCodeContext,
  buildPrompt,
  type CodeContext,
} from "@/modules/playground/lib/code-context";
import { generateGeminiText } from "@/lib/gemini";

interface CodeSuggestionRequest {
  fileContent: string;
  cursorLine: number;
  cursorColumn: number;
  suggestionType: string;
  fileName?: string;
}

// Inline completions fire frequently while typing, so allow a higher ceiling
// than chat but still cap it per user to protect the Gemini quota.
const completionLimiter = new RateLimiter({ limit: 60, windowMs: 60_000 });

export async function POST(request: NextRequest) {
  try {
    // Require an authenticated session before calling the AI provider.
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Throttle per user.
    const identifier = getClientIdentifier(request, session.user.id);
    const rate = completionLimiter.check(identifier);
    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: rateLimitHeaders(rate) }
      );
    }

    const body: CodeSuggestionRequest = await request.json();

    const { fileContent, cursorLine, cursorColumn, suggestionType, fileName } =
      body;

    // Validate input
    if (!fileContent || cursorLine < 0 || cursorColumn < 0 || !suggestionType) {
      return NextResponse.json(
        { error: "Invalid input parameters" },
        { status: 400 }
      );
    }

    const context = analyzeCodeContext(
      fileContent,
      cursorLine,
      cursorColumn,
      fileName
    );

    const prompt = buildPrompt(context, suggestionType);

    const suggestion = await generateSuggestion(prompt);

    return NextResponse.json(
      {
        suggestion,
        context,
        metadata: {
          language: context.language,
          framework: context.framework,
          position: context.cursorPosition,
          generatedAt: new Date().toISOString(),
        },
      },
      { headers: rateLimitHeaders(rate) }
    );
  } catch (error: any) {
    console.error("Context analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

async function generateSuggestion(prompt: string): Promise<string> {
  try {
    const { text } = await generateGeminiText(
      [{ role: "user", content: prompt }],
      { temperature: 0.2, maxOutputTokens: 300 }
    );

    let suggestion = text;

    // Strip fenced code blocks the model may wrap the snippet in.
    if (suggestion.includes("```")) {
      const codeMatch = suggestion.match(/```[\w]*\n?([\s\S]*?)```/);
      suggestion = codeMatch ? codeMatch[1].trim() : suggestion;
    }

    return suggestion;
  } catch (error) {
    console.error("AI generation error:", error);
    return "// AI suggestion unavailable";
  }
}

export type { CodeContext };
