import { RankTier, RankThreshold, DisciplineRank, TriRank, Discipline } from "@/types";
import { colors } from "@/theme";

/** New progression thresholds (XP overhaul) */
export const RANK_THRESHOLDS: RankThreshold[] = [
  { tier: "Iron", min: 0, max: 2999, color: colors.rank.Iron },
  { tier: "Bronze", min: 3000, max: 9999, color: colors.rank.Bronze },
  { tier: "Silver", min: 10000, max: 24999, color: colors.rank.Silver },
  { tier: "Gold", min: 25000, max: 49999, color: colors.rank.Gold },
  { tier: "Platinum", min: 50000, max: 99999, color: colors.rank.Platinum },
  { tier: "Diamond", min: 100000, max: 199999, color: colors.rank.Diamond },
  { tier: "Legendary", min: 200000, max: Infinity, color: colors.rank.Legendary },
];

/** Multiplier applied to distance-based XP (swim/bike/run bonuses) by tier */
export const RANK_FACTOR: Record<RankTier, number> = {
  Iron: 1.0,
  Bronze: 0.85,
  Silver: 0.7,
  Gold: 0.55,
  Platinum: 0.4,
  Diamond: 0.3,
  Legendary: 0.2,
};

/** Base XP per minute of activity by tier */
export const XP_PER_MINUTE: Record<RankTier, number> = {
  Iron: 3.0,
  Bronze: 2.5,
  Silver: 2.0,
  Gold: 1.5,
  Platinum: 1.0,
  Diamond: 0.75,
  Legendary: 0.5,
};

export function getRankFactor(tier: RankTier): number {
  return RANK_FACTOR[tier] ?? 1;
}

export function getXpPerMinute(tier: RankTier): number {
  return XP_PER_MINUTE[tier] ?? 3;
}

export function getRankForPoints(points: number): {
  tier: RankTier;
  color: string;
  progress: number;
  nextTierPoints: number | null;
  pointsToNext: number | null;
} {
  const clamped = Math.max(0, Math.floor(points));

  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    const threshold = RANK_THRESHOLDS[i];
    if (clamped >= threshold.min && clamped <= threshold.max) {
      const isTopTier = threshold.max === Infinity;
      const range = isTopTier ? 50000 : threshold.max - threshold.min + 1;
      const progress = isTopTier
        ? Math.min((clamped - threshold.min) / range, 1)
        : (clamped - threshold.min) / range;
      const nextTierPoints = isTopTier ? null : threshold.max + 1;
      const pointsToNext = isTopTier ? null : threshold.max + 1 - clamped;

      return {
        tier: threshold.tier,
        color: threshold.color,
        progress,
        nextTierPoints,
        pointsToNext,
      };
    }
  }

  return {
    tier: "Iron",
    color: colors.rank.Iron,
    progress: 0,
    nextTierPoints: 3000,
    pointsToNext: 3000,
  };
}

export function getDisciplineRank(
  discipline: Discipline,
  points: number
): DisciplineRank {
  const rank = getRankForPoints(points);
  return {
    discipline,
    points: Math.floor(points),
    tier: rank.tier,
    tierColor: rank.color,
    progress: rank.progress,
    nextTierPoints: rank.nextTierPoints,
    pointsToNext: rank.pointsToNext,
  };
}

const DISCIPLINE_WEIGHTS: Record<Discipline, number> = {
  swim: 0.3,
  bike: 0.4,
  run: 0.3,
};

export function getTriRank(
  swimPoints: number,
  bikePoints: number,
  runPoints: number
): TriRank {
  const overallPoints = Math.floor(
    swimPoints * DISCIPLINE_WEIGHTS.swim +
      bikePoints * DISCIPLINE_WEIGHTS.bike +
      runPoints * DISCIPLINE_WEIGHTS.run
  );

  const overall = getRankForPoints(overallPoints);
  const swimRank = getDisciplineRank("swim", swimPoints);
  const bikeRank = getDisciplineRank("bike", bikePoints);
  const runRank = getDisciplineRank("run", runPoints);

  return {
    overallPoints,
    tier: overall.tier,
    tierColor: overall.color,
    swimRank,
    bikeRank,
    runRank,
  };
}

export function getRankDisplayName(tier: RankTier): string {
  return tier;
}

const RANK_ORDER: RankTier[] = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Legendary",
];

export function getNextRankTier(tier: RankTier): RankTier | null {
  const idx = RANK_ORDER.indexOf(tier);
  return idx < RANK_ORDER.length - 1 ? RANK_ORDER[idx + 1] : null;
}

export function formatPoints(points: number): string {
  if (points >= 10000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toLocaleString();
}

export interface BonusResult {
  consistencyBonus: number;
  streakBonus: number;
  balanceBonus: number;
  volumeBonus: number;
  total: number;
}

export function calculateBonuses(
  sessionsThisWeek: number,
  currentStreak: number,
  trainedSwim: boolean,
  trainedBike: boolean,
  trainedRun: boolean,
  sessionDurationMinutes: number
): BonusResult {
  const consistencyBonus = sessionsThisWeek >= 3 ? 30 : 0;
  const streakBonus = currentStreak * 15;
  const balanceBonus = trainedSwim && trainedBike && trainedRun ? 80 : 0;
  let volumeBonus = 0;
  if (sessionDurationMinutes >= 120) volumeBonus = 50;
  else if (sessionDurationMinutes >= 90) volumeBonus = 30;
  else if (sessionDurationMinutes >= 60) volumeBonus = 15;

  return {
    consistencyBonus,
    streakBonus,
    balanceBonus,
    volumeBonus,
    total: consistencyBonus + streakBonus + balanceBonus + volumeBonus,
  };
}
