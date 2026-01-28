"use client";

import { useEffect, useMemo, useState } from "react";
import type { RoleRow, RoleType } from "../_lib/roles.types";

type SubmitPayload = {
  id?: string;
  code: string; // ✅ 추가
  name: string;
  description?: string;
  type: RoleType;
};

function toRoleCode(input: string) {
  // ADMIN, SUPPORT_ROLE 같은 형태로 정규화
  return input
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "");
}

export default function RoleCreateModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: RoleRow | null;
  onClose: () => void;
  onSubmit: (payload: SubmitPayload) => void;
}) {
  const [code, setCode] = useState(""); // ✅ 추가
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<RoleType>("custom");
  const [error, setError] = useState<string | null>(null);

  // (선택) code를 name 기반으로 자동 제안(사용자가 직접 수정 가능)
  const suggestedCode = useMemo(() => toRoleCode(name), [name]);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initial) {
      setName(initial.name ?? "");
      setDescription(initial.description ?? "");
      setType(initial.type);

      // ✅ edit일 때 code는 바꾸지 않는 것을 권장 (서버/권한 체크 기준이 될 수 있음)
      // RoleRow에 code가 없어서, edit에서 code를 보여주려면 RoleRow에 code를 추가해야 함.
      // 일단은 빈값으로 두고 입력 비활성 처리.
      setCode("");
    } else {
      setName("");
      setDescription("");
      setType("custom");
      setCode("");
    }

    setError(null);
  }, [open, mode, initial]);

  if (!open) return null;

  const submit = () => {
    const n = name.trim();
    if (!n) {
      setError("Role name is required");
      return;
    }

    const d = description.trim();

    if (mode === "create") {
      const finalCode = toRoleCode(code || suggestedCode);
      if (!finalCode) {
        setError("Role code is required (e.g. ADMIN, SUPPORT_ROLE)");
        return;
      }

      onSubmit({
        id: initial?.id,
        code: finalCode,
        name: n,
        description: d ? d : undefined,
        type,
      });
      return;
    }

    onSubmit({
      id: initial?.id,
      code: "",
      name: n,
      description: d ? d : undefined,
      type,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[92vw] max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            {mode === "create" ? "Create Role" : "Edit Role"}
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            Esc
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* ✅ CODE (create only) */}
          <div className="space-y-1">
            <label className="block text-xs text-zinc-400">Code</label>
            <input
              value={mode === "create" ? code : "(fixed)"}
              onChange={(e) => {
                if (mode !== "create") return;
                setCode(toRoleCode(e.target.value));
                setError(null);
              }}
              placeholder="ADMIN / SUPPORT / VIEWER"
              disabled={mode !== "create"}
              className={[
                "w-full rounded-lg border bg-zinc-950 px-3 py-2 text-sm",
                mode === "create"
                  ? "border-zinc-800"
                  : "border-zinc-900 text-zinc-500",
              ].join(" ")}
            />
            {mode === "create" && (
              <p className="text-[11px] text-zinc-500">
                Tip: use uppercase letters, numbers, and underscores. Suggested:{" "}
                <span className="text-zinc-300">{suggestedCode || "—"}</span>
              </p>
            )}
          </div>

          {/* NAME */}
          <div className="space-y-1">
            <label className="block text-xs text-zinc-400">Name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);

                // code를 아직 안 적었으면 name 기반으로 자동 채우기(선택)
                if (mode === "create" && !code.trim()) {
                  // 너무 공격적으로 덮어쓰지 않도록 "비어있을 때만"
                  setCode(toRoleCode(e.target.value));
                }
              }}
              placeholder="Role name"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
            />
          </div>

          {/* TYPE */}
          <div className="space-y-1">
            <label className="block text-xs text-zinc-400">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as RoleType)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
            >
              <option value="system">System</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="block text-xs text-zinc-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
            />
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
