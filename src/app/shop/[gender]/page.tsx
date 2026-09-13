import type { Metadata } from "next";
import { ProductListing } from "@/components/plp/product-listing";
import { getShopProducts } from "@/lib/catalog";
import type { Gender } from "@/types/product";
import { notFound } from "next/navigation";

const copy = {
  women: {
    label: "Women",
    description:
      "Shop women’s Sable — lounge, knit, outer. Model shots first, quick size on the card.",
    editorial: {
      kicker: "At 30% scroll",
      title: "The slip, worn.",
      body: "Model shots first. Studio if you want the cut without a body.",
      href: "/product/long-slip-dress",
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=70",
    },
  },
  men: {
    label: "Men",
    description:
      "Shop men’s Sable — crews, trousers, outer. Model shots first, quick size on the card.",
    editorial: {
      kicker: "At 30% scroll",
      title: "Heavyweight, not loud.",
      body: "The crew is the house. Toggle worn / studio for the same block in a new setting.",
      href: "/product/archive-crew",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=70",
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
}): Promise<Metadata> {
  const { gender } = await params;
  if (gender !== "women" && gender !== "men") return {};
  return {
    title: copy[gender].label,
    description: copy[gender].description,
  };
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
      heading={copy[key].label}
      initialGender={key}
      editorial={copy[key].editorial}
    />
  );
}
