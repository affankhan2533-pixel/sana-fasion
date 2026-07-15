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
    <section className="section-spacing relative overflow-hidden bg-[#FFF5E6]">
      {/* Subtle gold line ornament background */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent" />

      <div className="editorial-container">
        {/* Header — Baseline aligned */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-accent-gold/10 pb-6 md:pb-8">
          <div className="flex flex-col gap-4">
            <span className="eyebrow-text text-gold">— Editorial Selection</span>
            <h2 className="section-title-text">
              Featured Atelier <span className="italic font-normal text-gold">Pieces</span>
            </h2>
          </div>
          <div className="pb-1.5">
            <Link href="/collections">
              <button className="flex items-center gap-2 font-accent text-[15px] tracking-[0.2em] uppercase text-[#C8851A] hover:text-[#9A5F0A] transition-colors border-b border-accent-gold/45 pb-1 cursor-pointer whitespace-nowrap">
                View All Collections <ArrowRight size={12} />
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Grid Layout */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 w-full items-start snap-x snap-mandatory scrollbar-hide pb-6 -mx-6 px-6 md:mx-0 md:px-0">
          {products.map((p, idx) => (
            <motion.div
              key={p.id}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={cardReveal}
              className="best-sellers-card group relative flex flex-col w-[82vw] md:w-full flex-shrink-0 snap-start bg-[#FFFBF4] border border-[#E6C280]/18 hover:border-[#C8851A]/35 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(28,14,5,0.12)] hover:-translate-y-1 rounded-[2px] overflow-hidden"
            >
              {/* ── Image Zone (75–80% of card) ───────────── */}
              <div className="relative overflow-hidden aspect-[3/4] w-full flex-shrink-0">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 22vw"
                  priority={idx === 0}
                />

                {/* Subtle dark gradient at base of image for readability */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Gold inset outline on hover */}
                <div className="absolute inset-[10px] border border-[#E6C280]/0 group-hover:border-[#E6C280]/40 transition-all duration-700 pointer-events-none z-10" />

                {/* Badge */}
                {p.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="font-accent text-[8px] tracking-[0.18em] uppercase px-2.5 py-[5px] bg-[#8B1A3A] text-white shadow-sm">
                      {p.badge}
                    </span>
                  </div>
                )}

                {/* Wishlist */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
                  className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/85 border border-[#E6C280]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white cursor-pointer"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className="w-3.5 h-3.5"
                    fill={wishlist.includes(p.id) ? "var(--gold)" : "none"}
                    color={wishlist.includes(p.id) ? "var(--gold)" : "#1A0F0A"}
                  />
                </button>

                {/* Quick View */}
                <div className="absolute bottom-0 inset-x-0 h-11 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10">
                  <button
                    onClick={() => setQuickView(p)}
                    className="flex items-center gap-1.5 font-accent text-[9.5px] tracking-[0.24em] uppercase text-white/90 hover:text-[#E6C280] transition-colors cursor-pointer"
                  >
                    <Eye size={11} /> Quick View
                  </button>
                </div>
              </div>

              {/* Info block */}
              <div className="p-5 flex flex-col flex-grow">
                <span className="font-accent text-[10px] tracking-[0.18em] uppercase text-[#C8851A] mb-1.5 block">{p.category}</span>
                <h3 className="font-serif font-light text-lg sm:text-xl text-text-primary mb-2 group-hover:text-[#C8851A] transition-colors duration-300 leading-snug">{p.name}</h3>
                {p.craftsmanship && <span className="text-[11px] tracking-wide text-text-muted font-body italic block mb-3">{p.craftsmanship}</span>}
                
                <div className="flex items-baseline gap-3 pt-2 mt-auto border-t border-[#E6C280]/15">
                  <span className="font-serif text-base font-semibold text-text-primary">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="font-serif text-xs text-[#9A8070] line-through">₹{p.original.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </motion.div>
          ))}
    </div>
      </div >

    {/* Quick View Modal */ }
    <AnimatePresence>
  {
    quickView && (
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
    )
  }
      </AnimatePresence >
    </section >
  );
}
