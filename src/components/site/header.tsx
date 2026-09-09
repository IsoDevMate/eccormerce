"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/shop/women", label: "Women" },
  { href: "/shop/men", label: "Men" },
  { href: "/shop", label: "Archive" },
];

export function Header() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const split = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b",
        split
          ? "border-transparent bg-transparent mix-blend-difference text-paper"
          : "border-line bg-paper/90 backdrop-blur-sm",
      )}
    >
      <div className="grid grid-cols-3 items-center px-4 py-3 md:px-6">
        <nav className="flex items-center gap-4 md:gap-6" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "micro text-[10px] tracking-[0.2em] focus-ring",
                pathname.startsWith(item.href) && !split ? "underline" : "",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="justify-self-center font-sans text-[15px] font-medium tracking-[0.38em] focus-ring"
        >
          SABLE
        </Link>
        <div className="flex items-center justify-end gap-4 md:gap-6">
          <button
            type="button"
            className="micro text-[10px] tracking-[0.2em] focus-ring"
            onClick={() =>
              window.dispatchEvent(new Event("sable:search"))
            }
          >
            Search
          </button>
          <Link
            href="/service"
            className="micro hidden text-[10px] tracking-[0.2em] focus-ring md:inline"
          >
            Service
          </Link>
          <button
            type="button"
            className="micro text-[10px] tracking-[0.2em] focus-ring"
            onClick={openCart}
          >
            Bag ({count})
          </button>
        </div>
      </div>
    </header>
  );
}
