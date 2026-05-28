"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

import { ICON_NAMES } from "@/lib/icons";
import type {
  ContactItem,
  ContactLinkType,
  LinksData,
  SocialItem,
} from "@/lib/links-types";
import { stripProtocol } from "@/lib/links-utils";

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

const linksQueryKey = ["links"] as const;

async function fetchLinks(): Promise<LinksData> {
  const res = await fetch("/api/links", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load (HTTP ${res.status})`);
  return res.json();
}

async function requestOtpApi(): Promise<{ sessionId: string; sentTo: string }> {
  const res = await fetch("/api/admin/request-otp", { method: "POST" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

async function verifyAndSaveApi(input: {
  sessionId: string;
  code: string;
  data: LinksData;
}): Promise<{ ok: true }> {
  const res = await fetch("/api/admin/verify-and-save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

async function uploadLogoApi(file: File): Promise<{ path: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload-logo", {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-green-500/60 focus:bg-white/[0.06]";
const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55";
const sectionClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6";
const subCardClass = "rounded-xl border border-white/10 bg-white/[0.03] p-4";
const buttonGhost =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]";
const buttonDanger =
  "inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-200 transition hover:border-rose-500/50 hover:bg-rose-500/20";
const buttonPrimary =
  "inline-flex items-center gap-2 rounded-lg border border-primary-green-500/50 bg-primary-green-500/15 px-4 py-2 text-sm font-semibold text-primary-green-200 transition hover:border-primary-green-500/80 hover:bg-primary-green-500/25 disabled:cursor-not-allowed disabled:opacity-50";

export default function AdminPage() {
  const queryClient = useQueryClient();
  const linksQuery = useQuery({
    queryKey: linksQueryKey,
    queryFn: fetchLinks,
  });

  // `draft` holds user edits once they start typing. Until then, render from query.
  const [draft, setDraft] = useState<LinksData | null>(null);
  const data: LinksData | null = draft ?? linksQuery.data ?? null;

  const isDirty = useMemo(() => {
    if (!draft || !linksQuery.data) return false;
    return JSON.stringify(draft) !== JSON.stringify(linksQuery.data);
  }, [draft, linksQuery.data]);

  function setData(updater: (prev: LinksData) => LinksData) {
    setDraft((prev) => {
      const base = prev ?? linksQuery.data;
      if (!base) return prev;
      return updater(base);
    });
  }

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const requestOtpMutation = useMutation({
    mutationFn: requestOtpApi,
    onSuccess: (res) => {
      setSessionId(res.sessionId);
      setSentTo(res.sentTo);
      setOtpCode("");
      setOtpModalOpen(true);
    },
  });

  const saveMutation = useMutation({
    mutationFn: verifyAndSaveApi,
    onSuccess: (_res, vars) => {
      queryClient.setQueryData<LinksData>(linksQueryKey, vars.data);
      setDraft(null);
      setOtpModalOpen(false);
      setSessionId(null);
      setSentTo(null);
      setOtpCode("");
      setSavedAt(Date.now());
    },
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const uploadLogoMutation = useMutation({
    mutationFn: uploadLogoApi,
    onSuccess: (res) => {
      setData((prev) => ({ ...prev, hero: { ...prev.hero, logo: res.path } }));
    },
    onSettled: () => {
      if (logoInputRef.current) logoInputRef.current.value = "";
    },
  });

  const iconOptions = useMemo(
    () =>
      ICON_NAMES.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      )),
    [],
  );

  if (linksQuery.isLoading || data === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070a10] text-white/70">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-green-400" />
          Loading admin…
        </div>
      </main>
    );
  }

  if (linksQuery.isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#070a10] text-rose-300">
        <p>Failed to load data: {linksQuery.error.message}</p>
        <button
          type="button"
          onClick={() => linksQuery.refetch()}
          className={buttonGhost}
        >
          Retry
        </button>
      </main>
    );
  }

  function update<K extends keyof LinksData>(key: K, value: LinksData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function requestOtp() {
    if (!isDirty) return;
    setSavedAt(null);
    requestOtpMutation.reset();
    saveMutation.reset();
    requestOtpMutation.mutate();
  }

  function submitOtp() {
    if (!sessionId || !data) return;
    saveMutation.mutate({ sessionId, code: otpCode.trim(), data });
  }

  function cancelOtp() {
    setOtpModalOpen(false);
    setSessionId(null);
    setSentTo(null);
    setOtpCode("");
    saveMutation.reset();
  }

  function handleLogoUpload(file: File) {
    uploadLogoMutation.mutate(file);
  }

  const requestingOtp = requestOtpMutation.isPending;
  const savingOtp = saveMutation.isPending;
  const canSave = isDirty && !requestingOtp && !savingOtp;

  // ---------- Hero ----------
  const hero = data.hero;
  function setHero<K extends keyof typeof hero>(k: K, v: (typeof hero)[K]) {
    update("hero", { ...hero, [k]: v });
  }

  // ---------- Location ----------
  const location = data.location;
  function setLoc<K extends keyof typeof location>(
    k: K,
    v: (typeof location)[K],
  ) {
    update("location", { ...location, [k]: v });
  }

  // ---------- Featured ----------
  const featured = data.featured;
  function setFeatured<K extends keyof typeof featured>(
    k: K,
    v: (typeof featured)[K],
  ) {
    update("featured", { ...featured, [k]: v });
  }

  function moveItem<T>(arr: T[], from: number, dir: -1 | 1): T[] {
    const to = from + dir;
    if (to < 0 || to >= arr.length) return arr;
    const copy = [...arr];
    const [m] = copy.splice(from, 1);
    copy.splice(to, 0, m);
    return copy;
  }

  return (
    <main className="relative min-h-screen bg-[#070a10] px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary-green-500/8 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:32px_32px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary-green-300/90">
              KurlClub Links
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
              Admin
            </h1>
            <p className="mt-1 text-sm text-white/55">
              Edit any section below. Saving requires an OTP sent to the
              official KurlClub email.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonGhost}
            >
              View site →
            </a>
            <button
              type="button"
              onClick={requestOtp}
              disabled={!canSave}
              className={buttonPrimary}
              title={!isDirty ? "No changes to save" : undefined}
            >
              {requestingOtp
                ? "Sending OTP…"
                : isDirty
                  ? "Save changes"
                  : "No changes"}
            </button>
          </div>
        </header>

        {savedAt && !isDirty && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            <FaCheckCircle /> Changes saved successfully.
          </div>
        )}
        {requestOtpMutation.isError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {requestOtpMutation.error.message}
          </div>
        )}

        {/* HERO */}
        <section className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-white">Hero</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                className={fieldClass}
                value={hero.eyebrow}
                onChange={(e) => setHero("eyebrow", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={fieldClass}
                value={hero.title}
                onChange={(e) => setHero("title", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Logo</label>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.logo}
                  alt=""
                  className="h-14 w-14 rounded-lg border border-white/10 object-cover"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                    />
                    <button
                      type="button"
                      className={buttonGhost}
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadLogoMutation.isPending}
                    >
                      <FaUpload size={10} />
                      {uploadLogoMutation.isPending
                        ? "Uploading…"
                        : "Upload image"}
                    </button>
                    <input
                      className={`${fieldClass} flex-1`}
                      placeholder="or paste a path / URL"
                      value={hero.logo}
                      onChange={(e) => setHero("logo", e.target.value)}
                    />
                  </div>
                  <p className="text-[11px] text-white/40">
                    PNG, JPG, WebP, GIF, or SVG. Max 2 MB.
                  </p>
                  {uploadLogoMutation.isError && (
                    <p className="text-[11px] text-rose-300">
                      {uploadLogoMutation.error.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                className={`${fieldClass} min-h-[80px]`}
                value={hero.description}
                onChange={(e) => setHero("description", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className={labelClass}>Tags</label>
              <button
                type="button"
                className={buttonGhost}
                onClick={() =>
                  setHero("tags", [
                    ...hero.tags,
                    { label: "New tag", kind: "text" },
                  ])
                }
              >
                <FaPlus size={10} /> Add tag
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {hero.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2"
                >
                  <input
                    className={`${fieldClass} flex-1 min-w-35`}
                    placeholder="Label"
                    value={tag.label}
                    onChange={(e) => {
                      const next = [...hero.tags];
                      next[idx] = { ...next[idx], label: e.target.value };
                      setHero("tags", next);
                    }}
                  />
                  <select
                    className={`${fieldClass} w-32`}
                    value={tag.kind}
                    onChange={(e) => {
                      const next = [...hero.tags];
                      next[idx] = {
                        ...next[idx],
                        kind: e.target.value as "dot" | "text",
                      };
                      setHero("tags", next);
                    }}
                  >
                    <option value="text">text</option>
                    <option value="dot">with dot</option>
                  </select>
                  {tag.kind === "dot" && (
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                        value={tag.color ?? "#34d399"}
                        onChange={(e) => {
                          const next = [...hero.tags];
                          next[idx] = { ...next[idx], color: e.target.value };
                          setHero("tags", next);
                        }}
                        title="Dot color"
                      />
                      {tag.color && (
                        <button
                          type="button"
                          className="text-[10px] text-white/40 hover:text-white/70"
                          onClick={() => {
                            const next = [...hero.tags];
                            const { color: _drop, ...rest } = next[idx];
                            void _drop;
                            next[idx] = rest;
                            setHero("tags", next);
                          }}
                          title="Reset color"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    className={buttonDanger}
                    onClick={() =>
                      setHero(
                        "tags",
                        hero.tags.filter((_, i) => i !== idx),
                      )
                    }
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
              {hero.tags.length === 0 && (
                <p className="text-xs text-white/40">No tags.</p>
              )}
            </div>
          </div>
        </section>

        {/* FEATURED */}
        <section className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Featured card
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                className={fieldClass}
                value={featured.eyebrow}
                onChange={(e) => setFeatured("eyebrow", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={fieldClass}
                value={featured.title}
                onChange={(e) => setFeatured("title", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <input
                className={fieldClass}
                value={featured.description}
                onChange={(e) => setFeatured("description", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Link (href)</label>
              <input
                className={fieldClass}
                value={featured.href}
                onChange={(e) => setFeatured("href", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Icon</label>
              <select
                className={fieldClass}
                value={featured.icon}
                onChange={(e) => setFeatured("icon", e.target.value)}
              >
                {iconOptions}
              </select>
            </div>
          </div>
        </section>

        {/* LOCATION */}
        <section className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-white">Location</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Chip label (hero)</label>
              <input
                className={fieldClass}
                value={location.chipLabel}
                onChange={(e) => setLoc("chipLabel", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Map URL</label>
              <input
                className={fieldClass}
                value={location.mapUrl}
                onChange={(e) => setLoc("mapUrl", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Card title</label>
              <input
                className={fieldClass}
                value={location.cardTitle}
                onChange={(e) => setLoc("cardTitle", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Card subtitle</label>
              <input
                className={fieldClass}
                value={location.cardSubtitle}
                onChange={(e) => setLoc("cardSubtitle", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className={labelClass}>
                Address lines (used in embed)
              </label>
              <button
                type="button"
                className={buttonGhost}
                onClick={() =>
                  setLoc("addressLines", [...location.addressLines, ""])
                }
              >
                <FaPlus size={10} /> Add line
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {location.addressLines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className={`${fieldClass} flex-1`}
                    value={line}
                    onChange={(e) => {
                      const next = [...location.addressLines];
                      next[idx] = e.target.value;
                      setLoc("addressLines", next);
                    }}
                  />
                  <button
                    type="button"
                    className={buttonDanger}
                    onClick={() =>
                      setLoc(
                        "addressLines",
                        location.addressLines.filter((_, i) => i !== idx),
                      )
                    }
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / LINKS */}
        <section className={sectionClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Quick links</h2>
            <button
              type="button"
              className={buttonGhost}
              onClick={() =>
                update("contactItems", [
                  ...data.contactItems,
                  {
                    id: randomId("contact"),
                    title: "New link",
                    subtitle: "",
                    linkType: "url",
                    value: "",
                    icon: "FaGlobe",
                    iconColor: "#ffffff",
                  } satisfies ContactItem,
                ])
              }
            >
              <FaPlus size={10} /> Add link
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {data.contactItems.map((item, idx) => (
              <div key={item.id} className={subCardClass}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Link #{idx + 1}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className={buttonGhost}
                      onClick={() =>
                        update(
                          "contactItems",
                          moveItem(data.contactItems, idx, -1),
                        )
                      }
                      disabled={idx === 0}
                    >
                      <FaArrowUp size={10} />
                    </button>
                    <button
                      type="button"
                      className={buttonGhost}
                      onClick={() =>
                        update(
                          "contactItems",
                          moveItem(data.contactItems, idx, 1),
                        )
                      }
                      disabled={idx === data.contactItems.length - 1}
                    >
                      <FaArrowDown size={10} />
                    </button>
                    <button
                      type="button"
                      className={buttonDanger}
                      onClick={() =>
                        update(
                          "contactItems",
                          data.contactItems.filter((_, i) => i !== idx),
                        )
                      }
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      className={fieldClass}
                      value={item.title}
                      onChange={(e) => {
                        const next = [...data.contactItems];
                        next[idx] = { ...next[idx], title: e.target.value };
                        update("contactItems", next);
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subtitle</label>
                    <input
                      className={fieldClass}
                      value={item.subtitle}
                      onChange={(e) => {
                        const next = [...data.contactItems];
                        next[idx] = { ...next[idx], subtitle: e.target.value };
                        update("contactItems", next);
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Link type</label>
                    <select
                      className={fieldClass}
                      value={item.linkType}
                      onChange={(e) => {
                        const next = [...data.contactItems];
                        next[idx] = {
                          ...next[idx],
                          linkType: e.target.value as ContactLinkType,
                        };
                        update("contactItems", next);
                      }}
                    >
                      <option value="url">Website / link</option>
                      <option value="phone">Phone number</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email address</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      {item.linkType === "phone"
                        ? "Phone number"
                        : item.linkType === "whatsapp"
                          ? "WhatsApp number"
                          : item.linkType === "email"
                            ? "Email address"
                            : "URL"}
                    </label>
                    <input
                      className={fieldClass}
                      placeholder={
                        item.linkType === "phone"
                          ? "+91 79949 90530"
                          : item.linkType === "whatsapp"
                            ? "917994990530 (with country code)"
                            : item.linkType === "email"
                              ? "support@kurlclub.com"
                              : "www.kurlclub.com"
                      }
                      value={item.value}
                      onChange={(e) => {
                        const next = [...data.contactItems];
                        next[idx] = { ...next[idx], value: e.target.value };
                        update("contactItems", next);
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Icon</label>
                    <select
                      className={fieldClass}
                      value={item.icon}
                      onChange={(e) => {
                        const next = [...data.contactItems];
                        next[idx] = { ...next[idx], icon: e.target.value };
                        update("contactItems", next);
                      }}
                    >
                      {iconOptions}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Icon color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                        value={item.iconColor}
                        onChange={(e) => {
                          const next = [...data.contactItems];
                          next[idx] = {
                            ...next[idx],
                            iconColor: e.target.value,
                          };
                          update("contactItems", next);
                        }}
                      />
                      <input
                        className={`${fieldClass} flex-1`}
                        value={item.iconColor}
                        onChange={(e) => {
                          const next = [...data.contactItems];
                          next[idx] = {
                            ...next[idx],
                            iconColor: e.target.value,
                          };
                          update("contactItems", next);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {data.contactItems.length === 0 && (
              <p className="text-xs text-white/40">No quick links.</p>
            )}
          </div>
        </section>

        {/* SOCIALS */}
        <section className={sectionClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Social media</h2>
            <button
              type="button"
              className={buttonGhost}
              onClick={() =>
                update("socialItems", [
                  ...data.socialItems,
                  {
                    id: randomId("social"),
                    title: "New social",
                    handle: "@kurlclub",
                    href: "",
                    icon: "FaInstagram",
                    brandColor: "#ffffff",
                  } satisfies SocialItem,
                ])
              }
            >
              <FaPlus size={10} /> Add social
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {data.socialItems.map((item, idx) => (
              <div key={item.id} className={subCardClass}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Social #{idx + 1}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className={buttonGhost}
                      onClick={() =>
                        update(
                          "socialItems",
                          moveItem(data.socialItems, idx, -1),
                        )
                      }
                      disabled={idx === 0}
                    >
                      <FaArrowUp size={10} />
                    </button>
                    <button
                      type="button"
                      className={buttonGhost}
                      onClick={() =>
                        update(
                          "socialItems",
                          moveItem(data.socialItems, idx, 1),
                        )
                      }
                      disabled={idx === data.socialItems.length - 1}
                    >
                      <FaArrowDown size={10} />
                    </button>
                    <button
                      type="button"
                      className={buttonDanger}
                      onClick={() =>
                        update(
                          "socialItems",
                          data.socialItems.filter((_, i) => i !== idx),
                        )
                      }
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Label (title)</label>
                    <input
                      className={fieldClass}
                      value={item.title}
                      onChange={(e) => {
                        const next = [...data.socialItems];
                        next[idx] = { ...next[idx], title: e.target.value };
                        update("socialItems", next);
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Handle / description</label>
                    <input
                      className={fieldClass}
                      value={item.handle}
                      onChange={(e) => {
                        const next = [...data.socialItems];
                        next[idx] = { ...next[idx], handle: e.target.value };
                        update("socialItems", next);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Profile URL</label>
                    <input
                      className={fieldClass}
                      placeholder="www.instagram.com/kurlclub/"
                      value={item.href}
                      onChange={(e) => {
                        const next = [...data.socialItems];
                        next[idx] = {
                          ...next[idx],
                          href: stripProtocol(e.target.value),
                        };
                        update("socialItems", next);
                      }}
                    />
                    <p className="mt-1 text-[11px] text-white/40">
                      No need to include https:// — added automatically.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Icon</label>
                    <select
                      className={fieldClass}
                      value={item.icon}
                      onChange={(e) => {
                        const next = [...data.socialItems];
                        next[idx] = { ...next[idx], icon: e.target.value };
                        update("socialItems", next);
                      }}
                    >
                      {iconOptions}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Brand color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                        value={item.brandColor}
                        onChange={(e) => {
                          const next = [...data.socialItems];
                          next[idx] = {
                            ...next[idx],
                            brandColor: e.target.value,
                          };
                          update("socialItems", next);
                        }}
                      />
                      <input
                        className={`${fieldClass} flex-1`}
                        value={item.brandColor}
                        onChange={(e) => {
                          const next = [...data.socialItems];
                          next[idx] = {
                            ...next[idx],
                            brandColor: e.target.value,
                          };
                          update("socialItems", next);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {data.socialItems.length === 0 && (
              <p className="text-xs text-white/40">No social links.</p>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <section className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-white">Footer</h2>
          <label className={labelClass}>
            Footer text (use{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">
              {"{year}"}
            </code>{" "}
            for current year)
          </label>
          <input
            className={fieldClass}
            value={data.footer}
            onChange={(e) => update("footer", e.target.value)}
          />
        </section>

        {/* Bottom save bar */}
        <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-white/10 bg-[#0e1320]/90 px-4 py-3 backdrop-blur-xl">
          <p className="mr-auto text-xs text-white/55">
            {isDirty
              ? "Saving sends a one-time code to the official KurlClub email."
              : "No unsaved changes."}
          </p>
          <button
            type="button"
            onClick={requestOtp}
            disabled={!canSave}
            className={buttonPrimary}
            title={!isDirty ? "No changes to save" : undefined}
          >
            {requestingOtp
              ? "Sending OTP…"
              : isDirty
                ? "Save changes"
                : "No changes"}
          </button>
        </div>
      </div>

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1320] p-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Enter OTP</h3>
              <button
                type="button"
                className="text-white/50 hover:text-white"
                onClick={cancelOtp}
                disabled={savingOtp}
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-white/60">
              A 6-digit code was sent to{" "}
              <span className="font-semibold text-white/90">{sentTo}</span>.
              Enter it below to save your changes.
            </p>
            <input
              autoFocus
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={otpCode}
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-2xl font-semibold tracking-[0.6em] text-white outline-none focus:border-primary-green-500/60"
            />
            {saveMutation.isError && (
              <p className="mt-2 text-xs text-rose-300">
                {saveMutation.error.message}
              </p>
            )}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={requestOtp}
                disabled={savingOtp || requestingOtp}
                className={buttonGhost}
              >
                {requestingOtp ? "Sending…" : "Resend code"}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelOtp}
                  disabled={savingOtp}
                  className={buttonGhost}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitOtp}
                  disabled={otpCode.length !== 6 || savingOtp}
                  className={buttonPrimary}
                >
                  {savingOtp ? "Saving…" : "Verify & save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
