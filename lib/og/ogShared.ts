import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { CSSProperties } from "react";

import { openGraphImageSize, siteName } from "@/lib/site/siteMetadata";

export const openGraphAlt = siteName;
export const openGraphContentType = "image/png";
export const openGraphRuntime = "nodejs";
export const openGraphTerminalFontFamily =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";

const terminalDisplayFontPath = join(
  process.cwd(),
  "public",
  "fonts",
  "vt323Regular.ttf",
);

const terminalPalette = {
  accent: "#ffffff",
  border: "#2a2a2a",
  bright: "#ffffff",
  muted: "#707070",
  panel: "#0d0d0d",
  panelMuted: "#141414",
  panelMutedStrong: "rgba(20, 20, 20, 0.95)",
  panelMutedSoft: "rgba(13, 13, 13, 0.95)",
  shadow: "#1a1a1a",
  text: "#e0e0e0",
} as const;

export const loadTerminalDisplayFont = async (): Promise<Buffer> => {
  return readFile(terminalDisplayFontPath);
};

export const createOpenGraphOptions = async (): Promise<{
  contentType: string;
  fonts: Array<{ data: Buffer; name: string; style: "normal"; weight: 400 }>;
  size: typeof openGraphImageSize;
}> => {
  const terminalDisplayFontData = await loadTerminalDisplayFont();

  return {
    contentType: openGraphContentType,
    size: openGraphImageSize,
    fonts: [
      {
        name: "VT323",
        data: terminalDisplayFontData,
        style: "normal",
        weight: 400,
      },
    ],
  };
};

export const createOpenGraphCanvasStyle = (
  background: string,
): CSSProperties => {
  return {
    width: "100%",
    height: "100%",
    display: "flex",
    padding: "44px",
    background,
    color: terminalPalette.text,
    fontFamily: openGraphTerminalFontFamily,
  };
};

export const openGraphFrameStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  border: `1px solid ${terminalPalette.border}`,
  background: terminalPalette.panel,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "30px",
};

export const openGraphHeaderRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 22,
  color: terminalPalette.muted,
  letterSpacing: "0.08em",
};

export const openGraphFooterRowStyle: CSSProperties = {
  ...openGraphHeaderRowStyle,
  fontSize: 24,
  borderTop: `1px solid ${terminalPalette.border}`,
  paddingTop: "14px",
};

export const openGraphDividerStyle: CSSProperties = {
  width: "100%",
  borderTop: `1px solid ${terminalPalette.border}`,
};

export const createOpenGraphDisplayTitleStyle = (
  fontSize: number,
): CSSProperties => {
  return {
    color: terminalPalette.bright,
    fontFamily: "VT323",
    fontSize,
    lineHeight: 0.8,
    letterSpacing: "2px",
    textShadow: `4px 4px 0 ${terminalPalette.shadow}`,
  };
};

export const openGraphKeyboardPanelStyle: CSSProperties = {
  width: "320px",
  border: `1px solid ${terminalPalette.border}`,
  background: `linear-gradient(180deg, ${terminalPalette.panelMutedStrong}, ${terminalPalette.panelMutedSoft})`,
  padding: "18px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

export const openGraphKeyboardHeadingStyle: CSSProperties = {
  color: terminalPalette.accent,
  fontFamily: "VT323",
  fontSize: 44,
  lineHeight: 0.85,
  letterSpacing: "1px",
};

export const openGraphStatsChipStyle: CSSProperties = {
  border: `1px solid ${terminalPalette.border}`,
  background: terminalPalette.panelMuted,
  padding: "8px 12px",
  fontSize: 20,
  letterSpacing: "0.05em",
};

export const openGraphPalette = terminalPalette;

export const truncateText = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
};

type FontSizeTier = {
  fontSize: number;
  maxCharacters: number;
};

export const selectFontSizeByCharacterCount = (
  characterCount: number,
  tiers: FontSizeTier[],
  fallbackFontSize: number,
): number => {
  const matchingTier = tiers.find(
    (tier) => characterCount <= tier.maxCharacters,
  );

  if (matchingTier !== undefined) {
    return matchingTier.fontSize;
  }

  return fallbackFontSize;
};
