import { CameraView, useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

function normalizeBarcode(value: string): string | null {
  const code = value.trim();
  return /^\d{8,14}$/.test(code) ? code : null;
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
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

  if (scannedCode) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Code détecté</Text>
        <Text style={styles.code}>{scannedCode}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => {
            locked.current = false;
            setScannedCode(null);
          }}
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
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={({ data }) => {
          if (locked.current) return;
          const code = normalizeBarcode(data);
          if (!code) return;
          locked.current = true;
          setScannedCode(code);
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
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  code: {
    fontSize: 24,
    fontVariant: ["tabular-nums"],
    marginBottom: 24,
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
