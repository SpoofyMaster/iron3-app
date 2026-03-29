import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GlassCard, SectionHeader } from "@/components";
import { colors, fontSize, fontWeight, spacing } from "@/theme";

const SECTIONS = [
  {
    title: "Data We Collect",
    content:
      "Iron3 collects your workout data (activities, distances, durations, pace), profile information (name, email, avatar), and device data for the purpose of providing training insights and leaderboard rankings. We use this data to personalize your experience and improve our service.",
  },
  {
    title: "How We Use Your Data",
    content:
      "Your data is used to calculate rank points, generate leaderboard positions, track personal bests, and provide personalized training plans. Workout data is displayed to other users only through the leaderboard (display name and rank points). Your email and personal details are never shared publicly.",
  },
  {
    title: "Third-Party Integrations",
    content:
      "When you connect Apple Health, Garmin, or Strava, we import workout data from those services. We only read workout data — we do not write to or modify data in those services. You can disconnect integrations at any time from Settings > Connected Devices.",
  },
  {
    title: "Data Storage & Security",
    content:
      "Your data is stored securely on Supabase infrastructure with row-level security policies. All data transmission is encrypted via HTTPS/TLS. Profile photos are stored in a secure cloud storage bucket.",
  },
  {
    title: "Your Rights",
    content:
      "You can request a copy of your data or request account deletion at any time by contacting support@iron3.app. Account deletion will permanently remove all your data including workouts, rank history, and profile information.",
  },
  {
    title: "Contact",
    content:
      "For privacy-related inquiries, contact us at privacy@iron3.app. We respond to all requests within 30 days.",
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: March 2026</Text>

        {SECTIONS.map((section) => (
          <View key={section.title}>
            <SectionHeader title={section.title} />
            <GlassCard>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </GlassCard>
          </View>
        ))}
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
  lastUpdated: { color: colors.textMuted, fontSize: fontSize.xs, textAlign: "center", marginBottom: 4 },
  sectionContent: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 22 },
});
