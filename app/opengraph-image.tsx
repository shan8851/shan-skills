import { ImageResponse } from "next/og";

export const alt = "Shan Skills";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";

const titleAscii = String.raw`███████╗██╗  ██╗ █████╗ ███╗   ██╗      ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗`;

const OpenGraphImage = (): ImageResponse => {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "44px",
        background: "linear-gradient(160deg, #060d09 0%, #08140d 100%)",
        color: "#d5f5dc",
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
          padding: "34px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              color: "#8fffaf",
              fontFamily: "monospace",
              fontSize: 20,
              lineHeight: 1.1,
              whiteSpace: "pre",
            }}
          >
            {titleAscii}
          </div>
          <div
            style={{
              color: "#d5f5dc",
              fontFamily: "monospace",
              fontSize: 34,
              lineHeight: 1.2,
              maxWidth: "90%",
            }}
          >
            Keyboard-first terminal catalog of coding-agent skills.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 24,
            color: "#8cb498",
          }}
        >
          <span>skills.shan8851.com</span>
          <span>@shan8851</span>
        </div>
      </div>
    </div>,
  );
};

export default OpenGraphImage;
