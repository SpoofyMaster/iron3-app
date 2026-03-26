import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import {
  TriRankDisplay,
  DisciplineCard,
  SectionHeader,
  ActivityRow,
  StatCard,
  GlassCard,
  PremiumBanner,
} from "@/components";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { formatDistance } from "@/lib/scoring";

export default function HomeScreen() {
  const router = useRouter();
  const triRank = useAppStore((s) => s.getTriRank());
  const activities = useAppStore((s) => s.activities);
  const weeklyStats = useAppStore((s) => s.weeklyStats);
  const isPremium = useAppStore((s) => s.user.isPremium);
  const displayName = useAppStore((s) => s.user.displayName);

  const recentActivities = activities.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{displayName}</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Iron3</Text>
          </View>
        </View>

        <TriRankDisplay triRank={triRank} />

        <View style={styles.weeklyRow}>
          <StatCard
            icon="flame"
            iconColor={colors.error}
            label="Activities"
            value={String(weeklyStats.totalActivities)}
            subtitle="This week"
          />
          <StatCard
            icon="trending-up"
            iconColor={colors.success}
            label="Points"
            value={String(weeklyStats.totalPoints)}
            subtitle="This week"
          />
        </View>

        <View style={styles.weeklyRow}>
          <StatCard
            icon="water"
            iconColor={colors.swim}
            label="Swim"
            value={formatDistance("swim", weeklyStats.swimDistance)}
          />
          <StatCard
            icon="bicycle"
            iconColor={colors.bike}
            label="Bike"
            value={formatDistance("bike", weeklyStats.bikeDistance)}
          />
          <StatCard
            icon="walk"
            iconColor={colors.run}
            label="Run"
            value={formatDistance("run", weeklyStats.runDistance)}
          />
        </View>

        {!isPremium && <PremiumBanner />}

        <SectionHeader title="Discipline Ranks" />
        <View style={styles.disciplineCards}>
          <DisciplineCard
            rank={triRank.swimRank}
            onPress={() => router.push("/(tabs)/swim")}
          />
          <DisciplineCard
            rank={triRank.bikeRank}
            onPress={() => router.push("/(tabs)/bike")}
          />
          <DisciplineCard
            rank={triRank.runRank}
            onPress={() => router.push("/(tabs)/run")}
          />
        </View>

        <SectionHeader title="Recent Activities" />
        <GlassCard>
          {recentActivities.map((activity, idx) => (
            <View key={activity.id}>
              <ActivityRow activity={activity} />
              {idx < recentActivities.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: colors.primary + "15",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  headerBadgeText: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  weeklyRow: {
    flexDirection: "row",
    gap: 10,
  },
  disciplineCards: {
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
});
