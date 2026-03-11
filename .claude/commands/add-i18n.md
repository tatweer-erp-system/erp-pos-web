# Add i18n translations

Add translation keys for `$ARGUMENTS` (feature or component name).

## Steps

1. Find the i18n/translations system used in the POS module (search for `usePOSTranslations`)
2. Search for any hardcoded English strings in the target files
3. Add corresponding keys to both English and Arabic translations
   - Arabic must be proper Arabic, not transliterated
4. Replace hardcoded strings with translation function calls
5. Ensure RTL layout is properly handled for Arabic
6. Run `pnpm lint` to verify
