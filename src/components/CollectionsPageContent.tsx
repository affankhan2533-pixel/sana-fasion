"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, SlidersHorizontal, ChevronDown, X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LuxuryButton from "@/components/LuxuryButton";

const categories = ["All", "Wedding Collection", "Festive Collection", "Designer Suits", "New Arrivals"];
const occasions = ["All", "Bridal", "Reception", "Mehendi", "Sangeet", "Festive"];
const colors = ["All", "Crimson Red", "Ivory White", "Emerald Green", "Midnight Blue", "Gold", "Royal Purple"];
const fabrics = ["All", "Raw Silk", "Organza", "Chiffon", "Banarasi Silk", "Velvet"];
const prices = ["All", "Under ₹30,000", "₹30,000 - ₹60,000", "Over ₹60,000"];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low"];

const allProducts = [
  { id: 1, name: "Royal Crimson Bridal Lehenga", price: 85000, original: 110000, image: "/images/models/hero_bridal.png", category: "Wedding Collection", rating: 5, reviews: 42, badge: "Best Seller", occasion: "Bridal", color: "Crimson Red", fabric: "Raw Silk" },
  { id: 2, name: "Ivory Pearl Wedding Sharara", price: 62000, original: 78000, image: "/images/products/wedding-sharara-1.jpg", category: "Wedding Collection", rating: 4.9, reviews: 28, badge: "Bridal", occasion: "Reception", color: "Ivory White", fabric: "Organza" },
  { id: 3, name: "Emerald Festive Anarkali", price: 38000, original: 48000, image: "/images/products/festive-anarkali-1.jpg", category: "Festive Collection", rating: 4.8, reviews: 67, badge: "Top Rated", occasion: "Festive", color: "Emerald Green", fabric: "Chiffon" },
  { id: 4, name: "Gold Tissue Designer Saree", price: 28500, original: 35000, image: "/images/models/festive-collection.jpg", category: "Festive Collection", rating: 4.7, reviews: 89, badge: "", occasion: "Festive", color: "Gold", fabric: "Banarasi Silk" },
  { id: 5, name: "Midnight Blue Power Suit", price: 22000, original: 28000, image: "/images/products/power-suit-1.jpg", category: "Designer Suits", rating: 4.9, reviews: 34, badge: "Trending", occasion: "Mehendi", color: "Midnight Blue", fabric: "Raw Silk" },
  { id: 6, name: "Champagne Sequin Party Gown", price: 31000, original: 39000, image: "/images/products/party-gown-1.jpg", category: "New Arrivals", rating: 5, reviews: 12, badge: "New In", occasion: "Reception", color: "Gold", fabric: "Organza" },
  { id: 7, name: "Royal Purple Banarasi Lehenga", price: 74000, original: 92000, image: "/images/models/hero_editorial.png", category: "Wedding Collection", rating: 5, reviews: 103, badge: "Bestseller", occasion: "Sangeet", color: "Royal Purple", fabric: "Banarasi Silk" },
  { id: 8, name: "Artisan Craft Lehenga", price: 56000, original: 70000, image: "/images/models/brand-story.jpg", category: "Wedding Collection", rating: 4.8, reviews: 56, badge: "", occasion: "Bridal", color: "Crimson Red", fabric: "Raw Silk" },
  { id: 9, name: "Vibrant Saffron Anarkali", price: 42000, original: 52000, image: "/images/products/product-001.png", category: "Festive Collection", rating: 4.9, reviews: 18, badge: "New", occasion: "Festive", color: "Gold", fabric: "Chiffon" },
  { id: 10, name: "Classic Silk Heritage Kurta", price: 18500, original: 24000, image: "/images/products/product-002.png", category: "Designer Suits", rating: 4.8, reviews: 22, badge: "", occasion: "Mehendi", color: "Ivory White", fabric: "Raw Silk" },
  { id: 11, name: "Rose Gold Bridal Gown", price: 92000, original: 120000, image: "/images/products/product-003.png", category: "Wedding Collection", rating: 5, reviews: 31, badge: "Custom Edit", occasion: "Reception", color: "Gold", fabric: "Velvet" },
];

const fmt = (p: number) => `₹${p.toLocaleString("en-IN")}`;

export default function CollectionsPageContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [wish, setWish] = useState<number[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const itemsPerPage = 8;

  const heroRef = useRef<HTMLDivElement>(null);

  // Auto-reveal banner elements on mount
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroElements = gsap.utils.toArray(".collection-hero-fade");
      if (heroElements.length > 0) {
        gsap.fromTo(heroElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Read URL query parameter on mount
  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat && categories.includes(urlCat)) {
      setSelectedCategory(urlCat);
    }
  }, [searchParams]);

  const toggleWish = (id: number) => setWish(w => w.includes(id) ? w.filter(i => i !== id) : [...w, id]);

  // Apply filters
  const filtered = allProducts.filter(p => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    if (selectedOccasion !== "All" && p.occasion !== selectedOccasion) return false;
    if (selectedColor !== "All" && p.color !== selectedColor) return false;
    if (selectedFabric !== "All" && p.fabric !== selectedFabric) return false;
    if (selectedPrice !== "All") {
      if (selectedPrice === "Under ₹30,000" && p.price >= 30000) return false;
      if (selectedPrice === "₹30,000 - ₹60,000" && (p.price < 30000 || p.price > 60000)) return false;
      if (selectedPrice === "Over ₹60,000" && p.price <= 60000) return false;
    }
    return true;
  });

  // Apply sort
  const sorted = [...filtered].sort((a, b) => {
    if (selectedSort === "Price: Low to High") return a.price - b.price;
    if (selectedSort === "Price: High to Low") return b.price - a.price;
    return b.id - a.id; // Newest
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100svh" }}>
      {/* Full-width editorial hero banner */}
      <div
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden w-full bg-[#121213]"
        style={{ minHeight: "360px", paddingTop: "120px", paddingBottom: "60px" }}
      >
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/models/wedding-collection.jpg"
            alt="Atelier Banner"
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="relative z-10 max-w-xl mx-auto">
          {/* Breadcrumb */}
          <span className="collection-hero-fade block font-accent text-[9px] tracking-[0.3em] uppercase text-white/50 mb-3 opacity-0">
            Home / Collections
          </span>
          <h1 className="collection-hero-fade font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1] mb-4 opacity-0">
            The Atelier <span className="italic font-normal text-[#E6C280]">Collections</span>
          </h1>
          <p className="collection-hero-fade font-body text-xs sm:text-sm text-white/60 leading-relaxed mb-6 opacity-0">
            Explore our full catalog of handcrafted masterpieces, woven from pure Varanasi silk and adorned with generational gold zardozi wirework.
          </p>
          <span className="collection-hero-fade block font-accent text-[9px] tracking-[0.2em] uppercase text-[#E6C280]/85 opacity-0">
            {sorted.length} Pieces Available
          </span>
        </div>
      </div>

      {/* Horizontal Luxury Sticky Filter Bar (Desktop only) */}
      <div className="sticky top-[62px] z-30 bg-[#FFFBF4]/95 backdrop-blur-[20px] border-b border-[#E6C280]/20 py-4 hidden lg:block">
        <div className="container mx-auto px-6 max-w-[1200px] flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-wrap">
            <SlidersHorizontal size={12} className="text-[#E6C280]" />
            
            {/* Category Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 font-accent text-[9.5px] tracking-[0.2em] uppercase text-text-primary px-3.5 py-2 border border-accent-gold/20 hover:border-accent-gold transition-colors duration-300 cursor-pointer">
                Category: {selectedCategory} <ChevronDown size={10} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-[#FFFBF4] border border-[#E6C280]/20 shadow-luxury py-2 min-w-[180px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 rounded-[2px] z-50">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCategory(c);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 font-accent text-[8.5px] tracking-[0.18em] uppercase hover:bg-[#FFF5E6] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 font-accent text-[9.5px] tracking-[0.2em] uppercase text-text-primary px-3.5 py-2 border border-accent-gold/20 hover:border-accent-gold transition-colors duration-300 cursor-pointer">
                Occasion: {selectedOccasion} <ChevronDown size={10} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-[#FFFBF4] border border-[#E6C280]/20 shadow-luxury py-2 min-w-[180px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 rounded-[2px] z-50">
                {occasions.map((o) => (
                  <button
                    key={o}
                    onClick={() => {
                      setSelectedOccasion(o);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 font-accent text-[8.5px] tracking-[0.18em] uppercase hover:bg-[#FFF5E6] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 font-accent text-[9.5px] tracking-[0.2em] uppercase text-text-primary px-3.5 py-2 border border-accent-gold/20 hover:border-accent-gold transition-colors duration-300 cursor-pointer">
                Color: {selectedColor} <ChevronDown size={10} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-[#FFFBF4] border border-[#E6C280]/20 shadow-luxury py-2 min-w-[180px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 rounded-[2px] z-50">
                {colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => {
                      setSelectedColor(col);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 font-accent text-[8.5px] tracking-[0.18em] uppercase hover:bg-[#FFF5E6] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 font-accent text-[9.5px] tracking-[0.2em] uppercase text-text-primary px-3.5 py-2 border border-accent-gold/20 hover:border-accent-gold transition-colors duration-300 cursor-pointer">
                Fabric: {selectedFabric} <ChevronDown size={10} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-[#FFFBF4] border border-[#E6C280]/20 shadow-luxury py-2 min-w-[180px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 rounded-[2px] z-50">
                {fabrics.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setSelectedFabric(f);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 font-accent text-[8.5px] tracking-[0.18em] uppercase hover:bg-[#FFF5E6] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 font-accent text-[9.5px] tracking-[0.2em] uppercase text-text-primary px-3.5 py-2 border border-accent-gold/20 hover:border-accent-gold transition-colors duration-300 cursor-pointer">
                Price: {selectedPrice} <ChevronDown size={10} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-[#FFFBF4] border border-[#E6C280]/20 shadow-luxury py-2 min-w-[180px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 rounded-[2px] z-50">
                {prices.map((pr) => (
                  <button
                    key={pr}
                    onClick={() => {
                      setSelectedPrice(pr);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 font-accent text-[8.5px] tracking-[0.18em] uppercase hover:bg-[#FFF5E6] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 font-accent text-[9.5px] tracking-[0.2em] uppercase text-text-primary px-3.5 py-2 border border-accent-gold/20 hover:border-accent-gold transition-colors duration-300 cursor-pointer">
              Sort: {selectedSort} <ChevronDown size={10} />
            </button>
            <div className="absolute top-full right-0 mt-1 bg-[#FFFBF4] border border-[#E6C280]/20 shadow-luxury py-2 min-w-[180px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 rounded-[2px] z-50">
              {sortOptions.map((so) => (
                <button
                  key={so}
                  onClick={() => {
                    setSelectedSort(so);
                    setCurrentPage(1);
                  }}
                  className="w-full text-left px-4 py-2 font-accent text-[8.5px] tracking-[0.18em] uppercase hover:bg-[#FFF5E6] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  {so}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile filter trigger */}
      <div className="sticky top-[62px] z-30 px-6 py-3 bg-[#FFFBF4] border-b border-[#E6C280]/20 flex items-center justify-between lg:hidden">
        <span className="font-accent text-[9.5px] tracking-[0.18em] uppercase text-text-muted">
          Showing {sorted.length} pieces
        </span>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 font-accent text-[9px] tracking-[0.18em] uppercase px-4 py-2 border border-accent-gold/20 text-text-primary hover:border-accent-gold transition-colors rounded-[2px] cursor-pointer"
        >
          <SlidersHorizontal size={11} /> Filters
        </button>
      </div>

      {/* Product Grid and Layout */}
      <div className="section container mx-auto px-4 sm:px-6 md:px-8 max-w-[1200px] py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${selectedOccasion}-${selectedColor}-${selectedFabric}-${selectedPrice}-${selectedSort}-${currentPage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch"
          >
            {paginatedItems.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="product-card group relative flex flex-col justify-between w-full h-full bg-[#FFFBF4] border border-accent-gold/15 p-4 sm:p-5 transition-all duration-500 hover:shadow-luxury hover:border-[#E6C280]/45 rounded-[2px]"
              >
                <div className="flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 border border-[#E6C280]/10 rounded-[2px] bg-cream-warm">
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover object-top filter brightness-[0.95] transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                        loading="lazy"
                      />
                    </div>

                    {/* Champagne Gold Frame overlay */}
                    <div className="absolute inset-3 border border-[#E6C280]/40 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-10" />

                    {/* Badge */}
                    {p.badge && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="font-accent text-[7.5px] tracking-[0.15em] uppercase px-2 py-0.5 bg-[#8B1A3A] text-white rounded-[1px] shadow-sm">
                          {p.badge}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWish(p.id);
                      }}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center border border-accent-gold/15 bg-white/90 transition-all duration-300 hover:bg-white cursor-pointer"
                    >
                      <Heart
                        className="w-3 h-3"
                        fill={wish.includes(p.id) ? "var(--gold)" : "none"}
                        color={wish.includes(p.id) ? "var(--gold)" : "var(--ink)"}
                      />
                    </button>

                    {/* View Details CTA Overlay */}
                    <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10 translate-y-2 group-hover:translate-y-0">
                      <Link href={`/collections?id=${p.id}`} className="w-full h-full flex items-center justify-center">
                        <span className="flex items-center gap-1.5 font-accent text-[8.5px] tracking-[0.22em] uppercase text-white hover:text-[#E6C280] transition-colors cursor-pointer">
                          View Details
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Information block */}
                  <div className="flex flex-col flex-grow">
                    <span className="font-accent text-[8.5px] tracking-[0.18em] uppercase text-accent-gold/85 block mb-1.5">
                      {p.category}
                    </span>
                    <h3 className="font-serif font-light text-base text-text-primary mb-1.5 leading-tight truncate">
                      {p.name}
                    </h3>
                    
                    {/* No price emphasis: subtle display */}
                    <span className="font-accent text-[10px] tracking-wide text-text-muted mt-auto">
                      {fmt(p.price)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Elegant Empty State */}
        {sorted.length === 0 && (
          <div className="text-center py-20 px-4 border border-[#E6C280]/20 bg-[#FFFBF4] rounded-[2px] max-w-md mx-auto my-12 relative">
            <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-[#E6C280]/40"></div>
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-[#E6C280]/40"></div>
            <Sparkles size={36} className="mx-auto mb-6 text-accent-gold/85" />
            <h3 className="font-serif text-2xl text-text-primary mb-3">No Masterpieces Found</h3>
            <p className="font-body text-xs sm:text-sm text-text-muted max-w-xs mx-auto mb-8 leading-relaxed">
              No collection pieces match your current active filters. Clear or adjust your filters to view SANA couture.
            </p>
            <LuxuryButton
              variant="primary"
              className="mx-auto"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedOccasion("All");
                setSelectedColor("All");
                setSelectedFabric("All");
                setSelectedPrice("All");
                setSelectedSort("Newest");
                setCurrentPage(1);
              }}
            >
              Clear All Filters
            </LuxuryButton>
          </div>
        )}

        {/* Luxury Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-accent-gold/10">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="w-8 h-8 rounded-full border border-accent-gold/20 flex items-center justify-center text-accent-gold hover:text-[#121213] hover:bg-accent-gold hover:border-accent-gold transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-2.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  className="transition-all duration-300 h-1 rounded-full cursor-pointer"
                  style={{
                    width: i + 1 === currentPage ? "24px" : "6px",
                    background: i + 1 === currentPage ? "var(--gold)" : "rgba(200, 133, 26, 0.25)",
                  }}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="w-8 h-8 rounded-full border border-accent-gold/20 flex items-center justify-center text-accent-gold hover:text-[#121213] hover:bg-accent-gold hover:border-accent-gold transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Sheet Filter Drawer (Mobile only) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 inset-x-0 bg-[#FFFBF4] border-t border-[#E6C280]/30 rounded-t-[12px] z-[9999] max-h-[85vh] overflow-y-auto p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E6C280]/15 pb-4 mb-6">
                  <span className="font-serif text-xl text-text-primary font-light">Refine Collection</span>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
                    aria-label="Close filters panel"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-6">
                  {/* Category */}
                  <div>
                    <span className="font-accent text-[9px] tracking-[0.18em] uppercase text-accent-gold block mb-2.5">Category</span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCategory(c);
                            setCurrentPage(1);
                          }}
                          className={`font-accent text-[8.5px] tracking-[0.15em] uppercase px-3 py-2 border rounded-[2px] transition-colors cursor-pointer ${
                            selectedCategory === c
                              ? "bg-[#121213] text-white border-black"
                              : "bg-transparent text-text-muted border-[#E6C280]/20"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Occasion */}
                  <div>
                    <span className="font-accent text-[9px] tracking-[0.18em] uppercase text-accent-gold block mb-2.5">Occasion</span>
                    <div className="flex flex-wrap gap-2">
                      {occasions.map((o) => (
                        <button
                          key={o}
                          onClick={() => {
                            setSelectedOccasion(o);
                            setCurrentPage(1);
                          }}
                          className={`font-accent text-[8.5px] tracking-[0.15em] uppercase px-3 py-2 border rounded-[2px] transition-colors cursor-pointer ${
                            selectedOccasion === o
                              ? "bg-[#121213] text-white border-black"
                              : "bg-transparent text-text-muted border-[#E6C280]/20"
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <span className="font-accent text-[9px] tracking-[0.18em] uppercase text-accent-gold block mb-2.5">Color</span>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((col) => (
                        <button
                          key={col}
                          onClick={() => {
                            setSelectedColor(col);
                            setCurrentPage(1);
                          }}
                          className={`font-accent text-[8.5px] tracking-[0.15em] uppercase px-3 py-2 border rounded-[2px] transition-colors cursor-pointer ${
                            selectedColor === col
                              ? "bg-[#121213] text-white border-black"
                              : "bg-transparent text-text-muted border-[#E6C280]/20"
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fabric */}
                  <div>
                    <span className="font-accent text-[9px] tracking-[0.18em] uppercase text-accent-gold block mb-2.5">Fabric</span>
                    <div className="flex flex-wrap gap-2">
                      {fabrics.map((f) => (
                        <button
                          key={f}
                          onClick={() => {
                            setSelectedFabric(f);
                            setCurrentPage(1);
                          }}
                          className={`font-accent text-[8.5px] tracking-[0.15em] uppercase px-3 py-2 border rounded-[2px] transition-colors cursor-pointer ${
                            selectedFabric === f
                              ? "bg-[#121213] text-white border-black"
                              : "bg-transparent text-text-muted border-[#E6C280]/20"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="font-accent text-[9px] tracking-[0.18em] uppercase text-accent-gold block mb-2.5">Price Range</span>
                    <div className="flex flex-wrap gap-2">
                      {prices.map((pr) => (
                        <button
                          key={pr}
                          onClick={() => {
                            setSelectedPrice(pr);
                            setCurrentPage(1);
                          }}
                          className={`font-accent text-[8.5px] tracking-[0.15em] uppercase px-3 py-2 border rounded-[2px] transition-colors cursor-pointer ${
                            selectedPrice === pr
                              ? "bg-[#121213] text-white border-black"
                              : "bg-transparent text-text-muted border-[#E6C280]/20"
                          }`}
                        >
                          {pr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <span className="font-accent text-[9px] tracking-[0.18em] uppercase text-accent-gold block mb-2.5">Sort By</span>
                    <div className="flex flex-wrap gap-2">
                      {sortOptions.map((so) => (
                        <button
                          key={so}
                          onClick={() => {
                            setSelectedSort(so);
                            setCurrentPage(1);
                          }}
                          className={`font-accent text-[8.5px] tracking-[0.15em] uppercase px-3 py-2 border rounded-[2px] transition-colors cursor-pointer ${
                            selectedSort === so
                              ? "bg-[#121213] text-white border-black"
                              : "bg-transparent text-text-muted border-[#E6C280]/20"
                          }`}
                        >
                          {so}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 border-t border-[#E6C280]/15 pt-4">
                <LuxuryButton
                  variant="primary"
                  className="w-full"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters ({sorted.length} items)
                </LuxuryButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
