"use client";

import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#home" className="group flex items-center">
          <Logo size="sm" />
        </a>

        <div className="flex items-center gap-4 text-zinc-400">
          <a
            href="https://github.com/ibtiwahab"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hover:text-purple-400 transition-colors"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/ibtihaj-wahab-a30062241/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-purple-400 transition-colors"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="mailto:ibtihajwahab8@gmail.com"
            aria-label="Email"
            className="hover:text-purple-400 transition-colors"
          >
            <Mail size={18} />
          </a>
        </div>

        <p className="text-xs text-zinc-500">
          © {year} Ibtihaj Wahab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
