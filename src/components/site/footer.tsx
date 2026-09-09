import Link from "next/link";
import { subscribeEmailForm } from "@/app/actions/newsletter";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop/women", label: "Women" },
      { href: "/shop/men", label: "Men" },
      { href: "/shop", label: "Full archive" },
      { href: "/size-guide", label: "Size & fit" },
    ],
  },
  {
    title: "House",
    links: [
      { href: "/shipping", label: "Shipping & returns" },
      { href: "/service", label: "Customer service" },
      { href: "/shop?filter=new", label: "New releases" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink bg-ink text-paper">
      <div className="grid gap-12 px-4 py-16 md:grid-cols-12 md:px-6">
        <div className="md:col-span-5">
          <p className="display text-5xl md:text-7xl">Fewer pieces. Worn longer.</p>
          <p className="mt-6 max-w-sm text-sm text-paper/70">
            Sable is a 26-piece archive. We land you in the clothes, not a
            campaign. Fit, ship dates, and service sit next to the purchase —
            not behind it.
          </p>
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
        <form action={subscribeEmailForm} className="md:col-span-3">
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
            className="w-full border border-paper/30 bg-transparent px-3 py-3 text-sm placeholder:text-paper/40 focus-ring"
          />
          <button
            type="submit"
            className="mt-3 w-full bg-paper px-3 py-3 text-sm text-ink"
          >
            Receive updates
          </button>
          <p className="mt-3 text-xs text-paper/45">
            Delayed, not shouted. We send drops and restocks only.
          </p>
        </form>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 px-4 py-4 text-[11px] uppercase tracking-[0.16em] text-paper/50 md:px-6">
        <span>© {new Date().getFullYear()} Sable</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
