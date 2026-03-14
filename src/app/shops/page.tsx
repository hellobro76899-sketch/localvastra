"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { SearchSection } from "@/components/home/SearchSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface Shop {
  id: string;
  name: string;
  description?: string;
  address?: string;
  location?: { lat: number; lng: number };
  distance?: number;
}

function ShopsContent() {
  const searchParams = useSearchParams();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(10);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (userLocation) {
      params.set("lat", String(userLocation.lat));
      params.set("lng", String(userLocation.lng));
      params.set("radius", String(radius));
    }
    fetch(`/api/shops?${params}`)
      .then((r) => r.json())
      .then((data) => setShops(Array.isArray(data) ? data : []))
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  }, [userLocation, radius, query]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (userLocation) {
      params.set("lat", String(userLocation.lat));
      params.set("lng", String(userLocation.lng));
    }
    window.location.href = `/shops?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-6">
          Nearby Shops
        </motion.h1>
        <SearchSection onLocationChange={(lat, lng) => setUserLocation({ lat, lng })} userLocation={userLocation} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex flex-wrap items-center gap-6">
          <div className="flex gap-2 flex-1 min-w-[200px]">
            <Input placeholder="Search shop names" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Radius: {radius} km</label>
            <Slider value={[radius]} onValueChange={([v]) => setRadius(v)} min={1} max={10} step={1} className="w-32" />
          </div>
        </motion.div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : shops.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No shops found</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop, i) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="rounded-xl border bg-card p-4 shadow-sm"
              >
                <h3 className="font-semibold">{shop.name}</h3>
                {shop.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{shop.description}</p>}
                {shop.address && <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{shop.address}</p>}
                {shop.distance !== undefined && <p className="mt-1 text-sm">{shop.distance.toFixed(1)} km away</p>}
                {shop.location && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shop.location.lat},${shop.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="mt-3 gap-1"><MapPin className="h-4 w-4" />Get Directions</Button>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ShopsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopsContent />
    </Suspense>
  );
}
