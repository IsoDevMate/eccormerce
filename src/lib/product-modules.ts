import type { FaqItem, HowToStep, Product } from "@/types/product";

export function productChips(product: Product) {
  return product.chips ?? product.highlights.slice(0, 4);
}

export function productHowTo(product: Product): HowToStep[] {
  if (product.howTo?.length) return product.howTo;
  return [
    {
      title: "How it sits",
      body: `${product.model.name} is ${product.model.heightCm}cm and wears ${product.model.size}. ${product.fit} fit — start there unless the guide says otherwise.`,
    },
    {
      title: "How to wear it",
      body: `Pair ${product.name} with the rest of the ${product.line} line. Studio shots show cut; worn shots show drape.`,
    },
    {
      title: "Care",
      body: product.care,
    },
  ];
}

export function productFaq(product: Product): FaqItem[] {
  if (product.faq?.length) return product.faq;
  return [
    {
      q: "Will this fit me?",
      a: `Open the size guide. Compare a brand you already wear, then add from the chart. ${product.model.name} wears ${product.model.size}.`,
    },
    {
      q: "When does it ship?",
      a: `${product.shippingDays.min}–${product.shippingDays.max} business days from the studio. Mill pieces take longer — we show that on the garment, not after checkout.`,
    },
    {
      q: "Can I return it?",
      a: "30 days, prepaid label. Fit is the usual reason people send things back, which is why the guide sits on this page.",
    },
    {
      q: `What is ${product.line}?`,
      a: `${product.line} is one of five house lines. Every line is on the homepage so you can enter by cut, not by campaign.`,
    },
  ];
}

export function productUgc(product: Product) {
  const fromVariants = product.variants.flatMap((variant) =>
    variant.images.filter((image) => image.kind === "ugc"),
  );
  if (fromVariants.length) return fromVariants;
  return product.variants.flatMap((variant) =>
    variant.images.filter((image) => image.kind === "model"),
  );
}
