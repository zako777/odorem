import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { ApiError, request } from "./api";

export type User = {
  id: number;
  email: string;
  fullName: string | null;
};

export type Session = { token: string; user: User };

type SessionContextValue = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SESSION_KEY = "odorem.session";
const SessionContext = createContext<SessionContextValue | null>(null);

async function storeSession(session: Session | null) {
  if (session) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

function readSession(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const stored = await SecureStore.getItemAsync(SESSION_KEY).catch(
        () => null,
      );
      const restored = readSession(stored);
      if (!active) return;
      setSession(restored);
      setLoading(false);
      if (!restored) return;

      try {
        const user = await request<User>(
          "/api/v1/account/profile",
          {},
          restored.token,
        );
        if (!active) return;
        const refreshed = { token: restored.token, user };
        setSession(refreshed);
        await storeSession(refreshed);
      } catch (error) {
        // A network failure must not erase a valid local session.
        if (error instanceof ApiError && error.kind === "unauthorized") {
          if (active) setSession(null);
          await storeSession(null);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token, user } = await request<{ token: string; user: User }>(
      "/api/v1/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      },
    );
    const next = { token, user };
    await storeSession(next);
    setSession(next);
  };

  const signOut = async () => {
    if (session) {
      await request("/api/v1/account/logout", { method: "POST" }, session.token).catch(
        () => {},
      );
    }
    await storeSession(null);
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return value;
}
