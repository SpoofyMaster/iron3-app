import { create } from "zustand";
import {
  Activity,
  PersonalBest,
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
} from "@/types";
import { getTriRank } from "@/lib/ranks";
import {
  mockUser,
  mockActivities,
  mockPersonalBests,
  mockSwimPoints,
  mockBikePoints,
  mockRunPoints,
  mockLeaderboard,
  mockRankHistory,
  mockWeeklyStats,
} from "@/lib/mockData";

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

  onboarding: OnboardingState;
  hasCompletedOnboarding: boolean;

  isLoading: boolean;

  getTriRank: () => ReturnType<typeof getTriRank>;
  getActivitiesForDiscipline: (discipline: Discipline) => Activity[];
  getPersonalBestsForDiscipline: (discipline: Discipline) => PersonalBest[];
  getFilteredLeaderboard: () => LeaderboardEntry[];

  setLeaderboardFilter: (filter: LeaderboardFilter) => void;
  setLeaderboardScope: (scope: LeaderboardScope) => void;
  setLeaderboardAgeGroup: (group: AgeGroup) => void;

  setOnboardingStep: (step: number) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setOnboardingDisciplines: (disciplines: Discipline[]) => void;
  setWeeklyGoal: (goal: number) => void;
  completeOnboarding: () => void;

  togglePremium: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: mockUser,
  activities: mockActivities,
  personalBests: mockPersonalBests,

  swimPoints: mockSwimPoints,
  bikePoints: mockBikePoints,
  runPoints: mockRunPoints,

  leaderboard: mockLeaderboard,
  leaderboardFilter: "overall",
  leaderboardScope: "global",
  leaderboardAgeGroup: "all",

  rankHistory: mockRankHistory,
  weeklyStats: mockWeeklyStats,

  onboarding: {
    step: 0,
    experienceLevel: null,
    disciplines: [],
    weeklyGoal: 3,
  },
  hasCompletedOnboarding: true,

  isLoading: false,

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
    const { leaderboard, leaderboardScope } = get();
    if (leaderboardScope === "friends") {
      return leaderboard.filter((e) => e.isFriend || e.userId === "user-001");
    }
    return leaderboard;
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

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  togglePremium: () =>
    set((state) => ({
      user: { ...state.user, isPremium: !state.user.isPremium },
    })),
}));
