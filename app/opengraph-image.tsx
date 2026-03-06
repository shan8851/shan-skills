import { ImageResponse } from "next/og";

import {
  createOpenGraphCanvasStyle,
  createOpenGraphDisplayTitleStyle,
  createOpenGraphOptions,
  openGraphAlt,
  openGraphContentType,
  openGraphDividerStyle,
  openGraphFooterRowStyle,
  openGraphFrameStyle,
  openGraphHeaderRowStyle,
  openGraphKeyboardHeadingStyle,
  openGraphKeyboardPanelStyle,
  openGraphPalette,
} from "@/lib/og/ogShared";
import {
  openGraphImageSize,
  siteCreatorHandle,
  siteDescription,
  siteUrl,
} from "@/lib/site/siteMetadata";

export const alt = openGraphAlt;
export const size = openGraphImageSize;
export const contentType = openGraphContentType;
export const runtime = "nodejs";

const keyboardHints = [
  { keys: "CMD/CTRL + K", description: "Focus search" },
  { keys: "/", description: "Focus search" },
  { keys: "UP / DOWN", description: "Move selection" },
  { keys: "ENTER", description: "Open skill" },
] as const;

const OpenGraphImage = async (): Promise<ImageResponse> => {
  const imageOptions = await createOpenGraphOptions();

  return new ImageResponse(
    <div
      style={createOpenGraphCanvasStyle(
        "radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.04), transparent 42%), linear-gradient(160deg, #050505 0%, #0a0a0a 100%)",
      )}
    >
      <div style={openGraphFrameStyle}>
        <div style={openGraphHeaderRowStyle}>
          <span>{siteUrl.replace("https://", "")}</span>
          <span>SHAN SKILLS // INDEX</span>
        </div>

        <div
          style={{ display: "flex", flex: 1, gap: "28px", marginTop: "24px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: "20px",
              minWidth: "0",
            }}
          >
            <div
              style={{
                ...createOpenGraphDisplayTitleStyle(154),
                lineHeight: 0.78,
                whiteSpace: "nowrap",
              }}
            >
              SHAN SKILLS
            </div>

            <div style={openGraphDividerStyle} />

            <div
              style={{
                color: openGraphPalette.text,
                fontSize: 46,
                lineHeight: 1.12,
                maxWidth: "92%",
              }}
            >
              {siteDescription}
            </div>
          </div>

          <div style={openGraphKeyboardPanelStyle}>
            <div style={openGraphKeyboardHeadingStyle}>KEYBOARD</div>

            {keyboardHints.map((shortcut) => {
              return (
                <div
                  key={shortcut.keys}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    color: openGraphPalette.text,
                    fontSize: 22,
                    borderTop: `1px solid ${openGraphPalette.border}`,
                    paddingTop: "8px",
                  }}
                >
                  <span style={{ color: openGraphPalette.accent }}>
                    {shortcut.keys}
                  </span>
                  <span
                    style={{
                      color: openGraphPalette.muted,
                      textAlign: "right",
                    }}
                  >
                    {shortcut.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={openGraphFooterRowStyle}>
          <span>Open source skills index</span>
          <span>{siteCreatorHandle}</span>
        </div>
      </div>
    </div>,
    imageOptions,
  );
};

export default OpenGraphImage;
