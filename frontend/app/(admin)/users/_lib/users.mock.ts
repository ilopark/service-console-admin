import type { UserRow } from "./users.types";

export const mockUsers: UserRow[] = [
  {
    id: "user_1",
    email: "admin@opshub.io",
    name: "Admin",
    status: "ACTIVE",
    roleIds: ["role_admin"],
    updatedAt: "2026-01-26",
  },
  {
    id: "user_2",
    email: "support@opshub.io",
    name: "Support",
    status: "INACTIVE",
    roleIds: ["role_support"],
    updatedAt: "2026-01-26",
  },
  {
    id: "user_3",
    email: "viewer@opshub.io",
    name: "Viewer",
    status: "PENDING",
    roleIds: ["role_viewer"],
    updatedAt: "2026-01-26",
  },
];
