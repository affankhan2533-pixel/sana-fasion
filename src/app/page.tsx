"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import HeroSection from "@/components/HeroSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import RunwaySection from "@/components/RunwaySection";
import EditorialShowcase from "@/components/EditorialShowcase";
import BestSellers from "@/components/BestSellers";
import DressSpotlight from "@/components/DressSpotlight";
import InstagramGallery from "@/components/InstagramGallery";
import Testimonials from "@/components/Testimonials";
import LuxuryCTA from "@/components/LuxuryCTA";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      <HeroSection isLoaded={!loading} />
      <FeaturedCollections />
      <RunwaySection />
      <EditorialShowcase />
      <BestSellers />
      <DressSpotlight />
      <InstagramGallery />
      <Testimonials />
      <LuxuryCTA />
    </>
  );
}
