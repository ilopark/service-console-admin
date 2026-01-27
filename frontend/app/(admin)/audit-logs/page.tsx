"use client";

import { useMemo, useState } from "react";
import AuditLogsToolbar from "./_components/AuditLogsToolbar";
import AuditLogsTable from "./_components/AuditLogsTable";
import AuditLogDetailModal from "./_components/AuditLogDetailModal";
import { clearAuditLogs, useAuditLogs } from "./_lib/auditLogs.store";
import type { AuditAction, AuditLog } from "./_lib/auditLogs.types";

export default function AuditLogsPage() {
  const logs = useAuditLogs();

  const [query, setQuery] = useState("");
  const [action, setAction] = useState<"all" | AuditAction>("all");
  const [range, setRange] = useState<"all" | "7d" | "30d">("all");
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();
    const minTime =
      range === "7d"
        ? now - 1000 * 60 * 60 * 24 * 7
        : range === "30d"
        ? now - 1000 * 60 * 60 * 24 * 30
        : 0;

    return logs
      .filter((l) => (action === "all" ? true : l.action === action))
      .filter((l) =>
        minTime ? new Date(l.createdAt).getTime() >= minTime : true
      )
      .filter((l) =>
        q ? l.target.label.toLowerCase().includes(q) : true
      );
  }, [logs, query, action, range]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>

      <AuditLogsToolbar
        query={query}
        onQueryChange={setQuery}
        action={action}
        onActionChange={setAction}
        range={range}
        onRangeChange={setRange}
        onClear={() => {
          if (confirm("Clear all logs? (demo only)")) {
            clearAuditLogs();
          }
        }}
      />

      <AuditLogsTable rows={rows} onSelect={setSelected} />

      <AuditLogDetailModal
        open={!!selected}
        log={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
