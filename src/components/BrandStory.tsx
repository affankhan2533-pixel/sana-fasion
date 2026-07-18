"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const stats = [
  { value: "10+", label: "Years of Craft" },
  { value: "5,000+", label: "Happy Brides" },
  { value: "200+", label: "Designs Each Season" },
  { value: "3", label: "Flagship Stores" },
];

const craftPoints = [
  { num: "01", title: "Design", desc: "Every piece begins with a hand-drawn sketch, guided by seasonal inspiration and your vision." },
  { num: "02", title: "Source", desc: "We travel to Banaras, Jaipur, and Lucknow to handpick the finest silk, zardozi, and thread." },
  { num: "03", title: "Craft", desc: "Master artisans spend 150–400 hours on each piece, ensuring every stitch is a legacy." },
  { num: "04", title: "Deliver", desc: "Your ensemble arrives in a luxury keepsake box, ready for its grand moment." },
];

const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function BrandStory() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} style={{ background: "linear-gradient(135deg, #2E0D1A 0%, #1C0E05 50%, #1A0A00 100%)", position: "relative", overflow: "hidden" }} className="py-10">
      {/* Gold shimmer texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(45deg, var(--gold) 0px, var(--gold) 1px, transparent 0px, transparent 50%)",
        backgroundSize: "20px 20px",
      }} />

      {/* Stats strip */}
      <div className="relative z-10 border-b" style={{ borderColor: "rgba(200,133,26,0.15)" }}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerParent}
          className="container mx-auto grid grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s, index) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className={`px-6 sm:px-10 py-12 sm:py-16 md:py-20 text-center flex flex-col items-center justify-center border-t border-l border-r border-b border-transparent ${
                index % 2 === 0 ? "border-r-[rgba(200,133,26,0.15)]" : ""
              } ${
                index < 2 ? "border-b-[rgba(200,133,26,0.15)]" : ""
              } lg:border-r-[rgba(200,133,26,0.15)] lg:border-b-0 last:border-r-0`}
            >
              <div className="font-serif mb-2" style={{ fontSize: "clamp(36px, 6vw, 56px)", color: "#E6C280", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div className="font-accent text-[10px] tracking-[0.25em] uppercase text-[#FFFBF4]/50 leading-relaxed max-w-[180px] mx-auto">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Main content */}
      <div className="section container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Left — story */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerParent}
            className="flex flex-col pr-0 lg:pr-6"
          >
            <motion.span variants={fadeUp} className="label block mb-6 font-accent text-[11px] tracking-[0.25em] uppercase text-[#E6C280] font-bold">
              Our Story
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-5xl lg:text-6xl mb-8 sm:mb-10 text-white font-light leading-tight">
              A Decade of{" "}
              <em style={{ color: "#E6C280", fontStyle: "italic", fontWeight: 300 }}>Artistry</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="font-body text-sm mb-6 sm:mb-8 max-w-lg" style={{ color: "rgba(255,248,240,0.65)", lineHeight: 1.85, fontWeight: 300 }}>
              Sana Fashion was born from a love of heritage craftsmanship and modern elegance. Founded in 2015, we&apos;ve spent over a decade perfecting the art of luxury ethnic wear that tells a woman&apos;s story.
            </motion.p>
            <motion.p variants={fadeUp} className="font-body text-sm mb-12 sm:mb-16 max-w-lg" style={{ color: "rgba(255,248,240,0.55)", lineHeight: 1.85, fontWeight: 300 }}>
              Every lehenga, suit, and anarkali that leaves our atelier carries the fingerprints of generations of master craftspeople — a living tribute to India&apos;s rich textile heritage.
            </motion.p>

            {/* Craft process */}
            <motion.div variants={staggerParent} className="flex flex-col gap-10 sm:gap-12 mt-4">
              {craftPoints.map((point) => (
                <motion.div
                  key={point.num}
                  variants={fadeUp}
                  className="flex items-center gap-6 sm:gap-8 pb-8 border-b border-[#E6C280]/10 last:border-0 last:pb-0"
                >
                  {/* Large luxury gold number */}
                  <span className="font-serif text-4xl sm:text-5xl md:text-6xl flex-shrink-0 text-[#E6C280] font-light tracking-wide leading-none" style={{ width: "64px" }}>
                    {point.num}
                  </span>

                  {/* Thin vertical divider */}
                  <span className="w-[1px] h-12 bg-[#E6C280]/20 flex-shrink-0" />

                  {/* Text group */}
                  <div className="flex-grow pl-2">
                    <h4 className="font-serif text-lg tracking-[0.15em] uppercase mb-1 sm:mb-2 text-[#FFF5E6] font-medium">
                      {point.title}
                    </h4>
                    <p className="font-body text-sm" style={{ color: "rgba(255,248,240,0.5)", lineHeight: 1.7, fontWeight: 300 }}>
                      {point.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — image with parallax */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative order-first lg:order-last"
          >
            {/* Decorative frame */}
            <div className="absolute -top-4 -left-4 -bottom-4 -right-4 border border-dashed opacity-10 rounded-[20px]" style={{ borderColor: "#E6C280" }} />

            {/* Main image */}
            <div className="relative overflow-hidden rounded-[16px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.65)] border border-[#E6C280]/10" style={{ aspectRatio: "3/4" }}>
              <motion.div className="absolute inset-0" style={{ y: imgY }}>
                <Image
                  src="/images/models/brand-story.jpg"
                  alt="Sana Fashion Atelier"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
              {/* Warm overlay */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(200,133,26,0.15) 0%, transparent 60%)", mixBlendMode: "multiply" }} />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -3 }}
              animate={isInView ? { opacity: 1, y: 0, rotate: -3 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute -bottom-5 -left-5 sm:-bottom-7 sm:-left-7 p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.3)] rounded-[4px]"
              style={{ background: "#E6C280", maxWidth: "160px" }}
            >
              <p className="font-accent text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "#1C0E05" }}>Est.</p>
              <p className="font-serif text-3xl" style={{ color: "#1C0E05", lineHeight: 1, fontWeight: 300 }}>2015</p>
              <p className="font-accent text-[9px] tracking-[0.15em] mt-1" style={{ color: "rgba(28,16,8,0.7)" }}>Premium Atelier</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
