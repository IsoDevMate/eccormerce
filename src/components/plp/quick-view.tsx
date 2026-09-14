"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { WaitlistModal } from "@/components/site/waitlist-modal";

type Props = {
  product: Product;
  onClose: () => void;
};

export function QuickView({ product, onClose }: Props) {
  const titleId = useId();
  const { addLine } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [size, setSize] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const variant =
    product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const images = variant?.images ?? [];
  const active = images[imageIndex] ?? images[0];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function close() {
    setOpen(false);
    window.setTimeout(onClose, 280);
  }

  function add() {
    if (!variant || !size || product.comingSoon) return;
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
    setConfirm(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end" role="dialog" aria-modal aria-labelledby={titleId}>
      <button
        type="button"
        className={cn(
          "overlay-scrim absolute inset-0",
          open ? "opacity-100" : "opacity-0",
        )}
        aria-label="Close quick view"
        onClick={close}
      />
      <aside
        data-open={open}
        className="drawer-panel relative z-10 flex h-full w-full max-w-lg flex-col border-l border-ink bg-paper"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="micro text-muted">Quick view</p>
          <button type="button" className="micro pressable" onClick={close}>
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="media-frame relative">
            {active ? (
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority
                sizes="(min-width: 768px) 32vw, 100vw"
                className="object-cover object-[center_20%]"
              />
            ) : null}
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 border-b border-line">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={cn(
                    "relative aspect-square border-r border-line last:border-r-0",
                    imageIndex === index && "ring-1 ring-inset ring-ink",
                  )}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="10vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="px-5 py-6">
            <p className="micro text-muted">{product.line}</p>
            <h2 id={titleId} className="mt-2 text-xl font-medium tracking-tight">
              {product.name}
            </h2>
            <p className="mt-2 text-sm">{formatPrice(product.price)}</p>

            <div className="mt-6">
              <p className="micro mb-3">Colour — {variant?.name}</p>
              <div className="flex gap-2">
                {product.variants.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.name}
                    onClick={() => {
                      setVariantId(item.id);
                      setImageIndex(0);
                      setSize(null);
                      setConfirm(false);
                    }}
                    className={cn(
                      "h-7 w-7 border pressable",
                      item.id === variant?.id
                        ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper"
                        : "border-line",
                    )}
                    style={{ backgroundColor: item.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="micro mb-3">Size</p>
              <div className="grid grid-cols-4 gap-2">
                {(variant?.sizes ?? []).map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    disabled={!item.inStock}
                    onClick={() => {
                      setSize(item.size);
                      setConfirm(false);
                    }}
                    className={cn(
                      "h-10 border text-sm pressable",
                      !item.inStock &&
                        "size-hatched cursor-not-allowed border-line text-muted line-through",
                      item.inStock &&
                        size === item.size &&
                        "border-ink bg-ink text-paper",
                      item.inStock &&
                        size !== item.size &&
                        "border-ink bg-paper hover:bg-paper-2",
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
                className="mt-6 w-full border border-ink py-3.5 text-sm pressable"
              >
                Notify me at drop
              </button>
            ) : (
              <button
                type="button"
                onClick={add}
                disabled={!size}
                className={cn(
                  "mt-6 w-full bg-ink py-3.5 text-sm text-paper pressable",
                  !size && "opacity-40",
                )}
              >
                {size
                  ? `Add ${variant?.name} / ${size} — ${formatPrice(product.price)}`
                  : "Select a size"}
              </button>
            )}

            {confirm ? (
              <p className="mt-3 text-sm">In the bag.</p>
            ) : null}

            <Link
              href={`/product/${product.slug}`}
              onClick={close}
              className="micro mt-5 inline-block underline"
            >
              Full details
            </Link>
          </div>
        </div>
      </aside>
      {waitlistOpen ? (
        <WaitlistModal
          productName={product.name}
          productCode={product.code}
          image={active?.src}
          mode="notify"
          onClose={() => setWaitlistOpen(false)}
        />
      ) : null}
    </div>
  );
}
