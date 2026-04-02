import type { Activity, PrepMatchType, PrepPlanWeek, PrepSession } from "@/types";
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

/** Watch verification rows that count as a completed PREP session for UI + progress rings. */
export function isPrepWatchMatch(matchType: PrepMatchType): boolean {
  return matchType === "exact_match" || matchType === "partial_match";
}

export function verificationForSessionDay(
  verifications: PrepSessionVerificationRow[],
  sessionDay: PrepSession["day"]
): PrepSessionVerificationRow | undefined {
  return verifications.find((x) => x.sessionDay === sessionDay);
}

/** Minutes to credit toward weekly discipline rings (watch actuals when available). */
export function minutesForPrepSessionProgress(
  session: PrepSession,
  v: PrepSessionVerificationRow | undefined,
  activities: Activity[]
): number {
  if (session.discipline === "rest") return 0;

  const watchOk = v && isPrepWatchMatch(v.matchType);
  const manualDone = session.completed;

  if (!watchOk && !manualDone) return 0;

  if (watchOk && v) {
    if (v.actualActivityId) {
      const act = activities.find((a) => a.id === v.actualActivityId);
      if (act && act.duration > 0) {
        return Math.max(1, Math.round(act.duration / 60));
      }
    }
  }

  return session.durationMin;
}

export type PrepDisciplineProgress = {
  swimPlanned: number;
  swimDone: number;
  bikePlanned: number;
  bikeDone: number;
  runPlanned: number;
  runDone: number;
  totalPlanned: number;
  totalDone: number;
};

/** Weekly ring totals for PREP plan (swim / bike / run only; brick excluded like legacy UI). */
export function computePrepPlanDisciplineProgress(
  sessions: PrepSession[],
  verifications: PrepSessionVerificationRow[],
  activities: Activity[]
): PrepDisciplineProgress {
  let swimPlanned = 0;
  let swimDone = 0;
  let bikePlanned = 0;
  let bikeDone = 0;
  let runPlanned = 0;
  let runDone = 0;

  for (const s of sessions) {
    if (s.discipline === "rest") continue;
    if (s.discipline !== "swim" && s.discipline !== "bike" && s.discipline !== "run") continue;

    const v = verificationForSessionDay(verifications, s.day);
    const planned = s.durationMin;
    const doneMin = minutesForPrepSessionProgress(s, v, activities);

    if (s.discipline === "swim") {
      swimPlanned += planned;
      swimDone += doneMin;
    } else if (s.discipline === "bike") {
      bikePlanned += planned;
      bikeDone += doneMin;
    } else {
      runPlanned += planned;
      runDone += doneMin;
    }
  }

  const totalPlanned = swimPlanned + bikePlanned + runPlanned;
  const totalDone = swimDone + bikeDone + runDone;
  return {
    swimPlanned,
    swimDone,
    bikePlanned,
    bikeDone,
    runPlanned,
    runDone,
    totalPlanned,
    totalDone,
  };
}

export function computePrepRowStatus(
  session: PrepSession,
  week: PrepPlanWeek,
  verifications: PrepSessionVerificationRow[],
  activities: Activity[]
): PrepRowUiStatus {
  if (session.discipline === "rest") return "rest";

  const v = verificationForSessionDay(verifications, session.day);
  if (v && isPrepWatchMatch(v.matchType)) {
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
