import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your Sable order is confirmed. Shipping updates follow by email.",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center md:px-6">
      <p className="micro text-muted">Order received</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">Thank you.</h1>
      <p className="mt-6 text-sm text-muted">
        {email
          ? `A confirmation is on its way to ${email}.`
          : "A confirmation is on its way to your inbox."}{" "}
        Shipping dates match what you saw on the product — including mill delays
        when they apply.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="bg-ink px-5 py-3 text-sm text-paper">
          Keep shopping
        </Link>
        <Link href="/service" className="border border-ink px-5 py-3 text-sm">
          Contact service
        </Link>
      </div>
    </div>
  );
}
