import type { Metadata } from "next";
import { Suspense } from "react";
import ProductCatalog from "@/components/ProductCatalog";
import { getPublicProducts } from "@/lib/publicApi";

// Collection slug to category mapping
const SLUG_TO_CATEGORY: Record<string, string> = {
  "bridal": "Bridal",
  "festive": "Festive",
  "designer-suits": "Designer Suits",
  "designer": "Designer Suits",
  "cotton": "Cotton",
  "premium": "Premium",
  "new-arrivals": "New Arrivals",
  "best-sellers": "Best Sellers",
  "printed": "Printed",
  "rayon": "Rayon",
  "lawn": "Lawn",
  "embroidery": "Embroidery",
  "office-wear": "Office Wear",
  "party-wear": "Party Wear",
  "casual-wear": "Casual Wear",
  "luxury-wear": "Luxury Wear",
  "trending": "Trending",
  "sale": "Sale",
  "coming-soon": "Coming Soon"
};

interface PageProps {
  params: Promise<{ slug: string }>;
}
  
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = SLUG_TO_CATEGORY[slug.toLowerCase()] || 
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${category} Collection — Sana Fashion`,
    description: `Explore the finest handcrafted ${category} creations at Sana Fashion. Designed Mobile-First for modern ethnic luxury.`,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  
  // Find correct category name
  const category = SLUG_TO_CATEGORY[normalizedSlug] || 
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const products = await getPublicProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF4] flex items-center justify-center font-accent text-xs tracking-widest text-[#c8851a] uppercase animate-pulse">Loading Collection...</div>}>
      <ProductCatalog initialCategory={category} products={products} />
    </Suspense>
  );
}
