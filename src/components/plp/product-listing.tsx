"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Category, Gender, Product } from "@/types/product";
import { categories, popularFilters, type PopularFilter } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-store";

type Setting = "worn" | "studio";
type Density = 1 | 2 | 4;
type SortKey = "featured" | "newest" | "price-asc" | "price-desc";
type GenderTab = Gender | "all";

type Props = {
  products: Product[];
  genderLabel: string;
  heading?: string;
  showGenderTabs?: boolean;
  initialGender?: GenderTab;
  editorial: {
    kicker: string;
    title: string;
    body: string;
    href: string;
    image: string;
  };
};

export function ProductListing({
  products,
  genderLabel,
  heading = "Shop",
  showGenderTabs = false,
  initialGender = "all",
  editorial,
}: Props) {
  const [setting, setSetting] = useState<Setting>("worn");
  const [density, setDensity] = useState<Density>(4);
  const [sort, setSort] = useState<SortKey>("featured");
  const [category, setCategory] = useState<Category | "all">("all");
  const [gender, setGender] = useState<GenderTab>(initialGender);
  const [popular, setPopular] = useState<PopularFilter | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const colors = useMemo(() => {
    const map = new Map<string, string>();
    for (const product of products) {
      for (const variant of product.variants) {
        map.set(variant.name, variant.hex);
      }
    }
    return [...map.entries()];
  }, [products]);

  const visible = useMemo(() => {
    let list = [...products];
    if (gender !== "all") {
      list = list.filter(
        (product) => product.gender === gender || product.gender === "unisex",
      );
    }
    if (category !== "all") {
      list = list.filter((product) => product.category === category);
    }
    if (color) {
      list = list.filter((product) =>
        product.variants.some((variant) => variant.name === color),
      );
    }
    if (popular === "new") {
      list = list.filter((product) => product.badge === "New");
    }
    if (popular === "best") {
      list = list.filter((product) => product.badge === "Best Seller");
    }
    if (popular === "under150") {
      list = list.filter((product) => product.price < 15000);
    }
    if (popular === "in-stock") {
      list = list.filter((product) =>
        product.variants.some((variant) =>
          variant.sizes.some((size) => size.inStock),
        ),
      );
    }
    if (sort === "newest") {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, gender, category, color, popular, sort]);

  const rail = categories.filter((item) =>
    products.some((product) => product.category === item.id),
  );

  const insertAt = visible.length > 16 ? 8 : 4;

  return (
    <div>
      <section className="border-b border-line px-4 py-5 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="micro text-muted">{genderLabel}</p>
            <h1 className="display mt-2 text-4xl md:text-6xl">{heading}</h1>
          </div>
          <p className="max-w-xs text-sm text-muted">
            {visible.length} pieces in view.
          </p>
        </div>
        {showGenderTabs ? (
          <div
            className="mt-5 flex gap-2"
            role="tablist"
            aria-label="Shop by who wears it"
          >
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
                role="tab"
                aria-selected={gender === value}
                onClick={() => setGender(value)}
                className={cn(
                  "micro border px-4 py-2",
                  gender === value
                    ? "border-ink bg-ink text-paper"
                    : "border-line",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <div className="border-b border-line">
        <div className="flex gap-3 overflow-x-auto px-4 py-4 md:px-6">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "micro shrink-0 border px-3 py-2",
              category === "all" ? "border-ink bg-ink text-paper" : "border-line",
            )}
          >
            All
          </button>
          {rail.map((item) => {
            const thumb = products.find((p) => p.category === item.id)
              ?.variants[0]?.images[0];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 border px-2 py-1.5",
                  category === item.id
                    ? "border-ink bg-ink text-paper"
                    : "border-line",
                )}
              >
                {thumb ? (
                  <Image
                    src={thumb.src}
                    alt={item.label}
                    width={36}
                    height={44}
                    className="h-11 w-9 object-cover"
                  />
                ) : null}
                <span className="micro pr-2">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky top-[52px] z-20 flex flex-wrap items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur-sm md:px-6">
        <div className="flex flex-wrap gap-2">
          {popularFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() =>
                setPopular((current) =>
                  current === filter.id ? null : filter.id,
                )
              }
              className={cn(
                "micro border px-3 py-1.5",
                popular === filter.id
                  ? "border-ink bg-ink text-paper"
                  : "border-line",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1" aria-label="Sort">
            {(
              [
                ["featured", "Featured"],
                ["newest", "New"],
                ["price-asc", "Price ↑"],
                ["price-desc", "Price ↓"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={cn(
                  "micro px-1 py-1",
                  sort === key ? "underline" : "text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex border border-line" role="group" aria-label="Setting">
            {(["worn", "studio"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSetting(value)}
                className={cn(
                  "micro px-3 py-1.5",
                  setting === value ? "bg-ink text-paper" : "",
                )}
              >
                {value === "worn" ? "Worn" : "Studio"}
              </button>
            ))}
          </div>
          <div className="flex border border-line" role="group" aria-label="Grid density">
            {([2, 4] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDensity(value)}
                className={cn(
                  "micro hidden px-3 py-1.5 md:inline",
                  density === value ? "bg-ink text-paper" : "",
                )}
              >
                {value}
              </button>
            ))}
            {([1, 2] as const).map((value) => (
              <button
                key={`m-${value}`}
                type="button"
                onClick={() => setDensity(value === 1 ? 1 : 2)}
                className={cn(
                  "micro px-3 py-1.5 md:hidden",
                  (value === 1 && density === 1) || (value === 2 && density !== 1)
                    ? "bg-ink text-paper"
                    : "",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-line px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => setColor(null)}
          className={cn("micro px-2 py-1", !color && "underline")}
        >
          All colors
        </button>
        {colors.map(([name, hex]) => (
          <button
            key={name}
            type="button"
            onClick={() => setColor(name === color ? null : name)}
            className={cn(
              "flex items-center gap-2 px-2 py-1 text-sm",
              color === name && "underline",
            )}
          >
            <span
              className="h-3 w-3 border border-ink"
              style={{ backgroundColor: hex }}
            />
            {name}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "grid",
          density === 1 && "grid-cols-1",
          density === 2 && "grid-cols-2",
          density === 4 && "grid-cols-2 md:grid-cols-4",
        )}
      >
        {visible.flatMap((product, index) => {
          const nodes = [
            <ProductCard
              key={product.id}
              product={product}
              setting={setting}
              featured={index === 0}
            />,
          ];
          if (index === insertAt - 1) {
            nodes.push(
              <article
                key="editorial"
                className="col-span-2 border-b border-r border-line md:col-span-2"
              >
                <Link href={editorial.href} className="grid md:grid-cols-2">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={editorial.image}
                      alt={editorial.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-end p-6">
                    <p className="micro text-muted">{editorial.kicker}</p>
                    <h2 className="display mt-3 text-4xl md:text-5xl">
                      {editorial.title}
                    </h2>
                    <p className="mt-4 max-w-sm text-sm text-muted">
                      {editorial.body}
                    </p>
                    <span className="micro mt-6 underline">Read the cut</span>
                  </div>
                </Link>
              </article>,
            );
          }
          return nodes;
        })}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  setting,
  featured,
}: {
  product: Product;
  setting: Setting;
  featured: boolean;
}) {
  const { addLine } = useCart();
  const [open, setOpen] = useState(false);
  const variant = product.variants[0];
  const preferred =
    variant?.images.find((image) =>
      setting === "worn" ? image.kind === "model" : image.kind === "studio",
    ) ?? variant?.images[0];
  const sizes = variant?.sizes ?? [];

  function addSize(size: string) {
    if (!variant || product.comingSoon) return;
    const image =
      variant.images.find((item) => item.kind === "model") ?? variant.images[0];
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      line: product.line,
      image: image?.src ?? "",
      color: variant.name,
      colorHex: variant.hex,
      size,
      price: product.price,
    });
    setOpen(false);
  }

  return (
    <article className="group relative border-b border-r border-line">
      <Link href={`/product/${product.slug}`} className="block">
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden",
            setting === "studio" ? "bg-[#efe8dc]" : "bg-paper-2",
          )}
        >
          {featured && product.video ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={preferred?.src}
              aria-label={`${product.name} look`}
            >
              <source src={product.video} type="video/mp4" />
            </video>
          ) : preferred ? (
            <Image
              src={preferred.src}
              alt={preferred.alt}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className={cn(
                "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                setting === "studio" && "object-contain p-6",
              )}
            />
          ) : null}
          {product.comingSoon ? (
            <span className="micro absolute left-3 top-3 bg-paper px-2 py-1">
              Tease
            </span>
          ) : product.badge ? (
            <span className="micro absolute left-3 top-3 bg-paper px-2 py-1">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="flex items-start justify-between gap-3 px-3 py-3">
          <div>
            <p className="micro text-muted">{product.code}</p>
            <p className="mt-1 text-sm">{product.name}</p>
          </div>
          <p className="text-sm">{formatPrice(product.price)}</p>
        </div>
        <div className="flex gap-1 px-3 pb-3">
          {product.variants.map((item) => (
            <span
              key={item.id}
              className="h-2.5 w-2.5 border border-ink"
              style={{ backgroundColor: item.hex }}
              title={item.name}
            />
          ))}
        </div>
      </Link>

      {!product.comingSoon ? (
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center border border-ink bg-paper text-sm md:opacity-0 md:group-hover:opacity-100"
            aria-label={`Quick size ${product.name}`}
            onClick={(event) => {
              event.preventDefault();
              setOpen((current) => !current);
            }}
          >
            +
          </button>
          {open ? (
            <div className="absolute right-0 top-9 z-20 w-40 border border-ink bg-paper p-2 shadow-[4px_4px_0_0_#141414]">
              <p className="micro mb-2 text-muted">Quick size</p>
              <div className="grid grid-cols-3 gap-1">
                {sizes.map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    disabled={!item.inStock}
                    onClick={() => addSize(item.size)}
                    className={cn(
                      "h-8 border text-xs",
                      item.inStock
                        ? "border-ink hover:bg-ink hover:text-paper"
                        : "cursor-not-allowed border-line text-muted line-through",
                    )}
                  >
                    {item.size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-x-3 bottom-24 hidden justify-center gap-1 md:group-hover:flex">
              {sizes
                .filter((item) => item.inStock)
                .slice(0, 5)
                .map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    className="pointer-events-auto h-8 min-w-8 border border-ink bg-paper px-2 text-xs hover:bg-ink hover:text-paper"
                    onClick={(event) => {
                      event.preventDefault();
                      addSize(item.size);
                    }}
                  >
                    {item.size}
                  </button>
                ))}
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}
