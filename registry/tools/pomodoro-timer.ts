import type { Tool } from "@/types/tool";

/**
 * registry/tools/pomodoro-timer.ts
 *
 * Registry entry for the "Pomodoro Timer" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const pomodoroTimer: Tool = {
  "id": "tool_018",
  "slug": "pomodoro-timer",
  "title": "Pomodoro Timer",
  "shortDescription": "Stay focused with configurable work and break intervals, right in a tab.",
  "category": "productivity",
  "tags": [
    "pomodoro",
    "focus",
    "timer",
    "work sessions",
    "breaks"
  ],
  "icon": "timer",
  "featured": false,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Pomodoro Timer Online — Focus Sessions in Your Browser",
  "seoDescription": "A clean, configurable Pomodoro timer with work and break intervals and gentle notifications. Stay focused without installing anything."
};
