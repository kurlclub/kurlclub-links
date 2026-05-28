import { list, put } from "@vercel/blob";

import bundledLinks from "@/data/links.json";

import type { LinksData } from "./links-types";

const BLOB_KEY = "links.json";
const CACHE_TTL_MS = 15_000;

let cache: { data: LinksData; expiresAt: number } | null = null;

function getToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export async function readLinksData(): Promise<LinksData> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }

  const token = getToken();
  if (!token) {
    return bundledLinks as LinksData;
  }

  try {
    const { blobs } = await list({ prefix: BLOB_KEY, token });
    const match = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!match) {
      return bundledLinks as LinksData;
    }
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) {
      return bundledLinks as LinksData;
    }
    const data = (await res.json()) as LinksData;
    cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    return data;
  } catch {
    return bundledLinks as LinksData;
  }
}

export async function writeLinksData(data: LinksData): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not configured. Add it to your Vercel project env vars.",
    );
  }

  await put(BLOB_KEY, JSON.stringify(data, null, 2) + "\n", {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
    token,
  });

  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateLinksData(value: unknown): LinksData {
  if (!value || typeof value !== "object") {
    throw new Error("Payload must be an object");
  }
  const v = value as Record<string, unknown>;

  const hero = v.hero as Record<string, unknown> | undefined;
  if (
    !hero ||
    !isNonEmptyString(hero.title) ||
    typeof hero.eyebrow !== "string" ||
    typeof hero.description !== "string" ||
    typeof hero.logo !== "string" ||
    !Array.isArray(hero.tags)
  ) {
    throw new Error("Invalid hero section");
  }
  for (const tag of hero.tags) {
    const t = tag as Record<string, unknown>;
    if (
      typeof t.label !== "string" ||
      (t.kind !== "dot" && t.kind !== "text")
    ) {
      throw new Error("Invalid hero tag");
    }
    if (t.color !== undefined && typeof t.color !== "string") {
      throw new Error("Invalid hero tag color");
    }
  }

  const location = v.location as Record<string, unknown> | undefined;
  if (
    !location ||
    typeof location.chipLabel !== "string" ||
    typeof location.mapUrl !== "string" ||
    typeof location.cardTitle !== "string" ||
    typeof location.cardSubtitle !== "string" ||
    !Array.isArray(location.addressLines) ||
    !location.addressLines.every((l) => typeof l === "string")
  ) {
    throw new Error("Invalid location section");
  }

  const featured = v.featured as Record<string, unknown> | undefined;
  if (
    !featured ||
    !isNonEmptyString(featured.title) ||
    typeof featured.eyebrow !== "string" ||
    typeof featured.description !== "string" ||
    typeof featured.href !== "string" ||
    typeof featured.icon !== "string"
  ) {
    throw new Error("Invalid featured card");
  }

  if (!Array.isArray(v.contactItems)) {
    throw new Error("contactItems must be an array");
  }
  for (const c of v.contactItems) {
    const item = c as Record<string, unknown>;
    if (
      !isNonEmptyString(item.id) ||
      !isNonEmptyString(item.title) ||
      typeof item.subtitle !== "string" ||
      typeof item.value !== "string" ||
      typeof item.icon !== "string" ||
      typeof item.iconColor !== "string" ||
      (item.linkType !== "phone" &&
        item.linkType !== "email" &&
        item.linkType !== "url" &&
        item.linkType !== "whatsapp")
    ) {
      throw new Error("Invalid contact item");
    }
  }

  if (!Array.isArray(v.socialItems)) {
    throw new Error("socialItems must be an array");
  }
  for (const s of v.socialItems) {
    const item = s as Record<string, unknown>;
    if (
      !isNonEmptyString(item.id) ||
      !isNonEmptyString(item.title) ||
      typeof item.handle !== "string" ||
      typeof item.href !== "string" ||
      typeof item.icon !== "string" ||
      typeof item.brandColor !== "string"
    ) {
      throw new Error("Invalid social item");
    }
  }

  if (typeof v.footer !== "string") {
    throw new Error("Invalid footer");
  }

  return value as LinksData;
}
