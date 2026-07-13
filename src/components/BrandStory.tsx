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
    <section ref={ref} style={{ background: "linear-gradient(135deg, #2E0D1A 0%, #1C0E05 50%, #1A0A00 100%)", position: "relative", overflow: "hidden" }}>
      {/* Gold shimmer texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(45deg, var(--gold) 0px, var(--gold) 1px, transparent 0px, transparent 50%)",
        backgroundSize: "20px 20px",
      }} />

      {/* Stats strip */}
      <div className="relative z-10 border-b" style={{ borderColor: "rgba(200,133,26,0.2)" }}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerParent}
          className="container mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-[rgba(201,151,59,0.15)]"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="px-5 sm:px-8 py-8 sm:py-10 text-center"
              style={{ borderColor: "rgba(201,151,59,0.15)" }}
            >
              <div className="font-display mb-1" style={{ fontSize: "clamp(28px,5vw,52px)", color: "var(--gold)", fontWeight: 400 }}>
                {s.value}
              </div>
              <div className="font-accent text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,248,240,0.4)" }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Main content */}
      <div className="section container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — story */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerParent}
          >
            <motion.span variants={fadeUp} className="label block mb-5">
              Our Story
            </motion.span>
            <motion.h2 variants={fadeUp} className="heading-xl mb-6 sm:mb-8" style={{ color: "white" }}>
              A Decade of{" "}
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Artistry</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="body-sm mb-4 sm:mb-6 max-w-md" style={{ color: "rgba(255,248,240,0.55)" }}>
              Sana Fashion was born from a love of heritage craftsmanship and modern elegance. Founded in 2015, we&apos;ve spent over a decade perfecting the art of luxury ethnic wear that tells a woman&apos;s story.
            </motion.p>
            <motion.p variants={fadeUp} className="body-sm mb-8 sm:mb-12 max-w-md" style={{ color: "rgba(255,248,240,0.45)" }}>
              Every lehenga, suit, and anarkali that leaves our atelier carries the fingerprints of generations of master craftspeople — a living tribute to India&apos;s rich textile heritage.
            </motion.p>

            {/* Craft process */}
            <motion.div variants={staggerParent} className="flex flex-col gap-6 sm:gap-8">
              {craftPoints.map((point) => (
                <motion.div
                  key={point.num}
                  variants={fadeUp}
                  className="flex items-start gap-4 sm:gap-6"
                >
                  <span className="font-display text-4xl sm:text-5xl flex-shrink-0" style={{ color: "rgba(201,151,59,0.2)", lineHeight: 1 }}>
                    {point.num}
                  </span>
                  <div>
                    <h4 className="font-display mb-1 sm:mb-2" style={{ fontSize: "18px", color: "var(--gold-light)" }}>
                      {point.title}
                    </h4>
                    <p className="font-body text-sm" style={{ color: "rgba(255,248,240,0.45)", lineHeight: 1.7 }}>
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
            <div className="absolute -top-3 -left-3 -bottom-3 -right-3 border border-dashed opacity-20" style={{ borderColor: "var(--gold)" }} />

            {/* Main image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
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
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(201,151,59,0.15) 0%, transparent 60%)", mixBlendMode: "multiply" }} />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -3 }}
              animate={isInView ? { opacity: 1, y: 0, rotate: -3 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 p-4 sm:p-5"
              style={{ background: "var(--gold)", maxWidth: "160px" }}
            >
              <p className="font-accent text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--ink)" }}>Est.</p>
              <p className="font-display text-3xl" style={{ color: "var(--ink)", lineHeight: 1 }}>2015</p>
              <p className="font-accent text-[9px] tracking-[0.15em] mt-1" style={{ color: "rgba(28,16,8,0.7)" }}>Premium Atelier</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
