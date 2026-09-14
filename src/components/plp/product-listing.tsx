"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Category, Gender, Product } from "@/types/product";
import { categories } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { QuickView } from "@/components/plp/quick-view";

type Setting = "worn" | "studio";
type Density = 1 | 2 | 4;
type SortKey = "featured" | "newest" | "price-asc" | "price-desc";
type GenderTab = Gender | "all";
type FilterChip = "sort" | "category" | "color" | "size" | null;

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
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [openChip, setOpenChip] = useState<FilterChip>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!filterRef.current?.contains(event.target as Node)) {
        setOpenChip(null);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  const colors = useMemo(() => {
    const map = new Map<string, string>();
    for (const product of products) {
      for (const variant of product.variants) {
        map.set(variant.name, variant.hex);
      }
    }
    return [...map.entries()];
  }, [products]);

  const sizes = useMemo(() => {
    const set = new Set<string>();
    for (const product of products) {
      for (const variant of product.variants) {
        for (const row of variant.sizes) set.add(row.size);
      }
    }
    return [...set];
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
    if (size) {
      list = list.filter((product) =>
        product.variants.some((variant) =>
          variant.sizes.some((row) => row.size === size && row.inStock),
        ),
      );
    }
    if (sort === "newest") {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, gender, category, color, size, sort]);

  const rail = categories.filter((item) =>
    products.some((product) => product.category === item.id),
  );

  const insertAt = visible.length > 16 ? 8 : 4;

  function toggleChip(chip: FilterChip) {
    setOpenChip((current) => (current === chip ? null : chip));
  }

  return (
    <div>
      <section className="px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="micro text-muted">{genderLabel}</p>
            <h1 className="mt-1 font-sans text-xl font-medium tracking-tight md:text-2xl">
              {heading}
            </h1>
          </div>
          <p className="text-xs text-muted">{visible.length}</p>
        </div>
        {showGenderTabs ? (
          <div
            className="mt-4 flex gap-5"
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
                  "micro motion-fade",
                  gender === value ? "text-ink underline" : "text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <div
        ref={filterRef}
        className="sticky top-[52px] z-20 border-y border-line bg-paper/95 backdrop-blur-sm"
      >
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-3 md:px-6">
          <FilterChipButton
            label="Sort"
            active={sort !== "featured" || openChip === "sort"}
            open={openChip === "sort"}
            onClick={() => toggleChip("sort")}
          />
          <FilterChipButton
            label="Category"
            active={category !== "all" || openChip === "category"}
            open={openChip === "category"}
            onClick={() => toggleChip("category")}
          />
          <FilterChipButton
            label="Color"
            active={Boolean(color) || openChip === "color"}
            open={openChip === "color"}
            onClick={() => toggleChip("color")}
          />
          <FilterChipButton
            label="Size"
            active={Boolean(size) || openChip === "size"}
            open={openChip === "size"}
            onClick={() => toggleChip("size")}
          />
          <span className="mx-2 hidden h-3 w-px bg-line md:block" aria-hidden />
          <div className="ml-auto flex shrink-0 items-center gap-4">
            <div className="flex gap-3" role="group" aria-label="Setting">
              {(["worn", "studio"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSetting(value)}
                  className={cn(
                    "micro",
                    setting === value ? "underline" : "text-muted",
                  )}
                >
                  {value === "worn" ? "Worn" : "Studio"}
                </button>
              ))}
            </div>
            <div className="hidden gap-2 md:flex" role="group" aria-label="Grid">
              {([2, 4] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDensity(value)}
                  className={cn(
                    "micro",
                    density === value ? "underline" : "text-muted",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {openChip ? (
          <div className="motion-rise border-t border-line px-4 py-4 md:px-6">
            {openChip === "sort" ? (
              <div className="flex flex-wrap gap-4">
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
                    onClick={() => {
                      setSort(key);
                      setOpenChip(null);
                    }}
                    className={cn(
                      "micro",
                      sort === key ? "underline" : "text-muted",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
            {openChip === "category" ? (
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setOpenChip(null);
                  }}
                  className={cn(
                    "micro",
                    category === "all" ? "underline" : "text-muted",
                  )}
                >
                  All
                </button>
                {rail.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCategory(item.id);
                      setOpenChip(null);
                    }}
                    className={cn(
                      "micro",
                      category === item.id ? "underline" : "text-muted",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
            {openChip === "color" ? (
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setColor(null);
                    setOpenChip(null);
                  }}
                  className={cn("micro", !color && "underline")}
                >
                  All
                </button>
                {colors.map(([name, hex]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setColor(name === color ? null : name);
                      setOpenChip(null);
                    }}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      color === name ? "underline" : "text-muted",
                    )}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-ink/30"
                      style={{ backgroundColor: hex }}
                    />
                    {name}
                  </button>
                ))}
              </div>
            ) : null}
            {openChip === "size" ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSize(null);
                    setOpenChip(null);
                  }}
                  className={cn(
                    "micro border px-3 py-2",
                    !size ? "border-ink bg-ink text-paper" : "border-line",
                  )}
                >
                  All
                </button>
                {sizes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSize(value === size ? null : value);
                      setOpenChip(null);
                    }}
                    className={cn(
                      "min-w-10 border px-3 py-2 text-sm",
                      size === value
                        ? "border-ink bg-ink text-paper"
                        : "border-line",
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "grid gap-x-2 gap-y-8 px-2 pb-16 pt-4 md:gap-x-3 md:px-3",
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
                className="col-span-2 md:col-span-2"
              >
                <Link href={editorial.href} className="grid gap-4 md:grid-cols-2 md:gap-0">
                  <div className="media-frame relative">
                    <Image
                      src={editorial.image}
                      alt={editorial.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-[center_20%]"
                    />
                  </div>
                  <div className="flex flex-col justify-end px-2 py-2 md:px-6 md:py-4">
                    <p className="micro text-muted">{editorial.kicker}</p>
                    <h2 className="mt-2 font-sans text-xl font-medium tracking-tight md:text-2xl">
                      {editorial.title}
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-muted">
                      {editorial.body}
                    </p>
                    <span className="micro mt-4 underline">Shop</span>
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

function FilterChipButton({
  label,
  active,
  open,
  onClick,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={cn(
        "micro shrink-0 px-1 py-1",
        active ? "text-ink underline" : "text-muted",
      )}
    >
      {label}
      <span className="ml-1 inline-block text-[9px]" aria-hidden>
        {open ? "−" : "+"}
      </span>
    </button>
  );
}

function pickPrimaryImage(
  product: Product,
  variantId: string | undefined,
  setting: Setting,
) {
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];
  if (!variant) return { variant: undefined, primary: undefined, secondary: undefined };
  const preferredKind = setting === "worn" ? "model" : "studio";
  const primary =
    variant.images.find((image) => image.kind === preferredKind) ??
    variant.images[0];
  const secondary =
    variant.images.find((image) => image.src !== primary?.src) ??
    variant.images[1];
  return { variant, primary, secondary };
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
  const { has, toggle } = useWishlist();
  const [previewVariantId, setPreviewVariantId] = useState(
    product.variants[0]?.id,
  );
  const [hovered, setHovered] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [swatchPreview, setSwatchPreview] = useState(false);
  const saved = has(product.id);

  const { variant, primary, secondary } = pickPrimaryImage(
    product,
    previewVariantId,
    setting,
  );
  const sizes = variant?.sizes ?? [];
  const showSecondary =
    hovered && Boolean(secondary) && !quickOpen && !swatchPreview;

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
    setQuickOpen(false);
  }

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setQuickOpen(false);
        setSwatchPreview(false);
        setPreviewVariantId(product.variants[0]?.id);
      }}
    >
      <div className="media-frame relative">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-0 block"
          aria-label={product.name}
        >
          {featured && product.video ? (
            <video
              className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
              autoPlay
              muted
              loop
              playsInline
              poster={primary?.src}
              aria-label={`${product.name} look`}
            >
              <source src={product.video} type="video/mp4" />
            </video>
          ) : (
            <>
              {primary ? (
                <Image
                  src={primary.src}
                  alt={primary.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className={cn(
                    "object-cover object-[center_20%] motion-fade",
                    setting === "studio" && "object-contain p-6",
                    showSecondary ? "opacity-0" : "opacity-100",
                  )}
                />
              ) : null}
              {secondary ? (
                <Image
                  src={secondary.src}
                  alt={secondary.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className={cn(
                    "object-cover object-[center_20%] motion-fade",
                    setting === "studio" && "object-contain p-6",
                    showSecondary ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden={!showSecondary}
                />
              ) : null}
            </>
          )}
        </Link>

        {!product.comingSoon ? (
          <div
            className={cn(
              "absolute right-3 top-3 z-10 flex flex-col gap-1 motion-fade md:opacity-0 md:group-hover:opacity-100",
              saved && "opacity-100",
            )}
          >
            <button
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(event) => {
                event.preventDefault();
                toggle(product.id);
              }}
              className="flex h-8 w-8 items-center justify-center text-ink"
            >
              <HeartIcon filled={saved} />
            </button>
            <button
              type="button"
              aria-label={`Quick view ${product.name}`}
              onClick={(event) => {
                event.preventDefault();
                setViewOpen(true);
              }}
              className="flex h-8 w-8 items-center justify-center text-ink"
            >
              <EyeIcon />
            </button>
          </div>
        ) : null}

        {!product.comingSoon ? (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 motion-rise",
              "translate-y-0 opacity-100 md:translate-y-full md:opacity-0",
              "md:group-hover:translate-y-0 md:group-hover:opacity-100",
              quickOpen && "md:translate-y-0 md:opacity-100",
            )}
          >
            {quickOpen ? (
              <div className="flex flex-wrap justify-center gap-1 bg-ink/95 p-2">
                {sizes.map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    disabled={!item.inStock}
                    onClick={() => addSize(item.size)}
                    className={cn(
                      "min-w-9 px-2 py-2 text-xs text-paper",
                      item.inStock
                        ? "hover:bg-paper hover:text-ink"
                        : "cursor-not-allowed text-paper/40 line-through size-hatched",
                    )}
                  >
                    {item.size}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                className="micro w-full bg-ink py-3 text-center text-paper"
                onClick={(event) => {
                  event.preventDefault();
                  setQuickOpen(true);
                }}
              >
                Quick add
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-2.5 space-y-0.5 px-0.5">
        {product.comingSoon ? (
          <p className="micro text-[9px] text-muted">Soon</p>
        ) : product.badge ? (
          <p className="micro text-[9px] text-muted">{product.badge}</p>
        ) : null}
        <div className="flex items-baseline justify-between gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="block text-[13px] leading-snug tracking-tight"
          >
            {product.name}
          </Link>
          <p className="shrink-0 text-[13px] tabular-nums">
            {formatPrice(product.price)}
          </p>
        </div>
        <div className="flex gap-1.5 pt-1.5">
          {product.variants.map((item) => (
            <button
              key={item.id}
              type="button"
              title={item.name}
              aria-label={`Preview ${item.name}`}
              onMouseEnter={() => {
                setSwatchPreview(true);
                setPreviewVariantId(item.id);
              }}
              onFocus={() => {
                setSwatchPreview(true);
                setPreviewVariantId(item.id);
              }}
              onMouseLeave={() => setSwatchPreview(false)}
              onClick={(event) => {
                event.preventDefault();
                setSwatchPreview(true);
                setPreviewVariantId(item.id);
              }}
              className={cn(
                "h-2.5 w-2.5 rounded-full border motion-fade",
                item.id === previewVariantId
                  ? "border-ink ring-1 ring-ink ring-offset-1 ring-offset-paper"
                  : "border-ink/25",
              )}
              style={{ backgroundColor: item.hex }}
            />
          ))}
        </div>
      </div>
      {viewOpen ? (
        <QuickView product={product} onClose={() => setViewOpen(false)} />
      ) : null}
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
