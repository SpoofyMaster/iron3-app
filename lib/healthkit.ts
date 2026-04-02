/**
 * Apple HealthKit integration for Iron3
 *
 * Uses @kingstinct/react-native-healthkit — iOS only.
 * Dynamically imported so the app still builds on Android/web.
 */
import { Platform } from "react-native";
import { RankTier } from "@/types";
import { getRankForPoints, getRankFactor, getXpPerMinute } from "./ranks";

// ---------- dynamic import ----------
type HKModule = typeof import("@kingstinct/react-native-healthkit");
let HK: HKModule | null = null;

if (Platform.OS === "ios") {
  try {
    HK = require("@kingstinct/react-native-healthkit");
  } catch {
    console.warn("[Iron3] HealthKit module not available");
  }
}

// ---------- discipline mapping ----------
const SWIM_ACTIVITIES = new Set([46, 53]);
const BIKE_ACTIVITIES = new Set([13, 74]);
const RUN_ACTIVITIES = new Set([37, 52, 24]);
const TRI_ACTIVITY = 82;

export type Discipline = "swim" | "bike" | "run";

export interface HealthWorkoutData {
  id: string;
  discipline: Discipline | null;
  activityType: number;
  startDate: string;
  endDate: string;
  duration: number;
  distance: number;
  calories: number;
  sourceName: string;
}

export function isHealthKitAvailable(): boolean {
  if (Platform.OS !== "ios" || !HK) return false;
  try {
    return HK.isHealthDataAvailable();
  } catch {
    return false;
  }
}

export async function requestHealthKitPermissions(): Promise<boolean> {
  if (!HK) return false;
  try {
    return await HK.requestAuthorization({
      toRead: ["HKWorkoutTypeIdentifier"],
    });
  } catch (e) {
    console.error("[Iron3] HealthKit auth failed:", e);
    return false;
  }
}

function toDiscipline(activityType: number): Discipline | null {
  if (SWIM_ACTIVITIES.has(activityType)) return "swim";
  if (BIKE_ACTIVITIES.has(activityType)) return "bike";
  if (RUN_ACTIVITIES.has(activityType)) return "run";
  if (activityType === TRI_ACTIVITY) return "run";
  return null;
}

export async function fetchWorkouts(
  fromDate: Date,
  toDate: Date = new Date()
): Promise<HealthWorkoutData[]> {
  if (!HK) return [];

  try {
    const workouts = await HK.queryWorkoutSamples({
      limit: 200,
      ascending: false,
      filter: {
        date: {
          startDate: fromDate,
          endDate: toDate,
        },
      },
    });

    return workouts.map((w) => {
      const json = w.toJSON();
      return {
        id: json.uuid ?? `hk-${json.startDate}`,
        discipline: toDiscipline(json.workoutActivityType),
        activityType: json.workoutActivityType,
        startDate:
          typeof json.startDate === "string"
            ? json.startDate
            : new Date(json.startDate as any).toISOString(),
        endDate:
          typeof json.endDate === "string"
            ? json.endDate
            : new Date(json.endDate as any).toISOString(),
        duration: json.duration?.quantity ?? 0,
        distance: json.totalDistance?.quantity ?? 0,
        calories: json.totalEnergyBurned?.quantity ?? 0,
        sourceName: "Apple Health",
      };
    });
  } catch (e) {
    console.error("[Iron3] Failed to fetch HealthKit workouts:", e);
    return [];
  }
}

export async function fetchRecentWorkouts(days: number = 7): Promise<HealthWorkoutData[]> {
  const from = new Date();
  from.setDate(from.getDate() - days);
  return fetchWorkouts(from);
}

export interface CalculatePointsResult {
  points: number;
  distanceBonus: number;
  paceBonus: number;
  tier: RankTier;
  rankFactor: number;
  baseBeforeCompliance: number;
}

/**
 * XP for a synced workout. Uses tri-rank overall points **before** this workout for tier.
 */
export function calculatePoints(
  workout: HealthWorkoutData,
  overallPointsBeforeWorkout: number
): CalculatePointsResult {
  const tier = getRankForPoints(overallPointsBeforeWorkout).tier;
  const xpPerMin = getXpPerMinute(tier);
  const rankFactor = getRankFactor(tier);

  const durationMin = workout.duration / 60;
  const distanceKm = workout.distance / 1000;

  let points = Math.floor(durationMin * xpPerMin);

  let distanceBonus = 0;
  if (workout.discipline === "swim") {
    distanceBonus = Math.floor(distanceKm * 20 * rankFactor);
  } else if (workout.discipline === "bike") {
    distanceBonus = Math.floor(distanceKm * 2 * rankFactor);
  } else if (workout.discipline === "run") {
    distanceBonus = Math.floor(distanceKm * 5 * rankFactor);
  }

  let paceBonus = 0;
  if (distanceKm > 0 && durationMin > 0) {
    const pace = durationMin / distanceKm;
    if (workout.discipline === "run" && pace < 5.5) paceBonus = 20;
    else if (workout.discipline === "run" && pace < 6.5) paceBonus = 10;
    else if (workout.discipline === "bike" && pace < 2.5) paceBonus = 20;
    else if (workout.discipline === "bike" && pace < 3.5) paceBonus = 10;
    else if (workout.discipline === "swim" && pace < 25) paceBonus = 20;
    else if (workout.discipline === "swim" && pace < 30) paceBonus = 10;
  }

  if (durationMin >= 90) points += 30;
  else if (durationMin >= 60) points += 15;

  points += distanceBonus + paceBonus;

  return {
    points,
    distanceBonus,
    paceBonus,
    tier,
    rankFactor,
    baseBeforeCompliance: points,
  };
}
