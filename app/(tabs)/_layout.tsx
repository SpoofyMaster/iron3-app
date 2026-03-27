import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { colors, fontWeight } from "@/theme";

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: {
  name: string;
  title: string;
  icon: TabIconName;
  iconFocused: TabIconName;
  color?: string;
  isFab?: boolean;
}[] = [
  { name: "index", title: "Home", icon: "home-outline", iconFocused: "home" },
  { name: "ranks", title: "Friends", icon: "people-outline", iconFocused: "people" },
  { name: "log", title: "", icon: "add", iconFocused: "add", isFab: true },
  { name: "progress", title: "Ranks", icon: "trophy-outline", iconFocused: "trophy" },
  { name: "profile", title: "Profile", icon: "person-outline", iconFocused: "person" },
];

const HIDDEN_SCREENS = ["swim", "bike", "run", "leaderboard"];

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.glowCyan,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: fontWeight.semibold,
          marginTop: 2,
          letterSpacing: 0.5,
        },
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, size }) => {
              if (tab.isFab) {
                return (
                  <View style={styles.fabContainer}>
                    <LinearGradient
                      colors={[colors.glowCyan, colors.glowBlue]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.fabGradient}
                    >
                      <Ionicons name="add" size={28} color="#fff" />
                    </LinearGradient>
                  </View>
                );
              }
              return (
                <View style={focused ? styles.activeIconWrap : undefined}>
                  <Ionicons
                    name={focused ? tab.iconFocused : tab.icon}
                    size={22}
                    color={
                      focused ? colors.glowCyan : colors.textMuted
                    }
                  />
                </View>
              );
            },
            tabBarActiveTintColor: tab.isFab ? "transparent" : colors.glowCyan,
            tabBarLabel: tab.isFab ? () => null : undefined,
          }}
        />
      ))}
      {HIDDEN_SCREENS.map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            href: null,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconWrap: {
    shadowColor: colors.glowCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  fabContainer: {
    position: "relative",
    top: -12,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: colors.glowCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
