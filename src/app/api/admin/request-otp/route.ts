import { NextResponse } from "next/server";

import { sendOtpEmail, OTP_RECIPIENT } from "@/lib/mailer";
import { generateOtp, newSessionId } from "@/lib/otp-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const sessionId = newSessionId();
    const code = generateOtp(sessionId);
    await sendOtpEmail(code);

    const maskedRecipient = OTP_RECIPIENT.replace(
      /^(.{2}).+(@.+)$/,
      (_, a, b) => `${a}•••${b}`,
    );

    return NextResponse.json({ sessionId, sentTo: maskedRecipient });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
