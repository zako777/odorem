import { CameraView, useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ApiError } from "@/lib/api";
import { gqlRequest } from "@/lib/graphql";
import { useSession } from "@/lib/session";
import { AuthRequired } from "@/components/auth-required";

type ScannedProduct = {
  productId: string;
  volumeMl: number;
  concentrationCode: string;
  concentrationLabel: string;
  perfumeId: string;
  perfumeName: string;
  brand: string;
};

type Status = "scanning" | "loading" | "result" | "not-found" | "error";

const PRODUCT_BY_BARCODE = `
  query ProductByBarcode($code: String!) {
    productByBarcode(code: $code) {
      productId
      volumeMl
      concentrationCode
      concentrationLabel
      perfumeId
      perfumeName
      brand
    }
  }
`;

const ADD_TO_COLLECTION = `
  mutation AddToCollection($productId: Int!) {
    addToCollection(productId: $productId) {
      id
      quantity
    }
  }
`;

function normalizeBarcode(value: string): string | null {
  const code = value.trim();
  return /^\d{8,14}$/.test(code) ? code : null;
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { session, signOut } = useSession();
  const [status, setStatus] = useState<Status>("scanning");
  const [code, setCode] = useState<string | null>(null);
  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [addState, setAddState] = useState<"idle" | "adding" | "added">("idle");
  const [addError, setAddError] = useState<string | null>(null);
  const locked = useRef(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Accès caméra requis</Text>
        <Text style={styles.message}>
          Odorem utilise la caméra uniquement pour scanner le code-barres
          d&apos;un parfum.
        </Text>
        {permission.canAskAgain ? (
          <Pressable
            accessibilityRole="button"
            style={styles.button}
            onPress={requestPermission}
          >
            <Text style={styles.buttonLabel}>Autoriser la caméra</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            style={styles.button}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.buttonLabel}>Ouvrir les réglages</Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (!session) {
    return <AuthRequired />;
  }

  const reset = () => {
    locked.current = false;
    setStatus("scanning");
    setCode(null);
    setProduct(null);
    setAddState("idle");
    setAddError(null);
  };

  const handleApiError = async (error: unknown) => {
    if (error instanceof ApiError && error.kind === "unauthorized") {
      await signOut();
      return;
    }
    setStatus("error");
  };

  const lookup = async (scanned: string) => {
    setCode(scanned);
    setStatus("loading");
    try {
      const data = await gqlRequest<{
        productByBarcode: ScannedProduct | null;
      }>(PRODUCT_BY_BARCODE, { code: scanned }, session.token);
      if (data.productByBarcode) {
        setProduct(data.productByBarcode);
        setStatus("result");
      } else {
        setStatus("not-found");
      }
    } catch (error) {
      await handleApiError(error);
    }
  };

  const addToCollection = async () => {
    if (!product) return;
    setAddState("adding");
    setAddError(null);
    try {
      await gqlRequest(
        ADD_TO_COLLECTION,
        { productId: Number(product.productId) },
        session.token,
      );
      setAddState("added");
    } catch (error) {
      setAddState("idle");
      if (error instanceof ApiError && error.kind === "unauthorized") {
        await signOut();
        return;
      }
      setAddError("Ajout impossible. Réessaie.");
    }
  };

  if (status === "scanning") {
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
          }}
          onBarcodeScanned={({ data }) => {
            if (locked.current) return;
            const scanned = normalizeBarcode(data);
            if (!scanned) return;
            locked.current = true;
            void lookup(scanned);
          }}
        />
        <View style={styles.hint} pointerEvents="none">
          <Text style={styles.hintLabel}>
            Placez le code-barres dans le cadre
          </Text>
        </View>
        <Link href="/" style={[styles.link, styles.linkOnCamera]}>
          Retour
        </Link>
      </View>
    );
  }

  if (status === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={styles.message}>Recherche du produit…</Text>
      </View>
    );
  }

  if (status === "not-found") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Code inconnu</Text>
        <Text style={styles.code}>{code}</Text>
        <Text style={styles.message}>
          Aucun produit du catalogue ne correspond à ce code-barres.
        </Text>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={reset}
        >
          <Text style={styles.buttonLabel}>Scanner à nouveau</Text>
        </Pressable>
        <Link href="/perfumes" style={styles.link}>
          Rechercher manuellement
        </Link>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recherche impossible</Text>
        <Text style={styles.message}>
          Vérifie ta connexion, puis réessaie.
        </Text>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={reset}
        >
          <Text style={styles.buttonLabel}>Scanner à nouveau</Text>
        </Pressable>
        <Link href="/" style={styles.link}>
          Retour à l&apos;accueil
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product?.perfumeName}</Text>
      <Text style={styles.message}>
        {product?.brand} · {product?.concentrationLabel} ·{" "}
        {product?.volumeMl} ml
      </Text>
      <Text style={styles.code}>{code}</Text>
      {addError ? <Text style={styles.error}>{addError}</Text> : null}
      {addState === "added" ? (
        <Text style={styles.success}>Ajouté à ta collection.</Text>
      ) : (
        <Pressable
          accessibilityRole="button"
          style={[styles.button, addState === "adding" && styles.buttonDisabled]}
          disabled={addState === "adding"}
          onPress={addToCollection}
        >
          <Text style={styles.buttonLabel}>
            {addState === "adding" ? "Ajout…" : "Ajouter à ma collection"}
          </Text>
        </Pressable>
      )}
      <Pressable
        accessibilityRole="button"
        style={styles.secondaryButton}
        onPress={reset}
      >
        <Text style={styles.secondaryLabel}>Scanner à nouveau</Text>
      </Pressable>
      <Link href="/" style={styles.link}>
        Retour à l&apos;accueil
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
  },
  code: {
    fontSize: 20,
    fontVariant: ["tabular-nums"],
    marginBottom: 24,
    color: "#6B7280",
  },
  error: {
    color: "#C0392B",
    marginBottom: 12,
    textAlign: "center",
  },
  success: {
    color: "#1E8449",
    fontWeight: "600",
    marginBottom: 12,
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
  hint: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintLabel: {
    color: "#FFFFFF",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  link: {
    marginTop: 24,
    color: "#208AEF",
  },
  linkOnCamera: {
    position: "absolute",
    bottom: 48,
    color: "#FFFFFF",
  },
});
