"use client";

import { useEffect, useMemo, useState } from "react";
import type { RoleRow } from "../../roles/_lib/roles.types";
import type { UserRow, UserStatus } from "../_lib/users.types";

type InviteResponse = {
  inviteUrl: string;
  expiresAt: string;
};

type SubmitPayload =
  | { mode: "invite"; email: string }
  | { mode: "edit"; id: string; name: string; status: UserStatus; roleIds: string[] };

export default function UserCreateModal({
  open,
  mode,
  initial,
  roles,
  inviteResult,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "invite" | "edit";
  initial?: UserRow | null;
  roles: RoleRow[];
  inviteResult: InviteResponse | null;
  onClose: () => void;
  onSubmit: (payload: SubmitPayload) => void;
}) {
  // invite용
  const [email, setEmail] = useState("");

  // edit용
  const [name, setName] = useState("");
  const [status, setStatus] = useState<UserStatus>("active" as UserStatus);
  const [roleIds, setRoleIds] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);

  const roleMap = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);

  useEffect(() => {
    if (!open) return;
    setError(null);

    if (mode === "edit" && initial) {
      setEmail(initial.email ?? "");
      setName(initial.name ?? "");
      setStatus(initial.status);
      setRoleIds(initial.roleIds ?? []);
      return;
    }

    // invite mode
    setEmail("");
    setName("");
    setStatus("active" as UserStatus);
    setRoleIds([]);
  }, [open, mode, initial]);

  const toggleRole = (id: string) => {
    setRoleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  if (!open) return null;

  const submit = () => {
    setError(null);

    if (mode === "invite") {
      const e = email.trim().toLowerCase();
      if (!e) return setError("Email is required");

      onSubmit({ mode: "invite", email: e });
      return;
    }

    // edit
    if (!initial?.id) return;

    const n = name.trim();
    if (!n) return setError("Name is required");

    const validRoleIds = roleIds.filter((id) => roleMap.has(id));

    onSubmit({
      mode: "edit",
      id: initial.id,
      name: n,
      status,
      roleIds: validRoleIds,
    });
  };

  const copyInviteUrl = async () => {
    if (!inviteResult?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteResult.inviteUrl);
      alert("초대 링크를 복사했어요!");
    } catch {
      // clipboard 실패 시 그냥 링크 선택해서 복사하면 됨
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[92vw] max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            {mode === "invite" ? "Invite User" : "Edit User"}
          </h2>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-zinc-200">
            Esc
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* INVITE MODE */}
          {mode === "invite" && (
            <>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="Email"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
              />

              {inviteResult && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
                  <div className="text-xs text-zinc-400">Invite link</div>
                  <div className="mt-1 break-all text-sm text-zinc-200">
                    {inviteResult.inviteUrl}
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500">
                    Expires at: {new Date(inviteResult.expiresAt).toLocaleString()}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={copyInviteUrl}
                      className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900"
                    >
                      Copy link
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* EDIT MODE */}
          {mode === "edit" && (
            <>
              <input
                value={email}
                disabled
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
                        <input type="checkbox" checked={checked} onChange={() => toggleRole(r.id)} />
                        <span className="font-medium">{r.name}</span>
                        <span className="text-zinc-500">({roleMap.get(r.id)?.type})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {error && <div className="text-xs text-rose-300">{error}</div>}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-zinc-800 px-3 py-2 text-xs">
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950"
          >
            {mode === "invite" ? (inviteResult ? "Re-invite" : "Send invite") : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}