export interface GarminWorkout {
  id: string;
  activityType: string;
  startTime: string;
  duration: number;
  distance: number;
  avgHeartRate?: number;
  avgPace?: number;
}

/**
 * Connect to Garmin Connect via OAuth.
 * V1: Stub - deep link to Garmin Connect app for OAuth.
 * V2: Full API sync via Garmin Connect IQ.
 */
export async function connectGarmin(): Promise<boolean> {
  console.log("[Garmin] Connect - stub (would deep link to Garmin Connect)");
  return false;
}

/**
 * Fetch recent workouts from Garmin Connect.
 * V1: Returns empty array. Real implementation needs Garmin API credentials.
 */
export async function getGarminWorkouts(): Promise<GarminWorkout[]> {
  console.log("[Garmin] Getting workouts - stub");
  return [];
}

/**
 * Disconnect Garmin Connect integration.
 */
export async function disconnectGarmin(): Promise<void> {
  console.log("[Garmin] Disconnect - stub");
}

/**
 * Check if Garmin Connect app is installed.
 */
export function isGarminAvailable(): boolean {
  return false;
}
