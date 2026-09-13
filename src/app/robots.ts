import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eccormerce-alpha.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/cart", "/thank-you"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
