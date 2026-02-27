"use client";

type AnalyticsEvent =
  | "landing_start_clicked"
  | "name_set"
  | "intro_open_claude_clicked"
  | "intro_completed"
  | "lab_entered"
  | "week_started"
  | "day_opened"
  | "task_done_toggled"
  | "ask_claude_clicked"
  | "stuck_opened"
  | "ship_link_submitted";

interface EventData {
  week?: number;
  day?: number;
  task?: number;
  [key: string]: unknown;
}

export function track(event: AnalyticsEvent, data?: EventData) {
  try {
    // Log to console in dev, store in localStorage for now
    // Replace with real analytics (Plausible, PostHog, etc.) later
    if (process.env.NODE_ENV === "development") {
      console.log(`[analytics] ${event}`, data || "");
    }

    const events = JSON.parse(localStorage.getItem("vc_analytics") || "[]");
    events.push({
      event,
      data,
      timestamp: Date.now(),
    });
    // Keep last 500 events
    if (events.length > 500) events.splice(0, events.length - 500);
    localStorage.setItem("vc_analytics", JSON.stringify(events));
  } catch {}
}
