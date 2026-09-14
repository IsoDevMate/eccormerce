import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eccormerce-alpha.vercel.app";
  const staticRoutes = [
    "",
    "/shop",
    "/shop/new",
    "/shop/women",
    "/shop/men",
    "/shop/archive",
    "/size-guide",
    "/shipping",
    "/service",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7,
  }));

  const products = getAllProducts().map((product) => ({
    url: `${base}/product/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...products];
}
