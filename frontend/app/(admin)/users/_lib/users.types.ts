export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  roleIds: string[];
  updatedAt: string;
};
