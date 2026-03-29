import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "@/theme";
import { signUp } from "@/lib/auth";
import { useAppStore } from "@/store/useAppStore";

export default function RegisterScreen() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), password, displayName.trim());
    setLoading(false);

    if (!result.success) {
      Alert.alert("Sign up failed", result.error ?? "Unknown error");
      return;
    }

    if (result.user) {
      setAuth(true, result.user.id);
    } else {
      Alert.alert(
        "Check your email",
        "We sent a confirmation link. Please verify your email to continue."
      );
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={["#0A0A0F", "#1A0A05", "#0F0808", "#0A0A0F"]}
      locations={[0, 0.3, 0.6, 1]}
      style={styles.container}
    >
      <View style={styles.glowOrb} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.header}>
            <Image
              source={require("@/assets/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>JOIN THE RANKS</Text>
          </View>

          {/* Register Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSubtitle}>Start your triathlon journey</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Ionicons name="person-outline" size={18} color={colors.textMuted} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Athlete name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password (min 6 characters)"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Ionicons name="shield-checkmark-outline" size={18} color={colors.textMuted} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF6B35", "#FF4500", "#CC3700"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Ionicons name="logo-apple" size={22} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <Ionicons name="logo-google" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.switchText}>
              Already have an account?{" "}
              <Text style={styles.switchLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  glowOrb: {
    position: "absolute",
    top: "12%",
    alignSelf: "center",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 69, 0, 0.08)",
    shadowColor: "#FF4500",
    shadowOpacity: 0.3,
    shadowRadius: 80,
    shadowOffset: { width: 0, height: 0 },
  },
  inner: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  tagline: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    letterSpacing: 4,
    fontWeight: fontWeight.bold,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 24,
    gap: 14,
  },
  cardTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    height: 52,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: fontSize.md,
    color: colors.text,
    height: "100%",
  },
  eyeIcon: {
    paddingHorizontal: 16,
    height: "100%",
    justifyContent: "center",
  },
  button: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: borderRadius.lg,
  },
  buttonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  switchText: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 24,
    fontSize: fontSize.sm,
  },
  switchLink: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
});
