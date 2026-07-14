import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";
import ScrollProgress from "@/components/ScrollProgress";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sanafashion.in"),
  title: {
    default: "Sana Fashion — Luxury Ethnic Wear & Bridal Collections",
    template: "%s — Sana Fashion",
  },
  description: "Sana Fashion is a premium luxury fashion house specialising in bridal lehengas, festive anarkalis, and designer suits crafted with generational artistry. Est. 2015.",
  keywords: ["luxury ethnic wear", "bridal lehenga", "designer suits", "festive wear", "Indian fashion", "Sana Fashion"],
  openGraph: {
    title: "Sana Fashion — Luxury Ethnic Wear",
    description: "Premium bridal and festive fashion with generational craftsmanship.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <LenisProvider>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
