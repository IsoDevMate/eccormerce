import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of sale for Sable: orders, shipping windows, returns, and liability.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="micro text-muted">Legal</p>
      <h1 className="display mt-3 text-5xl">Terms & conditions</h1>
      <p className="mt-4 text-sm text-muted">Last updated 14 September 2026</p>
      <div className="mt-10 space-y-6 text-sm leading-relaxed">
        <p>
          By placing an order you enter a contract with Sable Studio Ltd for the
          goods listed at checkout. Prices include VAT where applicable.
          Shipping windows shown on the product page are estimates — mill pieces
          may take longer and we state that before you pay.
        </p>
        <p>
          Returns are accepted within 30 days in unworn condition with tags.
          Prepaid labels are provided for UK and EU returns. Package protection
          is optional and never pre-selected.
        </p>
        <p>
          Questions:{" "}
          <a className="underline" href="mailto:service@sable.studio">
            service@sable.studio
          </a>{" "}
          · 18 Great Portland Street, London W1W 8QP, United Kingdom.
        </p>
        <p>
          <Link href="/privacy" className="underline">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/shipping" className="underline">
            Shipping
          </Link>
        </p>
      </div>
    </article>
  );
}
