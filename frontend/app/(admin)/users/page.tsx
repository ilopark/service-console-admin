"use client";

import { useMemo, useState } from "react";
import UsersToolbar from "./_components/UsersToolbar";
import UsersTable from "./_components/UsersTable";
import UserCreateModal from "./_components/UserCreateModal";

import { mockUsers } from "./_lib/users.mock";
import type { UserRow, UserStatus } from "./_lib/users.types";

import { mockRoles } from "../roles/_lib/roles.mock";
import type { RoleRow } from "../roles/_lib/roles.types";

export default function UsersPage() {
  const [roles] = useState<RoleRow[]>(mockRoles);
  const roleMap = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);

  const [users, setUsers] = useState<UserRow[]>(mockUsers);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | UserStatus>("all");
  const [roleId, setRoleId] = useState<"all" | string>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return users
      .filter((u) => (status === "all" ? true : u.status === status))
      .filter((u) => (roleId === "all" ? true : u.roleIds.includes(roleId)))
      .filter((u) =>
        q ? u.name.toLowerCase().includes(q) : true
      );

  }, [users, query, status, roleId]);

  const getRoleNames = (ids: string[]) =>
    ids
      .map((id) => roleMap.get(id)?.name)
      .filter(Boolean)
      .join(", ");

  const openCreate = () => {
    setModalMode("create");
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (row: UserRow) => {
    setModalMode("edit");
    setEditingUser(row);
    setModalOpen(true);
  };

  const handleSubmit = (payload: {
    id?: string;
    email: string;
    name: string;
    status: UserStatus;
    roleIds: string[];
  }) => {
    const email = payload.email.trim().toLowerCase();
    const name = payload.name.trim();

    const validRoleIds = payload.roleIds.filter((id) => roleMap.has(id));

    const exists = users.some(
      (u) => u.email.toLowerCase() === email && u.id !== payload.id
    );
    if (exists) {
      alert("Email already exists");
      return;
    }

    if (modalMode === "create") {
      const newUser: UserRow = {
        id: crypto.randomUUID(),
        email,
        name,
        status: payload.status,
        roleIds: validRoleIds,
        updatedAt: new Date().toISOString().slice(0, 10),
      };

      setUsers((prev) => [newUser, ...prev]);
      setModalOpen(false);
      return;
    }

    // edit
    if (!payload.id) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === payload.id
          ? {
              ...u,
              name,
              status: payload.status,
              roleIds: validRoleIds,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : u
      )
    );
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const target = users.find((u) => u.id === id);
    const ok = window.confirm(`Delete user "${target?.email ?? ""}"?`);
    if (!ok) return;

    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage users and assign roles.
        </p>
      </div>

      <UsersToolbar
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        roleId={roleId}
        onRoleChange={setRoleId}
        roles={roles}
        onCreate={openCreate}
      />

      <UsersTable
        rows={rows}
        getRoleNames={getRoleNames}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <UserCreateModal
        open={modalOpen}
        mode={modalMode}
        initial={editingUser}
        roles={roles}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
