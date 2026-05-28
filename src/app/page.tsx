import {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaLocationDot,
} from "react-icons/fa6";

import { RenderIcon } from "@/lib/icons";
import { readLinksData } from "@/lib/links-data";
import { contactHref, ensureHttps } from "@/lib/links-utils";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await readLinksData();

  const locationEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.location.addressLines.join(", "),
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const footer = data.footer.replace(
    "{year}",
    String(new Date().getFullYear()),
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a10] px-4 py-6 sm:px-6 sm:py-10">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary-green-500/10 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-secondary-green-500/12 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-secondary-yellow-500/8 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:32px_32px]" />
      </div>

      <section className="relative mx-auto flex w-full max-w-3xl flex-col gap-4">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 backdrop-blur-xl sm:px-7 sm:py-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-green-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-secondary-green-500/15 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] sm:h-[72px] sm:w-[72px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.hero.logo}
                alt={`${data.hero.title} logo`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              {data.hero.eyebrow && (
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary-green-300/90">
                  {data.hero.eyebrow}
                </p>
              )}
              <h1 className="mt-1 text-2xl font-semibold leading-tight text-white sm:text-[28px]">
                {data.hero.title}
              </h1>
            </div>
          </div>

          {data.hero.description && (
            <p className="relative mt-4 max-w-xl text-[13px] leading-relaxed text-white/65 sm:text-sm">
              {data.hero.description}
            </p>
          )}

          <div className="relative mt-4 flex flex-wrap items-center gap-1.5 text-[11px] text-white/70">
            {data.hero.tags.map((tag, idx) => (
              <span
                key={`${tag.label}-${idx}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"
                style={
                  tag.kind === "text" && tag.color
                    ? { color: tag.color }
                    : undefined
                }
              >
                {tag.kind === "dot" && (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: tag.color ?? "#34d399" }}
                  />
                )}
                {tag.label}
              </span>
            ))}
            {data.location.chipLabel && (
              <a
                href={data.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/75 k-transition hover:border-primary-green-500/40 hover:bg-primary-green-500/10 hover:text-primary-green-200"
              >
                <FaLocationDot className="text-primary-green-400" size={10} />
                {data.location.chipLabel}
              </a>
            )}
          </div>
        </header>

        {/* Featured CTA */}
        <a
          href={data.featured.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-2xl border border-primary-green-500/35 bg-gradient-to-br from-primary-green-500/[0.18] via-primary-green-500/[0.08] to-transparent px-5 py-5 shadow-[0_20px_50px_-12px_rgba(211,247,2,0.18)] k-transition hover:border-primary-green-500/60 hover:shadow-[0_24px_60px_-12px_rgba(211,247,2,0.28)] sm:px-6"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-green-500/20 blur-3xl k-transition group-hover:bg-primary-green-500/30" />

          <div className="relative flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary-green-500/40 bg-primary-green-500/15 shadow-inner sm:h-14 sm:w-14">
              <RenderIcon
                name={data.featured.icon}
                className="text-primary-green-300"
                size={22}
              />
            </span>
            <div className="min-w-0 flex-1">
              {data.featured.eyebrow && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-green-300/90">
                  {data.featured.eyebrow}
                </p>
              )}
              <p className="mt-0.5 text-base font-semibold text-white sm:text-[17px]">
                {data.featured.title}
              </p>
              {data.featured.description && (
                <p className="mt-0.5 text-[12px] text-white/60">
                  {data.featured.description}
                </p>
              )}
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 k-transition group-hover:translate-x-0.5 group-hover:border-primary-green-500/40 group-hover:bg-primary-green-500/15 group-hover:text-primary-green-200">
              <FaArrowRight size={13} />
            </span>
          </div>
        </a>

        {/* Quick contact row */}
        {data.contactItems.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {data.contactItems.map((item) => {
              const href = contactHref(item);
              const isExternal = href.startsWith("http");

              return (
                <a
                  key={item.id}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl k-transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <RenderIcon
                      name={item.icon}
                      color={item.iconColor}
                      size={18}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-white/95">
                      {item.title}
                    </p>
                    <p className="truncate text-[11px] text-white/55">
                      {item.subtitle}
                    </p>
                  </div>
                  <FaArrowUpRightFromSquare
                    size={11}
                    className="text-white/30 k-transition group-hover:text-white/70"
                  />
                </a>
              );
            })}
          </div>
        )}

        {/* Socials */}
        {data.socialItems.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/45">
                Follow us
              </p>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {data.socialItems.map((item) => (
                <a
                  key={item.id}
                  href={ensureHttps(item.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 backdrop-blur-xl k-transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] k-transition group-hover:border-white/20">
                    <RenderIcon
                      name={item.icon}
                      color={item.brandColor}
                      size={17}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-white/95">
                      {item.title}
                    </p>
                    <p className="truncate text-[11px] text-white/50">
                      {item.handle}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <a
          href={data.location.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${data.location.cardTitle} in Google Maps`}
          className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl k-transition hover:border-white/20"
        >
          <div className="relative h-44 w-full overflow-hidden sm:h-52">
            <iframe
              title={`${data.location.cardTitle} location map`}
              src={locationEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full grayscale-[0.3] k-transition group-hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070a10] via-[#070a10]/40 to-transparent" />
            <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#070a10]/80 px-2.5 py-1 text-[10px] font-medium text-white/85 backdrop-blur">
              Open in Maps
              <FaArrowUpRightFromSquare size={9} />
            </span>
          </div>
          <div className="relative flex items-start gap-3 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <FaLocationDot className="text-rose-400" size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white/95">
                {data.location.cardTitle}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-white/55">
                {data.location.cardSubtitle}
              </p>
            </div>
          </div>
        </a>

        <p className="mt-2 text-center text-[11px] text-white/35">{footer}</p>
      </section>
    </main>
  );
}
