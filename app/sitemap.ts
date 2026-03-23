import type { MetadataRoute } from "next";
import { getSiteMetadata } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const { baseUrl } = getSiteMetadata();

  return ["", "/portfolio", "/services", "/about", "/book", "/login"].map(
    (path) => ({
      url: new URL(path || "/", baseUrl).toString(),
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
    }),
  );
}
