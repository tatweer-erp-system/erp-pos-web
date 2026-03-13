import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types/api";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/lib/token";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

// ─── Request interceptor: attach Bearer token + X-Request-Id ─────────────────
apiClient.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["X-Request-Id"] = crypto.randomUUID();
  return config;
});

// ─── Response interceptor: silent refresh on 401 ─────────────────────────────
let refreshPromise: Promise<string> | null = null;

async function silentRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  // Import dynamically to avoid circular dependency
  const { authService } = await import("@/services/auth.service");
  const result = await authService.refresh(refreshToken);
  setTokens(result.accessToken, result.refreshToken);
  return result.accessToken;
}

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 → attempt silent refresh (once)
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Coalesce concurrent 401s into a single refresh call
        if (!refreshPromise) {
          refreshPromise = silentRefresh().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh failed → clear auth and redirect to login
        clearTokens();
        localStorage.removeItem("auth_user");
        localStorage.removeItem("app-branch");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    const data = error.response?.data as Record<string, unknown> | undefined;

    const apiError: ApiError = {
      message:
        (data?.message as string) ??
        error.message ??
        "An unexpected error occurred",
      code: (data?.code as string) ?? "UNKNOWN_ERROR",
      field: data?.field as string | undefined,
      status,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
