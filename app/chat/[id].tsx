import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { ChatMessage } from "@/types";
import { listMessagesBetween, markConversationRead, sendMessage, subscribeToUserMessages } from "@/lib/dataService";
import { supabase } from "@/lib/supabase";

export default function ChatThreadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const friendId = params.id;
  const currentUserId = useAppStore((s) => s.currentUserId);
  const friendProfiles = useAppStore((s) => s.friendProfiles);
  const friend = useMemo(
    () => friendProfiles.find((item) => item.id === friendId),
    [friendProfiles, friendId]
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!currentUserId || !friendId) return;
    let mounted = true;

    const run = async () => {
      try {
        const initial = await listMessagesBetween(currentUserId, friendId);
        if (!mounted) return;
        setMessages(initial);
        await markConversationRead(currentUserId, friendId);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };
    run();

    const channel = subscribeToUserMessages(currentUserId, (message) => {
      if (
        (message.senderId === friendId && message.receiverId === currentUserId) ||
        (message.senderId === currentUserId && message.receiverId === friendId)
      ) {
        setMessages((prev) => {
          if (prev.some((existing) => existing.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, [currentUserId, friendId]);

  const handleSend = async () => {
    if (!currentUserId || !friendId) return;
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    try {
      const created = await sendMessage(currentUserId, friendId, text);
      setMessages((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setDraft(text);
    }
  };

  if (!friend || !currentUserId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.fallback}>
          <Text style={styles.fallbackTitle}>Chat unavailable</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.fallbackBtn}>
            <Text style={styles.fallbackBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.safe}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{friend.displayName}</Text>
          <View style={{ width: 22 }} />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContent}
          renderItem={({ item }) => {
            const mine = item.senderId === currentUserId;
            return (
              <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                <Text style={styles.bubbleText}>{item.text}</Text>
                <Text style={styles.timestamp}>
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          }}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
            <Ionicons name="send" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceGlassBorder,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  messagesContent: {
    padding: spacing.lg,
    gap: 10,
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary + "30",
    borderWidth: 1,
    borderColor: colors.primary + "40",
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  bubbleText: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 10,
    alignSelf: "flex-end",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceGlassBorder,
  },
  input: {
    flex: 1,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: fontSize.sm,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  fallbackTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  fallbackBtn: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + "50",
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  fallbackBtnText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
