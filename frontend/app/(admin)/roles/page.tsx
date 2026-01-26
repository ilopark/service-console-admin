"use client";

import { useMemo, useState } from "react";
import RolesToolbar from "./_components/RolesToolbar";
import RolesTable from "./_components/RolesTable";
import { mockRoles } from "./_lib/roles.mock";

export default function RolesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "system" | "custom">("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return mockRoles
      .filter((r) => (filter === "all" ? true : r.type === filter))
      .filter((r) =>
        q ? (r.name + " " + r.description).toLowerCase().includes(q) : true
      );
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage roles and permissions for admin users.
          </p>
        </div>
      </div>

      <RolesToolbar
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        onCreate={() => alert("Create Role (TODO)")}
      />

      <RolesTable rows={rows} />
    </div>
  );
}
