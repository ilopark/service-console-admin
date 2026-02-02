"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

type VerifyResponse = {
  email: string;
  expiresAt: string; // ISO
};

type AcceptResponse = {
  id: string;
  email: string;
  name: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<AcceptResponse | null>(null);

  // 1) token 검증
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setVerifying(true);
      setError(null);
      setDone(null);

      if (!token) {
        setError("초대 토큰(token)이 없습니다. 초대 링크가 올바른지 확인해 주세요.");
        setLoading(false);
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/users/invites/verify?token=${encodeURIComponent(token)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `초대 링크 검증 실패 (${res.status})`);
        }

        const data = (await res.json()) as VerifyResponse;
        setEmail(data.email);
        setExpiresAt(data.expiresAt);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "초대 링크 검증에 실패했습니다.");
      } finally {
        setLoading(false);
        setVerifying(false);
      }
    };

    run();
  }, [token]);

  // 2) 가입 제출
  const submit = async () => {
    setError(null);

    const n = name.trim();
    if (!n) {
      setError("이름(name)은 필수입니다.");
      return;
    }
    if (!token) {
      setError("토큰이 없습니다.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/users/accept-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name: n }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `가입 실패 (${res.status})`);
      }

      const created = (await res.json()) as AcceptResponse;
      setDone(created);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "가입 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-zinc-400">
        Loading…
      </div>
    );
  }

  // 가입 완료 화면
  if (done) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h1 className="text-xl font-semibold text-zinc-100">가입 완료 🎉</h1>
          <p className="mt-2 text-sm text-zinc-400">
            아래 정보로 사용자가 생성되었습니다.
          </p>

          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-sm">
            <div className="text-zinc-300">
              <span className="text-zinc-500">Email:</span> {done.email}
            </div>
            <div className="mt-1 text-zinc-300">
              <span className="text-zinc-500">Name:</span> {done.name}
            </div>
            <div className="mt-1 text-zinc-300">
              <span className="text-zinc-500">Status:</span> {done.status}
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950"
            >
              홈으로
            </button>
            <button
              onClick={() => router.push("/users")}
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              (관리자) Users로 이동
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            ※ 아직 로그인/권한 체계가 없어서 관리자 페이지 접근 제한은 추후 추가 예정
          </p>
        </div>
      </div>
    );
  }

  // 에러 화면
  if (error && !email) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h1 className="text-xl font-semibold text-zinc-100">초대 링크 오류</h1>
          <p className="mt-3 text-sm text-rose-300 whitespace-pre-wrap">{error}</p>

          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 정상: 가입 폼
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h1 className="text-xl font-semibold text-zinc-100">초대 수락</h1>
        <p className="mt-2 text-sm text-zinc-400">
          초대받은 이메일을 확인하고, 이름을 입력해 가입을 완료해 주세요.
        </p>

        <div className="mt-5 space-y-3">
          <div>
            <label className="block text-xs text-zinc-400">Email</label>
            <input
              value={email}
              disabled
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 disabled:opacity-70"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400">Name (required)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
            />
          </div>

          <div className="text-[11px] text-zinc-500">
            Expires at:{" "}
            {expiresAt ? new Date(expiresAt).toLocaleString() : "—"}
          </div>

          {error && (
            <div className="text-xs text-rose-300 whitespace-pre-wrap">{error}</div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => router.push("/")}
            className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={verifying || submitting}
            className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-60"
          >
            {submitting ? "처리 중..." : "가입 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}