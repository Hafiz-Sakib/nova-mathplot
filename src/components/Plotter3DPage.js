import { useTheme } from "../ThemeContext";
import React, { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Stars } from "@react-three/drei";
import * as THREE from "three";
import * as math from "mathjs";
import { PRESETS } from "./presets3d";

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

const COLOR_MAP = {
  cyan: "#22d3ee",
  violet: "#a78bfa",
  emerald: "#34d399",
  orange: "#fb923c",
  pink: "#f472b6",
  gold: "#fbbf24",
  rainbow: "#f472b6",
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
        Math.abs(Math.sin(t * Math.PI)),
        Math.abs(Math.sin(t * Math.PI * 0.7 + 1)),
        Math.abs(Math.cos(t * Math.PI)),
      ];
    default: // cyan
      return [0.0, t * 0.7 + 0.15, 0.85];
  }
}

/* ─── Axis Lines ─── */
function AxisLines({ size = 6 }) {
  const axes = [
    { dir: [1, 0, 0], color: "#ef4444" },
    { dir: [0, 1, 0], color: "#22c55e" },
    { dir: [0, 0, 1], color: "#3b82f6" },
  ];
  return (
    <group>
      {axes.map(({ dir, color }) => {
        const points = [
          new THREE.Vector3(-dir[0] * size, -dir[1] * size, -dir[2] * size),
          new THREE.Vector3(dir[0] * size, dir[1] * size, dir[2] * size),
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={color} geometry={geo}>
            <lineBasicMaterial color={color} transparent opacity={0.6} />
          </line>
        );
      })}
    </group>
  );
}

/* ─── Attractor Line (animated draw-in) ─── */
function AttractorLine({ preset, colorScheme, animSpeed }) {
  const lineRef = useRef();
  const timeRef = useRef(0);

  const { geo, total } = useMemo(() => {
    const pts = [];
    const p = preset.attractor;
    let [x, y, z] = p.init;
    const dt = p.dt || 0.005;
    const steps = p.steps || 8000;
    for (let i = 0; i < steps; i++) {
      pts.push(new THREE.Vector3(x * p.scale, y * p.scale, z * p.scale));
      const [dx, dy, dz] = p.deriv(x, y, z);
      x += dx * dt;
      y += dy * dt;
      z += dz * dt;
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const count = pts.length;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const [r, gb, b] = heightToColor(t, colorScheme);
      arr[i * 3] = r;
      arr[i * 3 + 1] = gb;
      arr[i * 3 + 2] = b;
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(arr, 3));
    g.setDrawRange(0, 2);
    return { geo: g, total: count };
  }, [preset, colorScheme]);

  useFrame((_, delta) => {
    if (!lineRef.current) return;
    timeRef.current += delta * (animSpeed ?? 1);
    const progress = Math.min(1, timeRef.current / 5);
    lineRef.current.geometry.setDrawRange(
      0,
      Math.max(2, Math.floor(progress * total)),
    );
  });

  return (
    <line ref={lineRef} geometry={geo}>
      <lineBasicMaterial vertexColors />
    </line>
  );
}

/* ─── Surface Mesh ─── */
function SurfaceMesh({ preset, colorScheme, wireframe, opacity, animSpeed }) {
  const meshRef = useRef();
  const timeRef = useRef(0);
  const N = 60;

  // Build geometry — recompute only when preset changes
  const { geometry, rawPts, yMinBase, yMaxBase } = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = [],
      colors = [],
      indices = [];
    const range = preset.range || [
      [-4, 4],
      [-4, 4],
    ];
    const [[uMin, uMax], [vMin, vMax]] = range;
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
    return { geometry: geom, rawPts, yMinBase: yMin, yMaxBase: yMax };
  }, [preset]); // eslint-disable-line

  // Re-color when colorScheme changes (no geometry rebuild)
  useEffect(() => {
    const colorAttr = geometry.attributes.color;
    const yRange = yMaxBase - yMinBase || 1;
    let idx = 0;
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) {
        const h = (rawPts[i][j][1] - yMinBase) / yRange;
        const [r, g, b] = heightToColor(h, colorScheme);
        colorAttr.array[idx++] = r;
        colorAttr.array[idx++] = g;
        colorAttr.array[idx++] = b;
      }
    colorAttr.needsUpdate = true;
  }, [colorScheme, geometry, rawPts, yMinBase, yMaxBase]);

  // Animate vertices + recolor live
  useFrame((_, delta) => {
    if (!meshRef.current || !preset.animated) return;
    timeRef.current += delta * (animSpeed ?? 1);
    const t = timeRef.current;
    const range = preset.range || [
      [-4, 4],
      [-4, 4],
    ];
    const [[uMin, uMax], [vMin, vMax]] = range;
    const pos = meshRef.current.geometry.attributes.position;
    const colorAttr = meshRef.current.geometry.attributes.color;
    let yMin = Infinity,
      yMax = -Infinity;
    const ys = new Float32Array((N + 1) * (N + 1));
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) {
        const u = uMin + (i / N) * (uMax - uMin),
          v = vMin + (j / N) * (vMax - vMin);
        const p = preset.fn(u, v, t) || [0, 0, 0];
        const k = i * (N + 1) + j;
        pos.array[k * 3] = p[0];
        pos.array[k * 3 + 1] = p[1];
        pos.array[k * 3 + 2] = p[2];
        ys[k] = p[1];
        if (p[1] < yMin) yMin = p[1];
        if (p[1] > yMax) yMax = p[1];
      }
    const yRange = yMax - yMin || 1;
    for (let k = 0; k < ys.length; k++) {
      const h = (ys[k] - yMin) / yRange;
      const [r, g, b] = heightToColor(h, colorScheme);
      colorAttr.array[k * 3] = r;
      colorAttr.array[k * 3 + 1] = g;
      colorAttr.array[k * 3 + 2] = b;
    }
    pos.needsUpdate = true;
    colorAttr.needsUpdate = true;
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
          emissiveIntensity={0.08}
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

/* ─── Parametric Line ─── */
function ParametricLine({ preset, colorScheme, animated, animSpeed }) {
  const ref = useRef();
  const timeRef = useRef(0);
  const N = 800;

  const geometry = useMemo(() => {
    const range = preset.range || [
      [-1, 1],
      [-1, 1],
    ];
    const [vMin, vMax] = range[1];
    const pts = [];
    for (let i = 0; i < N; i++) {
      const v = vMin + (i / N) * (vMax - vMin);
      const p = preset.fn(0, v, 0) || [0, 0, 0];
      pts.push(new THREE.Vector3(p[0], p[1], p[2]));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    // gradient colors
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const [r, gb, b] = heightToColor(i / N, colorScheme);
      arr[i * 3] = r;
      arr[i * 3 + 1] = gb;
      arr[i * 3 + 2] = b;
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(arr, 3));
    return g;
  }, [preset]); // eslint-disable-line

  // Re-color on scheme change
  useEffect(() => {
    const colorAttr = geometry.attributes.color;
    for (let i = 0; i < N; i++) {
      const [r, g, b] = heightToColor(i / N, colorScheme);
      colorAttr.array[i * 3] = r;
      colorAttr.array[i * 3 + 1] = g;
      colorAttr.array[i * 3 + 2] = b;
    }
    colorAttr.needsUpdate = true;
  }, [colorScheme, geometry]);

  useFrame((_, delta) => {
    if (!ref.current || !animated) return;
    timeRef.current += delta * (animSpeed ?? 1);
    const t = timeRef.current;
    const range = preset.range || [
      [-1, 1],
      [-1, 1],
    ];
    const [vMin, vMax] = range[1];
    const pos = ref.current.geometry.attributes.position;
    const colorAttr = ref.current.geometry.attributes.color;
    for (let i = 0; i < N; i++) {
      const v = vMin + (i / N) * (vMax - vMin);
      const p = preset.fn(0, v, t) || [0, 0, 0];
      pos.setXYZ(i, p[0], p[1], p[2]);
      const h = (Math.sin((i / N) * Math.PI * 2 + t * 1.5) + 1) / 2;
      const [r, gb, b] = heightToColor(h, colorScheme);
      colorAttr.array[i * 3] = r;
      colorAttr.array[i * 3 + 1] = gb;
      colorAttr.array[i * 3 + 2] = b;
    }
    pos.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial vertexColors linewidth={2} />
    </line>
  );
}

/* ─── Custom Surface ─── */
function CustomSurface({ expr, colorScheme, wireframe, opacity }) {
  const N = 55;

  const { geometry, rawY, yMinBase, yMaxBase } = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = [],
      colors = [],
      indices = [];
    const uMin = -4,
      uMax = 4,
      vMin = -4,
      vMax = 4;
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
    const yRange = yMax - yMin || 1;
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) {
        const h = (rawY[i][j] - yMin) / yRange;
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
    return { geometry: geom, rawY, yMinBase: yMin, yMaxBase: yMax };
  }, [expr]); // eslint-disable-line

  useEffect(() => {
    const colorAttr = geometry.attributes.color;
    const yRange = yMaxBase - yMinBase || 1;
    let idx = 0;
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) {
        const h = (rawY[i][j] - yMinBase) / yRange;
        const [r, g, b] = heightToColor(h, colorScheme);
        colorAttr.array[idx++] = r;
        colorAttr.array[idx++] = g;
        colorAttr.array[idx++] = b;
      }
    colorAttr.needsUpdate = true;
  }, [colorScheme, geometry, rawY, yMinBase, yMaxBase]);

  const color = COLOR_MAP[colorScheme] || "#22d3ee";
  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.25}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.08}
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

/* ─── Category colors ─── */
const CATEGORY_COLORS = {
  Classic: "#22d3ee",
  Mathematical: "#f472b6",
  Topology: "#a78bfa",
  "Minimal Surfaces": "#34d399",
  Attractors: "#fb923c",
  Knots: "#fbbf24",
  Quadrics: "#60a5fa",
  "Differential Geometry": "#e879f9",
  Cosmic: "#818cf8",
};

const ALL_CATEGORIES = [
  ...new Set(PRESETS.map((p) => p.category || "Classic")),
];

export default function Plotter3DPage() {
  const { isDark } = useTheme();
  const [preset, setPreset] = useState(PRESETS[0]);
  const [colorScheme, setColorScheme] = useState("cyan");
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [opacity, setOpacity] = useState(0.92);
  const [animSpeed, setAnimSpeed] = useState(0.3);
  const [isPaused, setIsPaused] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customExpr, setCustomExpr] = useState("sin(sqrt(x^2+y^2))");
  const [customInput, setCustomInput] = useState("sin(sqrt(x^2+y^2))");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPresets =
    activeCategory === "All"
      ? PRESETS
      : PRESETS.filter((p) => (p.category || "Classic") === activeCategory);

  const activeColor = COLOR_MAP[colorScheme] || "#22d3ee";

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
        className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto flex flex-col border-r transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          width: "clamp(260px, 30vw, 300px)",
          borderColor: "rgba(139,92,246,0.15)",
          background: isDark
            ? "linear-gradient(180deg,#020810 0%,#060418 100%)"
            : "linear-gradient(180deg,#eef4ff 0%,#e8f0fc 100%)",
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
          className="px-3 py-3 border-b"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "#a78bfa", fontSize: "1rem" }}>🌌</span>
            <div>
              <div
                className="font-orbitron font-bold text-xs tracking-widest"
                style={{ color: "#a78bfa" }}
              >
                3D VISUALIZER
              </div>
              <div
                className="font-mono-code text-[9px]"
                style={{ color: isDark ? "#334155" : "#64748b" }}
              >
                {PRESETS.length} surfaces & curves
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-3 flex flex-col gap-3 border-b"
          style={{ borderColor: "rgba(139,92,246,0.08)" }}
        >
          {/* Custom function */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="section-label text-[10px]">Custom f(x,y)</div>
              <button
                onClick={() => setCustomMode((m) => !m)}
                className="font-mono-code text-[9px] px-2 py-0.5 rounded"
                style={{
                  background: customMode
                    ? "rgba(139,92,246,0.18)"
                    : "rgba(6,18,40,0.75)",
                  border: `1px solid ${customMode ? "#a78bfa" : "rgba(139,92,246,0.3)"}`,
                  color: customMode ? "#c4b5fd" : "#64748b",
                  boxShadow: customMode
                    ? "0 0 8px rgba(167,139,250,0.3)"
                    : "none",
                }}
              >
                {customMode ? "ON" : "OFF"}
              </button>
            </div>

            {customMode && (
              <div className="flex gap-1.5">
                <input
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg font-mono-code"
                  style={{
                    background: isDark
                      ? "rgba(15, 23, 42, 0.85)"
                      : "rgba(248, 250, 255, 0.95)",
                    border: `1px solid ${isDark ? "rgba(167, 139, 250, 0.35)" : "rgba(139, 92, 246, 0.25)"}`,
                    color: isDark ? "#e0e7ff" : "#1e2937",
                    outline: "none",
                  }}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setCustomExpr(customInput)
                  }
                  placeholder="sin(sqrt(x^2 + y^2))"
                />
                <button
                  onClick={() => setCustomExpr(customInput)}
                  className="px-4 py-1.5 rounded-lg font-mono-code text-[10px] font-medium transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #c026d3)",
                    color: "#fff",
                    boxShadow: "0 0 12px rgba(139, 92, 246, 0.5)",
                  }}
                >
                  Plot
                </button>
              </div>
            )}
          </div>

          {/* Color scheme */}
          <div>
            <div className="section-label text-[10px] mb-1.5">Color Scheme</div>
            <div className="flex flex-wrap gap-1">
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
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono-code text-[9px]"
                  style={{
                    background:
                      colorScheme === s.id
                        ? `${s.c}18`
                        : isDark
                          ? "rgba(4,10,24,0.7)"
                          : "rgba(255,255,255,0.88)",
                    border: `1px solid ${colorScheme === s.id ? s.c + "60" : "rgba(139,92,246,0.12)"}`,
                    color: colorScheme === s.id ? s.c : "#475569",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        s.id === "rainbow"
                          ? "linear-gradient(90deg,#f472b6,#22d3ee)"
                          : s.c,
                    }}
                  />
                  {s.id}
                </button>
              ))}
            </div>
          </div>

          {/* Scene toggles */}
          <div>
            <div className="section-label text-[10px] mb-1.5">
              Scene Options
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Auto Rotate", value: autoRotate, set: setAutoRotate },
                { label: "Show Grid", value: showGrid, set: setShowGrid },
                { label: "Star Field", value: showStars, set: setShowStars },
                { label: "Wireframe", value: wireframe, set: setWireframe },
                { label: "X/Y/Z Axes", value: showAxes, set: setShowAxes },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => opt.set((v) => !v)}
                >
                  <div
                    className={`toggle-track-nova ${opt.value ? "on" : ""}`}
                    style={{ transform: "scale(0.8)", transformOrigin: "left" }}
                  >
                    <div className="toggle-thumb-nova" />
                  </div>
                  <span
                    className="font-mono-code text-[9px]"
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
            <div className="section-label text-[10px] mb-1">
              Opacity: {Math.round(opacity * 100)}%
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(+e.target.value)}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, rgba(139,92,246,0.7) ${opacity * 100}%, ${isDark ? "rgba(6,18,40,0.8)" : "rgba(238,244,255,0.8)"} ${opacity * 100}%)`,
              }}
            />
          </div>

          {/* Animation Speed */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div
                className="section-label text-[10px]"
                style={{ color: isDark ? "#a78bfa" : "#6d28d9" }}
              >
                Anim Speed: {animSpeed.toFixed(2)}x
              </div>
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="font-mono-code text-[9px] px-2 py-0.5 rounded"
                style={{
                  background: isPaused
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(16,185,129,0.12)",
                  border: `1px solid ${isPaused ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.35)"}`,
                  color: isPaused ? "#f87171" : "#34d399",
                }}
              >
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
            </div>
            <input
              type="range"
              min="0.01"
              max="2"
              step="0.01"
              value={animSpeed}
              onChange={(e) => setAnimSpeed(+e.target.value)}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, rgba(236,72,153,0.7) ${(animSpeed / 2) * 100}%, ${isDark ? "rgba(6,18,40,0.8)" : "rgba(238,244,255,0.8)"} ${(animSpeed / 2) * 100}%)`,
              }}
            />
            <div className="flex justify-between mt-0.5">
              <span
                className="font-mono-code text-[8px]"
                style={{ color: isDark ? "#334155" : "#64748b" }}
              >
                Slow
              </span>
              <span
                className="font-mono-code text-[8px]"
                style={{ color: isDark ? "#334155" : "#64748b" }}
              >
                Fast
              </span>
            </div>
          </div>
        </div>

        {/* Category filter + preset list */}
        <div className="px-3 pt-3">
          <div className="section-label text-[10px] mb-1.5">Category</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {["All", ...ALL_CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="font-mono-code text-[8px] px-1.5 py-0.5 rounded"
                style={{
                  background:
                    activeCategory === cat
                      ? "rgba(139,92,246,0.2)"
                      : "rgba(4,10,24,0.7)",
                  border: `1px solid ${activeCategory === cat ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.1)"}`,
                  color: activeCategory === cat ? "#a78bfa" : "#475569",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="section-label text-[10px] mb-1.5">
            Presets ({filteredPresets.length})
          </div>
          <div className="flex flex-col gap-0.5 pb-4">
            {filteredPresets.map((p) => {
              const catColor =
                CATEGORY_COLORS[p.category || "Classic"] || "#a78bfa";
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPreset(p);
                    setCustomMode(false);
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left"
                  style={{
                    background:
                      preset.id === p.id
                        ? "rgba(139,92,246,0.1)"
                        : "transparent",
                    border: `1px solid ${preset.id === p.id ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.05)"}`,
                  }}
                >
                  <span
                    className="w-5 h-5 flex items-center justify-center rounded text-xs flex-shrink-0"
                    style={{
                      background: "rgba(139,92,246,0.08)",
                      color: catColor,
                      fontSize: "0.65rem",
                    }}
                  >
                    {p.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-rajdhani text-xs truncate"
                      style={{
                        color: preset.id === p.id ? "#a78bfa" : "#64748b",
                      }}
                    >
                      {p.name}
                    </div>
                    {p.equation && (
                      <div
                        className="font-mono-code truncate"
                        style={{
                          color: catColor + "bb",
                          fontSize: "0.6rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {p.equation}
                      </div>
                    )}
                    <div
                      className="font-mono-code text-[7px]"
                      style={{ color: catColor + "80" }}
                    >
                      {p.category || "Classic"}
                    </div>
                  </div>
                  {p.animated && (
                    <span
                      className="font-mono-code text-[7px] px-1 rounded flex-shrink-0"
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        color: "#34d399",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      ●
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b flex-wrap gap-2"
          style={{
            borderColor: "rgba(139,92,246,0.1)",
            background: "rgba(2,4,16,0.8)",
          }}
        >
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span
              className="font-orbitron text-xs font-bold truncate max-w-[200px]"
              style={{ color: activeColor }}
            >
              {customMode ? `f(x,y) = ${customExpr}` : preset.name}
            </span>
            {preset.animated && !customMode && (
              <span
                className="font-mono-code text-[9px] px-2 py-0.5 rounded-full animate-pulse-glow flex-shrink-0"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  color: "#34d399",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                ● LIVE
              </span>
            )}
            {!customMode && preset.category && (
              <span
                className="font-mono-code text-[8px] px-1.5 py-0.5 rounded flex-shrink-0"
                style={{
                  background: "rgba(139,92,246,0.08)",
                  color: CATEGORY_COLORS[preset.category] || "#a78bfa",
                }}
              >
                {preset.category}
              </span>
            )}
          </div>
          <span
            className="font-mono-code text-[8px] hidden sm:block"
            style={{ color: "#1e293b" }}
          >
            Drag·Scroll·RightClick
          </span>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 relative"
          style={{ background: isDark ? "#020810" : "#eef4ff" }}
        >
          <Canvas
            camera={{ position: [6, 5, 8], fov: 50 }}
            gl={{ antialias: true, alpha: false }}
          >
            <color
              attach="background"
              args={[isDark ? "#020810" : "#eef4ff"]}
            />
            <SceneLighting
              colorScheme={
                customMode ? colorScheme : preset.color || colorScheme
              }
            />

            {showStars && (
              <Stars
                radius={100}
                depth={50}
                count={2000}
                factor={4}
                saturation={0}
                fade
                speed={animSpeed}
              />
            )}
            {showAxes && <AxisLines size={5} />}

            <Suspense fallback={null}>
              {customMode ? (
                <CustomSurface
                  expr={customExpr}
                  colorScheme={colorScheme}
                  wireframe={wireframe}
                  opacity={opacity}
                />
              ) : preset.type === "attractor" ? (
                <AttractorLine
                  preset={preset}
                  colorScheme={preset.color || colorScheme}
                  animSpeed={isPaused ? 0 : animSpeed}
                />
              ) : preset.type === "line" ? (
                <ParametricLine
                  preset={preset}
                  colorScheme={preset.color || colorScheme}
                  animated={preset.animated}
                  animSpeed={isPaused ? 0 : animSpeed}
                />
              ) : (
                <SurfaceMesh
                  preset={preset}
                  colorScheme={colorScheme}
                  wireframe={wireframe}
                  opacity={opacity}
                  animSpeed={isPaused ? 0 : animSpeed}
                />
              )}
            </Suspense>

            {showGrid && (
              <Grid
                position={[0, -4, 0]}
                args={[20, 20]}
                cellSize={1}
                cellThickness={0.4}
                cellColor={isDark ? "#0e1f3a" : "#94a3b8"}
                sectionSize={5}
                sectionThickness={0.8}
                sectionColor={isDark ? "#0a3060" : "#475569"}
                fadeDistance={25}
                fadeStrength={1}
                infiniteGrid
              />
            )}

            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5 * animSpeed}
              minDistance={2}
              maxDistance={40}
              enableZoom
              enablePan
              enableRotate
            />
          </Canvas>

          {/* Axis legend */}
          {showAxes && (
            <div
              className="absolute bottom-10 right-3 flex flex-col gap-1 pointer-events-none"
              style={{
                background: isDark
                  ? "rgba(2,4,16,0.7)"
                  : "rgba(255,255,255,0.88)",
                border: isDark
                  ? "1px solid rgba(139,92,246,0.1)"
                  : "1px solid rgba(100,149,237,0.25)",
                borderRadius: 8,
                padding: "6px 10px",
              }}
            >
              {[
                ["X", "#ef4444"],
                ["Y", "#22c55e"],
                ["Z", "#3b82f6"],
              ].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-0.5 rounded"
                    style={{ background: c }}
                  />
                  <span
                    className="font-mono-code text-[9px]"
                    style={{ color: c }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Color scheme badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none"
            style={{
              background: isDark
                ? "rgba(2,4,16,0.75)"
                : "rgba(255,255,255,0.88)",
              border: `1px solid ${activeColor}30`,
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: activeColor,
                boxShadow: `0 0 6px ${activeColor}`,
              }}
            />
            <span
              className="font-mono-code text-[9px] capitalize"
              style={{ color: activeColor }}
            >
              {colorScheme}
            </span>
          </div>
        </div>

        {/* Bottom info */}
        <div
          className="flex items-center justify-between px-3 py-1.5 border-t"
          style={{
            borderColor: isDark
              ? "rgba(139,92,246,0.08)"
              : "rgba(100,149,237,0.2)",
            background: isDark ? "rgba(2,4,16,0.8)" : "rgba(238,244,255,0.95)",
          }}
        >
          <div className="flex items-center gap-3">
            {[
              ["Three.js", "#a78bfa"],
              ["R3F", "#f472b6"],
              ["WebGL", "#22d3ee"],
            ].map(([n, c]) => (
              <span
                key={n}
                className="font-mono-code text-[9px] flex items-center gap-1"
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: c }}
                />
                <span style={{ color: c }}>{n}</span>
              </span>
            ))}
          </div>
          <span
            className="font-mono-code text-[9px]"
            style={{ color: isDark ? "#475569" : "#1e293b" }}
          >
            {customMode ? "55×55" : "60×60"} mesh · {PRESETS.length} presets
          </span>
        </div>
      </main>
    </div>
  );
}
