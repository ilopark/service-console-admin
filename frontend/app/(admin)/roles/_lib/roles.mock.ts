export type RoleRow = {
  id: string;
  name: string;
  description: string;
  type: "system" | "custom";
  userCount: number;
  updatedAt: string;
};

export const mockRoles: RoleRow[] = [
  {
    id: "role_admin",
    name: "ADMIN",
    description: "Full access to admin console",
    type: "system",
    userCount: 3,
    updatedAt: "2026-01-23",
  },
  {
    id: "role_support",
    name: "SUPPORT",
    description: "Can view users and reset passwords",
    type: "custom",
    userCount: 12,
    updatedAt: "2026-01-22",
  },
  {
    id: "role_viewer",
    name: "VIEWER",
    description: "Read-only access",
    type: "system",
    userCount: 58,
    updatedAt: "2026-01-20",
  },
];
