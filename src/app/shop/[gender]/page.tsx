import { notFound } from "next/navigation";
import { ProductListing } from "@/components/plp/product-listing";
import { getShopProducts } from "@/lib/catalog";
import type { Gender } from "@/types/product";

const copy = {
  women: {
    label: "Women",
    editorial: {
      kicker: "At 30% scroll",
      title: "The slip, worn.",
      body: "Model shots first. Studio if you want the cut without a body. Either way, the card is here to keep you in the grid.",
      href: "/product/long-slip-dress",
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1400&q=80",
    },
  },
  men: {
    label: "Men",
    editorial: {
      kicker: "At 30% scroll",
      title: "Heavyweight, not loud.",
      body: "The crew is the house. Everything else is a relative. Toggle worn / studio to see the same block in a new setting.",
      href: "/product/archive-crew",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1400&q=80",
    },
  },
} as const;

export function generateStaticParams() {
  return [{ gender: "women" }, { gender: "men" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gender: string }>;
}) {
  const { gender } = await params;
  if (gender !== "women" && gender !== "men") return {};
  return { title: copy[gender].label };
}

export default async function GenderShopPage({
  params,
}: {
  params: Promise<{ gender: string }>;
}) {
  const { gender } = await params;
  if (gender !== "women" && gender !== "men") notFound();
  const key = gender as Exclude<Gender, "unisex">;
  return (
    <ProductListing
      products={getShopProducts(key)}
      genderLabel={copy[key].label}
      editorial={copy[key].editorial}
    />
  );
}
