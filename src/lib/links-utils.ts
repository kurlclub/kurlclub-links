import type { ContactItem } from "./links-types";

const PROTOCOL_RE = /^[a-z][a-z0-9+\-.]*:/i;

export function ensureHttps(value: string): string {
  const v = value.trim();
  if (!v) return v;
  if (PROTOCOL_RE.test(v)) return v;
  return `https://${v}`;
}

export function stripProtocol(value: string): string {
  return value.replace(/^https?:\/\//i, "").trim();
}

export function contactHref(item: ContactItem): string {
  const v = item.value.trim();
  if (!v) return "";
  switch (item.linkType) {
    case "phone": {
      const digits = v.replace(/[^\d+]/g, "");
      return `tel:${digits}`;
    }
    case "whatsapp": {
      const digits = v.replace(/\D/g, "");
      return `https://wa.me/${digits}`;
    }
    case "email":
      return `mailto:${v}`;
    case "url":
    default:
      return ensureHttps(v);
  }
}
