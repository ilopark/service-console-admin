"use client";

export default function RolesToolbar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  onCreate,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  filter: "all" | "system" | "custom";
  onFilterChange: (v: "all" | "system" | "custom") => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search roles..."
          className="w-full sm:w-72 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
        />

        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as any)}
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
        >
          <option value="all">All</option>
          <option value="system">System</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <button
        onClick={onCreate}
        className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950 hover:bg-white transition"
      >
        Create Role
      </button>
    </div>
  );
}
