import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100svh-96px)]">
      <div className="grid min-h-[calc(100svh-96px)] md:grid-cols-2">
        <Link href="/shop/women" className="group relative min-h-[50vh] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
            alt="Women’s archive"
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-ink/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-paper md:p-10">
            <p className="micro">Enter</p>
            <h1 className="display mt-2 text-6xl md:text-8xl">Women</h1>
            <p className="mt-3 max-w-xs text-sm text-paper/80">
              Lounge, knit, outer. Fourteen pieces. Start in the clothes.
            </p>
          </div>
        </Link>
        <Link href="/shop/men" className="group relative min-h-[50vh] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1600&q=80"
            alt="Men’s archive"
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-ink/25" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-paper md:p-10">
            <p className="micro">Enter</p>
            <h2 className="display mt-2 text-6xl md:text-8xl">Men</h2>
            <p className="mt-3 max-w-xs text-sm text-paper/80">
              Crews, trousers, outer. Twelve pieces. Same house, different block.
            </p>
          </div>
        </Link>
      </div>
      <Link
        href="/shop"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 bg-paper px-4 py-2 micro"
      >
        Skip the split · full archive
      </Link>
    </div>
  );
}
