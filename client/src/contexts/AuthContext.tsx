import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  type User,
  type Tenant,
  type Branch,
  type LoginResponse,
  Role,
} from "@/types/auth";
import { setTokens, clearTokens } from "@/lib/token";
import { authService } from "@/services/auth.service";

const USER_KEY = "auth_user";
const TENANT_KEY = "auth_tenant";
const BRANCHES_KEY = "auth_branches";
const BRANCH_KEY = "app-branch";

export const ROLE_DISPLAY: Record<
  Role,
  { label: string; color: string; bg: string }
> = {
  [Role.SuperAdmin]: { label: "Super Admin", color: "#7C3AED", bg: "#F5F3FF" },
  [Role.Admin]: { label: "Admin", color: "#1D4ED8", bg: "#EFF6FF" },
  [Role.Manager]: { label: "Manager", color: "#047857", bg: "#ECFDF5" },
  [Role.Accountant]: { label: "Accountant", color: "#B45309", bg: "#FFFBEB" },
  [Role.Viewer]: { label: "Viewer", color: "#6B7280", bg: "#F9FAFB" },
  [Role.Cashier]: { label: "Cashier", color: "#C2410C", bg: "#FFF7ED" },
};

// ─── Safe JSON parse helper ─────────────────────────────────────────────────
function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// ─── Context value ──────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  tenant: Tenant | null;
  branches: Branch[];
  selectedBranch: Branch | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCashier: boolean;
  login: (response: LoginResponse) => void;
  logout: () => Promise<void>;
  selectBranch: (branch: Branch) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadJson<User>(USER_KEY));
  const [tenant, setTenant] = useState<Tenant | null>(() =>
    loadJson<Tenant>(TENANT_KEY)
  );
  const [branches, setBranches] = useState<Branch[]>(
    () => loadJson<Branch[]>(BRANCHES_KEY) ?? []
  );
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(() => {
    const branchId = localStorage.getItem(BRANCH_KEY);
    const stored = loadJson<Branch[]>(BRANCHES_KEY) ?? [];
    return stored.find(b => b.id === branchId) ?? null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((response: LoginResponse) => {
    const {
      accessToken,
      refreshToken,
      user: u,
      tenant: t,
      branches: b,
    } = response;
    setTokens(accessToken, refreshToken);
    setUser(u);
    setTenant(t);
    setBranches(b);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.setItem(TENANT_KEY, JSON.stringify(t));
    localStorage.setItem(BRANCHES_KEY, JSON.stringify(b));
  }, []);

  const selectBranch = useCallback((branch: Branch) => {
    setSelectedBranch(branch);
    localStorage.setItem(BRANCH_KEY, branch.id);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Best-effort server logout; clear locally regardless
    } finally {
      clearTokens();
      setUser(null);
      setTenant(null);
      setBranches([]);
      setSelectedBranch(null);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TENANT_KEY);
      localStorage.removeItem(BRANCHES_KEY);
      localStorage.removeItem(BRANCH_KEY);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        branches,
        selectedBranch,
        isAuthenticated: !!user && !!selectedBranch,
        isLoading,
        isCashier: user?.role === Role.Cashier,
        login,
        logout,
        selectBranch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
