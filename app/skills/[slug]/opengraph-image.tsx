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

const truncateText = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
};

const SkillOpenGraphImage = async ({ params }: SkillOgImageProps): Promise<ImageResponse> => {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  const skillTitle = (skill?.name ?? slug).toUpperCase();
  const description = truncateText(
    skill?.description ?? "Skill page for Shan Skills.",
    180,
  );

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
              color: "#8cb498",
              fontFamily: "monospace",
              fontSize: 24,
            }}
          >
            SHAN-SKILLS / SKILL
          </div>

          <div
            style={{
              color: "#8fffaf",
              fontFamily: "monospace",
              fontSize: 62,
              lineHeight: 1,
              letterSpacing: "1px",
              maxWidth: "100%",
            }}
          >
            {truncateText(skillTitle, 28)}
          </div>

          <div
            style={{
              color: "#d5f5dc",
              fontFamily: "monospace",
              fontSize: 30,
              lineHeight: 1.3,
              maxWidth: "95%",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 22,
            color: "#8cb498",
          }}
        >
          <span>{`/skills/${slug}`}</span>
          <span>skills.shan8851.com</span>
        </div>
      </div>
    </div>,
  );
};

export default SkillOpenGraphImage;
