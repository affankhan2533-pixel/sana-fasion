// ============================================================
// SANA FASHION — PRODUCT CATALOG DATA
// ============================================================
// Add new products here. The Product Library page automatically
// reads from this array. No other file needs to be touched.
//
// IMAGE SYSTEM — TWO FOLDERS ONLY:
//
//   /images/products/<filename>
//     → Product shots: flat-lay, folded, fabric, catalogues
//       (focus = THE PRODUCT itself, no person)
//
//   /images/models/<filename>
//     → Lifestyle / editorial / campaign / lookbook
//       (focus = A PERSON wearing the outfit)
//
// NAMING CONVENTION:
//   products: product-001.jpg, product-002.jpg …
//   models:   model-001.jpg, model-002.jpg … (or keep original filenames)
// ============================================================


export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  fabric: string;
  neckWork: string;
  color: string;
  colors: ProductColor[];
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  description: string;
  tags: string[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  onSale: boolean;
  available: boolean;
  occasion: string;
};

export const products: Product[] = [
  // ── BRIDAL ──────────────────────────────────────────────
  {
    id: 1,
    slug: "royal-crimson-bridal-lehenga",
    name: "Royal Crimson Bridal Lehenga",
    code: "SBL-001",
    category: "bridal",
    subcategory: "lehenga",
    fabric: "Raw Silk",
    neckWork: "Zardozi & Kundan",
    color: "Crimson Red",
    colors: [
      { name: "Crimson Red", hex: "#9B1A2E" },
      { name: "Ivory Gold", hex: "#D4A96A" },
    ],
    price: 85000,
    originalPrice: 110000,
    image: "/images/models/hero_bridal.png",
    gallery: ["/images/models/hero_bridal.png", "/images/models/wedding-collection.jpg"],
    description: "An heirloom Bridal Lehenga crafted in pure Raw Silk with intricate Zardozi handwork. Each thread tells a generational story of Indian craftsmanship.",
    tags: ["bridal", "lehenga", "silk", "zardozi", "wedding", "2025"],
    featured: true,
    newArrival: false,
    bestSeller: true,
    onSale: false,
    available: true,
    occasion: "Wedding",
  },
  {
    id: 2,
    slug: "ivory-pearl-wedding-sharara",
    name: "Ivory Pearl Wedding Sharara",
    code: "SWS-002",
    category: "bridal",
    subcategory: "sharara",
    fabric: "Organza",
    neckWork: "Pearl & Sequin",
    color: "Ivory White",
    colors: [
      { name: "Ivory White", hex: "#FFF8F0" },
      { name: "Champagne", hex: "#E6C280" },
    ],
    price: 62000,
    originalPrice: 78000,
    image: "/images/products/wedding-sharara-1.jpg",
    gallery: ["/images/products/wedding-sharara-1.jpg"],
    description: "Flowing Organza Sharara adorned with hand-stitched pearl borders and sequin work, designed for the modern bride who values elegance.",
    tags: ["bridal", "sharara", "organza", "pearl", "reception"],
    featured: true,
    newArrival: false,
    bestSeller: false,
    onSale: false,
    available: true,
    occasion: "Reception",
  },
  {
    id: 3,
    slug: "royal-purple-banarasi-lehenga",
    name: "Royal Purple Banarasi Lehenga",
    code: "SBL-003",
    category: "bridal",
    subcategory: "lehenga",
    fabric: "Banarasi Silk",
    neckWork: "Resham & Zari",
    color: "Royal Purple",
    colors: [{ name: "Royal Purple", hex: "#4B0082" }],
    price: 74000,
    originalPrice: 92000,
    image: "/images/models/hero_editorial.png",
    gallery: ["/images/models/hero_editorial.png"],
    description: "Heritage Banarasi Silk woven with real Zari thread. A timeless purple lehenga for sangeet and wedding ceremonies.",
    tags: ["bridal", "lehenga", "banarasi", "silk", "sangeet"],
    featured: false,
    newArrival: false,
    bestSeller: true,
    onSale: false,
    available: true,
    occasion: "Sangeet",
  },

  // ── FESTIVE ─────────────────────────────────────────────
  {
    id: 4,
    slug: "emerald-festive-anarkali",
    name: "Emerald Festive Anarkali",
    code: "SFA-004",
    category: "festive",
    subcategory: "anarkali",
    fabric: "Chiffon",
    neckWork: "Mirror & Thread Work",
    color: "Emerald Green",
    colors: [
      { name: "Emerald Green", hex: "#2E8B57" },
      { name: "Midnight Blue", hex: "#191970" },
    ],
    price: 38000,
    originalPrice: 48000,
    image: "/images/products/festive-anarkali-1.jpg",
    gallery: ["/images/products/festive-anarkali-1.jpg"],
    description: "A festive Chiffon Anarkali with mirror embellishments and intricate thread work. Perfect for Diwali, Eid and family celebrations.",
    tags: ["festive", "anarkali", "chiffon", "mirror", "diwali", "eid"],
    featured: false,
    newArrival: false,
    bestSeller: true,
    onSale: false,
    available: true,
    occasion: "Festive",
  },
  {
    id: 5,
    slug: "gold-tissue-designer-saree",
    name: "Gold Tissue Designer Saree",
    code: "SGS-005",
    category: "festive",
    subcategory: "saree",
    fabric: "Banarasi Silk",
    neckWork: "Zari Border",
    color: "Gold",
    colors: [{ name: "Gold", hex: "#D4AF37" }],
    price: 28500,
    originalPrice: 35000,
    image: "/images/models/festive-collection.jpg",
    gallery: ["/images/models/festive-collection.jpg"],
    description: "Woven Banarasi Tissue Saree with a broad Zari border and pallu. A celebration of India's heritage textile tradition.",
    tags: ["festive", "saree", "banarasi", "gold", "wedding"],
    featured: false,
    newArrival: false,
    bestSeller: false,
    onSale: false,
    available: true,
    occasion: "Festive",
  },
  {
    id: 6,
    slug: "vibrant-saffron-anarkali",
    name: "Vibrant Saffron Anarkali",
    code: "SVA-006",
    category: "festive",
    subcategory: "anarkali",
    fabric: "Chiffon",
    neckWork: "Gota Patti",
    color: "Saffron",
    colors: [{ name: "Saffron", hex: "#FF6700" }],
    price: 42000,
    originalPrice: 52000,
    image: "/images/products/product-001.png",
    gallery: ["/images/products/product-001.png"],
    description: "A vibrant Saffron Anarkali with Gota Patti borders. Designed for Navratri, Sangeet and festive evening events.",
    tags: ["festive", "anarkali", "gota", "navratri"],
    featured: false,
    newArrival: true,
    bestSeller: false,
    onSale: false,
    available: true,
    occasion: "Festive",
  },

  // ── DESIGNER SUITS ──────────────────────────────────────
  {
    id: 7,
    slug: "midnight-blue-power-suit",
    name: "Midnight Blue Power Suit",
    code: "SPS-007",
    category: "suits",
    subcategory: "power-suit",
    fabric: "Raw Silk",
    neckWork: "Mandarin Collar",
    color: "Midnight Blue",
    colors: [
      { name: "Midnight Blue", hex: "#191970" },
      { name: "Emerald", hex: "#2E8B57" },
    ],
    price: 22000,
    originalPrice: 28000,
    image: "/images/products/power-suit-1.jpg",
    gallery: ["/images/products/power-suit-1.jpg"],
    description: "A contemporary power suit in Midnight Blue Raw Silk with a refined Mandarin collar. For the modern woman who commands every room.",
    tags: ["suits", "power-suit", "silk", "contemporary", "modern"],
    featured: false,
    newArrival: false,
    bestSeller: false,
    onSale: false,
    available: true,
    occasion: "Office & Formal",
  },
  {
    id: 8,
    slug: "classic-silk-heritage-kurta",
    name: "Classic Silk Heritage Kurta",
    code: "SHK-008",
    category: "suits",
    subcategory: "kurta-set",
    fabric: "Raw Silk",
    neckWork: "V-Neck with Piping",
    color: "Ivory White",
    colors: [{ name: "Ivory White", hex: "#FFF8F0" }],
    price: 18500,
    originalPrice: 24000,
    image: "/images/products/product-002.png",
    gallery: ["/images/products/product-002.png"],
    description: "Heritage Silk Kurta in warm Ivory with fine cotton piping and palazzo trousers. Perfect for festive daywear and casual gatherings.",
    tags: ["suits", "kurta", "silk", "heritage", "casual"],
    featured: false,
    newArrival: false,
    bestSeller: false,
    onSale: false,
    available: true,
    occasion: "Casual / Mehendi",
  },

  // ── NEW ARRIVALS ─────────────────────────────────────────
  {
    id: 9,
    slug: "champagne-sequin-party-gown",
    name: "Champagne Sequin Party Gown",
    code: "SPG-009",
    category: "new-arrivals",
    subcategory: "gown",
    fabric: "Organza",
    neckWork: "Off-Shoulder Ruffle",
    color: "Champagne Gold",
    colors: [{ name: "Champagne Gold", hex: "#E6C280" }],
    price: 31000,
    originalPrice: 39000,
    image: "/images/products/party-gown-1.jpg",
    gallery: ["/images/products/party-gown-1.jpg"],
    description: "An opulent Champagne Sequin Gown in sheer Organza with an off-shoulder ruffle silhouette. Designed for Receptions and evening soirees.",
    tags: ["gown", "sequin", "organza", "reception", "new"],
    featured: false,
    newArrival: true,
    bestSeller: false,
    onSale: false,
    available: true,
    occasion: "Reception",
  },
  {
    id: 10,
    slug: "rose-gold-bridal-gown",
    name: "Rose Gold Bridal Gown",
    code: "SBG-010",
    category: "new-arrivals",
    subcategory: "gown",
    fabric: "Velvet",
    neckWork: "Sweetheart Neck",
    color: "Rose Gold",
    colors: [{ name: "Rose Gold", hex: "#B76E79" }],
    price: 92000,
    originalPrice: 120000,
    image: "/images/products/product-003.png",
    gallery: ["/images/products/product-003.png"],
    description: "A custom Rose Gold Velvet Bridal Gown with a sweetheart neckline and hand-embroidered Swarovski crystal trim.",
    tags: ["bridal", "gown", "velvet", "custom", "new"],
    featured: true,
    newArrival: true,
    bestSeller: false,
    onSale: false,
    available: true,
    occasion: "Wedding / Reception",
  },
  {
    id: 11,
    slug: "artisan-craft-lehenga",
    name: "Artisan Craft Lehenga",
    code: "SAL-011",
    category: "featured",
    subcategory: "lehenga",
    fabric: "Raw Silk",
    neckWork: "Kantha & Phulkari",
    color: "Crimson Red",
    colors: [{ name: "Crimson Red", hex: "#9B1A2E" }],
    price: 56000,
    originalPrice: 70000,
    image: "/images/models/brand-story.jpg",
    gallery: ["/images/models/brand-story.jpg"],
    description: "An artisanal Lehenga featuring Kantha hand-stitch panels blended with heritage Phulkari motifs. A collector's piece.",
    tags: ["lehenga", "kantha", "phulkari", "artisan", "heritage"],
    featured: true,
    newArrival: false,
    bestSeller: false,
    onSale: false,
    available: true,
    occasion: "Wedding",
  },
];

// ── Helper utilities ─────────────────────────────────────
export const getAllCategories = (): string[] => {
  const cats = products.map((p) => p.category);
  return ["all", ...Array.from(new Set(cats))];
};

export const getAllFabrics = (): string[] => {
  const fabrics = products.map((p) => p.fabric);
  return ["all", ...Array.from(new Set(fabrics))];
};

export const getAllColors = (): string[] => {
  const colors = products.map((p) => p.color);
  return ["all", ...Array.from(new Set(colors))];
};

export const getAllOccasions = (): string[] => {
  const occasions = products.map((p) => p.occasion);
  return ["all", ...Array.from(new Set(occasions))];
};

export const getFeaturedProducts = (): Product[] =>
  products.filter((p) => p.featured && p.available);

export const getNewArrivals = (): Product[] =>
  products.filter((p) => p.newArrival && p.available);

export const getBestSellers = (): Product[] =>
  products.filter((p) => p.bestSeller && p.available);

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (category: string): Product[] =>
  category === "all"
    ? products.filter((p) => p.available)
    : products.filter((p) => p.category === category && p.available);

export const formatPrice = (price: number): string =>
  `\u20B9${price.toLocaleString("en-IN")}`;
