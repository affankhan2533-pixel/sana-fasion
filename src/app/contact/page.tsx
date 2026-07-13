import type { Metadata } from "next";
import AtelierBooking from "@/components/AtelierBooking";

export const metadata: Metadata = {
  title: "Book Private Atelier Consultation — Sana Fashion",
  description:
    "Schedule your private bridal trousseau, measurements, or festive styling consultation at our Delhi or Mumbai flagship boutiques.",
};

export default function ContactPage() {
  return (
    <main
      style={{
        background: "#F8F5F0",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <AtelierBooking />
    </main>
  );
}
