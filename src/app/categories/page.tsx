"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { CategoryFilters } from "@/components/home/CategoryFilters";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-8">
          Categories
        </motion.h1>
        <CategoryFilters />
      </main>
    </div>
  );
}
