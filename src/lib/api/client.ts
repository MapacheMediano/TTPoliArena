const BASE_URL = ""; // Next.js mismo servidor, no necesita host

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    // Crítico: envía la cookie de sesión en cada request
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  // Si el servidor responde con error HTTP, lanzamos para manejarlo en el servicio
  if (!res.ok && !data.ok) {
    throw new Error(data.error ?? "Error desconocido del servidor");
  }

  return data as T;
}