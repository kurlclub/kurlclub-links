import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

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

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const slug = crypto.randomBytes(6).toString("hex");
  const filename = `logo-${Date.now()}-${slug}.${ext}`;
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ path: `/uploads/${filename}` });
}
