import type { MetadataRoute } from "next";

import { buildAbsoluteSiteUrl, siteUrl } from "@/lib/site/siteMetadata";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: buildAbsoluteSiteUrl("/sitemap.xml"),
    host: siteUrl,
  };
};

export default robots;
