# Ibtihaj Wahab — Portfolio

Personal portfolio website built with **Next.js 16**, **React 19**, **Three.js**, and **Framer Motion**. Features a 3D interactive hero scene, a rotating tech-stack globe, scroll-triggered animations, and a fully responsive dark UI.

**Live:** [ibtihajwahab.vercel.app](https://ibtihajwahab.vercel.app) <!-- update after deploy -->

---

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| 3D / WebGL | Three.js, @react-three/fiber, @react-three/drei |
| Animations | Framer Motion 12 |
| Icons | Lucide React, React Icons |
| Fonts | Geist Sans, Geist Mono |
| Deployment | Vercel |

---

## Features

- **3D Hero Scene** — Animated torus knots, floating spheres, and a star field rendered with Three.js
- **Interactive Tech Globe** — Rotating 3D sphere displaying tech icons sourced from Simple Icons CDN
- **Scroll Animations** — Elements animate in on scroll down *and* back in on scroll up
- **Spotlight Cursor** — Subtle radial glow that follows the cursor
- **Project Cards** — Hover glow, gradient accents, and direct links to live sites / GitHub repos
- **Timeline** — Work experience and education displayed in an alternating left/right layout
- **Responsive** — Mobile-first, tested down to 375px

---

## Sections

1. **Hero** — Name, tagline, CTA buttons, social links
2. **About** — Bio and skill highlights
3. **Tech Stack** — 3D globe with 22 technologies
4. **Experience** — Work history and education timeline
5. **Projects** — 10 cards (client work, MERN apps, Gen AI tools at Imarat)
6. **Contact** — Email, phone, LinkedIn, GitHub

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── components/
│   ├── AnimatedText.tsx      # ScrollReveal, FadeUp, RevealChars, RevealWords
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── TechStack.tsx
│   ├── TechGlobe.tsx         # Three.js rotating icon sphere
│   ├── Experience.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── Scene.tsx             # Three.js hero background
│   ├── Spotlight.tsx         # Cursor glow effect
│   └── SceneErrorBoundary.tsx
├── globals.css
├── layout.tsx
└── page.tsx
public/
└── I.png
```

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy** — no environment variables required

---

## Contact

**Ibtihaj Wahab**
[ibtihajwahab8@gmail.com](mailto:ibtihajwahab8@gmail.com)
[linkedin.com/in/ibtihaj-wahab-a30062241](https://www.linkedin.com/in/ibtihaj-wahab-a30062241/)
[github.com/ibtiwahab](https://github.com/ibtiwahab)
