export enum Role {
  SuperAdmin = "superAdmin",
  Admin = "admin",
  Manager = "manager",
  Accountant = "accountant",
  Viewer = "viewer",
  Cashier = "cashier",
}

export type Permission =
  | "inventory:read" | "inventory:write" | "inventory:delete"
  | "sales:read" | "sales:write"
  | "purchases:read" | "purchases:write"
  | "accounting:read" | "accounting:write"
  | "treasury:read" | "treasury:write"
  | "reports:read"
  | "users:read" | "users:write" | "users:delete"
  | "settings:read" | "settings:write";

export const ROLE_PERMISSIONS: Record<Role, Permission[] | ["*"]> = {
  [Role.SuperAdmin]: ["*"],
  [Role.Admin]: [
    "inventory:read", "inventory:write",
    "sales:read", "sales:write",
    "purchases:read", "purchases:write",
    "accounting:read",
    "treasury:read",
    "reports:read",
    "users:read", "users:write",
    "settings:read", "settings:write",
  ],
  [Role.Manager]: [
    "inventory:read",
    "sales:read", "sales:write",
    "purchases:read",
    "reports:read",
  ],
  [Role.Accountant]: [
    "accounting:read", "accounting:write",
    "treasury:read", "treasury:write",
    "reports:read",
  ],
  [Role.Viewer]: [
    "inventory:read",
    "sales:read",
    "purchases:read",
    "reports:read",
  ],
  [Role.Cashier]: [], // No ERP permissions — POS terminal only
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  permissions: string[];
  avatarUrl?: string | null;
  preferredLang?: string;
}

export interface Tenant {
  slug: string;
  name: string;
  logo?: string | null;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  tenant: Tenant;
  branches: Branch[];
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
