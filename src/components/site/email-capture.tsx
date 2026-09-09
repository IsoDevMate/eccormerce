"use client";

import { useEffect, useState, useTransition } from "react";
import { subscribeEmail } from "@/app/actions/newsletter";

const KEY = "sable-email-dismissed";

export function EmailCapture() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (localStorage.getItem(KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 md:items-center"
      role="dialog"
      aria-labelledby="email-title"
    >
      <form
        className="w-full max-w-md border border-ink bg-paper p-6 shadow-[8px_8px_0_0_#141414]"
        action={(formData) => {
          startTransition(async () => {
            const result = await subscribeEmail(formData);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            localStorage.setItem(KEY, "1");
            setOpen(false);
          });
        }}
      >
        <p className="micro text-muted">After a look around</p>
        <h2 id="email-title" className="display mt-3 text-4xl">
          Receive archive updates
        </h2>
        <p className="mt-3 text-sm text-muted">
          New releases are teased here first. No blast on arrival — this waited
          eight seconds on purpose.
        </p>
        <label className="sr-only" htmlFor="popup-email">
          Email address
        </label>
        <input
          id="popup-email"
          name="email"
          type="email"
          required
          placeholder="EMAIL ADDRESS"
          className="micro mt-6 w-full border border-ink bg-transparent px-3 py-3 tracking-[0.12em] placeholder:text-muted focus-ring"
        />
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-3 w-full bg-ink px-3 py-3 text-sm text-paper disabled:opacity-60"
        >
          {pending ? "Sending…" : "Next"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          I consent to receive Sable email. You can leave anytime. We do not
          sell the list.
        </p>
        <button
          type="button"
          className="micro mt-5 text-[10px] text-muted underline"
          onClick={() => {
            localStorage.setItem(KEY, "1");
            setOpen(false);
          }}
        >
          Continue without joining
        </button>
      </form>
    </div>
  );
}
