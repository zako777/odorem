import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AuthRequired } from "@/components/auth-required";
import { PossessionRow } from "@/components/possession-row";
import { ApiError } from "@/lib/api";
import {
  MY_COLLECTION_QUERY,
  type CollectionEntry,
  type CollectionPage,
  type Possession,
} from "@/lib/collection";
import { gqlRequest } from "@/lib/graphql";
import { useSession } from "@/lib/session";

const PER_PAGE = 20;

export default function CollectionScreen() {
  const { session, signOut } = useSession();
  const [items, setItems] = useState<CollectionEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!session) return;
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await gqlRequest<{ myCollection: CollectionPage }>(
          MY_COLLECTION_QUERY,
          { page: 1, perPage: PER_PAGE },
          session.token,
        );
        if (!active) return;
        setItems(data.myCollection.items);
        setTotal(data.myCollection.total);
        setPage(1);
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
  }, [reloadKey, session, signOut]);

  if (!session) return <AuthRequired />;

  const loadMore = async () => {
    if (loadingMore || items.length >= total) return;
    const next = page + 1;
    setLoadingMore(true);
    try {
      const data = await gqlRequest<{ myCollection: CollectionPage }>(
        MY_COLLECTION_QUERY,
        { page: next, perPage: PER_PAGE },
        session.token,
      );
      setItems((current) => [...current, ...data.myCollection.items]);
      setTotal(data.myCollection.total);
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

  const handleUpdated = (possession: Possession) => {
    setItems((current) =>
      current.map((entry) =>
        entry.possession.id === possession.id ? { ...entry, possession } : entry,
      ),
    );
  };

  const handleRemoved = (possessionId: string) => {
    setItems((current) =>
      current.filter((entry) => entry.possession.id !== possessionId),
    );
    setTotal((value) => Math.max(0, value - 1));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
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
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(entry) => entry.possession.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PossessionRow
            entry={item}
            onUpdated={handleUpdated}
            onRemoved={handleRemoved}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Ta collection est vide.</Text>
        }
        ListFooterComponent={
          <View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {items.length < total ? (
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
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
    color: "#6B7280",
  },
  error: {
    color: "#C0392B",
    marginTop: 12,
    textAlign: "center",
  },
  more: {
    alignItems: "center",
    paddingVertical: 16,
  },
  link: {
    color: "#208AEF",
  },
});
