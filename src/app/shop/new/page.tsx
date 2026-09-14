import type { Metadata } from "next";
import { ProductListing } from "@/components/plp/product-listing";
import { getNewArrivals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "New",
  description: "Newest pieces in the Sable house — sorted by arrival.",
};

export default function NewArrivalsPage() {
  return (
    <ProductListing
      products={getNewArrivals(12)}
      genderLabel="Just in"
      heading="New"
      showGenderTabs
    />
  );
}
