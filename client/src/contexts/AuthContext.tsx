import { createContext, useContext, useState, type ReactNode } from "react";
import { type User, Role } from "@/types/auth";

const STORAGE_KEY = "auth_user";

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Ahmed Al-Rashidi", email: "ahmed@erp.com",    role: Role.SuperAdmin },
  { id: "u2", name: "Sarah Johnson",    email: "sarah@erp.com",    role: Role.Admin      },
  { id: "u3", name: "Mohammed Hassan",  email: "mohammed@erp.com", role: Role.Manager    },
  { id: "u4", name: "Layla Al-Farsi",   email: "layla@erp.com",    role: Role.Accountant },
  { id: "u5", name: "Omar Khalid",      email: "omar@erp.com",     role: Role.Viewer     },
  { id: "u6", name: "Sara Ahmed",       email: "sara@erp.com",     role: Role.Cashier    },
  { id: "u7", name: "Alex Johnson",     email: "alex@erp.com",     role: Role.Cashier    },
];

export const ROLE_DISPLAY: Record<Role, { label: string; color: string; bg: string }> = {
  [Role.SuperAdmin]: { label: "Super Admin", color: "#7C3AED", bg: "#F5F3FF" },
  [Role.Admin]:      { label: "Admin",       color: "#1D4ED8", bg: "#EFF6FF" },
  [Role.Manager]:    { label: "Manager",     color: "#047857", bg: "#ECFDF5" },
  [Role.Accountant]: { label: "Accountant",  color: "#B45309", bg: "#FFFBEB" },
  [Role.Viewer]:     { label: "Viewer",      color: "#6B7280", bg: "#F9FAFB" },
  [Role.Cashier]:    { label: "Cashier",     color: "#C2410C", bg: "#FFF7ED" },
};

interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isCashier: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    localStorage.setItem("auth_token", "mock-jwt-token");
    localStorage.setItem("app-branch", "hq");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isCashier: user?.role === Role.Cashier,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
