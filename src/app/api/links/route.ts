import { NextResponse } from "next/server";

import { readLinksData } from "@/lib/links-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readLinksData();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
