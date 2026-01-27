"use client";

import { useSyncExternalStore } from "react";
import { mockAuditLogs } from "./auditLogs.mock";
import type { AuditLog, AuditLogInput } from "./auditLogs.types";

const STORAGE_KEY = "opshub.auditLogs.v1";

type Listener = () => void;

let logs: AuditLog[] = [];
let listeners = new Set<Listener>();
let initialized = false;

function initOnce() {
  if (initialized) return;
  initialized = true;

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        logs = JSON.parse(raw);
      } else {
        logs = mockAuditLogs;
      }
    } catch {
      logs = mockAuditLogs;
    }
  }

  logs = [...logs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function emit() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }
}

export function addAuditLog(input: AuditLogInput) {
  initOnce();

  const entry: AuditLog = {
    id: input.id ?? crypto.randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    action: input.action,
    actor: input.actor,
    target: input.target,
    meta: input.meta,
  };

  logs = [entry, ...logs];
  emit();
}

export function clearAuditLogs() {
  initOnce();
  logs = [];
  emit();
}

function getSnapshot() {
  initOnce();
  return logs;
}

function subscribe(listener: Listener) {
  initOnce();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAuditLogs(): AuditLog[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
