import type { NextConfig } from "next";

// Retired: skills now live at https://www.shan8851.com/skills.
// Every page permanently redirects to its equivalent on the main site.
const main = "https://www.shan8851.com";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: `${main}/skills`, permanent: true },
      { source: "/skills/:slug", destination: `${main}/skills/:slug`, permanent: true },
      { source: "/:path*", destination: `${main}/skills`, permanent: true },
    ];
  },
};

export default nextConfig;
