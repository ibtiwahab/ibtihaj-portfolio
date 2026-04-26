"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import {
  MutableRefObject,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// ── Asset paths ────────────────────────────────────────────────────────────────
const ASTEROID_OBJ = "/models/asteroid/10464_Asteroid_v1_Iterations-2.obj";
const ASTEROID_TEX = "/models/asteroid/10464_Asteroid_v1_diffuse.jpg";

// Preload so the first frame has the meshes ready
useLoader.preload(OBJLoader, ASTEROID_OBJ);
useLoader.preload(THREE.TextureLoader, ASTEROID_TEX);

// ── Constants ──────────────────────────────────────────────────────────────────
const FIELD_W  = 11;      // wider play area: ±5.5 in X
const SPAWN_Y  = 6.8;
const DEAD_Y   = -6.5;
const PLAYER_Y = -4.6;
const PLAYER_R = 0.48;
const ROCK_R   = 0.44;
const MAX_ROCKS = 34;
const PLAYER_SPEED = 2.2;  // normalized units / sec (−1..1 across field)

type Phase = "idle" | "playing" | "over";

// ── Procedural nebula cloud texture ────────────────────────────────────────────
function makeNebulaTexture(color: string) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(
    size / 2, size / 2, 4,
    size / 2, size / 2, size / 2
  );
  grad.addColorStop(0,   color + "cc");
  grad.addColorStop(0.35, color + "55");
  grad.addColorStop(1,   color + "00");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ── Nebula clouds (animated colored sprites) ───────────────────────────────────
function NebulaClouds() {
  const purple = useMemo(() => makeNebulaTexture("#9333ea"), []);
  const magenta = useMemo(() => makeNebulaTexture("#d946ef"), []);
  const cyan   = useMemo(() => makeNebulaTexture("#22d3ee"), []);
  const blue   = useMemo(() => makeNebulaTexture("#3b82f6"), []);

  const group = useRef<THREE.Group>(null);

  // Static placements — drift very slowly
  const clouds = useMemo(
    () => [
      { tex: purple,  x: -4.5, y:  2.2, z: -4, s: 7,   o: 0.55 },
      { tex: magenta, x:  4.2, y: -1.5, z: -4.5, s: 6.5, o: 0.45 },
      { tex: cyan,    x:  2.0, y:  3.5, z: -5, s: 5.5, o: 0.40 },
      { tex: blue,    x: -3.2, y: -2.8, z: -5, s: 6,   o: 0.35 },
      { tex: purple,  x:  0.0, y:  0.0, z: -6, s: 9,   o: 0.28 },
    ],
    [purple, magenta, cyan, blue]
  );

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += dt * 0.01;
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <sprite key={i} position={[c.x, c.y, c.z]} scale={[c.s, c.s, 1]}>
          <spriteMaterial
            map={c.tex}
            transparent
            opacity={c.o}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

// ── Parallax multi-layer starfield ─────────────────────────────────────────────
function StarLayer({
  count,
  spread,
  depth,
  size,
  color,
  opacity,
  speed,
}: {
  count: number;
  spread: number;
  depth: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.8;
      arr[i * 3 + 2] = depth - Math.random() * 2;
    }
    return arr;
  }, [count, spread, depth]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
      />
    </Points>
  );
}

// ── Individual rock state ──────────────────────────────────────────────────────
type RockData = {
  active: boolean;
  x: number; y: number;
  vx: number; vy: number;
  rotX: number; rotY: number; rotZ: number;
  rsX: number; rsY: number; rsZ: number;
};

const EMPTY_ROCK: RockData = {
  active: false,
  x: 0, y: 0, vx: 0, vy: 0,
  rotX: 0, rotY: 0, rotZ: 0,
  rsX: 0, rsY: 0, rsZ: 0,
};

function spawnRock(speed: number): RockData {
  return {
    active: true,
    x: (Math.random() - 0.5) * (FIELD_W - 1.2),
    y: SPAWN_Y,
    vx: (Math.random() - 0.5) * 1.8,
    vy: -(speed + Math.random() * 1.8),
    rotX: 0, rotY: 0, rotZ: 0,
    rsX: (Math.random() - 0.5) * 4.5,
    rsY: (Math.random() - 0.5) * 4.5,
    rsZ: (Math.random() - 0.5) * 3,
  };
}

// ── Main game scene ────────────────────────────────────────────────────────────
function GameScene({
  phaseRef,
  targetXRef,
  inputRef,
  onHit,
  onScoreUp,
}: {
  phaseRef: MutableRefObject<Phase>;
  targetXRef: MutableRefObject<number>;
  inputRef: MutableRefObject<{ left: boolean; right: boolean }>;
  onHit: () => void;
  onScoreUp: () => void;
}) {
  const playerRef = useRef<THREE.Group>(null);
  const flameRef  = useRef<THREE.Mesh>(null);
  const playerMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const iMeshRef  = useRef<THREE.InstancedMesh>(null);
  const rocks     = useRef<RockData[]>(
    Array.from({ length: MAX_ROCKS }, () => ({ ...EMPTY_ROCK }))
  );

  const tmpMat   = useRef(new THREE.Matrix4());
  const tmpEuler = useRef(new THREE.Euler());
  const hideMat  = useRef(new THREE.Matrix4().makeScale(0, 0, 0));

  const spawnT  = useRef(0);
  const scoreT  = useRef(0);
  const invT    = useRef(0);
  const gameT   = useRef(0);
  const prevPhase = useRef<Phase>("idle");

  // ── Load assets ──────────────────────────────────────────────────────────────
  const asteroidObj = useLoader(OBJLoader, ASTEROID_OBJ);
  const asteroidTex = useLoader(THREE.TextureLoader, ASTEROID_TEX);

  // Extract + normalize asteroid geometry (center, scale to ROCK_R)
  const geo = useMemo(() => {
    let src: THREE.BufferGeometry | null = null;
    asteroidObj.traverse((c) => {
      const m = c as THREE.Mesh;
      if (!src && m.isMesh) src = m.geometry;
    });
    const g = (src as unknown as THREE.BufferGeometry).clone();
    g.center();
    g.computeBoundingSphere();
    const r = g.boundingSphere?.radius ?? 1;
    const s = ROCK_R / r;
    g.scale(s, s, s);
    // OBJ from 3DS Max is usually Z-up — tilt so the asteroid reads correctly
    g.rotateX(-Math.PI / 2);
    g.computeVertexNormals();
    return g;
  }, [asteroidObj]);

  const mat = useMemo(() => {
    asteroidTex.colorSpace = THREE.SRGBColorSpace;
    asteroidTex.anisotropy = 4;
    return new THREE.MeshStandardMaterial({
      map: asteroidTex,
      color: "#d8c9b8",
      emissive: "#3b1e5a",
      emissiveIntensity: 0.35,
      roughness: 0.85,
      metalness: 0.15,
    });
  }, [asteroidTex]);


  useEffect(() => {
    if (!iMeshRef.current) return;
    for (let i = 0; i < MAX_ROCKS; i++) {
      iMeshRef.current.setMatrixAt(i, hideMat.current);
    }
    iMeshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, dt) => {
    const phase = phaseRef.current;

    if (phase !== prevPhase.current) {
      if (phase === "playing") {
        rocks.current.forEach((r) => { r.active = false; });
        spawnT.current = 0; scoreT.current = 0;
        invT.current = 0; gameT.current = 0;
        if (iMeshRef.current) {
          for (let i = 0; i < MAX_ROCKS; i++) {
            iMeshRef.current.setMatrixAt(i, hideMat.current);
          }
          iMeshRef.current.instanceMatrix.needsUpdate = true;
        }
      }
      prevPhase.current = phase;
    }

    // Apply keyboard input → targetX
    if (phase === "playing") {
      const input = inputRef.current;
      const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      if (dir !== 0) {
        targetXRef.current = THREE.MathUtils.clamp(
          targetXRef.current + dir * PLAYER_SPEED * dt,
          -1, 1
        );
      }
    }

    if (playerRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.0045) * 0.05;

      // Flame flicker
      if (flameRef.current) {
        const f = 1 + Math.sin(Date.now() * 0.04) * 0.18 + Math.random() * 0.12;
        flameRef.current.scale.set(f, 1.1 + Math.random() * 0.25, f);
      }

      if (phase === "playing") {
        const tx = targetXRef.current * (FIELD_W / 2 - 0.9);
        const prevX = playerRef.current.position.x;
        const newX = THREE.MathUtils.lerp(prevX, tx, Math.min(1, dt * 12));
        playerRef.current.position.x = newX;

        // Bank the rocket based on lateral velocity
        const vx = (newX - prevX) / Math.max(dt, 0.0001);
        const bank = THREE.MathUtils.clamp(-vx * 0.22, -0.5, 0.5);
        playerRef.current.rotation.z = THREE.MathUtils.lerp(
          playerRef.current.rotation.z,
          bank,
          Math.min(1, dt * 8)
        );

        // Flicker materials when invincible
        const flicker = invT.current > 0
          ? 0.35 + Math.abs(Math.sin(Date.now() * 0.03)) * 0.65
          : 1;
        playerMatsRef.current.forEach((m) => {
          m.opacity = flicker;
          m.transparent = flicker < 1;
        });
        playerRef.current.scale.setScalar(pulse);
      } else {
        playerRef.current.scale.setScalar(pulse);
      }
    }

    if (phase !== "playing") return;

    gameT.current += dt;
    invT.current = Math.max(0, invT.current - dt);

    const speed = 2.6 + gameT.current * 0.07;
    const spawnInterval = Math.max(0.26, 1.05 - gameT.current * 0.014);

    scoreT.current += dt;
    if (scoreT.current >= 1) { scoreT.current -= 1; onScoreUp(); }

    spawnT.current += dt;
    if (spawnT.current >= spawnInterval) {
      spawnT.current = 0;
      const freeIdx = rocks.current.findIndex((r) => !r.active);
      if (freeIdx >= 0) rocks.current[freeIdx] = spawnRock(speed);
    }

    const px = playerRef.current?.position.x ?? 0;
    let dirty = false;

    rocks.current.forEach((r, i) => {
      if (!r.active) {
        iMeshRef.current?.setMatrixAt(i, hideMat.current);
        dirty = true;
        return;
      }

      r.y  += r.vy * dt;
      r.x  += r.vx * dt;
      r.rotX += r.rsX * dt;
      r.rotY += r.rsY * dt;
      r.rotZ += r.rsZ * dt;

      if (r.y < DEAD_Y) {
        r.active = false;
        return;
      }

      if (invT.current <= 0) {
        const dx = r.x - px;
        const dy = r.y - PLAYER_Y;
        if (Math.sqrt(dx * dx + dy * dy) < PLAYER_R + ROCK_R) {
          r.active = false;
          invT.current = 1.5;
          onHit();
          return;
        }
      }

      tmpEuler.current.set(r.rotX, r.rotY, r.rotZ);
      tmpMat.current.makeRotationFromEuler(tmpEuler.current);
      tmpMat.current.setPosition(r.x, r.y, 0);
      iMeshRef.current?.setMatrixAt(i, tmpMat.current);
      dirty = true;
    });

    if (dirty && iMeshRef.current) {
      iMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Background nebula — deepest */}
      <NebulaClouds />

      {/* Parallax star layers */}
      <StarLayer count={500} spread={28} depth={-7}   size={0.05}  color="#c084fc" opacity={0.55} speed={0.004} />
      <StarLayer count={260} spread={24} depth={-5}   size={0.08}  color="#f5d0fe" opacity={0.7}  speed={0.009} />
      <StarLayer count={140} spread={22} depth={-3.5} size={0.11}  color="#a5f3fc" opacity={0.85} speed={0.014} />

      <ambientLight intensity={0.3} />
      <pointLight position={[0,  5, 6]} intensity={3}   color="#c084fc" />
      <pointLight position={[0, -4, 5]} intensity={1.5} color="#22d3ee" />
      <pointLight position={[-6, 2, 2]} intensity={1.2} color="#d946ef" />

      {/* Player — procedural 3D rocket */}
      <group ref={playerRef} position={[0, PLAYER_Y, 0]}>
        {/* Nose cone (red) */}
        <mesh position={[0, 0.78, 0]} castShadow>
          <coneGeometry args={[0.28, 0.55, 24]} />
          <meshStandardMaterial
            ref={(m) => { if (m && !playerMatsRef.current.includes(m)) playerMatsRef.current.push(m); }}
            color="#ef4444"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Body (white cylinder) */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.85, 24]} />
          <meshStandardMaterial
            ref={(m) => { if (m && !playerMatsRef.current.includes(m)) playerMatsRef.current.push(m); }}
            color="#f1f5f9"
            roughness={0.35}
            metalness={0.6}
          />
        </mesh>

        {/* Red trim ring under the nose */}
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.285, 0.035, 12, 32]} />
          <meshStandardMaterial
            ref={(m) => { if (m && !playerMatsRef.current.includes(m)) playerMatsRef.current.push(m); }}
            color="#ef4444"
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* Window (cyan emissive porthole) */}
        <mesh position={[0, 0.2, 0.27]}>
          <sphereGeometry args={[0.11, 20, 16]} />
          <meshStandardMaterial
            ref={(m) => { if (m && !playerMatsRef.current.includes(m)) playerMatsRef.current.push(m); }}
            color="#0ea5e9"
            emissive="#22d3ee"
            emissiveIntensity={1.6}
            roughness={0.15}
            metalness={0.7}
          />
        </mesh>

        {/* Engine bell at the bottom */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.32, 0.22, 0.22, 24]} />
          <meshStandardMaterial
            ref={(m) => { if (m && !playerMatsRef.current.includes(m)) playerMatsRef.current.push(m); }}
            color="#52525b"
            roughness={0.4}
            metalness={0.85}
          />
        </mesh>

        {/* Three fins around the base — 0°, 120°, 240° */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a, i) => (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.28, -0.22, Math.cos(a) * 0.28]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.04, 0.36, 0.32]} />
            <meshStandardMaterial
              ref={(m) => { if (m && !playerMatsRef.current.includes(m)) playerMatsRef.current.push(m); }}
              color="#ef4444"
              roughness={0.4}
              metalness={0.5}
            />
          </mesh>
        ))}

        {/* Engine flame (additive cone — flickers via per-frame scale) */}
        <mesh ref={flameRef} position={[0, -0.75, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.18, 0.55, 18, 1, true]} />
          <meshBasicMaterial
            color="#fb923c"
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner blue-white flame core */}
        <mesh position={[0, -0.62, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.09, 0.3, 14, 1, true]} />
          <meshBasicMaterial
            color="#fde68a"
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Engine point-light — lights nearby asteroids */}
        <pointLight position={[0, -0.9, 0]} intensity={2.4} color="#fb923c" distance={3.5} />
      </group>

      <instancedMesh ref={iMeshRef} args={[geo, mat, MAX_ROCKS]} />
    </>
  );
}

// ── Exported game component ────────────────────────────────────────────────────
export default function AsteroidGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best,  setBest]  = useState(0);

  const phaseRef   = useRef<Phase>("idle");
  const targetXRef = useRef(0);
  const inputRef   = useRef({ left: false, right: false });
  const livesRef   = useRef(3);
  const scoreRef   = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const syncPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    livesRef.current = 3;
    targetXRef.current = 0;
    setScore(0);
    setLives(3);
    syncPhase("playing");
    containerRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHit = useCallback(() => {
    livesRef.current -= 1;
    setLives(livesRef.current);
    if (livesRef.current <= 0) {
      setBest((b) => Math.max(b, scoreRef.current));
      setTimeout(() => syncPhase("over"), 120);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScoreUp = useCallback(() => {
    scoreRef.current += 1;
    setScore(scoreRef.current);
  }, []);

  // ── Keyboard controls (global while mounted) ─────────────────────────────────
  useEffect(() => {
    const isGameKey = (k: string) =>
      k === "ArrowLeft" || k === "ArrowRight" || k === "a" || k === "A" ||
      k === "d" || k === "D";

    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        if (phaseRef.current !== "playing") {
          e.preventDefault();
          startGame();
          return;
        }
      }
      if (phaseRef.current !== "playing") return;
      if (!isGameKey(e.key)) return;
      e.preventDefault();
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        inputRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        inputRef.current.right = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        inputRef.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        inputRef.current.right = false;
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [startGame]);

  // ── Touch controls (drag on mobile) ──────────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "touch") return;
      const rect = e.currentTarget.getBoundingClientRect();
      targetXRef.current = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    },
    []
  );

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-[520px] md:h-[640px] rounded-3xl overflow-hidden select-none outline-none focus:ring-1 focus:ring-purple-500/30"
      style={{ touchAction: "none" }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 62 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#07040d" }}
      >
        <Suspense fallback={null}>
          <GameScene
            phaseRef={phaseRef}
            targetXRef={targetXRef}
            inputRef={inputRef}
            onHit={handleHit}
            onScoreUp={handleScoreUp}
          />
        </Suspense>
      </Canvas>

      {/* Subtle vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(7,4,13,0.75) 100%)",
        }}
      />

      {/* HUD */}
      {phase === "playing" && (
        <div className="pointer-events-none absolute top-4 left-0 right-0 px-6 flex justify-between items-center">
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`text-xl leading-none transition-colors duration-300 ${
                  i < lives ? "text-rose-400" : "text-zinc-700"
                }`}
              >
                ♥
              </span>
            ))}
          </div>
          <div className="font-mono text-xs text-zinc-400 tracking-widest">
            SCORE{" "}
            <span className="text-white font-bold text-sm ml-1 tabular-nums">
              {score}
            </span>
          </div>
        </div>
      )}

      {/* Key-hint chip while playing */}
      {phase === "playing" && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500">
          <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-300">←</kbd>
          <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-300">→</kbd>
          <span>or</span>
          <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-300">A</kbd>
          <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-300">D</kbd>
        </div>
      )}

      {/* Idle splash */}
      {phase === "idle" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 cursor-pointer"
          onClick={startGame}
        >
          <div className="text-center pointer-events-none">
            <p className="text-[10px] font-mono uppercase tracking-[0.38em] text-purple-400 mb-3">
              Mini Game
            </p>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              NEBULA DASH
            </h3>
            <p className="mt-3 text-zinc-400 text-sm flex items-center justify-center gap-2 flex-wrap">
              <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-200 font-mono text-xs">←</kbd>
              <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-200 font-mono text-xs">→</kbd>
              <span className="text-zinc-500">or</span>
              <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-200 font-mono text-xs">A</kbd>
              <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-200 font-mono text-xs">D</kbd>
              <span>· dodge the asteroids</span>
            </p>
          </div>
          <div className="px-7 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-800 text-white font-semibold text-sm pointer-events-none hover:shadow-[0_0_30px_-3px_rgba(168,85,247,0.7)]">
            Press Enter / Click to Start
          </div>
        </div>
      )}

      {/* Game-over screen */}
      {phase === "over" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={startGame}
        >
          <p className="text-purple-400 font-mono text-[10px] uppercase tracking-[0.38em] pointer-events-none">
            Game Over
          </p>
          <div className="text-center pointer-events-none">
            <p className="text-zinc-500 text-[10px] font-mono mb-1 tracking-widest">
              SCORE
            </p>
            <p className="text-6xl font-bold text-white tabular-nums">{score}</p>
          </div>
          {best > 0 && (
            <p className="text-xs font-mono text-zinc-500 pointer-events-none">
              Best: {best}
            </p>
          )}
          <div className="mt-1 px-7 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-800 text-white font-semibold text-sm pointer-events-none">
            Play Again
          </div>
        </div>
      )}
    </div>
  );
}
