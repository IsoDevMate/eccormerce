import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { CartProvider } from "@/lib/cart-store";
import { Announcement } from "@/components/site/announcement";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { EmailCapture } from "@/components/site/email-capture";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "@/components/site/search-dialog";
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

export const metadata: Metadata = {
  title: {
    default: "Sable — Essentials",
    template: "%s — Sable",
  },
  description:
    "A quieter wardrobe. Cut, color, and fit without the noise. Twenty-six pieces, photographed on people, sized in the open.",
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
        </CartProvider>
      </body>
    </html>
  );
}
