import type { Metadata } from "next";
import { subscribeEmailForm } from "@/app/actions/newsletter";

export const metadata: Metadata = {
  title: "Service",
  description:
    "Contact Sable customer service for fit, shipping, and gifts. 18 Great Portland Street, London.",
};

export default function ServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="micro text-muted">A person, not a bot wall</p>
      <h1 className="display mt-3 text-6xl">Customer service.</h1>
      <p className="mt-6 text-sm text-muted">
        Fit questions, ship dates, gifts. Write us. If you would rather wait for
        the field jacket, leave an email — that drop is teased, not sold.
      </p>
      <div className="mt-8 space-y-2 text-sm">
        <p>
          <a className="underline" href="mailto:service@sable.studio">
            service@sable.studio
          </a>
        </p>
        <address className="not-italic text-muted">
          Sable Studio Ltd
          <br />
          18 Great Portland Street
          <br />
          London W1W 8QP
          <br />
          United Kingdom
        </address>
      </div>
      <form action={subscribeEmailForm} className="mt-12 max-w-md" id="notes">
        <label className="micro" htmlFor="drop-email">
          Field jacket drop
        </label>
        <input
          id="drop-email"
          name="email"
          type="email"
          required
          placeholder="Email"
          className="mt-2 w-full border border-ink bg-transparent px-3 py-3"
        />
        <button type="submit" className="mt-3 bg-ink px-5 py-3 text-sm text-paper">
          Notify me
        </button>
      </form>
    </div>
  );
}
