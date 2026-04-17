"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { RevealChars, FadeUp, ScrollReveal } from "./AnimatedText";

type Project = {
  title: string;
  category: string;
  description: string;
  tags: string[];
  url?: string;
  github?: string;
  gradient: string;
  accent: string;
  badge?: string;
  wip?: boolean;
};

const IT_SOLUTIONS_BADGE = "IT Solutions WorldWide";

const projects: Project[] = [
  {
    title: "Hassaan Travel",
    category: "React • Multi-language",
    description:
      "A leading Netherlands travel agency website built with ReactJS — clean interactive UI with multi-language (i18n) support, Node.js backend for contact forms, and optimized cross-device performance.",
    tags: ["ReactJS", "Node.js", "i18n", "Responsive"],
    url: "https://www.hassaantravel.nl/",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    accent: "#22d3ee",
    badge: IT_SOLUTIONS_BADGE,
  },
  {
    title: "X-Treme Tunings",
    category: "E-Commerce",
    description:
      "High-performance automotive tuning website for a Netherlands brand — product catalog, smooth navigation, and conversion-focused UX built with React on the front and a Node backend.",
    tags: ["React", "Node.js", "E-commerce", "UI/UX"],
    url: "https://www.x-tremetunings.nl/",
    gradient: "from-orange-500/20 via-red-500/10 to-transparent",
    accent: "#f97316",
    badge: IT_SOLUTIONS_BADGE,
  },
  {
    title: "IT Solutions WorldWide",
    category: "React + Node.js",
    description:
      "Company site with a custom SCM Performance Check Questionnaire — users answer scored questions and receive a spiderweb (radar) chart visualizing results alongside department-specific improvement suggestions.",
    tags: ["React", "Node.js", "Charts", "Form Logic"],
    url: "https://www.itsolutionsworldwide.com/en",
    gradient: "from-fuchsia-500/20 via-purple-500/10 to-transparent",
    accent: "#a855f7",
    badge: IT_SOLUTIONS_BADGE,
  },
  {
    title: "DD Group",
    category: "React • Framer Motion",
    description:
      "Modern responsive corporate website with smooth Framer Motion section transitions. Node.js backend handles secure form submissions and reliable data processing for lead capture.",
    tags: ["React", "Framer Motion", "Node.js"],
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    accent: "#10b981",
    badge: IT_SOLUTIONS_BADGE,
  },
  {
    title: "AI Personal Trainer",
    category: "Final Year Project",
    description:
      "Django web app using OpenCV & MediaPipe that detects and evaluates 5 guided exercises in real time from the user's webcam, scoring form and giving instant feedback on accuracy and rep count.",
    tags: ["Python", "Django", "OpenCV", "MediaPipe"],
    github:
      "https://github.com/ibtiwahab/AI-Personal-Trainer/tree/master/AIGT(FYP)",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    accent: "#ec4899",
  },
  {
    title: "Real Estate Web App",
    category: "MERN Stack",
    description:
      "Full-stack property listing platform built with React, Node.js/Express and MongoDB. Features authenticated listings, Cloudinary image uploads, search & filter, and a responsive Tailwind UI.",
    tags: ["React", "Node.js", "MongoDB", "Cloudinary"],
    github: "https://github.com/ibtiwahab/Real-Estate-Web-App",
    gradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
    accent: "#6366f1",
  },
  {
    title: "ESG Web App",
    category: "MERN • JWT Auth",
    description:
      "ESG (Environmental, Social & Governance) investment platform — role-based dashboards, JWT auth, MongoDB persistence, and Chart.js visualizations of sustainability metrics for investors & admins.",
    tags: ["React", "Tailwind", "Express", "Chart.js"],
    github: "https://github.com/ibtiwahab/ESG-Web-App",
    gradient: "from-lime-500/20 via-green-500/10 to-transparent",
    accent: "#84cc16",
  },
  {
    title: "Inventory Web App",
    category: "MERN Stack",
    description:
      "Full-stack inventory management system built with React, Node.js/Express, and MongoDB. Features product tracking, stock management, and a clean responsive dashboard for efficient operations.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    github: "https://github.com/ibtiwahab/inventory-web-app",
    gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    accent: "#f59e0b",
  },
  {
    title: "Housegen",
    category: "Gen AI • Architecture",
    description:
      "AI platform to create & edit floor plans, generate house elevations from plans and grey structures, visualize room interiors, and get real-time construction cost estimates — all powered by generative AI.",
    tags: ["Gen AI", "Next.js", "Floor Plans", "3D Visualization"],
    gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
    accent: "#0ea5e9",
    badge: "IMARAT",
    wip: true,
  },
  {
    title: "Urbangen",
    category: "Gen AI • Urban Planning",
    description:
      "Select any area on a world map, define parameters like FAR and density, and generate a complete AI-driven urban layout with a detailed report on building types, housing, commercial units, water, and electricity needs.",
    tags: ["Gen AI", "Maps", "Urban Planning", "AI Reports"],
    gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
    accent: "#14b8a6",
    badge: "IMARAT",
    wip: true,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <ScrollReveal>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <FadeUp>
              <span className="text-xs uppercase tracking-[0.3em] text-purple-400 font-mono">
                04 — Projects
              </span>
            </FadeUp>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]">
              <RevealChars text="My " />
              <RevealChars text="work" className="gradient-text" delay={0.15} />
              <RevealChars text="." delay={0.3} />
            </h2>
          </div>
          <FadeUp delay={0.3}>
            <a
              href="https://github.com/ibtiwahab"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-400 transition-colors self-start md:self-end"
            >
              See all on GitHub
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
          </FadeUp>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}

function CardContent({ project }: { project: Project }) {
  return (
    <>
      {/* gradient hover glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* corner accent */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: project.accent }}
      />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {project.badge && (
                <span className="text-[10px] uppercase tracking-[0.18em] font-mono px-2 py-1 rounded-md border border-white/10 bg-white/5 text-zinc-400">
                  @ {project.badge}
                </span>
              )}
              {project.wip && (
                <span className="text-[10px] uppercase tracking-[0.18em] font-mono px-2 py-1 rounded-md border border-amber-400/30 bg-amber-400/10 text-amber-400">
                  In Development
                </span>
              )}
            </div>
            <h3 className="mt-4 text-2xl md:text-3xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {project.github && (
              <span className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-zinc-300 group-hover:text-white group-hover:bg-white/10 transition-all">
                <FaGithub size={16} />
              </span>
            )}
            {!project.wip && (
              <span className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-zinc-300 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-purple-400 group-hover:to-purple-700 transition-all">
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </span>
            )}
          </div>
        </div>

        <p className="mt-5 text-sm md:text-[15px] text-zinc-400 leading-relaxed flex-1">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const sharedMotion = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, margin: "-60px" },
    transition: {
      duration: 0.7,
      delay: (index % 2) * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
    whileHover: { y: -6 },
  };

  if (project.wip) {
    return (
      <motion.div
        {...sharedMotion}
        className="group relative glass rounded-3xl p-7 md:p-8 overflow-hidden"
      >
        <CardContent project={project} />
      </motion.div>
    );
  }

  return (
    <motion.a
      href={project.url || project.github || "#"}
      target={project.url || project.github ? "_blank" : undefined}
      rel="noreferrer"
      {...sharedMotion}
      className="group relative glass rounded-3xl p-7 md:p-8 overflow-hidden cursor-pointer"
    >
      <CardContent project={project} />
    </motion.a>
  );
}
