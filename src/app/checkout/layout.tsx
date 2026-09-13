import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Place your Sable order. Gift wrap and optional package protection available in the bag.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
