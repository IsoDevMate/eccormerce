import type { Metadata } from "next";
import { ProductListing } from "@/components/plp/product-listing";
import { getShopProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop the Sable archive. Model shots first, filters above the fold, Women and Men as one-click tabs — no splash screen before the clothes.",
  openGraph: {
    title: "Shop — Sable",
    description:
      "Twenty-six pieces. Enter the grid. Women and Men as instant filters.",
  },
};

export default function HomePage() {
  return (
    <ProductListing
      products={getShopProducts("all")}
      genderLabel="House"
      heading="Shop"
      showGenderTabs
      editorial={{
        kicker: "At 30% scroll",
        title: "The cut, worn.",
        body: "Model shots first. Studio if you want the block without a body. The grid is the store — no homepage in the way.",
        href: "/product/long-slip-dress",
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=70",
      }}
    />
  );
}
