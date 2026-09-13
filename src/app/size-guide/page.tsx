import type { Metadata } from "next";
import Link from "next/link";
import { brandComparisons } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Size & fit",
  description:
    "Sable size guide — measure how-to, inches and centimetres, and fit predictors vs COS, Acne, Levi’s, Everlane.",
};

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="micro text-muted">House fit</p>
      <h1 className="display mt-3 text-6xl">Measure once. Buy once.</h1>
      <p className="mt-6 text-sm text-muted">
        Every product page has a live chart, inches and centimetres, a measure
        diagram, and a predictor against other brands. You can add to bag from
        the chart.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        {brandComparisons.map((item) => (
          <li key={item.brand} className="border-b border-line py-3">
            <strong>{item.brand}</strong>
            <span className="text-muted">
              {" "}
              — we map their labels onto Sable blocks. Open any garment to run
              it.
            </span>
          </li>
        ))}
      </ul>
      <Link href="/" className="micro mt-10 inline-block underline">
        Back to the shop
      </Link>
    </div>
  );
}
