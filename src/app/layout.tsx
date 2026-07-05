import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_TAGLINE, APP_URL } from "@/constants";
import { Preloader } from "@/components/layout/preloader";

// ------ Font Configuration ----------------------------------

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

// ------ SEO Metadata ----------------------------------------

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "ProServe connects you with verified, background-checked service professionals across the UAE. Book cleaning, electrical, plumbing, beauty, and more services with confidence.",
  keywords: [
    "home services UAE",
    "service professionals Dubai",
    "book services online UAE",
    "verified service providers",
    "home cleaning Dubai",
    "plumbing Dubai",
    "AC service Dubai",
    "ProServe",
  ],
  authors: [{ name: "ProServe" }],
  creator: "ProServe",
  publisher: "ProServe",
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      "Find and book verified service professionals across the UAE. Trusted by 50,000+ customers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProServe — Verified Service Professionals in the UAE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      "Find and book verified service professionals across the UAE.",
    images: ["/og-image.png"],
    creator: "@ProServeAE",
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

// ------ Root Layout -----------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${playfairDisplay.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
