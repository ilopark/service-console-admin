"use client";

import { useEffect, useMemo, useState } from "react";
import UsersToolbar from "./_components/UsersToolbar";
import UsersTable from "./_components/UsersTable";
import UserCreateModal from "./_components/UserCreateModal";

import type { UserRow, UserStatus } from "./_lib/users.types";
import type { RoleRow } from "../roles/_lib/roles.types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

type InviteResponse = {
  inviteUrl: string;
  expiresAt: string;
};

type ApiUser = {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  roleIds: string[];
  updatedAt: string; // ISO
};

type ApiRole = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: "system" | "custom";
  userCount: number;
  updatedAt: string;
};

type SubmitPayload =
  | { mode: "invite"; email: string }
  | { mode: "edit"; id: string; name: string; status: UserStatus; roleIds: string[] };

function mapApiRoleToRoleRow(role: ApiRole): RoleRow {
  return {
    id: role.id,
    name: role.name,
    code: role.code,
    description: role.description ?? undefined,
    type: role.type,
    userCount: role.userCount,
    updatedAt: role.updatedAt.slice(0, 10),
  };
}

function mapApiUserToUserRow(u: ApiUser): UserRow {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    status: u.status,
    roleIds: u.roleIds,
    updatedAt: (u.updatedAt ?? "").slice(0, 10),
  };
}

export default function UsersPage() {
  // ✅ 이제 roles/users 모두 API에서 가져옴
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const roleMap = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);

  const [users, setUsers] = useState<UserRow[]>([]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | UserStatus>("all");
  const [roleId, setRoleId] = useState<"all" | string>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"invite" | "edit">("invite");
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  const [inviteResult, setInviteResult] = useState<InviteResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    const res = await fetch(`${API_BASE}/roles`, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to load roles (${res.status})`);
    }
    const data = (await res.json()) as ApiRole[];
    setRoles(data.map(mapApiRoleToRoleRow));
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/users`, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to load users (${res.status})`);
    }
    const data = (await res.json()) as ApiUser[];
    setUsers(data.map(mapApiUserToUserRow));
  };

  const refreshAll = async () => {
    setLoading(true);
    try {
      await fetchRoles();
      await fetchUsers();
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return users
      .filter((u) => (status === "all" ? true : u.status === status))
      .filter((u) => (roleId === "all" ? true : u.roleIds.includes(roleId)))
      .filter((u) => (q ? u.name.toLowerCase().includes(q) : true));
  }, [users, query, status, roleId]);

  const getRoleNames = (ids: string[]) =>
    ids
      .map((id) => roleMap.get(id)?.name)
      .filter(Boolean)
      .join(", ");

  const openInvite = () => {
    setModalMode("invite");
    setEditingUser(null);
    setInviteResult(null);
    setModalOpen(true);
  };

  const openEdit = (row: UserRow) => {
    setModalMode("edit");
    setEditingUser(row);
    setInviteResult(null);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: SubmitPayload) => {
    if (payload.mode === "invite") {
      const email = payload.email.trim().toLowerCase();

      try {
        const res = await fetch(`${API_BASE}/users/invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Invite failed (${res.status})`);
        }

        const data = (await res.json()) as InviteResponse;
        setInviteResult(data);

        // ✅ 초대만 보냈다고 users 목록에 즉시 추가하지 않음 (가입 완료 시 User 생성)
      } catch (e: any) {
        console.error(e);
        alert(e?.message ?? "Invite failed");
      }

      return;
    }

    // edit은 아직 API 없으니 로컬만(다음 단계에서 PATCH로 교체)
    const name = payload.name.trim();
    if (!name) {
      alert("Name is required");
      return;
    }

    const validRoleIds = payload.roleIds.filter((id) => roleMap.has(id));

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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage users and assign roles.</p>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : (
          <button className="text-sm text-zinc-400 hover:text-zinc-200" onClick={refreshAll}>
            Refresh
          </button>
        )}
      </div>

      <UsersToolbar
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        roleId={roleId}
        onRoleChange={setRoleId}
        roles={roles}
        onCreate={openInvite}
        createLabel="Invite User"
      />

      <UsersTable rows={rows} getRoleNames={getRoleNames} onEdit={openEdit} onDelete={handleDelete} />

      <UserCreateModal
        open={modalOpen}
        mode={modalMode}
        initial={editingUser}
        roles={roles}
        inviteResult={inviteResult}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}