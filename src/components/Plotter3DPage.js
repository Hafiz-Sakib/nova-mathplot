import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  Suspense,
  useCallback,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import * as math from "mathjs";

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

/* Color scheme helpers */
const COLOR_MAP = {
  cyan: "#22d3ee",
  violet: "#a78bfa",
  emerald: "#34d399",
  orange: "#fb923c",
  pink: "#f472b6",
  gold: "#fbbf24",
};

function heightToColor(h, scheme) {
  const t = Math.max(0, Math.min(1, h));
  switch (scheme) {
    case "violet":
      return [t * 0.5 + 0.3, 0.1, 0.9];
    case "emerald":
      return [0.0, t * 0.8 + 0.15, t * 0.4 + 0.1];
    case "orange":
      return [t * 0.8 + 0.2, t * 0.4, 0.05];
    case "pink":
      return [t * 0.7 + 0.3, 0.1 + t * 0.2, t * 0.6 + 0.3];
    case "gold":
      return [t * 0.9 + 0.1, t * 0.7 + 0.2, 0.0];
    case "rainbow":
      return [
        Math.sin(t * Math.PI),
        Math.sin(t * Math.PI * 0.7 + 1),
        Math.cos(t * Math.PI),
      ].map((v) => Math.abs(v));
    default:
      return [0.0, t * 0.7 + 0.15, 0.85]; // cyan
  }
}

/* Surface mesh component */
function SurfaceMesh({ preset, colorScheme, wireframe, opacity }) {
  const meshRef = useRef();
  const N = 70;

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = [],
      colors = [],
      indices = [];
    const range = preset.range || [
      [-4, 4],
      [-4, 4],
    ];
    const [uRange, vRange] = range;
    const [uMin, uMax] = uRange,
      [vMin, vMax] = vRange;
    let yMin = Infinity,
      yMax = -Infinity;
    const rawPts = [];
    for (let i = 0; i <= N; i++) {
      const row = [];
      for (let j = 0; j <= N; j++) {
        const u = uMin + (i / N) * (uMax - uMin);
        const v = vMin + (j / N) * (vMax - vMin);
        const p = preset.fn(u, v, 0) || [0, 0, 0];
        row.push(p);
        if (p[1] < yMin) yMin = p[1];
        if (p[1] > yMax) yMax = p[1];
        positions.push(p[0], p[1], p[2]);
      }
      rawPts.push(row);
    }
    const yRange = yMax - yMin || 1;
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) {
        const h = (rawPts[i][j][1] - yMin) / yRange;
        const [r, g, b] = heightToColor(h, colorScheme);
        colors.push(r, g, b);
      }
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const a = i * (N + 1) + j,
          b = a + 1,
          c = (i + 1) * (N + 1) + j,
          d = c + 1;
        indices.push(a, b, c, b, d, c);
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

  useFrame(({ clock }) => {
    if (!meshRef.current || !preset.animated) return;
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    const range = preset.range || [
      [-4, 4],
      [-4, 4],
    ];
    const [uRange, vRange] = range;
    const [uMin, uMax] = uRange,
      [vMin, vMax] = vRange;
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) {
        const u = uMin + (i / N) * (uMax - uMin),
          v = vMin + (j / N) * (vMax - vMin);
        const p = preset.fn(u, v, t) || [0, 0, 0];
        const idx = (i * (N + 1) + j) * 3;
        pos.array[idx] = p[0];
        pos.array[idx + 1] = p[1];
        pos.array[idx + 2] = p[2];
      }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  const color = COLOR_MAP[colorScheme] || "#22d3ee";
  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.25}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.06}
          transparent
          opacity={opacity}
        />
      </mesh>
      {wireframe && (
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}
    </group>
  );
}

/* Parametric line (helix, spiral, etc.) */
function ParametricLine({ preset, colorScheme, animated }) {
  const ref = useRef();
  const N = 600;
  const points = useMemo(() => {
    const pts = [];
    const range = preset.range || [
      [-1, 1],
      [-1, 1],
    ];
    const vRange = range[1];
    const [vMin, vMax] = vRange;
    for (let i = 0; i < N; i++) {
      const v = vMin + (i / N) * (vMax - vMin);
      const p = preset.fn(0, v, 0) || [0, 0, 0];
      pts.push(new THREE.Vector3(p[0], p[1], p[2]));
    }
    return pts;
  }, [preset]);

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points],
  );

  useFrame(({ clock }) => {
    if (!ref.current || !animated) return;
    const t = clock.getElapsedTime();
    const range = preset.range || [
      [-1, 1],
      [-1, 1],
    ];
    const vRange = range[1];
    const [vMin, vMax] = vRange;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < N; i++) {
      const v = vMin + (i / N) * (vMax - vMin);
      const p = preset.fn(0, v, t) || [0, 0, 0];
      pos.setXYZ(i, p[0], p[1], p[2]);
    }
    pos.needsUpdate = true;
  });

  const color = COLOR_MAP[colorScheme] || "#22d3ee";
  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

/* Custom function surface */
function CustomSurface({ expr, colorScheme, wireframe, opacity }) {
  const meshRef = useRef();
  const N = 60;
  const range = [
    [-4, 4],
    [-4, 4],
  ];

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = [],
      colors = [],
      indices = [];
    const [uRange, vRange] = range;
    const [uMin, uMax] = uRange,
      [vMin, vMax] = vRange;
    let yMin = Infinity,
      yMax = -Infinity;
    const rawY = [];
    for (let i = 0; i <= N; i++) {
      const row = [];
      for (let j = 0; j <= N; j++) {
        const x = uMin + (i / N) * (uMax - uMin),
          z = vMin + (j / N) * (vMax - vMin);
        const y = safeEval(expr, { x, y: z, z }) ?? 0;
        row.push(y);
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
        positions.push(x, y, z);
      }
      rawY.push(row);
    }
    const yRange2 = yMax - yMin || 1;
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) {
        const h = (rawY[i][j] - yMin) / yRange2;
        const [r, g, b] = heightToColor(h, colorScheme);
        colors.push(r, g, b);
      }
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const a = i * (N + 1) + j,
          b = a + 1,
          c = (i + 1) * (N + 1) + j,
          d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [expr, colorScheme]);

  const color = COLOR_MAP[colorScheme] || "#22d3ee";
  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.25}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.06}
          transparent
          opacity={opacity}
        />
      </mesh>
      {wireframe && (
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
}

/* Scene lighting */
function SceneLighting({ colorScheme }) {
  const c = COLOR_MAP[colorScheme] || "#22d3ee";
  return (
    <>
      <ambientLight intensity={0.25} color="#0a1628" />
      <pointLight position={[8, 8, 8]} intensity={1.8} color={c} />
      <pointLight position={[-8, -4, -8]} intensity={0.9} color="#8b5cf6" />
      <pointLight position={[0, -6, 0]} intensity={0.5} color="#ec4899" />
      <directionalLight position={[5, 10, 5]} intensity={0.6} color="#ffffff" />
    </>
  );
}

/* Camera zoom controller */
function CameraController({ zoom }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      const target = ref.current.object;
      const dir = target.position.clone().normalize();
      const dist = 14 / zoom;
      target.position.copy(dir.multiplyScalar(dist));
    }
  }, [zoom]);
  return (
    <OrbitControls
      ref={ref}
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={40}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
    />
  );
}

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
      Math.cos(v * 8 + t) * 1.5,
      v * 3,
      Math.sin(v * 8 + t) * 1.5,
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
      const x = (1 + (v / 2) * Math.cos(u / 2)) * Math.cos(u),
        y = (v / 2) * Math.sin(u / 2),
        z = (1 + (v / 2) * Math.cos(u / 2)) * Math.sin(u);
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
    id: "trefoil",
    name: "Trefoil Knot",
    icon: "✶",
    color: "violet",
    animated: true,
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const s = Math.sin(v),
        c = Math.cos(v);
      return [
        s + 2 * Math.sin(2 * v),
        c - 2 * Math.cos(2 * v),
        -Math.sin(3 * v),
      ].map((x) => x * 1.2);
    },
    type: "line",
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
      return [x, mag * Math.cos(x + y + t) * 2, y];
    },
    type: "surface",
  },
  {
    id: "klein",
    name: "Klein Bottle",
    icon: "∮",
    color: "gold",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => {
      const r = 4 * (1 - Math.cos(u) / 2);
      return [
        6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(u + Math.PI),
        16 * Math.sin(u),
        r * Math.sin(v),
      ].map((x) => x * 0.12);
    },
    type: "surface",
  },
  {
    id: "torus_knot",
    name: "Torus Knot",
    icon: "🪢",
    color: "orange",
    animated: true,
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const p = 2,
        q = 3,
        r = 0.3;
      const x = (2 + r * Math.cos(q * v)) * Math.cos(p * v),
        y = (2 + r * Math.cos(q * v)) * Math.sin(p * v),
        z = r * Math.sin(q * v);
      return [x, z, y];
    },
    type: "line",
  },
];

export default function Plotter3DPage() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [colorScheme, setColorScheme] = useState("cyan");
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [opacity, setOpacity] = useState(0.92);
  const [zoom, setZoom] = useState(1);
  const [customMode, setCustomMode] = useState(false);
  const [customExpr, setCustomExpr] = useState("sin(sqrt(x^2+y^2))");
  const [customInput, setCustomInput] = useState("sin(sqrt(x^2+y^2))");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.5, 8));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.5, 0.2));
  const handleZoomReset = () => setZoom(1);

  const controlsRef = useRef();

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="lg:hidden fixed bottom-6 left-4 z-50 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg,rgba(139,92,246,0.35),rgba(236,72,153,0.2))",
          border: "1px solid rgba(139,92,246,0.45)",
          boxShadow: "0 0 20px rgba(139,92,246,0.35)",
        }}
      >
        <span style={{ color: "#a78bfa", fontSize: "1.1rem" }}>☰</span>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto w-72 xl:w-80 flex flex-col border-r transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          borderColor: "rgba(139,92,246,0.15)",
          background: "linear-gradient(180deg,#020810 0%,#060418 100%)",
          top: "56px",
          height: "calc(100vh - 56px)",
        }}
      >
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(139,92,246,0.5),rgba(236,72,153,0.3),transparent)",
          }}
        />

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

        <div
          className="p-4 flex flex-col gap-4 border-b"
          style={{ borderColor: "rgba(139,92,246,0.08)" }}
        >
          {/* Custom function */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="section-label">Custom f(x,y)</div>
              <button
                onClick={() => setCustomMode((m) => !m)}
                className="font-mono-code text-[10px] px-2 py-1 rounded"
                style={{
                  background: customMode
                    ? "rgba(139,92,246,0.15)"
                    : "rgba(6,18,40,0.7)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  color: customMode ? "#a78bfa" : "#475569",
                }}
              >
                {customMode ? "ON" : "OFF"}
              </button>
            </div>
            {customMode && (
              <div className="flex gap-2">
                <input
                  className="nova-input-sm flex-1"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="sin(sqrt(x^2+y^2))"
                />
                <button
                  onClick={() => setCustomExpr(customInput)}
                  className="px-3 py-1 rounded-lg font-mono-code text-[10px]"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.4)",
                    color: "#a78bfa",
                  }}
                >
                  Plot
                </button>
              </div>
            )}
          </div>

          {/* Color scheme */}
          <div>
            <div className="section-label">Color Scheme</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "cyan", c: "#22d3ee" },
                { id: "violet", c: "#a78bfa" },
                { id: "emerald", c: "#34d399" },
                { id: "orange", c: "#fb923c" },
                { id: "pink", c: "#f472b6" },
                { id: "gold", c: "#fbbf24" },
                { id: "rainbow", c: "#f472b6" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setColorScheme(s.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg font-mono-code text-[10px] transition-all"
                  style={{
                    background:
                      colorScheme === s.id ? `${s.c}18` : "rgba(4,10,24,0.7)",
                    border: `1px solid ${colorScheme === s.id ? s.c + "60" : "rgba(139,92,246,0.12)"}`,
                    color: colorScheme === s.id ? s.c : "#475569",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: s.c }}
                  />
                  {s.id}
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
                { label: "Star Field", value: showStars, set: setShowStars },
                { label: "Wireframe", value: wireframe, set: setWireframe },
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

          {/* Opacity */}
          <div>
            <div className="section-label">Surface Opacity</div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(+e.target.value)}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, rgba(139,92,246,0.7) ${opacity * 100}%, rgba(6,18,40,0.8) ${opacity * 100}%)`,
              }}
            />
          </div>
        </div>

        {/* Presets */}
        <div className="p-4">
          <div className="section-label mb-2">
            3D Presets ({PRESETS.length})
          </div>
          <div className="flex flex-col gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPreset(p);
                  setCustomMode(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left"
                style={{
                  background:
                    preset.id === p.id ? "rgba(139,92,246,0.1)" : "transparent",
                  border: `1px solid ${preset.id === p.id ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.06)"}`,
                }}
              >
                <span
                  className="w-5 h-5 flex items-center justify-center rounded text-xs flex-shrink-0"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    color: "#a78bfa",
                  }}
                >
                  {p.icon}
                </span>
                <span
                  className="flex-1 font-rajdhani text-sm"
                  style={{ color: preset.id === p.id ? "#a78bfa" : "#64748b" }}
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
        </div>
      </aside>

      {/* 3D Canvas */}
      <main className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b flex-wrap gap-2"
          style={{
            borderColor: "rgba(139,92,246,0.1)",
            background: "rgba(2,4,16,0.8)",
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-orbitron text-xs font-bold"
              style={{ color: "#a78bfa" }}
            >
              {customMode ? `f(x,y) = ${customExpr}` : preset.name}
            </span>
            {preset.animated && !customMode && (
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
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <button
                className="zoom-btn"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                +
              </button>
              <button
                className="zoom-btn"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                −
              </button>
              <button
                className="zoom-btn"
                onClick={handleZoomReset}
                title="Reset"
                style={{ fontSize: "0.6rem", width: 32 }}
              >
                RST
              </button>
            </div>
            <span
              className="font-mono-code text-[9px] hidden sm:block"
              style={{ color: "#334155" }}
            >
              Drag: orbit · Scroll: zoom · Right: pan
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative" style={{ background: "#020810" }}>
          <Canvas
            camera={{ position: [6, 5, 8], fov: 50 }}
            gl={{ antialias: true, alpha: false }}
            style={{ background: "transparent" }}
          >
            <color attach="background" args={["#020810"]} />
            <SceneLighting
              colorScheme={
                customMode ? colorScheme : preset.color || colorScheme
              }
            />

            {showStars && (
              <Stars
                radius={100}
                depth={50}
                count={3000}
                factor={4}
                saturation={0}
                fade
                speed={0.4}
              />
            )}

            <Suspense fallback={null}>
              {customMode ? (
                <CustomSurface
                  expr={customExpr}
                  colorScheme={colorScheme}
                  wireframe={wireframe}
                  opacity={opacity}
                />
              ) : preset.type === "line" ? (
                <ParametricLine
                  preset={preset}
                  colorScheme={preset.color || colorScheme}
                  animated={preset.animated}
                />
              ) : (
                <SurfaceMesh
                  preset={preset}
                  colorScheme={preset.color || colorScheme}
                  wireframe={wireframe}
                  opacity={opacity}
                />
              )}
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
              minDistance={2}
              maxDistance={40}
              enableZoom
              enablePan
              enableRotate
            />
          </Canvas>
        </div>

        {/* Bottom info */}
        <div
          className="flex items-center justify-between px-4 py-2 border-t"
          style={{
            borderColor: "rgba(139,92,246,0.08)",
            background: "rgba(2,4,16,0.8)",
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
                  className="w-1.5 h-1.5 rounded-full"
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
            WebGL 2.0 · {customMode ? "60×60" : "70×70"} mesh
          </span>
        </div>
      </main>
    </div>
  );
}
