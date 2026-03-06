import type { Metadata } from "next";

export const siteName = "Shan Skills";
export const siteDescription =
  "Keyboard-first terminal-style catalog of Shan's custom coding-agent skills.";
export const siteUrl = "https://skills.shan8851.com";
export const siteLocale = "en_US";
export const siteCreatorHandle = "@shan8851";
export const siteAuthor = {
  name: "Shan",
  url: "https://x.com/shan8851",
} as const;
export const siteKeywords = [
  "coding agent skills",
  "ai agent skills",
  "terminal ui",
  "developer tools",
  "shan skills",
] as const;
export const siteIconPath = "/favicon.svg";
export const defaultOpenGraphImagePath = "/opengraph-image";
export const openGraphImageSize = {
  width: 1200,
  height: 630,
} as const;

export const buildSkillPath = (slug: string): string => {
  return `/skills/${slug}`;
};

export const buildSkillOpenGraphImagePath = (slug: string): string => {
  return `${buildSkillPath(slug)}/opengraph-image`;
};

export const buildAbsoluteSiteUrl = (path: string): string => {
  return `${siteUrl}${path}`;
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [...siteKeywords],
  authors: [siteAuthor],
  creator: siteAuthor.name,
  publisher: siteAuthor.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteLocale,
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    siteName,
    images: [
      {
        url: defaultOpenGraphImagePath,
        ...openGraphImageSize,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: siteCreatorHandle,
    title: siteName,
    description: siteDescription,
    images: [defaultOpenGraphImagePath],
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
    icon: [{ url: siteIconPath, type: "image/svg+xml" }],
    shortcut: [{ url: siteIconPath, type: "image/svg+xml" }],
    apple: [{ url: siteIconPath }],
  },
};
