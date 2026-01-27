import type { UserRow } from "../_lib/users.types";

export default function UsersTable({
  rows,
  getRoleNames,
  onEdit,
  onDelete,
}: {
  rows: UserRow[];
  getRoleNames: (roleIds: string[]) => string;
  onEdit: (row: UserRow) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950">
            <tr className="text-left text-zinc-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Roles</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {rows.map((u) => (
              <tr key={u.id} className="text-zinc-200">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-zinc-400">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-zinc-300">{u.status}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-zinc-300">
                    {getRoleNames(u.roleIds) || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs">{u.updatedAt}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onEdit(u)}
                      className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(u.id)}
                      className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-zinc-500" colSpan={5}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
