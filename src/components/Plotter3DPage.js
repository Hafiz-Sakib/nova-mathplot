import React, { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";
import * as math from "mathjs";

/* ─── Math evaluation helpers ─── */
const PHI = (1 + Math.sqrt(5)) / 2;
const SCOPE = {
  pi: Math.PI,
  e: Math.E,
  phi: PHI,
  tau: 2 * Math.PI,
  sqrt: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
};

function safeEval(expr, vars) {
  try {
    const r = math.evaluate(expr, { ...SCOPE, ...vars });
    if (typeof r === "number" && isFinite(r)) return r;
    return null;
  } catch {
    return null;
  }
}

/* ─── Surface Mesh ─── */
function SurfaceMesh({ preset, customExpr, time, colorScheme }) {
  const meshRef = useRef();
  const lineRef = useRef();
  const N = 80;

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const indices = [];

    const buildPoint = (u, v, t) => {
      const p = preset.fn(u, v, t);
      return p || [0, 0, 0];
    };

    const range = preset.range || [
      [-4, 4],
      [-4, 4],
    ];
    const [uRange, vRange] = range;
    const uMin = uRange[0],
      uMax = uRange[1];
    const vMin = vRange[0],
      vMax = vRange[1];

    const pts = [];
    for (let i = 0; i <= N; i++) {
      const row = [];
      for (let j = 0; j <= N; j++) {
        const u = uMin + (i / N) * (uMax - uMin);
        const v = vMin + (j / N) * (vMax - vMin);
        const p = buildPoint(u, v, 0);
        row.push(p);
        positions.push(p[0], p[1], p[2]);
        // color by height
        const h = (p[1] + 3) / 6;
        const r =
          colorScheme === "cyan"
            ? 0
            : colorScheme === "violet"
              ? h * 0.5 + 0.3
              : h;
        const g =
          colorScheme === "cyan"
            ? h * 0.8 + 0.2
            : colorScheme === "violet"
              ? 0.1
              : 0.3;
        const b =
          colorScheme === "cyan" ? 0.8 : colorScheme === "violet" ? 0.9 : 0.1;
        colors.push(r, g, b);
      }
      pts.push(row);
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const a = i * (N + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (N + 1) + j;
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [preset, colorScheme]);

  // Animate
  useFrame(({ clock }) => {
    if (!meshRef.current || !preset.animated) return;
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    const range = preset.range || [
      [-4, 4],
      [-4, 4],
    ];
    const [uRange, vRange] = range;
    const uMin = uRange[0],
      uMax = uRange[1];
    const vMin = vRange[0],
      vMax = vRange[1];

    for (let i = 0; i <= N; i++) {
      for (let j = 0; j <= N; j++) {
        const u = uMin + (i / N) * (uMax - uMin);
        const v = vMin + (j / N) * (vMax - vMin);
        const p = preset.fn(u, v, t);
        const idx = (i * (N + 1) + j) * 3;
        pos.array[idx] = p[0];
        pos.array[idx + 1] = p[1];
        pos.array[idx + 2] = p[2];
      }
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  const colorMap = {
    cyan: "#06b6d4",
    violet: "#8b5cf6",
    emerald: "#10b981",
    orange: "#f97316",
    pink: "#ec4899",
  };
  const color = colorMap[colorScheme] || "#06b6d4";

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          wireframe={false}
          roughness={0.3}
          metalness={0.5}
          emissive={color}
          emissiveIntensity={0.08}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* ─── Helix ─── */
function HelixLine({ color = "#22d3ee", animated = false }) {
  const ref = useRef();
  const N = 400;
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 8;
      pts.push(
        new THREE.Vector3(Math.cos(t) * 2, t * 0.3 - 3.8, Math.sin(t) * 2),
      );
    }
    return pts;
  }, []);
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points],
  );

  useFrame(({ clock }) => {
    if (ref.current && animated) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

/* ─── Scene lighting ─── */
function SceneLighting({ colorScheme }) {
  const colorMap = {
    cyan: "#06b6d4",
    violet: "#8b5cf6",
    emerald: "#10b981",
    orange: "#f97316",
    pink: "#ec4899",
  };
  const c = colorMap[colorScheme] || "#06b6d4";
  return (
    <>
      <ambientLight intensity={0.3} color="#0a1628" />
      <pointLight position={[8, 8, 8]} intensity={1.5} color={c} />
      <pointLight position={[-8, -4, -8]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, -6, 0]} intensity={0.6} color="#ec4899" />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#ffffff" />
    </>
  );
}

/* ─── Presets ─── */
const PRESETS = [
  {
    id: "wave",
    name: "Wave Surface",
    icon: "〜",
    color: "cyan",
    animated: true,
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (u, v, t = 0) => [
      u,
      Math.sin(Math.sqrt(u * u + v * v) - t * 1.5) * 1.2,
      v,
    ],
    type: "surface",
  },
  {
    id: "helix",
    name: "Helix",
    icon: "⟳",
    color: "cyan",
    animated: true,
    range: [
      [-1, 1],
      [-1, 1],
    ],
    fn: (u, v, t = 0) => [
      Math.cos(u * 8 + t) * 1.5,
      u * 3,
      Math.sin(u * 8 + t) * 1.5,
    ],
    type: "line",
  },
  {
    id: "torus",
    name: "Torus",
    icon: "◎",
    color: "violet",
    animated: false,
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => {
      const R = 2.2,
        r = 0.8;
      return [
        (R + r * Math.cos(v)) * Math.cos(u),
        r * Math.sin(v),
        (R + r * Math.cos(v)) * Math.sin(u),
      ];
    },
    type: "surface",
  },
  {
    id: "saddle",
    name: "Saddle Surface",
    icon: "∩",
    color: "orange",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, (u * u - v * v) * 0.4, v],
    type: "surface",
  },
  {
    id: "paraboloid",
    name: "Paraboloid",
    icon: "∪",
    color: "emerald",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, (u * u + v * v) * 0.25, v],
    type: "surface",
  },
  {
    id: "ripple",
    name: "Ripple Surface",
    icon: "◉",
    color: "cyan",
    animated: true,
    range: [
      [-5, 5],
      [-5, 5],
    ],
    fn: (u, v, t = 0) => [
      u,
      Math.sin(u * 1.2 + t) * Math.cos(v * 1.2 + t) * 0.8,
      v,
    ],
    type: "surface",
  },
  {
    id: "mobius",
    name: "Möbius Strip",
    icon: "∞",
    color: "pink",
    range: [
      [0, Math.PI * 2],
      [-0.5, 0.5],
    ],
    fn: (u, v) => {
      const x = (1 + (v / 2) * Math.cos(u / 2)) * Math.cos(u);
      const y = (v / 2) * Math.sin(u / 2);
      const z = (1 + (v / 2) * Math.cos(u / 2)) * Math.sin(u);
      return [x * 2, y * 2, z * 2];
    },
    type: "surface",
  },
  {
    id: "sphere",
    name: "Sphere",
    icon: "○",
    color: "violet",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v) => [
      Math.sin(v) * Math.cos(u) * 2.5,
      Math.cos(v) * 2.5,
      Math.sin(v) * Math.sin(u) * 2.5,
    ],
    type: "surface",
  },
  {
    id: "hyperboloid",
    name: "Hyperboloid",
    icon: "X",
    color: "emerald",
    range: [
      [0, Math.PI * 2],
      [-2, 2],
    ],
    fn: (u, v) => [
      Math.cosh(v) * Math.cos(u) * 1.5,
      v * 1.5,
      Math.cosh(v) * Math.sin(u) * 1.5,
    ],
    type: "surface",
  },
  {
    id: "gaussian",
    name: "Gaussian",
    icon: "⌒",
    color: "orange",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, Math.exp(-(u * u + v * v) * 0.5) * 2, v],
    type: "surface",
  },
  {
    id: "spiral",
    name: "Spiral Staircase",
    icon: "🌀",
    color: "pink",
    animated: true,
    range: [
      [-1, 1],
      [0, Math.PI * 6],
    ],
    fn: (u, v, t = 0) => {
      const r = v / 3 + 0.5;
      return [
        r * Math.cos(v + t * 0.5),
        v * 0.5 - 4.7,
        r * Math.sin(v + t * 0.5),
      ];
    },
    type: "line",
  },
  {
    id: "dhelix",
    name: "Double Helix",
    icon: "⋈",
    color: "cyan",
    animated: true,
    range: [
      [-1, 1],
      [0, Math.PI * 6],
    ],
    fn: (u, v, t = 0) => [
      Math.cos(v + u * Math.PI + t * 0.5) * 2,
      v * 0.7 - 6.6,
      Math.sin(v + u * Math.PI + t * 0.5) * 2,
    ],
    type: "line",
  },
  {
    id: "flower",
    name: "Parametric Flower",
    icon: "❀",
    color: "pink",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v) => {
      const r = Math.sin(u * 3) * 0.5 + 1.5;
      return [
        r * Math.sin(v) * Math.cos(u) * 1.5,
        r * Math.cos(v) * 1.5,
        r * Math.sin(v) * Math.sin(u) * 1.5,
      ];
    },
    type: "surface",
  },
  {
    id: "lorenz",
    name: "Lorenz (approx)",
    icon: "🦋",
    color: "orange",
    animated: true,
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const s = 10,
        r = 28,
        b = 8 / 3;
      const x = Math.sin(u * 3 + t) * 2.5;
      const y = Math.cos(v * 2 + t) * 1.5;
      const z = Math.sin(u * v * 0.2 + t) * 2;
      return [x * 0.4, y * 0.4, z * 0.4];
    },
    type: "surface",
  },
  {
    id: "complexwave",
    name: "Complex Exp",
    icon: "ℂ",
    color: "violet",
    animated: true,
    range: [
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI],
    ],
    fn: (x, y, t = 0) => {
      const mag = Math.exp((-0.3 * (x * x + y * y)) / 4);
      const phase = x + y + t;
      return [x, mag * Math.cos(phase) * 2, y];
    },
    type: "surface",
  },
];

/* ─── Main 3D Scene ─── */
function Scene({ preset, colorScheme }) {
  const colorMap = {
    cyan: "#22d3ee",
    violet: "#a78bfa",
    emerald: "#34d399",
    orange: "#fb923c",
    pink: "#f472b6",
  };
  const color = colorMap[preset.color] || "#22d3ee";

  if (preset.type === "line") {
    return <HelixLine color={color} animated={preset.animated} />;
  }
  return (
    <SurfaceMesh preset={preset} colorScheme={preset.color || colorScheme} />
  );
}

/* ─── Controls Panel ─── */
function ControlPanel({
  preset,
  setPreset,
  colorScheme,
  setColorScheme,
  autoRotate,
  setAutoRotate,
  showGrid,
  setShowGrid,
  showStars,
  setShowStars,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Color scheme */}
      <div>
        <div className="section-label">Color Scheme</div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "cyan", label: "Cyan", c: "#22d3ee" },
            { id: "violet", label: "Violet", c: "#a78bfa" },
            { id: "emerald", label: "Emerald", c: "#34d399" },
            { id: "orange", label: "Orange", c: "#fb923c" },
            { id: "pink", label: "Pink", c: "#f472b6" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setColorScheme(s.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono-code text-[10px] transition-all"
              style={{
                background:
                  colorScheme === s.id ? `${s.c}18` : "rgba(4,10,24,0.7)",
                border: `1px solid ${colorScheme === s.id ? s.c + "60" : "rgba(6,182,212,0.1)"}`,
                color: colorScheme === s.id ? s.c : "#475569",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: s.c }}
              />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scene toggles */}
      <div>
        <div className="section-label">Scene Options</div>
        <div className="flex flex-col gap-2">
          {[
            { label: "Auto Rotate", value: autoRotate, set: setAutoRotate },
            { label: "Show Grid", value: showGrid, set: setShowGrid },
            { label: "Stars Background", value: showStars, set: setShowStars },
          ].map((opt) => (
            <div
              key={opt.label}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => opt.set((v) => !v)}
            >
              <div className={`toggle-track-nova ${opt.value ? "on" : ""}`}>
                <div className="toggle-thumb-nova" />
              </div>
              <span
                className="font-mono-code text-xs"
                style={{ color: opt.value ? "#22d3ee" : "#475569" }}
              >
                {opt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main 3D Page ─── */
export default function Plotter3DPage() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [colorScheme, setColorScheme] = useState("cyan");
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(true);

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 60px)" }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="lg:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))",
          border: "1px solid rgba(139,92,246,0.4)",
          boxShadow: "0 0 20px rgba(139,92,246,0.3)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M1 4h14M1 8h14M1 12h14"
            stroke="#a78bfa"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto w-80 xl:w-88 flex flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto`}
        style={{
          borderColor: "rgba(139,92,246,0.15)",
          background: "linear-gradient(180deg, #020810 0%, #060418 100%)",
          top: "60px",
          height: "calc(100vh - 60px)",
        }}
      >
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(236,72,153,0.3), transparent)",
          }}
        />

        {/* Title */}
        <div
          className="px-4 py-4 border-b"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.3)",
              }}
            >
              <span style={{ color: "#a78bfa", fontSize: "0.85rem" }}>🌌</span>
            </div>
            <div>
              <div
                className="font-orbitron font-bold text-xs tracking-widest"
                style={{ color: "#a78bfa" }}
              >
                3D VISUALIZER
              </div>
              <div
                className="font-mono-code text-[9px] tracking-widest"
                style={{ color: "#334155" }}
              >
                Surface & Parametric
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(139,92,246,0.08)" }}
        >
          <ControlPanel
            preset={preset}
            setPreset={setPreset}
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showStars={showStars}
            setShowStars={setShowStars}
          />
        </div>

        {/* Presets */}
        <div className="p-4">
          <button
            onClick={() => setCatOpen((o) => !o)}
            className="section-label w-full text-left cursor-pointer mb-2"
            style={{ color: catOpen ? "#a78bfa" : "#334155" }}
          >
            3D Presets ({PRESETS.length})
          </button>
          {catOpen && (
            <div className="grid grid-cols-1 gap-1 animate-slide-down">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left"
                  style={{
                    background:
                      preset.id === p.id
                        ? "rgba(139,92,246,0.1)"
                        : "transparent",
                    border: `1px solid ${preset.id === p.id ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.08)"}`,
                  }}
                >
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-xs flex-shrink-0"
                    style={{
                      background: "rgba(139,92,246,0.1)",
                      color: "#a78bfa",
                    }}
                  >
                    {p.icon}
                  </span>
                  <span
                    className="flex-1 font-rajdhani text-sm"
                    style={{
                      color: preset.id === p.id ? "#a78bfa" : "#64748b",
                    }}
                  >
                    {p.name}
                  </span>
                  {p.animated && (
                    <span
                      className="font-mono-code text-[8px] px-1 rounded"
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        color: "#34d399",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      anim
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* 3D Canvas area */}
      <main className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{
            borderColor: "rgba(139,92,246,0.1)",
            background: "rgba(2,4,16,0.7)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-orbitron text-xs font-bold"
              style={{ color: "#a78bfa" }}
            >
              {preset.name}
            </span>
            {preset.animated && (
              <span
                className="font-mono-code text-[9px] px-2 py-0.5 rounded-full animate-pulse-glow"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  color: "#34d399",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                ● ANIMATED
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-3 font-mono-code text-[10px]"
            style={{ color: "#334155" }}
          >
            <span>Orbit: drag</span>
            <span>Zoom: scroll</span>
            <span>Pan: right-drag</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1" style={{ background: "#020810" }}>
          <Canvas
            camera={{ position: [6, 5, 8], fov: 50 }}
            gl={{ antialias: true, alpha: false }}
            style={{ background: "transparent" }}
          >
            <color attach="background" args={["#020810"]} />

            <SceneLighting colorScheme={preset.color || colorScheme} />

            {showStars && (
              <Stars
                radius={100}
                depth={50}
                count={3000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
              />
            )}

            <Suspense fallback={null}>
              <Scene
                preset={preset}
                colorScheme={preset.color || colorScheme}
              />
            </Suspense>

            {showGrid && (
              <Grid
                position={[0, -4, 0]}
                args={[20, 20]}
                cellSize={1}
                cellThickness={0.4}
                cellColor="#0e1f3a"
                sectionSize={5}
                sectionThickness={0.8}
                sectionColor="#0a3060"
                fadeDistance={25}
                fadeStrength={1}
                infiniteGrid
              />
            )}

            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
              minDistance={3}
              maxDistance={30}
            />
          </Canvas>
        </div>

        {/* Bottom info */}
        <div
          className="flex items-center justify-between px-4 py-2 border-t"
          style={{
            borderColor: "rgba(139,92,246,0.08)",
            background: "rgba(2,4,16,0.7)",
          }}
        >
          <div className="flex items-center gap-4">
            {[
              ["Three.js", "Renderer", "#a78bfa"],
              ["R3F", "Bridge", "#f472b6"],
              ["GPU", "Accel", "#22d3ee"],
            ].map(([n, l, c]) => (
              <span
                key={n}
                className="font-mono-code text-[10px] flex items-center gap-1.5"
                style={{ color: "#334155" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: c }}
                />
                {l}: <span style={{ color: c }}>{n}</span>
              </span>
            ))}
          </div>
          <span
            className="font-mono-code text-[10px]"
            style={{ color: "#1e293b" }}
          >
            WebGL 2.0 • 80×80 mesh
          </span>
        </div>
      </main>
    </div>
  );
}
