// OAuth / session constants (moved from client/src/const.ts)
export const COOKIE_NAME = "app_session_id";

export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  return `${oauthPortalUrl}/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Query cache times
export const STALE_TIME_STANDARD = 5 * 60 * 1000;   // 5 minutes
export const STALE_TIME_STATIC   = 30 * 60 * 1000;  // 30 minutes (rarely-changing data)
