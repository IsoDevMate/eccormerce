"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { subscribeEmail } from "@/app/actions/newsletter";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop/new", label: "New arrivals" },
      { href: "/", label: "Shop" },
      { href: "/shop/women", label: "Women" },
      { href: "/shop/men", label: "Men" },
      { href: "/size-guide", label: "Size & fit" },
    ],
  },
  {
    title: "House",
    links: [
      { href: "/shipping", label: "Shipping & returns" },
      { href: "/service", label: "Customer service" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <footer className="border-t border-ink bg-ink text-paper">
      <div className="grid gap-12 px-4 py-16 md:grid-cols-12 md:px-6">
        <div className="md:col-span-5">
          <p className="display text-5xl md:text-7xl">Fewer pieces. Worn longer.</p>
          <p className="mt-6 max-w-sm text-sm text-paper/70">
            Enter the grid. Fit, ship dates, and service sit next to the
            purchase — not behind it.
          </p>
          <address className="mt-6 text-sm not-italic text-paper/55">
            Sable Studio Ltd
            <br />
            18 Great Portland Street
            <br />
            London W1W 8QP
            <br />
            United Kingdom
            <br />
            <a className="underline" href="mailto:service@sable.studio">
              service@sable.studio
            </a>
          </address>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="md:col-span-2">
            <p className="micro mb-4 text-paper/50">{column.title}</p>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <form
          className="md:col-span-3"
          action={(formData) => {
            setError(null);
            setOk(false);
            startTransition(async () => {
              const result = await subscribeEmail(formData);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setOk(true);
            });
          }}
        >
          <p className="micro mb-4 text-paper/50">Archive notes</p>
          <label className="sr-only" htmlFor="footer-email">
            Email
          </label>
          <input
            id="footer-email"
            name="email"
            type="email"
            required
            placeholder="Email address"
            aria-invalid={Boolean(error)}
            className="w-full border border-paper/30 bg-transparent px-3 py-3 text-sm placeholder:text-paper/40 focus-ring"
          />
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          {ok ? (
            <p className="mt-2 text-sm text-paper/70">You’re on the list.</p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-3 w-full bg-paper px-3 py-3 text-sm text-ink disabled:opacity-60"
          >
            {pending ? "Sending…" : "Receive updates"}
          </button>
          <p className="mt-3 text-xs text-paper/45">
            Delayed, not shouted. We send drops and restocks only.
          </p>
        </form>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 px-4 py-4 text-[11px] uppercase tracking-[0.16em] text-paper/50 md:px-6">
        <span>© {new Date().getFullYear()} Sable Studio Ltd</span>
        <span className="flex gap-3">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </span>
      </div>
    </footer>
  );
}
