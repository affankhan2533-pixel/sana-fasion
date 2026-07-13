import fs from "fs";
import path from "path";

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
  relatedProducts: string[];
  description: string;
};

interface RawImageFile {
  relativePath: string;
  absolutePath: string;
  name: string;
  folder: string;
}

// Recursive directory scanner
function scanDirectory(dir: string, baseDir: string): RawImageFile[] {
  let results: RawImageFile[] = [];
  if (!fs.existsSync(dir)) return [];
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDirectory(fullPath, baseDir));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        const relativeFolder = path.relative(baseDir, dir).replace(/\\/g, '/');
        results.push({
          relativePath: path.relative(baseDir, fullPath).replace(/\\/g, '/'),
          absolutePath: fullPath,
          name: path.basename(file, ext),
          folder: relativeFolder
        });
      }
    }
  });
  return results;
}

// Group key helper
function getProductGroupKey(name: string): string {
  // Strip parentheses and copy suffixes
  let key = name.replace(/\s*\(\d+\)\s*/g, '');
  key = key.replace(/[-_](gallery|model|lifestyle|editorial|banner)[-_]?\d*/gi, '');
  return key.trim().toLowerCase();
}

export function generateProductsFromImages(): Product[] {
  const publicDir = path.join(process.cwd(), "public");
  const productsDir = path.join(publicDir, "images/products");

  const images = scanDirectory(productsDir, publicDir);

  // Group images by product base name
  const groups: Record<string, RawImageFile[]> = {};
  images.forEach(img => {
    const groupKey = getProductGroupKey(img.name);
    // Ignore folder background files like .gitkeep or layout templates
    if (img.name.startsWith(".")) return;
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(img);
  });

  const productList: Product[] = [];
  let idCounter = 1;

  Object.entries(groups).forEach(([groupKey, imgList]) => {
    // Sort so primary thumbnail (no copy) is first
    imgList.sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      if (aLower.includes("copy") && !bLower.includes("copy")) return 1;
      if (!aLower.includes("copy") && bLower.includes("copy")) return -1;
      return aLower.localeCompare(bLower);
    });

    const primaryImg = imgList[0];
    const imagePath = `/` + primaryImg.relativePath;

    // Hash filename for stable random assignment
    const hash = groupKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const productCode = `D.NO-${100 + (hash % 900)}`;

    // Title resolution (No invented/fake data)
    let title = "";
    const isGeneric = groupKey.startsWith("whatsapp image") || groupKey.startsWith("image copy") || groupKey === "image";
    
    if (isGeneric) {
      // If product name is unknown, display Product Code instead
      title = productCode;
    } else {
      // Clean descriptive filename (e.g. wedding-sharara-1 -> Wedding Sharara)
      title = groupKey
        .replace(/-\d+$/, '') // strip trailing numbers
        .split(/[-_\s]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    // Category
    const folderStr = primaryImg.folder.toLowerCase();
    const nameStr = primaryImg.name.toLowerCase();
    
    let category = "Designer";
    if (folderStr.includes("bridal") || nameStr.includes("bridal") || nameStr.includes("wedding") || nameStr.includes("sharara")) {
      category = "Bridal";
    } else if (folderStr.includes("festive") || nameStr.includes("festive") || nameStr.includes("anarkali")) {
      category = "Festive";
    } else if (folderStr.includes("cotton") || nameStr.includes("cotton")) {
      category = "Cotton";
    } else if (folderStr.includes("premium") || nameStr.includes("premium")) {
      category = "Premium";
    } else if (folderStr.includes("printed") || nameStr.includes("printed")) {
      category = "Printed";
    } else if (folderStr.includes("rayon") || nameStr.includes("rayon")) {
      category = "Rayon";
    } else if (folderStr.includes("lawn") || nameStr.includes("lawn")) {
      category = "Lawn";
    } else if (folderStr.includes("embroidered") || nameStr.includes("embroidered") || nameStr.includes("embroidery")) {
      category = "Embroidery";
    } else if (folderStr.includes("coming-soon") || nameStr.includes("coming-soon")) {
      category = "Coming Soon";
    } else if (folderStr.includes("sale") || nameStr.includes("sale")) {
      category = "Sale";
    } else if (folderStr.includes("new-arrivals") || nameStr.includes("new-arrivals")) {
      category = "New Arrivals";
    }

    // Fabric
    let fabric = "Raw Silk";
    if (nameStr.includes("cotton") || folderStr.includes("cotton")) fabric = "Cotton";
    else if (nameStr.includes("organza")) fabric = "Organza";
    else if (nameStr.includes("chiffon")) fabric = "Chiffon";
    else if (nameStr.includes("velvet")) fabric = "Velvet";
    else if (nameStr.includes("rayon")) fabric = "Rayon";
    else if (nameStr.includes("lawn")) fabric = "Lawn Cotton";
    else if (nameStr.includes("georgette")) fabric = "Georgette";
    else if (nameStr.includes("silk") || nameStr.includes("brocade")) fabric = "Banarasi Silk";

    // Color
    let color = "Crimson Red";
    if (nameStr.includes("ivory") || nameStr.includes("white")) color = "Ivory White";
    else if (nameStr.includes("green") || nameStr.includes("emerald")) color = "Emerald Green";
    else if (nameStr.includes("blue") || nameStr.includes("indigo")) color = "Indigo Blue";
    else if (nameStr.includes("gold") || nameStr.includes("champagne")) color = "Gold";
    else if (nameStr.includes("pink") || nameStr.includes("peach")) color = "Peach Pink";
    else if (nameStr.includes("purple") || nameStr.includes("wine")) color = "Wine Purple";
    else if (nameStr.includes("saffron") || nameStr.includes("yellow")) color = "Mustard Gold";

    // Collection
    const collection = category === "Bridal" ? "Bridal Couture '25" : (category === "Festive" ? "The Festive Edit" : "Daily Luxury");

    // Price
    let price = 24000;
    if (category === "Bridal") price = 65000 + (hash % 20) * 1000;
    else if (category === "Premium") price = 52000 + (hash % 15) * 1000;
    else if (category === "Festive") price = 34000 + (hash % 10) * 1000;
    else if (category === "Cotton" || category === "Lawn" || category === "Rayon" || category === "Printed") {
      price = 12500 + (hash % 8) * 500;
    }

    // Availability
    const availability = category !== "Coming Soon";
    const comingSoon = category === "Coming Soon";

    // Setup Gallery & Model Images
    const galleryPaths = imgList.map(img => `/` + img.relativePath);
    // Find model images inside models directory that match
    const modelPaths = imgList
      .filter(img => img.relativePath.includes("models/") || img.name.includes("model"))
      .map(img => `/` + img.relativePath);

    const tags = [
      category.toLowerCase(),
      fabric.toLowerCase(),
      color.toLowerCase()
    ];

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    productList.push({
      id: idCounter++,
      slug,
      productCode,
      title,
      collection,
      category,
      fabric,
      work: "Handcrafted detailing",
      color,
      tags,
      thumbnail: imagePath,
      gallery: galleryPaths,
      modelImages: modelPaths.length > 0 ? modelPaths : [imagePath],
      price,
      availability,
      featured: hash % 4 === 0,
      trending: hash % 3 === 0,
      bestSeller: hash % 5 === 0,
      newArrival: hash % 4 === 1,
      comingSoon,
      relatedProducts: [],
      description: `Premium ${title} designed for an elegant and effortless ethnic statement. Handcrafted in high-quality ${fabric} fabric.`
    });
  });

  // Set related products
  productList.forEach(p => {
    p.relatedProducts = productList
      .filter(other => other.id !== p.id && other.category === p.category)
      .slice(0, 4)
      .map(other => other.slug);
  });

  return productList;
}
