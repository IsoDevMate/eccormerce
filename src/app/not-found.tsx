import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
  description: "That piece is not in the Sable archive. Shop what is here.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="micro">404</p>
      <h1 className="display mt-3 text-6xl">That piece is not in the archive.</h1>
      <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
        The link may be old, or the drop has not opened yet. The grid is still
        here.
      </p>
      <Link href="/" className="micro mt-8 inline-block bg-ink px-5 py-3 text-paper">
        Shop what’s here
      </Link>
    </div>
  );
}
