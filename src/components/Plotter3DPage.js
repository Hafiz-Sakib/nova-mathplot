import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  Suspense,
  useCallback,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Stars } from "@react-three/drei";
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
      return [0.0, t * 0.7 + 0.15, 0.85];
  }
}

/* ─── Axis Lines ─── */
function AxisLines({ size = 6 }) {
  const axes = [
    { dir: [1, 0, 0], color: "#ef4444", label: "X" },
    { dir: [0, 1, 0], color: "#22c55e", label: "Y" },
    { dir: [0, 0, 1], color: "#3b82f6", label: "Z" },
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

/* ─── Attractor Line (for Lorenz/Rossler) ─── */
function AttractorLine({ preset, colorScheme }) {
  const geo = useMemo(() => {
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
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [preset]);
  const color = COLOR_MAP[colorScheme] || "#22d3ee";
  const colorsArr = useMemo(() => {
    const count = geo.attributes.position.count;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const [r, g, b] = heightToColor(t, colorScheme);
      arr[i * 3] = r;
      arr[i * 3 + 1] = g;
      arr[i * 3 + 2] = b;
    }
    return arr;
  }, [geo, colorScheme]);
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colorsArr, 3));
  return (
    <line geometry={geo}>
      <lineBasicMaterial vertexColors />
    </line>
  );
}

/* ─── Surface Mesh ─── */
function SurfaceMesh({ preset, colorScheme, wireframe, opacity }) {
  const meshRef = useRef();
  const N = 60;

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
    const range = preset.range || [
      [-4, 4],
      [-4, 4],
    ];
    const [uRange, vRange] = range;
    const [uMin, uMax] = uRange,
      [vMin, vMax] = vRange;
    const pos = meshRef.current.geometry.attributes.position;
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

/* ─── Parametric Line ─── */
function ParametricLine({ preset, colorScheme, animated }) {
  const ref = useRef();
  const N = 800;
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
    const [vMin, vMax] = range[1];
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

/* ─── Custom Surface ─── */
function CustomSurface({ expr, colorScheme, wireframe, opacity }) {
  const meshRef = useRef();
  const N = 55;
  const geometry = useMemo(() => {
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

/* ──────────────────────────────────────────────
   ALL PRESETS (original + 30 new)
────────────────────────────────────────────── */
const PRESETS = [
  /* ── Original Presets ── */
  {
    id: "wave",
    name: "Wave Surface",
    icon: "〜",
    color: "cyan",
    animated: true,
    category: "Classic",
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
    category: "Classic",
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
    category: "Classic",
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
    category: "Classic",
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
    category: "Classic",
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
    category: "Classic",
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
    id: "sphere",
    name: "Sphere",
    icon: "○",
    color: "violet",
    category: "Classic",
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
    id: "gaussian",
    name: "Gaussian",
    icon: "⌒",
    color: "orange",
    category: "Classic",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, Math.exp(-(u * u + v * v) * 0.5) * 2, v],
    type: "surface",
  },
  {
    id: "spiral",
    name: "Spiral",
    icon: "🌀",
    color: "pink",
    animated: true,
    category: "Classic",
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
    id: "flower",
    name: "Parametric Flower",
    icon: "❀",
    color: "pink",
    category: "Classic",
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
    id: "hyperboloid",
    name: "Hyperboloid",
    icon: "X",
    color: "emerald",
    category: "Classic",
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
    id: "complexwave",
    name: "Complex Exp",
    icon: "ℂ",
    color: "violet",
    animated: true,
    category: "Classic",
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

  /* ── NEW: Mathematical Surfaces ── */
  {
    id: "spherical_harmonics",
    name: "Spherical Harmonics",
    icon: "Yₗₘ",
    color: "violet",
    category: "Mathematical",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (phi, theta) => {
      const m = 3,
        n = 2;
      const r = Math.abs(Math.sin(m * theta) * Math.cos(n * phi)) * 2 + 0.3;
      return [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(phi),
      ];
    },
    type: "surface",
  },
  {
    id: "superformula",
    name: "Superformula",
    icon: "🌸",
    color: "pink",
    category: "Mathematical",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (phi, theta) => {
      const m = 6,
        a = 1,
        b = 1,
        n1 = 2,
        n2 = 7,
        n3 = 7;
      const ang = (m * phi) / 4;
      const r1 = Math.pow(
        Math.pow(Math.abs(Math.cos(ang) / a), n2) +
          Math.pow(Math.abs(Math.sin(ang) / b), n3),
        -1 / n1,
      );
      const r = r1 * 1.5;
      return [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(phi),
      ];
    },
    type: "surface",
  },
  {
    id: "gyroid",
    name: "Gyroid",
    icon: "⬡",
    color: "emerald",
    category: "Minimal Surfaces",
    range: [
      [-Math.PI * 1.5, Math.PI * 1.5],
      [-Math.PI * 1.5, Math.PI * 1.5],
    ],
    fn: (u, v) => {
      // Gyroid approximation: marching iso-surface slice
      const x = u,
        z = v;
      // Find y where sin(x)cos(y)+sin(y)cos(z)+sin(z)cos(x)=0 approximately
      const y = Math.asin(
        Math.max(
          -1,
          Math.min(
            1,
            -(Math.sin(z) * Math.cos(x)) /
              Math.max(0.01, Math.abs(Math.cos(x * 0.5))),
          ),
        ),
      );
      return [x * 0.8, y * 0.8, z * 0.8];
    },
    type: "surface",
  },
  {
    id: "schwarz_p",
    name: "Schwarz P Surface",
    icon: "𝒫",
    color: "cyan",
    category: "Minimal Surfaces",
    range: [
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI],
    ],
    fn: (u, v) => {
      const x = u,
        z = v;
      const y = Math.acos(
        Math.max(-1, Math.min(1, -(Math.cos(x) + Math.cos(z)))),
      );
      return [x * 0.9, (y - Math.PI / 2) * 0.9, z * 0.9];
    },
    type: "surface",
  },
  {
    id: "enneper",
    name: "Enneper Surface",
    icon: "𝔼",
    color: "gold",
    category: "Minimal Surfaces",
    range: [
      [-1.5, 1.5],
      [-1.5, 1.5],
    ],
    fn: (u, v) => [
      (u - (u * u * u) / 3 + u * v * v) * 0.6,
      (u * u - v * v) * 0.6,
      (v - (v * v * v) / 3 + v * u * u) * 0.6,
    ],
    type: "surface",
  },
  {
    id: "mobius",
    name: "Möbius Strip",
    icon: "∞",
    color: "pink",
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [-0.6, 0.6],
    ],
    fn: (u, v) => [
      (1 + v * Math.cos(u / 2)) * Math.cos(u) * 2,
      v * Math.sin(u / 2) * 2,
      (1 + v * Math.cos(u / 2)) * Math.sin(u) * 2,
    ],
    type: "surface",
  },
  {
    id: "klein",
    name: "Klein Bottle",
    icon: "∮",
    color: "gold",
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => {
      const r = 4;
      const x =
        (r +
          Math.cos(u / 2) * Math.sin(v) -
          Math.sin(u / 2) * Math.sin(2 * v)) *
        Math.cos(u);
      const y =
        (r +
          Math.cos(u / 2) * Math.sin(v) -
          Math.sin(u / 2) * Math.sin(2 * v)) *
        Math.sin(u);
      const z =
        Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v);
      return [x * 0.28, z * 0.28, y * 0.28];
    },
    type: "surface",
  },
  {
    id: "lorenz",
    name: "Lorenz Attractor",
    icon: "🦋",
    color: "cyan",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [0.1, 0, 0],
      scale: 0.09,
      dt: 0.005,
      steps: 10000,
      deriv: (x, y, z) => {
        const sigma = 10,
          rho = 28,
          beta = 8 / 3;
        return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
      },
    },
  },
  {
    id: "rossler",
    name: "Rössler Attractor",
    icon: "🌀",
    color: "violet",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [1, 1, 1],
      scale: 0.12,
      dt: 0.008,
      steps: 8000,
      deriv: (x, y, z) => {
        const a = 0.2,
          b = 0.2,
          c = 5.7;
        return [-y - z, x + a * y, b + z * (x - c)];
      },
    },
  },
  {
    id: "torus_knot",
    name: "Torus Knot (2,3)",
    icon: "🪢",
    color: "orange",
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => {
      const p = 2,
        q = 3,
        R = 2,
        r = 0.5;
      return [
        (R + r * Math.cos(q * v)) * Math.cos(p * v),
        r * Math.sin(q * v),
        (R + r * Math.cos(q * v)) * Math.sin(p * v),
      ];
    },
    type: "line",
  },
  {
    id: "lissajous_knot",
    name: "Lissajous Knot",
    icon: "⊛",
    color: "emerald",
    category: "Knots",
    animated: true,
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => [
      Math.sin(3 * v + t * 0.2) * 2,
      Math.sin(4 * v) * 2,
      Math.sin(5 * v + Math.PI / 6) * 2,
    ],
    type: "line",
  },
  {
    id: "trefoil_knot",
    name: "Trefoil Knot",
    icon: "✶",
    color: "violet",
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => [
      (Math.sin(v) + 2 * Math.sin(2 * v)) * 1.2,
      (Math.cos(v) - 2 * Math.cos(2 * v)) * 1.2,
      -Math.sin(3 * v) * 1.2,
    ],
    type: "line",
  },
  {
    id: "figure_eight_knot",
    name: "Figure-Eight Knot",
    icon: "∞",
    color: "pink",
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => [
      (2 + Math.cos(2 * v)) * Math.cos(3 * v) * 0.7,
      (2 + Math.cos(2 * v)) * Math.sin(3 * v) * 0.7,
      Math.sin(4 * v) * 0.7,
    ],
    type: "line",
  },
  {
    id: "heart_surface",
    name: "Heart Surface",
    icon: "❤",
    color: "pink",
    category: "Mathematical",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (u, v) => {
      // Heart parametric (approximate level set)
      const x = u * 1.5;
      const z = v * 1.5;
      // y = cube root of (x^2 z^3 / (x^2 + 9y^2/4 + z^2 - 1)^3 ...)
      // Simple parametric heart surface
      const t = u * Math.PI,
        s = (v * Math.PI) / 2;
      const px = 4 * Math.pow(Math.sin(t), 3) * Math.cos(s) * 0.6;
      const py =
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)) *
        0.12 *
        Math.abs(Math.cos(s));
      const pz = 4 * Math.pow(Math.sin(t), 3) * Math.sin(s) * 0.6;
      return [px, py, pz];
    },
    type: "surface",
  },
  {
    id: "hyperbolic_paraboloid",
    name: "Hyperbolic Paraboloid",
    icon: "⌗",
    color: "gold",
    category: "Quadrics",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, (u * u - v * v) * 0.3, v],
    type: "surface",
  },
  {
    id: "wave_interference",
    name: "Wave Interference",
    icon: "≋",
    color: "cyan",
    animated: true,
    category: "Mathematical",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v, t = 0) => [
      u,
      Math.sin(u * u + v * v + t) *
        Math.cos(3 * u + t * 0.5) *
        Math.sin(3 * v) *
        0.8,
      v,
    ],
    type: "surface",
  },
  {
    id: "fractal_noise",
    name: "Fractal Noise Surface",
    icon: "🌊",
    color: "emerald",
    category: "Mathematical",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => {
      let z = 0;
      for (let n = 1; n <= 5; n++)
        z +=
          (Math.sin(Math.pow(2, n) * u) * Math.cos(Math.pow(2, n) * v)) /
          Math.pow(2, n);
      return [u, z * 0.8, v];
    },
    type: "surface",
  },
  {
    id: "boys_surface",
    name: "Boy's Surface",
    icon: "𝔹",
    color: "violet",
    category: "Topology",
    range: [
      [0, Math.PI],
      [0, Math.PI],
    ],
    fn: (u, v) => {
      // Boy's surface parametric approximation
      const x = Math.cos(u) * Math.sin(v);
      const y = Math.sin(u) * Math.sin(v);
      const z = Math.cos(v);
      const denom = Math.sqrt(2) - Math.sin(2 * u) * Math.sin(3 * v);
      const bx = Math.sqrt(2) * x * x - y * y - z * z + Math.sqrt(2) * x * z;
      const by = Math.sqrt(2) * (y * y - x * x) + Math.sqrt(2) * y * z;
      const bz = (3 * z * z) / 2;
      return [(bx / denom) * 1.2, (bz / denom) * 1.2, (by / denom) * 1.2];
    },
    type: "surface",
  },
  {
    id: "roman_surface",
    name: "Roman Surface (Steiner)",
    icon: "🏛",
    color: "orange",
    category: "Topology",
    range: [
      [0, Math.PI],
      [0, Math.PI],
    ],
    fn: (u, v) => [
      Math.sin(2 * u) * Math.cos(v) * Math.cos(v) * 2,
      Math.sin(u) * Math.sin(2 * v) * 2,
      Math.cos(u) * Math.sin(2 * v) * 2,
    ],
    type: "surface",
  },
  {
    id: "dini_surface",
    name: "Dini's Surface",
    icon: "ð",
    color: "gold",
    category: "Differential Geometry",
    range: [
      [0, Math.PI * 4],
      [0.05, 2],
    ],
    fn: (u, v) => {
      const a = 1,
        b = 0.2;
      return [
        a * Math.cos(u) * Math.sin(v) * 0.8,
        a * Math.sin(u) * Math.sin(v) * 0.8,
        a * (Math.cos(v) + Math.log(Math.tan(v / 2))) * 0.8 + b * u * 0.8,
      ];
    },
    type: "surface",
  },
  {
    id: "catenoid",
    name: "Catenoid",
    icon: "🪣",
    color: "cyan",
    category: "Minimal Surfaces",
    range: [
      [0, Math.PI * 2],
      [-2, 2],
    ],
    fn: (u, v) => {
      const a = 1;
      return [
        a * Math.cosh(v / a) * Math.cos(u) * 1.2,
        v * 1.2,
        a * Math.cosh(v / a) * Math.sin(u) * 1.2,
      ];
    },
    type: "surface",
  },
  {
    id: "helicoid",
    name: "Helicoid",
    icon: "🐚",
    color: "emerald",
    category: "Minimal Surfaces",
    animated: true,
    range: [
      [0, Math.PI * 4],
      [-2, 2],
    ],
    fn: (u, v, t = 0) => [
      v * Math.cos(u + t * 0.3) * 1.2,
      u * 0.5 - Math.PI,
      v * Math.sin(u + t * 0.3) * 1.2,
    ],
    type: "surface",
  },
  {
    id: "whitney_umbrella",
    name: "Whitney Umbrella",
    icon: "☂",
    color: "pink",
    category: "Topology",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (u, v) => [u * v * 0.8, u * 0.8, v * v * 0.8],
    type: "surface",
  },
  {
    id: "hopf_fibration",
    name: "Hopf Fibration",
    icon: "ℍ",
    color: "violet",
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => {
      // Hopf fibration fiber visualization
      const theta = v,
        phi = u,
        psi = u * 2;
      const x = Math.cos((theta + phi) / 2) * Math.cos((theta - phi) / 2 + psi);
      const y = Math.cos((theta + phi) / 2) * Math.sin((theta - phi) / 2 + psi);
      const z = Math.sin((theta + phi) / 2) * Math.cos((theta - phi) / 2);
      const w = Math.sin((theta + phi) / 2) * Math.sin((theta - phi) / 2);
      // Project from S³ to R³ via stereographic
      const denom = 1 - w + 0.01;
      return [(x / denom) * 1.5, (y / denom) * 1.5, (z / denom) * 1.5];
    },
    type: "surface",
  },
];

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
};

const ALL_CATEGORIES = [
  ...new Set(PRESETS.map((p) => p.category || "Classic")),
];

export default function Plotter3DPage() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [colorScheme, setColorScheme] = useState("cyan");
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [opacity, setOpacity] = useState(0.92);
  const [customMode, setCustomMode] = useState(false);
  const [customExpr, setCustomExpr] = useState("sin(sqrt(x^2+y^2))");
  const [customInput, setCustomInput] = useState("sin(sqrt(x^2+y^2))");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPresets =
    activeCategory === "All"
      ? PRESETS
      : PRESETS.filter((p) => (p.category || "Classic") === activeCategory);

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Mobile overlay */}
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
        className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto flex flex-col border-r transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          width: "clamp(260px, 30vw, 300px)",
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

        {/* Header */}
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
                style={{ color: "#334155" }}
              >
                {PRESETS.length} surfaces & curves
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
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
              <div className="flex gap-1.5">
                <input
                  className="nova-input-sm flex-1 text-xs"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setCustomExpr(customInput)
                  }
                  placeholder="sin(sqrt(x^2+y^2))"
                />
                <button
                  onClick={() => setCustomExpr(customInput)}
                  className="px-2 py-1 rounded-lg font-mono-code text-[9px]"
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
                      colorScheme === s.id ? `${s.c}18` : "rgba(4,10,24,0.7)",
                    border: `1px solid ${colorScheme === s.id ? s.c + "60" : "rgba(139,92,246,0.12)"}`,
                    color: colorScheme === s.id ? s.c : "#475569",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: s.c }}
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
                background: `linear-gradient(90deg, rgba(139,92,246,0.7) ${opacity * 100}%, rgba(6,18,40,0.8) ${opacity * 100}%)`,
              }}
            />
          </div>
        </div>

        {/* Category filter */}
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

          {/* Preset list */}
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

      {/* Main 3D Canvas */}
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
              style={{ color: "#a78bfa" }}
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
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="font-mono-code text-[8px] hidden sm:block"
              style={{ color: "#1e293b" }}
            >
              Drag·Scroll·RightClick
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
                count={2000}
                factor={4}
                saturation={0}
                fade
                speed={0.3}
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

          {/* Axis legend overlay */}
          {showAxes && (
            <div
              className="absolute bottom-10 right-3 flex flex-col gap-1 pointer-events-none"
              style={{
                background: "rgba(2,4,16,0.7)",
                border: "1px solid rgba(139,92,246,0.1)",
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
        </div>

        {/* Bottom info */}
        <div
          className="flex items-center justify-between px-3 py-1.5 border-t"
          style={{
            borderColor: "rgba(139,92,246,0.08)",
            background: "rgba(2,4,16,0.8)",
          }}
        >
          <div className="flex items-center gap-3">
            {[
              ["Three.js", "Renderer", "#a78bfa"],
              ["R3F", "Bridge", "#f472b6"],
              ["WebGL", "GPU", "#22d3ee"],
            ].map(([n, l, c]) => (
              <span
                key={n}
                className="font-mono-code text-[9px] flex items-center gap-1"
                style={{ color: "#334155" }}
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
            style={{ color: "#1e293b" }}
          >
            {customMode ? "55×55" : "60×60"} mesh · {PRESETS.length} presets
          </span>
        </div>
      </main>
    </div>
  );
}
