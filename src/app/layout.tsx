import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { CartProvider } from "@/lib/cart-store";
import { WishlistProvider } from "@/lib/wishlist-store";
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
    default: "Sable — Index",
    template: "%s — Sable",
  },
  description:
    "Sable index. Twenty-six pieces as codes. Shop the grid when you want names, sizes, and prices.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Sable",
    title: "Sable — Index",
    description:
      "Quiet product index first. Shop and fit details one click away.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sable — Index",
    description:
      "Quiet product index first. Shop and fit details one click away.",
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
          <WishlistProvider>
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
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
