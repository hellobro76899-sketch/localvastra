"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ShoppingBag, Sun, Hexagon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextReveal, FadeInUp, BounceIn } from "@/components/ui/animations";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-folk-ochre min-h-[90vh] flex items-center justify-center pt-16">
      <div className="absolute inset-0 folk-texture-grain opacity-60 mix-blend-multiply" />
      <div className="absolute inset-0 folk-pattern-floral opacity-30" />
      
      {/* Handcrafted Indian poster frame */}
      <div className="absolute inset-4 md:inset-8 border-[6px] border-double border-folk-terracotta/40 rounded-xl pointer-events-none z-10" />
      <div className="absolute inset-6 md:inset-10 border-2 border-dashed border-folk-mustard/60 rounded-lg pointer-events-none z-10" />

      {/* Animated floating ornaments */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 md:left-20 text-folk-mustard/40 z-0"
      >
        <Sun className="h-24 w-24 md:h-32 md:w-32" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -15, 15, 0] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 md:right-20 text-folk-terracotta/20 z-0"
      >
        <Hexagon className="h-32 w-32 md:h-48 md:w-48" />
      </motion.div>

      <div className="container relative z-20 mx-auto px-4 py-12 text-center">
        <FadeInUp delay={0.2} duration={0.8} className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 bg-folk-mustard/20 rounded-full folk-border text-folk-terracotta font-serif italic shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span className="tracking-wide">Handcrafted Local Marketplace</span>
            <Sparkles className="h-4 w-4" />
          </div>
          
          <h1 className="text-5xl tracking-wide sm:text-6xl md:text-7xl lg:text-8xl text-folk-terracotta font-serif font-bold leading-tight drop-shadow-sm flex flex-col items-center">
            <span className="block mb-2">
              <TextReveal text="Discover Fashion" delay={0.2} by="words" className="text-folk-terracotta" />
            </span>
            <span className="text-folk-mustard italic block relative inline-block">
              <TextReveal text="From Shops Near You" delay={0.5} by="words" className="text-folk-mustard drop-shadow-md" />
              <motion.div 
                className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-4 bg-folk-terracotta/30 -z-10 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>
          </h1>

          <FadeInUp delay={0.6} className="mt-8 mb-12">
            <p className="text-lg md:text-2xl text-foreground/80 font-sans max-w-2xl mx-auto leading-relaxed">
              Experience the vibrant culture and local craftsmanship right in your neighborhood. Uncover authentic Indian styles.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.8} className="flex flex-wrap justify-center gap-6">
            <Link href="/products">
              <BounceIn delay={0.5}>
                <Button size="lg" className="gap-2 shadow-lg folk-border border-folk-ochre bg-folk-terracotta hover:bg-folk-terracotta/90 text-folk-ochre text-lg px-8 py-6 rounded-full transition-transform hover:scale-105">
                  <ShoppingBag className="h-6 w-6" />
                  Browse Products
                </Button>
              </BounceIn>
            </Link>
            <Link href="/shops">
              <BounceIn delay={0.6}>
                <Button variant="outline" size="lg" className="gap-2 folk-border-accent border-2 bg-folk-ochre/80 text-foreground text-lg px-8 py-6 rounded-full transition-transform hover:scale-105">
                  <MapPin className="h-6 w-6" />
                  Find Shops Near Me
                </Button>
              </BounceIn>
            </Link>
          </FadeInUp>
        </FadeInUp>
      </div>
    </section>
  );
}
