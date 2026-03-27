import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, RankBadge, MiniChart, SectionHeader, LevelStreakBar } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { formatPoints, getTriRank } from "@/lib/ranks";
import { signOut } from "@/lib/auth";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const WEEKLY_DISTANCES = [
  { week: "W1", distance: 18.4 },
  { week: "W2", distance: 22.1 },
  { week: "W3", distance: 31.5 },
  { week: "W4", distance: 25.8 },
  { week: "W5", distance: 19.2 },
  { week: "W6", distance: 28.7 },
  { week: "W7", distance: 33.1 },
  { week: "W8", distance: 28.73 },
];

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);
  const triRank = useMemo(() => getTriRank(swimPoints, bikePoints, runPoints), [swimPoints, bikePoints, runPoints]);
  const rankHistory = useAppStore((s) => s.rankHistory);
  const activities = useAppStore((s) => s.activities);
  const togglePremium = useAppStore((s) => s.togglePremium);
  const socialProfile = useAppStore((s) => s.socialProfile);

  const overallHistory = rankHistory.map((h) => h.overallPoints);
  const historyLabels = rankHistory.map((h) =>
    new Date(h.date).toLocaleDateString("en-US", { month: "short" })
  );

  const recentRuns = useMemo(
    () => activities.filter((a) => a.discipline === "run").slice(0, 3),
    [activities]
  );

  const maxDist = Math.max(...WEEKLY_DISTANCES.map((w) => w.distance));

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekLabel = `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <SafeAreaView style={styles.safe}>
      <LevelStreakBar />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { borderColor: triRank.tierColor }]}>
                <Text style={styles.avatarText}>
                  {user.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.rankBadgeOverlay}>
                <RankBadge
                  tier={triRank.tier}
                  tierColor={triRank.tierColor}
                  size="sm"
                />
              </View>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.displayName}</Text>
            <Text style={styles.followers}>
              <Text style={styles.followersBold}>{socialProfile.followers}</Text> followers  
              <Text style={styles.followersBold}> {socialProfile.following}</Text> following
            </Text>
            <Text style={styles.bio}>{socialProfile.bio}</Text>
          </View>
          <View style={styles.rankEmblem}>
            <RankBadge tier={triRank.tier} tierColor={triRank.tierColor} size="lg" />
            <Text style={[styles.rankText, { color: triRank.tierColor }]}>
              {triRank.tier}
            </Text>
          </View>
        </View>

        {/* Week Header */}
        <View style={styles.weekHeader}>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* 2x2 Stat Cards */}
        <View style={styles.statGrid}>
          <GlassCard style={styles.statGridCard}>
            <Text style={styles.statGridValue}>{socialProfile.weeklyDistance.toFixed(2)} km</Text>
            <Text style={styles.statGridLabel}>Distance</Text>
          </GlassCard>
          <GlassCard style={styles.statGridCard}>
            <Text style={styles.statGridValue}>
              {Math.floor(socialProfile.weeklyTime / 60)}h {socialProfile.weeklyTime % 60}m
            </Text>
            <Text style={styles.statGridLabel}>Time</Text>
          </GlassCard>
          <GlassCard style={styles.statGridCard}>
            <Text style={styles.statGridValue}>{socialProfile.weeklyElevation}m</Text>
            <Text style={styles.statGridLabel}>Elevation</Text>
          </GlassCard>
          <GlassCard style={styles.statGridCard}>
            <Text style={[styles.statGridValue, { color: colors.success }]}>+{socialProfile.rrChange}</Text>
            <Text style={styles.statGridLabel}>RR Change</Text>
          </GlassCard>
        </View>

        {/* Weekly Distance Chart */}
        <SectionHeader title="Activity" />
        <GlassCard>
          <View style={styles.chartContainer}>
            {WEEKLY_DISTANCES.map((w, idx) => {
              const barHeight = (w.distance / maxDist) * 80;
              return (
                <View key={idx} style={styles.chartBar}>
                  <View style={[styles.chartBarFill, { height: barHeight, backgroundColor: colors.glowCyan }]} />
                  <Text style={styles.chartLabel}>{w.week}</Text>
                </View>
              );
            })}
          </View>
        </GlassCard>

        {/* Recent Runs */}
        <SectionHeader title="Recent Runs" />
        {recentRuns.map((run) => {
          const paceMin = Math.floor(run.pace / 60);
          const paceSec = Math.floor(run.pace % 60);
          return (
            <TouchableOpacity
              key={run.id}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: "/workout/[id]", params: { id: run.id } })}
            >
              <GlassCard style={styles.recentRunCard}>
                <View style={styles.recentRunRow}>
                  <View style={styles.recentRunInfo}>
                    <Text style={styles.recentRunTitle}>{run.title}</Text>
                    <Text style={styles.recentRunStats}>
                      {run.distance} mi • {paceMin}:{paceSec.toString().padStart(2, "0")} mi pace • {Math.floor(run.duration / 60)}:{(run.duration % 60).toString().padStart(2, "0")}
                    </Text>
                  </View>
                  <View style={styles.recentRunPoints}>
                    <Text style={styles.recentRunRR}>+ {run.pointsEarned} RR</Text>
                    <Text style={styles.recentRunGained}>Gained</Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          );
        })}

        {/* Rank History */}
        <SectionHeader title="Rank History" />
        <GlassCard>
          <MiniChart
            data={overallHistory}
            labels={historyLabels}
            color={colors.primary}
            height={160}
            title="Overall Tri-Rank Progression"
          />
        </GlassCard>

        <SectionHeader title="Settings" />
        <GlassCard style={styles.settingsCard}>
          <SettingsRow
            icon="person-outline"
            label="Edit Profile"
            onPress={() => {}}
          />
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            onPress={() => {}}
          />
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="fitness-outline"
            label="Connected Devices"
            onPress={() => router.push("/settings/devices")}
          />
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="calendar-outline"
            label="Training Availability"
            onPress={() => router.push("/settings/availability")}
          />
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="analytics-outline"
            label="Units & Preferences"
            onPress={() => {}}
          />
          <View style={styles.settingsDivider} />
          <View style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <Ionicons
                name="diamond-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.settingsLabel}>Premium Status</Text>
            </View>
            <Switch
              value={user.isPremium}
              onValueChange={togglePremium}
              trackColor={{
                false: colors.surfaceLight,
                true: colors.primary + "60",
              }}
              thumbColor={user.isPremium ? colors.primary : colors.textMuted}
            />
          </View>
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="card-outline"
            label="Manage Subscription"
            onPress={() => router.push("/paywall")}
          />
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="log-out-outline"
            label="Sign Out"
            color={colors.error}
            onPress={() =>
              Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Out",
                  style: "destructive",
                  onPress: async () => {
                    await signOut();
                    useAppStore.getState().setAuth(false);
                  },
                },
              ])
            }
          />
        </GlassCard>

        <Text style={styles.version}>Iron3 v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  label,
  onPress,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={color ?? colors.textSecondary}
        />
        <Text style={[styles.settingsLabel, color ? { color } : undefined]}>
          {label}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 32,
    gap: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginTop: 8,
  },
  avatarSection: {},
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.text,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  rankBadgeOverlay: {
    position: "absolute",
    bottom: -4,
    right: -4,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  followers: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  followersBold: {
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
  bio: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 16,
    marginTop: 2,
  },
  rankEmblem: {
    alignItems: "center",
    gap: 4,
  },
  rankText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weekLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  viewAll: {
    color: colors.glowCyan,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statGridCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - 10) / 2,
    alignItems: "center",
    paddingVertical: 14,
    gap: 4,
  },
  statGridValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statGridLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 100,
    paddingTop: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  chartBarFill: {
    width: "70%",
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    color: colors.textMuted,
    fontSize: 9,
  },
  recentRunCard: {
    paddingVertical: 12,
  },
  recentRunRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recentRunInfo: {
    flex: 1,
    gap: 2,
  },
  recentRunTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  recentRunStats: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  recentRunPoints: {
    alignItems: "flex-end",
    gap: 1,
  },
  recentRunRR: {
    color: colors.success,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  recentRunGained: {
    color: colors.textMuted,
    fontSize: 10,
  },
  settingsCard: {
    padding: 0,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
    marginHorizontal: 16,
  },
  version: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: 8,
  },
});
