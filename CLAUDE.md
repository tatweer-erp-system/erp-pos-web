# erp-pos-web — Tatweer POS Web Client

## Quick Reference
- **Package manager:** pnpm
- **Dev server:** `pnpm dev` (Vite, port 4201)
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **Type check:** `pnpm check` or `pnpm exec tsc --noEmit`
- **Format:** `pnpm format`

## Tech Stack
- React 19 + TypeScript 5.6 + Vite 7
- UI: Ant Design 6 + shadcn/ui (Radix UI) + Tailwind CSS 4
- State: Zustand (POS store) + React Context (Auth, AppSettings) + TanStack React Query 5
- Router: Wouter 3
- Forms: React Hook Form + Zod
- HTTP: Axios (Bearer auth)
- Animations: Framer Motion
- Offline: IndexedDB (idb)
- Tables: TanStack Table
- Charts: Recharts
- i18n: Custom `usePOSTranslations(lang)` — English + Arabic (RTL)

## Project Structure
```
client/src/
├── components/ui/        # 52 shadcn/ui primitive components
├── components/common/    # LoadingSkeleton, ErrorBoundary
├── pages/                # Login page
├── contexts/             # AuthContext, AppSettingsContext
├── lib/                  # api.ts, utils.ts, constants.ts, antd-provider.tsx
├── services/             # API service layer
├── types/                # auth.ts, api.ts
└── modules/pos/          # Core POS module (multi-order, payments, tables)
```

## Key Conventions
- **Naming:** Components → PascalCase, hooks → use*, constants → SCREAMING_SNAKE_CASE
- **Path alias:** `@/` maps to `client/src/`
- **API calls:** Always through service layer, never directly in components
- **Styling:** Tailwind utilities + Ant Design themed via AntProvider bridge
- **Code splitting:** Route components are lazy-loaded
- **State:** Server state in React Query, POS state in Zustand, auth/settings in Context
- **i18n:** All UI strings via `usePOSTranslations(language)` — no hardcoded strings
- **RTL:** Use CSS logical properties (`insetInlineEnd`, `textAlign: "end"`) and `dir` attribute

## Auth & Roles
- 6 roles: SuperAdmin, Admin, Manager, Accountant, Viewer, Cashier
- Mock auth with localStorage persistence (backend-ready service layer)
- PIN-based session lock for POS cashiers

## Theme
- 5 presets (Ocean, Forest, Sunset, Amethyst, Slate) × light/dark modes
- CSS variables on `:root` drive Tailwind + Ant Design theming
- Settings persisted via AppSettingsContext
