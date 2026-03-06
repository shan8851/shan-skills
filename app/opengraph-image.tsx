import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Shan Skills";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";

const keyboardHints = [
  { keys: "CMD/CTRL + K", description: "Focus search" },
  { keys: "/", description: "Focus search" },
  { keys: "UP / DOWN", description: "Move selection" },
  { keys: "ENTER", description: "Open skill" },
] as const;

const vt323FontPath = join(process.cwd(), "public", "fonts", "vt323Regular.ttf");

const OpenGraphImage = async (): Promise<ImageResponse> => {
  const vt323FontData = await readFile(vt323FontPath);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "44px",
        background:
          "radial-gradient(circle at 18% 0%, rgba(84, 255, 140, 0.18), transparent 42%), linear-gradient(160deg, #060d09 0%, #08140d 100%)",
        color: "#d5f5dc",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #1f3b2a",
          background: "#0b1811",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#8cb498",
            letterSpacing: "0.08em",
          }}
        >
          <span>skills.shan8851.com</span>
          <span>SHAN SKILLS // INDEX</span>
        </div>

        <div style={{ display: "flex", flex: 1, gap: "28px", marginTop: "24px" }}>
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
                color: "#8fffaf",
                fontFamily: "VT323",
                fontSize: 154,
                lineHeight: 0.78,
                letterSpacing: "2px",
                whiteSpace: "nowrap",
                textShadow: "4px 4px 0 #1f3b2a",
              }}
            >
              SHAN SKILLS
            </div>

            <div
              style={{
                width: "100%",
                borderTop: "1px solid #1f3b2a",
              }}
            />

            <div
              style={{
                color: "#d5f5dc",
                fontSize: 46,
                lineHeight: 1.12,
                maxWidth: "92%",
              }}
            >
              Keyboard-first terminal catalog of coding-agent skills.
            </div>
          </div>

          <div
            style={{
              width: "320px",
              border: "1px solid #1f3b2a",
              background: "linear-gradient(180deg, rgba(14, 35, 24, 0.95), rgba(10, 24, 17, 0.95))",
              padding: "18px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                color: "#8fffaf",
                fontFamily: "VT323",
                fontSize: 44,
                lineHeight: 0.85,
                letterSpacing: "1px",
              }}
            >
              KEYBOARD
            </div>

            {keyboardHints.map((shortcut) => {
              return (
                <div
                  key={shortcut.keys}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    color: "#d5f5dc",
                    fontSize: 22,
                    borderTop: "1px solid #1f3b2a",
                    paddingTop: "8px",
                  }}
                >
                  <span style={{ color: "#8fffaf" }}>{shortcut.keys}</span>
                  <span style={{ color: "#8cb498", textAlign: "right" }}>{shortcut.description}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#8cb498",
            borderTop: "1px solid #1f3b2a",
            paddingTop: "14px",
          }}
        >
          <span>Open source skills index</span>
          <span>@shan8851</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "VT323", data: vt323FontData, style: "normal", weight: 400 }],
    },
  );
};

export default OpenGraphImage;
