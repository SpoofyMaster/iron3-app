import { getRankForPoints } from "@/lib/ranks";
import { ChatConversation, ChatMessage, Discipline, FriendProfileSummary, RankTier } from "@/types";
import { supabase } from "./supabase";

type DisciplinePoints = { swim: number; bike: number; run: number };
type LeaderboardScope = "friends" | "global" | "local";
type LeaderboardDiscipline = "overall" | "10k" | Discipline;

export interface SupabaseLeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  points: number;
  tier: RankTier;
  tierColor: string;
  isFriend: boolean;
}

export interface AthleteSummary {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  overallPoints: number;
  rankTier: RankTier;
  rankColor: string;
  targetRaceEventName: string | null;
}

export interface PersistedRaceGoalEvent {
  id: string;
  user_id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  created_at: string;
}

function rankTypeFromDistance(distance: "70.3" | "Full" | "5150"): string {
  if (distance === "Full") return "full_ironman";
  if (distance === "70.3") return "half_ironman";
  return "olympic";
}

function rowDate(value: unknown): string {
  if (!value) return new Date().toISOString();
  return typeof value === "string" ? value : String(value);
}

// ---------- PROFILES ----------
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code === "PGRST116") return null;
  if (error) throw error;
  return data;
}

export async function getOrCreateProfile(userId: string, email: string, displayName?: string) {
  const existing = await getProfile(userId);
  if (existing) return existing;

  const name = displayName || email.split("@")[0];
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, email, display_name: name }, { onConflict: "id", ignoreDuplicates: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
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
  date?: string;
  distance_bonus?: number;
  pace_bonus?: number;
  source?: string;
  external_id?: string;
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
  const { error } = await supabase.from("activities").delete().eq("id", activityId);
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
  distance?: number | null;
  effort: number;
  indoor_outdoor?: "indoor" | "outdoor" | null;
  notes?: string;
  points_earned: number;
  date?: string;
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
export async function getRankPoints(userId: string): Promise<DisciplinePoints> {
  const { data, error } = await supabase
    .from("rank_points")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;

  const result: DisciplinePoints = { swim: 0, bike: 0, run: 0 };
  for (const row of data ?? []) {
    if (row.discipline === "swim") result.swim = row.total_points;
    if (row.discipline === "bike") result.bike = row.total_points;
    if (row.discipline === "run") result.run = row.total_points;
  }
  return result;
}

export async function upsertRankPoints(userId: string, points: DisciplinePoints) {
  const payload = (["swim", "bike", "run"] as Discipline[]).map((discipline) => ({
    user_id: userId,
    discipline,
    total_points: points[discipline],
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("rank_points").upsert(payload, {
    onConflict: "user_id,discipline",
  });
  if (error) throw error;
}

// ---------- STREAKS ----------
export async function getStreak(userId: string) {
  const { data, error } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? { current_streak: 0, longest_streak: 0, last_activity_date: null };
}

export async function upsertStreak(
  userId: string,
  streak: { current_streak: number; longest_streak: number; last_activity_date: string | null }
) {
  const { error } = await supabase.from("streaks").upsert(
    {
      user_id: userId,
      ...streak,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
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

export async function updateRaceGoal(goalId: string, updates: Record<string, unknown>) {
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

export async function clearRaceGoalsForUser(userId: string) {
  const { error } = await supabase.from("race_goals").delete().eq("user_id", userId);
  if (error) throw error;
}

export async function saveRaceGoalEvent(
  userId: string,
  event: { id: string; name: string; date: string; distance: "70.3" | "Full" | "5150" }
) {
  await clearRaceGoalsForUser(userId);

  const payloadNew = {
    user_id: userId,
    event_id: event.id,
    event_name: event.name,
    event_date: event.date,
    race_type: rankTypeFromDistance(event.distance),
    race_name: event.name,
    race_date: event.date,
    goal_type: "finish",
  };

  const insertNew = await supabase.from("race_goals").insert(payloadNew).select().single();
  if (!insertNew.error) return insertNew.data;

  const payloadLegacy = {
    user_id: userId,
    race_type: rankTypeFromDistance(event.distance),
    race_name: event.name,
    race_date: event.date,
    goal_type: "finish",
  };
  const insertLegacy = await supabase.from("race_goals").insert(payloadLegacy).select().single();
  if (insertLegacy.error) throw insertLegacy.error;
  return insertLegacy.data;
}

export async function getLatestRaceGoalEvent(userId: string): Promise<PersistedRaceGoalEvent | null> {
  const { data, error } = await supabase
    .from("race_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: String(data.id),
    user_id: String(data.user_id),
    event_id: String(data.event_id ?? data.race_name ?? data.id),
    event_name: String(data.event_name ?? data.race_name ?? ""),
    event_date: rowDate(data.event_date ?? data.race_date),
    created_at: rowDate(data.created_at),
  };
}

// ---------- PERSONAL BESTS ----------
export async function listPersonalBests(userId: string, discipline?: string) {
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

export async function getLeaderboardByDiscipline(discipline: "swim" | "bike" | "run", limit = 50) {
  const { data, error } = await supabase
    .from("leaderboard_by_discipline")
    .select("*")
    .eq("discipline", discipline)
    .order("rank", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

function disciplinePointsToScore(points: DisciplinePoints, discipline: LeaderboardDiscipline): number {
  if (discipline === "swim") return Math.floor(points.swim);
  if (discipline === "bike") return Math.floor(points.bike);
  if (discipline === "run" || discipline === "10k") return Math.floor(points.run);
  return Math.floor(points.swim * 0.3 + points.bike * 0.4 + points.run * 0.3);
}

export async function getSupabaseLeaderboard(
  currentUserId: string,
  opts?: { scope?: LeaderboardScope; discipline?: LeaderboardDiscipline; limit?: number }
): Promise<SupabaseLeaderboardEntry[]> {
  const scope = opts?.scope ?? "friends";
  const discipline = opts?.discipline ?? "overall";
  const limit = opts?.limit ?? 100;
  const disciplines: Discipline[] =
    discipline === "overall" ? ["swim", "bike", "run"] : discipline === "10k" ? ["run"] : [discipline];

  const [rankRows, friendships, currentProfile] = await Promise.all([
    supabase
      .from("rank_points")
      .select("user_id,discipline,total_points,profile:profiles!rank_points_user_id_fkey(id,display_name,avatar_url)")
      .in("discipline", disciplines),
    listFriends(currentUserId).catch(() => []),
    supabase
      .from("profiles")
      .select("id,display_name,avatar_url")
      .eq("id", currentUserId)
      .maybeSingle(),
  ]);

  if (rankRows.error) throw rankRows.error;
  if (currentProfile.error) throw currentProfile.error;

  const friendIds = new Set<string>();
  for (const row of friendships as any[]) {
    const isRequester = String(row.user_id) === currentUserId;
    const friend = isRequester ? row.friend : row.user;
    if (friend?.id) friendIds.add(String(friend.id));
  }

  const byUser = new Map<
    string,
    { displayName: string; avatarUrl: string | null; points: DisciplinePoints; isFriend: boolean }
  >();

  if (currentProfile.data) {
    byUser.set(String(currentProfile.data.id), {
      displayName: String(currentProfile.data.display_name ?? "You"),
      avatarUrl: (currentProfile.data.avatar_url as string | null) ?? null,
      points: { swim: 0, bike: 0, run: 0 },
      isFriend: false,
    });
  }

  for (const row of friendships as any[]) {
    const isRequester = String(row.user_id) === currentUserId;
    const profile = isRequester ? row.friend : row.user;
    if (!profile?.id) continue;
    const profileId = String(profile.id);
    byUser.set(profileId, {
      displayName: String(profile.display_name ?? "Athlete"),
      avatarUrl: (profile.avatar_url as string | null) ?? null,
      points: byUser.get(profileId)?.points ?? { swim: 0, bike: 0, run: 0 },
      isFriend: true,
    });
  }

  for (const row of rankRows.data ?? []) {
    const userId = String(row.user_id);
    const profile = Array.isArray((row as any).profile) ? (row as any).profile[0] : (row as any).profile;
    const existing = byUser.get(userId) ?? {
      displayName: String(profile?.display_name ?? "Athlete"),
      avatarUrl: (profile?.avatar_url as string | null) ?? null,
      points: { swim: 0, bike: 0, run: 0 },
      isFriend: friendIds.has(userId),
    };
    if (row.discipline === "swim") existing.points.swim = Number(row.total_points ?? 0);
    if (row.discipline === "bike") existing.points.bike = Number(row.total_points ?? 0);
    if (row.discipline === "run") existing.points.run = Number(row.total_points ?? 0);
    existing.isFriend = friendIds.has(userId);
    byUser.set(userId, existing);
  }

  let users = Array.from(byUser.entries()).map(([userId, info]) => ({
    userId,
    displayName: info.displayName,
    avatarUrl: info.avatarUrl,
    points: disciplinePointsToScore(info.points, discipline),
    isFriend: info.isFriend,
  }));

  if (scope === "friends") {
    users = users.filter((entry) => entry.userId === currentUserId || friendIds.has(entry.userId));
  }
  // Local fallback: until location metadata is available in profiles, keep parity with global.

  users.sort((a, b) => b.points - a.points);

  return users.slice(0, limit).map((entry, index) => {
    const rank = getRankForPoints(entry.points);
    return {
      rank: index + 1,
      userId: entry.userId,
      displayName: entry.displayName,
      avatarUrl: entry.avatarUrl,
      points: entry.points,
      tier: rank.tier as RankTier,
      tierColor: rank.color,
      isFriend: entry.isFriend,
    };
  });
}

export async function getAthleteSummary(userId: string): Promise<AthleteSummary | null> {
  const [profileRes, rankRes, raceGoal] = await Promise.all([
    supabase.from("profiles").select("id,display_name,avatar_url").eq("id", userId).maybeSingle(),
    supabase.from("rank_points").select("discipline,total_points").eq("user_id", userId),
    getLatestRaceGoalEvent(userId).catch(() => null),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (rankRes.error) throw rankRes.error;
  if (!profileRes.data) return null;

  const points: DisciplinePoints = { swim: 0, bike: 0, run: 0 };
  for (const row of rankRes.data ?? []) {
    if (row.discipline === "swim") points.swim = Number(row.total_points ?? 0);
    if (row.discipline === "bike") points.bike = Number(row.total_points ?? 0);
    if (row.discipline === "run") points.run = Number(row.total_points ?? 0);
  }

  const overallPoints = disciplinePointsToScore(points, "overall");
  const rank = getRankForPoints(overallPoints);

  return {
    id: String(profileRes.data.id),
    displayName: String(profileRes.data.display_name ?? "Athlete"),
    avatarUrl: (profileRes.data.avatar_url as string | null) ?? null,
    overallPoints,
    rankTier: rank.tier as RankTier,
    rankColor: rank.color,
    targetRaceEventName: raceGoal?.event_name ?? null,
  };
}

// ---------- FRIENDSHIPS ----------
export async function listFriends(userId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select(
      "id,user_id,friend_id,status,created_at,user:profiles!friendships_user_id_fkey(id,display_name,avatar_url),friend:profiles!friendships_friend_id_fkey(id,display_name,avatar_url)"
    )
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listFriendRequests(userId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select(
      "*, user:profiles!friendships_user_id_fkey(id, display_name, avatar_url)"
    )
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

export async function declineFriendRequest(requestId: string) {
  const { error } = await supabase.from("friendships").delete().eq("id", requestId);
  if (error) throw error;
}

export async function getFollowCounts(userId: string): Promise<{ followers: number; following: number }> {
  const [followersRes, followingRes] = await Promise.all([
    supabase
      .from("friendships")
      .select("id", { count: "exact", head: true })
      .eq("friend_id", userId)
      .eq("status", "accepted"),
    supabase
      .from("friendships")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "accepted"),
  ]);

  if (followersRes.error) throw followersRes.error;
  if (followingRes.error) throw followingRes.error;

  return {
    followers: followersRes.count ?? 0,
    following: followingRes.count ?? 0,
  };
}

export async function searchProfiles(query: string, excludeUserId: string, limit = 20) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,display_name,avatar_url")
    .ilike("display_name", `%${query}%`)
    .neq("id", excludeUserId)
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function listFriendSummaries(userId: string): Promise<FriendProfileSummary[]> {
  const friendships = await listFriends(userId);
  if (friendships.length === 0) return [];

  const friendProfiles = friendships.map((row: any) => {
    const isRequester = row.user_id === userId;
    const profile = isRequester ? row.friend : row.user;
    return {
      id: String(profile?.id ?? ""),
      display_name: String(profile?.display_name ?? "Athlete"),
      avatar_url: (profile?.avatar_url as string | null) ?? null,
    };
  });

  const friendIds = friendProfiles.map((f) => f.id).filter(Boolean);
  if (friendIds.length === 0) return [];

  const [rankRows, raceRows] = await Promise.all([
    supabase.from("rank_points").select("*").in("user_id", friendIds),
    supabase
      .from("race_goals")
      .select("*")
      .in("user_id", friendIds)
      .order("created_at", { ascending: false }),
  ]);
  if (rankRows.error) throw rankRows.error;
  if (raceRows.error) throw raceRows.error;

  const pointsByUser = new Map<string, DisciplinePoints>();
  for (const id of friendIds) pointsByUser.set(id, { swim: 0, bike: 0, run: 0 });

  for (const row of rankRows.data ?? []) {
    const current = pointsByUser.get(String(row.user_id)) ?? { swim: 0, bike: 0, run: 0 };
    if (row.discipline === "swim") current.swim = row.total_points ?? 0;
    if (row.discipline === "bike") current.bike = row.total_points ?? 0;
    if (row.discipline === "run") current.run = row.total_points ?? 0;
    pointsByUser.set(String(row.user_id), current);
  }

  const latestRaceByUser = new Map<string, string | null>();
  for (const row of raceRows.data ?? []) {
    const uid = String(row.user_id);
    if (!latestRaceByUser.has(uid)) {
      latestRaceByUser.set(uid, (row.event_name ?? row.race_name ?? null) as string | null);
    }
  }

  return friendProfiles.map((profile) => {
    const points = pointsByUser.get(profile.id) ?? { swim: 0, bike: 0, run: 0 };
    const weighted = Math.floor(points.swim * 0.3 + points.bike * 0.4 + points.run * 0.3);
    const rank = getRankForPoints(weighted);
    return {
      id: profile.id,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      overallPoints: weighted,
      rankTier: rank.tier as RankTier,
      rankColor: rank.color,
      targetRaceEventName: latestRaceByUser.get(profile.id) ?? null,
    };
  });
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

// ---------- CHAT ----------
export async function listMessagesBetween(userId: string, friendId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`
    )
    .order("created_at", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: String(row.id),
    senderId: String(row.sender_id),
    receiverId: String(row.receiver_id),
    text: String(row.text ?? ""),
    createdAt: rowDate(row.created_at),
    read: Boolean(row.read),
  }));
}

export async function listConversations(userId: string): Promise<ChatConversation[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const latestByFriend = new Map<string, ChatConversation>();
  for (const row of data ?? []) {
    const senderId = String(row.sender_id);
    const receiverId = String(row.receiver_id);
    const friendId = senderId === userId ? receiverId : senderId;
    const existing = latestByFriend.get(friendId);
    const createdAt = rowDate(row.created_at);
    if (!existing) {
      latestByFriend.set(friendId, {
        friendId,
        friendName: "Athlete",
        friendAvatarUrl: null,
        lastMessage: String(row.text ?? ""),
        lastMessageAt: createdAt,
        unreadCount: receiverId === userId && !row.read ? 1 : 0,
      });
      continue;
    }
    if (receiverId === userId && !row.read) {
      existing.unreadCount += 1;
    }
  }

  return Array.from(latestByFriend.values()).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
}

export async function sendMessage(senderId: string, receiverId: string, text: string): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      text: text.trim(),
      read: false,
    })
    .select()
    .single();
  if (error) throw error;

  return {
    id: String(data.id),
    senderId: String(data.sender_id),
    receiverId: String(data.receiver_id),
    text: String(data.text ?? ""),
    createdAt: rowDate(data.created_at),
    read: Boolean(data.read),
  };
}

export async function markConversationRead(userId: string, friendId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("receiver_id", userId)
    .eq("sender_id", friendId)
    .eq("read", false);
  if (error) throw error;
}

export function subscribeToUserMessages(
  userId: string,
  onInsert: (message: ChatMessage) => void
) {
  return supabase
    .channel(`messages:${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload: any) => {
        const row = payload.new;
        const senderId = String(row.sender_id);
        const receiverId = String(row.receiver_id);
        if (senderId !== userId && receiverId !== userId) return;
        onInsert({
          id: String(row.id),
          senderId,
          receiverId,
          text: String(row.text ?? ""),
          createdAt: rowDate(row.created_at),
          read: Boolean(row.read),
        });
      }
    )
    .subscribe();
}
