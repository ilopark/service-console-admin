export type RoleType = "system" | "custom";

export type RoleRow = {
  id: string;
  name: string;
  description?: string;
  type: RoleType;
  userCount: number;
  updatedAt: string;
};
