"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const SCROLL_REVEAL_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Wraps any element with a scroll-triggered slide-up + fade reveal.
 */
export function ScrollReveal({
  children,
  delay = 0,
  y = 48,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ y, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: SCROLL_REVEAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Splits text into words and animates each word on scroll-in.
 */
export function RevealWords({
  text,
  className = "",
  stagger = 0.04,
  delay = 0,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const child: Variants = {
    hidden: { y: "100%", opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      variants={container}
      className={className}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom mr-[0.28em]"
          aria-hidden
        >
          <motion.span variants={child} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Slides children up on scroll-in with fade.
 */
export function FadeUp({
  children,
  delay = 0,
  className = "",
  y = 30,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ y, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Character-by-character reveal for headings.
 */
export function RevealChars({
  text,
  className = "",
  stagger = 0.02,
  delay = 0,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { y: "110%", opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: EASE },
    },
  };

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      variants={container}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
        >
          <motion.span variants={child} className="inline-block">
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
