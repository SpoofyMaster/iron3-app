import { getOrCreateProfile } from "@/lib/dataService";
import { supabase } from "@/lib/supabase";
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

  // Auth actions
  setAuth: (isAuthenticated: boolean, userId?: string) => void;
  fetchProfile: (userId: string) => Promise<void>;
  fetchActivities: (userId: string) => Promise<void>;
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

  // Auth state — defaults to "authenticated" for mock/dev mode
  isAuthenticated: true,
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

  // Auth actions
  setAuth: (isAuthenticated: boolean, userId?: string) =>
    set({
      isAuthenticated,
      currentUserId: userId ?? null,
    }),

  // Fetch (or auto-create) profile from Supabase
  fetchActivities: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(200);

      if (error) {
        console.error("Failed to fetch activities:", error);
        return;
      }

      if (data && data.length > 0) {
        const activities: Activity[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          discipline: row.discipline,
          date: row.date,
          distance: row.distance ?? 0,
          duration: row.duration ?? 0,
          pace: row.pace ?? 0,
          pointsEarned: row.points_earned ?? 0,
          distanceBonus: row.distance_bonus ?? 0,
          paceBonus: row.pace_bonus ?? 0,
          title: row.title ?? `${row.discipline} workout`,
          createdAt: row.created_at,
        }));

        // ---- Discipline points ----
        const swimActs = activities.filter((a) => a.discipline === "swim");
        const bikeActs = activities.filter((a) => a.discipline === "bike");
        const runActs = activities.filter((a) => a.discipline === "run");

        const swimPts = swimActs.reduce((s, a) => s + a.pointsEarned, 0);
        const bikePts = bikeActs.reduce((s, a) => s + a.pointsEarned, 0);
        const runPts = runActs.reduce((s, a) => s + a.pointsEarned, 0);

        // ---- Weekly stats (current week) ----
        const now = new Date();
        const dayOfWeek = now.getDay() || 7; // Mon=1 .. Sun=7
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - dayOfWeek + 1);
        weekStart.setHours(0, 0, 0, 0);

        const thisWeek = activities.filter(
          (a) => new Date(a.date) >= weekStart
        );
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

        // ---- Weekly volumes (last 8 weeks) ----
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
              .reduce((s, a) => s + a.duration / 60, 0),
            bikeHours: wActs
              .filter((a) => a.discipline === "bike")
              .reduce((s, a) => s + a.duration / 60, 0),
            runHours: wActs
              .filter((a) => a.discipline === "run")
              .reduce((s, a) => s + a.duration / 60, 0),
          });
        }

        // ---- Personal bests ----
        const calcPBs = (
          acts: Activity[],
          disc: "swim" | "bike" | "run"
        ): PersonalBest[] => {
          if (acts.length === 0) return [];
          const pbs: PersonalBest[] = [];

          // Longest distance
          const longest = acts.reduce((best, a) =>
            a.distance > best.distance ? a : best
          );
          pbs.push({
            discipline: disc,
            category: "Longest Distance",
            value: Math.round(longest.distance * 100) / 100,
            unit: disc === "swim" ? "m" : "km",
            date: longest.date,
          });

          // Longest duration
          const longestDur = acts.reduce((best, a) =>
            a.duration > best.duration ? a : best
          );
          pbs.push({
            discipline: disc,
            category: "Longest Duration",
            value: longestDur.duration,
            unit: "min",
            date: longestDur.date,
          });

          // Best pace (lowest pace = fastest, but pace > 0)
          const withPace = acts.filter((a) => a.pace > 0);
          if (withPace.length > 0) {
            const fastest = withPace.reduce((best, a) =>
              a.pace < best.pace ? a : best
            );
            pbs.push({
              discipline: disc,
              category: "Best Pace",
              value: Math.round(fastest.pace * 100) / 100,
              unit: disc === "swim" ? "sec/100m" : "min/km",
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

        // ---- Streak calculation ----
        const uniqueDates = [
          ...new Set(
            activities.map((a) =>
              new Date(a.date).toISOString().split("T")[0]
            )
          ),
        ].sort((a, b) => b.localeCompare(a)); // newest first

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 1;

        if (uniqueDates.length > 0) {
          // Current streak: count consecutive days from today backwards
          const today = new Date().toISOString().split("T")[0];
          const yesterday = new Date(
            Date.now() - 86400000
          ).toISOString().split("T")[0];

          if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
            currentStreak = 1;
            for (let i = 1; i < uniqueDates.length; i++) {
              const prev = new Date(uniqueDates[i - 1]);
              const curr = new Date(uniqueDates[i]);
              const diff =
                (prev.getTime() - curr.getTime()) / 86400000;
              if (Math.round(diff) === 1) {
                currentStreak++;
              } else {
                break;
              }
            }
          }

          // Longest streak
          for (let i = 1; i < uniqueDates.length; i++) {
            const prev = new Date(uniqueDates[i - 1]);
            const curr = new Date(uniqueDates[i]);
            const diff =
              (prev.getTime() - curr.getTime()) / 86400000;
            if (Math.round(diff) === 1) {
              tempStreak++;
            } else {
              longestStreak = Math.max(longestStreak, tempStreak);
              tempStreak = 1;
            }
          }
          longestStreak = Math.max(longestStreak, tempStreak);
        }

        set({
          activities,
          swimPoints: swimPts,
          bikePoints: bikePts,
          runPoints: runPts,
          weeklyStats,
          weeklyVolumes,
          personalBests,
          currentStreak,
          longestStreak,
          lastActivityDate: uniqueDates[0] ?? null,
        });
      }
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
      if (profile) {
        set((state) => ({
          user: {
            ...state.user,
            id: profile.id,
            displayName: profile.display_name || email.split("@")[0],
            email: profile.email,
            avatarUrl: profile.avatar_url ?? state.user.avatarUrl,
            isPremium: profile.is_premium,
          },
        }));
      }
    } catch (e) {
      console.error("Profile fetch/create error:", e);
    }
  },
}));
