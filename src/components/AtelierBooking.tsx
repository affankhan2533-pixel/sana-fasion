"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    emoji: "💍",
    label: "Most Requested",
    title: "Bridal Trousseau Styling",
    duration: "90 min",
    tagline: "The Complete Bridal Experience",
    desc: "A private showroom session exclusively for the bride and her circle — featuring custom zardozi consultations, fabric curation, fitting sessions, and colour charting.",
  },
  {
    id: "festive",
    emoji: "🌸",
    label: "",
    title: "Festive Couture Consult",
    duration: "60 min",
    tagline: "Ceremony-Ready, Effortlessly",
    desc: "Curated styling for bridesmaids, family ceremonies, and customised festival anarkalis, lehengas, and designer suit pairings.",
  },
  {
    id: "measurements",
    emoji: "✦",
    label: "",
    title: "Bespoke Measurement & Fitting",
    duration: "45 min",
    tagline: "Tailored to Your Exact Silhouette",
    desc: "Our master tailor reviews your posture, structure, and hemlines to ensure your custom luxury pieces drape flawlessly.",
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
    <span style={{ display: "block", width: 48, height: 1, background: "linear-gradient(to right, transparent, #C8A56A)" }} />
    <span style={{ color: "#C8A56A", fontSize: 10 }}>✦</span>
    <span style={{ display: "block", width: 48, height: 1, background: "linear-gradient(to left, transparent, #C8A56A)" }} />
  </div>
);

/* ─── Step Indicator ─────────────────────────────── */
function StepIndicator({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 56 }}>
      {STEPS.map((name, idx) => {
        const num = idx + 1;
        const done = step > num;
        const active = step === num;
        return (
          <React.Fragment key={name}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done ? "#C8A56A" : active ? "#1A1A1A" : "transparent",
                  border: `1.5px solid ${done || active ? (done ? "#C8A56A" : "#1A1A1A") : "rgba(26,26,26,0.2)"}`,
                  transition: "all 0.5s cubic-bezier(0.76,0,0.24,1)",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <Check size={16} color="#fff" />
                ) : (
                  <span style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 15,
                    color: active ? "#fff" : "rgba(26,26,26,0.35)",
                    fontWeight: 400,
                  }}>{num}</span>
                )}
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: active ? "#1A1A1A" : done ? "#C8A56A" : "rgba(26,26,26,0.35)",
                whiteSpace: "nowrap",
              }}>{name}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{
                height: 1,
                width: "clamp(40px,6vw,80px)",
                background: done ? "#C8A56A" : "rgba(26,26,26,0.12)",
                marginBottom: 24,
                transition: "background 0.5s",
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Experience Card */}
      <div
        style={{
          background: "linear-gradient(145deg, #1A1A1A 0%, #2D2D2D 100%)",
          border: "1px solid rgba(200,165,106,0.25)",
          borderRadius: 20,
          padding: "36px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gold glow */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,165,106,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <p style={{ fontFamily: "Inter", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8A56A", marginBottom: 16 }}>
          The Sana Experience
        </p>
        <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 400, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>
          Crafted for You,
        </h3>
        <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 400, color: "#C8A56A", lineHeight: 1.3, marginBottom: 24, fontStyle: "italic" }}>
          Not Off the Rack
        </h3>
        <p style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,251,244,0.55)", lineHeight: 1.9, marginBottom: 28 }}>
          Every appointment is a curated moment — from chai served at the lounge to master craftspeople fitting your silhouette by hand.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {atelier.perks.map((perk) => (
            <div key={perk} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                background: "rgba(200,165,106,0.15)",
                border: "1px solid rgba(200,165,106,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Check size={9} color="#C8A56A" />
              </div>
              <span style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,251,244,0.7)", lineHeight: 1.6 }}>{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Card */}
      <div style={{
        background: "#fff",
        border: "1px solid rgba(200,165,106,0.15)",
        borderRadius: 20,
        padding: "28px 28px",
      }}>
        <p style={{ fontFamily: "Inter", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8A56A", marginBottom: 22 }}>
          Reach Us
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { icon: <Phone size={13} />, label: "Call", value: atelier.phone },
            { icon: <Mail size={13} />, label: "Email", value: atelier.email },
            { icon: <InstagramIcon />, label: "Instagram", value: atelier.instagram },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "#F8F5F0",
                border: "1px solid rgba(200,165,106,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#C8A56A",
              }}>
                {icon}
              </div>
              <div>
                <p style={{ fontFamily: "Inter", fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9B8B7A", marginBottom: 2 }}>{label}</p>
                <p style={{ fontFamily: "Inter", fontSize: 13, color: "#1A1A1A" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(200,165,106,0.12)", margin: "22px 0" }} />

        <p style={{ fontFamily: "Inter", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8A56A", marginBottom: 16 }}>
          Our Ateliers
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {atelier.stores.map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <MapPin size={12} color="#C8A56A" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontFamily: "Inter", fontSize: 12, color: "#4A3D33", lineHeight: 1.6 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hours Card */}
      <div style={{
        background: "#fff",
        border: "1px solid rgba(200,165,106,0.15)",
        borderRadius: 20,
        padding: "28px 28px",
      }}>
        <p style={{ fontFamily: "Inter", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8A56A", marginBottom: 22 }}>
          Atelier Hours
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {atelier.hours.map(({ day, time }) => (
            <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "Inter", fontSize: 12, color: "#9B8B7A" }}>{day}</span>
              <span style={{ fontFamily: "Inter", fontSize: 12, color: "#1A1A1A", fontWeight: 500 }}>{time}</span>
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
    <div style={{ background: "#F8F5F0", minHeight: "100vh" }}>

      {/* ── Hero ───────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          paddingTop: "clamp(100px,14vw,160px)",
          paddingBottom: "clamp(56px,8vw,96px)",
          textAlign: "center",
        }}
      >
        <div className="atelier-hero-content">
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#C8A56A",
            marginBottom: 20,
          }}>
            Private Reservation
          </p>

          <h1 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(38px, 6vw, 76px)",
            fontWeight: 400,
            color: "#1A1A1A",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            margin: "0 auto 24px",
            maxWidth: 680,
            padding: "0 24px",
          }}>
            Book an Appointment
          </h1>

          <GoldDivider />

          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(13px,1.5vw,15px)",
            color: "#6B5B4E",
            lineHeight: 1.85,
            maxWidth: 480,
            margin: "24px auto 0",
            padding: "0 24px",
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
        gap: 32,
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
                    <div style={{ textAlign: "center", marginBottom: 40 }}>
                      <p style={{ fontFamily: "Inter", fontSize: 13, color: "#9B8B7A", lineHeight: 1.7 }}>
                        Choose the experience that best fits your couture journey.
                      </p>
                    </div>

                    <div ref={cardsRef} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                              background: "#fff",
                              borderRadius: 20,
                              padding: "clamp(24px,3vw,36px) clamp(24px,3vw,40px)",
                              border: `1.5px solid ${isSelected ? "#C8A56A" : "rgba(200,165,106,0.18)"}`,
                              cursor: "pointer",
                              position: "relative",
                              overflow: "hidden",
                              boxShadow: isSelected
                                ? "0 12px 48px rgba(200,165,106,0.18)"
                                : "0 2px 16px rgba(26,26,26,0.05)",
                              transition: "border-color 0.3s, box-shadow 0.3s",
                              minHeight: 180,
                              display: "flex",
                              alignItems: "center",
                              gap: 28,
                            }}
                          >
                            {/* Subtle gold shine on selected */}
                            {isSelected && (
                              <div style={{
                                position: "absolute", inset: 0, pointerEvents: "none",
                                background: "linear-gradient(135deg, rgba(200,165,106,0.05) 0%, transparent 60%)",
                              }} />
                            )}

                            {/* Duration badge */}
                            <div style={{
                              position: "absolute", top: 20, right: 20,
                              background: isSelected ? "#C8A56A" : "#F8F5F0",
                              borderRadius: 100,
                              padding: "5px 14px",
                              fontFamily: "Inter", fontSize: 9,
                              letterSpacing: "0.18em", textTransform: "uppercase",
                              color: isSelected ? "#fff" : "#9B8B7A",
                              transition: "all 0.3s",
                            }}>
                              {c.duration}
                            </div>

                            {/* Label badge */}
                            {c.label && (
                              <div style={{
                                position: "absolute", top: 20, left: 20,
                                background: "#1A1A1A",
                                borderRadius: 100,
                                padding: "4px 12px",
                                fontFamily: "Inter", fontSize: 8,
                                letterSpacing: "0.2em", textTransform: "uppercase",
                                color: "#C8A56A",
                              }}>
                                {c.label}
                              </div>
                            )}

                            {/* Emoji */}
                            <div style={{
                              fontSize: 32, flexShrink: 0,
                              width: 64, height: 64, borderRadius: 16,
                              background: "#F8F5F0",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {c.emoji}
                            </div>

                            {/* Text */}
                            <div style={{ flex: 1, paddingRight: 80 }}>
                              <p style={{ fontFamily: "Inter", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C8A56A", marginBottom: 6 }}>
                                {c.tagline}
                              </p>
                              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 400, color: "#1A1A1A", marginBottom: 10, lineHeight: 1.2 }}>
                                {c.title}
                              </h3>
                              <p style={{ fontFamily: "Inter", fontSize: 13, color: "#6B5B4E", lineHeight: 1.75 }}>
                                {c.desc}
                              </p>
                            </div>

                            {/* Selected check */}
                            <div style={{
                              position: "absolute", bottom: 20, right: 24,
                              opacity: isSelected ? 1 : 0,
                              transition: "opacity 0.3s",
                            }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: "50%",
                                background: "#C8A56A", display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <Check size={12} color="#fff" />
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
                        background: "#fff", borderRadius: 100,
                        padding: "12px 24px",
                        border: "1px solid rgba(200,165,106,0.2)",
                        marginBottom: 40,
                        width: "fit-content",
                      }}>
                        <span style={{ fontSize: 18 }}>{getSelected()?.emoji}</span>
                        <div>
                          <p style={{ fontFamily: "Playfair Display, serif", fontSize: 15, color: "#1A1A1A" }}>{getSelected()?.title}</p>
                          <p style={{ fontFamily: "Inter", fontSize: 10, color: "#C8A56A", letterSpacing: "0.2em", textTransform: "uppercase" }}>{getSelected()?.duration} session</p>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="date-grid">
                      {/* Date */}
                      <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid rgba(200,165,106,0.15)", boxShadow: "0 2px 16px rgba(26,26,26,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#F8F5F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Calendar size={14} color="#C8A56A" />
                          </div>
                          <p style={{ fontFamily: "Inter", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "#9B8B7A" }}>Select Date</p>
                        </div>
                        <input
                          type="date"
                          value={date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setDate(e.target.value)}
                          style={{
                            width: "100%", padding: "14px 16px",
                            border: `1.5px solid ${date ? "#C8A56A" : "rgba(200,165,106,0.25)"}`,
                            borderRadius: 12, background: "#F8F5F0",
                            fontFamily: "Inter", fontSize: 14, color: "#1A1A1A",
                            outline: "none", colorScheme: "light",
                            transition: "border-color 0.3s",
                          }}
                        />
                      </div>

                      {/* Time */}
                      <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid rgba(200,165,106,0.15)", boxShadow: "0 2px 16px rgba(26,26,26,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#F8F5F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Clock size={14} color="#C8A56A" />
                          </div>
                          <p style={{ fontFamily: "Inter", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "#9B8B7A" }}>Preferred Slot</p>
                        </div>
                        {date ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }} className="slots-grid">
                            {timeSlots.map((slot) => {
                              const active = timeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  onClick={() => setTimeSlot(slot)}
                                  style={{
                                    padding: "13px 8px",
                                    borderRadius: 12,
                                    border: `1.5px solid ${active ? "#C8A56A" : "rgba(200,165,106,0.2)"}`,
                                    background: active ? "#C8A56A" : "#F8F5F0",
                                    color: active ? "#fff" : "#6B5B4E",
                                    fontFamily: "Inter", fontSize: 12,
                                    letterSpacing: "0.05em",
                                    cursor: "pointer",
                                    transition: "all 0.25s",
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
                            border: "1.5px dashed rgba(200,165,106,0.2)", borderRadius: 12,
                          }}>
                            <p style={{ fontFamily: "Inter", fontSize: 12, color: "#9B8B7A", textAlign: "center", padding: "0 16px" }}>
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
                    <div style={{ textAlign: "center", marginBottom: 40 }}>
                      <p style={{ fontFamily: "Inter", fontSize: 13, color: "#9B8B7A" }}>
                        A few details so we can personalise your atelier experience.
                      </p>
                    </div>

                    <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(28px,4vw,48px)", border: "1px solid rgba(200,165,106,0.15)", boxShadow: "0 2px 24px rgba(26,26,26,0.05)" }}>
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(200,165,106,0.15)", flexWrap: "wrap", gap: 16 }}>
                {step > 1 ? (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontFamily: "Inter", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "#9B8B7A", background: "none", border: "none", cursor: "pointer",
                      padding: "12px 0", transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9B8B7A")}
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
                <CheckCircle2 size={64} color="#C8A56A" style={{ margin: "0 auto" }} />
              </motion.div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "#1A1A1A", marginBottom: 12 }}>
                Reservation Confirmed
              </h2>
              <GoldDivider className="my-5" />
              <p style={{ fontFamily: "Inter", fontSize: 14, color: "#6B5B4E", maxWidth: 400, margin: "20px auto 48px", lineHeight: 1.8 }}>
                Your consultation has been registered. A confirmation voucher will be sent to your email shortly.
              </p>

              {/* Receipt */}
              <div style={{
                background: "#fff", borderRadius: 20, padding: 32, border: "1px solid rgba(200,165,106,0.18)",
                maxWidth: 440, margin: "0 auto 40px", textAlign: "left",
                boxShadow: "0 4px 32px rgba(26,26,26,0.06)",
              }}>
                <p style={{ fontFamily: "Inter", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8A56A", marginBottom: 24 }}>Consultation Receipt</p>
                {[
                  { k: "Service", v: getSelected()?.title },
                  { k: "Date", v: date },
                  { k: "Time", v: timeSlot },
                  { k: "Name", v: name },
                  { k: "Contact", v: phone },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(200,165,106,0.1)" }}>
                    <span style={{ fontFamily: "Inter", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9B8B7A" }}>{k}</span>
                    <span style={{ fontFamily: "Inter", fontSize: 13, color: "#1A1A1A" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
                  <MapPin size={11} color="#C8A56A" />
                  <span style={{ fontFamily: "Inter", fontSize: 11, color: "#C8A56A", letterSpacing: "0.15em", textTransform: "uppercase" }}>Delhi & Mumbai Flagships</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                style={{
                  fontFamily: "Inter", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#9B8B7A", background: "none", border: "1.5px solid rgba(200,165,106,0.3)",
                  borderRadius: 100, padding: "14px 32px", cursor: "pointer", transition: "all 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#1A1A1A"; e.currentTarget.style.borderColor = "#C8A56A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#9B8B7A"; e.currentTarget.style.borderColor = "rgba(200,165,106,0.3)"; }}
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
            gap: 48px;
            align-items: start;
          }
          .contact-sidebar {
            position: sticky;
            top: 96px;
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
            background: rgba(248,245,240,0.95);
            backdrop-filter: blur(16px);
            border-top: 1px solid rgba(200,165,106,0.2);
            z-index: 100;
          }
          .mobile-sticky-cta > * {
            width: 100%;
            justify-content: center;
          }
        }

        .consultation-card:focus-visible {
          outline: 2px solid #C8A56A;
          outline-offset: 2px;
        }
        .luxury-input:focus {
          border-color: #C8A56A !important;
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
  const isTextarea = type === "textarea";
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{
        fontFamily: "Inter", fontSize: 9, letterSpacing: "0.22em",
        textTransform: "uppercase", color: "#9B8B7A", display: "block", marginBottom: 10,
      }}>
        {label}
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="luxury-input"
          style={{
            width: "100%", padding: "14px 16px",
            border: "1.5px solid rgba(200,165,106,0.25)",
            borderRadius: 12, background: "#F8F5F0",
            fontFamily: "Inter", fontSize: 14, color: "#1A1A1A",
            outline: "none", resize: "none",
            transition: "border-color 0.3s",
            lineHeight: 1.6,
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="luxury-input"
          style={{
            width: "100%", padding: "14px 16px",
            border: `1.5px solid ${value ? "#C8A56A" : "rgba(200,165,106,0.25)"}`,
            borderRadius: 12, background: "#F8F5F0",
            fontFamily: "Inter", fontSize: 14, color: "#1A1A1A",
            outline: "none",
            transition: "border-color 0.3s",
          }}
        />
      )}
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
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "15px 36px",
        borderRadius: 100,
        background: disabled ? "rgba(200,165,106,0.2)" : dark ? "#1A1A1A" : "#C8A56A",
        color: disabled ? "#9B8B7A" : "#fff",
        fontFamily: "Inter", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.35s cubic-bezier(0.76,0,0.24,1)",
        boxShadow: disabled ? "none" : dark ? "0 8px 32px rgba(26,26,26,0.3)" : "0 8px 32px rgba(200,165,106,0.35)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          gsap.to(e.currentTarget, { scale: 1.03, duration: 0.3, ease: "power2.out" });
        }
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
      }}
    >
      {label} {icon}
    </button>
  );
}
