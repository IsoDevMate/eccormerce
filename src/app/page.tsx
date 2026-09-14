import type { Metadata } from "next";
import { LookbookGrid } from "@/components/plp/lookbook-grid";
import { getShopProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Index",
  description:
    "Sable index — product codes only. Quiet grid for scanning the house.",
  openGraph: {
    title: "Index — Sable",
    description: "Twenty-six pieces. Codes first. Shop when you’re ready.",
  },
};

export default function HomePage() {
  return <LookbookGrid products={getShopProducts("all")} />;
}
