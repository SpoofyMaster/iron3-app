/**
 * Smart correlation: watch workouts ↔ PREP plan sessions.
 * Date + discipline + duration (±30%) per XP_OVERHAUL_SPEC.md
 */
import type { PrepPlan, PrepPlanWeek, PrepSession } from "@/types";
import type { HealthWorkoutData } from "./healthKit";
export type PrepMatchType = "exact_match" | "partial_match" | "no_match";

export interface PrepCorrelationResult {
  matchType: PrepMatchType;
  /** 0–1 */
  correlationScore: number;
  prepWeekNumber: number | null;
  sessionDay: string | null;
  plannedDurationSec: number | null;
  sessionDiscipline: PrepSession["discipline"] | null;
  /** Multiplier applied to base XP (1.5 exact, 1.25 partial, 1 none) */
  xpMultiplier: number;
}

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function parseLocalDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function durationToleranceOk(actualSec: number, plannedMin: number): boolean {
  if (plannedMin <= 0) return true;
  const plannedSec = plannedMin * 60;
  const ratio = actualSec / plannedSec;
  return ratio >= 0.7 && ratio <= 1.3;
}

function disciplineMatchesSession(
  workoutDiscipline: Discipline,
  sessionDiscipline: PrepSession["discipline"]
): boolean {
  if (sessionDiscipline === "rest") return false;
  if (sessionDiscipline === "brick") {
    return workoutDiscipline === "bike" || workoutDiscipline === "run";
  }
  return workoutDiscipline === sessionDiscipline;
}

function scoreFromDuration(actualSec: number, plannedMin: number): number {
  if (plannedMin <= 0) return 0.85;
  const plannedSec = plannedMin * 60;
  const ratio = actualSec / plannedSec;
  const inTol = ratio >= 0.7 && ratio <= 1.3;
  if (inTol) {
    const err = Math.abs(1 - ratio);
    return Math.min(1, 0.95 + (0.05 * (1 - err / 0.3)));
  }
  if (ratio > 0) return 0.65 + Math.min(0.29, 0.29 * (1 - Math.min(Math.abs(1 - ratio), 1)));
  return 0.4;
}

/**
 * Find PREP session on the same calendar day as the workout and score the match.
 */
export function correlateWorkoutWithPrepPlan(
  workout: HealthWorkoutData,
  prepPlan: PrepPlan | null | undefined,
  _swimPoints: number,
  _bikePoints: number,
  _runPoints: number
): PrepCorrelationResult {
  const empty: PrepCorrelationResult = {
    matchType: "no_match",
    correlationScore: 0,
    prepWeekNumber: null,
    sessionDay: null,
    plannedDurationSec: null,
    sessionDiscipline: null,
    xpMultiplier: 1,
  };

  if (!prepPlan?.weeks?.length || !workout.discipline) return empty;

  const workoutDayKey = parseLocalDateKey(workout.startDate);

  let best: PrepCorrelationResult = { ...empty };
  let bestScore = -1;

  for (const week of prepPlan.weeks) {
    for (const session of week.sessions) {
      if (session.discipline === "rest") continue;

      const sDate = sessionCalendarDate(week, session.day);
      if (dateKey(sDate) !== workoutDayKey) continue;

      if (!disciplineMatchesSession(workout.discipline, session.discipline)) continue;

      const plannedMin = session.durationMin;
      const plannedSec = plannedMin * 60;
      const actualSec = workout.duration;

      const tol = durationToleranceOk(actualSec, plannedMin);
      const score = scoreFromDuration(actualSec, plannedMin);

      const matchType: PrepMatchType = tol ? "exact_match" : "partial_match";
      const mult = tol ? 1.5 : 1.25;

      const candidate: PrepCorrelationResult = {
        matchType,
        correlationScore: score,
        prepWeekNumber: week.weekNumber,
        sessionDay: session.day,
        plannedDurationSec: plannedSec,
        sessionDiscipline: session.discipline,
        xpMultiplier: mult,
      };

      const weighted = score + (matchType === "exact_match" ? 0.1 : 0);
      if (weighted > bestScore) {
        bestScore = weighted;
        best = candidate;
      }
    }
  }

  if (bestScore < 0) return empty;
  return best;
}
