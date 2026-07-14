"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Bride",
    occasion: "December 2024",
    text: "My Sana Fashion bridal lehenga was beyond anything I could have imagined. Every guest stopped to compliment the embroidery. I felt like royalty — utterly breathtaking.",
    location: "Mumbai",
    image: "/images/models/hero_bridal.png",
  },
  {
    name: "Ananya Reddy",
    role: "Client",
    occasion: "Since 2022",
    text: "I've ordered from Sana Fashion for three family occasions and each time the craftsmanship exceeds my expectations. Truly a luxury atelier experience.",
    location: "Hyderabad",
    image: "/images/products/festive-anarkali-1.jpg",
  },
  {
    name: "Deepika Mehra",
    role: "Bride",
    occasion: "October 2024",
    text: "The private consultation was so personal and thoughtful. They understood my vision perfectly and created a one-of-a-kind piece. Worth every rupee.",
    location: "Delhi",
    image: "/images/models/hero_editorial.png",
  },
  {
    name: "Kavita Joshi",
    role: "Client",
    occasion: "Fashion Enthusiast",
    text: "Sana Fashion is the only place I trust for special occasions. The Banarasi silk lehenga still turns heads at every event. Timeless and spectacular.",
    location: "Jaipur",
    image: "/images/products/party-gown-1.jpg",
  },
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });
  const [current, setCurrent] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[current];

  return (
    <section ref={containerRef} className="section-spacing relative overflow-hidden bg-[#FFFBF4]">
      {/* Subtle top border divider */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/25 to-transparent" />

      <div className="editorial-container">
        {/* Section Heading — Center on mobile, left on desktop */}
        <div className="mb-12 md:mb-16 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
          <span className="eyebrow-text text-gold mb-4">— Client Stories</span>
          <h2 className="section-title-text mb-4">
            Stories of <span className="italic font-normal text-gold">Elegance</span>
          </h2>
          <p className="body-text-standard text-text-muted">
            Discover how SANA couture is styled and worn by our brides and clients around the world to celebrate their most cherished moments.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Right Column: Garment/Client Image (First on Mobile, Right on Desktop) */}
          <div className="lg:col-span-6 lg:col-start-7 order-first lg:order-last flex justify-center w-full">
            <div className="relative w-full max-w-[360px] aspect-[3/4] shadow-[0_16px_50px_rgba(28,14,5,0.18)] border border-[#E6C280]/20 rounded-[2px] overflow-hidden bg-cream-warm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover object-top filter brightness-[0.92]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-4 border border-[#E6C280]/15 pointer-events-none rounded-[1px] z-10" />
            </div>
          </div>

          {/* Left Column: Quote & Author (Second on Mobile, Left on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center w-full">
            {/* Quote block */}
            <div className="relative py-4 pl-6 border-l-2 border-[#E6C280]/30 min-h-[160px] flex flex-col justify-center mb-8">
              <span className="font-serif text-6xl text-[#E6C280]/40 absolute -top-8 -left-4 pointer-events-none select-none font-normal">
                &ldquo;
              </span>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col"
                >
                  {/* Quote text */}
                  <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-text-primary leading-relaxed mb-6 z-10 relative">
                    {t.text}
                  </p>
                  
                  {/* Author detail */}
                  <div className="flex flex-col">
                    <span className="font-serif text-base sm:text-lg text-text-primary font-medium">{t.name}</span>
                    <span className="font-accent text-[11px] tracking-[0.18em] uppercase text-text-muted mt-1">
                      {t.role} · {t.location} · {t.occasion}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-4">
              {/* Dots */}
              <div className="flex gap-2.5 items-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="transition-all duration-300 h-1 rounded-full cursor-pointer"
                    style={{
                      width: i === current ? "20px" : "6px",
                      background: i === current ? "var(--gold)" : "rgba(200, 133, 26, 0.25)",
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              
              {/* Arrows */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length)}
                  className="w-8 h-8 rounded-full border border-accent-gold/20 flex items-center justify-center text-accent-gold hover:text-[#121213] hover:bg-accent-gold hover:border-accent-gold transition-all duration-300 cursor-pointer"
                  aria-label="Previous story"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrent(c => (c + 1) % testimonials.length)}
                  className="w-8 h-8 rounded-full border border-accent-gold/20 flex items-center justify-center text-accent-gold hover:text-[#121213] hover:bg-accent-gold hover:border-accent-gold transition-all duration-300 cursor-pointer"
                  aria-label="Next story"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
