import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FaArrowUpRightFromSquare,
  FaCalendarCheck,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaLocationDot,
  FaMedium,
  FaPhone,
  FaSquareWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const locationMapUrl =
  "https://maps.app.goo.gl/W7v8WQcmWHBUpMa96?g_st=ac";
const locationAddress = [
  "KurlTech Systems Private Limited",
  "5th floor, Tower 1",
  "Hilite Business park",
  "Palazhi, Calicut",
  "673014",
].join(", ");
const locationEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

type LinkItem = {
  title: string;
  subtitle: string;
  href: string;
  icon: IconType;
  iconColor: string;
  gridClass: string;
  toneClass: string;
  feature?: boolean;
};

const linkItems: LinkItem[] = [
  {
    title: "Book A Product Demo",
    subtitle: "Schedule a guided walkthrough",
    href: "https://www.kurlclub.com/enquiry",
    icon: FaCalendarCheck,
    iconColor: "text-emerald-400",
    gridClass: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1",
    toneClass: "from-emerald-500/20 to-emerald-900/20",
    feature: true,
  },
  {
    title: "Visit Website",
    subtitle: "Explore product details",
    href: "https://www.kurlclub.com",
    icon: FaGlobe,
    iconColor: "text-sky-400",
    gridClass: "col-span-1 row-span-1",
    toneClass: "from-sky-500/20 to-sky-900/20",
  },
  {
    title: "Instagram",
    subtitle: "Daily studio growth tips",
    href: "https://www.instagram.com/kurlclub/",
    icon: FaInstagram,
    iconColor: "text-[#E4405F]",
    gridClass: "col-span-1 row-span-1",
    toneClass: "from-[#E4405F]/25 to-[#833AB4]/15",
  },
  {
    title: "LinkedIn",
    subtitle: "Company updates and releases",
    href: "https://www.linkedin.com/company/110242938/admin/dashboard/",
    icon: FaLinkedin,
    iconColor: "text-[#0A66C2]",
    gridClass: "col-span-1 row-span-1",
    toneClass: "from-[#0A66C2]/25 to-[#0A66C2]/10",
  },
  {
    title: "YouTube",
    subtitle: "Product videos and walkthroughs",
    href: "https://www.youtube.com/@kurlclub",
    icon: FaYoutube,
    iconColor: "text-[#FF0000]",
    gridClass: "col-span-1 row-span-1",
    toneClass: "from-[#FF0000]/20 to-[#7f1d1d]/10",
  },
  {
    title: "Medium",
    subtitle: "Stories from the fitness tech team",
    href: "https://medium.com/@kurlclub",
    icon: FaMedium,
    iconColor: "text-[#00AB6C]",
    gridClass: "col-span-1 row-span-1",
    toneClass: "from-[#00AB6C]/20 to-[#14532d]/10",
  },
  {
    title: "Twitter / X",
    subtitle: "Quick updates and announcements",
    href: "https://x.com/kurlclub",
    icon: FaXTwitter,
    iconColor: "text-white",
    gridClass: "col-span-1 row-span-1",
    toneClass: "from-white/10 to-white/5",
  },
  {
    title: "WhatsApp",
    subtitle: "Instant sales and support chat",
    href: "https://wa.me/917994990530",
    icon: FaSquareWhatsapp,
    iconColor: "text-[#25D366]",
    gridClass: "col-span-1 row-span-1",
    toneClass: "from-[#25D366]/20 to-[#14532d]/10",
  },
  {
    title: "Facebook",
    subtitle: "Community highlights",
    href: "https://www.facebook.com/profile.php?id=61584311866193",
    icon: FaFacebook,
    iconColor: "text-[#1877F2]",
    gridClass: "col-span-1 row-span-1",
    toneClass: "from-[#1877F2]/20 to-[#172554]/10",
  },
  {
    title: "Call Us",
    subtitle: "+91 79949 90530",
    href: "tel:+917994990530",
    icon: FaPhone,
    iconColor: "text-lime-400",
    gridClass: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1",
    toneClass: "from-lime-500/20 to-lime-900/20",
    feature: true,
  },
];

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090d14] px-3 py-3 sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#ffd54f]/18 blur-3xl" />
        <div className="absolute -right-16 top-12 h-80 w-80 rounded-full bg-[#22c55e]/16 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#38bdf8]/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl gap-3 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-lg border border-white/15 bg-gradient-to-r from-[#101828] via-[#0f1a2c] to-[#13243a] px-5 py-6 shadow-[0_28px_65px_rgba(0,0,0,0.48)] lg:col-span-12 sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-secondary-yellow-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-secondary-green-500/20 blur-3xl" />

          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0 max-w-3xl">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/25 bg-white/10 shadow-[0_10px_22px_rgba(0,0,0,0.35)]">
                  <Image
                    src="/favicon.png"
                    alt="KurlClub logo"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-secondary-yellow-150/90">
                    KurlClub
                  </p>
                  <h1 className="text-2xl font-semibold text-white sm:text-4xl">
                    Fitness Studio Social Hub
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-blue-100 sm:text-base">
                A single destination for every channel your studio runs on. Grow
                visibility, answer leads faster, and keep your community connected.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white/85">
                24x7 support
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white/85">
                Trusted by studios
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white/85">
                India + GCC
              </div>
              <a
                href={locationMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-secondary-green-300/35 bg-secondary-green-500/15 px-3 py-2 text-secondary-green-100 k-transition hover:bg-secondary-green-500/25"
              >
                Calicut HQ
              </a>
            </div>
          </div>
        </div>

        <div className="grid auto-rows-[96px] grid-cols-1 gap-3 sm:auto-rows-[106px] sm:grid-cols-2 md:grid-cols-4 lg:col-span-12">
          <div className="group relative col-span-1 row-span-2 overflow-hidden rounded-lg border border-white/15 bg-[#111b2b]/90 shadow-[0_20px_38px_rgba(0,0,0,0.35)] backdrop-blur-md sm:col-span-2 md:col-span-2 md:row-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/22 to-red-950/20 opacity-90" />

            <div className="relative h-full">
              <a
                href={locationMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open KurlTech Systems Private Limited in Google Maps"
                className="relative block h-full min-h-[190px] overflow-hidden rounded-lg border border-white/12 bg-[#0e1520]"
              >
                <iframe
                  title="KurlTech Systems Private Limited location map"
                  src={locationEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1119] via-[#0b1119]/70 to-transparent p-3">
                  <p className="text-[11px] font-medium text-white/90">{locationAddress}</p>
                </div>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg border border-white/20 bg-[#0b1119]/80 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur">
                  Open Map
                  <FaArrowUpRightFromSquare size={10} />
                </span>
              </a>
            </div>
          </div>

          {linkItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className={`group ${item.gridClass} relative overflow-hidden rounded-lg p-3 backdrop-blur-md k-transition hover:-translate-y-1 ${
                    item.title === "Book A Product Demo"
                      ? "border-2 border-emerald-300/75 ring-1 ring-emerald-300/35 bg-[#0f221b]/90 shadow-[0_10px_28px_rgba(0,0,0,0.28)] hover:border-emerald-200"
                      : "border border-white/12 bg-[#111a28]/90 shadow-[0_14px_30px_rgba(0,0,0,0.26)] hover:border-white/25"
                  }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.toneClass} opacity-80`}
                />
                <div className="absolute inset-0 opacity-0 k-transition group-hover:opacity-100 [background:radial-gradient(90%_120%_at_10%_10%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_50%)]" />

                <div className="relative flex h-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex ${item.feature ? "h-12 w-12" : "h-10 w-10"} items-center justify-center rounded-lg border border-white/15 bg-[#0e1520]/95`}
                    >
                      <Icon className={item.iconColor} size={item.feature ? 24 : 22} />
                    </span>
                    <div>
                      <p
                        className={`${item.feature ? "text-[15px]" : "text-sm"} font-semibold text-white/95`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/65">{item.subtitle}</p>
                    </div>
                  </div>

                  <FaArrowUpRightFromSquare
                    size={13}
                    className="text-white/65 k-transition group-hover:text-white/90"
                  />
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
