import { supabase } from "./supabase";
import {
  isHealthKitAvailable,
  requestHealthKitPermissions,
  fetchRecentWorkouts,
  calculatePoints,
  HealthWorkoutData,
} from "./healthKit";
import { getRankPoints } from "./dataService";
import { getTriRank } from "./ranks";
import { correlateWorkoutWithPrepPlan } from "./prepCorrelation";
import type { PrepPlan } from "@/types";

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

export interface SyncHealthOptions {
  prepPlan?: PrepPlan | null;
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
 * Sync recent workouts from Apple Health to Supabase with PREP correlation.
 * Processes oldest → newest so rank-based XP matches progression order.
 */
export async function syncHealthWorkouts(
  userId: string,
  days: number = 30,
  options?: SyncHealthOptions
): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, skipped: 0, errors: 0, newActivities: [] };

  const workouts = await fetchRecentWorkouts(days);
  const triWorkouts = workouts.filter((w: HealthWorkoutData) => w.discipline !== null);

  if (triWorkouts.length === 0) {
    return result;
  }

  const sorted = [...triWorkouts].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const externalIds = sorted.map((w) => w.id);
  const { data: existing } = await supabase
    .from("activities")
    .select("external_id")
    .eq("user_id", userId)
    .in("external_id", externalIds);

  const existingIds = new Set((existing ?? []).map((e) => e.external_id));

  let swim = 0;
  let bike = 0;
  let run = 0;
  try {
    const rp = await getRankPoints(userId);
    swim = rp.swim;
    bike = rp.bike;
    run = rp.run;
  } catch {
    swim = 0;
    bike = 0;
    run = 0;
  }

  const prepPlan = options?.prepPlan ?? null;

  for (const workout of sorted) {
    if (existingIds.has(workout.id)) {
      result.skipped++;
      continue;
    }

    try {
      const overallBefore = getTriRank(swim, bike, run).overallPoints;
      const calc = calculatePoints(workout, overallBefore);
      const corr = correlateWorkoutWithPrepPlan(workout, prepPlan, swim, bike, run);

      let finalPoints = calc.points;
      let complianceBonus = 0;
      let prepVerified = false;

      if (corr.matchType === "exact_match" || corr.matchType === "partial_match") {
        const beforeMult = calc.baseBeforeCompliance;
        finalPoints = Math.floor(beforeMult * corr.xpMultiplier);
        complianceBonus = finalPoints - beforeMult;
        prepVerified = true;
      }

      const distanceKm = workout.distance / 1000;
      const durationSec = Math.max(1, Math.round(workout.duration));
      const paceMinPerKm = distanceKm > 0 ? workout.duration / 60 / distanceKm : 0;
      const safeDistance = Math.max(Math.round(distanceKm * 100) / 100, 0.01);

      const { data: inserted, error } = await supabase
        .from("activities")
        .insert({
          user_id: userId,
          discipline: workout.discipline,
          title: `${workout.sourceName} ${workout.discipline}`,
          date: workout.startDate,
          distance: safeDistance,
          duration: durationSec,
          pace: Math.round(paceMinPerKm * 100) / 100,
          points_earned: finalPoints,
          distance_bonus: calc.distanceBonus,
          pace_bonus: calc.paceBonus,
          source: "apple_health",
          external_id: workout.id,
          prep_verified: prepVerified,
          compliance_bonus: complianceBonus,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Failed to insert activity:", error);
        result.errors++;
        continue;
      }

      if (
        prepVerified &&
        corr.prepWeekNumber != null &&
        corr.sessionDay &&
        inserted?.id
      ) {
        try {
          const { error: vErr } = await supabase.from("prep_session_verifications").upsert(
            {
              user_id: userId,
              prep_week_number: corr.prepWeekNumber,
              session_day: corr.sessionDay,
              session_discipline: String(corr.sessionDiscipline ?? workout.discipline),
              planned_duration: Math.round(corr.plannedDurationSec ?? workout.duration),
              actual_activity_id: inserted.id,
              correlation_score: corr.correlationScore,
              match_type: corr.matchType,
              xp_bonus_applied: complianceBonus,
              verified_at: new Date().toISOString(),
            },
            { onConflict: "user_id,prep_week_number,session_day" }
          );
          if (vErr) console.warn("prep_session_verifications upsert:", vErr);
        } catch (ve) {
          console.warn("prep_session_verifications:", ve);
        }
      }

      if (workout.discipline === "swim") swim += finalPoints;
      else if (workout.discipline === "bike") bike += finalPoints;
      else if (workout.discipline === "run") run += finalPoints;

      result.synced++;
      result.newActivities.push({
        discipline: workout.discipline!,
        distance: Math.round(distanceKm * 100) / 100,
        duration: Math.round(workout.duration / 60),
        points: finalPoints,
      });
    } catch (e) {
      console.error("Sync error for workout:", e);
      result.errors++;
    }
  }

  return result;
}

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
