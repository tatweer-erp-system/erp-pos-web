import apiClient from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { LoginResponse, RefreshResponse } from "@/types/auth";

export type { Branch } from "@/types/auth";

export const authService = {
  login: (email: string, password: string) =>
    apiClient
      .post<ApiResponse<LoginResponse>>("/auth/login", { email, password })
      .then(r => r.data.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<ApiResponse<RefreshResponse>>("/auth/refresh", { refreshToken })
      .then(r => r.data.data),

  logout: () =>
    apiClient.post<ApiResponse<void>>("/auth/logout").then(r => r.data),
};
