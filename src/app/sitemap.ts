import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "monthly",
      priority: 1,
      url: "https://jackalope.dev/",
    },
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: "https://jackalope.dev/privacy",
    },
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: "https://jackalope.dev/terms",
    },
  ];
}
