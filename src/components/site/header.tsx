"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/shop/new", label: "New" },
  { href: "/", label: "Shop" },
  { href: "/shop/women", label: "Women" },
  { href: "/shop/men", label: "Men" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 md:px-6">
        <nav
          className="flex items-center gap-3 overflow-x-auto md:gap-5"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "micro shrink-0 text-[10px] tracking-[0.2em] focus-ring",
                isActive(pathname, item.href) ? "underline" : "",
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
        <div className="flex items-center justify-end gap-3 md:gap-6">
          <button
            type="button"
            className="micro text-[10px] tracking-[0.2em] focus-ring"
            onClick={() => window.dispatchEvent(new Event("sable:search"))}
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
