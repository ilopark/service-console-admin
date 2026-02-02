"use client";

import type { RoleRow } from "../../roles/_lib/roles.types";
import type { UserStatus } from "../_lib/users.types";

export default function UsersToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  roleId,
  onRoleChange,
  roles,
  onCreate,
  createLabel,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  status: "all" | UserStatus;
  onStatusChange: (v: "all" | UserStatus) => void;
  roleId: "all" | string;
  onRoleChange: (v: "all" | string) => void;
  roles: RoleRow[];
  onCreate: () => void;
  createLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search users (name)"
          className="w-full sm:w-72 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as "all" | UserStatus)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={roleId}
            onChange={(e) => onRoleChange(e.target.value as "all" | string)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="all">All roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onCreate}
        className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950"
      >
        {createLabel ?? "Create User"}
      </button>
    </div>
  );
}