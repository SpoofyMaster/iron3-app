import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

const PLANS = [
  {
    id: "weekly",
    name: "Weekly",
    price: "$4.99",
    period: "/week",
    popular: false,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$14.99",
    period: "/month",
    savings: "Save 25%",
    popular: true,
  },
  {
    id: "yearly",
    name: "Annual",
    price: "$99.99",
    period: "/year",
    savings: "Save 62%",
    popular: false,
  },
];

const FREE_FEATURES = [
  { label: "Overall Tri-Rank", included: true },
  { label: "Basic activity tracking", included: true },
  { label: "Weekly summary", included: true },
  { label: "Discipline-specific ranks", included: false },
  { label: "Full leaderboard access", included: false },
  { label: "Rank history & analytics", included: false },
  { label: "Friend challenges", included: false },
  { label: "Personal best tracking", included: false },
];

const PREMIUM_FEATURES = [
  {
    icon: "trophy" as const,
    title: "All Discipline Ranks",
    desc: "Track your swim, bike, and run ranks individually",
    color: colors.primary,
  },
  {
    icon: "podium" as const,
    title: "Full Leaderboards",
    desc: "Global & friends, filter by discipline and age group",
    color: "#FFD700",
  },
  {
    icon: "analytics" as const,
    title: "Rank History",
    desc: "See your progression over time with detailed charts",
    color: colors.swim,
  },
  {
    icon: "people" as const,
    title: "Friend Challenges",
    desc: "Compete head-to-head with friends on any discipline",
    color: colors.run,
  },
  {
    icon: "star" as const,
    title: "Personal Bests",
    desc: "Detailed personal records across all distances",
    color: colors.bike,
  },
  {
    icon: "ribbon" as const,
    title: "Exclusive Badges",
    desc: "Earn special achievement badges and milestones",
    color: colors.rank.Diamond,
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const togglePremium = useAppStore((s) => s.togglePremium);
  const isPremium = useAppStore((s) => s.user.isPremium);

  const handleSubscribe = () => {
    togglePremium();
    Alert.alert(
      isPremium ? "Subscription Cancelled" : "Welcome to Premium!",
      isPremium
        ? "Your premium features will remain active until the end of your billing period."
        : "You now have access to all Iron3 features. Train hard!",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Iron3 Premium</Text>
        <View style={styles.closeButton} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.diamondContainer}>
            <View style={styles.diamondGlow}>
              <Ionicons name="diamond" size={48} color="#FFD700" />
            </View>
          </View>
          <Text style={styles.title}>Unlock Your Full Potential</Text>
          <Text style={styles.subtitle}>
            Get discipline-specific rankings, full leaderboard access, and
            exclusive training insights.
          </Text>
        </View>

        <View style={styles.premiumFeatures}>
          {PREMIUM_FEATURES.map((feat, i) => (
            <View key={i} style={styles.premiumFeatureRow}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: feat.color + "15" },
                ]}
              >
                <Ionicons name={feat.icon} size={22} color={feat.color} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.plansSection}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.7}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <GlassCard
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardActive,
                  plan.popular && selectedPlan === plan.id && styles.planCardPopular,
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>BEST VALUE</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <View style={styles.planInfo}>
                    <View
                      style={[
                        styles.planRadio,
                        selectedPlan === plan.id && styles.planRadioActive,
                      ]}
                    >
                      {selectedPlan === plan.id && (
                        <View style={styles.planRadioDot} />
                      )}
                    </View>
                    <View>
                      <Text style={styles.planName}>{plan.name}</Text>
                      {plan.savings && (
                        <Text style={styles.planSavings}>{plan.savings}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.planPricing}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>Free vs Premium</Text>
          {FREE_FEATURES.map((feat, i) => (
            <View key={i} style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>{feat.label}</Text>
              <View style={styles.comparisonIcons}>
                <Ionicons
                  name={feat.included ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={feat.included ? colors.success : colors.textMuted}
                />
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.success}
                />
              </View>
            </View>
          ))}
          <View style={styles.comparisonHeader}>
            <View style={{ flex: 1 }} />
            <Text style={styles.comparisonHeaderText}>Free</Text>
            <Text style={[styles.comparisonHeaderText, { color: "#FFD700" }]}>
              Pro
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          activeOpacity={0.8}
        >
          <Ionicons name="diamond" size={20} color="#fff" />
          <Text style={styles.subscribeText}>
            {isPremium ? "Manage Subscription" : "Start Free Trial"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.legalText}>
          7-day free trial, then{" "}
          {PLANS.find((p) => p.id === selectedPlan)?.price}
          {PLANS.find((p) => p.id === selectedPlan)?.period}. Cancel anytime.
          {"\n"}By subscribing, you agree to our Terms of Service and Privacy
          Policy.
        </Text>

        <TouchableOpacity style={styles.restoreButton} activeOpacity={0.7}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
  diamondContainer: {
    marginBottom: 8,
  },
  diamondGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 215, 0, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.15)",
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  premiumFeatures: {
    gap: 14,
  },
  premiumFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  featureDesc: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  plansSection: {
    gap: 10,
  },
  planCard: {
    paddingVertical: 16,
    position: "relative",
    overflow: "visible",
  },
  planCardActive: {
    borderColor: colors.primary + "40",
    backgroundColor: colors.primary + "08",
  },
  planCardPopular: {
    borderColor: "#FFD700" + "40",
    backgroundColor: "rgba(255, 215, 0, 0.04)",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  popularText: {
    color: "#000",
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  planRadioActive: {
    borderColor: colors.primary,
  },
  planRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  planName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  planSavings: {
    color: colors.success,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  planPricing: {
    alignItems: "flex-end",
  },
  planPrice: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  planPeriod: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  comparisonSection: {
    gap: 10,
  },
  comparisonTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  comparisonLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  comparisonIcons: {
    flexDirection: "row",
    gap: 24,
  },
  comparisonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: -4,
    paddingRight: 2,
  },
  comparisonHeaderText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    width: 28,
    textAlign: "center",
  },
  subscribeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: borderRadius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  subscribeText: {
    color: "#fff",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  legalText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
    lineHeight: 18,
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  restoreText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
