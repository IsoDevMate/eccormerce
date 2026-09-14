"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart, PROTECTION_PRICE } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    setQuantity,
    removeLine,
    setGiftWrap,
    protection,
    setProtection,
  } = useCart();
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const id = window.requestAnimationFrame(() => setEntered(true));
      return () => window.cancelAnimationFrame(id);
    }
    setEntered(false);
    const timer = window.setTimeout(() => setVisible(false), 300);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!visible) return null;

  const products = lines.filter((line) => line.kind !== "protection");
  const gift = 0;
  const wrapCount = products.filter((line) => line.giftWrap).length;
  const merchandise = products.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const shipping = merchandise >= 15000 ? 0 : 1200;
  const protectionCost = protection ? PROTECTION_PRICE : 0;
  const total = merchandise + wrapCount * gift + shipping + protectionCost;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-ink/40 motion-fade",
          entered ? "opacity-100" : "opacity-0",
        )}
        aria-label="Close bag"
        onClick={closeCart}
      />
      <aside
        className={cn(
          "relative flex h-full w-full max-w-md flex-col border-l border-ink bg-paper motion-rise",
          entered ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink px-5 py-4">
          <h2 className="micro">Bag</h2>
          <button type="button" className="micro" onClick={closeCart}>
            Close
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {products.length === 0 ? (
            <li className="px-5 py-12 text-sm text-muted">
              Empty. The archive is twenty-six pieces — start with a crew.
            </li>
          ) : (
            products.map((line) => (
              <li
                key={line.key}
                className="flex gap-4 border-b border-line px-5 py-4"
              >
                {line.image ? (
                  <div className="relative h-[100px] w-20 shrink-0 bg-paper-2">
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      className="object-cover object-[center_20%]"
                      sizes="80px"
                    />
                  </div>
                ) : null}
                <div className="flex-1">
                  <p className="micro text-muted">{line.line}</p>
                  <p>{line.name}</p>
                  <p className="text-sm text-muted">
                    {line.color} / {line.size}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto underline"
                      onClick={() => removeLine(line.key)}
                    >
                      Remove
                    </button>
                  </div>
                  <label className="mt-3 flex items-start gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={Boolean(line.giftWrap)}
                      onChange={(event) =>
                        setGiftWrap(line.key, event.target.checked)
                      }
                    />
                    Complimentary holiday wrap
                  </label>
                </div>
                <p className="text-sm">
                  {formatPrice(line.price * line.quantity)}
                </p>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-ink px-5 py-5">
          <label className="flex items-start gap-3 border border-line p-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={protection}
              onChange={(event) => setProtection(event.target.checked)}
            />
            <span>
              <span className="block font-medium">
                Package protection · {formatPrice(PROTECTION_PRICE)}
              </span>
              <span className="mt-1 block text-xs text-muted">
                Covers loss and damage in transit. Off by default — you have to
                opt in. Decline anytime.
              </span>
            </span>
          </label>
          <p className="mt-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(merchandise)}</span>
          </p>
          <p className="mt-1 flex justify-between text-sm text-muted">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
          </p>
          {protection ? (
            <p className="mt-1 flex justify-between text-sm text-muted">
              <span>Protection</span>
              <span>{formatPrice(PROTECTION_PRICE)}</span>
            </p>
          ) : null}
          <p className="mt-3 flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </p>
          <Link
            href="/checkout"
            onClick={closeCart}
            className="mt-4 block bg-ink py-3 text-center text-sm text-paper"
          >
            Checkout
          </Link>
          <p className="mt-3 text-xs text-muted">
            No Apple Pay or Shop Pay on this step — stay in the archive long
            enough to add a second piece.
          </p>
        </div>
      </aside>
    </div>
  );
}
