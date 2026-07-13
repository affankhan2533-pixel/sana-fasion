import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { generateProductsFromImages } from "@/data/image_analyzer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = generateProductsFromImages();
  const product = products.find((p) => p.slug === slug);

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
  const products = generateProductsFromImages();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF4] flex items-center justify-center font-accent text-xs tracking-widest text-[#c8851a] uppercase animate-pulse">Loading Creation...</div>}>
      <ProductDetails product={product} products={products} />
    </Suspense>
  );
}
