"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Logo — uses the /I.png monogram with an animated rotating purple ring.
 *
 * Sizes: 'sm' (navbar) | 'lg' (hero/standalone)
 */
export default function Logo({
  size = "md",
  className = "",
}: {
  size?: "md" | "lg";
  className?: string;
}) {
  const dim = size === "md" ? 44 : 140;
  const radius = size === "md" ? 17 : 54;
  const fontSize = size === "md" ? 4.2 : 8.5;
  const text = "• IBTIHAJ WAHAB • FULL STACK DEVELOPER ";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: dim, height: dim }}
      aria-label="Ibtihaj Wahab — Full Stack Developer"
    >
      {/* Rotating circular text ring */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id={`circle-${size}`}
            d={`M 50 50 m -${radius} 0 a ${radius} ${radius} 0 1 1 ${
              radius * 2
            } 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`}
          />
          <linearGradient id={`gr-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#6b21a8" />
          </linearGradient>
        </defs>
        <text
          fill={`url(#gr-${size})`}
          fontSize={fontSize}
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight="600"
          letterSpacing="1"
        >
          <textPath href={`#circle-${size}`}>{text.repeat(2)}</textPath>
        </text>
      </motion.svg>
    </div>
  );
}
