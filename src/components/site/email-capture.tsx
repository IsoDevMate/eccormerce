"use client";

import Image from "next/image";
import { useEffect, useId, useState, useTransition } from "react";
import { subscribeEmail } from "@/app/actions/newsletter";
import { cn } from "@/lib/cn";

const KEY = "sable-email-dismissed";
const IMAGE =
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=70";

export function EmailCapture() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (localStorage.getItem(KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setEntered(true));
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setEntered(false);
    window.setTimeout(() => setOpen(false), 280);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className={cn(
          "overlay-scrim absolute inset-0",
          entered ? "opacity-100" : "opacity-0",
        )}
        aria-label="Dismiss"
        onClick={dismiss}
      />
      <div
        className={cn(
          "relative z-10 grid w-full max-w-3xl overflow-hidden border border-ink bg-paper motion-rise md:grid-cols-2",
          entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <div className="relative hidden min-h-[320px] md:block">
          <Image
            src={IMAGE}
            alt=""
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
        </div>

        <form
          className="relative flex flex-col justify-center px-6 py-8 md:px-8 md:py-10"
          action={(formData) => {
            startTransition(async () => {
              const result = await subscribeEmail(formData);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              dismiss();
            });
          }}
        >
          <button
            type="button"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-ink text-xs text-paper"
            onClick={dismiss}
            aria-label="Close"
          >
            ×
          </button>

          <h2
            id={titleId}
            className="font-sans text-xl font-medium tracking-tight md:text-2xl"
          >
            Join our mailing list
          </h2>
          <p className="mt-3 text-sm text-muted">
            Insider updates, restocks, and new arrivals — never shouted.
          </p>

          <label className="sr-only" htmlFor="popup-email">
            Email address
          </label>
          <input
            id="popup-email"
            name="email"
            type="email"
            required
            placeholder="enter your email address"
            className="mt-6 w-full border border-line bg-paper px-3 py-3 text-sm placeholder:text-muted focus-ring"
          />
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-3 w-full bg-ink py-3.5 text-sm text-paper pressable disabled:opacity-60"
          >
            {pending ? "Sending…" : "Submit"}
          </button>

          <label className="mt-5 flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              onChange={(event) => {
                if (event.target.checked) dismiss();
              }}
            />
            No, thanks
          </label>
        </form>
      </div>
    </div>
  );
}
