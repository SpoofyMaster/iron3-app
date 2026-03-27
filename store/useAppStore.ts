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
  mockWorkoutLogs,
  mockMilestones,
  mockRaceGoal,
  mockWeeklyVolumes,
  mockTrainingPlan,
  mockAvailability,
  mockSocialProfile,
  mockFriendsLeaderboard,
  mockConnectedDevices,
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
  friendsLeaderboardTab: LeaderboardTab;

  // Connected devices (Task 8)
  connectedDevices: ConnectedDevice[];

  isLoading: boolean;
  showWorkoutConfirmation: boolean;
  lastLoggedPoints: number;

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

  logWorkout: (workout: Omit<WorkoutLog, "id" | "userId" | "createdAt" | "pointsEarned">) => void;
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
}

let workoutCounter = 100;

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

  workoutLogs: mockWorkoutLogs,
  milestones: mockMilestones,
  raceGoal: mockRaceGoal,
  weeklyVolumes: mockWeeklyVolumes,

  currentStreak: 7,
  longestStreak: 34,
  lastActivityDate: "2026-03-26",

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
  socialProfile: mockSocialProfile,
  friendsLeaderboard: mockFriendsLeaderboard,
  friendsLeaderboardTab: "friends" as LeaderboardTab,
  connectedDevices: mockConnectedDevices,

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

  logWorkout: (workout) => {
    workoutCounter++;
    const id = `wl-${workoutCounter}`;
    const durationMin = workout.duration / 60;
    let points = Math.floor(durationMin * 3);
    if (workout.effort >= 7) points += 20;
    if (workout.effort >= 9) points += 30;
    if (durationMin >= 60) points += 15;
    if (durationMin >= 90) points += 30;

    const newLog: WorkoutLog = {
      ...workout,
      id,
      userId: "user-001",
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

    set({
      workoutLogs: [newLog, ...state.workoutLogs],
      swimPoints: newSwim,
      bikePoints: newBike,
      runPoints: newRun,
      currentStreak: state.currentStreak + 1,
      lastActivityDate: new Date().toISOString().split("T")[0],
      weeklyStats: {
        ...state.weeklyStats,
        totalActivities: state.weeklyStats.totalActivities + 1,
        totalPoints: state.weeklyStats.totalPoints + points,
      },
      showWorkoutConfirmation: true,
      lastLoggedPoints: points,
    });
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
}));
