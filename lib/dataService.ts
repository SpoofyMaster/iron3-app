import { supabase } from "./supabase";

// ============================================================
// DATA SERVICE — Iron3 Supabase CRUD
// ============================================================

// ---------- PROFILES ----------

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  // PGRST116 = no rows found — profile doesn't exist yet
  if (error && error.code === "PGRST116") return null;
  if (error) throw error;
  return data;
}

export async function getOrCreateProfile(userId: string, email: string, displayName?: string) {
  // Try to get existing profile first
  const existing = await getProfile(userId);
  if (existing) return existing;

  // Profile doesn't exist — create it now
  const name = displayName || email.split("@")[0];
  const { data, error } = await supabase
    .from("profiles")
    .insert({ id: userId, email, display_name: name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- ACTIVITIES ----------

export async function listActivities(
  userId: string,
  opts?: { discipline?: string; limit?: number; offset?: number }
) {
  let query = supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (opts?.discipline) query = query.eq("discipline", opts.discipline);
  if (opts?.limit) query = query.limit(opts.limit);
  if (opts?.offset) query = query.range(opts.offset, opts.offset + (opts.limit ?? 20) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createActivity(activity: {
  user_id: string;
  discipline: "swim" | "bike" | "run";
  title: string;
  distance: number;
  duration: number;
  pace: number;
  points_earned: number;
  distance_bonus?: number;
  pace_bonus?: number;
  source?: string;
}) {
  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteActivity(activityId: string) {
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", activityId);
  if (error) throw error;
}

// ---------- WORKOUT LOGS ----------

export async function listWorkoutLogs(
  userId: string,
  opts?: { discipline?: string; limit?: number }
) {
  let query = supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (opts?.discipline) query = query.eq("discipline", opts.discipline);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createWorkoutLog(log: {
  user_id: string;
  discipline: string;
  workout_type: string;
  duration: number;
  distance?: number;
  effort: number;
  indoor_outdoor?: "indoor" | "outdoor";
  notes?: string;
  points_earned: number;
}) {
  const { data, error } = await supabase
    .from("workout_logs")
    .insert(log)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- RANK POINTS ----------

export async function getRankPoints(userId: string) {
  const { data, error } = await supabase
    .from("rank_points")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;

  const result = { swim: 0, bike: 0, run: 0 };
  for (const row of data ?? []) {
    if (row.discipline === "swim") result.swim = row.total_points;
    if (row.discipline === "bike") result.bike = row.total_points;
    if (row.discipline === "run") result.run = row.total_points;
  }
  return result;
}

// ---------- STREAKS ----------

export async function getStreak(userId: string) {
  const { data, error } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data ?? { current_streak: 0, longest_streak: 0, last_activity_date: null };
}

// ---------- MILESTONES ----------

export async function listMilestones(userId: string) {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertMilestone(milestone: {
  user_id: string;
  type: string;
  title: string;
  description?: string;
  icon?: string;
  achieved_at?: string;
}) {
  const { data, error } = await supabase
    .from("milestones")
    .upsert(milestone, { onConflict: "user_id,type" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- RACE GOALS ----------

export async function listRaceGoals(userId: string) {
  const { data, error } = await supabase
    .from("race_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createRaceGoal(goal: {
  user_id: string;
  race_type: string;
  race_name?: string;
  race_date?: string;
  goal_type?: string;
}) {
  const { data, error } = await supabase
    .from("race_goals")
    .insert(goal)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateRaceGoal(
  goalId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("race_goals")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", goalId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRaceGoal(goalId: string) {
  const { error } = await supabase.from("race_goals").delete().eq("id", goalId);
  if (error) throw error;
}

// ---------- PERSONAL BESTS ----------

export async function listPersonalBests(
  userId: string,
  discipline?: string
) {
  let query = supabase
    .from("personal_bests")
    .select("*")
    .eq("user_id", userId);

  if (discipline) query = query.eq("discipline", discipline);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ---------- LEADERBOARD ----------

export async function getLeaderboardOverall(limit = 50) {
  const { data, error } = await supabase
    .from("leaderboard_overall")
    .select("*")
    .order("rank", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getLeaderboardByDiscipline(
  discipline: "swim" | "bike" | "run",
  limit = 50
) {
  const { data, error } = await supabase
    .from("leaderboard_by_discipline")
    .select("*")
    .eq("discipline", discipline)
    .order("rank", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// ---------- FRIENDSHIPS ----------

export async function listFriends(userId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select("*, friend:profiles!friendships_friend_id_fkey(id, display_name, avatar_url)")
    .eq("user_id", userId)
    .eq("status", "accepted");
  if (error) throw error;
  return data ?? [];
}

export async function listFriendRequests(userId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select("*, user:profiles!friendships_user_id_fkey(id, display_name, avatar_url)")
    .eq("friend_id", userId)
    .eq("status", "pending");
  if (error) throw error;
  return data ?? [];
}

export async function sendFriendRequest(userId: string, friendId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .insert({ user_id: userId, friend_id: friendId, status: "pending" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function acceptFriendRequest(requestId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", requestId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- RANK HISTORY ----------

export async function getRankHistory(userId: string, limit = 12) {
  const { data, error } = await supabase
    .from("rank_history")
    .select("*")
    .eq("user_id", userId)
    .order("snapshot_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// ---------- SUBSCRIPTIONS ----------

export async function getActiveSubscription(userId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}
