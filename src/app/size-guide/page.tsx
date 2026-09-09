import Link from "next/link";
import { brandComparisons } from "@/data/catalog";

export const metadata = { title: "Size & fit" };

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="micro text-muted">House fit</p>
      <h1 className="display mt-3 text-6xl">Measure once. Buy once.</h1>
      <p className="mt-6 text-sm text-muted">
        Every product page has a live chart, inches and centimetres, and a
        predictor against COS, Acne Studios, Levi’s, and Everlane. You can add
        to bag from the chart.
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
      <Link href="/shop" className="micro mt-10 inline-block underline">
        Back to the archive
      </Link>
    </div>
  );
}
