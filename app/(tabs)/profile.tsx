import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, RankBadge, MiniChart, SectionHeader } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { formatPoints } from "@/lib/ranks";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const triRank = useAppStore((s) => s.getTriRank());
  const rankHistory = useAppStore((s) => s.rankHistory);
  const activities = useAppStore((s) => s.activities);
  const togglePremium = useAppStore((s) => s.togglePremium);

  const overallHistory = rankHistory.map((h) => h.overallPoints);
  const historyLabels = rankHistory.map((h) =>
    new Date(h.date).toLocaleDateString("en-US", { month: "short" })
  );

  const totalActivities = activities.length;
  const totalPoints = activities.reduce((sum, a) => sum + a.pointsEarned, 0);
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
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
          <Text style={styles.name}>{user.displayName}</Text>
          <Text style={[styles.rankText, { color: triRank.tierColor }]}>
            {triRank.tier} • {formatPoints(triRank.overallPoints)} pts
          </Text>
          <Text style={styles.memberSince}>Member since {memberSince}</Text>
        </View>

        <View style={styles.statsRow}>
          <GlassCard style={styles.statItem}>
            <Text style={styles.statValue}>{totalActivities}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </GlassCard>
          <GlassCard style={styles.statItem}>
            <Text style={styles.statValue}>{formatPoints(totalPoints)}</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </GlassCard>
          <GlassCard style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Disciplines</Text>
          </GlassCard>
        </View>

        <View style={styles.rankCards}>
          {[triRank.swimRank, triRank.bikeRank, triRank.runRank].map((r) => (
            <GlassCard key={r.discipline} style={styles.miniRankCard}>
              <View
                style={[
                  styles.miniRankDot,
                  { backgroundColor: r.tierColor },
                ]}
              />
              <Text style={styles.miniRankDiscipline}>
                {r.discipline.charAt(0).toUpperCase() + r.discipline.slice(1)}
              </Text>
              <Text style={[styles.miniRankTier, { color: r.tierColor }]}>
                {r.tier}
              </Text>
              <Text style={styles.miniRankPoints}>
                {formatPoints(r.points)}
              </Text>
            </GlassCard>
          ))}
        </View>

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
          <View style={styles.divider} />
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="fitness-outline"
            label="Health Data"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="analytics-outline"
            label="Units & Preferences"
            onPress={() => {}}
          />
          <View style={styles.divider} />
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
          <View style={styles.divider} />
          <SettingsRow
            icon="card-outline"
            label="Manage Subscription"
            onPress={() => router.push("/paywall")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="log-out-outline"
            label="Sign Out"
            color={colors.error}
            onPress={() =>
              Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", style: "destructive" },
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
    gap: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 8,
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
  name: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  rankText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  memberSince: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    gap: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
  },
  rankCards: {
    flexDirection: "row",
    gap: 10,
  },
  miniRankCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    gap: 4,
  },
  miniRankDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  miniRankDiscipline: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  miniRankTier: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  miniRankPoints: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
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
  divider: {
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
