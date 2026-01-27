import type { AuditLog } from "./auditLogs.types";

export const mockAuditLogs: AuditLog[] = [
  {
    id: "log_1",
    action: "ROLE_CREATED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actor: {
      id: "admin_1",
      name: "Admin",
      email: "admin@opshub.io",
    },
    target: {
      type: "role",
      id: "role_admin",
      label: "Admin",
    },
    meta: {
      type: "system",
    },
  },
  {
    id: "log_2",
    action: "USER_INVITED",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    actor: {
      id: "admin_1",
      name: "Admin",
      email: "admin@opshub.io",
    },
    target: {
      type: "user",
      id: "user_pending_1",
      label: "viewer@opshub.io",
    },
    meta: {
      status: "pending",
    },
  },
];
