import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AuthRequired } from "@/components/auth-required";
import { ApiError } from "@/lib/api";
import { gqlRequest } from "@/lib/graphql";
import { useSession } from "@/lib/session";

type PerfumeSummary = {
  id: string;
  name: string;
  brand: string;
  description: string | null;
};

type PerfumesPage = {
  items: PerfumeSummary[];
  total: number;
  page: number;
  perPage: number;
};

const PERFUMES_QUERY = `
  query Perfumes($search: String, $page: Int, $perPage: Int) {
    perfumes(search: $search, page: $page, perPage: $perPage) {
      items { id name brand description }
      total
      page
      perPage
    }
  }
`;

const PER_PAGE = 20;

export default function PerfumesScreen() {
  const { session, signOut } = useSession();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<PerfumeSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!session) return;
    let active = true;

    // Debounce so typing does not fire one request per keystroke.
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await gqlRequest<{ perfumes: PerfumesPage }>(
          PERFUMES_QUERY,
          { search: search.trim() || null, page: 1, perPage: PER_PAGE },
          session.token,
        );
        if (!active) return;
        setItems(data.perfumes.items);
        setTotal(data.perfumes.total);
        setPage(1);
      } catch (caught) {
        if (!active) return;
        if (caught instanceof ApiError && caught.kind === "unauthorized") {
          await signOut();
          return;
        }
        setError("Recherche impossible. Vérifie ta connexion.");
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, reloadKey, session, signOut]);

  if (!session) return <AuthRequired />;

  const loadMore = async () => {
    if (loadingMore || items.length >= total) return;
    const next = page + 1;
    setLoadingMore(true);
    try {
      const data = await gqlRequest<{ perfumes: PerfumesPage }>(
        PERFUMES_QUERY,
        { search: search.trim() || null, page: next, perPage: PER_PAGE },
        session.token,
      );
      setItems((current) => [...current, ...data.perfumes.items]);
      setTotal(data.perfumes.total);
      setPage(next);
    } catch (caught) {
      if (caught instanceof ApiError && caught.kind === "unauthorized") {
        await signOut();
        return;
      }
      setError("Chargement impossible. Réessaie.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom ou marque"
        autoCapitalize="none"
        autoCorrect={false}
        value={search}
        onChangeText={setSearch}
      />
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setReloadKey((key) => key + 1)}
          >
            <Text style={styles.link}>Réessayer</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/perfume/[id]", params: { id: item.id } }}
              style={styles.row}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.brand}>{item.brand}</Text>
            </Link>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucun parfum trouvé.</Text>
          }
          ListFooterComponent={
            items.length < total ? (
              <Pressable
                accessibilityRole="button"
                style={styles.more}
                disabled={loadingMore}
                onPress={loadMore}
              >
                <Text style={styles.link}>
                  {loadingMore ? "Chargement…" : "Voir plus"}
                </Text>
              </Pressable>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C9CFD6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDE1E6",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  brand: {
    color: "#6B7280",
    marginTop: 2,
  },
  loader: {
    marginTop: 24,
  },
  centered: {
    alignItems: "center",
    marginTop: 24,
  },
  error: {
    color: "#C0392B",
    marginBottom: 12,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
    color: "#6B7280",
  },
  more: {
    alignItems: "center",
    paddingVertical: 16,
  },
  link: {
    color: "#208AEF",
  },
});
