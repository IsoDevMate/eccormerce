"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "sable-cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, []);

  if (!open) return null;

  function choose(value: "accepted" | "rejected") {
    localStorage.setItem(KEY, value);
    window.dispatchEvent(
      new CustomEvent("sable:consent", { detail: { value } }),
    );
    setOpen(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink bg-paper p-4 md:p-5">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm text-muted">
          We use essential cookies to run the bag, and optional analytics only if
          you accept. Read the{" "}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="border border-ink px-4 py-2 text-sm"
            onClick={() => choose("rejected")}
          >
            Reject
          </button>
          <button
            type="button"
            className="bg-ink px-4 py-2 text-sm text-paper"
            onClick={() => choose("accepted")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
