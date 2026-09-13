"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { searchProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const openSearch = () => setOpen(true);
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("sable:search", openSearch);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("sable:search", openSearch);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const results = useMemo(() => searchProducts(query).slice(0, 8), [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 p-4 md:p-16"
      role="dialog"
      aria-label="Search"
      onClick={() => setOpen(false)}
    >
      <div
        className="mx-auto max-w-2xl border border-ink bg-paper"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the archive"
          className="w-full border-b border-ink bg-transparent px-4 py-4 text-lg focus:outline-none"
        />
        <ul>
          {results.map((product) => {
            const image = product.variants[0]?.images[0];
            return (
              <li key={product.id} className="border-b border-line last:border-0">
                <Link
                  href={`/product/${product.slug}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-paper-2"
                  onClick={() => setOpen(false)}
                >
                  {image ? (
                    <Image
                      src={image.src}
                      alt={product.name}
                      width={56}
                      height={70}
                      className="h-16 w-12 object-cover"
                    />
                  ) : null}
                  <span className="flex-1">
                    <span className="micro block text-muted">{product.line}</span>
                    {product.name}
                  </span>
                  <span className="text-sm">{formatPrice(product.price)}</span>
                </Link>
              </li>
            );
          })}
          {query && results.length === 0 ? (
            <li className="px-4 py-8 text-sm text-muted">
              Nothing matches “{query}”. Try a color, a code, or lounge.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
