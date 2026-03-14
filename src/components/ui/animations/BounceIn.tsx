"use client";

import { motion } from "framer-motion";

interface BounceInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function BounceIn({ children, className = "", delay = 0 }: BounceInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
