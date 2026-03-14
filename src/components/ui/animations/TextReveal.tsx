"use client";

import { motion, type Variants } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  by?: "chars" | "words";
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const wordVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

export function TextReveal({ text, className = "", delay = 0, by = "words" }: TextRevealProps) {
  if (by === "chars") {
    const chars = text.split("");
    return (
      <motion.span
        className={`inline-block ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
      >
        {chars.map((char, i) => (
          <motion.span key={i} className="inline-block" variants={charVariants}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  const words = text.split(" ");
  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-flex mr-[0.25em] overflow-hidden"
          variants={wordVariants}
        >
          <motion.span
            variants={charVariants}
            className="inline-block"
          >
            {word}
          </motion.span>
        </motion.span>
      ))}
    </motion.span>
  );
}
