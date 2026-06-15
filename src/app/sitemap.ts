import type { MetadataRoute } from "next";
import { allGear } from "@/data/gear";
import { gearUrl, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gear/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
  const gearPages: MetadataRoute.Sitemap = allGear().map((g) => ({
    url: gearUrl(g.id),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticPages, ...gearPages];
}
