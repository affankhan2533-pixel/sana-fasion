import type { Metadata } from "next";
import { Suspense } from "react";
import ProductCatalog from "@/components/ProductCatalog";
import { getPublicProducts } from "@/lib/publicApi";

export const metadata: Metadata = {
  title: "Atelier Collections — Sana Fashion",
  description: "Browse our complete catalog of luxury Indian ethnic creations — handcrafted bridal lehengas, festive anarkalis, and designer kurtas. Designed Mobile-First.",
};

export default async function ProductsPage() {
  const products = await getPublicProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF4] flex items-center justify-center font-accent text-xs tracking-widest text-[#c8851a] uppercase animate-pulse">Loading Atelier...</div>}>
      <ProductCatalog initialCategory="All" products={products} />
    </Suspense>
  );
}
