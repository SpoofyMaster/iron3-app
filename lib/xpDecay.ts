import { Discipline } from "@/types";

const DECAY_GRACE_DAYS = 3;           // days before decay starts
const DECAY_RATE_PER_WEEK = 0.10;     // 10% per week
const DECAY_RATE_PER_DAY = DECAY_RATE_PER_WEEK / 7; // ~1.43%/day

export interface DecayResult {
  newPoints: number;
  decayApplied: number;
  daysInactive: number;
  isDecaying: boolean;
}

/**
 * Calculate XP decay for a single discipline.
 * Decay starts after DECAY_GRACE_DAYS of inactivity.
 * Rate: 10% of current points per week (compounded daily).
 */
export function calculateDecay(
  points: number,
  lastActivityDate: string | null,
  referenceDate: Date = new Date()
): DecayResult {
  if (points <= 0 || !lastActivityDate) {
    return { newPoints: Math.max(0, points), decayApplied: 0, daysInactive: 0, isDecaying: false };
  }

  const last = new Date(lastActivityDate);
  last.setHours(0, 0, 0, 0);
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  const daysInactive = Math.floor((ref.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (daysInactive <= DECAY_GRACE_DAYS) {
    return { newPoints: points, decayApplied: 0, daysInactive, isDecaying: false };
  }

  // Days actually decaying (after grace period)
  const decayDays = daysInactive - DECAY_GRACE_DAYS;

  // Compound decay: points * (1 - rate)^days
  const newPoints = Math.max(0, Math.floor(points * Math.pow(1 - DECAY_RATE_PER_DAY, decayDays)));
  const decayApplied = points - newPoints;

  return {
    newPoints,
    decayApplied,
    daysInactive,
    isDecaying: true,
  };
}

/**
 * Get a human-readable decay warning message for a discipline.
 */
export function getDecayWarning(discipline: Discipline, result: DecayResult): string | null {
  if (!result.isDecaying) return null;
  const pct = result.decayApplied > 0
    ? Math.round((result.decayApplied / (result.newPoints + result.decayApplied)) * 100)
    : 0;
  return `${discipline.charAt(0).toUpperCase() + discipline.slice(1)}: ${result.daysInactive}d inactive${pct > 0 ? ` · -${pct}% XP` : ""}`;
}

export { DECAY_GRACE_DAYS };
