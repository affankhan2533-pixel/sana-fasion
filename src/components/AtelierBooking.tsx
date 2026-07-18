"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomLuxuryButton from "@/components/LuxuryButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Mail,
  Check,
  ArrowRight,
  Calendar,
  Sparkles,
  Scissors,
  Flower2,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Icons ─────────────────────────────────────── */
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Data ───────────────────────────────────────── */
const consultationTypes = [
  {
    id: "bridal",
    icon: <Sparkles size={20} className="text-[#C8851A]" />,
    label: "Most Requested",
    title: "Bridal Trousseau Styling",
    duration: "90 min",
    tagline: "The Complete Bridal Experience",
    desc: "A private showroom session exclusively for the bride and her circle — featuring custom zardozi consultations, fabric curation, fitting sessions, and colour charting.",
    perks: ["Private Showroom Consultation", "Fabric Selection", "Master Tailor Fitting"],
  },
  {
    id: "festive",
    icon: <Flower2 size={20} className="text-[#C8851A]" />,
    label: "Custom Design",
    title: "Festive Couture Consult",
    duration: "60 min",
    tagline: "Ceremony-Ready, Effortlessly",
    desc: "Curated styling for bridesmaids, family ceremonies, and customised festival anarkalis, lehengas, and designer suit pairings.",
    perks: ["Curated Styling Suggestions", "Silhouette Personalisation", "Design Layouts"],
  },
  {
    id: "measurements",
    icon: <Scissors size={20} className="text-[#C8851A]" />,
    label: "Perfect Drape",
    title: "Bespoke Measurement & Fitting",
    duration: "45 min",
    tagline: "Tailored to Your Exact Silhouette",
    desc: "Our master tailor reviews your posture, structure, and hemlines to ensure your custom luxury pieces drape flawlessly.",
    perks: ["Master Tailor Fit Assessment", "Postural Hemline Adjustments", "Premium Finish"],
  },
];

const timeSlots = ["11:00 AM", "12:30 PM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"];

const STEPS = ["Consultation", "Date & Time", "Your Details"];

const atelier = {
  phone: "+91 98765 43210",
  email: "hello@sanafashion.in",
  instagram: "@sana___fashion___01",
  hours: [
    { day: "Monday – Friday", time: "10:00 AM – 7:00 PM" },
    { day: "Saturday", time: "10:00 AM – 8:00 PM" },
    { day: "Sunday", time: "11:00 AM – 6:00 PM" },
  ],
  stores: ["New Delhi — Lajpat Nagar Flagship", "Mumbai — Bandra West Atelier"],
  perks: [
    "Private lounge & complimentary chai",
    "Senior designer in attendance",
    "HD fabric & embroidery swatches",
    "Personalised moodboard curation",
  ],
};

/* ─── Gold Divider ───────────────────────────────── */
const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <span style={{ display: "block", width: 48, height: 1, background: "linear-gradient(to right, transparent, #C8851A)" }} />
    <span style={{ color: "#C8851A", fontSize: 10 }}>✦</span>
    <span style={{ display: "block", width: 48, height: 1, background: "linear-gradient(to left, transparent, #C8851A)" }} />
  </div>
);

/* ─── Step Indicator ─────────────────────────────── */
function StepIndicator({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 64 }}>
      {STEPS.map((name, idx) => {
        const num = idx + 1;
        const done = step > num;
        const active = step === num;
        return (
          <React.Fragment key={name}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Numbered circle */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done ? "#C8851A" : active ? "#1A0F0A" : "transparent",
                  border: `1.5px solid ${done ? "#C8851A" : active ? "#1A0F0A" : "rgba(200, 133, 26, 0.25)"}`,
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <Check size={12} color="#fff" />
                ) : (
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 13,
                    color: active ? "#fff" : "#C8851A",
                    fontWeight: 400,
                  }}>{num}</span>
                )}
              </div>
              {/* Label text */}
              <span style={{
                fontFamily: "var(--font-accent)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: active ? "#1A0F0A" : done ? "#C8851A" : "rgba(28, 14, 5, 0.35)",
                whiteSpace: "nowrap",
              }}>{name}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{
                height: 1,
                width: "clamp(30px, 5vw, 60px)",
                background: done ? "#C8851A" : "rgba(200, 133, 26, 0.15)",
                margin: "0 16px",
                transition: "background 0.4s",
                flexShrink: 0,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────── */
function LuxurySidebar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Experience Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #2E0D1A 0%, #1C0E05 100%)",
          border: "1px solid rgba(200, 133, 26, 0.25)",
          borderRadius: 16,
          padding: "36px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
        }}
      >
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200, 133, 26, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <p style={{ fontFamily: "var(--font-accent)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#E6C280", marginBottom: 16 }}>
          The Sana Experience
        </p>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 300, color: "#fff", lineHeight: 1.3, marginBottom: 6 }}>
          Crafted for You,
        </h3>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 300, color: "#E6C280", lineHeight: 1.3, marginBottom: 24, fontStyle: "italic" }}>
          Not Off the Rack
        </h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,251,244,0.6)", lineHeight: 1.8, marginBottom: 28, fontWeight: 300 }}>
          Every appointment is a curated moment — from chai served at the lounge to master craftspeople fitting your silhouette by hand.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {atelier.perks.map((perk) => (
            <div key={perk} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                background: "rgba(200,165,106,0.15)",
                border: "1px solid rgba(200,165,106,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Check size={9} color="#E6C280" />
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,251,244,0.85)", lineHeight: 1.5, fontWeight: 300 }}>{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Card */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid rgba(200, 133, 26, 0.15)",
        borderRadius: 16,
        padding: "32px",
        boxShadow: "0 8px 30px rgba(28, 14, 5, 0.02)"
      }}>
        <p style={{ fontFamily: "var(--font-accent)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8851A", marginBottom: 24 }}>
          Reach Us
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { icon: <Phone size={14} />, label: "Call", value: atelier.phone },
            { icon: <Mail size={14} />, label: "Email", value: atelier.email },
            { icon: <InstagramIcon />, label: "Instagram", value: atelier.instagram },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: "#FFFBF4",
                border: "1px solid rgba(200, 133, 26, 0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#C8851A",
              }}>
                {icon}
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-accent)", fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A6040", marginBottom: 2 }}>{label}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#1C0E05", fontWeight: 400 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(200, 133, 26, 0.1)", margin: "24px 0" }} />

        <p style={{ fontFamily: "var(--font-accent)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8851A", marginBottom: 18 }}>
          Our Ateliers
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {atelier.stores.map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <MapPin size={13} color="#C8A56A" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#5C3820", lineHeight: 1.6, fontWeight: 300 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hours Card */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid rgba(200, 133, 26, 0.15)",
        borderRadius: 16,
        padding: "32px",
        boxShadow: "0 8px 30px rgba(28, 14, 5, 0.02)"
      }}>
        <p style={{ fontFamily: "var(--font-accent)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8851A", marginBottom: 24 }}>
          Atelier Hours
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {atelier.hours.map(({ day, time }) => (
            <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8A6040", fontWeight: 300 }}>{day}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#1C0E05", fontWeight: 500 }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────── */
export default function AtelierBooking() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // GSAP scroll animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Hero fade up
      gsap.from(".atelier-hero-content > *", {
        y: 40, opacity: 0, duration: 1.1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: heroRef.current, start: "top 80%" },
      });

      // Cards stagger
      gsap.from(".consultation-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 75%" },
      });

      // Sidebar
      gsap.from(".sidebar-panel", {
        x: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: sidebarRef.current, start: "top 70%" },
      });
    });

    return () => ctx.revert();
  }, []);

  // Card hover GSAP
  const handleCardEnter = (id: string, el: HTMLElement) => {
    setHoveredCard(id);
    gsap.to(el, { y: -6, scale: 1.01, duration: 0.4, ease: "power2.out" });
  };
  const handleCardLeave = (el: HTMLElement) => {
    setHoveredCard(null);
    gsap.to(el, { y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
  };

  const getSelected = () => consultationTypes.find((c) => c.id === type);
  const canNext = (step === 1 && !!type) || (step === 2 && !!date && !!timeSlot) || step === 3;

  const handleConfirm = () => setConfirmed(true);
  const handleReset = () => {
    setStep(1); setType(""); setDate(""); setTimeSlot("");
    setName(""); setEmail(""); setPhone(""); setNotes("");
    setConfirmed(false);
  };

  return (
    <div style={{ background: "#FFFBF4", minHeight: "100vh" }}>

      {/* ── Hero ───────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          paddingTop: "clamp(120px,16vw,180px)",
          paddingBottom: "clamp(64px,10vw,110px)",
          textAlign: "center",
        }}
      >
        <div className="atelier-hero-content">
          <p style={{
            fontFamily: "var(--font-accent)",
            fontSize: 10,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#C8851A",
            marginBottom: 24,
          }}>
            Private Reservation
          </p>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(36px, 5.5vw, 68px)",
            fontWeight: 300,
            color: "#1C0E05",
            lineHeight: 1.15,
            letterSpacing: "-0.012em",
            margin: "0 auto 28px",
            maxWidth: 800,
            padding: "0 24px",
          }}>
            Book an Appointment
          </h1>

          <GoldDivider />

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(13px,1.4vw,15px)",
            color: "#7A6458",
            lineHeight: 1.85,
            maxWidth: 520,
            margin: "28px auto 0",
            padding: "0 24px",
            fontWeight: 300,
          }}>
            Every session is a curated journey — from moodboard creation to a private atelier fitting in our flagship boutiques.
          </p>
        </div>
      </div>

      {/* ── Content Grid ───────────────────────────── */}
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 clamp(20px,5vw,80px) clamp(80px,10vw,140px)",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr)",
        gap: 40,
      }}
        className="contact-grid"
      >
        {/* Left — Booking Form */}
        <div>
          {!confirmed ? (
            <>
              <StepIndicator step={step} />

              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8A6040", lineHeight: 1.7, fontWeight: 300 }}>
                        Choose the experience that best fits your couture journey.
                      </p>
                    </div>

                    <div ref={cardsRef} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                      {consultationTypes.map((c) => {
                        const isSelected = type === c.id;
                        return (
                          <div
                            key={c.id}
                            className="consultation-card"
                            onClick={() => setType(c.id)}
                            onMouseEnter={(e) => handleCardEnter(c.id, e.currentTarget as HTMLElement)}
                            onMouseLeave={(e) => handleCardLeave(e.currentTarget as HTMLElement)}
                            style={{
                              background: "#FFFFFF",
                              borderRadius: 16,
                              padding: "32px",
                              border: `1px solid ${isSelected ? "#C8851A" : "rgba(200, 133, 26, 0.12)"}`,
                              cursor: "pointer",
                              position: "relative",
                              overflow: "hidden",
                              boxShadow: isSelected
                                ? "0 12px 30px rgba(200, 133, 26, 0.06)"
                                : "0 4px 20px rgba(28, 14, 5, 0.015)",
                              transition: "border-color 0.35s, box-shadow 0.35s, transform 0.35s",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              gap: 20,
                            }}
                          >
                            {/* Duration Badge in top-right */}
                            <div style={{
                              position: "absolute", top: 32, right: 32,
                              background: isSelected ? "#C8851A" : "#FFFBF4",
                              borderRadius: 9999,
                              padding: "4px 12px",
                              fontFamily: "var(--font-accent)", fontSize: 9,
                              letterSpacing: "0.15em", textTransform: "uppercase",
                              color: isSelected ? "#FFFFFF" : "#C8851A",
                              transition: "all 0.3s",
                              border: "1px solid rgba(200, 133, 26, 0.15)",
                            }}>
                              {c.duration}
                            </div>

                            {/* Minimal Ivory Circle for icon */}
                            <div style={{
                              width: 48, height: 48, borderRadius: "50%",
                              background: "#FFFBF4",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              border: "1px solid rgba(200, 133, 26, 0.15)",
                              flexShrink: 0,
                            }}>
                              {c.icon}
                            </div>

                            {/* Info Block */}
                            <div style={{ width: "100%" }}>
                              <span style={{
                                fontFamily: "var(--font-accent)",
                                fontSize: 9,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: "#C8851A",
                                display: "block",
                                marginBottom: 6
                              }}>
                                {c.tagline}
                              </span>
                              <h3 style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "22px",
                                fontWeight: 400,
                                color: "#1C0E05",
                                marginBottom: 8,
                                lineHeight: 1.3
                              }}>
                                {c.title}
                              </h3>
                              <p style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "14px",
                                color: "#7A6458",
                                lineHeight: 1.7,
                                marginBottom: 16,
                                fontWeight: 300
                              }}>
                                {c.desc}
                              </p>

                              {/* Features / Perks */}
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {c.perks.map(perk => (
                                  <span key={perk} style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "11px",
                                    color: "#5C3820",
                                    background: "#FFFBF4",
                                    padding: "4px 12px",
                                    borderRadius: "9999px",
                                    border: "1px solid rgba(200, 133, 26, 0.08)",
                                    fontWeight: 300
                                  }}>
                                    ✓ {perk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                  >
                    {/* Selected summary pill */}
                    {getSelected() && (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 14,
                        background: "#ffffff", borderRadius: 12,
                        padding: "12px 24px",
                        border: "1px solid rgba(200, 133, 26, 0.15)",
                        marginBottom: 40,
                        width: "fit-content",
                        boxShadow: "0 4px 16px rgba(28, 14, 5, 0.015)",
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: "#FFFBF4",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "1px solid rgba(200, 133, 26, 0.1)",
                        }}>
                          {getSelected()?.icon}
                        </div>
                        <div>
                          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "#1C0E05" }}>{getSelected()?.title}</p>
                          <p style={{ fontFamily: "var(--font-accent)", fontSize: 9, color: "#C8851A", letterSpacing: "0.2em", textTransform: "uppercase" }}>{getSelected()?.duration} session</p>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="date-grid">
                      {/* Date */}
                      <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 32, border: "1px solid rgba(200, 133, 26, 0.12)", boxShadow: "0 8px 30px rgba(28, 14, 5, 0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FFFBF4", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(200, 133, 26, 0.1)" }}>
                            <Calendar size={14} color="#C8851A" />
                          </div>
                          <p style={{ fontFamily: "var(--font-accent)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8A6040" }}>Select Date</p>
                        </div>
                        <input
                          type="date"
                          value={date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setDate(e.target.value)}
                          style={{
                            width: "100%", padding: "14px 16px",
                            border: `1.5px solid ${date ? "#C8851A" : "rgba(200, 133, 26, 0.15)"}`,
                            borderRadius: 12, background: "#FFFBF4",
                            fontFamily: "var(--font-body)", fontSize: 14, color: "#1C0E05",
                            outline: "none", colorScheme: "light",
                            transition: "border-color 0.3s",
                          }}
                        />
                      </div>

                      {/* Time */}
                      <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 32, border: "1px solid rgba(200, 133, 26, 0.12)", boxShadow: "0 8px 30px rgba(28, 14, 5, 0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FFFBF4", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(200, 133, 26, 0.1)" }}>
                            <Clock size={14} color="#C8851A" />
                          </div>
                          <p style={{ fontFamily: "var(--font-accent)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8A6040" }}>Preferred Slot</p>
                        </div>
                        {date ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }} className="slots-grid">
                            {timeSlots.map((slot) => {
                              const active = timeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  onClick={() => setTimeSlot(slot)}
                                  style={{
                                    padding: "14px 10px",
                                    borderRadius: 9999,
                                    border: `1px solid ${active ? "#C8851A" : "rgba(200, 133, 26, 0.15)"}`,
                                    background: active ? "#C8851A" : "#FFFBF4",
                                    color: active ? "#FFFFFF" : "#5C3820",
                                    fontFamily: "var(--font-accent)", fontSize: 11,
                                    letterSpacing: "0.08em",
                                    cursor: "pointer",
                                    transition: "all 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                                    boxShadow: active ? "0 4px 12px rgba(200, 133, 26, 0.12)" : "none",
                                  }}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{
                            height: 120, display: "flex", alignItems: "center", justifyContent: "center",
                            border: "1px dashed rgba(200, 133, 26, 0.2)", borderRadius: 12,
                          }}>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8A6040", textAlign: "center", padding: "0 16px", fontWeight: 300 }}>
                              Choose a date first to see available slots
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8A6040", fontWeight: 300 }}>
                        A few details so we can personalise your atelier experience.
                      </p>
                    </div>

                    <div style={{
                      background: "#FFFFFF",
                      borderRadius: 16,
                      padding: "36px",
                      border: "1px solid rgba(200, 133, 26, 0.12)",
                      boxShadow: "0 8px 30px rgba(28, 14, 5, 0.02)"
                    }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }} className="details-grid">
                        <LuxuryField label="Full Name" value={name} onChange={setName} type="text" />
                        <LuxuryField label="Email Address" value={email} onChange={setEmail} type="email" />
                      </div>
                      <LuxuryField label="Contact Phone" value={phone} onChange={setPhone} type="tel" />
                      <LuxuryField label="Special Notes — Wedding date, fabric preferences, sizing concerns…" value={notes} onChange={setNotes} type="textarea" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Navigation ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(200, 133, 26, 0.12)", flexWrap: "wrap", gap: 16 }}>
                {step > 1 ? (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontFamily: "var(--font-accent)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "#8A6040", background: "none", border: "none", cursor: "pointer",
                      padding: "12px 0", transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C8851A")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8A6040")}
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <LuxuryButton
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext}
                    label="Continue"
                    icon={<ArrowRight size={14} />}
                    dark={false}
                  />
                ) : (
                  <LuxuryButton
                    onClick={handleConfirm}
                    disabled={!name || !email || !phone}
                    label="Complete Reservation"
                    icon={<Check size={14} />}
                    dark={true}
                  />
                )}
              </div>
            </>
          ) : (
            /* ── Confirmation ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              style={{ textAlign: "center", padding: "clamp(40px,6vw,80px) 0" }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
                style={{ marginBottom: 32 }}
              >
                <CheckCircle2 size={64} color="#C8851A" style={{ margin: "0 auto" }} />
              </motion.div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: "#1C0E05", marginBottom: 12 }}>
                Reservation Confirmed
              </h2>
              <GoldDivider className="my-5" />
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#7A6458", maxWidth: 400, margin: "20px auto 48px", lineHeight: 1.8, fontWeight: 300 }}>
                Your consultation has been registered. A confirmation voucher will be sent to your email shortly.
              </p>

              {/* Receipt */}
              <div style={{
                background: "#FFFFFF", borderRadius: 16, padding: 32, border: "1px solid rgba(200, 133, 26, 0.15)",
                maxWidth: 440, margin: "0 auto 40px", textAlign: "left",
                boxShadow: "0 8px 30px rgba(28, 14, 5, 0.02)",
              }}>
                <p style={{ fontFamily: "var(--font-accent)", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8851A", marginBottom: 24 }}>Consultation Receipt</p>
                {[
                  { k: "Service", v: getSelected()?.title },
                  { k: "Date", v: date },
                  { k: "Time", v: timeSlot },
                  { k: "Name", v: name },
                  { k: "Contact", v: phone },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(200,133,26,0.08)" }}>
                    <span style={{ fontFamily: "var(--font-accent)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8A6040" }}>{k}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#1C0E05" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
                  <MapPin size={11} color="#C8851A" />
                  <span style={{ fontFamily: "var(--font-accent)", fontSize: 11, color: "#C8851A", letterSpacing: "0.15em", textTransform: "uppercase" }}>Delhi & Mumbai Flagships</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                style={{
                  fontFamily: "var(--font-accent)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#C8851A", background: "none", border: "1.5px solid #C8851A",
                  borderRadius: 100, padding: "16px 36px", cursor: "pointer", transition: "all 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.backgroundColor = "#C8851A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#C8851A"; e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                Schedule Another Reservation
              </button>
            </motion.div>
          )}
        </div>

        {/* Right — Sidebar */}
        <div ref={sidebarRef} className="contact-sidebar">
          <LuxurySidebar />
        </div>
      </div>

      {/* ── Mobile sticky CTA ── */}
      {!confirmed && (
        <div className="mobile-sticky-cta" style={{ display: "none" }}>
          <LuxuryButton
            onClick={step < 3 ? () => setStep((s) => s + 1) : handleConfirm}
            disabled={!canNext || (step === 3 && (!name || !email || !phone))}
            label={step < 3 ? "Continue" : "Complete Reservation"}
            icon={step < 3 ? <ChevronRight size={14} /> : <Check size={14} />}
            dark={step === 3}
          />
        </div>
      )}

      {/* Inline CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&display=swap');

        .contact-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
            gap: 56px;
            align-items: start;
          }
          .contact-sidebar {
            position: sticky;
            top: 120px;
          }
        }

        @media (min-width: 640px) {
          .date-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .slots-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
          .mobile-sticky-cta {
            display: block !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            padding: 16px 20px;
            background: rgba(255, 251, 244, 0.96);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(200, 133, 26, 0.15);
            z-index: 100;
            box-shadow: 0 -8px 30px rgba(28, 14, 5, 0.05);
          }
          .mobile-sticky-cta > * {
            width: 100%;
            justify-content: center;
          }
        }

        .consultation-card:focus-visible {
          outline: 2px solid #C8851A;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

/* ─── Luxury Input Field ─────────────────────────── */
function LuxuryField({
  label, value, onChange, type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
}) {
  const [focused, setFocused] = useState(false);
  const isTextarea = type === "textarea";
  const isFilled = value !== undefined && value !== null && value.length > 0;

  return (
    <div style={{ position: "relative", marginBottom: 28 }}>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={4}
          style={{
            width: "100%",
            height: 140,
            padding: "20px 20px 12px 20px",
            border: `1.5px solid ${focused ? "#C8851A" : isFilled ? "#C8851A" : "rgba(200, 133, 26, 0.15)"}`,
            borderRadius: 12,
            background: "#FFFBF4",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#1C0E05",
            outline: "none",
            resize: "none",
            transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            lineHeight: 1.6,
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            height: 56,
            padding: "20px 20px 0 20px",
            border: `1.5px solid ${focused ? "#C8851A" : isFilled ? "#C8851A" : "rgba(200, 133, 26, 0.15)"}`,
            borderRadius: 12,
            background: "#FFFBF4",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#1C0E05",
            outline: "none",
            transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      )}
      <label
        style={{
          position: "absolute",
          left: 20,
          top: focused || isFilled ? 6 : 18,
          fontSize: focused || isFilled ? 9 : 12,
          fontFamily: "var(--font-accent)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: focused ? "#C8851A" : "#8A6040",
          pointerEvents: "none",
          transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {label}
      </label>
    </div>
  );
}

/* ─── Luxury Button ──────────────────────────────── */
function LuxuryButton({
  onClick, disabled, label, icon, dark,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  icon: React.ReactNode;
  dark: boolean;
}) {
  return (
    <CustomLuxuryButton
      variant={dark ? "primary" : "secondary"}
      themeType="light"
      onClick={onClick}
      disabled={disabled}
      className={`!h-[56px] !px-10 !rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        dark
          ? "!bg-[#C8851A] !text-[#1C0E05] hover:!bg-[#B07212] hover:translate-y-[-2px] hover:shadow-lg"
          : "!bg-transparent !border-[#C8851A] !text-[#C8851A] hover:!bg-[#C8851A] hover:!text-[#FFFFFF] hover:translate-y-[-2px]"
      }`}
    >
      <span className="flex items-center gap-2 font-accent text-xs tracking-[0.15em] uppercase font-medium">{label}</span>
      {icon}
    </CustomLuxuryButton>
  );
}
