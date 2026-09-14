import { products } from "@/data/catalog";
import type { Category, Gender, Product } from "@/types/product";

export const PRODUCT_LINES = [
  "Soft Lounge",
  "Studio",
  "Knit",
  "Outer",
  "Archive",
] as const;

export type ProductLine = (typeof PRODUCT_LINES)[number];

export function getAllProducts() {
  return products;
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getShopProducts(gender?: Gender | "all") {
  if (!gender || gender === "all") return products;
  return products.filter(
    (product) => product.gender === gender || product.gender === "unisex",
  );
}

export function getRelated(product: Product) {
  return product.related
    .map((id) => getProductById(id))
    .filter((item): item is Product => Boolean(item));
}

export const categories: { id: Category; label: string }[] = [
  { id: "dresses", label: "Dresses" },
  { id: "lounge", label: "Lounge" },
  { id: "tops", label: "Tops" },
  { id: "knit", label: "Knit" },
  { id: "outerwear", label: "Outerwear" },
  { id: "bottoms", label: "Trousers" },
  { id: "accessories", label: "Accessories" },
];

export const popularFilters = [
  { id: "new", label: "New" },
  { id: "best", label: "Best Sellers" },
  { id: "under150", label: "Under $150" },
  { id: "in-stock", label: "In stock" },
] as const;

export type PopularFilter = (typeof popularFilters)[number]["id"];

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((product) =>
    [product.name, product.line, product.code, product.category]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function getNewArrivals(limit = 12) {
  return [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getProductsByLine(line: string) {
  return products.filter((product) => product.line === line);
}

export function getLineCover(line: string) {
  const match = products.find((product) => product.line === line);
  const image =
    match?.variants[0]?.images.find((item) => item.kind === "model") ??
    match?.variants[0]?.images[0];
  return {
    line,
    href: `/shop/archive?line=${encodeURIComponent(line)}`,
    image: image?.src ?? "",
    count: getProductsByLine(line).length,
  };
}

export function getUgcLooks() {
  return products.flatMap((product) =>
    product.variants.flatMap((variant) =>
      variant.images
        .filter((image) => image.kind === "ugc" || image.kind === "model")
        .slice(0, 1)
        .map((image) => ({
          src: image.src,
          alt: image.alt,
          href: `/product/${product.slug}`,
          name: product.name,
        })),
    ),
  );
}
