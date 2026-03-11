# Create a new POS page

Create a new page named `$ARGUMENTS` following the project's existing patterns.

## Steps

1. Read `client/src/App.tsx` for routing and existing page in `client/src/pages/` or `client/src/modules/pos/pages/`
2. Create the page component:
   - Use functional component with TypeScript
   - Add loading skeleton state
   - Add empty state
   - Use Ant Design for layout + shadcn/ui for primitives
   - Use `usePOSTranslations(language)` for all strings — no hardcoded text
   - Use CSS logical properties for RTL support
   - Lazy-loadable (default export)
3. Add the route in `client/src/App.tsx` Router component
4. If the page needs data, add methods to the POS service layer
5. Run `pnpm lint` to verify
