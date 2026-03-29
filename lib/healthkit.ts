/**
 * Apple HealthKit integration for Iron3
 *
 * Uses @kingstinct/react-native-healthkit — iOS only.
 * Dynamically imported so the app still builds on Android/web.
 */
import { Platform } from "react-native";

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
// WorkoutActivityType enum values from @kingstinct/react-native-healthkit
const SWIM_ACTIVITIES = new Set([46 /* swimming */, 53 /* waterFitness */]);
const BIKE_ACTIVITIES = new Set([13 /* cycling */, 74 /* handCycling */]);
const RUN_ACTIVITIES = new Set([37 /* running */, 52 /* walking */, 24 /* hiking */]);
const TRI_ACTIVITY = 82; // swimBikeRun

export type Discipline = "swim" | "bike" | "run";

export interface HealthWorkoutData {
  id: string;
  discipline: Discipline | null;
  activityType: number;
  startDate: string; // ISO
  endDate: string;
  duration: number; // seconds
  distance: number; // meters
  calories: number;
  sourceName: string;
}

// ---------- availability ----------
export function isHealthKitAvailable(): boolean {
  if (Platform.OS !== "ios" || !HK) return false;
  try {
    return HK.isHealthDataAvailable();
  } catch {
    return false;
  }
}

// ---------- permissions ----------
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

// ---------- map activity → discipline ----------
function toDiscipline(activityType: number): Discipline | null {
  if (SWIM_ACTIVITIES.has(activityType)) return "swim";
  if (BIKE_ACTIVITIES.has(activityType)) return "bike";
  if (RUN_ACTIVITIES.has(activityType)) return "run";
  if (activityType === TRI_ACTIVITY) return "run"; // triathlon → count as run
  return null;
}

// ---------- fetch workouts ----------
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

export async function fetchRecentWorkouts(
  days: number = 7
): Promise<HealthWorkoutData[]> {
  const from = new Date();
  from.setDate(from.getDate() - days);
  return fetchWorkouts(from);
}

// ---------- point calculation ----------
export function calculatePoints(workout: HealthWorkoutData): {
  points: number;
  distanceBonus: number;
  paceBonus: number;
} {
  const durationMin = workout.duration / 60;
  const distanceKm = workout.distance / 1000;

  // Base: 3 pts / min
  let points = Math.floor(durationMin * 3);

  // Distance bonus (swimming is weighted higher)
  let distanceBonus = 0;
  if (workout.discipline === "swim") distanceBonus = Math.floor(distanceKm * 20);
  else if (workout.discipline === "bike") distanceBonus = Math.floor(distanceKm * 2);
  else if (workout.discipline === "run") distanceBonus = Math.floor(distanceKm * 5);

  // Pace bonus
  let paceBonus = 0;
  if (distanceKm > 0 && durationMin > 0) {
    const pace = durationMin / distanceKm; // min/km
    if (workout.discipline === "run" && pace < 5.5) paceBonus = 20;
    else if (workout.discipline === "run" && pace < 6.5) paceBonus = 10;
    else if (workout.discipline === "bike" && pace < 2.5) paceBonus = 20;
    else if (workout.discipline === "bike" && pace < 3.5) paceBonus = 10;
    else if (workout.discipline === "swim" && pace < 25) paceBonus = 20;
    else if (workout.discipline === "swim" && pace < 30) paceBonus = 10;
  }

  // Long-session bonus
  if (durationMin >= 90) points += 30;
  else if (durationMin >= 60) points += 15;

  points += distanceBonus + paceBonus;

  return { points, distanceBonus, paceBonus };
}
