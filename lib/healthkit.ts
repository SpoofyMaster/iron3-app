import { Activity } from "@/types";

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

/**
 * Request permissions for health data access.
 * V1: Stub - returns false. Requires expo-health-connect or similar native module.
 *
 * Permissions requested:
 * - Workout data (swim, bike, run)
 * - Heart rate
 * - Distance
 * - Active energy
 * - Steps
 */
export async function requestHealthPermissions(): Promise<boolean> {
  // V1 stub: real implementation needs expo-health-connect or expo-healthkit
  console.log("[HealthKit] Permission request - stub");
  return false;
}

/**
 * Get recent workouts from Apple Health / Health Connect.
 * V1: Returns empty array. Real implementation needs native health module.
 */
export async function getRecentWorkouts(days: number): Promise<HealthWorkout[]> {
  console.log(`[HealthKit] Getting workouts for last ${days} days - stub`);
  return [];
}

/**
 * Sync a completed workout to Apple Health / Health Connect.
 * V1: Logs to console. Real implementation needs native health module.
 */
export async function syncWorkoutToHealth(workout: Activity): Promise<void> {
  console.log("[HealthKit] Syncing workout to health - stub", workout.id);
}

/**
 * Check if health data access is available on this device.
 */
export function isHealthAvailable(): boolean {
  // Would check Platform.OS and native module availability
  return false;
}
