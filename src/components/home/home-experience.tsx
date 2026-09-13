import Image from "next/image";
import Link from "next/link";
import {
  PRODUCT_LINES,
  getLineCover,
  getNewArrivals,
  getUgcLooks,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const HERO =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=80";

export function HomeExperience() {
  const lines = PRODUCT_LINES.map(getLineCover);
  const arrivals = getNewArrivals().slice(0, 4);
  const looks = getUgcLooks().slice(0, 6);

  return (
    <div>
      <section className="relative min-h-[78svh] overflow-hidden border-b border-ink">
        <Image
          src={HERO}
          alt="Sable campaign"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative flex min-h-[78svh] flex-col justify-end px-4 py-10 text-paper md:px-8 md:py-14">
          <p className="micro">House 26</p>
          <h1 className="display mt-3 max-w-3xl text-6xl md:text-8xl">
            Cut, color, fit — without the noise.
          </h1>
          <p className="mt-4 max-w-md text-sm text-paper/80">
            Five lines. Photographed on people. Sized in the open. Enter by
            what just dropped, or by the cut you already know.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop/new"
              className="bg-paper px-5 py-3 text-sm text-ink"
            >
              Shop new
            </Link>
            <Link
              href="/shop"
              className="border border-paper px-5 py-3 text-sm text-paper"
            >
              Shop clothing
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="flex items-end justify-between px-4 py-6 md:px-6">
          <div>
            <p className="micro text-muted">First in nav</p>
            <h2 className="display mt-2 text-4xl md:text-5xl">New arrivals</h2>
          </div>
          <Link href="/shop/new" className="micro underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {arrivals.map((product) => {
            const image =
              product.variants[0]?.images.find((item) => item.kind === "model") ??
              product.variants[0]?.images[0];
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group border-r border-line last:border-r-0"
              >
                <div className="relative aspect-[4/5] bg-paper-2">
                  {image ? (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <div className="flex justify-between gap-3 px-3 py-3">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm">{formatPrice(product.price)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="px-4 py-6 md:px-6">
          <p className="micro text-muted">Every line on the house</p>
          <h2 className="display mt-2 text-4xl md:text-5xl">Shop the archive</h2>
        </div>
        <div className="grid md:grid-cols-2">
          {lines.map((line, index) => (
            <Link
              key={line.line}
              href={`/shop/archive?line=${encodeURIComponent(line.line)}`}
              className="group relative min-h-[46vh] overflow-hidden border-t border-line md:border-r md:odd:border-r md:even:border-r-0"
            >
              {line.image ? (
                <Image
                  src={line.image}
                  alt={line.line}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : null}
              <div className="absolute inset-0 bg-ink/25" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-paper">
                <p className="micro">
                  {String(index + 1).padStart(2, "0")} · {line.count} pieces
                </p>
                <h3 className="display mt-2 text-5xl md:text-6xl">{line.line}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-ink">
        <div className="px-4 py-6 md:px-6">
          <p className="micro text-muted">Worn, 4:5</p>
          <h2 className="display mt-2 text-4xl">How it looks in life</h2>
        </div>
        <div className="flex gap-px overflow-x-auto bg-line">
          {looks.map((look) => (
            <Link
              key={look.src + look.name}
              href={look.href}
              className="relative aspect-[4/5] w-[46vw] shrink-0 bg-paper md:w-[22vw]"
            >
              <Image src={look.src} alt={look.alt} fill className="object-cover" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-ink px-4 py-16 text-center md:px-6">
        <p className="micro text-muted">Collections</p>
        <h2 className="display mt-3 text-5xl md:text-7xl">
          Split by who wears it.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted">
          Women and Men live on the clothing page — not as the whole homepage.
          Choose a body, then a line.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block bg-ink px-6 py-3 text-sm text-paper"
        >
          Shop by collection
        </Link>
      </section>
    </div>
  );
}
