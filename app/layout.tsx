import type { Metadata } from "next";
import { SUSE_Mono, VT323 } from "next/font/google";

import "./globals.css";

const siteName = "Shan Skills";
const siteDescription =
  "Keyboard-first terminal-style catalog of Shan's custom coding-agent skills.";
const siteUrl = "https://skills.shan8851.com";

const terminalBodyFont = SUSE_Mono({
  adjustFontFallback: false,
  variable: "--font-terminal-mono",
  subsets: ["latin"],
});

const terminalDisplayFont = VT323({
  variable: "--font-terminal-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "coding agent skills",
    "ai agent skills",
    "terminal ui",
    "developer tools",
    "shan skills",
  ],
  authors: [{ name: "Shan", url: "https://x.com/shan8851" }],
  creator: "Shan",
  publisher: "Shan",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    siteName,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@shan8851",
    title: siteName,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${terminalBodyFont.variable} ${terminalDisplayFont.variable}`}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
