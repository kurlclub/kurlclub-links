import nodemailer from "nodemailer";

export const OTP_RECIPIENT =
  process.env.OTP_RECIPIENT ?? "kurlclub.officila@gmail.com";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendOtpEmail(code: string): Promise<void> {
  const transport = getTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER!;

  await transport.sendMail({
    from,
    to: OTP_RECIPIENT,
    subject: `KurlClub Links — Admin OTP: ${code}`,
    text: `Your one-time code to save changes to the KurlClub links page is:\n\n${code}\n\nThis code expires in 5 minutes. If you did not request this, ignore this message.`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#070a10;padding:24px;color:#fff">
        <div style="max-width:480px;margin:0 auto;background:#0e1320;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px">
          <h2 style="margin:0 0 8px;color:#D3F702">KurlClub Links Admin</h2>
          <p style="margin:0 0 16px;color:rgba(255,255,255,0.7);font-size:14px">
            Use this one-time code to save your changes:
          </p>
          <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:rgba(211,247,2,0.1);border:1px solid rgba(211,247,2,0.3);border-radius:12px;padding:16px;text-align:center;color:#D3F702">
            ${code}
          </div>
          <p style="margin:16px 0 0;color:rgba(255,255,255,0.5);font-size:12px">
            This code expires in 5 minutes. If you did not request this, ignore this message.
          </p>
        </div>
      </div>
    `,
  });
}
