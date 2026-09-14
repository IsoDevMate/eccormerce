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
    <div className="min-h-[70vh] px-3 pb-20 pt-6 md:px-10 md:pt-10">
      <div className="mb-8 flex items-center justify-center gap-10 md:mb-12">
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
              "micro text-[10px] tracking-[0.24em] motion-fade",
              gender === value ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mx-auto grid max-w-[1280px] grid-cols-3 gap-x-4 gap-y-10 sm:grid-cols-4 md:grid-cols-6 md:gap-x-8 md:gap-y-14">
        {visible.map((product, index) => (
          <LookbookCell key={product.id} product={product} index={index} />
        ))}
      </ul>

      <p className="micro mt-16 text-center text-muted">
        <Link href="/shop" className="underline hover:text-ink">
          Shop with details
        </Link>
      </p>
    </div>
  );
}

function LookbookCell({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const variant = product.variants[0];
  const image =
    variant?.images.find((item) => item.kind === "studio") ??
    variant?.images.find((item) => item.kind === "model") ??
    variant?.images[0];

  return (
    <li
      className="motion-fade"
      style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="group block"
        aria-label={`${product.code} — ${product.name}`}
      >
        <div className="relative mx-auto aspect-[4/5] w-[92%] overflow-hidden bg-paper-2">
          {image ? (
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(min-width: 768px) 14vw, 30vw"
              className="object-cover object-[center_18%] transition-[opacity,transform] duration-300 ease-out group-hover:scale-[1.03] group-hover:opacity-80"
            />
          ) : null}
        </div>
        <p className="micro mt-3 text-center text-[10px] tracking-[0.2em] text-ink transition-opacity duration-300 group-hover:opacity-60">
          {product.code}
        </p>
      </Link>
    </li>
  );
}
