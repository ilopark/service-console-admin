import { getLoginTrendLast7Days } from "./_lib/dashboard";
import LineChartSection from "./_components/LineChartSection";

export default async function DashboardPage() {
  // ✅ 더미 KPI 데이터 (나중에 API 붙일 자리)
  const kpis = [
    { label: "Total Users", value: "1,248", hint: "+12 this week" },
    { label: "Active Users (7d)", value: "892", hint: "71.5% active" },
    { label: "Logins Today", value: "143", hint: "Peak 10:00–12:00" },
    { label: "Failed Logins Today", value: "7", hint: "Possible brute attempts" },
    { label: "System Errors Today", value: "2", hint: "Investigate API timeouts" },
  ] as const;

  // ✅ 최근 활동 로그(요약 10건)
  const activities = [
    {
      time: "10:42",
      actor: "admin01",
      action: "ROLE_UPDATED",
      target: "user_123 → ADMIN",
      ip: "192.168.0.10",
      result: "SUCCESS",
    },
    {
      time: "10:30",
      actor: "admin02",
      action: "USER_DISABLED",
      target: "user_487",
      ip: "192.168.0.12",
      result: "SUCCESS",
    },
    {
      time: "10:12",
      actor: "system",
      action: "AUTH_FAILED",
      target: "user_777",
      ip: "203.0.113.45",
      result: "FAIL",
    },
    {
      time: "09:58",
      actor: "user_103",
      action: "LOGIN",
      target: "session_created",
      ip: "198.51.100.21",
      result: "SUCCESS",
    },
    {
      time: "09:41",
      actor: "admin01",
      action: "USER_CREATED",
      target: "user_901",
      ip: "192.168.0.10",
      result: "SUCCESS",
    },
    {
      time: "09:20",
      actor: "system",
      action: "API_ERROR",
      target: "GET /api/users",
      ip: "—",
      result: "FAIL",
    },
    {
      time: "09:05",
      actor: "admin03",
      action: "ROLE_CREATED",
      target: "ROLE: SUPPORT",
      ip: "192.168.0.20",
      result: "SUCCESS",
    },
    {
      time: "08:52",
      actor: "admin02",
      action: "PASSWORD_RESET",
      target: "user_122",
      ip: "192.168.0.12",
      result: "SUCCESS",
    },
    {
      time: "08:30",
      actor: "system",
      action: "HEALTH_DEGRADED",
      target: "DB latency ↑",
      ip: "—",
      result: "WARN",
    },
    {
      time: "08:11",
      actor: "admin01",
      action: "USER_UPDATED",
      target: "user_103 (email)",
      ip: "192.168.0.10",
      result: "SUCCESS",
    },
  ] as const;

  // ✅ 시스템 상태
  const services = [
    { name: "API Server", status: "OK", detail: "200ms avg" },
    { name: "Database", status: "OK", detail: "Connections stable" },
    { name: "Auth Service", status: "DEGRADED", detail: "Retry spike" },
  ] as const;

  const meta = {
    version: "v0.1.0",
    lastDeploy: "2026-01-23",
    environment: "dev",
  } as const;

  // ✅ (추가) 로그인 추이 데이터: page.tsx에서 데이터 준비 후 차트에 전달
  const loginTrend = await getLoginTrendLast7Days();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Overview of usage, activity, and system health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900 transition">
            Refresh
          </button>
          <button className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950 hover:bg-white transition">
            Export
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 hover:bg-zinc-950/60 transition"
            >
              <div className="text-xs text-zinc-400">{kpi.label}</div>
              <div className="mt-2 text-2xl font-semibold">{kpi.value}</div>
              <div className="mt-1 text-xs text-zinc-500">{kpi.hint}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Line Chart */}
      <LineChartSection data={loginTrend} />

      {/* Bottom: Activity + System status */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Activity table */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div>
              <div className="text-sm font-medium">Recent Activity</div>
              <div className="text-xs text-zinc-500">
                Latest events across users and admin actions
              </div>
            </div>
            <button className="text-xs text-zinc-200 hover:underline">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 text-left font-medium">Time</th>
                  <th className="px-4 py-3 text-left font-medium">Actor</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                  <th className="px-4 py-3 text-left font-medium">Target</th>
                  <th className="px-4 py-3 text-left font-medium">IP</th>
                  <th className="px-4 py-3 text-left font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-zinc-800/70 hover:bg-zinc-950/60 transition"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-200">
                      {row.time}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-200">
                      {row.actor}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-200">
                      <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs">
                        {row.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-200">{row.target}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-200">
                      {row.ip}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={[
                          "rounded-md px-2 py-1 text-xs border",
                          row.result === "SUCCESS"
                            ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-200"
                            : row.result === "WARN"
                            ? "border-amber-900/60 bg-amber-950/40 text-amber-200"
                            : "border-rose-900/60 bg-rose-950/40 text-rose-200",
                        ].join(" ")}
                      >
                        {row.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System status */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <div className="text-sm font-medium">System Status</div>
            <div className="text-xs text-zinc-500">
              Service health and deployment info
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2"
                >
                  <div>
                    <div className="text-sm text-zinc-100">{svc.name}</div>
                    <div className="text-xs text-zinc-500">{svc.detail}</div>
                  </div>
                  <span
                    className={[
                      "text-xs rounded-md px-2 py-1 border",
                      svc.status === "OK"
                        ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-200"
                        : svc.status === "DEGRADED"
                        ? "border-amber-900/60 bg-amber-950/40 text-amber-200"
                        : "border-rose-900/60 bg-rose-950/40 text-rose-200",
                    ].join(" ")}
                  >
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <div className="text-xs text-zinc-500">Metadata</div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Version</span>
                  <span className="text-zinc-100">{meta.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Last deploy</span>
                  <span className="text-zinc-100">{meta.lastDeploy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Environment</span>
                  <span className="text-zinc-100">{meta.environment}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              Tip: later we’ll connect this to{" "}
              <span className="text-zinc-300">/health</span> and{" "}
              <span className="text-zinc-300">/logs</span>.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
