// Phase 14 — Retry Queue
// Tracks failed import attempts and retries them with exponential back-off.

import fs from 'fs';
import path from 'path';

export type FailedEntry = {
  leadData: Record<string, unknown>;
  reason: string;
  attempts: number;
  lastAttemptAt: string;
  nextRetryAt: string;
};

const QUEUE_FILE = path.resolve('./failed-imports.json');
const MAX_ATTEMPTS = 3;

function loadQueue(): FailedEntry[] {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8')) as FailedEntry[];
}

function saveQueue(queue: FailedEntry[]) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
}

function backoffMinutes(attempts: number): number {
  // 15min → 60min → 240min
  return 15 * Math.pow(4, Math.min(attempts - 1, 2));
}

export function enqueueFailed(leadData: Record<string, unknown>, reason: string) {
  const queue = loadQueue();
  const now = new Date();
  const nextRetry = new Date(now.getTime() + backoffMinutes(1) * 60000);
  queue.push({
    leadData,
    reason,
    attempts: 1,
    lastAttemptAt: now.toISOString(),
    nextRetryAt: nextRetry.toISOString(),
  });
  saveQueue(queue);
}

export function getDueRetries(): FailedEntry[] {
  const now = new Date();
  return loadQueue().filter(
    (e) => e.attempts < MAX_ATTEMPTS && new Date(e.nextRetryAt) <= now,
  );
}

export function markRetryAttempt(entry: FailedEntry, success: boolean) {
  const queue = loadQueue();
  const idx = queue.findIndex(
    (e) => e.leadData === entry.leadData && e.lastAttemptAt === entry.lastAttemptAt,
  );
  if (idx === -1) return;
  if (success) {
    queue.splice(idx, 1);
  } else {
    const updatedEntry = queue[idx];
    updatedEntry.attempts += 1;
    updatedEntry.lastAttemptAt = new Date().toISOString();
    const nextRetry = new Date(Date.now() + backoffMinutes(updatedEntry.attempts) * 60000);
    updatedEntry.nextRetryAt = nextRetry.toISOString();
  }
  saveQueue(queue);
}

export function clearExpired() {
  const queue = loadQueue().filter((e) => e.attempts < MAX_ATTEMPTS);
  saveQueue(queue);
}
