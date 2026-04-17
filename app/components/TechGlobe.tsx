"use client";

import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Billboard, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Tech = { name: string; slug: string; color?: string };

const TECHS: Tech[] = [
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Next.js", slug: "nextdotjs", color: "ffffff" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "Express", slug: "express", color: "ffffff" },
  { name: "MongoDB", slug: "mongodb", color: "47A248" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1" },
  { name: "Tailwind", slug: "tailwindcss", color: "06B6D4" },
  { name: "HTML5", slug: "html5", color: "E34F26" },
  { name: "CSS", slug: "css", color: "1572B6" },
  { name: "Three.js", slug: "threedotjs", color: "ffffff" },
  { name: "Framer", slug: "framer", color: "ffffff" },
  { name: "Shopify", slug: "shopify", color: "7AB55C" },
  { name: "WordPress", slug: "wordpress", color: "3858E9" },
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "Django", slug: "django", color: "44B78B" },
  { name: "OpenCV", slug: "opencv", color: "5C3EE8" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "GitHub", slug: "github", color: "ffffff" },
  { name: "Figma", slug: "figma", color: "F24E1E" },
  { name: "Vercel", slug: "vercel", color: "ffffff" },
];

function fibonacciSphere(n: number, radius: number) {
  const points: [number, number, number][] = [];
  const offset = 2 / n;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    points.push([x * radius, y * radius, z * radius]);
  }
  return points;
}

type TexturePair = { grey: THREE.Texture; color: THREE.Texture } | null;

/** Loads two versions of each icon (greyed + colored) into CanvasTextures. */
function useIconTextures(techs: Tech[]) {
  const [textures, setTextures] = useState<TexturePair[]>(() =>
    techs.map(() => null)
  );

  useEffect(() => {
    let cancelled = false;

    const loadOne = (url: string) =>
      new Promise<THREE.CanvasTexture | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const size = 256;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          const tex = new THREE.CanvasTexture(canvas);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          tex.needsUpdate = true;
          resolve(tex);
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });

    const load = async () => {
      const results = await Promise.all(
        techs.map(async (t) => {
          const grey = await loadOne(`https://cdn.simpleicons.org/${t.slug}/666666`);
          const color = await loadOne(
            `https://cdn.simpleicons.org/${t.slug}/${t.color ?? "ffffff"}`
          );
          if (!grey || !color) return null;
          return { grey, color };
        })
      );
      if (!cancelled) setTextures(results);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [techs]);

  return textures;
}

function IconSprite({
  position,
  textures,
  name,
  onHover,
}: {
  position: [number, number, number];
  textures: TexturePair;
  name: string;
  onHover: (hovered: boolean, name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = hovered ? 1.35 : 1;
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, target, delta * 8);
    meshRef.current.scale.set(s, s, s);
  });

  if (!textures) return null;

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(true, name);
    document.body.style.cursor = "pointer";
  };
  const handleOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    onHover(false, name);
    document.body.style.cursor = "auto";
  };

  return (
    <Billboard position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        <planeGeometry args={[0.6, 0.6]} />
        <meshBasicMaterial
          map={hovered ? textures.color : textures.grey}
          transparent
          depthWrite={false}
          opacity={hovered ? 1 : 0.55}
        />
      </mesh>
    </Billboard>
  );
}

function RotatingGroup({
  textures,
  onHover,
}: {
  textures: TexturePair[];
  onHover: (hovered: boolean, name: string) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const radius = 2.4;
  const positions = useMemo(() => fibonacciSphere(TECHS.length, radius), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.18;
      ref.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.25) * 0.2;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[radius - 0.05, 2]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[radius - 0.4, 48, 48]} />
        <meshBasicMaterial
          color="#6d28d9"
          transparent
          opacity={0.07}
          depthWrite={false}
        />
      </mesh>

      {TECHS.map((t, i) => (
        <IconSprite
          key={t.slug}
          name={t.name}
          position={positions[i]}
          textures={textures[i]}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

export default function TechGlobe() {
  const textures = useIconTextures(TECHS);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RotatingGroup
          textures={textures}
          onHover={(h, name) => setHoveredName(h ? name : null)}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Hover label */}
      <div
        className={`pointer-events-none absolute left-1/2 bottom-6 -translate-x-1/2 px-4 py-2 rounded-full glass text-sm font-medium text-zinc-100 transition-all duration-300 ${
          hoveredName
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        {hoveredName ?? ""}
      </div>
    </div>
  );
}
