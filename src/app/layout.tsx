import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-figtree",
  display: "swap",
});

const siteUrl = "https://www.kurlclub.com";
const socialPreviewImageUrl = `${siteUrl}/assets/png/thumbnail-1.png`;

export const metadata: Metadata = {
  title: {
    template: "%s | KurlClub - Fitness Center Management Software",
    default:
      "KurlClub - Fitness Center Management Software | Fitness Studio Management Platform",
  },
  description:
    "KurlClub is the leading fitness center management software in India & GCC. Manage members, attendance, payments & trainers for fitness centers, yoga studios, dance classes & martial arts. Book a demo today!",

  applicationName: "KurlClub",
  authors: [{ name: "KurlClub" }],
  creator: "KurlClub",
  publisher: "KurlClub",
  metadataBase: new URL(siteUrl),
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "KurlClub - Fitness Center Management Software | Fitness Studio Management Platform",
    description:
      "Leading fitness center management software for India & GCC. Manage members, attendance, payments & trainers. Perfect for fitness centers, yoga studios, dance classes & martial arts.",
    url: siteUrl,
    siteName: "KurlClub",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: socialPreviewImageUrl,
        secureUrl: socialPreviewImageUrl,
        type: "image/png",
        width: 1200,
        height: 630,
        alt: "KurlClub Fitness Center Management Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KurlClub - Fitness Center Management Software",
    description:
      "Leading fitness center management software for India & GCC. Book a demo today!",
    images: [socialPreviewImageUrl],
  },
  appleWebApp: {
    title: "KurlClub",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-favicon.png", type: "image/png" }],
    other: [{ rel: "icon", url: "/favicon.png", type: "image/png" }],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <meta name="theme-color" content="#D3F702" />
        <meta name="format-detection" content="telephone=no" />

        <meta property="og:image" content={socialPreviewImageUrl} />
        <meta property="og:image:secure_url" content={socialPreviewImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="KurlClub Fitness Center Management Software"
        />
        <meta property="og:url" content="https://www.kurlclub.com" />
        <meta property="og:type" content="website" />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NKR6LT05KK"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-NKR6LT05KK');
  `}
        </Script>
        <Script
          src="https://darkvisitors.com/tracker.js?project_key=fcf9a74b-57ed-4556-9e33-eb41d35d319c"
          strategy="afterInteractive"
          async
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5J4836WX');
            `,
          }}
        />
      </head>
      <body className={figtree.variable}>{children}</body>
    </html>
  );
}
