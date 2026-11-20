import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AuthRequired } from "@/components/auth-required";
import { ApiError } from "@/lib/api";
import { gqlRequest } from "@/lib/graphql";
import { useSession } from "@/lib/session";

type PerfumeDetail = {
  id: string;
  name: string;
  brand: string;
  description: string | null;
  products: {
    id: string;
    volumeMl: number;
    concentration: { code: string; label: string };
  }[];
};

const PERFUME_QUERY = `
  query Perfume($id: Int!) {
    perfume(id: $id) {
      id
      name
      brand
      description
      products {
        id
        volumeMl
        concentration { code label }
      }
    }
  }
`;

export default function PerfumeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, signOut } = useSession();
  const [perfume, setPerfume] = useState<PerfumeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!session) return;
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await gqlRequest<{ perfume: PerfumeDetail }>(
          PERFUME_QUERY,
          { id: Number(id) },
          session.token,
        );
        if (active) setPerfume(data.perfume);
      } catch (caught) {
        if (!active) return;
        if (caught instanceof ApiError && caught.kind === "unauthorized") {
          await signOut();
          return;
        }
        setError("Chargement impossible. Vérifie ta connexion.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id, reloadKey, session, signOut]);

  if (!session) return <AuthRequired />;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !perfume) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error ?? "Parfum introuvable."}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setReloadKey((key) => key + 1)}
        >
          <Text style={styles.link}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.name}>{perfume.name}</Text>
      <Text style={styles.brand}>{perfume.brand}</Text>
      {perfume.description ? (
        <Text style={styles.description}>{perfume.description}</Text>
      ) : null}
      <Text style={styles.section}>Formats</Text>
      {perfume.products.length === 0 ? (
        <Text style={styles.muted}>Aucun format renseigné.</Text>
      ) : (
        perfume.products.map((product) => (
          <View key={product.id} style={styles.product}>
            <Text style={styles.productLabel}>
              {product.concentration.label}
            </Text>
            <Text style={styles.muted}>{product.volumeMl} ml</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  brand: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  description: {
    marginTop: 16,
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: "600",
  },
  product: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDE1E6",
  },
  productLabel: {
    fontSize: 16,
  },
  muted: {
    color: "#6B7280",
  },
  error: {
    color: "#C0392B",
    marginBottom: 12,
    textAlign: "center",
  },
  link: {
    color: "#208AEF",
  },
});
