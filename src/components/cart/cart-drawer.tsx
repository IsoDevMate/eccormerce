"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    subtotal,
    setQuantity,
    removeLine,
    setGiftWrap,
  } = useCart();

  if (!isOpen) return null;

  const gift = 1200;
  const wrapCount = lines.filter((line) => line.giftWrap).length;
  const shipping = subtotal >= 15000 ? 0 : 1200;
  const total = subtotal + wrapCount * gift + shipping;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40">
      <button
        type="button"
        className="h-full flex-1"
        aria-label="Close bag"
        onClick={closeCart}
      />
      <aside className="flex h-full w-full max-w-md flex-col border-l border-ink bg-paper">
        <div className="flex items-center justify-between border-b border-ink px-5 py-4">
          <h2 className="micro">Bag</h2>
          <button type="button" className="micro" onClick={closeCart}>
            Close
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <li className="px-5 py-12 text-sm text-muted">
              Empty. The archive is twenty-six pieces — start with a crew.
            </li>
          ) : (
            lines.map((line) => (
              <li
                key={line.key}
                className="flex gap-4 border-b border-line px-5 py-4"
              >
                <Image
                  src={line.image}
                  alt=""
                  width={80}
                  height={100}
                  className="h-[100px] w-20 object-cover"
                />
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
          <p className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
          <p className="mt-1 flex justify-between text-sm text-muted">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
          </p>
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
