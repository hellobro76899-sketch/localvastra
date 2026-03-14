"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, Baby, Shirt, Sparkles, Store } from "lucide-react";
import { ScrollReveal, BounceIn } from "@/components/ui/animations";
import { CATEGORIES } from "@/types";

const icons: Record<string, React.ElementType> = {
  Men: User,
  Women: User,
  Kids: Baby,
  Ethnic: Shirt,
  Boutique: Sparkles,
};

const badgeColors = [
  "bg-folk-mustard border-folk-terracotta text-folk-terracotta",
  "bg-folk-teal border-folk-ochre text-folk-ochre",
  "bg-folk-terracotta border-folk-mustard text-folk-mustard",
  "bg-folk-red border-folk-ochre text-folk-ochre",
  "bg-folk-ochre border-folk-terracotta text-folk-terracotta",
];

export function CategoryFilters() {
  return (
    <section className="container mx-auto px-4 py-12">
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-serif font-bold text-folk-terracotta">Explore Collections</h2>
          <div className="h-[2px] flex-1 bg-folk-mustard/30 rounded-full" />
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {CATEGORIES.map((cat, i) => {
          const Icon = icons[cat] || Store;
          return (
            <ScrollReveal key={cat} delay={i * 0.08} direction="up">
              <Link href={`/products?category=${cat.toLowerCase()}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -6, rotate: i % 2 === 0 ? 2 : -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex flex-col items-center gap-4 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-[3px] border-dashed border-folk-terracotta p-6 bg-folk-ochre shadow-[4px_4px_0_hsl(var(--folk-terracotta))] hover:shadow-[6px_6px_0_hsl(var(--folk-terracotta))] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 folk-texture-grain opacity-20 pointer-events-none" />
                  <BounceIn delay={i * 0.05} className="z-10 relative">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-[30%_70%_70%_30%/30%_30%_70%_70%] border-2 shadow-sm ${badgeColors[i % badgeColors.length]} group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </BounceIn>
                  <span className="font-serif font-bold text-lg text-folk-terracotta z-10">{cat}</span>
                </motion.div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
