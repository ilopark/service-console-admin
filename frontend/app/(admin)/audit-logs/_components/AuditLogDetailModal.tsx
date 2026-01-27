"use client";

import { useState } from "react";
import type { AuditLog } from "../_lib/auditLogs.types";

export default function AuditLogDetailModal({
  open,
  log,
  onClose,
}: {
  open: boolean;
  log: AuditLog | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!open || !log) return null;

  const jsonText = JSON.stringify(log, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Failed to copy");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[92vw] max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            Audit Log Detail
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            Close
          </button>
        </div>

        {/* JSON Viewer */}
        <pre className="mt-4 max-h-[60vh] overflow-auto rounded-lg bg-black/30 p-4 text-xs text-zinc-200">
{jsonText}
        </pre>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleCopy}
            className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900"
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
