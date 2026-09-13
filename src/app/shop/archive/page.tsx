import type { Metadata } from "next";
import { ProductListing } from "@/components/plp/product-listing";
import { PRODUCT_LINES, getProductsByLine, getShopProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Archive",
  description: "Full Sable archive by line — Soft Lounge, Studio, Knit, Outer, Accessories.",
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ line?: string }>;
}) {
  const { line } = await searchParams;
  const valid = line && PRODUCT_LINES.includes(line as (typeof PRODUCT_LINES)[number]);
  const products = valid ? getProductsByLine(line) : getShopProducts("all");

  return (
    <ProductListing
      products={products}
      genderLabel={valid ? line : "All pieces"}
      heading={valid ? line : "Archive"}
      showGenderTabs={!valid}
      editorial={{
        kicker: "House note",
        title: "Every line, one grid.",
        body: "Filter by who wears it, then by cut. The clothes stay above the fold.",
        href: "/",
        image:
          "https://images.unsplash.com/photo-1441984904996-e0b6ba207e31?auto=format&fit=crop&w=1200&q=70",
      }}
    />
  );
}
