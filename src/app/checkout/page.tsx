"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { lines, subtotal } = useCart();
  const wrap = lines.filter((line) => line.giftWrap).length * 0;
  const shipping = subtotal >= 15000 ? 0 : 1200;

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 md:grid-cols-2 md:px-6">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          alert("Order captured locally. Turso persistence is next.");
        }}
      >
        <p className="micro text-muted">Checkout</p>
        <h1 className="display text-5xl">Place the order</h1>
        <p className="text-sm text-muted">
          Sable checkout only. Wallets wait until a later experiment — browsing
          is the conversion surface.
        </p>
        <label className="block text-sm">
          Email
          <input
            required
            type="email"
            className="mt-1 w-full border border-ink bg-transparent px-3 py-3"
          />
        </label>
        <label className="block text-sm">
          Shipping address
          <textarea
            required
            rows={4}
            className="mt-1 w-full border border-ink bg-transparent px-3 py-3"
          />
        </label>
        <label className="block text-sm">
          Card
          <input
            required
            placeholder="ACCT-000015"
            className="mt-1 w-full border border-ink bg-transparent px-3 py-3"
          />
        </label>
        <button type="submit" className="w-full bg-ink py-4 text-sm text-paper">
          Place order · {formatPrice(subtotal + shipping + wrap)}
        </button>
        <Link href="/service" className="block text-center text-sm underline">
          Need a person before you pay?
        </Link>
      </form>
      <aside>
        <p className="micro text-muted">Summary</p>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <li key={line.key} className="flex justify-between py-3 text-sm">
              <span>
                {line.name} · {line.color} / {line.size} × {line.quantity}
                {line.giftWrap ? " · wrapped" : ""}
              </span>
              <span>{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
        </p>
      </aside>
    </div>
  );
}
