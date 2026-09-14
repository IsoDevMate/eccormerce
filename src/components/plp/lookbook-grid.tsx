"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Gender, Product } from "@/types/product";
import { cn } from "@/lib/cn";

type GenderTab = Gender | "all";

export function LookbookGrid({ products }: { products: Product[] }) {
  const [gender, setGender] = useState<GenderTab>("all");

  const visible = useMemo(() => {
    if (gender === "all") return products;
    return products.filter(
      (product) => product.gender === gender || product.gender === "unisex",
    );
  }, [products, gender]);

  return (
    <div className="min-h-[70vh] px-4 pb-24 pt-8 md:px-8 md:pt-12">
      <div className="mb-10 flex items-center justify-center gap-8 md:mb-14">
        {(
          [
            ["all", "All"],
            ["women", "Women"],
            ["men", "Men"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setGender(value)}
            className={cn(
              "micro text-[10px] tracking-[0.22em]",
              gender === value ? "text-ink" : "text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mx-auto grid max-w-[1400px] grid-cols-3 gap-x-3 gap-y-8 sm:grid-cols-4 md:grid-cols-6 md:gap-x-5 md:gap-y-12">
        {visible.map((product) => (
          <LookbookCell key={product.id} product={product} />
        ))}
      </ul>

      <p className="micro mt-16 text-center text-muted">
        <Link href="/shop" className="underline">
          Shop with details
        </Link>
      </p>
    </div>
  );
}

function LookbookCell({ product }: { product: Product }) {
  const variant = product.variants[0];
  const image =
    variant?.images.find((item) => item.kind === "studio") ??
    variant?.images.find((item) => item.kind === "model") ??
    variant?.images[0];

  return (
    <li>
      <Link
        href={`/product/${product.slug}`}
        className="group block"
        aria-label={`${product.code} — ${product.name}`}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-paper-2">
          {image ? (
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(min-width: 768px) 14vw, 30vw"
              className="object-cover object-center opacity-95 transition-opacity duration-300 ease-out group-hover:opacity-65"
            />
          ) : null}
        </div>
        <p className="micro mt-2.5 text-center text-[10px] tracking-[0.2em] text-ink">
          {product.code}
        </p>
      </Link>
    </li>
  );
}
