import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GlassCard, SectionHeader } from "@/components";
import { useAppStore } from "@/store/useAppStore";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

export default function ChatListScreen() {
  const router = useRouter();
  const friendProfiles = useAppStore((s) => s.friendProfiles);
  const chatConversations = useAppStore((s) => s.chatConversations);

  const conversations = useMemo(() => {
    const map = new Map(chatConversations.map((conversation) => [conversation.friendId, conversation]));
    return friendProfiles.map((friend) => {
      const existing = map.get(friend.id);
      return {
        id: friend.id,
        name: friend.displayName,
        avatar: friend.displayName.charAt(0).toUpperCase(),
        lastMessage: existing?.lastMessage ?? "Say hi and start training together.",
        lastMessageAt: existing?.lastMessageAt ?? "",
        unreadCount: existing?.unreadCount ?? 0,
      };
    });
  }, [chatConversations, friendProfiles]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Chat</Text>
          <View style={{ width: 32 }} />
        </View>

        <SectionHeader title="Conversations" />
        {conversations.length === 0 ? (
          <GlassCard style={styles.emptyCard} variant="highlighted">
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>Add friends in the Friends tab to start chatting in real time.</Text>
          </GlassCard>
        ) : (
          <GlassCard style={styles.listCard}>
            {conversations.map((conversation, index) => (
              <View key={conversation.id}>
                <TouchableOpacity
                  style={styles.row}
                  activeOpacity={0.75}
                  onPress={() => router.push(`/chat/${conversation.id}` as never)}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{conversation.avatar}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{conversation.name}</Text>
                    <Text numberOfLines={1} style={styles.rowMsg}>
                      {conversation.lastMessage}
                    </Text>
                  </View>
                  {conversation.unreadCount > 0 ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
                {index < conversations.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </GlassCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: spacing.lg, gap: 14, paddingBottom: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  emptyCard: { gap: 6 },
  emptyTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  emptyText: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 20 },
  listCard: { padding: 0, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  avatarText: { color: colors.text, fontWeight: fontWeight.bold },
  rowInfo: { flex: 1, gap: 2 },
  rowName: { color: colors.text, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  rowMsg: { color: colors.textSecondary, fontSize: fontSize.xs },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: { color: "#fff", fontSize: 10, fontWeight: fontWeight.bold },
  divider: { height: 1, backgroundColor: colors.surfaceGlassBorder, marginHorizontal: spacing.md },
});
