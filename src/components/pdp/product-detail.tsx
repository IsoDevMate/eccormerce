"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/lib/cart-store";
import { cmFromInches, contrastOn, formatHeight, formatPrice } from "@/lib/format";
import { brandComparisons, predictSableSize } from "@/data/catalog";
import { getRelated } from "@/lib/catalog";
import { productFaq } from "@/lib/product-modules";
import { cn } from "@/lib/cn";
import { WaitlistModal } from "@/components/site/waitlist-modal";

export function ProductDetail({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [size, setSize] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [compareBrand, setCompareBrand] = useState("COS");
  const [compareSize, setCompareSize] = useState("S");
  const [added, setAdded] = useState(false);
  const [showModelSizing, setShowModelSizing] = useState(true);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const images = variant?.images ?? [];
  const activeImage = images[imageIndex] ?? images[0];
  const related = getRelated(product);
  const predicted = useMemo(
    () => predictSableSize(compareBrand, compareSize),
    [compareBrand, compareSize],
  );

  const hex = variant?.hex ?? "#141414";
  const ctaColor = contrastOn(hex);
  const selectedSize = size ?? predicted;

  function add() {
    if (!variant || product.comingSoon) return;
    if (!size) return;
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
    setAdded(true);
  }

  function stepImage(delta: number) {
    if (images.length === 0) return;
    setImageIndex((current) => (current + delta + images.length) % images.length);
  }

  return (
    <div>
      <div className="grid lg:grid-cols-2">
        <div className="lg:border-r lg:border-line">
          <div className="media-frame relative">
            {activeImage ? (
              <Image
                key={activeImage.src}
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                className="object-cover object-[center_20%] motion-fade"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : null}

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => stepImage(-1)}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 px-2 py-3 text-sm text-ink/70 hover:text-ink"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => stepImage(1)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 px-2 py-3 text-sm text-ink/70 hover:text-ink"
                >
                  →
                </button>
              </>
            ) : null}

            {showModelSizing ? (
              <p className="micro absolute bottom-4 left-4 bg-paper/90 px-2 py-1">
                Model {formatHeight(product.model.heightCm)} · wears {product.model.size}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={cn(
                    "relative h-16 w-12 shrink-0 overflow-hidden bg-paper-2",
                    imageIndex === index ? "opacity-100" : "opacity-50",
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    fill
                    sizes="48px"
                    className="object-cover object-[center_20%]"
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              className={cn(
                "micro shrink-0",
                showModelSizing ? "underline" : "text-muted",
              )}
              onClick={() => setShowModelSizing((current) => !current)}
            >
              Model sizing
            </button>
          </div>
        </div>

        <div className="flex flex-col px-5 py-8 md:px-10 lg:py-12">
          <p className="micro text-muted">{product.line}</p>
          <h1 className="mt-2 font-sans text-2xl font-medium tracking-tight md:text-3xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm">{formatPrice(product.price)}</p>

          <div className="mt-8">
            <p className="text-sm">
              Color — <span className="font-medium">{variant?.name}</span>
            </p>
            <div className="mt-3 flex gap-2">
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
                    "h-8 w-8 rounded-full border motion-fade",
                    item.id === variant?.id
                      ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper"
                      : "border-ink/20",
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
                Size guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {(variant?.sizes ?? []).map((item) => (
                <button
                  key={item.size}
                  type="button"
                  disabled={!item.inStock}
                  onClick={() => {
                    setSize(item.size);
                    setAdded(false);
                  }}
                  className={cn(
                    "h-11 border text-sm motion-fade",
                    !item.inStock &&
                      "size-hatched cursor-not-allowed text-muted line-through",
                    item.inStock && size === item.size && "bg-ink text-paper",
                    item.inStock && size !== item.size && "border-ink bg-paper",
                  )}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>

          {product.comingSoon ? (
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="mt-8 block w-full border border-ink py-4 text-center text-sm pressable"
            >
              Notify me at drop
            </button>
          ) : (
            <button
              type="button"
              onClick={add}
              className="mt-8 py-4 text-sm motion-fade"
              style={{ backgroundColor: hex, color: ctaColor }}
            >
              {size ? `Add to bag — ${formatPrice(product.price)}` : "Select a size"}
            </button>
          )}
          {added ? (
            <p className="mt-2 text-sm motion-fade">In the bag.</p>
          ) : null}

          <div className="mt-10 border-t border-line">
            <details className="group border-b border-line py-4" open>
              <summary className="micro cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Details
                  <span className="text-muted group-open:hidden">+</span>
                  <span className="hidden text-muted group-open:inline">−</span>
                </span>
              </summary>
              <div className="mt-3 space-y-2 text-sm text-muted">
                <p>{product.description}</p>
                <ul className="space-y-1">
                  {product.highlights.slice(0, 4).map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="group border-b border-line py-4">
              <summary className="micro cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Fit & fabric
                  <span className="text-muted group-open:hidden">+</span>
                  <span className="hidden text-muted group-open:inline">−</span>
                </span>
              </summary>
              <div className="mt-3 space-y-2 text-sm text-muted">
                <p>
                  Fit — {product.fit}. Model {product.model.name} is{" "}
                  {formatHeight(product.model.heightCm)} and wears {product.model.size}.
                </p>
                <p>{product.materials}</p>
                <p>{product.care}</p>
              </div>
            </details>

            <details className="group border-b border-line py-4">
              <summary className="micro cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  Shipping & returns
                  <span className="text-muted group-open:hidden">+</span>
                  <span className="hidden text-muted group-open:inline">−</span>
                </span>
              </summary>
              <div className="mt-3 space-y-2 text-sm text-muted">
                <p>
                  {product.shippingDays.min}–{product.shippingDays.max} business days
                  from the studio. 30-day returns, prepaid label.
                </p>
                <Link href="/shipping" className="inline-block text-ink underline">
                  Full shipping table
                </Link>
                <div className="pt-2">
                  {productFaq(product).map((item) => (
                    <details key={item.q} className="border-t border-line py-2">
                      <summary className="cursor-pointer text-ink">{item.q}</summary>
                      <p className="mt-2">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </details>
          </div>

          <div className="mt-6">
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
            setAdded(true);
          }}
        />
      ) : null}

      {waitlistOpen ? (
        <WaitlistModal
          productName={product.name}
          productCode={product.code}
          image={activeImage?.src}
          mode="notify"
          onClose={() => setWaitlistOpen(false)}
        />
      ) : null}

      {related.length > 0 ? (
        <section className="border-t border-line px-4 py-12 md:px-6">
          <p className="micro text-muted">Worn with</p>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3">
            {related.map((item) => {
              const image = item.variants[0]?.images[0];
              return (
                <Link key={item.id} href={`/product/${item.slug}`} className="group">
                  <div className="media-frame relative">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt || item.name}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover object-[center_20%]"
                      />
                    ) : null}
                  </div>
                  <p className="micro mt-3 text-muted">{item.line}</p>
                  <p className="mt-1 text-sm">{item.name}</p>
                  <p className="text-sm">{formatPrice(item.price)}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <div
        className="sticky bottom-0 z-20 flex items-center justify-between gap-3 border-t border-ink px-4 py-3 md:hidden"
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
            <p className="micro text-muted">Fit predictor</p>
            <h2 className="mt-2 font-sans text-2xl font-medium tracking-tight">
              Size guide
            </h2>
          </div>
          <button type="button" className="micro" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="mt-3 text-sm text-muted">
          {product.model.name} is {formatHeight(product.model.heightCm)} and wears{" "}
          {product.model.size}. Chest is measured 1&quot; below the armhole; length from
          HPS; sleeve from shoulder seam.
        </p>
        <MeasureDiagram />
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
                  <td>
                    {unit === "in"
                      ? (row.chest ?? "—")
                      : row.chest
                        ? cmFromInches(row.chest)
                        : "—"}
                  </td>
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
                  <td>
                    {unit === "in" ? row.length : cmFromInches(row.length)}
                  </td>
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

function MeasureDiagram() {
  return (
    <div className="mt-6 border border-line p-4">
      <p className="micro text-muted">How we measure</p>
      <svg
        viewBox="0 0 200 240"
        className="mx-auto mt-3 h-48 w-40 text-ink"
        aria-hidden
      >
        <rect x="70" y="20" width="60" height="16" fill="none" stroke="currentColor" />
        <path
          d="M70 36 L55 80 L55 200 L145 200 L145 80 L130 36"
          fill="none"
          stroke="currentColor"
        />
        <line x1="40" y1="90" x2="160" y2="90" stroke="currentColor" strokeDasharray="3 3" />
        <line x1="55" y1="36" x2="55" y2="200" stroke="currentColor" strokeDasharray="3 3" />
        <text x="100" y="84" textAnchor="middle" fontSize="8">
          chest
        </text>
        <text x="32" y="120" fontSize="8" transform="rotate(-90 32 120)">
          length
        </text>
        <text x="100" y="216" textAnchor="middle" fontSize="8">
          HPS to hem
        </text>
      </svg>
      <ul className="mt-2 space-y-1 text-xs text-muted">
        <li>Chest — 1&quot; below armhole, garment laid flat × 2</li>
        <li>Length — high point shoulder to hem</li>
        <li>Sleeve — shoulder seam to cuff</li>
        <li>Waist / hip — at the seam, laid flat × 2</li>
      </ul>
    </div>
  );
}
