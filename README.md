# ERP POS Web

A modern, feature-rich Point of Sale (POS) system built with React 19 and TypeScript. Designed for retail and restaurant operations with offline-first capabilities and full Arabic/English RTL/LTR support.

---

## Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | React 19 + TypeScript 5.6                      |
| Build           | Vite 7                                         |
| State           | Zustand (POS), Context API (Auth, AppSettings) |
| UI              | Ant Design 6 + shadcn/ui (Radix UI)            |
| Forms           | React Hook Form + Zod                          |
| Data Fetching   | TanStack Query + Axios                         |
| Routing         | Wouter                                         |
| Styling         | Tailwind CSS 4                                 |
| Animations      | Framer Motion                                  |
| Charts          | Recharts                                       |
| Tables          | TanStack Table                                 |
| Offline         | IndexedDB (idb)                                |
| Package Manager | pnpm                                           |

---

## Getting Started

### Prerequisites

- Node.js (via nvm) — v23.7.0 recommended
- pnpm

### Install dependencies

```bash
pnpm install
```

### Run development server (port 4201)

```bash
PATH="$HOME/.nvm/versions/node/v23.7.0/bin:$PATH" pnpm dev --port 4201
```

App runs at: http://localhost:4201/

### Build for production

```bash
pnpm build
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_API_URL=http://your-backend-api
```

---

## Project Structure

```
erp-pos-web/
├── client/
│   └── src/
│       ├── main.tsx                  # App entry point
│       ├── App.tsx                   # Root component, routing, providers
│       ├── index.css                 # Global styles, CSS variables
│       ├── pages/
│       │   └── Login.tsx             # Authentication page
│       ├── contexts/
│       │   ├── AuthContext.tsx       # User auth state
│       │   └── AppSettingsContext.tsx # Theme, language, branch settings
│       ├── components/
│       │   ├── ui/                   # 52 shadcn/ui primitive components
│       │   ├── common/               # Shared components (skeletons, etc.)
│       │   └── ErrorBoundary.tsx
│       ├── lib/
│       │   ├── utils.ts              # cn() class merging utility
│       │   ├── constants.ts          # App-wide constants
│       │   ├── api.ts                # API client
│       │   └── antd-provider.tsx     # Ant Design theme provider
│       ├── types/
│       │   ├── auth.ts               # User, Role, Permission types
│       │   └── api.ts                # API response types
│       └── modules/
│           └── pos/                  # Point of Sale module (see modules/pos/README.md)
├── vite.config.ts
├── tsconfig.json
├── components.json                   # shadcn/ui config
├── .prettierrc
└── eslint.config.js
```

---

## Modules

### POS (Point of Sale)

The core module. See [`client/src/modules/pos/README.md`](client/src/modules/pos/README.md) for full documentation.

**Features:**

- Multi-order management (up to 10 concurrent orders)
- Cash / Card / Split payment processing
- Customer loyalty program (4 tiers)
- Voucher & gift card support
- Restaurant table management with kitchen tickets
- Cashier PIN authentication & session locking
- Offline-first with IndexedDB + sync
- Full Arabic/English localization (RTL/LTR)
- Sales & cash movement reports

---

## Authentication

Mock user roster (development only):

| Role       | Credentials         |
| ---------- | ------------------- |
| SuperAdmin | admin / admin123    |
| Manager    | manager / mgr123    |
| Cashier    | cashier / cash123   |
| Accountant | accountant / acc123 |

Roles: `SuperAdmin`, `Admin`, `Manager`, `Accountant`, `Viewer`, `Cashier`

---

## Theme & Localization

- **Color Presets**: Ocean, Forest, Sunset, Amethyst, Slate
- **Light / Dark mode** toggle
- **Languages**: English (LTR) and Arabic (RTL)
- **Branches**: HQ, Cairo, Dubai, London
- Settings persist via `AppSettingsContext`

---

## Code Conventions

- **Path alias**: `@/` maps to `client/src/`
- **Component files**: PascalCase `.tsx`
- **Hooks**: `use` prefix, camelCase
- **Services**: camelCase, one domain per file
- **i18n**: All UI strings go through `usePOSTranslations(language)` — no hardcoded strings
- **RTL**: Use CSS logical properties (`insetInlineEnd`, `textAlign: "end"`) and `dir` attribute on custom HTML wrappers
- **Responsive**: Use `Grid.useBreakpoint()` from Ant Design for JS-level breakpoints
- **Formatting**: Prettier (2-space indent, 80-char line width)

---

## Current Status

> All backend services are **mocked** in-memory for frontend development.
> Data resets on page refresh. Replace service files with real API calls when backend is ready.

See [`business-design.txt`](business-design.txt) for full business & design documentation.
