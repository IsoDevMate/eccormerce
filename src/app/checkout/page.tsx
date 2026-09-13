"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, PROTECTION_PRICE } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines } = useCart();
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [card, setCard] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const merchandise = lines
    .filter((line) => line.kind !== "protection")
    .reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = merchandise >= 15000 ? 0 : 1200;
  const protection = lines.some((line) => line.kind === "protection")
    ? PROTECTION_PRICE
    : 0;

  function validate() {
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email.";
    }
    if (address.trim().length < 12) {
      next.address = "Add a full shipping address.";
    }
    if (card.replace(/\s/g, "").length < 12) {
      next.card = "Enter a card number to continue (demo only).";
    }
    if (lines.length === 0) {
      next.bag = "Your bag is empty.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 md:grid-cols-2 md:px-6">
      <form
        className="space-y-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!validate()) return;
          setPending(true);
          window.setTimeout(() => {
            router.push(`/thank-you?email=${encodeURIComponent(email.trim())}`);
          }, 400);
        }}
      >
        <p className="micro text-muted">Checkout</p>
        <h1 className="display text-5xl">Place the order</h1>
        <p className="text-sm text-muted">
          Sable checkout only — no Apple Pay or Shop Pay on the product page, so
          browsing stays the conversion surface.
        </p>
        {errors.bag ? <p className="text-sm text-danger">{errors.bag}</p> : null}
        <label className="block text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="mt-1 w-full border border-ink bg-transparent px-3 py-3"
          />
          {errors.email ? (
            <span className="mt-1 block text-xs text-danger">{errors.email}</span>
          ) : null}
        </label>
        <label className="block text-sm">
          Shipping address
          <textarea
            rows={4}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            aria-invalid={Boolean(errors.address)}
            className="mt-1 w-full border border-ink bg-transparent px-3 py-3"
          />
          {errors.address ? (
            <span className="mt-1 block text-xs text-danger">{errors.address}</span>
          ) : null}
        </label>
        <label className="block text-sm">
          Card
          <input
            value={card}
            onChange={(event) => setCard(event.target.value)}
            placeholder="ACCT-000015"
            aria-invalid={Boolean(errors.card)}
            className="mt-1 w-full border border-ink bg-transparent px-3 py-3"
          />
          {errors.card ? (
            <span className="mt-1 block text-xs text-danger">{errors.card}</span>
          ) : null}
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-ink py-4 text-sm text-paper disabled:opacity-60"
        >
          {pending
            ? "Placing order…"
            : `Place order · ${formatPrice(merchandise + shipping + protection)}`}
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
        {protection ? (
          <p className="mt-2 flex justify-between text-sm">
            <span>Package protection</span>
            <span>{formatPrice(protection)}</span>
          </p>
        ) : null}
      </aside>
    </div>
  );
}
