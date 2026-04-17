"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { RevealChars, FadeUp, ScrollReveal } from "./AnimatedText";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const experiences = [
  {
    role: "Software Developer",
    company: "Imarat",
    period: "May 2025 — Present",
    description:
      "Building an AI-powered Next.js platform — integrating AI APIs, crafting immersive Three.js experiences, and shipping performant, responsive UI.",
    tags: ["Next.js", "Three.js", "AI APIs", "TypeScript"],
    highlight: true,
    edu: false,
  },
  {
    role: "Web Developer",
    company: "IT SolutionsHub Pvt. Ltd",
    period: "Jan 2024 — Mar 2025",
    description:
      "Delivered production sites for Hassaan Travel, X-Treme Tunings, IT Solutions WorldWide & DD Group. Built responsive React apps backed by Node.js/Express, translating wireframes into polished user-friendly interfaces.",
    tags: ["React", "Node.js", "Express", "UI/UX"],
    highlight: false,
    edu: false,
  },
  {
    role: "Shopify Developer",
    company: "Adveneurs",
    period: "Jun 2023 — Jan 2024",
    description:
      "Customized Shopify themes for brand identity, optimized product listings, and integrated third-party apps to expand store functionality & conversions.",
    tags: ["Shopify", "Liquid", "E-commerce", "SEO"],
    highlight: false,
    edu: false,
  },
  {
    role: "Bachelor of Computer Science",
    company: "COMSATS University Islamabad — Wah Campus",
    period: "2019 — 2023",
    description:
      "Graduated with a focus on web development, AI & Computer Vision. Final Year Project: Personal AI Trainer using Python, Django, OpenCV & MediaPipe.",
    tags: ["Education", "AI", "Computer Vision"],
    highlight: false,
    edu: true,
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <ScrollReveal>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-16">
          <FadeUp>
            <span className="text-xs uppercase tracking-[0.3em] text-purple-400 font-mono">
              03 — Experience
            </span>
          </FadeUp>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]">
            <RevealChars text="My " />
            <RevealChars text="journey" className="gradient-text" delay={0.1} />
            <RevealChars text=" so far." delay={0.3} />
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line - centered on desktop */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-400/60 via-purple-700/30 to-transparent md:-translate-x-px" />

          <div className="space-y-14 md:space-y-20">
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.role + i} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof experiences)[number];
  index: number;
}) {
  const isLeft = index % 2 === 0;
  const Icon = exp.edu ? GraduationCap : Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative md:grid md:grid-cols-2 md:gap-12 items-start"
    >
      {/* Timeline dot */}
      <div className="absolute left-4 md:left-1/2 top-6 md:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 ring-4 ring-black z-10">
        <span className="absolute inset-0 rounded-full bg-purple-400 blur-md opacity-60" />
      </div>

      {/* LEFT side (mobile always uses left padding) */}
      {isLeft ? (
        <>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="pl-12 md:pl-0 md:pr-10 md:text-right"
          >
            <Card exp={exp} Icon={Icon} align="right" />
          </motion.div>
          <div className="hidden md:block" />
        </>
      ) : (
        <>
          <div className="hidden md:block" />
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="pl-12 md:pl-10 md:pr-0 md:text-left"
          >
            <Card exp={exp} Icon={Icon} align="left" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function Card({
  exp,
  Icon,
  align,
}: {
  exp: (typeof experiences)[number];
  Icon: typeof Briefcase;
  align: "left" | "right";
}) {
  return (
    <div className="glass rounded-2xl p-6 md:p-7 hover:border-white/15 transition-colors inline-block text-left">
      <div
        className={`flex items-center gap-2 text-xs text-purple-400 font-mono uppercase tracking-wider ${
          align === "right" ? "md:justify-end" : "md:justify-start"
        }`}
      >
        <Icon size={14} />
        {exp.period}
        {exp.highlight && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] border border-emerald-400/20">
            CURRENT
          </span>
        )}
      </div>
      <h3 className="mt-3 text-xl md:text-2xl font-semibold text-zinc-100">
        {exp.role}
      </h3>
      <p className="mt-1 text-sm text-purple-400 font-medium">{exp.company}</p>
      <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
        {exp.description}
      </p>
      <div
        className={`mt-5 flex flex-wrap gap-2 ${
          align === "right" ? "md:justify-end" : "md:justify-start"
        }`}
      >
        {exp.tags.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
