import { supabase } from "./supabase";
import {
  isHealthKitAvailable,
  requestHealthKitPermissions,
  fetchRecentWorkouts,
  calculatePoints,
  HealthWorkoutData,
} from "./healthKit";

export interface SyncResult {
  synced: number;
  skipped: number;
  errors: number;
  newActivities: Array<{
    discipline: string;
    distance: number;
    duration: number;
    points: number;
  }>;
}

/**
 * Connect Apple Health — request permissions and do initial sync
 */
export async function connectAppleHealth(): Promise<{ success: boolean; error?: string }> {
  const available = isHealthKitAvailable();
  if (!available) {
    return { success: false, error: "Apple Health is not available on this device." };
  }

  const authorized = await requestHealthKitPermissions();
  if (!authorized) {
    return { success: false, error: "Health permissions were denied." };
  }

  return { success: true };
}

/**
 * Sync recent workouts from Apple Health to Supabase
 * - Fetches workouts from last N days
 * - Skips already-imported workouts (by external_id)
 * - Creates activities + updates rank points
 */
export async function syncHealthWorkouts(
  userId: string,
  days: number = 30
): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, skipped: 0, errors: 0, newActivities: [] };

  // Fetch workouts from HealthKit
  const workouts = await fetchRecentWorkouts(days);
  
  // Filter to only swim/bike/run
  const triWorkouts = workouts.filter((w) => w.discipline !== null);

  if (triWorkouts.length === 0) {
    return result;
  }

  // Get already-imported external IDs to avoid duplicates
  const externalIds = triWorkouts.map((w) => w.id);
  const { data: existing } = await supabase
    .from("activities")
    .select("external_id")
    .eq("user_id", userId)
    .in("external_id", externalIds);

  const existingIds = new Set((existing ?? []).map((e) => e.external_id));

  // Import new workouts
  for (const workout of triWorkouts) {
    if (existingIds.has(workout.id)) {
      result.skipped++;
      continue;
    }

    try {
      const { points, distanceBonus, paceBonus } = calculatePoints(workout);
      const distanceKm = workout.distance / 1000;
      const durationMin = Math.round(workout.duration / 60);
      const paceMinPerKm = distanceKm > 0 ? workout.duration / 60 / distanceKm : 0;
      // DB has CHECK constraints: distance > 0, duration > 0
      const safeDistance = Math.max(Math.round(distanceKm * 100) / 100, 0.01);
      const safeDuration = Math.max(durationMin, 1);

      const { error } = await supabase.from("activities").insert({
        user_id: userId,
        discipline: workout.discipline,
        title: `${workout.sourceName} ${workout.discipline}`,
        date: workout.startDate,
        distance: safeDistance,
        duration: safeDuration,
        pace: Math.round(paceMinPerKm * 100) / 100,
        points_earned: points,
        distance_bonus: distanceBonus,
        pace_bonus: paceBonus,
        source: "apple_health",
        external_id: workout.id,
      });

      if (error) {
        console.error("Failed to insert activity:", error);
        result.errors++;
      } else {
        result.synced++;
        result.newActivities.push({
          discipline: workout.discipline!,
          distance: Math.round(distanceKm * 100) / 100,
          duration: durationMin,
          points,
        });
      }
    } catch (e) {
      console.error("Sync error for workout:", e);
      result.errors++;
    }
  }

  return result;
}

/**
 * Get last sync time from Supabase
 */
export async function getLastSyncTime(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("activities")
    .select("created_at")
    .eq("user_id", userId)
    .eq("source", "apple_health")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data?.created_at ?? null;
}
