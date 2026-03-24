import type { Metadata } from "next";
import { SUSE_Mono, VT323 } from "next/font/google";
import Script from "next/script";

import { rootMetadata } from "@/lib/site/siteMetadata";

import "./globals.css";

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

export const metadata: Metadata = rootMetadata;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${terminalBodyFont.variable} ${terminalDisplayFont.variable}`}
      >
        {children}
        <Script
          defer
          src="https://tux.taild7426e.ts.net:8443/script.js"
          data-website-id="060fd477-55a5-4de1-8a09-9d01127595fa"
        />
      </body>
    </html>
  );
};

export default RootLayout;
