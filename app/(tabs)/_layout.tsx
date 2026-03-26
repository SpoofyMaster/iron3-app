import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";
import { colors, fontSize, fontWeight } from "@/theme";

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: {
  name: string;
  title: string;
  icon: TabIconName;
  iconFocused: TabIconName;
  color?: string;
}[] = [
  { name: "index", title: "Home", icon: "home-outline", iconFocused: "home" },
  { name: "log", title: "Log", icon: "add-circle-outline", iconFocused: "add-circle" },
  { name: "ranks", title: "Ranks", icon: "trophy-outline", iconFocused: "trophy" },
  { name: "progress", title: "Progress", icon: "stats-chart-outline", iconFocused: "stats-chart" },
  { name: "profile", title: "Profile", icon: "person-outline", iconFocused: "person" },
];

const HIDDEN_SCREENS = ["swim", "bike", "run", "leaderboard"];

export default function TabLayout() {
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
        tabBarActiveTintColor: colors.glowPurple,
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
            tabBarIcon: ({ focused, size }) => (
              <View style={focused ? styles.activeIconWrap : undefined}>
                <Ionicons
                  name={focused ? tab.iconFocused : tab.icon}
                  size={22}
                  color={
                    focused ? (tab.color ?? colors.glowPurple) : colors.textMuted
                  }
                />
              </View>
            ),
            tabBarActiveTintColor: tab.color ?? colors.glowPurple,
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
    shadowColor: colors.glowPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
});
