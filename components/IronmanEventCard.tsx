import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { IronmanEvent, daysUntil, formatEventDate } from "@/lib/ironmanEvents";

interface Props {
  event: IronmanEvent;
  compact?: boolean;
  onPress?: () => void;
}

export function IronmanEventCard({ event, compact = false, onPress }: Props) {
  const days = daysUntil(event.date);
  const isPast = days < 0;
  const isUrgent = days <= 30 && days >= 0;
  const isSoon = days <= 90 && days > 30;

  const urgencyColor = isPast
    ? colors.textMuted
    : isUrgent
    ? colors.primary
    : isSoon
    ? colors.run
    : colors.swim;

  if (compact) {
    return (
      <TouchableOpacity style={styles.compact} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.compactLeft}>
          <Text style={styles.flag}>{event.flag}</Text>
          <View>
            <Text style={styles.compactName} numberOfLines={1}>{event.name}</Text>
            <Text style={styles.compactLocation}>{event.location}, {event.country}</Text>
          </View>
        </View>
        <View style={styles.compactRight}>
          <View style={[styles.distanceBadge, { borderColor: event.distance === "Full" ? colors.primary : colors.swim }]}>
            <Text style={[styles.distanceText, { color: event.distance === "Full" ? colors.primary : colors.swim }]}>
              {event.distance === "Full" ? "FULL" : "70.3"}
            </Text>
          </View>
          <Text style={[styles.compactDays, { color: urgencyColor }]}>
            {isPast ? "Past" : days === 0 ? "TODAY" : `${days}d`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {event.isWorldChampionship && (
        <View style={styles.champBadge}>
          <Ionicons name="trophy" size={10} color="#FFD700" />
          <Text style={styles.champText}>WORLD CHAMPIONSHIP</Text>
        </View>
      )}
      <View style={styles.cardHeader}>
        <Text style={styles.flag}>{event.flag}</Text>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardName} numberOfLines={2}>{event.name}</Text>
          <Text style={styles.cardLocation}>
            <Ionicons name="location-outline" size={11} color={colors.textMuted} /> {event.location}, {event.country}
          </Text>
        </View>
        <View style={[styles.distanceBadge, { borderColor: event.distance === "Full" ? colors.primary : colors.swim }]}>
          <Text style={[styles.distanceText, { color: event.distance === "Full" ? colors.primary : colors.swim }]}>
            {event.distance === "Full" ? "FULL" : "70.3"}
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
          <Text style={styles.dateText}>{formatEventDate(event.date)}</Text>
        </View>
        <View style={[styles.countdownBadge, { backgroundColor: `${urgencyColor}18`, borderColor: `${urgencyColor}40` }]}>
          <Text style={[styles.countdownText, { color: urgencyColor }]}>
            {isPast ? "Completed" : days === 0 ? "🔥 TODAY" : `${days} days`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  champBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 215, 0, 0.12)",
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  champText: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
    color: "#FFD700",
    letterSpacing: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  flag: {
    fontSize: 28,
    lineHeight: 34,
  },
  cardTitleBlock: { flex: 1 },
  cardName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    lineHeight: 20,
  },
  cardLocation: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  distanceBadge: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  distanceText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceGlassBorder,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  countdownBadge: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countdownText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  // Compact styles
  compact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  compactLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  compactName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  compactLocation: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  compactRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  compactDays: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
