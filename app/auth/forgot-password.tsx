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
import { resetPassword } from "@/lib/auth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }
    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);

    if (!result.success) {
      Alert.alert("Error", result.error ?? "Could not send reset email.");
      return;
    }
    setSent(true);
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
        <View style={styles.header}>
          <Text style={styles.logo}>🔑</Text>
          <Text style={styles.title}>Reset Password</Text>
        </View>

        <GlassCard style={styles.card}>
          {sent ? (
            <View style={styles.sentContainer}>
              <Text style={styles.sentEmoji}>📬</Text>
              <Text style={styles.sentTitle}>Check your inbox</Text>
              <Text style={styles.sentText}>
                We sent a password reset link to{"\n"}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.back()}
              >
                <Text style={styles.buttonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.description}>
                Enter your email and we&apos;ll send you a link to reset your
                password.
              </Text>

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

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleReset}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </GlassCard>

        {!sent && (
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Back to Sign In</Text>
          </TouchableOpacity>
        )}
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
  header: { alignItems: "center", marginBottom: 32 },
  logo: { fontSize: 48 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginTop: 12,
    letterSpacing: 1,
  },
  card: { paddingHorizontal: 20, paddingVertical: 28 },
  description: {
    color: "rgba(255,255,255,0.6)",
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: { marginBottom: 20 },
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
  backLink: {
    color: colors.primary,
    textAlign: "center",
    marginTop: 24,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  sentContainer: { alignItems: "center" },
  sentEmoji: { fontSize: 48, marginBottom: 16 },
  sentTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  sentText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emailHighlight: {
    color: colors.primary,
    fontWeight: "600",
  },
});
