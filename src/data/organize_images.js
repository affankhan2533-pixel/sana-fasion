const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../public/images');
const outputDbPath = path.join(__dirname, './products_db.ts');

// Create directories helper
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Define structure
const folders = [
  'products/bridal', 'products/festive', 'products/designer', 'products/cotton', 
  'products/premium', 'products/printed', 'products/rayon', 'products/lawn', 
  'products/embroidered', 'products/new-arrivals', 'products/sale', 'products/coming-soon',
  'models/bridal', 'models/festive', 'models/designer', 'models/cotton', 
  'models/premium', 'models/editorial', 'models/story', 'models/campaign', 'models/gallery'
];

folders.forEach(f => ensureDir(path.join(srcDir, f)));

// Helper to copy file if exists
const copyFile = (from, to) => {
  try {
    if (fs.existsSync(from)) {
      ensureDir(path.dirname(to));
      fs.copyFileSync(from, to);
      return true;
    }
  } catch (err) {
    console.error(`Error copying ${from} to ${to}:`, err);
  }
  return false;
};

// Define product raw mapping from workspace files
const imageFiles = {
  products: fs.readdirSync(path.join(srcDir, 'products')).filter(f => fs.statSync(path.join(srcDir, 'products', f)).isFile()),
  models: fs.readdirSync(path.join(srcDir, 'models')).filter(f => fs.statSync(path.join(srcDir, 'models', f)).isFile()),
  root: fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isFile())
};

console.log('Detected files:', imageFiles);

// Re-organization map and product details generation
// Let's create a solid list of 20 products mapping to all the requested categories:
// All, New Arrivals, Bridal, Festive, Designer Suits, Cotton, Printed, Rayon, Lawn, Premium, Embroidery, Office Wear, Party Wear, Casual Wear, Luxury Wear, Best Sellers, Trending, Sale, Coming Soon

const productData = [
  {
    id: 1,
    slug: 'royal-crimson-bridal-lehenga',
    productCode: 'SBL-101',
    title: 'Royal Crimson Bridal Lehenga',
    collection: 'Bridal Couture \'25',
    category: 'Bridal',
    fabric: 'Raw Silk',
    work: 'Zardozi & Kundan Embroidery',
    color: 'Crimson Red',
    tags: ['bridal', 'lehenga', 'silk', 'zardozi', 'wedding', 'luxury', 'embroidered'],
    thumbnailSource: 'products/product-001.png',
    gallerySources: ['products/wedding-sharara-1.jpg', 'models/hero_bridal.png', 'models/wedding-collection.jpg'],
    modelImagesSources: ['models/hero_bridal.png', 'models/wedding-collection.jpg'],
    price: 85000,
    originalPrice: 110000,
    availability: true,
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    comingSoon: false,
    folder: 'bridal',
    description: 'An heirloom Bridal Lehenga crafted in pure Raw Silk with intricate Zardozi handwork. Each thread tells a generational story of Indian craftsmanship.'
  },
  {
    id: 2,
    slug: 'ivory-pearl-wedding-sharara',
    productCode: 'SWS-102',
    title: 'Ivory Pearl Wedding Sharara',
    collection: 'Bridal Couture \'25',
    category: 'Bridal',
    fabric: 'Organza',
    work: 'Pearl & Sequin Embroidery',
    color: 'Ivory White',
    tags: ['bridal', 'sharara', 'organza', 'pearl', 'reception', 'luxury', 'embroidered'],
    thumbnailSource: 'products/wedding-sharara-1.jpg',
    gallerySources: ['products/wedding-sharara-1.jpg', 'models/gallery-1.jpg'],
    modelImagesSources: ['models/gallery-1.jpg'],
    price: 62000,
    originalPrice: 78000,
    availability: true,
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'bridal',
    description: 'Flowing Organza Sharara adorned with hand-stitched pearl borders and sequin work, designed for the modern bride who values elegance.'
  },
  {
    id: 3,
    slug: 'emerald-festive-anarkali',
    productCode: 'SFA-201',
    title: 'Emerald Festive Anarkali',
    collection: 'The Festive Edit',
    category: 'Festive',
    fabric: 'Chiffon',
    work: 'Mirror & Thread Embroidery',
    color: 'Emerald Green',
    tags: ['festive', 'anarkali', 'chiffon', 'mirror', 'diwali', 'party wear', 'embroidered'],
    thumbnailSource: 'products/festive-anarkali-1.jpg',
    gallerySources: ['products/festive-anarkali-1.jpg', 'models/festive-collection.jpg'],
    modelImagesSources: ['models/festive-collection.jpg'],
    price: 38000,
    originalPrice: 48000,
    availability: true,
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    comingSoon: false,
    folder: 'festive',
    description: 'A festive Chiffon Anarkali with mirror embellishments and intricate thread work. Perfect for Diwali, Eid and family celebrations.'
  },
  {
    id: 4,
    slug: 'gold-tissue-designer-saree',
    productCode: 'SGS-202',
    title: 'Gold Tissue Designer Saree',
    collection: 'The Festive Edit',
    category: 'Festive',
    fabric: 'Banarasi Silk',
    work: 'Zari Border Embroidery',
    color: 'Gold',
    tags: ['festive', 'saree', 'banarasi', 'gold', 'wedding', 'luxury', 'embroidered'],
    thumbnailSource: 'products/product-001.png',
    gallerySources: ['models/festive-collection.jpg'],
    modelImagesSources: ['models/festive-collection.jpg'],
    price: 28500,
    originalPrice: 35000,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'festive',
    description: 'Woven Banarasi Tissue Saree with a broad Zari border and pallu. A celebration of Indias heritage textile tradition.'
  },
  {
    id: 5,
    slug: 'midnight-blue-power-suit',
    productCode: 'SPS-301',
    title: 'Midnight Blue Power Suit',
    collection: 'Atelier Power Suits',
    category: 'Designer Suits',
    fabric: 'Raw Silk',
    work: 'Mandarin Collar & Premium Cut',
    color: 'Midnight Blue',
    tags: ['suits', 'power-suit', 'silk', 'contemporary', 'office wear', 'modern'],
    thumbnailSource: 'products/power-suit-1.jpg',
    gallerySources: ['products/power-suit-1.jpg', 'models/hero_editorial.png'],
    modelImagesSources: ['models/hero_editorial.png'],
    price: 22000,
    originalPrice: 28000,
    availability: true,
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'designer',
    description: 'A contemporary power suit in Midnight Blue Raw Silk with a refined Mandarin collar. For the modern woman who commands every room.'
  },
  {
    id: 6,
    slug: 'classic-silk-heritage-kurta',
    productCode: 'SHK-302',
    title: 'Classic Silk Heritage Kurta',
    collection: 'Atelier Power Suits',
    category: 'Designer Suits',
    fabric: 'Raw Silk',
    work: 'V-Neck with Piping',
    color: 'Ivory White',
    tags: ['suits', 'kurta', 'silk', 'heritage', 'casual wear', 'office wear'],
    thumbnailSource: 'products/product-002.png',
    gallerySources: ['products/product-002.png'],
    modelImagesSources: [],
    price: 18500,
    originalPrice: 24000,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'designer',
    description: 'Heritage Silk Kurta in warm Ivory with fine cotton piping and palazzo trousers. Perfect for festive daywear and casual gatherings.'
  },
  {
    id: 7,
    slug: 'champagne-sequin-party-gown',
    productCode: 'SPG-401',
    title: 'Champagne Sequin Party Gown',
    collection: 'The Festive Edit',
    category: 'New Arrivals',
    fabric: 'Organza',
    work: 'Off-Shoulder Ruffle & Sequin',
    color: 'Champagne Gold',
    tags: ['gown', 'sequin', 'organza', 'reception', 'new arrivals', 'party wear'],
    thumbnailSource: 'products/party-gown-1.jpg',
    gallerySources: ['products/party-gown-1.jpg'],
    modelImagesSources: [],
    price: 31000,
    originalPrice: 39000,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    comingSoon: false,
    folder: 'new-arrivals',
    description: 'An opulent Champagne Sequin Gown in sheer Organza with an off-shoulder ruffle silhouette. Designed for Receptions and evening soirees.'
  },
  {
    id: 8,
    slug: 'rose-gold-bridal-gown',
    productCode: 'SBG-402',
    title: 'Rose Gold Bridal Gown',
    collection: 'Bridal Couture \'25',
    category: 'New Arrivals',
    fabric: 'Velvet',
    work: 'Sweetheart Neck & Crystal Trim',
    color: 'Rose Gold',
    tags: ['bridal', 'gown', 'velvet', 'custom', 'new arrivals', 'luxury', 'embroidered'],
    thumbnailSource: 'products/product-003.png',
    gallerySources: ['products/product-003.png'],
    modelImagesSources: [],
    price: 92000,
    originalPrice: 120000,
    availability: true,
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    comingSoon: false,
    folder: 'new-arrivals',
    description: 'A custom Rose Gold Velvet Bridal Gown with a sweetheart neckline and hand-embroidered Swarovski crystal trim.'
  },
  {
    id: 9,
    slug: 'pastel-organza-lehenga-suit',
    productCode: 'SOL-501',
    title: 'Pastel Organza Lehenga Suit',
    collection: 'Atelier Power Suits',
    category: 'Designer Suits',
    fabric: 'Organza',
    work: 'Handmade Gota Patti Embroidery',
    color: 'Mint Green',
    tags: ['suits', 'organza', 'gota patti', 'pastel', 'casual wear', 'embroidered'],
    thumbnailSource: 'products/image copy 2.png',
    gallerySources: ['products/image copy 2.png', 'products/image copy 3.png'],
    modelImagesSources: ['products/image copy 3.png'],
    price: 26000,
    originalPrice: 32000,
    availability: true,
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'designer',
    description: 'Ethereal Mint Green Organza Suit with a structured lehenga skirt, featuring delicate gota patti borders.'
  },
  {
    id: 10,
    slug: 'heritage-cotton-anarkali',
    productCode: 'SCA-601',
    title: 'Heritage Cotton Anarkali',
    collection: 'Daily Luxury',
    category: 'Cotton',
    fabric: 'Cotton',
    work: 'Block Print & Lace',
    color: 'Peach Pink',
    tags: ['cotton', 'anarkali', 'printed', 'casual wear', 'daywear'],
    thumbnailSource: 'products/image copy 4.png',
    gallerySources: ['products/image copy 4.png', 'products/image copy 5.png'],
    modelImagesSources: [],
    price: 14500,
    originalPrice: 18000,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'cotton',
    description: 'Breathable long Cotton Anarkali with handmade block prints and cotton lace trims, styled for absolute comfort.'
  },
  {
    id: 11,
    slug: 'indigo-printed-cotton-suit',
    productCode: 'SCS-602',
    title: 'Indigo Printed Cotton Suit',
    collection: 'Daily Luxury',
    category: 'Cotton',
    fabric: 'Cotton',
    work: 'Dabu Block Printing',
    color: 'Indigo Blue',
    tags: ['cotton', 'printed', 'indigo', 'casual wear', 'daywear'],
    thumbnailSource: 'products/image copy 6.png',
    gallerySources: ['products/image copy 6.png'],
    modelImagesSources: [],
    price: 12800,
    originalPrice: 16000,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: true,
    newArrival: false,
    comingSoon: false,
    folder: 'printed',
    description: 'Heritage Dabu printed suit set in deep Indigo blue cotton fabric, complete with a lightweight mulmul dupatta.'
  },
  {
    id: 12,
    slug: 'royal-rayon-floral-printed-suit',
    productCode: 'SRS-701',
    title: 'Rayon Floral Printed Suit',
    collection: 'Daily Luxury',
    category: 'Rayon',
    fabric: 'Rayon',
    work: 'Gold Foil Print',
    color: 'Mustard Gold',
    tags: ['rayon', 'printed', 'foil print', 'casual wear', 'party wear'],
    thumbnailSource: 'products/image copy 7.png',
    gallerySources: ['products/image copy 7.png', 'products/image copy 8.png'],
    modelImagesSources: [],
    price: 15500,
    originalPrice: 19500,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'rayon',
    description: 'Luxuriously soft Rayon fabric printed with hand-drawn floral motifs and detailed gold foil outlines.'
  },
  {
    id: 13,
    slug: 'designer-lawn-cotton-kurta-set',
    productCode: 'SLK-801',
    title: 'Designer Lawn Cotton Kurta Set',
    collection: 'Daily Luxury',
    category: 'Lawn',
    fabric: 'Lawn Cotton',
    work: 'Chikankari Shadow Work',
    color: 'Sky Blue',
    tags: ['lawn', 'chikankari', 'cotton', 'casual wear', 'daywear', 'embroidered'],
    thumbnailSource: 'products/image copy 9.png',
    gallerySources: ['products/image copy 9.png', 'products/image copy 10.png'],
    modelImagesSources: [],
    price: 16900,
    originalPrice: 21000,
    availability: true,
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'lawn',
    description: 'Finest Lawn Cotton Kurta set featuring intricate Chikankari shadow handwork, ideal for hot summer days.'
  },
  {
    id: 14,
    slug: 'monarch-velvet-embroidered-suit',
    productCode: 'SVS-901',
    title: 'Monarch Velvet Embroidered Suit',
    collection: 'The Festive Edit',
    category: 'Premium',
    fabric: 'Velvet',
    work: 'Aari Hand Embroidery',
    color: 'Wine Purple',
    tags: ['premium', 'velvet', 'aari', 'luxury', 'party wear', 'embroidered'],
    thumbnailSource: 'products/image copy 11.png',
    gallerySources: ['products/image copy 11.png', 'products/image copy 12.png'],
    modelImagesSources: ['products/image copy 12.png'],
    price: 54000,
    originalPrice: 68000,
    availability: true,
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'embroidered',
    description: 'Rich Wine-colored Velvet suit detailed with gold Aari needlework across borders. Features a matching silk trouser.'
  },
  {
    id: 15,
    slug: 'banarasi-gold-brocade-sherwani-set',
    productCode: 'SBS-902',
    title: 'Banarasi Brocade Sherwani Set',
    collection: 'Bridal Couture \'25',
    category: 'Premium',
    fabric: 'Banarasi Silk',
    work: 'Brocade & Zari Weaving',
    color: 'Champagne Gold',
    tags: ['premium', 'brocade', 'zari', 'luxury', 'bridal', 'wedding'],
    thumbnailSource: 'products/image copy 13.png',
    gallerySources: ['products/image copy 13.png', 'products/image copy 14.png'],
    modelImagesSources: [],
    price: 79000,
    originalPrice: 95000,
    availability: true,
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'premium',
    description: 'Premium Banarasi Brocade Sherwani woven with high-grade gold Zari threads. Crafted for grooms and groomsmen.'
  },
  {
    id: 16,
    slug: 'artisan-handloom-chikankari-lehenga',
    productCode: 'SCL-903',
    title: 'Handloom Chikankari Lehenga',
    collection: 'Bridal Couture \'25',
    category: 'Premium',
    fabric: 'Georgette',
    work: 'Heavy Chikankari & Mukaish Work',
    color: 'Lemon Yellow',
    tags: ['premium', 'chikankari', 'mukaish', 'lehenga', 'luxury', 'wedding', 'embroidered'],
    thumbnailSource: 'products/image copy 15.png',
    gallerySources: ['products/image copy 15.png', 'products/image copy 16.png'],
    modelImagesSources: ['products/image copy 16.png'],
    price: 98000,
    originalPrice: 125000,
    availability: true,
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    comingSoon: false,
    folder: 'premium',
    description: 'A masterpiece handloom Georgette Lehenga adorned with heavy Chikankari floral motifs and sparkling Mukaish metallic dots.'
  },
  {
    id: 17,
    slug: 'sana-signature-coming-soon-suit',
    productCode: 'SCS-999',
    title: 'Signature Coming Soon Suit',
    collection: 'Atelier Power Suits',
    category: 'Coming Soon',
    fabric: 'Cotton Silk',
    work: 'Zardozi Buttons & Fine Stitching',
    color: 'Ivory Gold',
    tags: ['suits', 'coming soon', 'silk', 'exquisite'],
    thumbnailSource: 'products/image copy 17.png',
    gallerySources: ['products/image copy 17.png'],
    modelImagesSources: [],
    price: 24000,
    originalPrice: 30000,
    availability: false,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: true,
    folder: 'coming-soon',
    description: 'A preview of our upcoming Signature Suit in Cotton Silk, featuring customized Zardozi buttons. Register for early access.'
  },
  {
    id: 18,
    slug: 'festive-kalamkari-cotton-anarkali',
    productCode: 'SKA-603',
    title: 'Festive Kalamkari Cotton Anarkali',
    collection: 'The Festive Edit',
    category: 'Cotton',
    fabric: 'Cotton',
    work: 'Kalamkari Handprint & Gota Borders',
    color: 'Teal Green',
    tags: ['cotton', 'festive', 'printed', 'anarkali', 'casual wear', 'party wear'],
    thumbnailSource: 'products/image copy 18.png',
    gallerySources: ['products/image copy 18.png', 'products/image copy 19.png'],
    modelImagesSources: [],
    price: 16500,
    originalPrice: 22000,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'cotton',
    description: 'Beautiful hand-drawn Kalamkari prints on premium cotton fabric, elevated with shiny gota patti borders for evening festivities.'
  },
  {
    id: 19,
    slug: 'embroidered-lawn-floral-kurti',
    productCode: 'SEL-802',
    title: 'Embroidered Lawn Floral Kurti',
    collection: 'Daily Luxury',
    category: 'Lawn',
    fabric: 'Lawn Cotton',
    work: 'Threadwork Embroidery',
    color: 'Baby Pink',
    tags: ['lawn', 'cotton', 'embroidered', 'casual wear', 'daywear'],
    thumbnailSource: 'products/image copy 20.png',
    gallerySources: ['products/image copy 20.png', 'products/image copy 21.png'],
    modelImagesSources: [],
    price: 13500,
    originalPrice: 17000,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'lawn',
    description: 'Charming Lawn Cotton Kurti featuring soft floral thread embroidery on the neckline, cuffs, and hem.'
  },
  {
    id: 20,
    slug: 'indigo-dabu-printed-rayon-suit',
    productCode: 'SDR-702',
    title: 'Dabu Printed Rayon Suit',
    collection: 'Daily Luxury',
    category: 'Rayon',
    fabric: 'Rayon',
    work: 'Dabu Print & Lace Work',
    color: 'Indigo Blue',
    tags: ['rayon', 'printed', 'indigo', 'casual wear', 'daywear'],
    thumbnailSource: 'products/image.png',
    gallerySources: ['products/image.png', 'products/image copy.png'],
    modelImagesSources: [],
    price: 14000,
    originalPrice: 18000,
    availability: true,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    comingSoon: false,
    folder: 'rayon',
    description: 'Flowy Rayon fabric featuring authentic Dabu printing in indigo dye. Highlighted with soft cotton laces.'
  }
];

// Perform copy & move
productData.forEach(p => {
  // Move thumbnail
  const thumbExt = path.extname(p.thumbnailSource);
  const thumbBase = path.basename(p.thumbnailSource);
  const newThumbPath = `products/${p.folder}/${p.slug}${thumbExt}`;
  
  const fromThumb = path.join(srcDir, p.thumbnailSource);
  const toThumb = path.join(srcDir, newThumbPath);
  
  if (copyFile(fromThumb, toThumb)) {
    p.thumbnail = `/images/${newThumbPath}`;
  } else {
    // fallback if file doesn't exist
    p.thumbnail = `/images/${p.thumbnailSource}`;
  }

  // Move gallery images
  p.gallery = p.gallerySources.map((g, idx) => {
    const ext = path.extname(g);
    const newGPath = `models/${p.folder}/${p.slug}-gallery-${idx}${ext}`;
    const fromG = path.join(srcDir, g);
    const toG = path.join(srcDir, newGPath);
    if (copyFile(fromG, toG)) {
      return `/images/${newGPath}`;
    }
    return `/images/${g}`;
  });

  // Move model images
  p.modelImages = p.modelImagesSources.map((m, idx) => {
    const ext = path.extname(m);
    const newMPath = `models/${p.folder}/${p.slug}-model-${idx}${ext}`;
    const fromM = path.join(srcDir, m);
    const toM = path.join(srcDir, newMPath);
    if (copyFile(fromM, toM)) {
      return `/images/${newMPath}`;
    }
    return `/images/${m}`;
  });

  // Generate related products dynamically
  p.relatedProducts = [];
});

// Populate related products based on category, fabric, or collection
productData.forEach(p => {
  const related = productData.filter(other => {
    if (other.id === p.id) return false;
    return other.category === p.category || other.fabric === p.fabric || other.collection === p.collection;
  });
  // take top 4
  p.relatedProducts = related.slice(0, 4).map(other => other.slug);
});

// Copy all images in Root public/images/ to models/gallery
const rootFiles = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isFile());
rootFiles.forEach(f => {
  const ext = path.extname(f);
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    const from = path.join(srcDir, f);
    const to = path.join(srcDir, 'models/gallery', f);
    copyFile(from, to);
  }
});

// Output Database
const dbContent = `// ============================================================
// SANA FASHION — REDESIGNED PRODUCT CATALOG MASTER DATABASE
// ============================================================
// This file is automatically generated by organize_images.js.

export type Product = {
  id: number;
  slug: string;
  productCode: string;
  title: string;
  collection: string;
  category: string;
  fabric: string;
  work: string;
  color: string;
  tags: string[];
  thumbnail: string;
  gallery: string[];
  modelImages: string[];
  price: number;
  originalPrice?: number;
  availability: boolean;
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  comingSoon: boolean;
  relatedProducts: string[]; // Slugs of related products
  description: string;
};

export const products: Product[] = ${JSON.stringify(productData, null, 2)};
`;

fs.writeFileSync(outputDbPath, dbContent);
console.log('Database and structure organized successfully!');
