"use client";

import dynamic from "next/dynamic";
import { FadeUp, RevealChars } from "./AnimatedText";
import SceneErrorBoundary from "./SceneErrorBoundary";

const AsteroidGame = dynamic(() => import("./AsteroidGame"), { ssr: false });

export default function GameSection() {
  return (
    <section id="game" className="py-24 md:py-32 relative">
      {/* ambient glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/[0.06] blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* ── Section header ── */}
        <div className="text-center mb-10">
          <FadeUp>
            <span className="text-xs uppercase tracking-[0.38em] text-purple-400 font-mono">
              Take a break
            </span>
          </FadeUp>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tighter">
            <RevealChars text="Nebula " />
            <RevealChars text="Dash" className="gradient-text" delay={0.15} />
          </h2>
          <FadeUp delay={0.3}>
            <p className="mt-4 max-w-sm mx-auto text-zinc-500 text-sm leading-relaxed">
              Use <span className="text-purple-300 font-mono">← →</span> or
              {" "}<span className="text-purple-300 font-mono">A / D</span> to
              pilot the ship and dodge the asteroids. How long can you survive?
            </p>
          </FadeUp>
        </div>

        {/* ── Game canvas ── */}
        <SceneErrorBoundary>
          <AsteroidGame />
        </SceneErrorBoundary>
      </div>
    </section>
  );
}
