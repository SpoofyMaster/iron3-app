import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GlassCard, RankBadge, SectionHeader } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import {
  listActivities,
  listWorkoutLogs,
  getLatestRaceGoalEvent,
  getAthleteSummary,
  getFollowCounts,
  sendFriendRequest,
} from "@/lib/dataService";
import { FriendProfileSummary } from "@/types";

type FriendActivity = {
  id: string;
  title: string;
  discipline: string;
  distance: number;
  points_earned: number;
  date: string;
};

type FriendWorkout = {
  id: string;
  discipline: string;
  workout_type: string;
  duration: number;
  points_earned: number;
  date: string;
};

export default function FriendProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const friendProfiles = useAppStore((s) => s.friendProfiles);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const refreshFriends = useAppStore((s) => s.refreshFriends);

  const friend = useMemo(() => friendProfiles.find((item) => item.id === id), [friendProfiles, id]);
  const [athlete, setAthlete] = useState<FriendProfileSummary | null>(friend ?? null);
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [workouts, setWorkouts] = useState<FriendWorkout[]>([]);
  const [targetRace, setTargetRace] = useState<string | null>(friend?.targetRaceEventName ?? null);
  const [followCounts, setFollowCounts] = useState<{ followers: number; following: number } | null>(null);
  const [followRequested, setFollowRequested] = useState(false);
  const [sendingFollow, setSendingFollow] = useState(false);
  const [loading, setLoading] = useState(true);

  const isSelf = !!id && id === currentUserId;
  const isFollowing = !!friend;

  useEffect(() => {
    if (friend) {
      setAthlete(friend);
      setTargetRace(friend.targetRaceEventName ?? null);
    }
  }, [friend]);

  useEffect(() => {
    const loadAthleteSummary = async () => {
      if (!id) return;
      try {
        const summary = await getAthleteSummary(id);
        if (!summary) return;
        setAthlete({
          id: summary.id,
          displayName: summary.displayName,
          avatarUrl: summary.avatarUrl,
          overallPoints: summary.overallPoints,
          rankTier: summary.rankTier,
          rankColor: summary.rankColor,
          targetRaceEventName: summary.targetRaceEventName,
        });
      } catch (error) {
        console.error("Failed to load athlete summary:", error);
      }
    };
    loadAthleteSummary();
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [actRows, workoutRows, raceGoal, counts] = await Promise.all([
          listActivities(id, { limit: 12 }),
          listWorkoutLogs(id, { limit: 8 }),
          getLatestRaceGoalEvent(id),
          getFollowCounts(id),
        ]);
        setActivities(actRows as FriendActivity[]);
        setWorkouts(workoutRows as FriendWorkout[]);
        setTargetRace(raceGoal?.event_name ?? raceGoal?.event_id ?? raceGoal?.event_date ?? null);
        setFollowCounts(counts);
      } catch (error) {
        console.error("Failed to load friend profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const personalRecords = useMemo(() => {
    const byDiscipline = ["swim", "bike", "run"].map((discipline) => {
      const entries = activities.filter((activity) => activity.discipline === discipline);
      const top = entries.reduce<FriendActivity | null>((best, current) => {
        if (!best) return current;
        return current.points_earned > best.points_earned ? current : best;
      }, null);
      return { discipline, top };
    });
    return byDiscipline;
  }, [activities]);

  const handleFollow = async () => {
    if (!currentUserId || !id || isSelf || isFollowing || followRequested || sendingFollow) return;
    setSendingFollow(true);
    try {
      await sendFriendRequest(currentUserId, id);
      await refreshFriends(currentUserId);
      setFollowRequested(true);
    } catch (error) {
      console.error("Failed to follow athlete:", error);
    } finally {
      setSendingFollow(false);
    }
  };

  if (!athlete) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Athlete profile not found.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/chat/${athlete.id}` as never)}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.profileCard} variant="highlighted">
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{athlete.displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{athlete.displayName}</Text>
          <RankBadge tier={athlete.rankTier} tierColor={athlete.rankColor} size="md" />
          <View style={styles.followCountsRow}>
            <Text style={styles.followCountText}>
              <Text style={styles.followCountValue}>{followCounts?.followers ?? 0}</Text> Followers
            </Text>
            <Text style={styles.followCountText}>
              <Text style={styles.followCountValue}>{followCounts?.following ?? 0}</Text> Following
            </Text>
          </View>
          <Text style={styles.rankPoints}>{athlete.overallPoints.toLocaleString()} RP</Text>
          <Text style={styles.targetRaceLabel}>
            {targetRace ? `Target race: ${targetRace}` : "No target race selected"}
          </Text>
          {!isSelf ? (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  (isFollowing || followRequested) && styles.actionBtnDisabled,
                ]}
                onPress={handleFollow}
                activeOpacity={0.8}
                disabled={isFollowing || followRequested || sendingFollow}
              >
                <Text style={styles.actionBtnText}>
                  {isFollowing ? "FOLLOWING" : followRequested ? "REQUESTED" : sendingFollow ? "SENDING..." : "FOLLOW"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.messageBtn}
                onPress={() => router.push(`/chat/${athlete.id}` as never)}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.text} />
                <Text style={styles.messageBtnText}>MESSAGE</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </GlassCard>

        <SectionHeader title="Performance Stats" />
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{activities.length}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>
              {Math.round(workouts.reduce((sum, workout) => sum + workout.duration, 0) / 60)}
            </Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>
              {activities.reduce((sum, activity) => sum + activity.points_earned, 0)}
            </Text>
            <Text style={styles.statLabel}>XP</Text>
          </GlassCard>
        </View>

        <SectionHeader title="Personal Records" />
        <GlassCard>
          {personalRecords.map((record, index) => (
            <View key={record.discipline}>
              <View style={styles.recordRow}>
                <Text style={styles.recordDiscipline}>{record.discipline.toUpperCase()}</Text>
                <Text style={styles.recordValue}>
                  {record.top ? `${record.top.points_earned} XP • ${record.top.distance}` : "No records yet"}
                </Text>
              </View>
              {index < personalRecords.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </GlassCard>

        <SectionHeader title="Recent Workout Activity" />
        <GlassCard>
          {loading ? (
            <Text style={styles.mutedText}>Loading activity...</Text>
          ) : workouts.length === 0 ? (
            <Text style={styles.mutedText}>No recent workouts logged.</Text>
          ) : (
            workouts.map((workout, index) => (
              <View key={workout.id}>
                <View style={styles.workoutRow}>
                  <View>
                    <Text style={styles.workoutTitle}>
                      {workout.discipline.toUpperCase()} • {workout.workout_type.replace(/_/g, " ")}
                    </Text>
                    <Text style={styles.workoutMeta}>
                      {Math.round(workout.duration / 60)} min • {new Date(workout.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.workoutPoints}>+{workout.points_earned}</Text>
                </View>
                {index < workouts.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))
          )}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: 16, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  profileCard: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  avatarText: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  followCountsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  followCountText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  followCountValue: {
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
  rankPoints: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  targetRaceLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    width: "100%",
    justifyContent: "center",
  },
  actionBtn: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary + "60",
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 104,
    alignItems: "center",
  },
  actionBtnDisabled: {
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  actionBtnText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.6,
  },
  messageBtn: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 104,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  messageBtnText: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  recordDiscipline: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  recordValue: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  workoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  workoutTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  workoutMeta: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  workoutPoints: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  mutedText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: 12,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
