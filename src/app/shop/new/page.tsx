import type { Metadata } from "next";
import { ProductListing } from "@/components/plp/product-listing";
import { getNewArrivals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "New arrivals",
  description: "Just in at Sable — new cuts, restocks, and the next drop tease.",
};

export default function NewArrivalsPage() {
  return (
    <ProductListing
      products={getNewArrivals()}
      genderLabel="Just in"
      heading="New"
      editorial={{
        kicker: "Drop",
        title: "What landed.",
        body: "New is first in the nav because it is first in the house.",
        href: "/",
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=70",
      }}
    />
  );
}
