"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FadeInUp } from "@/components/ui/animations";

interface SearchSectionProps {
  onLocationChange?: (lat: number, lng: number) => void;
  userLocation?: { lat: number; lng: number } | null;
}

export function SearchSection({ onLocationChange, userLocation }: SearchSectionProps) {
  const [productQuery, setProductQuery] = useState("");
  const [shopQuery, setShopQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const router = useRouter();

  const handleNearMe = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onLocationChange?.(latitude, longitude);
        router.push(`/products?lat=${latitude}&lng=${longitude}`);
        setLocating(false);
      },
      () => {
        alert("Unable to get your location.");
        setLocating(false);
      }
    );
  };

  const handleProductSearch = () => {
    const params = new URLSearchParams();
    if (productQuery) params.set("q", productQuery);
    if (userLocation) {
      params.set("lat", String(userLocation.lat));
      params.set("lng", String(userLocation.lng));
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleShopSearch = () => {
    const params = new URLSearchParams();
    if (shopQuery) params.set("q", shopQuery);
    if (userLocation) {
      params.set("lat", String(userLocation.lat));
      params.set("lng", String(userLocation.lng));
    }
    router.push(`/shops?${params.toString()}`);
  };

  return (
    <FadeInUp delay={0.2} className="container mx-auto px-4 py-12 relative z-20 -mt-10">
      <section className="bg-folk-ochre rounded-[1rem_2rem_1rem_2rem] border-[3px] border-dashed border-folk-mustard p-8 shadow-[6px_6px_0_hsl(var(--folk-terracotta))] backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 folk-texture-grain opacity-30 pointer-events-none" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Product Search</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products like Saree, Kurta, Shirt"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleProductSearch()}
                  className="pl-9 border-2 border-primary/30"
                />
              </div>
              <Button onClick={handleProductSearch} className="folk-border">Search</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Shop Search</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search shop names like Gupta Textiles"
                  value={shopQuery}
                  onChange={(e) => setShopQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleShopSearch()}
                  className="pl-9 border-2 border-primary/30"
                />
              </div>
              <Button onClick={handleShopSearch} className="folk-border">Search</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <Button
              variant="outline"
              className="w-full gap-2 folk-border border-2"
              onClick={handleNearMe}
              disabled={locating}
            >
              <MapPin className="h-4 w-4" />
              {locating ? "Locating..." : "Near Me"}
            </Button>
          </div>
        </div>
      </section>
    </FadeInUp>
  );
}
