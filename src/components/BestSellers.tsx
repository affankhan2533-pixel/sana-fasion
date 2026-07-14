"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, X, ArrowRight, Eye } from "lucide-react";
import LuxuryButton from "@/components/LuxuryButton";

const products = [
  {
    id: 1,
    name: "Royal Crimson Bridal Lehenga",
    price: 85000,
    original: 110000,
    image: "/images/models/hero_bridal.png",
    category: "Wedding Collection",
    badge: "Best Seller",
    rating: 5,
    reviews: 42,
    desc: "Hand-embroidered crimson lehenga with 14-karat gold zardozi work. Crafted over 300 hours by master artisans.",
    craftsmanship: "300 Hours Artisan Zardozi",
  },
  {
    id: 2,
    name: "Emerald Festive Anarkali",
    price: 38000,
    original: 48000,
    image: "/images/products/festive-anarkali-1.jpg",
    category: "Festive Collection",
    badge: "Top Rated",
    rating: 5,
    reviews: 67,
    desc: "Floor-length emerald anarkali with mirror work and threadwork detailing. Perfect for Diwali celebrations.",
    craftsmanship: "Generational Mirrorwork Heritage",
  },
  {
    id: 3,
    name: "Ivory Pearl Wedding Sharara",
    price: 62000,
    original: 78000,
    image: "/images/products/wedding-sharara-1.jpg",
    category: "Wedding Collection",
    badge: "New In",
    rating: 4.9,
    reviews: 28,
    desc: "Ivory organza sharara set with pearl and crystal embellishments. Timeless bridal elegance.",
    craftsmanship: "Hand-Sewn Pearl Embellishments",
  },
  {
    id: 4,
    name: "Midnight Blue Power Suit",
    price: 22000,
    original: 28000,
    image: "/images/products/power-suit-1.jpg",
    category: "Designer Suits",
    badge: "Trending",
    rating: 4.9,
    reviews: 34,
    desc: "Structured midnight blue suit with handwoven gold border. Modern power dressing with an ethnic soul.",
    craftsmanship: "Handwoven Antique Zari Border",
  },
];

const cardReveal = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export default function BestSellers() {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quickView, setQuickView] = useState<(typeof products)[0] | null>(null);

  const toggleWish = (id: number) =>
    setWishlist(w => w.includes(id) ? w.filter(i => i !== id) : [...w, id]);

  return (
    <section className="section py-16 sm:py-24 md:py-32 relative overflow-hidden bg-[#FFF5E6]">
      {/* Subtle gold line ornament background */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1200px]">
        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-accent-gold/10 pb-6 sm:pb-8">
          <div>
            <span className="font-accent text-[10px] tracking-[0.25em] uppercase text-gold block mb-3">
              — Editorial Selection
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-text-primary tracking-tight leading-[1.1]">
              Featured Atelier <span className="italic font-normal text-gold font-serif">Pieces</span>
            </h2>
          </div>
          <div className="hidden md:block">
            <Link href="/collections">
              <button className="flex items-center gap-2 font-accent text-[10px] tracking-[0.2em] uppercase text-[#C8851A] hover:text-[#9A5F0A] transition-colors border-b border-accent-gold/40 pb-1 cursor-pointer">
                View All Collections <ArrowRight size={12} />
              </button>
            </Link>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="best-sellers-grid-wrapper w-full">

          {/* ===== MOBILE Grid (< lg) — NO animation, always visible ===== */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden w-full items-stretch">
            {products.map((p, idx) => (
              <div
                key={p.id}
                className="best-sellers-card group relative flex flex-col justify-between w-full h-full bg-[#FFFBF4] border border-accent-gold/15 p-3 sm:p-5 transition-all duration-500 hover:shadow-luxury hover:border-accent-gold/45 rounded-[2px]"
              >
                <div className="flex flex-col h-full">
                  <div className="best-sellers-image-wrapper relative overflow-hidden mb-3 aspect-[3/4] w-full border border-accent-gold/10 shadow-sm rounded-[2px]">
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover object-top filter brightness-[0.95] transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                        sizes="(max-width: 768px) 45vw, 22vw"
                        priority={idx === 0}
                      />
                    </div>
                    {p.badge && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="font-accent text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 bg-[#8B1A3A] text-white rounded-[1px] shadow-sm">{p.badge}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
                      className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center border border-accent-gold/15 bg-white/90 transition-all duration-300 hover:bg-white cursor-pointer"
                    >
                      <Heart className="w-3 h-3" fill={wishlist.includes(p.id) ? "var(--gold)" : "none"} color={wishlist.includes(p.id) ? "var(--gold)" : "var(--ink)"} />
                    </button>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="font-accent text-[8px] tracking-[0.18em] uppercase text-accent-gold/85 block mb-1">{p.category}</span>
                    <h3 className="font-serif font-light text-sm text-text-primary mb-1 truncate leading-tight">{p.name}</h3>
                    {p.craftsmanship && <span className="text-[9px] tracking-wide text-text-muted font-body italic mb-2">{p.craftsmanship}</span>}
                  </div>
                </div>
                <div className="mt-1.5 w-full pt-1.5 border-t border-accent-gold/10">
                  <Link href="/collections" className="w-full block">
                    <div className="w-full justify-start text-[8px] font-accent tracking-[0.2em] uppercase text-accent-gold flex items-center gap-1.5 transition-colors duration-300 hover:text-text-primary cursor-pointer">
                      View Collection <ArrowRight size={9} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* ===== DESKTOP Grid (lg+) — with animations ===== */}
          <div className="hidden lg:grid grid-cols-4 gap-6 w-full items-stretch">
            {products.map((p, idx) => (
              <motion.div
                key={p.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px" }}
                variants={cardReveal}
                className="best-sellers-card group relative flex flex-col justify-between w-full h-full bg-[#FFFBF4] border border-accent-gold/15 p-5 transition-all duration-500 hover:shadow-luxury hover:border-accent-gold/45 rounded-[2px]"
              >
                <div className="flex flex-col h-full">
                  <div className="best-sellers-image-wrapper relative overflow-hidden mb-4 aspect-[3/4] w-full border border-accent-gold/10 shadow-sm rounded-[2px]">
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover object-top filter brightness-[0.95] transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                        sizes="22vw"
                        priority={idx === 0}
                      />
                    </div>
                    <div className="absolute inset-3 border border-[#E6C280]/40 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-10" />
                    {p.badge && (
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="font-accent text-[7.5px] tracking-[0.15em] uppercase px-2.5 py-0.5 bg-[#8B1A3A] text-white rounded-[1px] shadow-sm">{p.badge}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
                      className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full flex items-center justify-center border border-accent-gold/15 bg-white/90 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white cursor-pointer"
                    >
                      <Heart className="w-3 h-3" fill={wishlist.includes(p.id) ? "var(--gold)" : "none"} color={wishlist.includes(p.id) ? "var(--gold)" : "var(--ink)"} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10 translate-y-2 group-hover:translate-y-0">
                      <button onClick={() => setQuickView(p)} className="flex items-center gap-1.5 font-accent text-[9.5px] tracking-[0.22em] uppercase text-white hover:text-accent-gold-light transition-colors cursor-pointer">
                        <Eye size={11} /> Quick View
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="font-accent text-[8.5px] tracking-[0.18em] uppercase text-accent-gold/85 block mb-1.5">{p.category}</span>
                    <h3 className="font-serif font-light text-xl text-text-primary mb-1.5 transition-transform duration-500 group-hover:-translate-y-0.5 truncate leading-tight">{p.name}</h3>
                    {p.craftsmanship && <span className="text-[10px] tracking-wide text-text-muted font-body italic mb-3">{p.craftsmanship}</span>}
                  </div>
                </div>
                <div className="mt-2 w-full pt-2 border-t border-accent-gold/10">
                  <Link href="/collections" className="w-full block">
                    <div className="w-full justify-start text-[9.5px] font-accent tracking-[0.2em] uppercase text-accent-gold flex items-center gap-1.5 transition-colors duration-300 hover:text-text-primary cursor-pointer">
                      View Collection <ArrowRight size={10} />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>


      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox z-50 p-4"
            onClick={() => setQuickView(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 overflow-hidden border border-border shadow-lift rounded-[2px]"
              style={{ background: "var(--cream)", maxHeight: "90svh" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
                style={{ background: "rgba(255,251,244,0.85)" }}
                aria-label="Close details dialog"
              >
                <X size={15} color="var(--ink)" />
              </button>

              {/* Image */}
              <div className="relative aspect-[3/4] min-h-[300px] w-full">
                <Image
                  src={quickView.image}
                  alt={quickView.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>

              {/* Details Pane */}
              <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-cream-warm">
                <div>
                  <span className="label block mb-2">{quickView.category}</span>
                  <h3 className="font-display font-light text-2xl mb-4 text-text-primary leading-tight">{quickView.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="stars flex gap-0.5 text-accent-gold">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={11} fill="currentColor" strokeWidth={1.5} />
                      ))}
                    </div>
                    <span className="font-accent text-[9px] text-text-muted">({quickView.reviews} reviews)</span>
                  </div>

                  <p className="body-sm text-text-secondary leading-relaxed mb-6">{quickView.desc}</p>
                  
                  <div className="mb-6 py-3 border-y border-accent-gold/10">
                    <span className="font-accent text-[10px] tracking-[0.2em] uppercase text-accent-gold">
                      Exclusive Atelier Piece
                    </span>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                      Custom tailoring and bespoke fits are available by private appointment in our flagship stores.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <Link href="/contact" onClick={() => setQuickView(null)} className="w-full">
                    <LuxuryButton variant="primary" showArrow className="w-full">
                      Inquire Now
                    </LuxuryButton>
                  </Link>
                  <LuxuryButton
                    variant="secondary"
                    className="w-full"
                    onClick={() => toggleWish(quickView.id)}
                  >
                    {wishlist.includes(quickView.id) ? "Wishlisted" : "Add to Wishlist"}
                  </LuxuryButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

