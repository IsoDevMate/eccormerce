"use client";

import Link from "next/link";
import { useState } from "react";

const prompts = [
  {
    id: "fit",
    label: "What size should I choose?",
    answer:
      "Open the size guide on any garment. Compare a brand you already wear (COS, Acne, Levi’s, Everlane), then add from the chart. Model height and worn size sit on the photo. We do not hide mill delays.",
    href: "/size-guide",
    cta: "Open house fit",
  },
  {
    id: "ship",
    label: "When will this arrive?",
    answer:
      "Studio stock is 2–6 business days. Mill pieces are 10–21, shown on the product. Preorders 4–6 weeks. Enter a ZIP on the PDP for an estimate. Package protection is optional in the bag — off until you check it.",
    href: "/shipping",
    cta: "Shipping dates",
  },
  {
    id: "line",
    label: "Which line is right?",
    answer:
      "Soft Lounge is drape. Studio is the daily block. Knit is merino. Outer is boiled wool and the field jacket tease. Archive is cap and belt. Every line is on the homepage; clothing splits women and men.",
    href: "/",
    cta: "See the house",
  },
  {
    id: "gift",
    label: "Can I send this as a gift?",
    answer:
      "Yes. Complimentary wrap is a checkbox on each bag line. Shipping estimators and a direct service line sit on the product so the recipient is not guessing.",
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
          className="mb-3 w-[min(92vw,22rem)] border border-ink bg-paper p-4 shadow-[6px_6px_0_0_#141414]"
          role="dialog"
          aria-label="Shop assistant"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="micro text-muted">Guided, not a chatbot</p>
              <p className="mt-1 text-sm">Pick a question. Answers come from the store, not an open box.</p>
            </div>
            <button type="button" className="micro" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {prompts.map((prompt) => (
              <li key={prompt.id}>
                <button
                  type="button"
                  className="w-full border border-line px-3 py-2 text-left text-sm hover:border-ink"
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
              <Link href={active.href} className="micro mt-3 inline-block underline">
                {active.cta}
              </Link>
            </div>
          ) : null}
          <p className="mt-4 text-xs text-muted">
            Nothing you type is stored. For a person,{" "}
            <Link href="/service" className="underline">
              write service
            </Link>
            .
          </p>
        </div>
      ) : null}
      <button
        type="button"
        className="border border-ink bg-ink px-4 py-3 text-sm text-paper"
        onClick={() => setOpen((current) => !current)}
      >
        Help choosing
      </button>
    </div>
  );
}
