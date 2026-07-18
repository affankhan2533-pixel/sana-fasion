import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { getPublicProduct, getPublicProducts } from "@/lib/publicApi";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found — Sana Fashion",
    };
  }

  return {
    title: `${product.title} — Sana Fashion`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) {
    notFound();
  }

  const products = await getPublicProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF4] flex items-center justify-center font-accent text-xs tracking-widest text-[#c8851a] uppercase animate-pulse">Loading Creation...</div>}>
      <ProductDetails product={product} products={products} />
    </Suspense>
  );
}
