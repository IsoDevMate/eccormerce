"use client";

import Image from "next/image";
import { useEffect, useId, useState, useTransition } from "react";
import { subscribeEmail } from "@/app/actions/newsletter";
import { cn } from "@/lib/cn";

type Props = {
  productName: string;
  productCode?: string;
  image?: string;
  mode?: "waitlist" | "notify";
  onClose: () => void;
};

export function WaitlistModal({
  productName,
  productCode,
  image,
  mode = "waitlist",
  onClose,
}: Props) {
  const titleId = useId();
  const [entered, setEntered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function close() {
    setEntered(false);
    window.setTimeout(onClose, 280);
  }

  const heading =
    mode === "notify" ? "Notify me at drop" : "Join the waitlist";
  const body =
    mode === "notify"
      ? `We'll email you when ${productName} lands.`
      : `Sold out for now. Get first word when ${productName} is back.`;

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
        aria-label="Close"
        onClick={close}
      />
      <div
        className={cn(
          "relative z-10 grid w-full max-w-2xl overflow-hidden border border-ink bg-paper motion-rise md:grid-cols-2",
          entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <div className="relative hidden min-h-[280px] bg-paper-2 md:block">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="40vw"
              className="object-cover object-[center_20%]"
            />
          ) : null}
        </div>

        <form
          className="relative px-6 py-8 md:px-7 md:py-9"
          action={(formData) => {
            startTransition(async () => {
              const result = await subscribeEmail(formData);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setDone(true);
            });
          }}
        >
          <button
            type="button"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-ink text-xs text-paper"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>

          <p className="micro text-muted">{productCode ?? "Sable"}</p>
          <h2
            id={titleId}
            className="mt-2 font-sans text-xl font-medium tracking-tight"
          >
            {heading}
          </h2>
          <p className="mt-3 text-sm text-muted">{body}</p>

          {done ? (
            <p className="mt-6 text-sm">You’re on the list.</p>
          ) : (
            <>
              <input type="hidden" name="context" value={productName} />
              <label className="sr-only" htmlFor="waitlist-email">
                Email
              </label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                required
                placeholder="enter your email address"
                className="mt-6 w-full border border-line bg-paper px-3 py-3 text-sm placeholder:text-muted focus-ring"
              />
              {error ? (
                <p className="mt-2 text-sm text-danger">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={pending}
                className="mt-3 w-full bg-ink py-3.5 text-sm text-paper pressable disabled:opacity-60"
              >
                {pending ? "Sending…" : "Submit"}
              </button>
            </>
          )}

          <button
            type="button"
            className="micro mt-5 text-muted underline"
            onClick={close}
          >
            Continue shopping
          </button>
        </form>
      </div>
    </div>
  );
}
