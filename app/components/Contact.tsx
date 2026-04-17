"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { RevealChars, FadeUp, ScrollReveal } from "./AnimatedText";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "ibtihajwahab8@gmail.com",
    href: "mailto:ibtihajwahab8@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+92 334 5549557",
    href: "tel:+923345549557",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    value: "ibtihaj-wahab",
    href: "https://www.linkedin.com/in/ibtihaj-wahab-a30062241/",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    value: "ibtiwahab",
    href: "https://github.com/ibtiwahab",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 relative">
      {/* ambient glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-cyan-500/10 via-fuchsia-500/5 to-transparent blur-3xl" />
      </div>

      <ScrollReveal>
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="text-center">
          <FadeUp>
            <span className="text-xs uppercase tracking-[0.3em] text-purple-400 font-mono">
              05 — Contact
            </span>
          </FadeUp>
          <h2 className="mt-4 text-4xl md:text-7xl font-bold tracking-tighter leading-[1.05]">
            <span className="block">
              <RevealChars text="Let's build" />
            </span>
            <span className="block gradient-text">
              <RevealChars text="something great." delay={0.25} />
            </span>
          </h2>
          <FadeUp delay={0.4}>
            <p className="mt-6 max-w-xl mx-auto text-zinc-400 text-[17px]">
              Got a project in mind or just want to say hi? My inbox is
              always open and I&apos;ll get back to you within 24 hours.
            </p>
          </FadeUp>

          <motion.a
            href="mailto:ibtihajwahab8@gmail.com"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-700 text-white font-semibold text-lg hover:shadow-[0_0_50px_-5px_rgba(168,85,247,0.6)] transition-shadow"
          >
            Say hello
            <ArrowUpRight size={20} />
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group glass rounded-2xl p-5 hover:border-purple-500/30 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-purple-400 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-purple-400/20 group-hover:to-purple-700/20 transition-all">
                  <c.icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">
                    {c.label}
                  </div>
                  <div className="text-sm text-zinc-200 font-medium truncate">
                    {c.value}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 text-center text-sm text-zinc-500 flex items-center justify-center gap-2"
        >
          <MapPin size={14} />
          Based in Pakistan — available worldwide (Remote)
        </motion.div>
      </div>
      </ScrollReveal>
    </section>
  );
}
