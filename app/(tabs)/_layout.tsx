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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: fontWeight.medium,
          marginTop: 2,
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
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={22}
                color={
                  focused ? (tab.color ?? colors.primary) : colors.textMuted
                }
              />
            ),
            tabBarActiveTintColor: tab.color ?? colors.primary,
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
