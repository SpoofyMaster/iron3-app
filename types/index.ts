export type Discipline = "swim" | "bike" | "run";

export type RankTier =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Elite"
  | "Legendary";

export interface RankThreshold {
  tier: RankTier;
  min: number;
  max: number;
  color: string;
}

export interface DisciplineRank {
  discipline: Discipline;
  points: number;
  tier: RankTier;
  tierColor: string;
  progress: number; // 0-1 progress within current tier
  nextTierPoints: number | null;
  pointsToNext: number | null;
}

export interface TriRank {
  overallPoints: number;
  tier: RankTier;
  tierColor: string;
  swimRank: DisciplineRank;
  bikeRank: DisciplineRank;
  runRank: DisciplineRank;
}

export interface Activity {
  id: string;
  userId: string;
  discipline: Discipline;
  date: string;
  distance: number; // meters for swim, km for bike/run
  duration: number; // seconds
  pace: number; // sec/100m for swim, sec/km for bike and run
  pointsEarned: number;
  distanceBonus: number;
  paceBonus: number;
  title: string;
  createdAt: string;
}

export interface PersonalBest {
  discipline: Discipline;
  category: string;
  value: number;
  unit: string;
  date: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  experienceLevel: ExperienceLevel;
  goals: string[];
  isPremium: boolean;
  createdAt: string;
}

export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "pro";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  points: number;
  tier: RankTier;
  tierColor: string;
  isFriend: boolean;
}

export type LeaderboardFilter = "overall" | Discipline;
export type LeaderboardScope = "global" | "friends";
export type AgeGroup = "all" | "18-29" | "30-39" | "40-49" | "50-59" | "60+";

export interface RankHistoryEntry {
  date: string;
  swimPoints: number;
  bikePoints: number;
  runPoints: number;
  overallPoints: number;
}

export interface WeeklyStats {
  swimDistance: number;
  bikeDistance: number;
  runDistance: number;
  totalActivities: number;
  totalPoints: number;
}

export interface OnboardingState {
  step: number;
  experienceLevel: ExperienceLevel | null;
  disciplines: Discipline[];
  weeklyGoal: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}
