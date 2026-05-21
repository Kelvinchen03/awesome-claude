import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/design-system/",
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: "/design-system/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: new URL(siteConfig.url).host,
  };
}
