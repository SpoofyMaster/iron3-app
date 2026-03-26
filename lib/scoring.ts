import { Discipline } from "@/types";

interface ScoringResult {
  basePoints: number;
  distanceBonus: number;
  paceBonus: number;
  totalPoints: number;
}

const BASE_RATES: Record<Discipline, { rate: number; unit: number }> = {
  swim: { rate: 10, unit: 100 },     // 10 pts per 100m
  bike: { rate: 5, unit: 1 },         // 5 pts per km
  run: { rate: 8, unit: 1 },          // 8 pts per km
};

const DISTANCE_BONUS_THRESHOLDS: Record<
  Discipline,
  { threshold: number; bonus: number }[]
> = {
  swim: [
    { threshold: 500, bonus: 15 },
    { threshold: 1000, bonus: 40 },
    { threshold: 1500, bonus: 75 },
    { threshold: 2000, bonus: 120 },
    { threshold: 3000, bonus: 200 },
    { threshold: 5000, bonus: 350 },
  ],
  bike: [
    { threshold: 20, bonus: 15 },
    { threshold: 40, bonus: 40 },
    { threshold: 60, bonus: 75 },
    { threshold: 80, bonus: 120 },
    { threshold: 100, bonus: 200 },
    { threshold: 150, bonus: 350 },
  ],
  run: [
    { threshold: 5, bonus: 15 },
    { threshold: 10, bonus: 40 },
    { threshold: 15, bonus: 75 },
    { threshold: 21.1, bonus: 150 },
    { threshold: 30, bonus: 250 },
    { threshold: 42.2, bonus: 500 },
  ],
};

// Pace thresholds (sec per unit) - lower is faster, more bonus
const PACE_BONUS_THRESHOLDS: Record<
  Discipline,
  { paceBelow: number; bonus: number }[]
> = {
  swim: [
    // sec per 100m
    { paceBelow: 120, bonus: 50 },
    { paceBelow: 105, bonus: 100 },
    { paceBelow: 95, bonus: 175 },
    { paceBelow: 85, bonus: 275 },
    { paceBelow: 75, bonus: 400 },
  ],
  bike: [
    // sec per km
    { paceBelow: 150, bonus: 20 },
    { paceBelow: 120, bonus: 50 },
    { paceBelow: 105, bonus: 100 },
    { paceBelow: 90, bonus: 175 },
    { paceBelow: 75, bonus: 275 },
  ],
  run: [
    // sec per km
    { paceBelow: 360, bonus: 20 },
    { paceBelow: 300, bonus: 50 },
    { paceBelow: 270, bonus: 100 },
    { paceBelow: 240, bonus: 200 },
    { paceBelow: 210, bonus: 350 },
  ],
};

export function calculateScore(
  discipline: Discipline,
  distance: number,
  durationSeconds: number
): ScoringResult {
  const config = BASE_RATES[discipline];

  const distanceInUnits =
    discipline === "swim" ? distance / config.unit : distance / config.unit;
  const basePoints = Math.floor(distanceInUnits * config.rate);

  let distanceBonus = 0;
  const distThresholds = DISTANCE_BONUS_THRESHOLDS[discipline];
  const distValue = discipline === "swim" ? distance : distance;
  for (const t of distThresholds) {
    if (distValue >= t.threshold) {
      distanceBonus = t.bonus;
    }
  }

  let paceBonus = 0;
  if (durationSeconds > 0 && distance > 0) {
    const paceUnit = discipline === "swim" ? 100 : 1;
    const pace = durationSeconds / (distance / paceUnit);
    const paceThresholds = PACE_BONUS_THRESHOLDS[discipline];
    for (const t of paceThresholds) {
      if (pace < t.paceBelow) {
        paceBonus = t.bonus;
      }
    }
  }

  return {
    basePoints,
    distanceBonus,
    paceBonus,
    totalPoints: basePoints + distanceBonus + paceBonus,
  };
}

export function calculatePace(
  discipline: Discipline,
  distance: number,
  durationSeconds: number
): number {
  if (distance <= 0) return 0;
  const unit = discipline === "swim" ? 100 : 1;
  return durationSeconds / (distance / unit);
}

export function formatPace(discipline: Discipline, paceSeconds: number): string {
  if (paceSeconds <= 0) return "--:--";
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = Math.floor(paceSeconds % 60);
  const unit = discipline === "swim" ? "/100m" : "/km";
  return `${minutes}:${seconds.toString().padStart(2, "0")}${unit}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatDistance(discipline: Discipline, distance: number): string {
  if (discipline === "swim") {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    }
    return `${Math.round(distance)}m`;
  }
  return `${distance.toFixed(1)}km`;
}
