import { RankTier, RankThreshold, DisciplineRank, TriRank, Discipline } from "@/types";
import { colors } from "@/theme";

export const RANK_THRESHOLDS: RankThreshold[] = [
  { tier: "Iron", min: 0, max: 999, color: colors.rank.Iron },
  { tier: "Bronze", min: 1000, max: 2499, color: colors.rank.Bronze },
  { tier: "Silver", min: 2500, max: 4999, color: colors.rank.Silver },
  { tier: "Gold", min: 5000, max: 9999, color: colors.rank.Gold },
  { tier: "Elite", min: 10000, max: 19999, color: colors.rank.Elite },
  { tier: "Legendary", min: 20000, max: Infinity, color: colors.rank.Legendary },
];

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
      const isLegendary = threshold.tier === "Legendary";
      const range = isLegendary ? 30000 : threshold.max - threshold.min + 1;
      const progress = isLegendary
        ? Math.min((clamped - threshold.min) / range, 1)
        : (clamped - threshold.min) / range;
      const nextTierPoints = isLegendary ? null : threshold.max + 1;
      const pointsToNext = isLegendary ? null : threshold.max + 1 - clamped;

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
    nextTierPoints: 1000,
    pointsToNext: 1000,
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

export function getNextRankTier(tier: RankTier): RankTier | null {
  const order: RankTier[] = [
    "Iron",
    "Bronze",
    "Silver",
    "Gold",
    "Elite",
    "Legendary",
  ];
  const idx = order.indexOf(tier);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

export function formatPoints(points: number): string {
  if (points >= 10000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toLocaleString();
}
