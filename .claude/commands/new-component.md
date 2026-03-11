# Create a new component

Create a new reusable component named `$ARGUMENTS`.

## Steps

1. Read existing components to understand the project's patterns
2. Determine the right location:
   - `client/src/components/ui/` for shadcn/Radix primitives
   - `client/src/components/common/` for shared components
   - `client/src/modules/pos/components/` for POS-specific components
3. Create the component with:
   - TypeScript props interface
   - `cn()` utility for Tailwind class merging
   - Framer Motion animations where appropriate
   - All strings through `usePOSTranslations` i18n
   - RTL-aware using CSS logical properties
4. Run `pnpm lint` to verify
