"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/", label: "Index" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/new", label: "New" },
  { href: "/shop/women", label: "Women" },
  { href: "/shop/men", label: "Men" },
];

function isActive(pathname: string, href: string) {
  if (href === "/" || href === "/shop") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { count, openCart, addEpoch } = useCart();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (addEpoch === 0) return;
    setFlash(true);
    const timer = window.setTimeout(() => setFlash(false), 420);
    return () => window.clearTimeout(timer);
  }, [addEpoch]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3.5 md:px-6">
        <nav
          className="flex items-center gap-4 overflow-x-auto md:gap-6"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "micro shrink-0 text-[10px] tracking-[0.18em] focus-ring pressable",
                isActive(pathname, item.href)
                  ? "text-ink underline decoration-1 underline-offset-8"
                  : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="justify-self-center font-sans text-[15px] font-semibold tracking-[0.42em] focus-ring"
        >
          SABLE
        </Link>
        <div className="flex items-center justify-end gap-4 md:gap-6">
          <button
            type="button"
            className="micro text-[10px] tracking-[0.18em] text-muted hover:text-ink focus-ring pressable"
            onClick={() => window.dispatchEvent(new Event("sable:search"))}
          >
            Search
          </button>
          <Link
            href="/service"
            className="micro hidden text-[10px] tracking-[0.18em] text-muted hover:text-ink focus-ring pressable md:inline"
          >
            Service
          </Link>
          <button
            type="button"
            className={cn(
              "micro text-[10px] tracking-[0.18em] focus-ring pressable",
              flash && "bag-flash",
            )}
            onClick={openCart}
          >
            Bag{count > 0 ? ` (${count})` : ""}
          </button>
        </div>
      </div>
    </header>
  );
}
