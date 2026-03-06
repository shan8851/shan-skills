import type { MetadataRoute } from "next";

import { getAllSkills } from "@/lib/skills/skillsData";
import {
  buildAbsoluteSiteUrl,
  buildSkillPath,
  siteUrl,
} from "@/lib/site/siteMetadata";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const skills = await getAllSkills();

  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const skillEntries: MetadataRoute.Sitemap = skills.map((skill) => {
    return {
      url: buildAbsoluteSiteUrl(buildSkillPath(skill.slug)),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [...baseEntries, ...skillEntries];
};

export default sitemap;
