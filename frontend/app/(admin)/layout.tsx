import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/roles", label: "Roles" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="h-screen w-64 shrink-0 border-r border-zinc-800 bg-zinc-950/60 backdrop-blur">
          <div className="px-5 py-5">
            <div className="text-lg font-semibold tracking-tight">OpsHub</div>
            <div className="mt-1 text-xs text-zinc-400">Admin Console</div>
          </div>

          <nav className="px-3">
            <div className="text-[11px] font-medium text-zinc-500 px-2 mb-2">
              MENU
            </div>

            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-zinc-700 group-hover:bg-zinc-200 transition" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto px-5 py-5 text-xs text-zinc-500">
            © {new Date().getFullYear()} OpsHub
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/60 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-zinc-400">
                Welcome, <span className="text-zinc-100">Admin</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900 transition">
                  Settings
                </button>
                <button className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950 hover:bg-white transition">
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="px-6 py-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
