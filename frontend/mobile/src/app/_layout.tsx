import { Stack } from "expo-router";

import { SessionProvider } from "@/lib/session";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Odorem" }} />
        <Stack.Screen name="scan" options={{ title: "Scan" }} />
        <Stack.Screen name="perfumes" options={{ title: "Catalogue" }} />
        <Stack.Screen name="collection" options={{ title: "Ma collection" }} />
        <Stack.Screen name="perfume/[id]" options={{ title: "Parfum" }} />
      </Stack>
    </SessionProvider>
  );
}
