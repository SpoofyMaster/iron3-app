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
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "@/theme";
import { signIn } from "@/lib/auth";
import { useAppStore } from "@/store/useAppStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }
    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert("Login failed", result.error ?? "Unknown error");
      return;
    }
    if (result.user) {
      setAuth(true, result.user.id);
      await useAppStore.getState().fetchProfile(result.user.id);
    }
  };

  return (
    <LinearGradient
      colors={["#0A0A0F", "#1A0A05", "#0F0808", "#0A0A0F"]}
      locations={[0, 0.3, 0.6, 1]}
      style={styles.container}
    >
      {/* Subtle glow effect behind logo */}
      <View style={styles.glowOrb} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        {/* Logo */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>KNOW YOUR RANK</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to continue your training</Text>

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
              placeholder="Password"
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

          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password" as never)}
          >
            <Text style={styles.forgotLink}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
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
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons placeholder */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Ionicons name="logo-apple" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Ionicons name="logo-google" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push("/auth/register" as never)}>
          <Text style={styles.switchText}>
            Don&apos;t have an account?{" "}
            <Text style={styles.switchLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  glowOrb: {
    position: "absolute",
    top: "15%",
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
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoImage: {
    width: 120,
    height: 120,
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
    marginBottom: 8,
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
  forgotLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    textAlign: "right",
    fontWeight: fontWeight.semibold,
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
    marginVertical: 4,
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
