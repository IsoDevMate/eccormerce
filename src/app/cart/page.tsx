import Link from "next/link";

export const metadata = { title: "Bag" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="display text-5xl">The bag lives in the overlay.</h1>
      <p className="mt-4 text-sm text-muted">
        Open it from the header. Checkout is one route — no third-party wallets
        on the product page.
      </p>
      <Link href="/shop" className="micro mt-8 inline-block underline">
        Return to archive
      </Link>
    </div>
  );
}
