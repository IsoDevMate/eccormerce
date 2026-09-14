"use client";

import Link from "next/link";
import { useState } from "react";

const prompts = [
  {
    id: "fit",
    label: "What size should I choose?",
    answer:
      "Open the size guide on any garment. Compare a brand you already wear, then add from the chart. Model height and worn size sit on the photo.",
    href: "/size-guide",
    cta: "Open house fit",
  },
  {
    id: "ship",
    label: "When will this arrive?",
    answer:
      "Studio stock is 2–6 business days. Mill pieces are 10–21, shown on the product. Enter a ZIP on the product for an estimate.",
    href: "/shipping",
    cta: "Shipping dates",
  },
  {
    id: "line",
    label: "Which line is right?",
    answer:
      "Soft Lounge is drape. Studio is the daily block. Knit is merino. Outer is boiled wool. Archive is cap and belt.",
    href: "/shop",
    cta: "See the house",
  },
  {
    id: "gift",
    label: "Can I send this as a gift?",
    answer:
      "Yes. Complimentary wrap is a checkbox on each bag line. A direct service line sits on every product.",
    href: "/service",
    cta: "Talk to service",
  },
] as const;

export function ShopAssistant() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<(typeof prompts)[number] | null>(null);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open ? (
        <div
          className="mb-3 w-[min(92vw,22rem)] border border-ink bg-paper p-4"
          role="dialog"
          aria-label="Shop assistant"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="micro text-muted">Help</p>
              <p className="mt-1 text-sm">Pick a question.</p>
            </div>
            <button
              type="button"
              className="micro pressable"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {prompts.map((prompt) => (
              <li key={prompt.id}>
                <button
                  type="button"
                  className="w-full border border-line px-3 py-2 text-left text-sm pressable hover:border-ink"
                  onClick={() => setActive(prompt)}
                >
                  {prompt.label}
                </button>
              </li>
            ))}
          </ul>
          {active ? (
            <div className="mt-4 border-t border-line pt-4">
              <p className="text-sm">{active.answer}</p>
              <Link
                href={active.href}
                className="micro mt-3 inline-block underline"
              >
                {active.cta}
              </Link>
            </div>
          ) : null}
          <p className="mt-4 text-xs text-muted">
            For a person,{" "}
            <Link href="/service" className="underline">
              write service
            </Link>
            .
          </p>
        </div>
      ) : null}
      <button
        type="button"
        className="border border-line bg-paper px-3 py-2 text-xs text-ink pressable hover:border-ink"
        onClick={() => setOpen((current) => !current)}
      >
        Help
      </button>
    </div>
  );
}
