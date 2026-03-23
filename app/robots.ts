import type { MetadataRoute } from "next";
import { getSiteMetadata } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const { baseUrl } = getSiteMetadata();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
    host: baseUrl.toString(),
  };
}
