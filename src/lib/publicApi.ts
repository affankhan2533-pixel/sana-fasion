import { generateProductsFromImages, type Product } from '@/data/image_analyzer';

export async function getPublicProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:5000/api/products?limit=200', {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success && data.products?.length > 0) {
      return data.products.map((p: any) => ({
        id: p._id,
        slug: p.slug,
        productCode: p.sku || p.productCode || 'D.NO-999',
        title: p.name,
        collection: p.collection?.name || p.category,
        category: p.category,
        fabric: p.fabric || 'Premium Fabric',
        work: p.workType || 'Handcrafted embroidery',
        color: p.colors?.[0] || 'Ivory',
        tags: p.tags || [],
        thumbnail: p.images?.[0] || '/images/placeholder.png',
        gallery: p.images || [],
        modelImages: p.images || [],
        price: p.price,
        originalPrice: p.originalPrice || p.price * 1.2,
        availability: p.stockStatus !== 'out_of_stock',
        featured: p.featured || false,
        trending: p.trending || false,
        bestSeller: p.bestSeller || false,
        newArrival: p.newArrival || false,
        comingSoon: p.status === 'draft',
        relatedProducts: p.relatedProducts?.map((r: any) => r.slug || r) || [],
        description: p.description,
      }));
    }
  } catch (err) {
    console.warn('Failed to fetch products from MongoDB API, falling back to local files:', err);
  }

  // Fallback to local files
  return generateProductsFromImages();
}

export async function getPublicProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${slug}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success && data.product) {
      const p = data.product;
      return {
        id: p._id,
        slug: p.slug,
        productCode: p.sku || p.productCode || 'D.NO-999',
        title: p.name,
        collection: p.collection?.name || p.category,
        category: p.category,
        fabric: p.fabric || 'Premium Fabric',
        work: p.workType || 'Handcrafted embroidery',
        color: p.colors?.[0] || 'Ivory',
        tags: p.tags || [],
        thumbnail: p.images?.[0] || '/images/placeholder.png',
        gallery: p.images || [],
        modelImages: p.images || [],
        price: p.price,
        originalPrice: p.originalPrice || p.price * 1.2,
        availability: p.stockStatus !== 'out_of_stock',
        featured: p.featured || false,
        trending: p.trending || false,
        bestSeller: p.bestSeller || false,
        newArrival: p.newArrival || false,
        comingSoon: p.status === 'draft',
        relatedProducts: p.relatedProducts?.map((r: any) => r.slug || r) || [],
        description: p.description,
      };
    }
  } catch (err) {
    console.warn(`Failed to fetch product with slug "${slug}" from MongoDB API, falling back:`, err);
  }

  // Fallback
  const list = generateProductsFromImages();
  return list.find((p) => p.slug === slug) || null;
}
