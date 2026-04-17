"use client";

import { motion } from "framer-motion";
import { Code2, Rocket, Sparkles, Globe } from "lucide-react";
import { RevealChars, FadeUp, ScrollReveal } from "./AnimatedText";

const highlights = [
  {
    icon: Code2,
    title: "Full Stack",
    desc: "React, Next.js, Node.js, Express, MongoDB — I build end-to-end.",
  },
  {
    icon: Globe,
    title: "E-Commerce",
    desc: "Shopify themes & WordPress builds with performance in mind.",
  },
  {
    icon: Sparkles,
    title: "AI Integration",
    desc: "Currently integrating AI APIs into Next.js at Imarat.",
  },
  {
    icon: Rocket,
    title: "3D & Motion",
    desc: "Three.js, Framer Motion — delightful, smooth interactions.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <ScrollReveal>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <FadeUp>
              <span className="text-xs uppercase tracking-[0.3em] text-purple-400 font-mono">
                01 — About
              </span>
            </FadeUp>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]">
              <span className="block">
                <RevealChars text="Crafting the web," />
              </span>
              <span className="block gradient-text">
                <RevealChars
                  text="one pixel at a time."
                  delay={0.25}
                />
              </span>
            </h2>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: "-60px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12 } },
              }}
              className="mt-8 space-y-5 text-zinc-400 leading-relaxed text-[17px]"
            >
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                }}
              >
                I&apos;m a Full Stack Developer based in Pakistan with{" "}
                <span className="text-zinc-200 font-medium">
                  3+ years of hands-on experience
                </span>{" "}
                building responsive, user-centric web applications and
                e-commerce platforms.
              </motion.p>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                }}
              >
                My journey started with a Bachelor&apos;s in Computer Science
                from{" "}
                <span className="text-zinc-200">
                  COMSATS University Islamabad
                </span>
                , and has since taken me through Shopify development,
                WordPress builds, MERN stack apps, and now — AI-integrated
                Next.js experiences at{" "}
                <span className="text-purple-400">Imarat</span>.
              </motion.p>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                }}
              >
                I care about performance, clean code, and animations that
                feel <em className="text-zinc-200 not-italic">right</em>.
                When I&apos;m not shipping, I&apos;m exploring Three.js
                experiments and the latest in AI tooling.
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-100px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {highlights.map((h) => (
              <motion.div
                key={h.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: EASE },
                  },
                }}
                whileHover={{ y: -6 }}
                className="group relative glass rounded-2xl p-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-800/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-700/20 flex items-center justify-center text-purple-400 mb-4 border border-white/5">
                    <h.icon size={20} />
                  </div>
                  <h3 className="text-zinc-100 font-semibold text-lg">
                    {h.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}
