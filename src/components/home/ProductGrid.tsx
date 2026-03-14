"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { ScrollReveal } from "@/components/ui/animations";
import type { ProductWithShop } from "@/types";

interface ProductGridProps {
  userLocation?: { lat: number; lng: number } | null;
  radius?: number;
  category?: string;
}

export function ProductGrid({ userLocation, radius = 10, category }: ProductGridProps) {
  const [products, setProducts] = useState<ProductWithShop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (userLocation) {
      params.set("lat", String(userLocation.lat));
      params.set("lng", String(userLocation.lng));
      params.set("radius", String(radius));
    }
    if (category) params.set("category", category);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [userLocation, radius, category]);

  return (
    <section className="container mx-auto px-4 py-12">
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-1 flex-1 bg-folk-mustard/30 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-folk-terracotta text-center">
            Products Near You
          </h2>
          <div className="h-1 flex-1 bg-folk-mustard/30 rounded-full" />
        </div>
      </ScrollReveal>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-xl folk-border bg-muted animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No products found. Try adjusting your filters or location.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
