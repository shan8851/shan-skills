import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getSkillBySlug } from "@/lib/skills/skillsData";

export const alt = "Shan Skills";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";

type SkillOgImageProps = {
  params: Promise<{ slug: string }>;
};

const vt323FontPath = join(process.cwd(), "public", "fonts", "vt323Regular.ttf");

const truncateText = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
};

const getTitleFontSize = (characterCount: number): number => {
  if (characterCount <= 12) {
    return 148;
  }

  if (characterCount <= 18) {
    return 132;
  }

  if (characterCount <= 26) {
    return 114;
  }

  if (characterCount <= 34) {
    return 92;
  }

  return 78;
};

const SkillOpenGraphImage = async ({ params }: SkillOgImageProps): Promise<ImageResponse> => {
  const vt323FontData = await readFile(vt323FontPath);

  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  const skillTitle = (skill?.name ?? slug).toUpperCase();
  const titleFontSize = getTitleFontSize(skillTitle.length);
  const description = truncateText(
    skill?.description ?? "Skill page for Shan Skills.",
    180,
  );
  const resourceCount = skill?.resourceDocuments.length ?? 0;
  const fileCount = resourceCount + 1;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "44px",
        background:
          "radial-gradient(circle at 15% 0%, rgba(84, 255, 140, 0.18), transparent 40%), linear-gradient(160deg, #060d09 0%, #08140d 100%)",
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
          <span>SHAN SKILLS // SKILL CARD</span>
          <span>skills.shan8851.com</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "16px",
            minWidth: "0",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              color: "#8cb498",
              fontSize: 24,
              letterSpacing: "0.08em",
            }}
          >
            {`/skills/${slug}`}
          </div>

          <div
            style={{
              color: "#8fffaf",
              fontFamily: "VT323",
              fontSize: titleFontSize,
              lineHeight: 0.8,
              letterSpacing: "2px",
              whiteSpace: "normal",
              textShadow: "4px 4px 0 #1f3b2a",
              maxWidth: "100%",
            }}
          >
            {skillTitle}
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
              fontSize: 43,
              lineHeight: 1.08,
              maxWidth: "96%",
            }}
          >
            {description}
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                border: "1px solid #1f3b2a",
                background: "#102118",
                color: "#8fffaf",
                padding: "8px 12px",
                fontSize: 20,
                letterSpacing: "0.05em",
              }}
            >
              {`FILES ${fileCount}`}
            </div>

            <div
              style={{
                border: "1px solid #1f3b2a",
                background: "#102118",
                color: "#8cb498",
                padding: "8px 12px",
                fontSize: 20,
                letterSpacing: "0.05em",
              }}
            >
              {`RESOURCES ${resourceCount}`}
            </div>
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
          <span>{`/${slug}`}</span>
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

export default SkillOpenGraphImage;
