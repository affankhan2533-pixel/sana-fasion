"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    title: "Wedding Collection",
    sub: "Bridal Atelier",
    desc: "Heirloom craftsmanship for the most important day of your life.",
    image: "/images/models/wedding-collection.jpg",
    href: "/collections?category=Wedding+Collection",
    badge: "Bridal 2025",
    accent: "var(--burgundy)",
  },
  {
    title: "Festive Collection",
    sub: "Celebration Wear",
    desc: "Gold-threaded anarkalis and shimmering ensembles for every festivity.",
    image: "/images/models/festive-collection.jpg",
    href: "/collections?category=Festive+Collection",
    badge: "New In",
    accent: "var(--amber)",
  },
  {
    title: "Designer Suits",
    sub: "Contemporary Power",
    desc: "Modern silhouettes with a timeless ethnic soul.",
    image: "/images/products/power-suit-1.jpg",
    href: "/collections?category=Designer+Suits",
    badge: "Trending",
    accent: "var(--forest)",
  },
  {
    title: "New Arrivals",
    sub: "Atelier Pre-Order",
    desc: "Contemporary silhouettes for modern celebrations.",
    image: "/images/products/party-gown-1.jpg",
    href: "/collections",
    badge: "New Season",
    accent: "var(--burgundy)",
  }
];

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

// Inner card content (shared between mobile and desktop)
function CardInner({ col, compact, large }: { col: (typeof collections)[0]; compact?: boolean; large?: boolean }) {
  return (
    <Link href={col.href} className="block relative w-full h-full">
      {/* Image Container with scale-hover */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={col.image}
          alt={col.title}
          fill
          className="object-cover object-top filter brightness-[0.92] transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          sizes={large ? "(max-width: 768px) 60vw, 50vw" : "(max-width: 768px) 45vw, 25vw"}
        />
      </div>

      {/* Champagne border overlay */}
      <div className="absolute inset-3 sm:inset-4 border border-[#E6C280]/20 group-hover:border-[#E6C280]/65 transition-all duration-700 pointer-events-none z-20" />

      {/* Warm luxury overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />

      {/* Badge */}
      <div className="absolute top-3 left-3 z-20">
        <span className="font-accent text-[8px] sm:text-[9.5px] tracking-[0.18em] uppercase px-2.5 py-0.5 sm:py-1 text-white rounded-[1px] shadow-sm" style={{ background: col.accent }}>
          {col.badge}
        </span>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-7 z-20 text-white flex flex-col justify-end">
        <span className="font-serif italic text-[9px] sm:text-xs tracking-wide text-[#E6C280]/85 block mb-1">
          {col.sub}
        </span>
        <h3 className="font-display font-light text-white mb-1.5 sm:mb-3 tracking-wide leading-tight text-xs sm:text-xl md:text-2xl">
          {col.title}
        </h3>

        {/* Collapsible description on hover (Desktop only) */}
        {!compact && (
          <p className="font-body text-[11px] sm:text-xs mb-4 opacity-0 max-h-0 overflow-hidden group-hover:opacity-85 group-hover:max-h-20 transition-all duration-500 text-white/70 leading-relaxed">
            {col.desc}
          </p>
        )}

          <div className="flex items-center gap-2 font-accent text-[8.5px] tracking-[0.25em] uppercase text-white/95">
          Explore <ArrowRight size={11} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCollections() {
  return (
    <section className="section relative overflow-hidden py-16 sm:py-24 md:py-32" style={{ background: "var(--cream)" }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-20 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-6xl mx-auto">
          <div>
            <span className="font-accent text-[10px] tracking-[0.4em] uppercase text-gold block mb-4">— Our Collections</span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-text-primary tracking-tight leading-[1.1]">
              Curated for <span className="italic font-normal text-gold font-serif">Every Occasion</span>
            </h2>
          </div>
          <div>
            <Link href="/collections">
              <button className="flex items-center gap-2 font-accent text-[10px] tracking-[0.2em] uppercase text-[#C8851A] hover:text-[#9A5F0A] transition-colors border-b border-accent-gold/40 pb-1 cursor-pointer">
                View All Collections <ArrowRight size={12} />
              </button>
            </Link>
          </div>
        </div>

        {/* ===== MOBILE GRID (2 cards per row) — NO ANIMATION, always visible ===== */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {collections.map((col, i) => (
            <div
              key={col.title}
              className="w-full relative group overflow-hidden bg-cream-warm shadow-[0_4px_20px_rgba(28,14,5,0.08)] border border-[#E6C280]/20 rounded-[2px]"
              style={{ aspectRatio: "3/4" }}
            >
              <CardInner col={col} compact />
            </div>
          ))}
        </div>

        {/* ===== DESKTOP Grid with animations ===== */}
        <div className="hidden md:grid grid-cols-4 gap-8 max-w-6xl mx-auto items-start">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={cardReveal}
              className={`relative group overflow-hidden bg-cream-warm shadow-[0_8px_30px_rgba(28,14,5,0.06)] border border-[#E6C280]/20 rounded-[2px] ${i % 2 === 1 ? "mt-12" : ""}`}
              style={{ aspectRatio: "3/4" }}
            >
              <CardInner col={col} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
