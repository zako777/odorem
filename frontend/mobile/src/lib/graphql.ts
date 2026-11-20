import { ApiError, request } from "./api";

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: { message: string; extensions?: { code?: string } }[];
};

export async function gqlRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string,
): Promise<T> {
  const payload = await request<GraphQLResponse<T>>(
    "/graphql",
    { method: "POST", body: JSON.stringify({ query, variables }) },
    token,
  );

  if (payload.errors?.length) {
    const unauthorized = payload.errors.some(
      ({ extensions }) =>
        extensions?.code === "UNAUTHENTICATED" ||
        extensions?.code === "UNAUTHORIZED",
    );
    throw new ApiError(unauthorized ? "unauthorized" : "invalid");
  }

  if (!payload.data) throw new ApiError("invalid");
  return payload.data;
}
