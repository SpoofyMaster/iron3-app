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
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GlassCard } from "@/components";
import { colors, spacing, fontSize } from "@/theme";
import { signIn } from "@/lib/auth";
import { useAppStore } from "@/store/useAppStore";

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    }
  };

  return (
    <LinearGradient
      colors={["#0a0a1a", "#1a0a2e", "#0d1b3e"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        {/* Logo / Title */}
        <View style={styles.header}>
          <Text style={styles.logo}>⚡ Iron3</Text>
          <Text style={styles.subtitle}>Ranked Triathlon</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
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
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </GlassCard>

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
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  header: { alignItems: "center", marginBottom: 40 },
  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.primary,
    marginTop: 4,
    fontWeight: "600",
    letterSpacing: 1,
  },
  card: { paddingHorizontal: 20, paddingVertical: 28 },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fontSize.md,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  forgotLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    textAlign: "right",
    marginBottom: 20,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  switchText: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: 24,
    fontSize: fontSize.sm,
  },
  switchLink: {
    color: colors.primary,
    fontWeight: "700",
  },
});
