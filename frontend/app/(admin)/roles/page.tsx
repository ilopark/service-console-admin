"use client";

import { useMemo, useState } from "react";
import RolesToolbar from "./_components/RolesToolbar";
import RolesTable from "./_components/RolesTable";
import RoleCreateModal from "./_components/RoleCreateModal";
import { mockRoles } from "./_lib/roles.mock";
import type { RoleRow, RoleType } from "./_lib/roles.types";

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleRow[]>(mockRoles);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | RoleType>("all");

  // ✅ 모달 상태: create/edit 구분 + 편집 대상
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return roles
      .filter((r) => (filter === "all" ? true : r.type === filter))
      .filter((r) => (q ? r.name.toLowerCase().includes(q) : true));
  }, [roles, query, filter]);

  const openCreate = () => {
    setModalMode("create");
    setEditingRole(null);
    setModalOpen(true);
  };

  const openEdit = (row: RoleRow) => {
    setModalMode("edit");
    setEditingRole(row);
    setModalOpen(true);
  };

  const handleSubmit = (payload: {
    id?: string;
    name: string;
    description?: string;
    type: RoleType;
  }) => {
    const name = payload.name.trim();

    // ✅ 중복 체크 (edit일 땐 자기 자신 제외)
    const exists = roles.some(
      (r) =>
        r.name.toLowerCase() === name.toLowerCase() &&
        r.id !== payload.id
    );
    if (exists) {
      alert("Role name already exists");
      return;
    }

    if (modalMode === "create") {
      const newRole: RoleRow = {
        id: crypto.randomUUID(),
        name,
        description: payload.description,
        type: payload.type,
        userCount: 0,
        updatedAt: new Date().toISOString().slice(0, 10),
      };

      setRoles((prev) => [newRole, ...prev]);
      setModalOpen(false);
      return;
    }

    // edit
    if (!payload.id) return;

    setRoles((prev) =>
      prev.map((r) =>
        r.id === payload.id
          ? {
              ...r,
              name,
              description: payload.description,
              type: payload.type,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    );
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const target = roles.find((r) => r.id === id);
    const ok = window.confirm(`Delete role "${target?.name ?? ""}"?`);
    if (!ok) return;

    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage roles and permissions for admin users.
        </p>
      </div>

      <RolesToolbar
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        onCreate={openCreate}
      />

      <RolesTable rows={rows} onEdit={openEdit} onDelete={handleDelete} />

      <RoleCreateModal
        open={modalOpen}
        mode={modalMode}
        initial={editingRole}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
