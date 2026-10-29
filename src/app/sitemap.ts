import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "monthly",
      priority: 1,
      url: "https://jackalope.digital/",
    },
    {
      changeFrequency: "monthly",
      priority: 0.6,
      url: "https://jackalope.digital/about",
    },
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: "https://jackalope.digital/privacy",
    },
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: "https://jackalope.digital/terms",
    },
  ];
}
