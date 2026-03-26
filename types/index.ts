export type Discipline = "swim" | "bike" | "run";

export type WorkoutDiscipline = Discipline | "brick" | "strength";

export type RankTier =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
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
  progress: number;
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

export type SwimWorkoutType = "drills" | "endurance" | "intervals" | "open_water" | "technique";
export type BikeWorkoutType = "endurance" | "intervals" | "hill_climb" | "time_trial" | "recovery";
export type RunWorkoutType = "easy" | "tempo" | "intervals" | "long_run" | "brick_run" | "recovery";
export type BrickWorkoutType = "bike_to_run" | "swim_to_bike";
export type StrengthWorkoutType = "core" | "upper_body" | "lower_body" | "mobility" | "yoga";

export type WorkoutType =
  | SwimWorkoutType
  | BikeWorkoutType
  | RunWorkoutType
  | BrickWorkoutType
  | StrengthWorkoutType;

export type IndoorOutdoor = "indoor" | "outdoor";

export interface Activity {
  id: string;
  userId: string;
  discipline: Discipline;
  date: string;
  distance: number;
  duration: number;
  pace: number;
  pointsEarned: number;
  distanceBonus: number;
  paceBonus: number;
  title: string;
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  discipline: WorkoutDiscipline;
  workoutType: WorkoutType;
  duration: number;
  distance: number | null;
  effort: number;
  indoorOutdoor: IndoorOutdoor | null;
  notes: string;
  pointsEarned: number;
  date: string;
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
  athleteType: TriathlonLevel | null;
  raceDistanceGoal: RaceDistanceGoal | null;
  targetRaceDate: string | null;
  preferredMode: AppMode | null;
  swimLevel: DisciplineLevel | null;
  bikeLevel: DisciplineLevel | null;
  runLevel: DisciplineLevel | null;
  weeklyAvailability: WeeklyAvailability | null;
  primaryGoal: PrimaryGoal | null;
  age: number | null;
}

export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "pro";
export type TriathlonLevel = "first_timer" | "experienced";
export type RaceDistanceGoal = "sprint" | "olympic" | "half_ironman" | "full_ironman" | "none";
export type DisciplineLevel = "beginner" | "comfortable" | "strong";
export type WeeklyAvailability = "2-3" | "4-5" | "6-7";
export type PrimaryGoal =
  | "finish_first_race"
  | "get_fitter"
  | "improve_time"
  | "become_consistent"
  | "train_seriously";
export type AppMode = "beginner_guided" | "performance_focused";

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
  name: string;
  age: number | null;
  triathlonLevel: TriathlonLevel | null;
  raceDistanceGoal: RaceDistanceGoal | null;
  targetRaceDate: string | null;
  swimLevel: DisciplineLevel | null;
  bikeLevel: DisciplineLevel | null;
  runLevel: DisciplineLevel | null;
  weeklyAvailability: WeeklyAvailability | null;
  primaryGoal: PrimaryGoal | null;
  preferredMode: AppMode | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}

export type MilestoneType =
  | "first_workout"
  | "streak_7"
  | "streak_30"
  | "rank_up_bronze"
  | "rank_up_silver"
  | "rank_up_gold"
  | "rank_up_platinum"
  | "rank_up_diamond"
  | "rank_up_elite"
  | "rank_up_legendary"
  | "first_swim"
  | "first_bike"
  | "first_run"
  | "sessions_10"
  | "sessions_50"
  | "sessions_100"
  | "hours_50"
  | "hours_100"
  | "hours_500"
  | "balanced_week";

export interface Milestone {
  id: string;
  type: MilestoneType;
  title: string;
  description: string;
  achievedAt: string | null;
  icon: string;
}

export interface RaceGoal {
  id: string;
  raceType: RaceDistanceGoal;
  raceName: string;
  raceDate: string;
  goalType: string;
}

export interface WeeklyVolume {
  week: string;
  swimHours: number;
  bikeHours: number;
  runHours: number;
}

// Training Plan types (Task 3)
export interface TrainingPlanWorkout {
  day: string;
  discipline: Discipline | "rest";
  title: string;
  duration: number;
  distance: number | null;
  completed: boolean;
  actualDuration?: number;
  actualDistance?: number;
}

export interface TrainingPlan {
  name: string;
  currentWeek: number;
  totalWeeks: number;
  phase: string;
  weeklyPlan: TrainingPlanWorkout[];
}

// Availability Scheduler types (Task 4)
export interface DisciplineAvailability {
  swim: string[];
  bike: string[];
  run: string[];
  preferredLongRideDay: string | null;
}

// GPS Workout types (Task 1)
export interface GpsCoordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface LiveWorkoutState {
  isActive: boolean;
  isPaused: boolean;
  discipline: Discipline;
  startTime: number | null;
  elapsedTime: number;
  distance: number;
  coordinates: GpsCoordinate[];
  splits: number[];
}

// Social Profile types (Task 6)
export interface SocialProfile {
  followers: number;
  following: number;
  bio: string;
  weeklyDistance: number;
  weeklyTime: number;
  weeklyElevation: number;
  rrChange: number;
}

// Friends Leaderboard types (Task 7)
export type LeaderboardTab = "friends" | "global" | "local";

export interface FriendLeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  points: number;
  tier: RankTier;
  tierColor: string;
  isFriend: boolean;
  avatarLetter: string;
}

// Health Integration types (Task 8)
export interface ConnectedDevice {
  id: string;
  name: string;
  type: "apple_health" | "garmin" | "strava";
  isConnected: boolean;
  lastSync: string | null;
}

export interface HealthWorkout {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  distance: number;
  heartRate?: number;
  calories?: number;
}

export interface GarminWorkout {
  id: string;
  activityType: string;
  startTime: string;
  duration: number;
  distance: number;
  avgHeartRate?: number;
  avgPace?: number;
}
