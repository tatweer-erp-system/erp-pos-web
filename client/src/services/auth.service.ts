import apiClient from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/auth";

export interface LoginBranch {
  id: string;
  name: string;
  location: string;
  initials: string;
}

export interface LoginResponse {
  token: string;
  branches: LoginBranch[];
}

const MOCK_BRANCHES: LoginBranch[] = [
  { id: "hq",  name: "Main Branch",   location: "New York, USA",  initials: "HQ" },
  { id: "cai", name: "Cairo Branch",  location: "Cairo, Egypt",   initials: "CA" },
  { id: "dxb", name: "Dubai Branch",  location: "Dubai, UAE",     initials: "DB" },
  { id: "lon", name: "London Branch", location: "London, UK",     initials: "LN" },
];

export const authService = {
  // ── Login ────────────────────────────────────────────────────────────────
  // Mock: emails containing "single" return 1 branch, all others return 4.
  // Replace this with a real API call when the backend is ready:
  //   apiClient.post<ApiResponse<LoginResponse>>("/auth/login", { email, password }).then(r => r.data)
  login: async (email: string, _password: string): Promise<LoginResponse> => {
    await new Promise((r) => setTimeout(r, 1100)); // simulate network
    const branches = email.includes("single") ? [MOCK_BRANCHES[0]] : MOCK_BRANCHES;
    return { token: "mock-jwt-token", branches };
  },

  me: () =>
    apiClient.get<ApiResponse<User>>("/auth/me").then((r) => r.data),

  logout: () =>
    apiClient.post<ApiResponse<void>>("/auth/logout").then((r) => r.data),
};
