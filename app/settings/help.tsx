import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GlassCard } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

interface HelpItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  action: () => void;
}

export default function HelpScreen() {
  const router = useRouter();

  const helpItems: HelpItem[] = [
    {
      icon: "chatbubbles-outline",
      label: "Contact Support",
      description: "Get help from our team",
      action: () => Linking.openURL("mailto:support@iron3.app"),
    },
    {
      icon: "book-outline",
      label: "FAQ",
      description: "Frequently asked questions",
      action: () => Linking.openURL("https://iron3.app/faq"),
    },
    {
      icon: "videocam-outline",
      label: "Video Tutorials",
      description: "Learn how to use Iron3",
      action: () => Linking.openURL("https://iron3.app/tutorials"),
    },
    {
      icon: "bug-outline",
      label: "Report a Bug",
      description: "Help us improve the app",
      action: () => Linking.openURL("mailto:bugs@iron3.app?subject=Bug Report"),
    },
    {
      icon: "star-outline",
      label: "Rate Iron3",
      description: "Leave a review on the App Store",
      action: () => {},
    },
    {
      icon: "logo-instagram",
      label: "Follow us",
      description: "@iron3app on Instagram",
      action: () => Linking.openURL("https://instagram.com/iron3app"),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.card}>
          {helpItems.map((item, idx) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.row} onPress={item.action} activeOpacity={0.7}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {idx < helpItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </GlassCard>

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Iron3 v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for triathletes</Text>
        </View>
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
  content: { padding: spacing.lg, gap: 20, paddingBottom: 40 },
  card: { padding: 0, overflow: "hidden" },
  row: {
    flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, gap: 12,
  },
  iconContainer: { width: 28, alignItems: "center" },
  info: { flex: 1, gap: 2 },
  label: { color: colors.text, fontSize: fontSize.md, fontWeight: fontWeight.medium },
  description: { color: colors.textMuted, fontSize: fontSize.xs },
  divider: { height: 1, backgroundColor: colors.surfaceGlassBorder, marginHorizontal: 16 },
  versionSection: { alignItems: "center", gap: 4, paddingTop: 16 },
  versionText: { color: colors.textMuted, fontSize: fontSize.sm },
  versionSubtext: { color: colors.textMuted, fontSize: fontSize.xs },
});
