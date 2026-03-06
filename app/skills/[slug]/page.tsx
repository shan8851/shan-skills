import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SkillPageClient } from "@/components/skill/skillPageClient";
import { getAllSkills, getSkillBySlug } from "@/lib/skills/skillsData";

type SkillPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async (): Promise<Array<{ slug: string }>> => {
  const skills = await getAllSkills();
  return skills.map((skill) => ({ slug: skill.slug }));
};

export const generateMetadata = async ({ params }: SkillPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (skill === null) {
    return {
      title: "Skill not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${skill.name} skill`;
  const urlPath = `/skills/${skill.slug}`;
  const imagePath = `${urlPath}/opengraph-image`;

  return {
    title,
    description: skill.description,
    alternates: {
      canonical: urlPath,
    },
    openGraph: {
      type: "article",
      url: urlPath,
      title,
      description: skill.description,
      images: [{ url: imagePath, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: skill.description,
      images: [imagePath],
    },
    keywords: ["skill", "coding agent", "ai agent", skill.slug, skill.name],
  };
};

const SkillPage = async ({ params }: SkillPageProps) => {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (skill === null) {
    notFound();
  }

  return <SkillPageClient skill={skill} />;
};

export default SkillPage;
