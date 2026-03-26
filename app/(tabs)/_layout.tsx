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
  { name: "swim", title: "Swim", icon: "water-outline", iconFocused: "water", color: colors.swim },
  { name: "bike", title: "Bike", icon: "bicycle-outline", iconFocused: "bicycle", color: colors.bike },
  { name: "run", title: "Run", icon: "walk-outline", iconFocused: "walk", color: colors.run },
  { name: "leaderboard", title: "Ranks", icon: "podium-outline", iconFocused: "podium" },
  { name: "profile", title: "Profile", icon: "person-outline", iconFocused: "person" },
];

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
    </Tabs>
  );
}
