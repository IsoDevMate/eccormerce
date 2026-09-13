import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { CartProvider } from "@/lib/cart-store";
import { Announcement } from "@/components/site/announcement";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { EmailCapture } from "@/components/site/email-capture";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "@/components/site/search-dialog";
import { ShopAssistant } from "@/components/site/shop-assistant";
import { CookieBanner } from "@/components/site/cookie-banner";
import { ConsentAnalytics } from "@/components/site/consent-analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://eccormerce-alpha.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sable — Shop",
    template: "%s — Sable",
  },
  description:
    "Shop Sable. Twenty-six pieces photographed on people, sized in the open. Enter the grid — Women and Men as one-click filters.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Sable",
    title: "Sable — Shop",
    description:
      "Twenty-six pieces. Model shots first. Fit and shipping on the product — not after checkout.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sable — Shop",
    description:
      "Twenty-six pieces. Model shots first. Fit and shipping on the product.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} antialiased`}
      >
        <CartProvider>
          <Announcement />
          <Header />
          <main>{children}</main>
          <Footer />
          <EmailCapture />
          <CartDrawer />
          <SearchDialog />
          <ShopAssistant />
          <CookieBanner />
          <ConsentAnalytics />
        </CartProvider>
      </body>
    </html>
  );
}
