import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export function AuthRequired() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Connecte-toi pour accéder à cette page.
      </Text>
      <Link href="/" style={styles.link}>
        Se connecter
      </Link>
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
  message: {
    textAlign: "center",
    marginBottom: 16,
  },
  link: {
    color: "#208AEF",
  },
});
