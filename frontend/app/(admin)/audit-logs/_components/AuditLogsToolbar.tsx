"use client";

import type { AuditAction } from "../_lib/auditLogs.types";

export default function AuditLogsToolbar({
  query,
  onQueryChange,
  action,
  onActionChange,
  range,
  onRangeChange,
  onClear,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  action: "all" | AuditAction;
  onActionChange: (v: "all" | AuditAction) => void;
  range: "all" | "7d" | "30d";
  onRangeChange: (v: "all" | "7d" | "30d") => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="w-full sm:w-72 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          placeholder="Search target"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />

        <select
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          value={action}
          onChange={(e) => onActionChange(e.target.value as any)}
        >
          <option value="all">All actions</option>
          <option value="USER_INVITED">USER_INVITED</option>
          <option value="USER_INVITE_RESENT">USER_INVITE_RESENT</option>
          <option value="USER_INVITE_REVOKED">USER_INVITE_REVOKED</option>
          <option value="USER_ROLES_UPDATED">USER_ROLES_UPDATED</option>
          <option value="USER_STATUS_UPDATED">USER_STATUS_UPDATED</option>
          <option value="ROLE_CREATED">ROLE_CREATED</option>
          <option value="ROLE_UPDATED">ROLE_UPDATED</option>
          <option value="ROLE_DELETED">ROLE_DELETED</option>
        </select>

        <select
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          value={range}
          onChange={(e) => onRangeChange(e.target.value as any)}
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <button
        className="rounded-lg border border-zinc-800 px-3 py-2 text-xs"
        onClick={onClear}
      >
        Clear logs (demo)
      </button>
    </div>
  );
}
