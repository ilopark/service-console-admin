import type { RoleRow } from "../_lib/roles.types";

export default function RolesTable({
  rows,
  onEdit,
  onDelete,
}: {
  rows: RoleRow[];
  onEdit: (row: RoleRow) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-xs text-zinc-400">
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left font-medium">Role</th>

              <th className="px-4 py-3 text-center font-medium">Type</th>
              <th className="px-4 py-3 text-center font-medium">Users</th>
              <th className="px-4 py-3 text-center font-medium">Updated</th>

              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-800/70 hover:bg-zinc-950/60 transition"
              >
                <td className="px-4 py-3">
                  <div className="text-zinc-100 font-medium">{r.name}</div>
                  {r.description && (
                    <div className="text-xs text-zinc-500">{r.description}</div>
                  )}
                </td>

                {/* Type: 컬럼 중앙에 뱃지 */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={[
                      "inline-flex items-center justify-center rounded-md px-2 py-1 text-xs border",
                      r.type === "system"
                        ? "border-sky-900/60 bg-sky-950/40 text-sky-200"
                        : "border-amber-900/60 bg-amber-950/40 text-amber-200",
                    ].join(" ")}
                  >
                    {r.type}
                  </span>
                </td>

                {/* Users: 숫자 중앙 */}
                <td className="px-4 py-3 text-center text-zinc-200 tabular-nums">
                  {r.userCount}
                </td>

                {/* Updated: 날짜 중앙 */}
                <td className="px-4 py-3 text-center text-zinc-400 tabular-nums">
                  {r.updatedAt}
                </td>

                {/* Actions: 버튼 묶음 중앙 */}
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(r)}
                      className="text-xs text-zinc-200 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="text-xs text-rose-300 hover:underline"
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
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
