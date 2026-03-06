import { ImageResponse } from "next/og";

import { getSkillBySlug } from "@/lib/skills/skillsData";
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
  openGraphPalette,
  openGraphStatsChipStyle,
  selectFontSizeByCharacterCount,
  truncateText,
} from "@/lib/og/ogShared";
import {
  openGraphImageSize,
  siteCreatorHandle,
  siteUrl,
} from "@/lib/site/siteMetadata";

export const alt = openGraphAlt;
export const size = openGraphImageSize;
export const contentType = openGraphContentType;
export const runtime = "nodejs";

type SkillOgImageProps = {
  params: Promise<{ slug: string }>;
};

const skillTitleFontSizeTiers = [
  { maxCharacters: 12, fontSize: 148 },
  { maxCharacters: 18, fontSize: 132 },
  { maxCharacters: 26, fontSize: 114 },
  { maxCharacters: 34, fontSize: 92 },
] as const;
const fallbackSkillTitleFontSize = 78;
const skillDescriptionMaxLength = 180;

const SkillOpenGraphImage = async ({
  params,
}: SkillOgImageProps): Promise<ImageResponse> => {
  const imageOptions = await createOpenGraphOptions();

  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  const skillTitle = (skill?.name ?? slug).toUpperCase();
  const titleFontSize = selectFontSizeByCharacterCount(
    skillTitle.length,
    [...skillTitleFontSizeTiers],
    fallbackSkillTitleFontSize,
  );
  const description = truncateText(
    skill?.description ?? "Skill page for Shan Skills.",
    skillDescriptionMaxLength,
  );
  const resourceCount = skill?.resourceDocuments.length ?? 0;
  const fileCount = resourceCount + 1;

  return new ImageResponse(
    <div
      style={createOpenGraphCanvasStyle(
        "radial-gradient(circle at 15% 0%, rgba(255, 255, 255, 0.04), transparent 40%), linear-gradient(160deg, #050505 0%, #0a0a0a 100%)",
      )}
    >
      <div style={openGraphFrameStyle}>
        <div style={openGraphHeaderRowStyle}>
          <span>SHAN SKILLS // SKILL CARD</span>
          <span>{siteUrl.replace("https://", "")}</span>
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
              color: openGraphPalette.muted,
              fontSize: 24,
              letterSpacing: "0.08em",
            }}
          >
            {`/skills/${slug}`}
          </div>

          <div
            style={{
              ...createOpenGraphDisplayTitleStyle(titleFontSize),
              maxWidth: "100%",
              whiteSpace: "normal",
            }}
          >
            {skillTitle}
          </div>

          <div style={openGraphDividerStyle} />

          <div
            style={{
              color: openGraphPalette.text,
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
                ...openGraphStatsChipStyle,
                color: openGraphPalette.accent,
              }}
            >
              {`FILES ${fileCount}`}
            </div>

            <div
              style={{
                ...openGraphStatsChipStyle,
                color: openGraphPalette.muted,
              }}
            >
              {`RESOURCES ${resourceCount}`}
            </div>
          </div>
        </div>

        <div style={openGraphFooterRowStyle}>
          <span>{`/${slug}`}</span>
          <span>{siteCreatorHandle}</span>
        </div>
      </div>
    </div>,
    imageOptions,
  );
};

export default SkillOpenGraphImage;
