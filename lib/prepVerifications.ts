import { supabase } from "./supabase";
import type { PrepMatchType, PrepSessionVerificationRow } from "@/types";

function rowToVerification(r: Record<string, unknown>): PrepSessionVerificationRow {
  return {
    id: String(r.id),
    userId: String(r.user_id),
    prepWeekNumber: Number(r.prep_week_number),
    sessionDay: String(r.session_day),
    sessionDiscipline: String(r.session_discipline),
    plannedDuration: Number(r.planned_duration),
    actualActivityId: r.actual_activity_id ? String(r.actual_activity_id) : null,
    correlationScore: Number(r.correlation_score),
    matchType: r.match_type as PrepMatchType,
    xpBonusApplied: Number(r.xp_bonus_applied ?? 0),
    verifiedAt: String(r.verified_at),
  };
}

export async function listPrepSessionVerifications(
  userId: string,
  weekNumber: number
): Promise<PrepSessionVerificationRow[]> {
  const { data, error } = await supabase
    .from("prep_session_verifications")
    .select("*")
    .eq("user_id", userId)
    .eq("prep_week_number", weekNumber);

  if (error) {
    console.warn("listPrepSessionVerifications:", error);
    return [];
  }

  return (data ?? []).map((r) => rowToVerification(r as Record<string, unknown>));
}
