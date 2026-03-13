# Global Contexts

Application-wide React contexts used across all modules.

---

## AuthContext.tsx

Manages ERP user authentication (the main application login — separate from cashier PIN authentication).

### What it provides

```ts
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isCashier: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### Usage

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
}
```

### User Roles

| Role         | Description           | Access Level  |
| ------------ | --------------------- | ------------- |
| `SuperAdmin` | Full system access    | All modules   |
| `Admin`      | Administrative access | Most modules  |
| `Manager`    | Branch management     | POS + reports |
| `Accountant` | Financial reporting   | Reports only  |
| `Viewer`     | Read-only access      | View only     |
| `Cashier`    | POS terminal only     | POS module    |

Role permissions are defined in `types/auth.ts` as `ROLE_PERMISSIONS` matrix.

### Mock Users (Development)

| Username   | Password | Role       |
| ---------- | -------- | ---------- |
| admin      | admin123 | SuperAdmin |
| manager    | mgr123   | Manager    |
| cashier    | cash123  | Cashier    |
| accountant | acc123   | Accountant |

### Notes

- Authentication state is stored in memory (no persistence on refresh — by design for development)
- Replace `login()` implementation with real API call when backend is ready
- `isCashier` flag is a convenience for quick role checking in POS components

---

## AppSettingsContext.tsx

Manages global app settings that affect appearance and behavior across all modules.

### What it provides

```ts
interface AppSettingsContextValue {
  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  colorPreset: ColorPreset;
  setColorPreset: (preset: ColorPreset) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;

  // Localization
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
  financialYear: string;
  setFinancialYear: (year: string) => void;

  // Organization
  branch: Branch;
  setBranch: (branch: Branch) => void;

  // POS Display
  cardStyle: "card" | "compact" | "list";
  setCardStyle: (style: "card" | "compact" | "list") => void;
  gridColumns: 2 | 3 | 4 | 5;
  setGridColumns: (cols: 2 | 3 | 4 | 5) => void;
}
```

### Usage

```tsx
import { useAppSettings } from "@/contexts/AppSettingsContext";

function MyComponent() {
  const { language, theme, branch } = useAppSettings();
  const isRTL = language === "ar";
}
```

### Color Presets

| Name     | Primary Color | Description  |
| -------- | ------------- | ------------ |
| Ocean    | `#0EA5E9`     | Blue theme   |
| Forest   | `#22C55E`     | Green theme  |
| Sunset   | `#F97316`     | Orange theme |
| Amethyst | `#A855F7`     | Purple theme |
| Slate    | `#64748B`     | Gray theme   |

### Branches

| ID       | Name   | Timezone |
| -------- | ------ | -------- |
| `hq`     | HQ     | UTC+2    |
| `cairo`  | Cairo  | UTC+2    |
| `dubai`  | Dubai  | UTC+4    |
| `london` | London | UTC+0    |

### POS Display Styles

| Style     | Description                                  |
| --------- | -------------------------------------------- |
| `card`    | Large product cards with image and full info |
| `compact` | Medium cards, less whitespace                |
| `list`    | Dense list view, maximum items visible       |

### Persistence

Settings are persisted to `localStorage` and restored on page load. Keys:

- `app-theme` — light/dark
- `app-color-preset` — selected preset name
- `app-language` — en/ar
- `app-branch` — branch id

### RTL Integration

When `language === "ar"`, the root Ant Design `ConfigProvider` switches to RTL mode, which automatically flips all Ant Design components. Custom HTML elements need manual `dir="rtl"` attributes.

CSS variables `--card`, `--background`, etc. are set in `index.css` and respond to the `dark` class on the document root (managed by `next-themes`).
