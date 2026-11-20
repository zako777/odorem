import Constants from "expo-constants";

function resolveApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // In development, Expo already knows the machine's LAN address.
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  return host ? `http://${host}:3333` : "http://localhost:3333";
}

export const apiUrl = resolveApiUrl().replace(/\/$/, "");

export type ApiErrorKind = "network" | "unauthorized" | "invalid" | "http";

export class ApiError extends Error {
  constructor(readonly kind: ApiErrorKind) {
    super(kind);
  }
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new ApiError("network");
  }

  if (response.status === 401) throw new ApiError("unauthorized");
  if (response.status === 422) throw new ApiError("invalid");
  if (!response.ok) throw new ApiError("http");

  return (await response.json()) as T;
}
