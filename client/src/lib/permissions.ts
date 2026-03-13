import { useMemo } from "react";

/**
 * Check if a permission list grants access for a required permission.
 * Supports wildcard: `["*"]` grants everything.
 * Supports partial wildcards: `"inventory:*"` matches `"inventory:read"`.
 */
export function hasPermission(
  userPermissions: readonly string[],
  required: string
): boolean {
  if (userPermissions.includes("*")) return true;
  if (userPermissions.includes(required)) return true;

  // Check partial wildcard (e.g., "inventory:*" matching "inventory:read")
  const [module] = required.split(":");
  return userPermissions.includes(`${module}:*`);
}

/**
 * Check if a permission list grants access for ALL required permissions.
 */
export function hasAllPermissions(
  userPermissions: readonly string[],
  required: string[]
): boolean {
  return required.every(p => hasPermission(userPermissions, p));
}

/**
 * Check if a permission list grants access for ANY of the required permissions.
 */
export function hasAnyPermission(
  userPermissions: readonly string[],
  required: string[]
): boolean {
  return required.some(p => hasPermission(userPermissions, p));
}

/**
 * React hook: check a single permission against the provided permissions array.
 */
export function usePermission(
  userPermissions: readonly string[] | undefined,
  required: string
): boolean {
  return useMemo(
    () => (userPermissions ? hasPermission(userPermissions, required) : false),
    [userPermissions, required]
  );
}
