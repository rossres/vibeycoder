import Anthropic from "@anthropic-ai/sdk";
import { verifyAuthToken } from "@/lib/firebase-admin";
import { checkRateLimit, getClientId } from "@/lib/rate-limit";
import { checkAndIncrementDailyQuota } from "@/lib/quota";

// Hardcode system prompt server-side — never trust client-supplied prompts
const SYSTEM_PROMPT = `You are a coding tutor embedded in Vibey Coder, a 28-day builder lab where people create real apps with AI.

Guidelines:
- Be concise. Short paragraphs, numbered steps.
- When showing code, keep snippets minimal and explain each part.
- Be encouraging but not patronizing.
- If someone is stuck, diagnose before jumping to solutions.
- If a task is about reflection, guide the thinking process.`;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 3000;
const MAX_OUTPUT_TOKENS = 512;
const RATE_LIMIT_MAX = 15; // requests per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

// Flip to "true" once existing users have verified their emails.
const REQUIRE_EMAIL_VERIFIED = process.env.REQUIRE_EMAIL_VERIFIED === "true";

// Comma-separated list of allowed origins (e.g. "https://vibeycoder.ai,https://www.vibeycoder.ai")
// Leave unset in dev to skip the check.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isOriginAllowed(request: Request): boolean {
  if (ALLOWED_ORIGINS.length === 0) return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  if (!isOriginAllowed(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit by IP (per-instance burst protection)
  const clientId = getClientId(request);
  if (!checkRateLimit(`chat:${clientId}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  // Verify authentication
  const user = await verifyAuthToken(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (REQUIRE_EMAIL_VERIFIED && !user.emailVerified) {
    return Response.json({ error: "Email not verified" }, { status: 403 });
  }

  // Per-user burst rate limit (per-instance)
  if (!checkRateLimit(`chat:uid:${user.uid}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  // Durable per-user daily quota (Firestore-backed, survives cold starts and multi-account abuse)
  const quota = await checkAndIncrementDailyQuota(user.uid);
  if (!quota.ok) {
    return Response.json({ error: "Daily limit reached" }, { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Messages are required" }, { status: 400 });
  }

  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Too many messages" }, { status: 400 });
  }

  const sanitizedMessages = messages
    .filter(
      (m: unknown): m is { role: string; content: string } =>
        typeof m === "object" &&
        m !== null &&
        "role" in m &&
        "content" in m &&
        typeof (m as Record<string, unknown>).role === "string" &&
        typeof (m as Record<string, unknown>).content === "string" &&
        ((m as Record<string, unknown>).role === "user" ||
          (m as Record<string, unknown>).role === "assistant"),
    )
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, MAX_MESSAGE_CHARS),
    }));

  if (sanitizedMessages.length === 0) {
    return Response.json({ error: "No valid messages" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: MAX_OUTPUT_TOKENS,
    system: SYSTEM_PROMPT,
    messages: sanitizedMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ text: event.delta.text })}\n\n`,
              ),
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Stream error" })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
