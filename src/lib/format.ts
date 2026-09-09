export function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatHeight(cm: number) {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const rest = Math.round(inches % 12);
  return `${cm}cm / ${feet}'${rest}"`;
}

export function contrastOn(hex: string) {
  const value = hex.replace("#", "");
  const n =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? "#141414" : "#f4f1eb";
}

export function cmFromInches(inches: number) {
  return Math.round(inches * 2.54);
}
