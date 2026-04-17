"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { RevealChars, FadeUp, ScrollReveal } from "./AnimatedText";
import SceneErrorBoundary from "./SceneErrorBoundary";

const TechGlobe = dynamic(() => import("./TechGlobe"), { ssr: false });

export default function TechStack() {
  return (
    <section id="stack" className="py-24 md:py-32 overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <ScrollReveal>
      <div className="max-w-7xl mx-auto px-6 md:px-10 text-center mb-10">
        <FadeUp>
          <span className="text-xs uppercase tracking-[0.4em] text-zinc-500 font-mono">
            Tech Stack
          </span>
        </FadeUp>
        <h2 className="mt-4 text-5xl md:text-7xl font-bold tracking-tighter">
          <RevealChars text="My " />
          <RevealChars
            text="Skills"
            className="gradient-text"
            delay={0.15}
          />
        </h2>
        <FadeUp delay={0.3}>
          <p className="mt-6 max-w-xl mx-auto text-zinc-400">
            A versatile toolkit refined over 3+ years — spanning frontend,
            backend, e-commerce, and AI workflows.
          </p>
        </FadeUp>
      </div>
      </ScrollReveal>

      {/* 3D Globe */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-[520px] md:h-[640px]"
      >
        <SceneErrorBoundary>
          <TechGlobe />
        </SceneErrorBoundary>
      </motion.div>
    </section>
  );
}
