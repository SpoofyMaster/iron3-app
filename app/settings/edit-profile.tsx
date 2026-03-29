import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components";
import { supabase } from "@/lib/supabase";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(useAppStore.getState().socialProfile.bio);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access to set your profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0] || !currentUserId) return;
    setUploadingPhoto(true);
    try {
      const asset = result.assets[0];
      const ext = (asset.uri.split(".").pop() ?? "jpg").toLowerCase().replace("jpeg", "jpg");
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";
      const path = `${currentUserId}/avatar.${ext}`;
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arrayBuffer, { upsert: true, contentType: mimeType });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", currentUserId);
      useAppStore.setState((s) => ({ user: { ...s.user, avatarUrl } }));
    } catch (e) {
      console.error("Upload error:", e);
      Alert.alert("Upload failed", "Could not upload photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!currentUserId) return;
    setSaving(true);
    try {
      const trimmedName = displayName.trim();
      if (!trimmedName) {
        Alert.alert("Error", "Display name cannot be empty.");
        setSaving(false);
        return;
      }
      await supabase
        .from("profiles")
        .update({ display_name: trimmedName, updated_at: new Date().toISOString() })
        .eq("id", currentUserId);
      useAppStore.setState((s) => ({
        user: { ...s.user, displayName: trimmedName },
        socialProfile: { ...s.socialProfile, bio },
      }));
      Alert.alert("✅ Saved", "Profile updated successfully!");
      router.back();
    } catch (e) {
      console.error("Save error:", e);
      Alert.alert("Error", "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.7}>
          {saving ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.saveBtn}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{user.displayName.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              {uploadingPhoto && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        {/* Fields */}
        <GlassCard style={styles.fieldsCard}>
          <Text style={styles.fieldLabel}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            maxLength={40}
          />
          <View style={styles.fieldDivider} />
          <Text style={styles.fieldLabel}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={160}
          />
          <Text style={styles.charCount}>{bio.length}/160</Text>
        </GlassCard>

        <GlassCard style={styles.fieldsCard}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{user.email}</Text>
          <Text style={styles.fieldHint}>Email cannot be changed here</Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: { color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  saveBtn: { color: colors.primary, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  container: { flex: 1 },
  content: { padding: spacing.lg, gap: 20, paddingBottom: 40 },
  avatarSection: { alignItems: "center", gap: 8 },
  avatarContainer: { position: "relative" },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: colors.primary },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.surfaceLight, borderWidth: 3, borderColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: colors.text, fontSize: fontSize.xxxl, fontWeight: fontWeight.bold },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50, alignItems: "center", justifyContent: "center",
  },
  cameraIcon: {
    position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: colors.background,
  },
  changePhotoText: { color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  fieldsCard: { padding: spacing.lg, gap: 8 },
  fieldLabel: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: fontWeight.medium, marginBottom: 2 },
  input: {
    color: colors.text, fontSize: fontSize.md, paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.04)", borderRadius: borderRadius.sm, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  bioInput: { minHeight: 80, textAlignVertical: "top" },
  charCount: { color: colors.textMuted, fontSize: fontSize.xs, textAlign: "right" },
  fieldDivider: { height: 8 },
  fieldValue: { color: colors.text, fontSize: fontSize.md, paddingVertical: 4 },
  fieldHint: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
});
