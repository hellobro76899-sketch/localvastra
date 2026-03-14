"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, BadgeCheck, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/animations";
import type { ProductWithShop } from "@/types";

interface ProductCardProps {
  product: ProductWithShop;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const imageUrl = product.images?.[0] || "https://placehold.co/400x400?text=Product";

  return (
    <ScrollReveal delay={index * 0.05} direction="up">
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }} 
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full group"
      >
        <div className="relative h-full overflow-hidden bg-folk-ochre folk-pattern-dots p-3 sm:p-4 rounded-[2rem_1rem_2rem_1rem] border-2 border-dashed border-folk-mustard shadow-[4px_4px_0_hsl(var(--folk-terracotta))] hover:shadow-[6px_6px_0_hsl(var(--folk-terracotta))] hover:border-folk-terracotta transition-all duration-300">
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-square overflow-hidden bg-muted rounded-[1.5rem_0.8rem_1.5rem_0.8rem] border-[3px] border-folk-terracotta/20 group-hover:border-folk-terracotta/40 transition-colors">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Product";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
                {product.inStock && (
                  <span className="flex items-center gap-1 rounded-full bg-folk-teal/90 px-2.5 py-1 text-xs font-semibold text-white border-2 border-white/40 shadow-sm backdrop-blur-sm">
                    <Package className="h-3.5 w-3.5" /> In Stock
                  </span>
                )}
                <span className="flex items-center gap-1 rounded-full bg-folk-mustard/90 px-2.5 py-1 text-xs font-semibold text-folk-terracotta border-2 border-folk-terracotta/20 shadow-sm backdrop-blur-sm">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
            </div>
          </Link>

          <div className="pt-4 pb-2 px-1 relative z-20">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-serif font-bold text-lg line-clamp-2 group-hover:text-folk-terracotta transition-colors text-foreground leading-tight">
                {product.name}
              </h3>
            </Link>
            
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xl font-bold text-folk-terracotta">₹{product.price.toLocaleString()}</p>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-dashed border-folk-terracotta/20 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-folk-mustard shrink-0 bg-folk-terracotta/10 flex items-center justify-center">
                   <Store className="h-4 w-4 text-folk-terracotta" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{product.shop?.name}</p>
                  {product.distance !== undefined && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <MapPin className="h-3 w-3 text-folk-teal" />
                      {product.distance.toFixed(1)} km away
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link href={`/products/${product.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-2 border-folk-terracotta text-folk-terracotta hover:bg-folk-terracotta hover:text-white rounded-full transition-colors font-semibold">
                  View
                </Button>
              </Link>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${product.shop?.location?.lat},${product.shop?.location?.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-[1.5]"
              >
                <Button size="sm" className="w-full gap-1.5 bg-folk-teal hover:bg-folk-teal/90 text-white rounded-full shadow-sm font-semibold border-2 border-folk-teal">
                  <MapPin className="h-4 w-4" />
                  Map
                </Button>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}
