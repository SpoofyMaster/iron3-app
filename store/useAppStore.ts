import {
  createActivity,
  createWorkoutLog,
  getActiveSubscription,
  getLatestRaceGoalEvent,
  getOrCreateProfile,
  getRankHistory,
  getRankPoints,
  getStreak,
  listActivities,
  listFriendSummaries,
  listConversations,
  listMilestones,
  listWorkoutLogs,
  saveRaceGoalEvent,
  upsertRankPoints,
  upsertStreak,
  clearRaceGoalsForUser,
  getLeaderboardOverall,
} from "@/lib/dataService";
import { create } from "zustand";
import {
  Activity,
  ChatConversation,
  FriendProfileSummary,
  PersonalBest,
  PerformanceStats,
  UserProfile,
  LeaderboardEntry,
  RankHistoryEntry,
  WeeklyStats,
  LeaderboardFilter,
  LeaderboardScope,
  AgeGroup,
  OnboardingState,
  Discipline,
  ExperienceLevel,
  WorkoutLog,
  WorkoutDiscipline,
  WorkoutType,
  IndoorOutdoor,
  Milestone,
  RaceGoal,
  WeeklyVolume,
  TriathlonLevel,
  RaceDistanceGoal,
  DisciplineLevel,
  WeeklyAvailability,
  PrimaryGoal,
  AppMode,
  TrainingPlan,
  DisciplineAvailability,
  LiveWorkoutState,
  SocialProfile,
  FriendLeaderboardEntry,
  ConnectedDevice,
  LeaderboardTab,
  GpsCoordinate,
  PrepPlan,
  PrepSession,
} from "@/types";
import { getRankForPoints, getTriRank } from "@/lib/ranks";
import { calculateDecay } from "@/lib/xpDecay";
import { generatePrepPlan } from "@/lib/prepPlanGenerator";
import { IRONMAN_EVENTS_2026, IronmanEvent } from "@/lib/ironmanEvents";
import {
  mockTrainingPlan,
  mockAvailability,
  mockConnectedDevices,
} from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

interface AppState {
  user: UserProfile;
  activities: Activity[];
  personalBests: PersonalBest[];

  swimPoints: number;
  bikePoints: number;
  runPoints: number;

  leaderboard: LeaderboardEntry[];
  leaderboardFilter: LeaderboardFilter;
  leaderboardScope: LeaderboardScope;
  leaderboardAgeGroup: AgeGroup;

  rankHistory: RankHistoryEntry[];
  weeklyStats: WeeklyStats;

  workoutLogs: WorkoutLog[];
  milestones: Milestone[];
  raceGoal: RaceGoal | null;
  weeklyVolumes: WeeklyVolume[];

  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;

  onboarding: OnboardingState;
  hasCompletedOnboarding: boolean;

  // Training Plan (Task 3)
  trainingPlan: TrainingPlan;

  // Availability (Task 4)
  availability: DisciplineAvailability;

  // Live workout (Task 1)
  liveWorkout: LiveWorkoutState;

  // Social profile (Task 6)
  socialProfile: SocialProfile;

  // Friends leaderboard (Task 7)
  friendsLeaderboard: FriendLeaderboardEntry[];
  friendProfiles: FriendProfileSummary[];
  friendsLeaderboardTab: LeaderboardTab;
  chatConversations: ChatConversation[];
  performanceStats: PerformanceStats;

  // Connected devices (Task 8)
  connectedDevices: ConnectedDevice[];

  // XP Decay tracking
  lastSwimDate: string | null;
  lastBikeDate: string | null;
  lastRunDate: string | null;

  // Race goal & PREP plan
  selectedRaceEvent: IronmanEvent | null;
  prepPlan: PrepPlan | null;

  // Auth state
  isAuthenticated: boolean;
  currentUserId: string | null;

  isLoading: boolean;
  showWorkoutConfirmation: boolean;
  lastLoggedPoints: number;

  getTriRank: () => ReturnType<typeof getTriRank>;
  getActivitiesForDiscipline: (discipline: Discipline) => Activity[];
  getPersonalBestsForDiscipline: (discipline: Discipline) => PersonalBest[];
  getFilteredLeaderboard: () => LeaderboardEntry[];

  // XP Decay
  applyXpDecay: () => void;

  // Race goal & PREP plan
  selectRaceEvent: (event: IronmanEvent, autoGeneratePlan: boolean) => Promise<void>;
  clearRaceEvent: () => Promise<void>;
  setPrepPlan: (plan: PrepPlan | null) => void;
  markPrepSessionComplete: (weekIndex: number, sessionId: string) => void;
  updatePrepSession: (weekIndex: number, sessionId: string, updates: Partial<PrepSession>) => void;
  getCurrentPrepWeek: () => PrepPlan["weeks"][0] | null;

  setLeaderboardFilter: (filter: LeaderboardFilter) => void;
  setLeaderboardScope: (scope: LeaderboardScope) => void;
  setLeaderboardAgeGroup: (group: AgeGroup) => void;

  setOnboardingStep: (step: number) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setOnboardingDisciplines: (disciplines: Discipline[]) => void;
  setWeeklyGoal: (goal: number) => void;
  setOnboardingName: (name: string) => void;
  setOnboardingAge: (age: number | null) => void;
  setTriathlonLevel: (level: TriathlonLevel) => void;
  setRaceDistanceGoal: (goal: RaceDistanceGoal) => void;
  setTargetRaceDate: (date: string | null) => void;
  setSwimLevel: (level: DisciplineLevel) => void;
  setBikeLevel: (level: DisciplineLevel) => void;
  setRunLevel: (level: DisciplineLevel) => void;
  setWeeklyAvailability: (avail: WeeklyAvailability) => void;
  setPrimaryGoal: (goal: PrimaryGoal) => void;
  setPreferredMode: (mode: AppMode) => void;
  completeOnboarding: () => void;

  logWorkout: (
    workout: Omit<WorkoutLog, "id" | "userId" | "createdAt" | "pointsEarned">
  ) => Promise<void>;
  dismissWorkoutConfirmation: () => void;

  togglePremium: () => void;

  // Training plan actions (Task 3)
  togglePlanWorkoutComplete: (day: string) => void;

  // Availability actions (Task 4)
  setAvailability: (availability: DisciplineAvailability) => void;
  toggleAvailabilityDay: (discipline: Discipline, day: string) => void;
  setPreferredLongRideDay: (day: string | null) => void;

  // Live workout actions (Task 1)
  startLiveWorkout: (discipline: Discipline) => void;
  pauseLiveWorkout: () => void;
  resumeLiveWorkout: () => void;
  stopLiveWorkout: () => void;
  updateLiveWorkout: (elapsed: number, distance: number, coord?: GpsCoordinate) => void;
  addSplit: (splitTime: number) => void;

  // Friends leaderboard actions (Task 7)
  setFriendsLeaderboardTab: (tab: LeaderboardTab) => void;

  // Connected devices actions (Task 8)
  toggleDeviceConnection: (deviceId: string) => void;

  // Auth actions
  setAuth: (isAuthenticated: boolean, userId?: string) => void;
  hydrateUserData: (userId: string) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  fetchActivities: (userId: string) => Promise<void>;
  refreshFriends: (userId: string) => Promise<void>;
}

let workoutCounter = 0;

const BRONZE_START_POINTS = 1000;

const emptyUser: UserProfile = {
  id: "",
  email: "",
  displayName: "Athlete",
  avatarUrl: null,
  experienceLevel: "beginner",
  goals: [],
  isPremium: false,
  createdAt: new Date().toISOString(),
  athleteType: null,
  raceDistanceGoal: null,
  targetRaceDate: null,
  preferredMode: null,
  swimLevel: null,
  bikeLevel: null,
  runLevel: null,
  weeklyAvailability: null,
  primaryGoal: null,
  age: null,
};

const emptyWeeklyStats: WeeklyStats = {
  swimDistance: 0,
  bikeDistance: 0,
  runDistance: 0,
  totalActivities: 0,
  totalPoints: 0,
};

const emptyPerformanceStats: PerformanceStats = {
  totalSwimDistance: 0,
  totalBikeDistance: 0,
  totalRunDistance: 0,
  totalTrainingTime: 0,
  workoutsCount: 0,
  currentStreak: 0,
  rankProgressPercentage: 0,
};

const emptySocialProfile: SocialProfile = {
  followers: 0,
  following: 0,
  bio: "",
  weeklyDistance: 0,
  weeklyTime: 0,
  weeklyElevation: 0,
  rrChange: 0,
};

function normalizeIsoDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function buildWorkoutLogFromRow(row: any): WorkoutLog {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    discipline: row.discipline,
    workoutType: row.workout_type,
    duration: Number(row.duration ?? 0),
    distance: row.distance == null ? null : Number(row.distance),
    effort: Number(row.effort ?? 1),
    indoorOutdoor: row.indoor_outdoor ?? null,
    notes: String(row.notes ?? ""),
    pointsEarned: Number(row.points_earned ?? 0),
    date: normalizeIsoDate(row.date) ?? new Date().toISOString(),
    createdAt: normalizeIsoDate(row.created_at) ?? new Date().toISOString(),
  };
}

function buildActivityFromRow(row: any): Activity {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    discipline: row.discipline,
    date: normalizeIsoDate(row.date) ?? new Date().toISOString(),
    distance: Number(row.distance ?? 0),
    duration: Number(row.duration ?? 0),
    pace: Number(row.pace ?? 0),
    pointsEarned: Number(row.points_earned ?? 0),
    distanceBonus: Number(row.distance_bonus ?? 0),
    paceBonus: Number(row.pace_bonus ?? 0),
    title: String(row.title ?? `${row.discipline} workout`),
    createdAt: normalizeIsoDate(row.created_at) ?? new Date().toISOString(),
  };
}

function buildCurrentStreakFromActivities(activities: Activity[]): {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
} {
  const uniqueDates = [
    ...new Set(activities.map((a) => (normalizeIsoDate(a.date) ?? a.date).split("T")[0])),
  ].sort((a, b) => b.localeCompare(a));

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (Math.round(diff) === 1) currentStreak++;
      else break;
    }
  }

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diff) === 1) tempStreak++;
    else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak, lastActivityDate: uniqueDates[0] ?? null };
}

function deriveStatsFromActivities(activities: Activity[]) {
  const swimActs = activities.filter((a) => a.discipline === "swim");
  const bikeActs = activities.filter((a) => a.discipline === "bike");
  const runActs = activities.filter((a) => a.discipline === "run");

  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);

  const thisWeek = activities.filter((a) => new Date(a.date) >= weekStart);

  const weeklyStats: WeeklyStats = {
    swimDistance: thisWeek
      .filter((a) => a.discipline === "swim")
      .reduce((s, a) => s + a.distance, 0),
    bikeDistance: thisWeek
      .filter((a) => a.discipline === "bike")
      .reduce((s, a) => s + a.distance, 0),
    runDistance: thisWeek
      .filter((a) => a.discipline === "run")
      .reduce((s, a) => s + a.distance, 0),
    totalActivities: thisWeek.length,
    totalPoints: thisWeek.reduce((s, a) => s + a.pointsEarned, 0),
  };

  const weeklyVolumes: WeeklyVolume[] = [];
  for (let w = 7; w >= 0; w--) {
    const wStart = new Date(weekStart);
    wStart.setDate(wStart.getDate() - w * 7);
    const wEnd = new Date(wStart);
    wEnd.setDate(wEnd.getDate() + 7);

    const wActs = activities.filter((a) => {
      const d = new Date(a.date);
      return d >= wStart && d < wEnd;
    });

    weeklyVolumes.push({
      week: `W${8 - w}`,
      swimHours: wActs
        .filter((a) => a.discipline === "swim")
        .reduce((s, a) => s + a.duration / 3600, 0),
      bikeHours: wActs
        .filter((a) => a.discipline === "bike")
        .reduce((s, a) => s + a.duration / 3600, 0),
      runHours: wActs
        .filter((a) => a.discipline === "run")
        .reduce((s, a) => s + a.duration / 3600, 0),
    });
  }

  const calcPBs = (acts: Activity[], disc: "swim" | "bike" | "run"): PersonalBest[] => {
    if (acts.length === 0) return [];
    const pbs: PersonalBest[] = [];

    const longest = acts.reduce((best, a) => (a.distance > best.distance ? a : best));
    pbs.push({
      discipline: disc,
      category: "Longest Distance",
      value: Math.round(longest.distance * 100) / 100,
      unit: disc === "swim" ? "m" : "km",
      date: longest.date,
    });

    const longestDur = acts.reduce((best, a) => (a.duration > best.duration ? a : best));
    pbs.push({
      discipline: disc,
      category: "Longest Duration",
      value: longestDur.duration,
      unit: "sec",
      date: longestDur.date,
    });

    const withPace = acts.filter((a) => a.pace > 0);
    if (withPace.length > 0) {
      const fastest = withPace.reduce((best, a) => (a.pace < best.pace ? a : best));
      pbs.push({
        discipline: disc,
        category: "Best Pace",
        value: Math.round(fastest.pace * 100) / 100,
        unit: disc === "swim" ? "sec/100m" : "sec/km",
        date: fastest.date,
      });
    }
    return pbs;
  };

  const personalBests = [
    ...calcPBs(swimActs, "swim"),
    ...calcPBs(bikeActs, "bike"),
    ...calcPBs(runActs, "run"),
  ];

  const lastSwimDate =
    swimActs.length > 0 ? swimActs.reduce((a, b) => (a.date > b.date ? a : b)).date : null;
  const lastBikeDate =
    bikeActs.length > 0 ? bikeActs.reduce((a, b) => (a.date > b.date ? a : b)).date : null;
  const lastRunDate =
    runActs.length > 0 ? runActs.reduce((a, b) => (a.date > b.date ? a : b)).date : null;

  return {
    weeklyStats,
    weeklyVolumes,
    personalBests,
    lastSwimDate,
    lastBikeDate,
    lastRunDate,
  };
}

function buildPerformanceStats(
  activities: Activity[],
  workoutLogs: WorkoutLog[],
  currentStreak: number,
  overallPoints: number
): PerformanceStats {
  const swimTotal = activities
    .filter((a) => a.discipline === "swim")
    .reduce((sum, a) => sum + a.distance, 0);
  const bikeTotal = activities
    .filter((a) => a.discipline === "bike")
    .reduce((sum, a) => sum + a.distance, 0);
  const runTotal = activities
    .filter((a) => a.discipline === "run")
    .reduce((sum, a) => sum + a.distance, 0);
  const totalTrainingTime = workoutLogs.reduce((sum, w) => sum + w.duration, 0);
  const rankProgressPercentage = Math.round(getRankForPoints(overallPoints).progress * 100);

  return {
    totalSwimDistance: swimTotal,
    totalBikeDistance: bikeTotal,
    totalRunDistance: runTotal,
    totalTrainingTime,
    workoutsCount: workoutLogs.length,
    currentStreak,
    rankProgressPercentage,
  };
}

function inferRaceType(distance: IronmanEvent["distance"]): RaceGoal["raceType"] {
  if (distance === "Full") return "full_ironman";
  if (distance === "70.3") return "half_ironman";
  return "olympic";
}

function resolveEventFromPersistedGoal(goal: {
  event_id?: string | null;
  event_name?: string | null;
  event_date?: string | null;
  race_name?: string | null;
  race_date?: string | null;
  race_type?: string | null;
}): IronmanEvent | null {
  const eventId = goal.event_id ?? null;
  const eventName = goal.event_name ?? goal.race_name ?? null;
  const eventDate = goal.event_date ?? goal.race_date ?? null;

  if (eventId) {
    const byId = IRONMAN_EVENTS_2026.find((event) => event.id === eventId);
    if (byId) return byId;
  }
  if (eventName && eventDate) {
    const byNameAndDate = IRONMAN_EVENTS_2026.find(
      (event) => event.name === eventName && event.date === eventDate
    );
    if (byNameAndDate) return byNameAndDate;
  }
  if (!eventName || !eventDate) return null;

  const fallbackDistance: IronmanEvent["distance"] =
    goal.race_type === "full_ironman"
      ? "Full"
      : goal.race_type === "olympic"
      ? "5150"
      : "70.3";

  return {
    id: eventId ?? `saved-${eventName.toLowerCase().replace(/\s+/g, "-")}`,
    name: eventName,
    date: eventDate,
    distance: fallbackDistance,
    location: "Saved event",
    country: "Unknown",
    flag: "🏁",
  };
}

function mapFriendLeaderboard(
  currentUserId: string,
  currentUserName: string,
  currentUserAvatar: string | null,
  currentUserPoints: number,
  friends: FriendProfileSummary[]
): { friendProfiles: FriendProfileSummary[]; friendsLeaderboard: FriendLeaderboardEntry[] } {
  const meRank = getRankForPoints(currentUserPoints);
  const combined = [
    {
      id: currentUserId,
      displayName: currentUserName || "You",
      avatarUrl: currentUserAvatar,
      overallPoints: currentUserPoints,
      rankTier: meRank.tier,
      rankColor: meRank.color,
      targetRaceEventName: null,
    },
    ...friends,
  ].sort((a, b) => b.overallPoints - a.overallPoints);

  const leaderboard: FriendLeaderboardEntry[] = combined.map((entry, index) => ({
    rank: index + 1,
    userId: entry.id,
    displayName: entry.displayName,
    avatarUrl: entry.avatarUrl,
    points: entry.overallPoints,
    tier: entry.rankTier,
    tierColor: entry.rankColor,
    isFriend: entry.id !== currentUserId,
    avatarLetter: entry.displayName.charAt(0).toUpperCase(),
  }));

  return {
    friendProfiles: friends,
    friendsLeaderboard: leaderboard,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  user: emptyUser,
  activities: [],
  personalBests: [],

  swimPoints: BRONZE_START_POINTS,
  bikePoints: BRONZE_START_POINTS,
  runPoints: BRONZE_START_POINTS,

  leaderboard: [],
  leaderboardFilter: "overall",
  leaderboardScope: "global",
  leaderboardAgeGroup: "all",

  rankHistory: [],
  weeklyStats: emptyWeeklyStats,

  workoutLogs: [],
  milestones: [],
  raceGoal: null,
  weeklyVolumes: [],

  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: "",

  onboarding: {
    step: 0,
    experienceLevel: null,
    disciplines: [],
    weeklyGoal: 3,
    name: "",
    age: null,
    triathlonLevel: null,
    raceDistanceGoal: null,
    targetRaceDate: null,
    swimLevel: null,
    bikeLevel: null,
    runLevel: null,
    weeklyAvailability: null,
    primaryGoal: null,
    preferredMode: null,
  },
  hasCompletedOnboarding: true,

  trainingPlan: mockTrainingPlan,
  availability: mockAvailability,
  liveWorkout: {
    isActive: false,
    isPaused: false,
    discipline: "run",
    startTime: null,
    elapsedTime: 0,
    distance: 0,
    coordinates: [],
    splits: [],
  },
  socialProfile: emptySocialProfile,
  friendsLeaderboard: [],
  friendProfiles: [],
  friendsLeaderboardTab: "friends" as LeaderboardTab,
  chatConversations: [],
  performanceStats: emptyPerformanceStats,
  connectedDevices: mockConnectedDevices,

  // XP Decay
  lastSwimDate: null,
  lastBikeDate: null,
  lastRunDate: null,

  // Race goal & PREP plan
  selectedRaceEvent: null,
  prepPlan: null,

  // Auth state — start unauthenticated, real session check happens in _layout.tsx
  isAuthenticated: false,
  currentUserId: null,

  isLoading: false,
  showWorkoutConfirmation: false,
  lastLoggedPoints: 0,

  getTriRank: () => {
    const { swimPoints, bikePoints, runPoints } = get();
    return getTriRank(swimPoints, bikePoints, runPoints);
  },

  getActivitiesForDiscipline: (discipline: Discipline) => {
    return get().activities.filter((a) => a.discipline === discipline);
  },

  getPersonalBestsForDiscipline: (discipline: Discipline) => {
    return get().personalBests.filter((pb) => pb.discipline === discipline);
  },

  getFilteredLeaderboard: () => {
    const { leaderboard, leaderboardScope, currentUserId, friendProfiles } = get();
    if (leaderboardScope === "friends") {
      const friendIds = new Set(friendProfiles.map((f) => f.id));
      if (currentUserId) friendIds.add(currentUserId);
      return leaderboard.filter((e) => friendIds.has(e.userId));
    }
    return leaderboard;
  },

  // ── XP Decay ────────────────────────────────────────────────────────────
  applyXpDecay: () => {
    const { swimPoints, bikePoints, runPoints, lastSwimDate, lastBikeDate, lastRunDate } = get();
    const today = new Date();
    const swimDecay = calculateDecay(swimPoints, lastSwimDate, today);
    const bikeDecay = calculateDecay(bikePoints, lastBikeDate, today);
    const runDecay = calculateDecay(runPoints, lastRunDate, today);
    set({
      swimPoints: swimDecay.newPoints,
      bikePoints: bikeDecay.newPoints,
      runPoints: runDecay.newPoints,
    });
  },

  // ── Race goal & PREP plan ────────────────────────────────────────────────
  selectRaceEvent: async (event: IronmanEvent, autoGeneratePlan: boolean) => {
    const state = get();
    let plan: PrepPlan | null = null;
    if (autoGeneratePlan) {
      plan = generatePrepPlan(
        event.id,
        event.name,
        event.date,
        state.onboarding.raceDistanceGoal ?? "70.3",
        state.onboarding.swimLevel,
        state.onboarding.bikeLevel,
        state.onboarding.runLevel,
      );
    } else {
      // Empty plan — user will fill manually
      plan = {
        id: `prep-${event.id}-manual`,
        raceId: event.id,
        raceName: event.name,
        raceDate: event.date,
        createdAt: new Date().toISOString(),
        totalWeeks: 0,
        weeks: [],
        isAutoGenerated: false,
        currentWeekIndex: 0,
      };
    }
    const raceGoal: RaceGoal = {
      id: `goal-${event.id}`,
      raceType: inferRaceType(event.distance),
      raceName: event.name,
      raceDate: event.date,
      goalType: "finish",
    };

    set({ selectedRaceEvent: event, prepPlan: plan, raceGoal });

    if (state.currentUserId) {
      try {
        await saveRaceGoalEvent(state.currentUserId, {
          id: event.id,
          name: event.name,
          date: event.date,
          distance: event.distance,
        });
      } catch (error) {
        console.error("Failed to persist selected race event:", error);
      }
    }
  },

  clearRaceEvent: async () => {
    const userId = get().currentUserId;
    set({ selectedRaceEvent: null, prepPlan: null, raceGoal: null });
    if (userId) {
      try {
        await clearRaceGoalsForUser(userId);
      } catch (error) {
        console.error("Failed to clear race goal:", error);
      }
    }
  },

  setPrepPlan: (plan: PrepPlan | null) => set({ prepPlan: plan }),

  markPrepSessionComplete: (weekIndex: number, sessionId: string) =>
    set((state) => {
      if (!state.prepPlan) return {};
      const weeks = state.prepPlan.weeks.map((week, wi) => {
        if (wi !== weekIndex) return week;
        return {
          ...week,
          sessions: week.sessions.map((s) =>
            s.id === sessionId ? { ...s, completed: !s.completed } : s
          ),
        };
      });
      return { prepPlan: { ...state.prepPlan, weeks } };
    }),

  updatePrepSession: (weekIndex: number, sessionId: string, updates: Partial<PrepSession>) =>
    set((state) => {
      if (!state.prepPlan) return {};
      const weeks = state.prepPlan.weeks.map((week, wi) => {
        if (wi !== weekIndex) return week;
        return {
          ...week,
          sessions: week.sessions.map((s) =>
            s.id === sessionId ? { ...s, ...updates } : s
          ),
        };
      });
      return { prepPlan: { ...state.prepPlan, weeks } };
    }),

  getCurrentPrepWeek: () => {
    const { prepPlan } = get();
    if (!prepPlan || prepPlan.weeks.length === 0) return null;
    return prepPlan.weeks[prepPlan.currentWeekIndex] ?? prepPlan.weeks[0];
  },

  setLeaderboardFilter: (filter) => set({ leaderboardFilter: filter }),
  setLeaderboardScope: (scope) => set({ leaderboardScope: scope }),
  setLeaderboardAgeGroup: (group) => set({ leaderboardAgeGroup: group }),

  setOnboardingStep: (step) =>
    set((state) => ({ onboarding: { ...state.onboarding, step } })),

  setExperienceLevel: (level) =>
    set((state) => ({
      onboarding: { ...state.onboarding, experienceLevel: level },
    })),

  setOnboardingDisciplines: (disciplines) =>
    set((state) => ({
      onboarding: { ...state.onboarding, disciplines },
    })),

  setWeeklyGoal: (goal) =>
    set((state) => ({
      onboarding: { ...state.onboarding, weeklyGoal: goal },
    })),

  setOnboardingName: (name) =>
    set((state) => ({
      onboarding: { ...state.onboarding, name },
    })),

  setOnboardingAge: (age) =>
    set((state) => ({
      onboarding: { ...state.onboarding, age },
    })),

  setTriathlonLevel: (level) =>
    set((state) => ({
      onboarding: { ...state.onboarding, triathlonLevel: level },
    })),

  setRaceDistanceGoal: (goal) =>
    set((state) => ({
      onboarding: { ...state.onboarding, raceDistanceGoal: goal },
    })),

  setTargetRaceDate: (date) =>
    set((state) => ({
      onboarding: { ...state.onboarding, targetRaceDate: date },
    })),

  setSwimLevel: (level) =>
    set((state) => ({
      onboarding: { ...state.onboarding, swimLevel: level },
    })),

  setBikeLevel: (level) =>
    set((state) => ({
      onboarding: { ...state.onboarding, bikeLevel: level },
    })),

  setRunLevel: (level) =>
    set((state) => ({
      onboarding: { ...state.onboarding, runLevel: level },
    })),

  setWeeklyAvailability: (avail) =>
    set((state) => ({
      onboarding: { ...state.onboarding, weeklyAvailability: avail },
    })),

  setPrimaryGoal: (goal) =>
    set((state) => ({
      onboarding: { ...state.onboarding, primaryGoal: goal },
    })),

  setPreferredMode: (mode) =>
    set((state) => ({
      onboarding: { ...state.onboarding, preferredMode: mode },
    })),

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  logWorkout: async (workout) => {
    workoutCounter++;
    const id = `wl-${Date.now()}-${workoutCounter}`;
    const durationMin = workout.duration / 60;
    let points = Math.floor(durationMin * 3);
    if (workout.effort >= 7) points += 20;
    if (workout.effort >= 9) points += 30;
    if (durationMin >= 60) points += 15;
    if (durationMin >= 90) points += 30;

    const newLog: WorkoutLog = {
      ...workout,
      id,
      userId: get().currentUserId ?? "local-user",
      createdAt: new Date().toISOString(),
      pointsEarned: points,
    };

    const state = get();

    let newSwim = state.swimPoints;
    let newBike = state.bikePoints;
    let newRun = state.runPoints;
    if (workout.discipline === "swim") newSwim += points;
    else if (workout.discipline === "bike") newBike += points;
    else if (workout.discipline === "run") newRun += points;

    const todayStr = new Date().toISOString().split("T")[0];
    const activityForWorkout: Activity | null =
      workout.discipline === "swim" || workout.discipline === "bike" || workout.discipline === "run"
        ? {
            id: `act-${Date.now()}-${workoutCounter}`,
            userId: state.currentUserId ?? "local-user",
            discipline: workout.discipline,
            date: workout.date,
            distance: workout.distance ?? 0,
            duration: workout.duration,
            pace:
              workout.distance && workout.distance > 0
                ? workout.discipline === "swim"
                  ? workout.duration / (workout.distance / 100)
                  : workout.duration / workout.distance
                : 0,
            pointsEarned: points,
            distanceBonus: 0,
            paceBonus: 0,
            title: `${workout.discipline.toUpperCase()} ${workout.workoutType.replace(/_/g, " ")}`,
            createdAt: new Date().toISOString(),
          }
        : null;

    const nextActivities = activityForWorkout ? [activityForWorkout, ...state.activities] : state.activities;
    const nextWorkoutLogs = [newLog, ...state.workoutLogs];
    const derived = deriveStatsFromActivities(nextActivities);

    const todayRankSnapshot: RankHistoryEntry = {
      date: todayStr,
      swimPoints: newSwim,
      bikePoints: newBike,
      runPoints: newRun,
      overallPoints: getTriRank(newSwim, newBike, newRun).overallPoints,
    };
    const existingTodayIndex = state.rankHistory.findIndex(
      (entry) => entry.date.split("T")[0] === todayStr
    );
    const nextRankHistory = [...state.rankHistory];
    if (existingTodayIndex >= 0) nextRankHistory[existingTodayIndex] = todayRankSnapshot;
    else nextRankHistory.unshift(todayRankSnapshot);

    const overallPoints = getTriRank(newSwim, newBike, newRun).overallPoints;
    const performanceStats = buildPerformanceStats(
      nextActivities,
      nextWorkoutLogs,
      state.currentStreak + 1,
      overallPoints
    );

    set({
      workoutLogs: nextWorkoutLogs,
      activities: nextActivities,
      rankHistory: nextRankHistory,
      swimPoints: newSwim,
      bikePoints: newBike,
      runPoints: newRun,
      lastSwimDate: workout.discipline === "swim" ? todayStr : state.lastSwimDate,
      lastBikeDate: workout.discipline === "bike" ? todayStr : state.lastBikeDate,
      lastRunDate: workout.discipline === "run" ? todayStr : state.lastRunDate,
      currentStreak: state.currentStreak + 1,
      longestStreak: Math.max(state.longestStreak, state.currentStreak + 1),
      lastActivityDate: todayStr,
      weeklyStats: derived.weeklyStats,
      weeklyVolumes: derived.weeklyVolumes,
      personalBests: derived.personalBests,
      performanceStats,
      showWorkoutConfirmation: true,
      lastLoggedPoints: points,
    });

    if (state.currentUserId) {
      try {
        const savedLog = await createWorkoutLog({
          user_id: state.currentUserId,
          discipline: workout.discipline,
          workout_type: workout.workoutType,
          duration: workout.duration,
          distance: workout.distance,
          effort: workout.effort,
          indoor_outdoor: workout.indoorOutdoor,
          notes: workout.notes,
          points_earned: points,
          date: workout.date,
        });

        const savedLogId = String(savedLog.id);
        set((prev) => ({
          workoutLogs: prev.workoutLogs.map((log) =>
            log.id === id ? { ...log, id: savedLogId, createdAt: normalizeIsoDate(savedLog.created_at) ?? log.createdAt } : log
          ),
        }));

        if (activityForWorkout && (workout.discipline === "swim" || workout.discipline === "bike" || workout.discipline === "run")) {
          const savedActivity = await createActivity({
            user_id: state.currentUserId,
            discipline: workout.discipline,
            title: activityForWorkout.title,
            distance: activityForWorkout.distance > 0 ? activityForWorkout.distance : 0.01,
            duration: Math.max(1, Math.round(activityForWorkout.duration)),
            pace: Math.round(activityForWorkout.pace * 100) / 100,
            points_earned: points,
            distance_bonus: 0,
            pace_bonus: 0,
            date: workout.date,
            source: "manual",
          });
          const savedActivityId = String(savedActivity.id);
          set((prev) => ({
            activities: prev.activities.map((activity) =>
              activity.id === activityForWorkout.id
                ? {
                    ...activity,
                    id: savedActivityId,
                    createdAt: normalizeIsoDate(savedActivity.created_at) ?? activity.createdAt,
                  }
                : activity
            ),
          }));
        }

        await upsertRankPoints(state.currentUserId, {
          swim: newSwim,
          bike: newBike,
          run: newRun,
        });
        await upsertStreak(state.currentUserId, {
          current_streak: state.currentStreak + 1,
          longest_streak: Math.max(state.longestStreak, state.currentStreak + 1),
          last_activity_date: todayStr,
        });
      } catch (error) {
        console.error("Failed to persist workout log:", error);
      }
    }
  },

  dismissWorkoutConfirmation: () =>
    set({ showWorkoutConfirmation: false }),

  togglePremium: () =>
    set((state) => ({
      user: { ...state.user, isPremium: !state.user.isPremium },
    })),

  togglePlanWorkoutComplete: (day: string) =>
    set((state) => ({
      trainingPlan: {
        ...state.trainingPlan,
        weeklyPlan: state.trainingPlan.weeklyPlan.map((w) =>
          w.day === day ? { ...w, completed: !w.completed } : w
        ),
      },
    })),

  setAvailability: (availability: DisciplineAvailability) =>
    set({ availability }),

  toggleAvailabilityDay: (discipline: Discipline, day: string) =>
    set((state) => {
      const current = state.availability[discipline];
      const updated = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day];
      return {
        availability: { ...state.availability, [discipline]: updated },
      };
    }),

  setPreferredLongRideDay: (day: string | null) =>
    set((state) => ({
      availability: { ...state.availability, preferredLongRideDay: day },
    })),

  startLiveWorkout: (discipline: Discipline) =>
    set({
      liveWorkout: {
        isActive: true,
        isPaused: false,
        discipline,
        startTime: Date.now(),
        elapsedTime: 0,
        distance: 0,
        coordinates: [],
        splits: [],
      },
    }),

  pauseLiveWorkout: () =>
    set((state) => ({
      liveWorkout: { ...state.liveWorkout, isPaused: true },
    })),

  resumeLiveWorkout: () =>
    set((state) => ({
      liveWorkout: { ...state.liveWorkout, isPaused: false },
    })),

  stopLiveWorkout: () =>
    set((state) => ({
      liveWorkout: {
        ...state.liveWorkout,
        isActive: false,
        isPaused: false,
      },
    })),

  updateLiveWorkout: (elapsed: number, distance: number, coord?: GpsCoordinate) =>
    set((state) => ({
      liveWorkout: {
        ...state.liveWorkout,
        elapsedTime: elapsed,
        distance,
        coordinates: coord
          ? [...state.liveWorkout.coordinates, coord]
          : state.liveWorkout.coordinates,
      },
    })),

  addSplit: (splitTime: number) =>
    set((state) => ({
      liveWorkout: {
        ...state.liveWorkout,
        splits: [...state.liveWorkout.splits, splitTime],
      },
    })),

  setFriendsLeaderboardTab: (tab: LeaderboardTab) =>
    set({ friendsLeaderboardTab: tab }),

  toggleDeviceConnection: (deviceId: string) =>
    set((state) => ({
      connectedDevices: state.connectedDevices.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              isConnected: !d.isConnected,
              lastSync: !d.isConnected ? new Date().toISOString() : d.lastSync,
            }
          : d
      ),
    })),

  // Auth actions
  setAuth: (isAuthenticated: boolean, userId?: string) =>
    set({
      isAuthenticated,
      currentUserId: userId ?? null,
      ...(isAuthenticated
        ? {}
        : {
            user: emptyUser,
            activities: [],
            personalBests: [],
            swimPoints: BRONZE_START_POINTS,
            bikePoints: BRONZE_START_POINTS,
            runPoints: BRONZE_START_POINTS,
            leaderboard: [],
            rankHistory: [],
            weeklyStats: emptyWeeklyStats,
            workoutLogs: [],
            milestones: [],
            raceGoal: null,
            weeklyVolumes: [],
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: "",
            selectedRaceEvent: null,
            prepPlan: null,
            socialProfile: emptySocialProfile,
            friendsLeaderboard: [],
            friendProfiles: [],
            chatConversations: [],
            performanceStats: emptyPerformanceStats,
          }),
    }),

  hydrateUserData: async (userId: string) => {
    set({ isLoading: true });
    try {
      const [
        { data: authData },
        activitiesRows,
        logsRows,
        points,
        streak,
        raceGoalRow,
        historyRows,
        milestoneRows,
        friends,
        conversations,
        subscription,
        leaderboardRows,
      ] =
        await Promise.all([
          supabase.auth.getUser(),
          listActivities(userId, { limit: 500 }),
          listWorkoutLogs(userId, { limit: 500 }),
          getRankPoints(userId),
          getStreak(userId),
          getLatestRaceGoalEvent(userId),
          getRankHistory(userId, 24),
          listMilestones(userId),
          listFriendSummaries(userId),
          listConversations(userId),
          getActiveSubscription(userId),
          getLeaderboardOverall(50).catch(() => []),
        ]);

      const authUser = authData.user;
      const email = authUser?.email ?? "";
      const displayName = authUser?.user_metadata?.display_name ?? "";
      const profile = await getOrCreateProfile(userId, email, displayName);

      const activities = activitiesRows.map(buildActivityFromRow);
      const workoutLogs = logsRows.map(buildWorkoutLogFromRow);
      workoutCounter = Math.max(workoutCounter, workoutLogs.length);

      const derived = deriveStatsFromActivities(activities);
      const fallbackStreak = buildCurrentStreakFromActivities(activities);

      const hasAnyTrackedData = activities.length > 0 || workoutLogs.length > 0;
      const hasRankPoints = points.swim > 0 || points.bike > 0 || points.run > 0;
      const swimPoints = hasRankPoints
        ? points.swim
        : hasAnyTrackedData
        ? activities
            .filter((a: Activity) => a.discipline === "swim")
            .reduce((sum: number, a: Activity) => sum + a.pointsEarned, 0)
        : BRONZE_START_POINTS;
      const bikePoints = hasRankPoints
        ? points.bike
        : hasAnyTrackedData
        ? activities
            .filter((a: Activity) => a.discipline === "bike")
            .reduce((sum: number, a: Activity) => sum + a.pointsEarned, 0)
        : BRONZE_START_POINTS;
      const runPoints = hasRankPoints
        ? points.run
        : hasAnyTrackedData
        ? activities
            .filter((a: Activity) => a.discipline === "run")
            .reduce((sum: number, a: Activity) => sum + a.pointsEarned, 0)
        : BRONZE_START_POINTS;

      const triRank = getTriRank(swimPoints, bikePoints, runPoints);
      const { friendProfiles, friendsLeaderboard } = mapFriendLeaderboard(
        userId,
        profile.display_name || email.split("@")[0] || "You",
        profile.avatar_url ?? null,
        triRank.overallPoints,
        friends
      );

      const selectedRaceEvent = raceGoalRow
        ? resolveEventFromPersistedGoal({
            event_id: raceGoalRow.event_id,
            event_name: raceGoalRow.event_name,
            event_date: raceGoalRow.event_date,
          })
        : null;

      const raceGoal: RaceGoal | null = selectedRaceEvent
        ? {
            id: raceGoalRow?.id ?? `goal-${selectedRaceEvent.id}`,
            raceType: inferRaceType(selectedRaceEvent.distance),
            raceName: selectedRaceEvent.name,
            raceDate: selectedRaceEvent.date,
            goalType: "finish",
          }
        : null;

      const rankHistory = (historyRows ?? [])
        .map((row: any) => ({
          date: String(row.snapshot_date),
          swimPoints: Number(row.swim_points ?? 0),
          bikePoints: Number(row.bike_points ?? 0),
          runPoints: Number(row.run_points ?? 0),
          overallPoints: Number(row.overall_points ?? 0),
        }))
        .sort((a: RankHistoryEntry, b: RankHistoryEntry) => a.date.localeCompare(b.date));

      const milestones = (milestoneRows ?? []).map((row: any) => ({
        id: String(row.id),
        type: row.type,
        title: String(row.title ?? ""),
        description: String(row.description ?? ""),
        achievedAt: normalizeIsoDate(row.achieved_at),
        icon: String(row.icon ?? "🏅"),
      }));

      const leaderboard = (leaderboardRows ?? []).map((row: any) => {
        const points = Math.floor(Number(row.overall_points ?? 0));
        const rankInfo = getRankForPoints(points);
        return {
          rank: Number(row.rank ?? 0),
          userId: String(row.user_id),
          displayName: String(row.display_name ?? "Athlete"),
          avatarUrl: (row.avatar_url as string | null) ?? null,
          points,
          tier: rankInfo.tier,
          tierColor: rankInfo.color,
          isFriend: friendProfiles.some((friend) => friend.id === String(row.user_id)),
        } as LeaderboardEntry;
      });

      const currentStreak = Number(streak.current_streak ?? fallbackStreak.currentStreak);
      const longestStreak = Number(streak.longest_streak ?? fallbackStreak.longestStreak);
      const overallPoints = triRank.overallPoints;
      const performanceStats = buildPerformanceStats(activities, workoutLogs, currentStreak, overallPoints);
      const weeklyDistance =
        (derived.weeklyStats.bikeDistance || 0) +
        (derived.weeklyStats.runDistance || 0) +
        (derived.weeklyStats.swimDistance || 0) / 1000;

      const latestWeekVolume = derived.weeklyVolumes.slice(-1)[0];
      const latestWeekMinutes = Math.round(
        ((latestWeekVolume?.swimHours ?? 0) +
          (latestWeekVolume?.bikeHours ?? 0) +
          (latestWeekVolume?.runHours ?? 0)) *
          60
      );

      const socialProfile: SocialProfile = {
        followers: 0,
        following: friendProfiles.length,
        bio: get().socialProfile.bio,
        weeklyDistance,
        weeklyTime: latestWeekMinutes,
        weeklyElevation: 0,
        rrChange: rankHistory.length > 1 ? triRank.overallPoints - rankHistory[rankHistory.length - 2].overallPoints : 0,
      };

      set({
        user: {
          ...emptyUser,
          id: profile.id,
          displayName: profile.display_name || email.split("@")[0] || "Athlete",
          email: profile.email,
          avatarUrl: profile.avatar_url ?? null,
          isPremium: subscription?.status === "active" ? true : Boolean(profile.is_premium),
          createdAt: normalizeIsoDate(profile.created_at) ?? emptyUser.createdAt,
          raceDistanceGoal: profile.race_distance_goal ?? null,
          targetRaceDate: profile.target_race_date ?? null,
          preferredMode: profile.preferred_mode ?? null,
          swimLevel: profile.swim_level ?? null,
          bikeLevel: profile.bike_level ?? null,
          runLevel: profile.run_level ?? null,
          weeklyAvailability: profile.weekly_availability ?? null,
          primaryGoal: profile.primary_goal ?? null,
          age: profile.age ?? null,
          athleteType: profile.athlete_type ?? null,
        },
        activities,
        workoutLogs,
        swimPoints,
        bikePoints,
        runPoints,
        personalBests: derived.personalBests,
        weeklyStats: derived.weeklyStats,
        weeklyVolumes: derived.weeklyVolumes,
        currentStreak,
        longestStreak,
        lastActivityDate:
          normalizeIsoDate(streak.last_activity_date)?.split("T")[0] ??
          fallbackStreak.lastActivityDate ??
          "",
        lastSwimDate: derived.lastSwimDate,
        lastBikeDate: derived.lastBikeDate,
        lastRunDate: derived.lastRunDate,
        rankHistory,
        milestones,
        selectedRaceEvent,
        raceGoal,
        leaderboard,
        friendProfiles,
        friendsLeaderboard,
        chatConversations: conversations,
        performanceStats,
        socialProfile,
      });
    } catch (e) {
      console.error("Failed to hydrate user data:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActivities: async (userId: string) => {
    try {
      const [activitiesRows, logsRows, points, streak] = await Promise.all([
        listActivities(userId, { limit: 500 }),
        listWorkoutLogs(userId, { limit: 500 }),
        getRankPoints(userId),
        getStreak(userId),
      ]);
      const activities = activitiesRows.map(buildActivityFromRow);
      const workoutLogs = logsRows.map(buildWorkoutLogFromRow);
      const derived = deriveStatsFromActivities(activities);
      const fallbackStreak = buildCurrentStreakFromActivities(activities);
      const currentStreak = Number(streak.current_streak ?? fallbackStreak.currentStreak);
      const longestStreak = Number(streak.longest_streak ?? fallbackStreak.longestStreak);

      const swimPoints = points.swim || BRONZE_START_POINTS;
      const bikePoints = points.bike || BRONZE_START_POINTS;
      const runPoints = points.run || BRONZE_START_POINTS;
      const overallPoints = getTriRank(swimPoints, bikePoints, runPoints).overallPoints;
      const performanceStats = buildPerformanceStats(activities, workoutLogs, currentStreak, overallPoints);

      set({
        activities,
        workoutLogs,
        swimPoints,
        bikePoints,
        runPoints,
        weeklyStats: derived.weeklyStats,
        weeklyVolumes: derived.weeklyVolumes,
        personalBests: derived.personalBests,
        currentStreak,
        longestStreak,
        lastActivityDate:
          normalizeIsoDate(streak.last_activity_date)?.split("T")[0] ??
          fallbackStreak.lastActivityDate ??
          "",
        lastSwimDate: derived.lastSwimDate,
        lastBikeDate: derived.lastBikeDate,
        lastRunDate: derived.lastRunDate,
        performanceStats,
      });
    } catch (e) {
      console.error("Fetch activities error:", e);
    }
  },

  fetchProfile: async (userId: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const email = authUser?.email ?? "";
      const displayName = authUser?.user_metadata?.display_name ?? "";

      const profile = await getOrCreateProfile(userId, email, displayName);
      const subscription = await getActiveSubscription(userId);
      if (profile) {
        set((state) => ({
          user: {
            ...emptyUser,
            ...state.user,
            id: profile.id,
            displayName: profile.display_name || email.split("@")[0],
            email: profile.email,
            avatarUrl: profile.avatar_url ?? null,
            isPremium: subscription?.status === "active" ? true : Boolean(profile.is_premium),
            raceDistanceGoal: profile.race_distance_goal ?? null,
            targetRaceDate: profile.target_race_date ?? null,
            preferredMode: profile.preferred_mode ?? null,
            swimLevel: profile.swim_level ?? null,
            bikeLevel: profile.bike_level ?? null,
            runLevel: profile.run_level ?? null,
            weeklyAvailability: profile.weekly_availability ?? null,
            primaryGoal: profile.primary_goal ?? null,
            age: profile.age ?? null,
            athleteType: profile.athlete_type ?? null,
          },
        }));
      }
    } catch (e) {
      console.error("Profile fetch/create error:", e);
    }
  },

  refreshFriends: async (userId: string) => {
    try {
      const state = get();
      const triRank = getTriRank(state.swimPoints, state.bikePoints, state.runPoints);
      const friends = await listFriendSummaries(userId);
      const { friendProfiles, friendsLeaderboard } = mapFriendLeaderboard(
        userId,
        state.user.displayName,
        state.user.avatarUrl,
        triRank.overallPoints,
        friends
      );
      set({
        friendProfiles,
        friendsLeaderboard,
      });
    } catch (error) {
      console.error("Failed to refresh friends:", error);
    }
  },
}));
