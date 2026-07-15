"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const editorials = [
  {
    image: "/images/models/hero_bridal.png",
    title: "The Bridal Edit",
    sub: "A season of ivory, gold, and forever",
    tag: "Vol. I",
    href: "/collections?category=Wedding+Collection",
  },
  {
    image: "/images/products/festive-anarkali-1.jpg",
    title: "Festive Fever",
    sub: "Diwali in full bloom",
    tag: "Vol. II",
    href: "/collections?category=Festive+Collection",
  },
  {
    image: "/images/products/party-gown-1.jpg",
    title: "After Dark",
    sub: "For celebrations that last till dawn",
    tag: "Vol. III",
    href: "/collections",
  },
  {
    image: "/images/models/hero_editorial.png",
    title: "Power Dressing",
    sub: "Command every room you enter",
    tag: "Vol. IV",
    href: "/collections?category=Designer+Suits",
  },
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
function CardInner({ ed }: { ed: (typeof editorials)[0] }) {
  return (
    <Link href={ed.href} className="block relative w-full group">
      {/* 3:4 Aspect Ratio Image Box */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[2px]">
        <Image
          src={ed.image}
          alt={ed.title}
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

      {/* Vol Tag */}
      <div className="absolute top-6 right-6 z-20">
        <span className="font-accent text-[9px] tracking-[0.2em] uppercase px-3 py-1 border border-[#E6C280]/30 bg-[#1C0E05]/80 text-[#E6C280] backdrop-blur-[2px]">
          {ed.tag}
        </span>
      </div>

      {/* Text Info */}
      <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20 text-white flex flex-col justify-end">
        <span className="font-serif italic text-[11px] sm:text-[13px] tracking-wide text-[#E6C280]/90 block mb-1">
          {ed.sub}
        </span>
        <h3 className="font-display font-light text-white mb-2.5 tracking-wide leading-tight text-xl sm:text-2xl lg:text-[28px] transition-transform duration-500 group-hover:-translate-y-1">
          {ed.title}
        </h3>

        <div className="flex items-center gap-2 font-accent text-[9.5px] tracking-[0.25em] uppercase text-white/95 transition-transform duration-500 group-hover:-translate-y-0.5">
          Explore <ArrowRight size={11} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}

export default function EditorialShowcase() {
  return (
    <section className="section-spacing relative overflow-hidden" style={{ background: "var(--parchment)" }}>
      <div className="editorial-container">
        {/* Centered Editorial Gallery Header */}
        <div className="mb-16 flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="eyebrow-text text-gold mb-3">— Editorial Gallery</span>
          <h2 className="section-title-text mb-4">
            The Season&apos;s <span className="italic font-normal text-gold">Finest Looks</span>
          </h2>
          <div className="w-12 h-[1px] bg-accent-gold/45 my-4" />
          <p className="font-serif italic text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mb-4">
            &ldquo;A curated edit of this season&apos;s most coveted pieces, styled for the modern Indian woman. Generational craftsmanship reimagined for contemporary statements.&rdquo;
          </p>
          <Link href="/collections" className="group/link inline-flex items-center gap-1.5 font-accent text-[10.5px] tracking-[0.2em] uppercase text-[#C8851A] hover:text-[#9A5F0A] transition-colors font-semibold mt-2 cursor-pointer">
            Explore Lookbooks
            <ArrowRight size={11} className="group-hover/link:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Grid Layout — 4 columns desktop / 2 tablet / 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
          {editorials.map((ed, i) => (
            <motion.div
              key={ed.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={cardReveal}
              className="relative w-full bg-cream-warm shadow-[0_8px_30px_rgba(28,14,5,0.05)] border border-[#E6C280]/20 rounded-[2px]"
            >
              <CardInner ed={ed} />
            </motion.div>
          ))}
        </div>

        {/* Divider with text */}
        <div className="mt-16 md:mt-24 divider">
          <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-text-muted whitespace-nowrap">
            ✦ Crafted with intent, worn with pride ✦
          </span>
        </div>
      </div>
    </section>
  );
}
