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

// Inner card content (shared between mobile and desktop)
function CardInner({ ed, large }: { ed: (typeof editorials)[0]; large?: boolean }) {
  return (
    <Link href={ed.href} className="block relative w-full h-full">
      {/* Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={ed.image}
          alt={ed.title}
          fill
          className="object-cover object-top filter brightness-[0.92] transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          sizes={large ? "(max-width: 768px) 50vw, 40vw" : "(max-width: 768px) 50vw, 30vw"}
        />
      </div>

      {/* Champagne border overlay */}
      <div className="absolute inset-3 sm:inset-4 border border-[#E6C280]/20 group-hover:border-[#E6C280]/65 transition-all duration-700 pointer-events-none z-20" />

      {/* Warm luxury overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />

      {/* Tag */}
      <div className="absolute top-3 right-3 z-20">
        <span className="font-accent text-[8px] sm:text-[9px] tracking-[0.2em] uppercase px-2.5 py-0.5 sm:py-1 border border-[#E6C280]/30 bg-[#1C0E05]/80 text-[#E6C280] backdrop-blur-[2px]">
          {ed.tag}
        </span>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-7 z-20">
        <span className="font-serif italic text-[9px] sm:text-xs tracking-wide text-[#E6C280]/85 block mb-1 sm:mb-2">
          {ed.sub}
        </span>
        <h3 className="font-display font-light text-white mb-2 sm:mb-4 tracking-wide leading-tight text-xs sm:text-xl">
          {ed.title}
        </h3>
        <div className="flex items-center gap-2 font-accent text-[8.5px] tracking-[0.25em] uppercase text-white/95 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]">
          Explore <ArrowRight size={11} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}

export default function EditorialShowcase() {
  return (
    <section className="section overflow-hidden py-16 sm:py-24 md:py-32" style={{ background: "var(--parchment)" }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-20 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-6xl mx-auto">
          <div>
            <span className="font-accent text-[10px] tracking-[0.4em] uppercase text-gold block mb-4">— Editorial Gallery</span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-text-primary tracking-tight leading-[1.1]">
              The Season&apos;s <span className="italic font-normal text-gold font-serif">Finest Looks</span>
            </h2>
          </div>
          <div className="md:max-w-md md:border-l border-accent-gold/20 md:pl-6 py-1">
            <p className="font-body text-sm text-text-muted leading-relaxed">
              A curated edit of this season&apos;s most coveted pieces, styled for the modern Indian woman. Generational craftsmanship reimagined for contemporary statements.
            </p>
          </div>
        </div>

        {/* ===== MOBILE 2x2 Grid — NO ANIMATION, always visible ===== */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {editorials.map((ed) => (
            <div
              key={ed.title}
              className="relative w-full group overflow-hidden bg-cream-warm shadow-[0_4px_20px_rgba(28,14,5,0.08)] border border-[#E6C280]/20 rounded-[2px]"
              style={{ aspectRatio: "3/4" }}
            >
              <CardInner ed={ed} />
            </div>
          ))}
        </div>

        {/* ===== Desktop Cinematic Grid with animations ===== */}
        <div className="hidden sm:grid grid-cols-12 gap-x-8 gap-y-20 max-w-6xl mx-auto items-start">
          {/* Card 0 */}
          <motion.div
            custom={0} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "0px" }} variants={cardReveal}
            className="col-span-6 md:col-span-5 relative group overflow-hidden bg-cream-warm shadow-[0_8px_30px_rgba(28,14,5,0.06)] border border-[#E6C280]/20 rounded-[2px]"
            style={{ aspectRatio: "3/4" }}
          >
            <CardInner ed={editorials[0]} large />
          </motion.div>

          {/* Card 1 */}
          <motion.div
            custom={1} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "0px" }} variants={cardReveal}
            className="col-span-6 md:col-span-5 md:col-start-8 mt-16 md:mt-32 relative group overflow-hidden bg-cream-warm shadow-[0_8px_30px_rgba(28,14,5,0.06)] border border-[#E6C280]/20 rounded-[2px]"
            style={{ aspectRatio: "3/4" }}
          >
            <CardInner ed={editorials[1]} />
          </motion.div>

          {/* Card 2 */}
          <motion.div
            custom={2} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "0px" }} variants={cardReveal}
            className="col-span-6 md:col-span-5 md:col-start-2 -mt-8 md:-mt-12 relative group overflow-hidden bg-cream-warm shadow-[0_8px_30px_rgba(28,14,5,0.06)] border border-[#E6C280]/20 rounded-[2px]"
            style={{ aspectRatio: "3/4" }}
          >
            <CardInner ed={editorials[2]} />
          </motion.div>

          {/* Card 3 */}
          <motion.div
            custom={3} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "0px" }} variants={cardReveal}
            className="col-span-6 md:col-span-5 md:col-start-8 mt-12 md:mt-24 relative group overflow-hidden bg-cream-warm shadow-[0_8px_30px_rgba(28,14,5,0.06)] border border-[#E6C280]/20 rounded-[2px]"
            style={{ aspectRatio: "3/4" }}
          >
            <CardInner ed={editorials[3]} />
          </motion.div>
        </div>

        {/* Divider with text */}
        <div className="mt-12 sm:mt-24 md:mt-32 divider">
          <span className="font-accent text-[9px] tracking-[0.3em] uppercase text-text-muted whitespace-nowrap">
            ✦ Crafted with intent, worn with pride ✦
          </span>
        </div>
      </div>
    </section>
  );
}
