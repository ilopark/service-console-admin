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
  const [createOpen, setCreateOpen] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return roles
      .filter((r) => (filter === "all" ? true : r.type === filter))
      .filter((r) => (q ? r.name.toLowerCase().includes(q) : true));
  }, [roles, query, filter]);

  const handleCreateRole = (payload: {
    name: string;
    description?: string;
    type: RoleType;
  }) => {
    const name = payload.name.trim();

    const exists = roles.some((r) => r.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert("Role name already exists");
      return;
    }

    const desc = payload.description?.trim();
    const newRole: RoleRow = {
      id: crypto.randomUUID(),
      name,
      description: desc ? desc : undefined, // ✅ undefined OK (types에서 optional)
      type: payload.type,
      userCount: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setRoles((prev) => [newRole, ...prev]);
    setCreateOpen(false);
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
        onCreate={() => setCreateOpen(true)}
      />

      <RolesTable rows={rows} />

      <RoleCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateRole}
      />
    </div>
  );
}
