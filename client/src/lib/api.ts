import axios, { AxiosError } from "axios";
import type { ApiError } from "@/types/api";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

// ─── Request interceptor: attach Bearer token + X-Request-Id ─────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["X-Request-Id"] = crypto.randomUUID();
  return config;
});

// ─── Response interceptor: normalize errors + redirect on 401 ────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0;

    if (status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    const data = error.response?.data as Record<string, unknown> | undefined;

    const apiError: ApiError = {
      message: (data?.message as string) ?? error.message ?? "An unexpected error occurred",
      code: (data?.code as string) ?? "UNKNOWN_ERROR",
      field: data?.field as string | undefined,
      status,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
