"use client";

import { motion } from "framer-motion";

interface FolkArtBorderProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}

export function FolkArtBorder({ children, className = "", accent = false }: FolkArtBorderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-lg p-[3px] ${accent ? "folk-border-accent" : "folk-border"} ${className}`}
    >
      <div className="rounded-[calc(0.5rem-2px)] bg-background p-4">
        {children}
      </div>
    </motion.div>
  );
}
