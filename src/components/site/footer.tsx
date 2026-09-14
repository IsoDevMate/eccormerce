"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { subscribeEmail } from "@/app/actions/newsletter";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/", label: "Index" },
      { href: "/shop", label: "Shop" },
      { href: "/shop/new", label: "New" },
      { href: "/shop/women", label: "Women" },
      { href: "/shop/men", label: "Men" },
    ],
  },
  {
    title: "House",
    links: [
      { href: "/shipping", label: "Shipping" },
      { href: "/service", label: "Service" },
      { href: "/size-guide", label: "Size & fit" },
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
      <div className="grid gap-10 px-4 py-12 md:grid-cols-12 md:px-6 md:py-14">
        <div className="md:col-span-4">
          <p className="font-sans text-2xl font-medium tracking-tight md:text-3xl">
            Fewer pieces.
          </p>
          <address className="mt-5 text-xs not-italic leading-relaxed text-paper/55">
            Sable Studio Ltd
            <br />
            London ·{" "}
            <a className="underline" href="mailto:service@sable.studio">
              service@sable.studio
            </a>
          </address>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="md:col-span-2">
            <p className="micro mb-3 text-paper/45">{column.title}</p>
            <ul className="space-y-2 text-sm text-paper/85">
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
          className="md:col-span-4"
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
          <p className="micro mb-3 text-paper/45">Notes</p>
          <label className="sr-only" htmlFor="footer-email">
            Email
          </label>
          <input
            id="footer-email"
            name="email"
            type="email"
            required
            placeholder="Email"
            aria-invalid={Boolean(error)}
            className="w-full border border-paper/30 bg-transparent px-3 py-2.5 text-sm placeholder:text-paper/40 focus-ring"
          />
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          {ok ? (
            <p className="mt-2 text-sm text-paper/70">You’re on the list.</p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full bg-paper px-3 py-2.5 text-sm text-ink disabled:opacity-60"
          >
            {pending ? "…" : "Subscribe"}
          </button>
        </form>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-paper/45 md:px-6">
        <span>© {new Date().getFullYear()} Sable</span>
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
