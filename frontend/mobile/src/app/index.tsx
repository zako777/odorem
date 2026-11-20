import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ApiError, apiUrl } from "@/lib/api";
import { useSession } from "@/lib/session";

export default function Index() {
  const { session, loading, signOut } = useSession();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bonjour {session.user.fullName ?? session.user.email}
      </Text>
      <Link href="/perfumes" style={styles.link}>
        Parcourir le catalogue
      </Link>
      <Link href="/scan" style={styles.link}>
        Scanner un code-barres
      </Link>
      <Pressable
        accessibilityRole="button"
        style={styles.secondaryButton}
        onPress={signOut}
      >
        <Text style={styles.secondaryLabel}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

function LoginForm() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.kind === "network"
          ? "Serveur inaccessible. Vérifie ta connexion."
          : caught instanceof ApiError &&
              (caught.kind === "unauthorized" || caught.kind === "invalid")
            ? "Email ou mot de passe incorrect."
            : "Connexion impossible. Réessaie.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || !email || !password;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odorem</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        autoCapitalize="none"
        autoComplete="current-password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={submit}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        accessibilityRole="button"
        style={[styles.button, disabled && styles.buttonDisabled]}
        disabled={disabled}
        onPress={submit}
      >
        <Text style={styles.buttonLabel}>
          {submitting ? "Connexion…" : "Se connecter"}
        </Text>
      </Pressable>
      {__DEV__ ? <Text style={styles.hint}>{apiUrl}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
  },
  input: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#C9CFD6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  error: {
    color: "#C0392B",
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 16,
  },
  secondaryLabel: {
    color: "#208AEF",
  },
  link: {
    marginTop: 16,
    color: "#208AEF",
  },
  hint: {
    marginTop: 24,
    color: "#6B7280",
    fontSize: 12,
  },
});
