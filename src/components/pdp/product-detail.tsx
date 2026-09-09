"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/lib/cart-store";
import { cmFromInches, contrastOn, formatHeight, formatPrice } from "@/lib/format";
import { brandComparisons, predictSableSize } from "@/data/catalog";
import { getRelated } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export function ProductDetail({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [size, setSize] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [zip, setZip] = useState("");
  const [compareBrand, setCompareBrand] = useState("COS");
  const [compareSize, setCompareSize] = useState("S");
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const images = variant?.images ?? [];
  const activeImage = images[imageIndex] ?? images[0];
  const related = getRelated(product);
  const predicted = useMemo(
    () => predictSableSize(compareBrand, compareSize),
    [compareBrand, compareSize],
  );

  const estimate = useMemo(() => {
    if (!zip) return null;
    const international = zip.trim().length > 5 && /[A-Za-z]/.test(zip);
    if (international) {
      return `International: ${product.shippingDays.min + 10}–${product.shippingDays.max + 14} days. Duties billed at delivery.`;
    }
    return `Arrives in ${product.shippingDays.min}–${product.shippingDays.max} business days to ${zip}.`;
  }, [zip, product.shippingDays]);

  const hex = variant?.hex ?? "#141414";
  const ctaColor = contrastOn(hex);
  const selectedSize = size ?? predicted;

  function add() {
    if (!variant || product.comingSoon) return;
    const chosen = size;
    if (!chosen) {
      setGuideOpen(true);
      return;
    }
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
      size: chosen,
      price: product.price,
    });
    setAdded(true);
  }

  return (
    <div>
      <div className="grid border-b border-line lg:grid-cols-2">
        <div className="border-b border-line lg:border-b-0 lg:border-r">
          <div className="relative aspect-[4/5] bg-paper-2">
            {activeImage ? (
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                className="object-cover"
                sizes="50vw"
              />
            ) : null}
            <p className="micro absolute bottom-4 left-4 bg-paper/90 px-2 py-1">
              Model {formatHeight(product.model.heightCm)} · wears {product.model.size}
            </p>
          </div>
          <div className="grid grid-cols-4 border-t border-line">
            {images.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setImageIndex(index)}
                className={cn(
                  "relative aspect-square border-r border-line last:border-r-0",
                  imageIndex === index && "ring-2 ring-inset ring-ink",
                )}
              >
                <Image src={image.src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col px-5 py-8 md:px-10">
          <p className="micro text-muted">{product.line} · {product.code}</p>
          <h1 className="display mt-3 text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-lg">{formatPrice(product.price)}</p>
          <p className="mt-4 max-w-md text-sm text-muted">{product.description}</p>

          <div className="mt-8">
            <p className="micro mb-3">Color — {variant?.name}</p>
            <div className="flex gap-2">
              {product.variants.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setVariantId(item.id);
                    setImageIndex(0);
                    setAdded(false);
                  }}
                  className={cn(
                    "h-8 w-8 border",
                    item.id === variant?.id ? "border-ink ring-1 ring-ink ring-offset-2" : "border-line",
                  )}
                  style={{ backgroundColor: item.hex }}
                  aria-label={item.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="micro">Size</p>
              <button
                type="button"
                className="micro underline"
                onClick={() => setGuideOpen(true)}
              >
                Size guide · fit predictor
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {(variant?.sizes ?? []).map((item) => (
                <button
                  key={item.size}
                  type="button"
                  disabled={!item.inStock}
                  onClick={() => setSize(item.size)}
                  className={cn(
                    "h-11 border text-sm",
                    !item.inStock && "cursor-not-allowed text-muted line-through",
                    item.inStock && size === item.size && "bg-ink text-paper",
                    item.inStock && size !== item.size && "border-ink bg-paper",
                  )}
                >
                  {item.size}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Solid size buttons — not a dropdown. Predicted from {compareBrand}: {predicted}.
            </p>
          </div>

          {product.comingSoon ? (
            <Link
              href="#notes"
              className="mt-8 block border border-ink py-4 text-center text-sm"
            >
              Notify me at drop
            </Link>
          ) : (
            <button
              type="button"
              onClick={add}
              className="mt-8 py-4 text-sm transition-colors duration-300"
              style={{ backgroundColor: hex, color: ctaColor }}
            >
              {size
                ? `Add ${variant?.name} / ${size} — ${formatPrice(product.price)}`
                : "Select a size"}
            </button>
          )}
          {added ? (
            <p className="mt-2 text-sm">In the bag. Keep looking — that’s the point.</p>
          ) : null}

          <form
            className="mt-6 border-t border-line pt-6"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label className="micro" htmlFor="zip">
              Shipping estimator
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="zip"
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                placeholder="ZIP or city"
                className="flex-1 border border-ink bg-transparent px-3 py-3 text-sm focus-ring"
              />
              <button type="submit" className="border border-ink px-4 text-sm">
                Check
              </button>
            </div>
            {estimate ? (
              <p className="mt-2 text-sm">{estimate}</p>
            ) : (
              <p className="mt-2 text-xs text-muted">
                We show real windows — including 2–3 weeks when a mill is slow.
                Nothing is hidden behind checkout.
              </p>
            )}
          </form>

          <ul className="mt-6 space-y-2 text-sm">
            {product.highlights.map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>

          <details className="mt-8 border-t border-line py-4">
            <summary className="micro cursor-pointer">Materials & care</summary>
            <p className="mt-3 text-sm">{product.materials}</p>
            <p className="mt-2 text-sm text-muted">{product.care}</p>
          </details>
          <details className="border-t border-line py-4">
            <summary className="micro cursor-pointer">Shipping & returns</summary>
            <p className="mt-3 text-sm">
              {product.shippingDays.min}–{product.shippingDays.max} business days
              from the studio. 30-day returns, prepaid label. Complimentary gift
              wrap in the bag.
            </p>
            <Link href="/shipping" className="mt-2 inline-block text-sm underline">
              Full shipping table
            </Link>
          </details>
          <div className="border-t border-line py-4">
            <Link href="/service" className="micro underline">
              Direct line to customer service
            </Link>
          </div>
        </div>
      </div>

      {guideOpen ? (
        <SizeGuide
          product={product}
          unit={unit}
          setUnit={setUnit}
          compareBrand={compareBrand}
          setCompareBrand={setCompareBrand}
          compareSize={compareSize}
          setCompareSize={setCompareSize}
          predicted={predicted}
          selectedSize={selectedSize}
          onPick={(value) => {
            setSize(value);
            setGuideOpen(false);
          }}
          onClose={() => setGuideOpen(false)}
          onCheckout={(value) => {
            setSize(value);
            setGuideOpen(false);
            const v = variant;
            if (!v) return;
            const image = v.images[0];
            addLine({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              line: product.line,
              image: image?.src ?? "",
              color: v.name,
              colorHex: v.hex,
              size: value,
              price: product.price,
            });
          }}
        />
      ) : null}

      <section className="border-b border-line px-4 py-10 md:px-6">
        <p className="micro text-muted">Worn, not styled</p>
        <div className="mt-4 grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {images
            .filter((image) => image.kind === "ugc" || image.kind === "model")
            .concat(images)
            .slice(0, 4)
            .map((image, index) => (
              <div key={`${image.src}-ugc-${index}`} className="relative aspect-[4/5] bg-paper">
                <Image src={image.src} alt="" fill className="object-cover" />
              </div>
            ))}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="px-4 py-10 md:px-6">
          <p className="micro text-muted">Worn with</p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            {related.map((item) => {
              const image = item.variants[0]?.images[0];
              return (
                <Link key={item.id} href={`/product/${item.slug}`} className="group">
                  <div className="relative aspect-[4/5] bg-paper-2">
                    {image ? (
                      <Image src={image.src} alt="" fill className="object-cover" />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm">{item.name}</p>
                  <p className="text-sm text-muted">{formatPrice(item.price)}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <div
        className="sticky bottom-0 z-20 flex items-center justify-between gap-3 border-t border-ink bg-paper px-4 py-3 md:hidden"
        style={{ backgroundColor: hex, color: ctaColor }}
      >
        <span className="text-sm">{formatPrice(product.price)}</span>
        <button type="button" onClick={add} className="text-sm underline">
          {size ? "Add to bag" : "Select size"}
        </button>
      </div>
    </div>
  );
}

function SizeGuide({
  product,
  unit,
  setUnit,
  compareBrand,
  setCompareBrand,
  compareSize,
  setCompareSize,
  predicted,
  selectedSize,
  onPick,
  onClose,
  onCheckout,
}: {
  product: Product;
  unit: "in" | "cm";
  setUnit: (unit: "in" | "cm") => void;
  compareBrand: string;
  setCompareBrand: (brand: string) => void;
  compareSize: string;
  setCompareSize: (size: string) => void;
  predicted: string;
  selectedSize: string;
  onPick: (size: string) => void;
  onClose: () => void;
  onCheckout: (size: string) => void;
}) {
  const rows = Object.entries(product.measurements);
  const brand = brandComparisons.find((item) => item.brand === compareBrand);
  const brandSizes = brand ? Object.keys(brand.map) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/40 p-4">
      <div className="mx-auto max-w-3xl border border-ink bg-paper p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="micro text-muted">Fit, not a popup afterthought</p>
            <h2 className="display mt-2 text-4xl">Size guide</h2>
          </div>
          <button type="button" className="micro" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="mt-3 text-sm text-muted">
          {product.model.name} is {formatHeight(product.model.heightCm)} and wears{" "}
          {product.model.size}. Chest is measured 1&quot; below the armhole; length from
          HPS.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            I usually wear
            <select
              className="mt-2 w-full border border-ink bg-transparent px-3 py-3"
              value={compareBrand}
              onChange={(event) => setCompareBrand(event.target.value)}
            >
              {brandComparisons.map((item) => (
                <option key={item.brand}>{item.brand}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Their size
            <select
              className="mt-2 w-full border border-ink bg-transparent px-3 py-3"
              value={compareSize}
              onChange={(event) => setCompareSize(event.target.value)}
            >
              {brandSizes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm">
          Predicted Sable size: <strong>{predicted}</strong> · {product.fit} fit.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={cn("micro border px-3 py-1.5", unit === "in" && "bg-ink text-paper")}
            onClick={() => setUnit("in")}
          >
            Inches
          </button>
          <button
            type="button"
            className={cn("micro border px-3 py-1.5", unit === "cm" && "bg-ink text-paper")}
            onClick={() => setUnit("cm")}
          >
            Centimetres
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink">
                <th className="py-2">Size</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Hip</th>
                <th>Length</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, row]) => (
                <tr
                  key={label}
                  className={cn(
                    "border-b border-line",
                    label === predicted && "bg-paper-2",
                  )}
                >
                  <td className="py-2 font-medium">{label}</td>
                  <td>{unit === "in" ? row.chest ?? "—" : row.chest ? cmFromInches(row.chest) : "—"}</td>
                  <td>
                    {row.waist
                      ? unit === "in"
                        ? row.waist
                        : cmFromInches(row.waist)
                      : "—"}
                  </td>
                  <td>
                    {row.hip
                      ? unit === "in"
                        ? row.hip
                        : cmFromInches(row.hip)
                      : "—"}
                  </td>
                  <td>{unit === "in" ? row.length : cmFromInches(row.length)}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => onPick(label)}
                    >
                      Use {label}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="mt-6 w-full bg-ink py-4 text-sm text-paper"
          onClick={() => onCheckout(selectedSize)}
        >
          Add {selectedSize} from the guide
        </button>
      </div>
    </div>
  );
}
