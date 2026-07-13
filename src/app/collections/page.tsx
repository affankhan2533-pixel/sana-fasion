import type { Metadata } from "next";
import { Suspense } from "react";
import CollectionsPageContent from "@/components/CollectionsPageContent";

export const metadata: Metadata = {
  title: "Collections — Sana Fashion",
  description: "Browse our full range of luxury collections — bridal lehengas, festive anarkalis, designer suits, and new arrivals. Every piece is a work of art.",
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh", background: "var(--cream)" }} />}>
      <CollectionsPageContent />
    </Suspense>
  );
}
