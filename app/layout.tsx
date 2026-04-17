import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ibtihaj Wahab — Full Stack Developer",
  description:
    "Portfolio of Ibtihaj Wahab — Full Stack Developer with 3+ years of experience in React, Next.js, Node.js, Shopify, WordPress, and AI integrations.",
  keywords: [
    "Ibtihaj Wahab",
    "Full Stack Developer",
    "React Developer",
    "Next.js",
    "Shopify Developer",
    "WordPress Developer",
    "Three.js",
    "AI Integration",
    "Portfolio",
  ],
  authors: [{ name: "Ibtihaj Wahab" }],
  openGraph: {
    title: "Ibtihaj Wahab — Full Stack Developer",
    description:
      "Full Stack Developer crafting interactive, performant web experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-background text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-white">
        <div className="overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
