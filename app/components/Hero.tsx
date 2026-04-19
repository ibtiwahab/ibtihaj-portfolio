"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail, Download } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import SceneErrorBoundary from "./SceneErrorBoundary";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ─── Scramble text ────────────────────────────────────────────────────────────
// Characters cycle through random symbols then lock in left → right.
const POOL = "!@#$%^&*+=|<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function ScrambleText({
  text,
  className = "",
  startDelay = 0,
}: {
  text: string;
  className?: string;
  startDelay?: number;
}) {
  // initialise with full text so server-render is correct
  const [display, setDisplay] = useState(text);
  const settledRef = useRef<boolean[]>([]);

  useEffect(() => {
    const target = text.split("");
    settledRef.current = target.map(() => false);

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let tick: ReturnType<typeof setInterval>;

    const startTimer = setTimeout(() => {
      // lock each char left → right with 80 ms gap
      target.forEach((ch, i) => {
        if (ch === " " || ch === "." || ch === "'") {
          settledRef.current[i] = true;
          return;
        }
        const t = setTimeout(() => {
          settledRef.current[i] = true;
        }, (i + 1) * 80);
        timeouts.push(t);
      });

      // single interval drives all unsettled chars
      tick = setInterval(() => {
        setDisplay(
          target
            .map((ch, i) =>
              settledRef.current[i]
                ? ch
                : POOL[Math.floor(Math.random() * POOL.length)]
            )
            .join("")
        );
      }, 45);

      // stop after all chars settled
      const stop = setTimeout(
        () => {
          clearInterval(tick);
          setDisplay(text);
        },
        (target.length + 2) * 80 + 120
      );
      timeouts.push(stop);
    }, startDelay * 1000);

    return () => {
      clearTimeout(startTimer);
      timeouts.forEach(clearTimeout);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span className={className}>{display}</span>;
}

// ─── Typewriter text ──────────────────────────────────────────────────────────
// Types out characters one by one then blinks the cursor.
function TypewriterText({
  text,
  className = "",
  startDelay = 0,
  speed = 72,
}: {
  text: string;
  className?: string;
  startDelay?: number;
  speed?: number;
}) {
  const [shown, setShown] = useState(text); // full text for SSR
  const [cursor, setCursor] = useState(false);

  useEffect(() => {
    setShown("");
    setCursor(true);
    let i = 0;
    let ticker: ReturnType<typeof setInterval>;
    let blinkInterval: ReturnType<typeof setInterval>;

    const startTimer = setTimeout(() => {
      ticker = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(ticker);
          let blinks = 0;
          blinkInterval = setInterval(() => {
            setCursor((c) => !c);
            blinks += 1;
            if (blinks >= 8) {
              clearInterval(blinkInterval);
              setCursor(false);
            }
          }, 380);
        }
      }, speed);
    }, startDelay * 1000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(ticker!);
      clearInterval(blinkInterval!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className={className}>
      {shown}
      {cursor && (
        <span className="inline-block w-[2px] h-[0.78em] bg-current ml-[2px] align-middle" />
      )}
    </span>
  );
}

// ─── Shared fade-up variant (badge, para, buttons, socials) ──────────────────
const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  show: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE },
  }),
};

// ─── Hero section ─────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* 3D scene backdrop */}
      <div className="absolute inset-0 -z-10">
        <SceneErrorBoundary>
          <Scene />
        </SceneErrorBoundary>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-60" />

      {/* Ambient blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 py-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col items-start max-w-4xl"
        >
          {/* ── Available badge ── */}
          <motion.div
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs md:text-sm text-zinc-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            Available for freelance &amp; full-time roles
          </motion.div>

          {/* ── Headline ── */}
          <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
            {/* "Hi, I'm" — typewriter */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.05, delay: 0.15 }}
              className="block text-zinc-100"
            >
              <TypewriterText text="Hi, I'm" startDelay={0.2} />
            </motion.span>

            {/* "Ibtihaj Wahab." — scramble */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.05, delay: 0.15 }}
              className="block gradient-text"
            >
              <ScrambleText text="Ibtihaj Wahab." startDelay={0.25} />
            </motion.span>

            {/* "I build digital" — blur-slide up */}
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 1.4, ease: EASE }}
              className="block text-zinc-100"
            >
              I build digital
            </motion.span>

            {/* "experiences." — blur-slide up */}
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 1.6, ease: EASE }}
              className="block text-zinc-100"
            >
              experiences<span className="text-purple-400">.</span>
            </motion.span>
          </h1>

          {/* ── Description ── */}
          <motion.p
            custom={1}
            variants={fadeUp}
            className="mt-8 max-w-2xl text-base md:text-lg text-zinc-400 leading-relaxed"
          >
            Full Stack Developer with{" "}
            <span className="text-zinc-200 font-medium">3+ years</span> of
            experience crafting responsive, user-centric websites and
            e-commerce solutions. Currently building AI-powered Next.js
            experiences at <span className="text-purple-400">Imarat</span>.
          </motion.p>

          {/* ── CTA buttons ── */}
          <motion.div
            custom={2}
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 bg-gradient-to-r from-purple-400 to-purple-800 text-white font-semibold hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.7)] transition-all"
            >
              View my work
              <ArrowDown
                size={18}
                className="group-hover:translate-y-1 transition-transform"
              />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 border border-white/10 text-zinc-200 hover:bg-white/5 hover:border-white/20 transition-all"
            >
              Get in touch
              <Mail size={18} />
            </a>
            <a
              href="/Ibtihaj_Wahab_CV.pdf"
              download
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 border border-purple-400/30 text-purple-200 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400/60 transition-all"
            >
              Download CV
              <Download size={18} />
            </a>
          </motion.div>

          {/* ── Social links ── */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="mt-10 flex items-center gap-5 text-zinc-500"
          >
            <a
              href="https://github.com/ibtiwahab"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/ibtihaj-wahab-a30062241/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="mailto:ibtihajwahab8@gmail.com"
              className="hover:text-purple-400 transition-colors"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
            <span className="h-px flex-1 max-w-24 bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-xs uppercase tracking-[0.2em]">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500"
      >
        <div className="w-6 h-10 rounded-full border border-white/15 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-gradient-to-b from-purple-400 to-purple-800" />
        </div>
      </motion.div>
    </section>
  );
}
