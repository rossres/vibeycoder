import { Resend } from "resend";
import { verifyAuthToken } from "@/lib/firebase-admin";
import { checkRateLimit, getClientId } from "@/lib/rate-limit";

const NOTIFY_EMAIL = "ross@navamaco.com";

// Rate limit: 10 notifications per 10 minutes per user
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;

const REQUIRE_EMAIL_VERIFIED = process.env.REQUIRE_EMAIL_VERIFIED === "true";

/** Escape HTML special characters to prevent injection */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: "Resend not configured" }, { status: 500 });
  }

  // Rate limit by IP
  const clientId = getClientId(request);
  if (!checkRateLimit(`notify:${clientId}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
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

  // Also rate limit by authenticated user
  if (!checkRateLimit(`notify:uid:${user.uid}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: {
    userName?: unknown;
    userEmail?: unknown;
    weekNumber?: unknown;
    weekTitle?: unknown;
    tasksCompleted?: unknown;
    totalTasks?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userName, userEmail, weekNumber, weekTitle, tasksCompleted, totalTasks } = body;

  if (
    typeof userName !== "string" ||
    !userName.trim() ||
    typeof weekNumber !== "number" ||
    typeof weekTitle !== "string" ||
    typeof tasksCompleted !== "number" ||
    typeof totalTasks !== "number"
  ) {
    return Response.json({ error: "Missing or invalid required fields" }, { status: 400 });
  }

  // Sanitize all user-provided values before inserting into HTML
  const safeName = escapeHtml(userName.slice(0, 200));
  const safeEmail = escapeHtml(
    typeof userEmail === "string" ? userEmail.slice(0, 200) : "Not signed up",
  );
  const safeWeekTitle = escapeHtml(weekTitle.slice(0, 200));
  const safeWeekNum = weekNumber + 1;

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "VibeyCoder <onboarding@resend.dev>",
    to: NOTIFY_EMAIL,
    subject: `${safeName} completed Week ${safeWeekNum} — ${safeWeekTitle}`,
    html: `
      <div style="font-family: monospace; background: #08080d; color: #ccc; padding: 32px; border-radius: 12px;">
        <h2 style="color: #00f0ff; margin-top: 0;">Week ${safeWeekNum} Complete</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
          <tr>
            <td style="padding: 8px 16px 8px 0; color: #888;">User</td>
            <td style="padding: 8px 0; color: #fff; font-weight: bold;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 16px 8px 0; color: #888;">Email</td>
            <td style="padding: 8px 0; color: #fff;">${safeEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 16px 8px 0; color: #888;">Week</td>
            <td style="padding: 8px 0; color: #00f0ff; font-weight: bold;">${safeWeekNum} — ${safeWeekTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 16px 8px 0; color: #888;">Tasks</td>
            <td style="padding: 8px 0; color: #fff;">${Number(tasksCompleted)}/${Number(totalTasks)}</td>
          </tr>
        </table>
        <p style="color: #555; font-size: 12px; margin-top: 24px;">— vibeycoder.ai</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
