import crypto from "node:crypto";

type OtpRecord = {
  hash: string;
  expiresAt: number;
  attempts: number;
};

const TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const globalRef = globalThis as unknown as {
  __kurlclub_otp?: Map<string, OtpRecord>;
};
const store: Map<string, OtpRecord> =
  globalRef.__kurlclub_otp ?? (globalRef.__kurlclub_otp = new Map());

function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function generateOtp(sessionId: string): string {
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  store.set(sessionId, {
    hash: hashCode(code),
    expiresAt: Date.now() + TTL_MS,
    attempts: 0,
  });
  return code;
}

export type OtpVerifyResult =
  | { ok: true }
  | {
      ok: false;
      reason: "missing" | "expired" | "too_many_attempts" | "invalid";
    };

export function verifyOtp(sessionId: string, code: string): OtpVerifyResult {
  const record = store.get(sessionId);
  if (!record) return { ok: false, reason: "missing" };
  if (Date.now() > record.expiresAt) {
    store.delete(sessionId);
    return { ok: false, reason: "expired" };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    store.delete(sessionId);
    return { ok: false, reason: "too_many_attempts" };
  }
  record.attempts += 1;
  if (hashCode(code) !== record.hash) {
    return { ok: false, reason: "invalid" };
  }
  store.delete(sessionId);
  return { ok: true };
}

export function newSessionId(): string {
  return crypto.randomBytes(16).toString("hex");
}
