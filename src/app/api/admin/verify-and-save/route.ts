import { NextResponse } from "next/server";

import { validateLinksData, writeLinksData } from "@/lib/links-data";
import { verifyOtp } from "@/lib/otp-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { sessionId, code, data } = (body ?? {}) as {
    sessionId?: string;
    code?: string;
    data?: unknown;
  };

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing OTP code" }, { status: 400 });
  }

  let validated;
  try {
    validated = validateLinksData(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid data";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const result = verifyOtp(sessionId, code.trim());
  if (!result.ok) {
    const map: Record<typeof result.reason, { status: number; msg: string }> = {
      missing: {
        status: 400,
        msg: "OTP session not found. Request a new code.",
      },
      expired: { status: 400, msg: "OTP expired. Request a new code." },
      too_many_attempts: {
        status: 429,
        msg: "Too many attempts. Request a new code.",
      },
      invalid: { status: 401, msg: "Incorrect code." },
    };
    const { status, msg } = map[result.reason];
    return NextResponse.json({ error: msg }, { status });
  }

  try {
    await writeLinksData(validated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
