"use client";

import { useEffect, useMemo, useState } from "react";
import RolesToolbar from "./_components/RolesToolbar";
import RolesTable from "./_components/RolesTable";
import RoleCreateModal from "./_components/RoleCreateModal";
import type { RoleRow, RoleType } from "./_lib/roles.types";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

type ApiRole = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: "system" | "custom";
  userCount: number;
  updatedAt: string;
};

function mapApiRoleToRow(role: ApiRole): RoleRow {
  return {
    id: role.id,
    code: role.code,       // ✅ 추가
    name: role.name,
    description: role.description ?? undefined,
    type: role.type,
    userCount: role.userCount,
    updatedAt: role.updatedAt.slice(0, 10),
  };
}



export default function RolesPage() {
  const [roles, setRoles] = useState<RoleRow[]>([]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | RoleType>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/roles`, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to load roles (${res.status})`);
      }
      const data = (await res.json()) as ApiRole[];
      setRoles(data.map(mapApiRoleToRow));
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

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

  const handleSubmit = async (payload: {
    id?: string;
    code: string;
    name: string;
    description?: string;
    type: RoleType;
  }) => {
    const name = payload.name.trim();

    const exists = roles.some(
      (r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== payload.id
    );
    if (exists) {
      alert("Role name already exists");
      return;
    }

    if (modalMode === "create") {
      try {
        const res = await fetch(`${API_BASE}/roles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: payload.code,
            name,
            description: payload.description ?? null,
            type: payload.type,    
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to create role (${res.status})`);
        }

        const created = (await res.json()) as ApiRole;
        const newRole = mapApiRoleToRow(created);

        setRoles((prev) => [newRole, ...prev]);
        setModalOpen(false);
      } catch (e: any) {
        console.error(e);
        alert(e?.message ?? "Failed to create role");
      }
      return;
    }

    if (!payload.id) return;

    try {
      const res = await fetch(`${API_BASE}/roles/${payload.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: payload.description ?? null,
          type: payload.type,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to update role (${res.status})`);
      }

      const updated = (await res.json()) as ApiRole;
      const updatedRow = mapApiRoleToRow(updated);

      setRoles((prev) => prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)));
      setModalOpen(false);
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Failed to update role");
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    const target = roles.find((r) => r.id === id);
    const ok = window.confirm(`Delete role "${target?.name ?? ""}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/roles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to delete role (${res.status})`);
      }
      
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Failed to delete role");
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage roles and permissions for admin users.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : (
          <button
            className="text-sm text-zinc-400 hover:text-zinc-200"
            onClick={fetchRoles}
          >
            Refresh
          </button>
        )}
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
