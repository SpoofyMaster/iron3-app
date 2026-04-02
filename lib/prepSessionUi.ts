import type { Activity, PrepPlanWeek, PrepSession } from "@/types";
import type { PrepSessionVerificationRow } from "@/types";

export type PrepRowUiStatus = "rest" | "empty" | "verified" | "partial" | "mismatch";

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function mondayOfWeekContaining(weekOfIso: string): Date {
  const d = new Date(weekOfIso.slice(0, 10) + "T12:00:00");
  if (Number.isNaN(d.getTime())) return new Date();
  const dow = d.getDay();
  const monOffset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + monOffset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function sessionCalendarDate(week: PrepPlanWeek, sessionDay: PrepSession["day"]): Date {
  const monday = mondayOfWeekContaining(week.weekOf);
  const idx = DAY_ORDER.indexOf(sessionDay as (typeof DAY_ORDER)[number]);
  const d = new Date(monday);
  if (idx >= 0) d.setDate(monday.getDate() + idx);
  d.setHours(12, 0, 0, 0);
  return d;
}

function dateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function activityOnDay(a: Activity, dayKey: string): boolean {
  return dateKey(a.date) === dayKey;
}

function disciplineMatches(
  d: Activity["discipline"],
  sessionDiscipline: PrepSession["discipline"]
): boolean {
  if (sessionDiscipline === "rest") return false;
  if (sessionDiscipline === "brick") return d === "bike" || d === "run";
  return d === sessionDiscipline;
}

export function computePrepRowStatus(
  session: PrepSession,
  week: PrepPlanWeek,
  verifications: PrepSessionVerificationRow[],
  activities: Activity[]
): PrepRowUiStatus {
  if (session.discipline === "rest") return "rest";

  const v = verifications.find((x) => x.sessionDay === session.day);
  if (v) {
    return v.matchType === "exact_match" ? "verified" : "partial";
  }

  const sDate = sessionCalendarDate(week, session.day);
  const key = dateKeyFromDate(sDate);
  const onDay = activities.filter(
    (a) => activityOnDay(a, key) && a.source === "apple_health"
  );

  if (onDay.length === 0) return "empty";

  const anyMatch = onDay.some((a) => disciplineMatches(a.discipline, session.discipline));
  if (!anyMatch) return "mismatch";

  return "empty";
}

export function filterOffPlanWatchActivities(activities: Activity[]): Activity[] {
  return activities.filter(
    (a) =>
      a.source === "apple_health" &&
      a.pointsEarned > 0 &&
      !(a.prepVerified ?? false)
  );
}
