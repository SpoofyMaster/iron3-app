import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GlassCard, SectionHeader } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

interface NotifSetting {
  key: string;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const WORKOUT_NOTIFS: NotifSetting[] = [
  { key: "workout_reminder", label: "Workout Reminders", description: "Daily training reminders based on your plan", icon: "fitness-outline" },
  { key: "streak_alert", label: "Streak Alerts", description: "Get notified when your streak is about to break", icon: "flame-outline" },
  { key: "rest_day", label: "Rest Day Reminders", description: "Reminders to take recovery days", icon: "bed-outline" },
];

const SOCIAL_NOTIFS: NotifSetting[] = [
  { key: "friend_activity", label: "Friend Activity", description: "When friends log workouts or hit milestones", icon: "people-outline" },
  { key: "leaderboard_changes", label: "Rank Changes", description: "When your leaderboard position changes", icon: "trophy-outline" },
  { key: "friend_requests", label: "Friend Requests", description: "New friend request notifications", icon: "person-add-outline" },
];

const RACE_NOTIFS: NotifSetting[] = [
  { key: "race_countdown", label: "Race Countdown", description: "Weekly countdown to your target race", icon: "flag-outline" },
  { key: "milestone_achieved", label: "Milestone Alerts", description: "When you unlock new milestones", icon: "medal-outline" },
  { key: "pb_alert", label: "Personal Best", description: "When you set a new personal best", icon: "ribbon-outline" },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    workout_reminder: true,
    streak_alert: true,
    rest_day: false,
    friend_activity: true,
    leaderboard_changes: true,
    friend_requests: true,
    race_countdown: true,
    milestone_achieved: true,
    pb_alert: true,
  });

  const toggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSection = (title: string, items: NotifSetting[]) => (
    <>
      <SectionHeader title={title} />
      <GlassCard style={styles.card}>
        {items.map((item, idx) => (
          <View key={item.key}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <Switch
                value={settings[item.key]}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: colors.surfaceLight, true: colors.primary + "60" }}
                thumbColor={settings[item.key] ? colors.primary : colors.textMuted}
              />
            </View>
            {idx < items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </GlassCard>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection("Training", WORKOUT_NOTIFS)}
        {renderSection("Social", SOCIAL_NOTIFS)}
        {renderSection("Goals & Milestones", RACE_NOTIFS)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  title: { color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  container: { flex: 1 },
  content: { padding: spacing.lg, gap: 12, paddingBottom: 40 },
  card: { padding: 0, overflow: "hidden" },
  row: {
    flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, gap: 12,
  },
  iconContainer: { width: 28, alignItems: "center" },
  info: { flex: 1, gap: 2 },
  label: { color: colors.text, fontSize: fontSize.md, fontWeight: fontWeight.medium },
  description: { color: colors.textMuted, fontSize: fontSize.xs },
  divider: { height: 1, backgroundColor: colors.surfaceGlassBorder, marginHorizontal: 16 },
});
