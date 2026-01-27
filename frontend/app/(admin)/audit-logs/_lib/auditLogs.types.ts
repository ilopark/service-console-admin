export type AuditAction =
  | "USER_INVITED"
  | "USER_INVITE_RESENT"
  | "USER_INVITE_REVOKED"
  | "USER_ROLES_UPDATED"
  | "USER_STATUS_UPDATED"
  | "ROLE_CREATED"
  | "ROLE_UPDATED"
  | "ROLE_DELETED";

export type AuditActor = {
  id: string;
  name: string;
  email?: string;
};

export type AuditTargetType = "user" | "role";

export type AuditTarget = {
  type: AuditTargetType;
  id: string;
  label: string; // user: email / role: role name
};

export type AuditLog = {
  id: string;
  action: AuditAction;
  createdAt: string; // ISO
  actor: AuditActor;
  target: AuditTarget;
  meta?: Record<string, unknown>;
};

// page.tsx / store에서 쓰기용
export type AuditLogInput = Omit<AuditLog, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};
