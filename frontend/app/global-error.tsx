"use client";

import "./globals.css";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GLOBAL ERROR]", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="ko">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="relative min-h-screen overflow-hidden">
          {/* background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-fuchsia-500/25 blur-3xl" />
            <div className="absolute -right-40 top-10 h-[560px] w-[560px] rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute left-1/2 top-[55%] h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-zinc-950" />
          </div>

          {/* content */}
          <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
            <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
              {/* left text */}
              <section>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  시스템 오류
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Something went wrong
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
                  페이지를 불러오는 중 예상치 못한 오류가 발생했습니다. 잠시 후 다시
                  시도하거나 대시보드로 돌아가 주세요.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      window.location.href = "/dashboard";
                    }}
                    className="rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 hover:bg-white transition"
                  >
                    홈으로
                  </button>
                </div>

                {/* dev-only detail */}
                {isDev && (
                  <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                    <div className="text-xs text-zinc-400">Dev details</div>
                    <div className="mt-2 break-words text-xs text-zinc-200">
                      {error.message || "Unknown error"}
                    </div>
                    {error.digest ? (
                      <div className="mt-2 text-[11px] text-zinc-500">
                        Digest: {error.digest}
                      </div>
                    ) : null}
                  </div>
                )}

                <p className="mt-6 text-xs text-zinc-500">
                  문제가 계속되면 관리자에게 문의해 주세요.
                </p>
              </section>

              {/* right visual */}
              <section className="relative hidden lg:block">
                <div className="relative h-[420px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/30 shadow-2xl">
                  <div className="absolute inset-0">
                    <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-400/20 blur-2xl" />
                    <div className="absolute -left-24 bottom-[-80px] h-96 w-96 rounded-full bg-fuchsia-500/15 blur-2xl" />
                  </div>

                  <div className="relative flex h-full flex-col justify-between p-8">
                    <div className="text-xs text-zinc-400">Error code</div>
                    <div className="text-7xl font-semibold tracking-tight text-zinc-100">
                      500
                    </div>
                    <div className="text-sm text-zinc-300">
                      Internal Server Error
                    </div>

                    <div className="mt-6 space-y-2 text-xs text-zinc-500">
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <span className="text-zinc-300">Failed</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Action</span>
                        <span className="text-zinc-300">Home</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
