import { Suspense, lazy } from "react";
import { useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { PageSkeleton } from "./components/common/LoadingSkeleton";
import Login from "@/pages/Login";
const POSPage = lazy(() => import("@/modules/pos/POSPage"));
const CustomerDisplayScreen = lazy(
  () => import("@/modules/pos/pages/CustomerDisplayScreen")
);
const TablesPage = lazy(() => import("@/modules/pos/pages/TablesPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuthContext();

  // ── Unauthenticated ───────────────────────────────────────────────────────
  if (!isAuthenticated && location !== "/login") {
    return <Redirect to="/login" />;
  }

  // ── Login page ────────────────────────────────────────────────────────────
  if (location === "/login") {
    if (user) return <Redirect to="/pos" />;
    return <Login />;
  }

  // ── Root redirect → POS ───────────────────────────────────────────────────
  if (location === "/") {
    return <Redirect to="/pos" />;
  }

  // ── Customer display (separate window, no auth guard) ─────────────────────
  if (location === "/pos/customer-display") {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <CustomerDisplayScreen />
      </Suspense>
    );
  }

  // ── Tables page ───────────────────────────────────────────────────────────
  if (location === "/pos/tables") {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <TablesPage />
      </Suspense>
    );
  }

  // ── Main POS terminal ─────────────────────────────────────────────────────
  if (location === "/pos") {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <POSPage />
      </Suspense>
    );
  }

  // ── Fallback → POS ────────────────────────────────────────────────────────
  return <Redirect to="/pos" />;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppSettingsProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AppSettingsProvider>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
