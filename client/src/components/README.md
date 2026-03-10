# Shared Components

Reusable UI components shared across all modules.

---

## Directory Structure

```
components/
├── ErrorBoundary.tsx        # React error boundary wrapper
├── common/
│   └── LoadingSkeleton.tsx  # Skeleton loaders for tables and card grids
└── ui/                      # shadcn/ui primitive components (52 files)
    ├── button.tsx
    ├── input.tsx
    ├── select.tsx
    ├── checkbox.tsx
    ├── radio-group.tsx
    ├── switch.tsx
    ├── toggle.tsx
    ├── form.tsx
    ├── label.tsx
    ├── dialog.tsx
    ├── alert-dialog.tsx
    ├── sheet.tsx
    ├── drawer.tsx
    ├── popover.tsx
    ├── tooltip.tsx
    ├── hover-card.tsx
    ├── dropdown-menu.tsx
    ├── context-menu.tsx
    ├── menubar.tsx
    ├── navigation-menu.tsx
    ├── tabs.tsx
    ├── accordion.tsx
    ├── collapsible.tsx
    ├── table.tsx
    ├── pagination.tsx
    ├── breadcrumb.tsx
    ├── carousel.tsx
    ├── aspect-ratio.tsx
    ├── resizable.tsx
    ├── separator.tsx
    ├── skeleton.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── card.tsx
    ├── progress.tsx
    ├── slider.tsx
    ├── scroll-area.tsx
    ├── textarea.tsx
    ├── input-otp.tsx
    ├── calendar.tsx
    ├── date-picker.tsx (if present)
    ├── chart.tsx
    ├── sonner.tsx           # Toast notifications
    ├── empty.tsx            # Empty state component
    ├── spinner.tsx          # Loading spinner
    ├── kbd.tsx              # Keyboard shortcut display
    └── command.tsx          # Command palette
```

---

## ErrorBoundary.tsx

Catches JavaScript errors in any child component tree and displays a fallback UI.

```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

<ErrorBoundary>
  <MyFeature />
</ErrorBoundary>
```

Used in `App.tsx` to wrap route-level components.

---

## LoadingSkeleton.tsx

Skeleton loaders for common layout patterns.

```tsx
import { TableSkeleton, CardGridSkeleton } from "@/components/common/LoadingSkeleton";

// For a data table
<TableSkeleton rows={10} columns={5} />

// For a product grid
<CardGridSkeleton count={12} />
```

---

## ui/ — shadcn/ui Components

These are **unstyled, accessible primitives** built on Radix UI. They use Tailwind CSS for styling and are configured via `components.json`.

### Key Components

#### Forms
- `Button` — Standard button with variants (default, destructive, outline, ghost, link)
- `Input` — Text input field
- `Textarea` — Multi-line text input
- `Select` — Dropdown selector
- `Checkbox` — Boolean checkbox
- `RadioGroup` + `RadioGroupItem` — Radio button group
- `Switch` — Toggle switch
- `Toggle` — Toggle button
- `Slider` — Range slider
- `InputOTP` — One-time password / PIN entry
- `Form` — React Hook Form integration with validation display
- `Label` — Accessible form label

#### Layout & Navigation
- `Tabs` — Tab panels
- `Accordion` — Collapsible sections
- `Collapsible` — Single collapsible section
- `Separator` — Visual divider
- `ScrollArea` — Custom scrollbar container
- `Breadcrumb` — Navigation breadcrumb trail
- `NavigationMenu` — Complex navigation structure
- `Pagination` — Page number navigation

#### Overlays & Dialogs
- `Dialog` — Modal dialog (controlled)
- `AlertDialog` — Confirmation dialog with cancel/confirm
- `Sheet` — Side panel (drawer that slides in from edge)
- `Drawer` — Bottom/side drawer (mobile-optimized)
- `Popover` — Floating content panel
- `Tooltip` — Hover hint
- `HoverCard` — Rich hover preview card

#### Data Display
- `Table` — Accessible HTML table with head/body/row/cell components
- `Card` — Content card with header, content, footer
- `Badge` — Status badge / tag
- `Avatar` — User/entity avatar with fallback
- `Carousel` — Scrollable item carousel
- `AspectRatio` — Maintain aspect ratio container
- `Chart` — Recharts wrapper with theme support
- `Calendar` — Date picker calendar

#### Menus
- `DropdownMenu` — Click-triggered dropdown menu
- `ContextMenu` — Right-click context menu
- `Menubar` — Horizontal application menu bar
- `Command` — Command palette with fuzzy search

#### Feedback
- `Sonner` — Toast notification system
- `Skeleton` — Placeholder loading animation
- `Progress` — Progress bar
- `Spinner` — Loading spinner
- `Empty` — Empty state display

#### Other
- `Resizable` — Resizable panel layout (split pane)
- `Kbd` — Keyboard shortcut display
- `InputOTP` — OTP / PIN entry with segmented inputs

---

## Using shadcn/ui vs Ant Design

This project uses **both** Ant Design and shadcn/ui. Here's when to use each:

| Use Ant Design | Use shadcn/ui |
|----------------|---------------|
| POS modals and forms | General app UI |
| Data tables | Settings panels |
| Date pickers in POS | Command palette |
| Notifications (message.success) | Toasts (Sonner) |
| Complex form validation in POS | React Hook Form + Zod |
| When existing POS code uses it | New non-POS features |

The Ant Design `ConfigProvider` in `lib/antd-provider.tsx` applies the active theme preset and RTL direction globally to all Ant Design components.

---

## Adding New shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

This generates the component file in `client/src/components/ui/` with full TypeScript types and Tailwind styling, ready to customize.
