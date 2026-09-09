import { ProductListing } from "@/components/plp/product-listing";
import { getShopProducts } from "@/lib/catalog";

export const metadata = {
  title: "Archive",
};

export default function ShopPage() {
  return (
    <ProductListing
      products={getShopProducts("all")}
      genderLabel="All 26 pieces"
      editorial={{
        kicker: "House note",
        title: "Why we skip a homepage.",
        body: "With fewer than fifty pieces, another landing page is a click you do not need. The split is the map. The grid is the store.",
        href: "/service",
        image:
          "https://images.unsplash.com/photo-1441984904996-e0b6ba207e31?auto=format&fit=crop&w=1400&q=80",
      }}
    />
  );
}
