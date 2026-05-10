import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  return [
    "",
    "/pricing",
    "/features/intake-form",
    "/features/production-queue",
    "/features/holiday-planner",
    "/tools/q4-planner",
    "/blog",
    "/blog/how-to-plan-etsy-q4-production-schedule",
    "/blog/etsy-holiday-prep-checklist-makers",
    "/blog/custom-order-tracker-handmade-sellers",
    "/blog/when-to-order-materials-etsy-q4",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
