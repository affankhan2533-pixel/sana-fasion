import type { Metadata } from "next";
import BrandStory from "@/components/BrandStory";
import LuxuryCTA from "@/components/LuxuryCTA";

export const metadata: Metadata = {
  title: "Our Story — Sana Fashion",
  description: "Discover the story behind Sana Fashion — a decade of craftsmanship, artistry, and premium luxury ethnic wear. From atelier to you.",
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "90px" }}>
      <BrandStory />
      <LuxuryCTA />
    </div>
  );
}
