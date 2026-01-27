"use client";

import { useEffect, useMemo, useState } from "react";
import type { RoleRow } from "../../roles/_lib/roles.types";
import type { UserRow, UserStatus } from "../_lib/users.types";

export default function UserCreateModal({
  open,
  mode,
  initial,
  roles,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: UserRow | null;
  roles: RoleRow[];
  onClose: () => void;
  onSubmit: (payload: {
    id?: string;
    email: string;
    name: string;
    status: UserStatus;
    roleIds: string[];
  }) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initial) {
      setEmail(initial.email ?? "");
      setName(initial.name ?? "");
      setStatus(initial.status);
      setRoleIds(initial.roleIds ?? []);
    } else {
      setEmail("");
      setName("");
      setStatus("ACTIVE");
      setRoleIds([]);
    }

    setError(null);
  }, [open, mode, initial]);

  const roleMap = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);

  const toggleRole = (id: string) => {
    setRoleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (!open) return null;

  const submit = () => {
    const e = email.trim();
    const n = name.trim();

    if (!e) return setError("Email is required");
    if (!n) return setError("Name is required");

    onSubmit({
      id: initial?.id,
      email: e,
      name: n,
      status,
      roleIds,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[92vw] max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            {mode === "create" ? "Create User" : "Edit User"}
          </h2>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-zinc-200">
            Esc
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="Email"
            disabled={mode === "edit"}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm disabled:opacity-60"
          />

          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="Name"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          {/* ✅ Roles 연결 UI */}
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="mb-2 text-xs text-zinc-400">Assign Roles</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {roles.map((r) => {
                const checked = roleIds.includes(r.id);
                return (
                  <label
                    key={r.id}
                    className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRole(r.id)}
                    />
                    <span className="font-medium">{r.name}</span>
                    <span className="text-zinc-500">({roleMap.get(r.id)?.type})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {error && <div className="text-xs text-rose-300">{error}</div>}
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
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
