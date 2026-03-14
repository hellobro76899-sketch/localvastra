"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { SearchSection } from "@/components/home/SearchSection";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Slider } from "@/components/ui/slider";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [radius, setRadius] = useState(10);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
    else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => {}
      );
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-6">
          Browse Products
        </motion.h1>
        <SearchSection onLocationChange={(lat, lng) => setUserLocation({ lat, lng })} userLocation={userLocation} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Search radius: {radius} km</label>
            <Slider value={[radius]} onValueChange={([v]) => setRadius(v)} min={1} max={10} step={1} className="w-32" />
          </div>
        </motion.div>

        <ProductGrid userLocation={userLocation} radius={radius} category={category || undefined} key={`${radius}-${category}`} />
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
