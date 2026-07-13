"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const InstagramIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
  </svg>
);

const images = [
  { src: "/images/models/hero_bridal.png", alt: "Bridal Campaign" },
  { src: "/images/models/wedding-collection.jpg", alt: "Wedding Collection" },
  { src: "/images/products/festive-anarkali-1.jpg", alt: "Festive Anarkali" },
  { src: "/images/models/festive-collection.jpg", alt: "Festive Collection" },
  { src: "/images/models/hero_editorial.png", alt: "Editorial" },
  { src: "/images/products/power-suit-1.jpg", alt: "Designer Suit" },
  { src: "/images/products/party-gown-1.jpg", alt: "Party Gown" },
  { src: "/images/models/brand-story.jpg", alt: "Atelier" },
  { src: "/images/models/gallery-1.jpg", alt: "Gallery" },
  { src: "/images/products/product-001.png", alt: "Festive Couture Look" },
  { src: "/images/products/product-002.png", alt: "Artisanal Silk Fit" },
  { src: "/images/products/product-003.png", alt: "Bridal Lehenga Close-up" },
];

export default function InstagramGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox(i => (i !== null ? (i - 1 + images.length) % images.length : 0));
  const next = () => setLightbox(i => (i !== null ? (i + 1) % images.length : 0));

  return (
    <section className="section py-16 sm:py-24 relative overflow-hidden bg-[#FFFBF4]">
      {/* Subtle top border divider */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/15 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1200px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-accent-gold/10 pb-6 sm:pb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <InstagramIcon size={14} color="var(--gold)" />
              <span className="font-accent text-[10px] tracking-[0.22em] uppercase text-gold">@sana___fashion___01</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-text-primary tracking-tight leading-[1.1]">
              Follow Our <span className="italic font-normal text-gold font-serif">Story</span>
            </h2>
          </div>
          <a
            href="https://www.instagram.com/sana___fashion___01/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 font-accent text-[10px] tracking-[0.2em] uppercase text-[#C8851A] hover:text-[#9A5F0A] transition-colors border-b border-accent-gold/40 pb-1 cursor-pointer"
            >
              <InstagramIcon size={12} color="currentColor" /> Follow Us
            </motion.button>
          </a>
        </motion.div>

        {/* Uniform responsive grid (replacing uneven masonry) */}
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="group relative overflow-hidden cursor-pointer rounded-[2px] shadow-sm border border-accent-gold/10"
              onClick={() => setLightbox(i)}
            >
              <div className="relative overflow-hidden aspect-[4/5] w-full bg-cream-warm">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-top filter brightness-[0.92] transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  sizes="(max-width: 640px) 45vw, 22vw"
                />
                
                {/* Champagne Gold Frame overlay */}
                <div className="absolute inset-3 border border-[#E6C280]/40 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-10" />

                {/* Hover Instagram icon overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300"
                  style={{ background: "rgba(28, 14, 5, 0.65)" }}
                >
                  <InstagramIcon size={20} color="#E6C280" />
                  <span className="font-accent text-[8.5px] tracking-[0.25em] uppercase text-[#E6C280]">View Gallery</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button className="absolute top-5 right-5 z-50 w-10 h-10 flex items-center justify-center" style={{ background: "rgba(255,248,240,0.1)" }} onClick={() => setLightbox(null)}>
              <X size={20} color="white" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-3 sm:left-8 z-50 w-10 h-10 flex items-center justify-center"
              style={{ background: "rgba(255,248,240,0.1)" }}
              onClick={e => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={22} color="white" />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35 }}
              onClick={e => e.stopPropagation()}
              className="relative"
              style={{ width: "min(580px,92vw)", height: "min(680px,80svh)" }}
            >
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].alt}
                fill
                className="object-contain"
                sizes="600px"
              />
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-3 sm:right-8 z-50 w-10 h-10 flex items-center justify-center"
              style={{ background: "rgba(255,248,240,0.1)" }}
              onClick={e => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={22} color="white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 font-accent text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
              {lightbox + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
