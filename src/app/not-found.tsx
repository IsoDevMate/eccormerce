import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getNewArrivals } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Not found",
  description: "That piece is not in the Sable archive. Shop what is here.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const picks = getNewArrivals(4);

  return (
    <div className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="micro text-muted">404</p>
        <h1 className="mt-3 font-sans text-3xl font-medium tracking-tight md:text-4xl">
          That piece is not in the archive.
        </h1>
        <p className="mt-3 text-sm text-muted">
          The link may be old, or the drop has not opened yet.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="micro bg-ink px-5 py-3 text-paper pressable"
          >
            Index
          </Link>
          <Link href="/shop" className="micro underline">
            Shop
          </Link>
        </div>
      </div>

      {picks.length > 0 ? (
        <section className="mx-auto mt-16 max-w-5xl">
          <p className="micro text-center text-muted">Still here</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
            {picks.map((product) => {
              const image =
                product.variants[0]?.images.find((item) => item.kind === "model") ??
                product.variants[0]?.images[0];
              return (
                <li key={product.id}>
                  <Link href={`/product/${product.slug}`} className="group block">
                    <div className="media-frame relative">
                      {image ? (
                        <Image
                          src={image.src}
                          alt={image.alt || product.name}
                          fill
                          sizes="(min-width: 768px) 20vw, 45vw"
                          className="object-cover object-[center_20%] transition-opacity duration-300 group-hover:opacity-80"
                        />
                      ) : null}
                    </div>
                    <p className="micro mt-2 text-muted">{product.code}</p>
                    <p className="mt-1 text-[13px]">{product.name}</p>
                    <p className="text-[13px] tabular-nums">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
