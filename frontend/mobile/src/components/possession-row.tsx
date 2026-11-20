import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ApiError } from "@/lib/api";
import {
  CONDITION_LABELS,
  POSSESSION_CONDITIONS,
  REMOVE_POSSESSION_MUTATION,
  UPDATE_POSSESSION_MUTATION,
  type CollectionEntry,
  type Possession,
} from "@/lib/collection";
import { gqlRequest } from "@/lib/graphql";
import { useSession } from "@/lib/session";

type Props = {
  entry: CollectionEntry;
  onUpdated: (possession: Possession) => void;
  onRemoved: (possessionId: string) => void;
};

export function PossessionRow({ entry, onUpdated, onRemoved }: Props) {
  const { session, signOut } = useSession();
  const { possession } = entry;
  const [editing, setEditing] = useState(false);
  const [quantity, setQuantity] = useState(possession.quantity);
  const [condition, setCondition] = useState(possession.condition);
  const [rating, setRating] = useState<number | null>(possession.rating);
  const [comment, setComment] = useState(possession.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setQuantity(possession.quantity);
    setCondition(possession.condition);
    setRating(possession.rating);
    setComment(possession.comment ?? "");
    setError(null);
    setEditing(true);
  };

  const save = async () => {
    if (!session) return;
    setSaving(true);
    setError(null);
    try {
      const data = await gqlRequest<{ updatePossession: Possession }>(
        UPDATE_POSSESSION_MUTATION,
        {
          possessionId: Number(possession.id),
          input: { quantity, condition, rating, comment: comment.trim() || null },
        },
        session.token,
      );
      onUpdated(data.updatePossession);
      setEditing(false);
    } catch (caught) {
      if (caught instanceof ApiError && caught.kind === "unauthorized") {
        await signOut();
        return;
      }
      setError("Enregistrement impossible. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!session) return;
    setRemoving(true);
    setError(null);
    try {
      await gqlRequest(
        REMOVE_POSSESSION_MUTATION,
        { possessionId: Number(possession.id) },
        session.token,
      );
      onRemoved(possession.id);
    } catch (caught) {
      setRemoving(false);
      if (caught instanceof ApiError && caught.kind === "unauthorized") {
        await signOut();
        return;
      }
      setError("Suppression impossible. Réessaie.");
    }
  };

  const confirmRemove = () => {
    Alert.alert("Retirer de la collection", "Ce parfum sera retiré de ta collection.", [
      { text: "Annuler", style: "cancel" },
      { text: "Retirer", style: "destructive", onPress: () => void remove() },
    ]);
  };

  return (
    <View style={styles.row}>
      <Text style={styles.name}>{entry.perfumeName}</Text>
      <Text style={styles.meta}>
        {entry.brand} · {entry.volumeMl} ml · ×{possession.quantity}
      </Text>
      <Text style={styles.meta}>
        État : {CONDITION_LABELS[possession.condition] ?? possession.condition}
        {possession.rating ? ` · ${possession.rating}/5` : ""}
      </Text>
      {possession.comment ? (
        <Text style={styles.comment}>{possession.comment}</Text>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {editing ? (
        <View style={styles.editor}>
          <View style={styles.quantityRow}>
            <Text style={styles.label}>Quantité</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Diminuer la quantité"
              style={styles.step}
              onPress={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Text style={styles.stepLabel}>−</Text>
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Augmenter la quantité"
              style={styles.step}
              onPress={() => setQuantity((value) => value + 1)}
            >
              <Text style={styles.stepLabel}>+</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>État</Text>
          <View style={styles.options}>
            {POSSESSION_CONDITIONS.map((value) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected: condition === value }}
                style={[
                  styles.option,
                  condition === value && styles.optionSelected,
                ]}
                onPress={() => setCondition(value)}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    condition === value && styles.optionLabelSelected,
                  ]}
                >
                  {CONDITION_LABELS[value]}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Note</Text>
          <View style={styles.options}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={`Note ${value} sur 5`}
                onPress={() => setRating(value)}
              >
                <Text style={styles.star}>
                  {rating !== null && value <= rating ? "★" : "☆"}
                </Text>
              </Pressable>
            ))}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Effacer la note"
              onPress={() => setRating(null)}
            >
              <Text style={styles.clearRating}>Aucune</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Commentaire"
            multiline
            value={comment}
            onChangeText={setComment}
          />

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              style={[styles.button, saving && styles.buttonDisabled]}
              disabled={saving}
              onPress={save}
            >
              <Text style={styles.buttonLabel}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.secondary}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.secondaryLabel}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={startEditing}>
            <Text style={styles.secondaryLabel}>Modifier</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={removing}
            onPress={confirmRemove}
          >
            <Text style={styles.removeLabel}>
              {removing ? "Suppression…" : "Retirer"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDE1E6",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    color: "#6B7280",
    marginTop: 2,
  },
  comment: {
    marginTop: 6,
    fontStyle: "italic",
  },
  error: {
    color: "#C0392B",
    marginTop: 8,
  },
  editor: {
    marginTop: 12,
    gap: 8,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontWeight: "600",
  },
  quantity: {
    fontSize: 16,
    minWidth: 24,
    textAlign: "center",
  },
  step: {
    borderWidth: 1,
    borderColor: "#C9CFD6",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stepLabel: {
    fontSize: 16,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: "#C9CFD6",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  optionSelected: {
    backgroundColor: "#208AEF",
    borderColor: "#208AEF",
  },
  optionLabel: {
    color: "#1F2937",
  },
  optionLabelSelected: {
    color: "#FFFFFF",
  },
  star: {
    fontSize: 22,
    color: "#D4A017",
  },
  clearRating: {
    marginLeft: 8,
    color: "#208AEF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C9CFD6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 60,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 12,
  },
  button: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondary: {
    paddingVertical: 8,
  },
  secondaryLabel: {
    color: "#208AEF",
  },
  removeLabel: {
    color: "#C0392B",
  },
});
