# Create a new API service

Create a new API service for `$ARGUMENTS`.

## Steps

1. Read `client/src/lib/api.ts` and existing services to follow the pattern
2. Create the service file with:
   - Import the configured axios instance from `@/lib/api`
   - TypeScript interfaces for request/response types
   - CRUD functions with `/api/v1/` prefix
   - Offline-first support using IndexedDB (idb) where appropriate
3. Create React Query hooks for data fetching and mutations
4. Run `pnpm lint` to verify
