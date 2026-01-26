"use client";

import { useEffect, useState } from "react";
import type { RoleType } from "../_lib/roles.types";

export default function RoleCreateModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    description?: string;
    type: RoleType;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<RoleType>("custom");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setType("custom");
    setError(null);
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (!name.trim()) {
      setError("Role name is required");
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      type,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-[92vw] max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            Create Role
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            Esc
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="Role name"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as RoleType)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="custom">Custom</option>
            <option value="system">System</option>
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          />

          {error && (
            <div className="text-xs text-rose-300">{error}</div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-800 px-3 py-2 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
