import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Sable collects, uses, and protects email, order, and browsing data.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="micro text-muted">Legal</p>
      <h1 className="display mt-3 text-5xl">Privacy policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated 14 September 2026</p>
      <div className="mt-10 space-y-6 text-sm leading-relaxed">
        <p>
          Sable Studio Ltd collects the minimum needed to run the store: email
          for archive notes and order updates, shipping details for fulfilment,
          and anonymous analytics events for page views.
        </p>
        <p>
          We do not sell personal data. Newsletter signup is opt-in. Cookie
          consent controls non-essential analytics. Order data is kept only as
          long as accounting and returns require.
        </p>
        <p>
          Contact:{" "}
          <a className="underline" href="mailto:privacy@sable.studio">
            privacy@sable.studio
          </a>{" "}
          · 18 Great Portland Street, London W1W 8QP, United Kingdom.
        </p>
        <p>
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/service" className="underline">
            Service
          </Link>
        </p>
      </div>
    </article>
  );
}
