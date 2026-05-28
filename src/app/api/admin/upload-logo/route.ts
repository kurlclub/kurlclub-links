import crypto from "node:crypto";

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Storage not configured (missing BLOB_READ_WRITE_TOKEN)." },
      { status: 500 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Max 2 MB." },
      { status: 413 },
    );
  }

  const ext = ALLOWED_EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPG, WebP, GIF, or SVG." },
      { status: 415 },
    );
  }

  const slug = crypto.randomBytes(6).toString("hex");
  const filename = `logos/logo-${Date.now()}-${slug}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const blob = await put(filename, buffer, {
    access: "public",
    contentType: file.type,
    token,
  });

  return NextResponse.json({ path: blob.url });
}
