"use client";

import Image from "next/image";

/**
 * Logo — wordmark from /logo.svg.
 * The SVG ships in white; the wrapper applies a subtle gradient via CSS mask
 * on hover so it lights up purple in interactive contexts.
 */
const SIZES = {
  sm: { w: 84,  h: 36 },
  md: { w: 110, h: 47 },
  lg: { w: 170, h: 72 },
} as const;

export default function Logo({
  size = "md",
  className = "",
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const { w, h } = SIZES[size];
  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      style={{ width: w, height: h }}
      aria-label="Ibtihaj Wahab"
    >
      {/* Soft purple aura on hover */}
      <span className="absolute inset-0 rounded-xl bg-purple-500/0 group-hover:bg-purple-500/20 blur-xl transition-colors duration-500" />
      <Image
        src="/logo.svg"
        alt="Ibtihaj Wahab"
        width={w}
        height={h}
        priority
        className="relative select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </span>
  );
}
