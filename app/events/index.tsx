import React, { useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { IRONMAN_EVENTS_2026, getUpcomingEvents, daysUntil, formatEventDate, IronmanEvent } from "@/lib/ironmanEvents";
import { IronmanEventCard } from "@/components/IronmanEventCard";
import { SelectRaceModal } from "@/components/SelectRaceModal";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";

export default function EventsScreen() {
  const router = useRouter();
  const { selectedRaceEvent } = useAppStore();
  const [filter, setFilter] = useState<"all" | "70.3" | "Full">("all");
  const [search, setSearch] = useState("");
  const [modalEvent, setModalEvent] = useState<IronmanEvent | null>(null);

  const filtered = IRONMAN_EVENTS_2026
    .filter(e => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const [y, m, d] = e.date.split("-").map(Number);
      const eventDate = new Date(y, m - 1, d);
      const upcoming = eventDate >= today;
      const matchDist = filter === "all" || e.distance === filter;
      const matchSearch = search === "" ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        e.country.toLowerCase().includes(search.toLowerCase());
      return upcoming && matchDist && matchSearch;
    })
    .sort((a, b) => {
      const [ay, am, ad] = a.date.split("-").map(Number);
      const [by, bm, bd] = b.date.split("-").map(Number);
      return new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime();
    });

  const nextEvent = getUpcomingEvents(1)[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Race Calendar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Next Event Hero */}
        {nextEvent && (
          <LinearGradient
            colors={["#1a0a05", "#0A0A0F"]}
            style={styles.heroCard}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroBadge}>
                <Ionicons name="flag" size={12} color={colors.primary} />
                <Text style={styles.heroBadgeText}>NEXT RACE</Text>
              </View>
              <Text style={styles.heroFlag}>{nextEvent.flag}</Text>
            </View>
            <Text style={styles.heroName}>{nextEvent.name}</Text>
            <Text style={styles.heroLocation}>
              <Ionicons name="location" size={13} color={colors.textMuted} /> {nextEvent.location}, {nextEvent.country}
            </Text>
            <View style={styles.heroFooter}>
              <View style={styles.heroDays}>
                <Text style={styles.heroDaysNum}>{daysUntil(nextEvent.date)}</Text>
                <Text style={styles.heroDaysLabel}>days away</Text>
              </View>
              {nextEvent.isWorldChampionship && (
                <View style={styles.worldChampBadge}>
                  <Ionicons name="trophy" size={13} color="#FFD700" />
                  <Text style={styles.worldChampText}>World Championship</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        )}

        <View style={styles.body}>
          {/* Search */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Filter chips */}
          <View style={styles.chips}>
            {(["all", "70.3", "Full"] as const).map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.chip, filter === f && styles.chipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                  {f === "all" ? "All Events" : f === "Full" ? "Full IRONMAN" : "70.3"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.count}>{filtered.length} upcoming events</Text>

          {/* Events List */}
          {filtered.map(event => {
            const isSelected = selectedRaceEvent?.id === event.id;
            return (
              <View key={event.id}>
                <IronmanEventCard event={event} />
                <TouchableOpacity
                  style={[styles.selectBtn, isSelected && styles.selectBtnActive]}
                  onPress={() => setModalEvent(event)}
                >
                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "flag-outline"}
                    size={15}
                    color={isSelected ? "#10B981" : colors.primary}
                  />
                  <Text style={[styles.selectBtnText, isSelected && styles.selectBtnTextActive]}>
                    {isSelected ? "YOUR GOAL RACE ✓" : "Set as Goal Race"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      <SelectRaceModal
        event={modalEvent}
        visible={!!modalEvent}
        onClose={() => setModalEvent(null)}
      />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceGlassBorder,
  },
  backBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  heroCard: {
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    padding: spacing.xl,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${colors.primary}18`,
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  heroFlag: { fontSize: 36 },
  heroName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
    marginBottom: 6,
  },
  heroLocation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroDays: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  heroDaysNum: {
    fontSize: 48,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
    lineHeight: 52,
  },
  heroDaysLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  worldChampBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,215,0,0.12)",
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  worldChampText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: "#FFD700",
  },
  body: { paddingHorizontal: spacing.lg },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
  },
  chips: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surfaceGlass,
  },
  chipActive: {
    backgroundColor: `${colors.primary}20`,
    borderColor: `${colors.primary}60`,
  },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.medium },
  chipTextActive: { color: colors.primary, fontWeight: fontWeight.bold },
  count: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    borderRadius: borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: `${colors.primary}0a`,
  },
  selectBtnActive: {
    borderColor: "#10B98140",
    backgroundColor: "rgba(16,185,129,0.08)",
  },
  selectBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  selectBtnTextActive: {
    color: "#10B981",
  },
});
