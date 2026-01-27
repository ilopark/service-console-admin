"use client";

import type { AuditLog } from "../_lib/auditLogs.types";

function summarize(log: AuditLog) {
  const t = log.target.label;
  switch (log.action) {
    case "USER_INVITED":
      return `Invited ${t}`;
    case "USER_INVITE_RESENT":
      return `Resent invite to ${t}`;
    case "USER_INVITE_REVOKED":
      return `Revoked invite for ${t}`;
    case "USER_ROLES_UPDATED":
      return `Updated roles for ${t}`;
    case "USER_STATUS_UPDATED":
      return `Updated status for ${t}`;
    case "ROLE_CREATED":
      return `Created role ${t}`;
    case "ROLE_UPDATED":
      return `Updated role ${t}`;
    case "ROLE_DELETED":
      return `Deleted role ${t}`;
    default:
      return log.action;
  }
}

export default function AuditLogsTable({
  rows,
  onSelect,
}: {
  rows: AuditLog[];
  onSelect: (log: AuditLog) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-950 text-zinc-400">
          <tr>
            <th className="px-4 py-3 text-left">Time</th>
            <th className="px-4 py-3 text-left">Action</th>
            <th className="px-4 py-3 text-left">Target</th>
            <th className="px-4 py-3 text-left">Actor</th>
            <th className="px-4 py-3 text-left">Summary</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {rows.map((log) => (
            <tr
              key={log.id}
              onClick={() => onSelect(log)}
              className="cursor-pointer hover:bg-zinc-900/40"
            >
              <td className="px-4 py-3 text-xs text-zinc-400">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-xs">{log.action}</td>
              <td className="px-4 py-3 text-xs">{log.target.label}</td>
              <td className="px-4 py-3 text-xs">{log.actor.name}</td>
              <td className="px-4 py-3 text-xs text-zinc-300">
                {summarize(log)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
