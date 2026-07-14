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

// Premium Card Inner (Standard 3:4 aspect ratio, luxury fonts & hover zoom)
function CardInner({ col }: { col: (typeof collections)[0] }) {
  return (
    <Link href={col.href} className="block relative w-full h-full group">
      {/* 3:4 Aspect Ratio Image Box */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[2px]">
        <Image
          src={col.image}
          alt={col.title}
          fill
          className="object-cover object-top filter brightness-[0.92] transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 22vw"
          priority
        />
        {/* Soft elegant gradient overlay that darkens slightly on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/35" />
      </div>

      {/* Luxury interior gold outline */}
      <div className="absolute inset-4 border border-[#E6C280]/20 group-hover:border-[#E6C280]/55 transition-all duration-700 pointer-events-none z-20" />

      {/* Badge tag */}
      <div className="absolute top-6 left-6 z-20">
        <span className="font-accent text-[9px] tracking-[0.18em] uppercase px-3 py-1 text-white rounded-[1px] shadow-sm" style={{ background: col.accent }}>
          {col.badge}
        </span>
      </div>

      {/* Text Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 text-white flex flex-col justify-end">
        <span className="font-serif italic text-[11px] sm:text-[13px] tracking-wide text-[#E6C280]/90 block mb-1">
          {col.sub}
        </span>
        <h3 className="font-display font-light text-white mb-2.5 tracking-wide leading-tight text-xl sm:text-2xl lg:text-[28px] transition-transform duration-500 group-hover:-translate-y-1">
          {col.title}
        </h3>

        {/* Collapsible description on hover */}
        <p className="font-body text-[12px] sm:text-[13px] mb-4 opacity-0 max-h-0 overflow-hidden group-hover:opacity-85 group-hover:max-h-20 transition-all duration-500 text-white/70 leading-relaxed">
          {col.desc}
        </p>

        <div className="flex items-center gap-2 font-accent text-[9.5px] tracking-[0.25em] uppercase text-white/95 transition-transform duration-500 group-hover:-translate-y-0.5">
          Explore <ArrowRight size={11} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCollections() {
  return (
    <section className="section-spacing relative overflow-hidden" style={{ background: "var(--cream)" }}>
      <div className="editorial-container">
        {/* Header — Horizontal baseline alignment */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <span className="eyebrow-text text-gold">— Our Collections</span>
            <h2 className="section-title-text">
              Curated for <span className="italic font-normal text-gold">Every Occasion</span>
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

        {/* Grid Layout — 4 columns desktop / 2 tablet / 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={cardReveal}
              className="relative w-full h-full bg-cream-warm shadow-[0_8px_30px_rgba(28,14,5,0.05)] border border-[#E6C280]/20 rounded-[2px]"
            >
              <CardInner col={col} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
