import { products } from "@/data/catalog";
import type { Category, Gender, Product } from "@/types/product";

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
