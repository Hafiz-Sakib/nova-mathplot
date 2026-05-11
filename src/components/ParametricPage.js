import { useTheme } from "../ThemeContext";
import React, { useState, useRef, useEffect, useCallback } from "react";

const TAU = 2 * Math.PI;

const COLOR_SCHEMES = [
  { id: "violet", name: "Violet", color: "#a78bfa" },
  { id: "cyan", name: "Cyan", color: "#22d3ee" },
  { id: "emerald", name: "Emerald", color: "#34d399" },
  { id: "orange", name: "Orange", color: "#fb923c" },
  { id: "pink", name: "Pink", color: "#f472b6" },
  { id: "gold", name: "Gold", color: "#fbbf24" },
  { id: "red", name: "Red", color: "#f87171" },
  { id: "lime", name: "Lime", color: "#a3e635" },
];

const EXAMPLES = [
  // Basic 2D
  {
    label: "Circle",
    category: "Basic 2D",
    formula: "x=cos(t), y=sin(t)",
    is3d: false,
    xfn: (t) => Math.cos(t),
    yfn: (t) => Math.sin(t),
    tMax: TAU,
  },
  {
    label: "Ellipse",
    category: "Basic 2D",
    formula: "x=2cos(t), y=sin(t)",
    is3d: false,
    xfn: (t) => 2 * Math.cos(t),
    yfn: (t) => Math.sin(t),
    tMax: TAU,
  },
  {
    label: "Figure-Eight",
    category: "Basic 2D",
    formula: "x=sin(t), y=sin(2t)/2",
    is3d: false,
    xfn: (t) => Math.sin(t),
    yfn: (t) => Math.sin(2 * t) / 2,
    tMax: TAU,
  },
  {
    label: "Parabola",
    category: "Basic 2D",
    formula: "x=t, y=t²",
    is3d: false,
    xfn: (t) => t,
    yfn: (t) => t * t * 0.3,
    tMax: 6,
  },
  {
    label: "Hyperbola",
    category: "Basic 2D",
    formula: "x=cosh(t), y=sinh(t)",
    is3d: false,
    xfn: (t) => Math.cosh(t * 0.6),
    yfn: (t) => Math.sinh(t * 0.6),
    tMax: 5,
  },

  // Lissajous
  {
    label: "Lissajous 3:2",
    category: "Lissajous",
    formula: "x=cos(3t), y=sin(2t)",
    is3d: false,
    xfn: (t) => Math.cos(3 * t),
    yfn: (t) => Math.sin(2 * t),
    tMax: TAU,
  },
  {
    label: "Lissajous 5:4",
    category: "Lissajous",
    formula: "x=cos(5t), y=sin(4t)",
    is3d: false,
    xfn: (t) => Math.cos(5 * t),
    yfn: (t) => Math.sin(4 * t),
    tMax: TAU,
  },
  {
    label: "Lissajous 7:6",
    category: "Lissajous",
    formula: "x=cos(7t), y=sin(6t)",
    is3d: false,
    xfn: (t) => Math.cos(7 * t),
    yfn: (t) => Math.sin(6 * t),
    tMax: TAU,
  },
  {
    label: "Lissajous 4:3",
    category: "Lissajous",
    formula: "x=cos(4t), y=sin(3t)",
    is3d: false,
    xfn: (t) => Math.cos(4 * t),
    yfn: (t) => Math.sin(3 * t),
    tMax: TAU,
  },
  {
    label: "Lissajous 8:5",
    category: "Lissajous",
    formula: "x=cos(8t), y=sin(5t)",
    is3d: false,
    xfn: (t) => Math.cos(8 * t),
    yfn: (t) => Math.sin(5 * t),
    tMax: TAU,
  },

  // Fourier / Laplace
  {
    label: "Square Wave",
    category: "Fourier",
    formula: "(4/π)Σ sin((2k+1)t)/(2k+1)",
    is3d: false,
    xfn: (t) => t / Math.PI - 1,
    yfn: (t) =>
      (4 / Math.PI) *
      (Math.sin(t) +
        Math.sin(3 * t) / 3 +
        Math.sin(5 * t) / 5 +
        Math.sin(7 * t) / 7),
    tMax: TAU * 2,
  },
  {
    label: "Sawtooth Wave",
    category: "Fourier",
    formula: "Σ sin(nt)/n",
    is3d: false,
    xfn: (t) => t / Math.PI - 1,
    yfn: (t) =>
      Math.sin(t) -
      Math.sin(2 * t) / 2 +
      Math.sin(3 * t) / 3 -
      Math.sin(4 * t) / 4,
    tMax: TAU * 2,
  },
  {
    label: "Triangle Wave",
    category: "Fourier",
    formula: "Σ (-1)^k sin((2k+1)t)/(2k+1)²",
    is3d: false,
    xfn: (t) => t / Math.PI - 1,
    yfn: (t) =>
      (8 / Math.PI / Math.PI) *
      (Math.sin(t) - Math.sin(3 * t) / 9 + Math.sin(5 * t) / 25),
    tMax: TAU * 2,
  },
  {
    label: "Damped Oscillator",
    category: "Laplace",
    formula: "e^(-0.2t)·[cos,sin](3t)",
    is3d: false,
    xfn: (t) => Math.exp(-0.2 * t) * Math.cos(3 * t),
    yfn: (t) => Math.exp(-0.2 * t) * Math.sin(3 * t),
    tMax: 18,
  },
  {
    label: "Beats",
    category: "Laplace",
    formula: "sin(11t)+sin(13t)",
    is3d: false,
    xfn: (t) => t * 0.4 - 3,
    yfn: (t) => Math.sin(11 * t) + Math.sin(13 * t),
    tMax: 12,
  },

  // Euler / Complex
  {
    label: "Re(e^(it))=cos(t)",
    category: "Euler",
    formula: "Re(e^(it)) vs t",
    is3d: false,
    xfn: (t) => t - Math.PI,
    yfn: (t) => Math.cos(t),
    tMax: TAU,
  },
  {
    label: "Euler Spiral",
    category: "Euler",
    formula: "e^(-t²/20)·[cos,sin](t)",
    is3d: false,
    xfn: (t) => Math.exp((-t * t) / 20) * Math.cos(t),
    yfn: (t) => Math.exp((-t * t) / 20) * Math.sin(t),
    tMax: 10,
  },
  {
    label: "e^(iωt) 3D Helix",
    category: "Euler",
    formula: "Re=cos(ωt), Im=sin(ωt), z=t",
    is3d: true,
    xfn: (t) => Math.cos(2 * t),
    yfn: (t) => Math.sin(2 * t),
    zfn: (t) => t * 0.28 - 1.8,
    tMax: TAU * 3.5,
  },
  {
    label: "Fresnel Integral (approx)",
    category: "Euler",
    formula: "C(t), S(t) Fresnel",
    is3d: false,
    xfn: (t) => (t / 8) * Math.sin(t * t * 0.12),
    yfn: (t) => (t / 8) * Math.cos(t * t * 0.12),
    tMax: 12,
  },

  // Polar
  {
    label: "Rose (3 petals)",
    category: "Polar",
    formula: "r=cos(3θ)",
    is3d: false,
    xfn: (t) => Math.cos(3 * t) * Math.cos(t),
    yfn: (t) => Math.cos(3 * t) * Math.sin(t),
    tMax: Math.PI,
  },
  {
    label: "Rose (5 petals)",
    category: "Polar",
    formula: "r=cos(5θ)",
    is3d: false,
    xfn: (t) => Math.cos(5 * t) * Math.cos(t),
    yfn: (t) => Math.cos(5 * t) * Math.sin(t),
    tMax: Math.PI,
  },
  {
    label: "Rose (7 petals)",
    category: "Polar",
    formula: "r=cos(7θ)",
    is3d: false,
    xfn: (t) => Math.cos(7 * t) * Math.cos(t),
    yfn: (t) => Math.cos(7 * t) * Math.sin(t),
    tMax: Math.PI,
  },
  {
    label: "Cardioid",
    category: "Polar",
    formula: "r=1-cos(θ)",
    is3d: false,
    xfn: (t) => (1 - Math.cos(t)) * Math.cos(t) * 0.9,
    yfn: (t) => (1 - Math.cos(t)) * Math.sin(t) * 0.9,
    tMax: TAU,
  },
  {
    label: "Limacon",
    category: "Polar",
    formula: "r=0.5+cos(θ)",
    is3d: false,
    xfn: (t) => (0.5 + Math.cos(t)) * Math.cos(t),
    yfn: (t) => (0.5 + Math.cos(t)) * Math.sin(t),
    tMax: TAU,
  },
  {
    label: "Lemniscate",
    category: "Polar",
    formula: "r²=cos(2θ)",
    is3d: false,
    xfn: (t) => Math.cos(2 * t) * Math.cos(t) * 1.1,
    yfn: (t) => Math.cos(2 * t) * Math.sin(t) * 1.1,
    tMax: TAU,
  },

  // Special 2D
  {
    label: "Astroid",
    category: "Special",
    formula: "x=cos³(t), y=sin³(t)",
    is3d: false,
    xfn: (t) => Math.pow(Math.cos(t), 3),
    yfn: (t) => Math.pow(Math.sin(t), 3),
    tMax: TAU,
  },
  {
    label: "Butterfly Curve",
    category: "Special",
    formula: "Temple butterfly",
    is3d: false,
    xfn: (t) =>
      Math.sin(t) *
      (Math.exp(Math.cos(t)) -
        2 * Math.cos(4 * t) -
        Math.pow(Math.sin(t / 12), 5)),
    yfn: (t) =>
      Math.cos(t) *
      (Math.exp(Math.cos(t)) -
        2 * Math.cos(4 * t) -
        Math.pow(Math.sin(t / 12), 5)),
    tMax: 12 * TAU,
  },
  {
    label: "Archimedean Spiral",
    category: "Special",
    formula: "r=θ",
    is3d: false,
    xfn: (t) => t * Math.cos(t) * 0.13,
    yfn: (t) => t * Math.sin(t) * 0.13,
    tMax: 8 * TAU,
  },
  {
    label: "Logarithmic Spiral",
    category: "Special",
    formula: "r=e^(0.15θ)",
    is3d: false,
    xfn: (t) => Math.exp(0.15 * t) * Math.cos(t) * 0.08,
    yfn: (t) => Math.exp(0.15 * t) * Math.sin(t) * 0.08,
    tMax: 8 * TAU,
  },
  {
    label: "Hypotrochoid",
    category: "Special",
    formula: "R=5, r=3, d=5",
    is3d: false,
    xfn: (t) => (5 - 3) * Math.cos(t) + 5 * Math.cos(((5 - 3) / 3) * t),
    yfn: (t) => (5 - 3) * Math.sin(t) - 5 * Math.sin(((5 - 3) / 3) * t),
    tMax: TAU * 3,
  },
  {
    label: "Epicycloid",
    category: "Special",
    formula: "R=3, r=1",
    is3d: false,
    xfn: (t) => 4 * Math.cos(t) - Math.cos(4 * t),
    yfn: (t) => 4 * Math.sin(t) - Math.sin(4 * t),
    tMax: TAU * 2,
  },
  {
    label: "Cycloid",
    category: "Special",
    formula: "x=t-sin(t), y=1-cos(t)",
    is3d: false,
    xfn: (t) => t * 0.4 - Math.sin(t) * 0.4,
    yfn: (t) => 1 - Math.cos(t),
    tMax: TAU * 3.5,
  },
  {
    label: "Deltoid",
    category: "Special",
    formula: "x=2cos(t)+cos(2t), y=2sin(t)-sin(2t)",
    is3d: false,
    xfn: (t) => 2 * Math.cos(t) + Math.cos(2 * t),
    yfn: (t) => 2 * Math.sin(t) - Math.sin(2 * t),
    tMax: TAU,
  },

  // 3D Curves
  {
    label: "Helix",
    category: "3D Curves",
    formula: "x=cos(t), y=sin(t), z=t/5",
    is3d: true,
    xfn: (t) => Math.cos(t),
    yfn: (t) => Math.sin(t),
    zfn: (t) => t / 5 - 1.5,
    tMax: TAU * 5,
  },
  {
    label: "Torus Knot (3,2)",
    category: "3D Curves",
    formula: "p=3, q=2 torus knot",
    is3d: true,
    xfn: (t) => ((2 + Math.cos(3 * t)) * Math.cos(2 * t)) / 3,
    yfn: (t) => ((2 + Math.cos(3 * t)) * Math.sin(2 * t)) / 3,
    zfn: (t) => Math.sin(3 * t) / 3,
    tMax: TAU,
  },
  {
    label: "Torus Knot (5,3)",
    category: "3D Curves",
    formula: "p=5, q=3 torus knot",
    is3d: true,
    xfn: (t) => ((2 + Math.cos(5 * t)) * Math.cos(3 * t)) / 3,
    yfn: (t) => ((2 + Math.cos(5 * t)) * Math.sin(3 * t)) / 3,
    zfn: (t) => Math.sin(5 * t) / 3,
    tMax: TAU,
  },
  {
    label: "3D Lissajous",
    category: "3D Curves",
    formula: "x=cos(3t), y=sin(2t), z=sin(t)",
    is3d: true,
    xfn: (t) => Math.cos(3 * t),
    yfn: (t) => Math.sin(2 * t),
    zfn: (t) => Math.sin(t),
    tMax: TAU,
  },
  {
    label: "Viviani's Curve",
    category: "3D Curves",
    formula: "Sphere+cylinder intersection",
    is3d: true,
    xfn: (t) => 1 + Math.cos(t),
    yfn: (t) => Math.sin(t),
    zfn: (t) => 2 * Math.sin(t / 2),
    tMax: TAU * 2,
  },
  {
    label: "Conical Spiral",
    category: "3D Curves",
    formula: "r=t, z=-t/6",
    is3d: true,
    xfn: (t) => t * Math.cos(t) * 0.12,
    yfn: (t) => t * Math.sin(t) * 0.12,
    zfn: (t) => -t * 0.06 + 1.5,
    tMax: 8 * TAU,
  },
  {
    label: "Cinquefoil Knot",
    category: "3D Curves",
    formula: "Torus knot p=5, q=2",
    is3d: true,
    xfn: (t) => ((2 + Math.cos((5 * t) / 2)) * Math.cos(t)) / 2,
    yfn: (t) => ((2 + Math.cos((5 * t) / 2)) * Math.sin(t)) / 2,
    zfn: (t) => Math.sin((5 * t) / 2) / 2,
    tMax: TAU * 2,
  },
  {
    label: "Trefoil Knot",
    category: "3D Curves",
    formula: "(3,2) torus knot variant",
    is3d: true,
    xfn: (t) => (Math.sin(t) + 2 * Math.sin(2 * t)) * 0.6,
    yfn: (t) => (Math.cos(t) - 2 * Math.cos(2 * t)) * 0.6,
    zfn: (t) => -Math.sin(3 * t) * 0.6,
    tMax: TAU * 2,
  },
  {
    label: "Figure-Eight Knot",
    category: "3D Curves",
    formula: "4_1 knot",
    is3d: true,
    xfn: (t) => (2 + Math.cos(2 * t)) * Math.cos(3 * t) * 0.5,
    yfn: (t) => (2 + Math.cos(2 * t)) * Math.sin(3 * t) * 0.5,
    zfn: (t) => Math.sin(4 * t) * 0.8,
    tMax: TAU * 1.5,
  },
  {
    label: "Spherical Helix",
    category: "3D Curves",
    formula: "Helix on sphere",
    is3d: true,
    xfn: (t) => Math.sin(t) * Math.cos(4 * t),
    yfn: (t) => Math.sin(t) * Math.sin(4 * t),
    zfn: (t) => Math.cos(t),
    tMax: TAU * 4,
  },
  {
    label: "Twisted Helix",
    category: "3D Curves",
    formula: "x=cos(t), y=sin(t), z=t+sin(3t)",
    is3d: true,
    xfn: (t) => Math.cos(t),
    yfn: (t) => Math.sin(t),
    zfn: (t) => t * 0.25 + Math.sin(3 * t) * 0.4,
    tMax: TAU * 6,
  },

  // More Curves
  {
    label: "Hypocycloid (5)",
    category: "Special",
    formula: "5-cusped hypocycloid",
    is3d: false,
    xfn: (t) => 4 * Math.cos(t) + Math.cos(4 * t),
    yfn: (t) => 4 * Math.sin(t) - Math.sin(4 * t),
    tMax: TAU,
  },
  {
    label: "Superellipse",
    category: "Special",
    formula: "x=cos³(t), y=sin³(t) variant",
    is3d: false,
    xfn: (t) => Math.sign(Math.cos(t)) * Math.pow(Math.abs(Math.cos(t)), 0.6),
    yfn: (t) => Math.sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), 2.4),
    tMax: TAU,
  },
  {
    label: "Sine Wave Envelope",
    category: "Special",
    formula: "t * sin(t)",
    is3d: false,
    xfn: (t) => t * 0.25,
    yfn: (t) => t * Math.sin(t) * 0.12,
    tMax: 25,
  },
  {
    label: "Nephroid",
    category: "Special",
    formula: "Epicycloid (2,1)",
    is3d: false,
    xfn: (t) => 3 * Math.cos(t) - Math.cos(3 * t),
    yfn: (t) => 3 * Math.sin(t) - Math.sin(3 * t),
    tMax: TAU,
  },
  {
    label: "Ranunculoid",
    category: "Special",
    formula: "Rose-like",
    is3d: false,
    xfn: (t) => (1 + 1.5 * Math.cos(t)) * Math.cos(t),
    yfn: (t) => (1 + 1.5 * Math.cos(t)) * Math.sin(t),
    tMax: TAU,
  },
  {
    label: "3D Rose",
    category: "3D Curves",
    formula: "Spherical rose",
    is3d: true,
    xfn: (t) => Math.sin(3 * t) * Math.cos(t) * 1.2,
    yfn: (t) => Math.sin(3 * t) * Math.sin(t) * 1.2,
    zfn: (t) => Math.cos(3 * t) * 1.4,
    tMax: TAU * 2,
  },
  {
    label: "Mobius Strip Curve",
    category: "3D Curves",
    formula: "Centerline of Mobius",
    is3d: true,
    xfn: (t) => (1 + 0.5 * Math.cos(t / 2)) * Math.cos(t),
    yfn: (t) => (1 + 0.5 * Math.cos(t / 2)) * Math.sin(t),
    zfn: (t) => 0.5 * Math.sin(t / 2),
    tMax: TAU * 4,
  },
];

// ── 3D math ──────────────────────────────────────────────────────────────────
const rotX = ([x, y, z], a) => [
  x,
  y * Math.cos(a) - z * Math.sin(a),
  y * Math.sin(a) + z * Math.cos(a),
];
const rotY = ([x, y, z], a) => [
  x * Math.cos(a) + z * Math.sin(a),
  y,
  -x * Math.sin(a) + z * Math.cos(a),
];
const project = ([x, y, z], W, H) => {
  const fov = 700;
  const d = fov / (fov + z * 55);
  const s = Math.min(W, H) * 0.26;
  return [W / 2 + x * d * s, H / 2 - y * d * s];
};

// ── Canvas component ──────────────────────────────────────────────────────────
function ParametricCanvas({
  example,
  animated,
  speed,
  showAxes,
  zoom,
  color,
  rx,
  ry,
  isDark,
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !example) return;
    cancelAnimationFrame(animRef.current);

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth * dpr;
    const H = canvas.offsetHeight * dpr;
    canvas.width = W;
    canvas.height = H;

    const N = example.is3d ? 2400 : 1800;
    const raw = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * example.tMax;
      const x = example.xfn(t),
        y = example.yfn(t),
        z = example.zfn ? example.zfn(t) : 0;
      if (isFinite(x) && isFinite(y) && isFinite(z)) raw.push([x, y, z]);
    }

    let s2 = 1,
      cx = 0,
      cy = 0;
    if (!example.is3d) {
      const xs = raw.map((p) => p[0]),
        ys = raw.map((p) => p[1]);
      const mnX = Math.min(...xs),
        mxX = Math.max(...xs),
        mnY = Math.min(...ys),
        mxY = Math.max(...ys);
      s2 = Math.min(W / (mxX - mnX || 2), H / (mxY - mnY || 2)) * 0.38 * zoom;
      cx = (mnX + mxX) / 2;
      cy = (mnY + mxY) / 2;
    }

    const toSc = (pt) => {
      if (example.is3d) {
        let p = [pt[0] * zoom, pt[1] * zoom, pt[2] * zoom];
        p = rotX(p, rx);
        p = rotY(p, ry);
        return project(p, W, H);
      }
      return [W / 2 + (pt[0] - cx) * s2, H / 2 - (pt[1] - cy) * s2];
    };

    const drawAxes = () => {
      if (!showAxes) return;
      if (example.is3d) {
        const L = 1.35 * zoom;
        [
          { vec: [L, 0, 0], lbl: "X", col: "rgba(255,90,90,0.85)" },
          { vec: [0, L, 0], lbl: "Y", col: "rgba(80,240,120,0.85)" },
          { vec: [0, 0, L], lbl: "Z", col: "rgba(120,160,255,0.85)" },
        ].forEach(({ vec, lbl, col }) => {
          let ov = [0, 0, 0],
            ev = [...vec];
          ov = rotX(ov, rx);
          ov = rotY(ov, ry);
          ev = rotX(ev, rx);
          ev = rotY(ev, ry);
          const so = project(ov, W, H),
            se = project(ev, W, H);
          ctx.save();
          ctx.strokeStyle = col;
          ctx.lineWidth = 1.8 * dpr;
          ctx.beginPath();
          ctx.moveTo(so[0], so[1]);
          ctx.lineTo(se[0], se[1]);
          ctx.stroke();
          const dx = se[0] - so[0],
            dy = se[1] - so[1],
            len = Math.hypot(dx, dy) || 1;
          const ux = dx / len,
            uy = dy / len,
            as = 9 * dpr;
          ctx.beginPath();
          ctx.moveTo(se[0], se[1]);
          ctx.lineTo(
            se[0] - ux * as + uy * as * 0.4,
            se[1] - uy * as - ux * as * 0.4,
          );
          ctx.lineTo(
            se[0] - ux * as - uy * as * 0.4,
            se[1] - uy * as + ux * as * 0.4,
          );
          ctx.closePath();
          ctx.fillStyle = col;
          ctx.fill();
          ctx.fillStyle = col;
          ctx.font = `bold ${12 * dpr}px JetBrains Mono,monospace`;
          ctx.fillText(lbl, se[0] + 7 * dpr, se[1] + 4 * dpr);
          ctx.restore();
        });
        ctx.strokeStyle = "rgba(255,255,255,0.035)";
        ctx.lineWidth = 0.7;
        for (let g = -2; g <= 2; g += 0.5) {
          [
            [g, 0, -2],
            [g, 0, 2],
          ].reduce((a, b) => {
            const pa = rotY(rotX(a, rx), ry),
              pb = rotY(rotX(b, rx), ry);
            const sa = project(pa, W, H),
              sb = project(pb, W, H);
            ctx.beginPath();
            ctx.moveTo(sa[0], sa[1]);
            ctx.lineTo(sb[0], sb[1]);
            ctx.stroke();
            return b;
          });
          [
            [-2, 0, g],
            [2, 0, g],
          ].reduce((a, b) => {
            const pa = rotY(rotX(a, rx), ry),
              pb = rotY(rotX(b, rx), ry);
            const sa = project(pa, W, H),
              sb = project(pb, W, H);
            ctx.beginPath();
            ctx.moveTo(sa[0], sa[1]);
            ctx.lineTo(sb[0], sb[1]);
            ctx.stroke();
            return b;
          });
        }
      } else {
        ctx.strokeStyle = isDark
          ? "rgba(167,139,250,0.05)"
          : "rgba(139,92,246,0.1)";
        ctx.lineWidth = 0.7 * dpr;
        for (let gx = 0; gx < W; gx += W / 14) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, H);
          ctx.stroke();
        }
        for (let gy = 0; gy < H; gy += H / 14) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(W, gy);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(255,100,100,0.55)";
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath();
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,100,100,0.55)";
        ctx.beginPath();
        ctx.moveTo(W - 2, H / 2);
        ctx.lineTo(W - 14 * dpr, H / 2 - 5 * dpr);
        ctx.lineTo(W - 14 * dpr, H / 2 + 5 * dpr);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(80,230,120,0.55)";
        ctx.beginPath();
        ctx.moveTo(W / 2, 0);
        ctx.lineTo(W / 2, H);
        ctx.stroke();
        ctx.fillStyle = "rgba(80,230,120,0.55)";
        ctx.beginPath();
        ctx.moveTo(W / 2, 2);
        ctx.lineTo(W / 2 - 5 * dpr, 14 * dpr);
        ctx.lineTo(W / 2 + 5 * dpr, 14 * dpr);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(255,120,120,0.8)";
        ctx.font = `bold ${11 * dpr}px JetBrains Mono,monospace`;
        ctx.fillText("X", W - 22 * dpr, H / 2 - 8 * dpr);
        ctx.fillStyle = "rgba(80,230,120,0.8)";
        ctx.fillText("Y", W / 2 + 8 * dpr, 18 * dpr);
        ctx.strokeStyle = isDark
          ? "rgba(255,255,255,0.12)"
          : "rgba(100,116,139,0.4)";
        ctx.lineWidth = 0.8 * dpr;
        for (let tx = ((W / 2) % s2) + s2; tx < W; tx += s2) {
          ctx.beginPath();
          ctx.moveTo(tx, H / 2 - 5 * dpr);
          ctx.lineTo(tx, H / 2 + 5 * dpr);
          ctx.stroke();
        }
        for (let ty = ((H / 2) % s2) + s2; ty < H; ty += s2) {
          ctx.beginPath();
          ctx.moveTo(W / 2 - 5 * dpr, ty);
          ctx.lineTo(W / 2 + 5 * dpr, ty);
          ctx.stroke();
        }
      }
    };

    const draw = (progress) => {
      ctx.clearRect(0, 0, W, H);
      drawAxes();
      const cnt = Math.floor(raw.length * progress);
      if (cnt < 2) return;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let i = 1; i < cnt; i++) {
        const alpha = 0.25 + 0.75 * (i / cnt);
        const [sx, sy] = toSc(raw[i - 1]);
        const [ex, ey] = toSc(raw[i]);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4 * dpr;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      if (progress < 1) {
        const [hx, hy] = toSc(raw[cnt - 1]);
        ctx.fillStyle = isDark ? "#fff" : "#334155";
        ctx.shadowColor = color;
        ctx.shadowBlur = 22;
        ctx.beginPath();
        ctx.arc(hx, hy, 4.5 * dpr, 0, TAU);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(hx, hy, 2.5 * dpr, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    if (animated) {
      progressRef.current = 0;
      const loop = () => {
        progressRef.current = Math.min(1, progressRef.current + speed * 0.003);
        draw(progressRef.current);
        if (progressRef.current < 1)
          animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
    } else {
      draw(1);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [example, animated, speed, showAxes, zoom, color, rx, ry, isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        borderRadius: "1rem",
      }}
    />
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ParametricPage() {
  const { isDark } = useTheme();
  const [selected, setSelected] = useState(EXAMPLES[0]);
  const [animated, setAnimated] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showAxes, setShowAxes] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [colorScheme, setColorScheme] = useState("violet");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openCat, setOpenCat] = useState("Basic 2D");
  const [rx, setRx] = useState(-0.35);
  const [ry, setRy] = useState(0.5);

  const dragRef = useRef(null);
  const touchRef = useRef(null);
  const wrapRef = useRef(null);

  const color =
    COLOR_SCHEMES.find((c) => c.id === colorScheme)?.color || "#a78bfa";
  const cats = [...new Set(EXAMPLES.map((e) => e.category))];

  // Mouse drag → 3D rotation
  const onMouseDown = useCallback(
    (e) => {
      if (!selected.is3d) return;
      dragRef.current = { x: e.clientX, y: e.clientY, rx, ry };
      e.preventDefault();
    },
    [selected.is3d, rx, ry],
  );

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x,
      dy = e.clientY - dragRef.current.y;
    setRy(dragRef.current.ry + dx * 0.008);
    setRx(dragRef.current.rx + dy * 0.008);
  }, []);

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // Touch drag → 3D rotation
  const onTouchStart = useCallback(
    (e) => {
      if (!selected.is3d) return;
      const t = e.touches[0];
      touchRef.current = { x: t.clientX, y: t.clientY, rx, ry };
    },
    [selected.is3d, rx, ry],
  );

  const onTouchMove = useCallback((e) => {
    if (!touchRef.current) return;
    const t = e.touches[0];
    setRy(touchRef.current.ry + (t.clientX - touchRef.current.x) * 0.01);
    setRx(touchRef.current.rx + (t.clientY - touchRef.current.y) * 0.01);
  }, []);

  const onTouchEnd = useCallback(() => {
    touchRef.current = null;
  }, []);

  // Scroll → zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((z) =>
      Math.max(0.15, Math.min(6, z * (e.deltaY < 0 ? 1.1 : 0.91))),
    );
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // Zoom toolbar helpers (matches 2D/3D page style)
  const zoomIn = useCallback(() => setZoom((z) => Math.min(6, z * 1.35)), []);
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(0.15, z * 0.74)),
    [],
  );
  const zoomReset = useCallback(() => setZoom(1), []);

  const Toggle = ({ label, value, set }) => (
    <div
      className="flex justify-between items-center py-1 cursor-pointer"
      onClick={() => set((v) => !v)}
    >
      <span
        className="text-xs"
        style={{ color: isDark ? "#cbd5e1" : "#334155" }}
      >
        {label}
      </span>
      <div
        className="w-9 h-5 rounded-full relative transition-all duration-300"
        style={{
          background: value ? `${color}50` : isDark ? "#1e293b" : "#e2e8f0",
          border: `1px solid ${value ? color + "70" : isDark ? "#334155" : "#cbd5e1"}`,
        }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
          style={{
            background: value ? color : "#475569",
            left: value ? "20px" : "2px",
            boxShadow: value ? `0 0 8px ${color}` : "none",
          }}
        />
      </div>
    </div>
  );

  // Shared zoom button style (matches GraphPanel ZoomBtn from 2D/3D pages)
  const ZoomBtn = ({ onClick, title, children, wide }) => (
    <button
      onClick={onClick}
      title={title}
      className="font-mono flex items-center justify-center rounded-lg transition-all"
      style={{
        width: wide ? 38 : 28,
        height: 28,
        background: isDark ? "rgba(2,8,20,0.8)" : "rgba(255,255,255,0.97)",
        border: `1px solid ${color}30`,
        color: "#64748b",
        fontSize: "0.75rem",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.color = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}30`;
        e.currentTarget.style.color = "#64748b";
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{
        height: "calc(100vh - 60px)",
        background: isDark
          ? "#070212"
          : "linear-gradient(145deg,#eef4ff,#e8f0fc)",
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/75 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto flex flex-col border-r w-72 sm:w-88 xl:w-[26rem] 2xl:w-[28rem] flex-shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: isDark
            ? "linear-gradient(180deg,#0e0520 0%,#070212 100%)"
            : "linear-gradient(180deg,#eef4ff 0%,#e8f0fc 100%)",
          borderColor: `${color}18`,
          top: "60px",
          height: "calc(100vh - 60px)",
        }}
      >
        {/* Header */}
        <div
          className="p-3 sm:p-4 border-b flex-shrink-0"
          style={{ borderColor: `${color}18` }}
        >
          <div
            className="font-orbitron text-xs font-bold tracking-[3px]"
            style={{ color }}
          >
            PARAMETRIC PLOTTER
          </div>
          <div
            className="font-mono text-[9px] tracking-widest mt-0.5"
            style={{ color, opacity: isDark ? 0.5 : 0.75 }}
          >
            3D · INTERACTIVE · ANIMATED
          </div>
        </div>

        {/* Color theme — smaller swatches */}
        <div
          className="px-3 sm:px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: `${color}12` }}
        >
          <div
            className="text-[9px] font-mono tracking-[3px] uppercase mb-2"
            style={{ color: isDark ? `${color}60` : `${color}` }}
          >
            THEME
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SCHEMES.map((s) => (
              <button
                key={s.id}
                onClick={() => setColorScheme(s.id)}
                title={s.name}
                className="rounded-lg transition-all duration-200"
                style={{
                  width: 22,
                  height: 22,
                  background: s.color,
                  transform: colorScheme === s.id ? "scale(1.18)" : "scale(1)",
                  boxShadow:
                    colorScheme === s.id ? `0 0 10px ${s.color}` : "none",
                  outline:
                    colorScheme === s.id
                      ? `2px solid ${s.color}`
                      : "2px solid transparent",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div
          className="px-3 sm:px-4 py-3 border-b flex-shrink-0 space-y-3"
          style={{ borderColor: `${color}12` }}
        >
          <div
            className="text-[9px] font-mono tracking-[3px] uppercase mb-1"
            style={{ color: isDark ? `${color}60` : `${color}` }}
          >
            CONTROLS
          </div>
          <Toggle label="Animate" value={animated} set={setAnimated} />
          <Toggle label="Show Axes" value={showAxes} set={setShowAxes} />

          <div>
            <div className="flex justify-between mb-1.5">
              <span
                className="text-xs"
                style={{ color: isDark ? "#94a3b8" : "#334155" }}
              >
                Speed
              </span>
              <span className="font-mono text-xs" style={{ color }}>
                {speed.toFixed(1)}×
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: color }}
            />
          </div>

          {/* Sidebar zoom buttons (always visible for mobile) */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span
                className="text-xs"
                style={{ color: isDark ? "#94a3b8" : "#334155" }}
              >
                Zoom
              </span>
              <span className="font-mono text-xs" style={{ color }}>
                {zoom.toFixed(2)}×
              </span>
            </div>
            <div className="flex gap-1.5">
              {[
                ["−", zoomOut],
                ["·1·", zoomReset],
                ["+", zoomIn],
              ].map(([l, fn]) => (
                <button
                  key={l}
                  onClick={fn}
                  className="flex-1 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 hover:scale-105"
                  style={{
                    background: `${color}12`,
                    border: `1px solid ${color}25`,
                    color,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {selected.is3d && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRx(-0.35);
                  setRy(0.5);
                }}
                className="flex-1 py-1.5 text-[10px] font-mono rounded-lg transition-all"
                style={{
                  color: isDark ? `${color}80` : color,
                  background: `${color}0a`,
                  border: `1px solid ${color}20`,
                }}
              >
                ↺ Reset View
              </button>
              <div
                className="text-[10px] font-mono text-center px-2 py-1.5 rounded-lg"
                style={{
                  color: isDark ? `${color}60` : color,
                  background: `${color}08`,
                  border: `1px dashed ${color}20`,
                }}
              >
                🖱 Drag
              </div>
            </div>
          )}
        </div>

        {/* Example list */}
        <div className="flex-1 overflow-y-auto">
          {cats.map((cat) => (
            <div key={cat}>
              <button
                onClick={() => setOpenCat(openCat === cat ? "" : cat)}
                className="w-full flex items-center gap-2.5 px-3 sm:px-4 py-2.5 text-left transition-all"
                style={{
                  background: openCat === cat ? `${color}09` : "transparent",
                  borderBottom: `1px solid ${color}0e`,
                }}
              >
                <span
                  className="text-[9px] font-mono tracking-widest uppercase flex-1"
                  style={{
                    color:
                      openCat === cat
                        ? color
                        : isDark
                          ? `${color}45`
                          : `${color}aa`,
                  }}
                >
                  {cat}
                </span>
                <span
                  style={{
                    color: isDark ? `${color}40` : `${color}80`,
                    display: "inline-block",
                    transition: "transform 0.2s",
                    transform: openCat === cat ? "rotate(180deg)" : "none",
                    fontSize: "8px",
                  }}
                >
                  ▼
                </span>
              </button>

              {openCat === cat &&
                EXAMPLES.filter((e) => e.category === cat).map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => {
                      setSelected(ex);
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 sm:px-4 py-2.5 flex items-start gap-2.5 transition-all duration-150"
                    style={{
                      background:
                        selected.label === ex.label
                          ? `${color}10`
                          : "transparent",
                      borderLeft:
                        selected.label === ex.label
                          ? `2px solid ${color}`
                          : "2px solid transparent",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                      style={{
                        background:
                          selected.label === ex.label
                            ? color
                            : isDark
                              ? "#334155"
                              : "#94a3b8",
                        boxShadow:
                          selected.label === ex.label
                            ? `0 0 6px ${color}`
                            : "none",
                      }}
                    />
                    <div>
                      <div
                        className="text-xs font-medium"
                        style={{
                          color:
                            selected.label === ex.label
                              ? color
                              : isDark
                                ? "#94a3b8"
                                : "#1e293b",
                        }}
                      >
                        {ex.label}
                        {ex.is3d && (
                          <span
                            className="ml-1 text-[8px] font-mono"
                            style={{ opacity: isDark ? 0.5 : 0.7 }}
                          >
                            3D
                          </span>
                        )}
                      </div>
                      <div
                        className="font-mono text-[9px] mt-0.5"
                        style={{
                          color: isDark ? "rgba(148,163,184,0.5)" : "#475569",
                        }}
                      >
                        {ex.formula}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          ))}
          <div className="h-6" />
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-3 sm:px-5 py-2"
          style={{
            background: isDark ? "#0a0218" : "rgba(255,255,255,0.88)",
            borderBottom: `1px solid ${color}15`,
            minHeight: "46px",
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="lg:hidden flex flex-col gap-[4px] justify-center w-7 h-7 p-1 rounded flex-shrink-0"
              style={{ background: `${color}12` }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-[1.5px] rounded transition-all duration-300"
                  style={{
                    background: color,
                    transform:
                      sidebarOpen && i === 0
                        ? "rotate(45deg) translateY(5px)"
                        : sidebarOpen && i === 1
                          ? "scaleX(0)"
                          : sidebarOpen && i === 2
                            ? "rotate(-45deg) translateY(-5px)"
                            : "none",
                  }}
                />
              ))}
            </button>

            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            />
            <span
              className="text-sm font-medium truncate"
              style={{ color: isDark ? "#ffffff" : "#1e293b" }}
            >
              {selected.label}
            </span>
            {selected.is3d && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded font-mono flex-shrink-0"
                style={{
                  color,
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                }}
              >
                3D
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {selected.is3d && (
              <button
                onClick={() => {
                  setRx(-0.35);
                  setRy(0.5);
                }}
                className="hidden sm:block text-[10px] px-2.5 py-1.5 rounded-lg font-mono transition-all"
                style={{
                  color: `${color}80`,
                  background: `${color}0f`,
                  border: `1px solid ${color}20`,
                }}
              >
                ↺ Reset View
              </button>
            )}
            <button
              onClick={() => setAnimated((a) => !a)}
              className="px-2.5 sm:px-5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200"
              style={{
                background: animated ? color : "#1e293b",
                color: animated ? "#000" : "#94a3b8",
                boxShadow: animated ? `0 0 14px ${color}60` : "none",
              }}
            >
              {animated ? "⏸ PAUSE" : "▶ PLAY"}
            </button>
          </div>
        </div>

        {/* ── ZOOM TOOLBAR (desktop, matches 2D/3D/Complex page style) ── */}
        <div
          className="hidden lg:flex flex-shrink-0 items-center gap-1.5 px-3 py-2 border-b"
          style={{
            borderColor: `${color}15`,
            background: isDark ? "rgba(7,2,18,0.6)" : "rgba(238,244,255,0.7)",
          }}
        >
          {/* Zoom group */}
          <div className="flex items-center gap-1">
            <ZoomBtn onClick={zoomIn} title="Zoom In">
              +
            </ZoomBtn>
            <ZoomBtn onClick={zoomOut} title="Zoom Out">
              −
            </ZoomBtn>
            <ZoomBtn onClick={zoomReset} title="Reset Zoom" wide>
              RST
            </ZoomBtn>
          </div>

          {/* 3D rotation reset — only for 3D curves */}
          {selected.is3d && (
            <>
              <div
                className="w-px h-5 mx-1"
                style={{ background: `${color}20` }}
              />
              <ZoomBtn
                onClick={() => {
                  setRx(-0.35);
                  setRy(0.5);
                }}
                title="Reset 3D View"
                wide
              >
                ↺ ROT
              </ZoomBtn>
            </>
          )}

          <div className="w-px h-5 mx-1" style={{ background: `${color}20` }} />

          {/* Zoom readout */}
          <span
            className="font-mono text-[9px] hidden sm:inline"
            style={{ color: `${color}70` }}
          >
            zoom {zoom.toFixed(2)}×
          </span>

          {/* Scroll / drag hint */}
          <span
            className="ml-auto font-mono text-[9px] hidden sm:flex items-center gap-1"
            style={{ color: "#334155" }}
          >
            <span style={{ color }}>⊙</span> scroll to zoom
            {selected.is3d ? " · drag to rotate" : ""}
          </span>

          {/* Zoom status right-aligned */}
          <span className="font-mono text-[9px]" style={{ color: "#334155" }}>
            t ∈ [0, {selected.tMax.toFixed(2)}]
          </span>
        </div>

        {/* Canvas wrapper */}
        <div className="flex-1 p-2 sm:p-3 lg:p-4 min-h-0 flex items-stretch">
          <div
            ref={wrapRef}
            className="relative flex-1 rounded-2xl overflow-hidden"
            style={{
              background: isDark
                ? "linear-gradient(135deg,#050112 0%,#08021a 50%,#050115 100%)"
                : "linear-gradient(135deg,#f0f4ff 0%,#eaeffc 50%,#f0f4ff 100%)",
              border: `1px solid ${color}${isDark ? "15" : "30"}`,
              boxShadow: isDark
                ? `inset 0 0 80px rgba(0,0,0,0.5)`
                : `inset 0 0 40px rgba(139,92,246,0.05)`,
              cursor: selected.is3d ? "grab" : "crosshair",
              userSelect: "none",
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Corner accents */}
            {[
              { t: "top-0 left-0", bY: "bottom", bX: "right" },
              { t: "top-0 right-0", bY: "bottom", bX: "left" },
              { t: "bottom-0 left-0", bY: "top", bX: "right" },
              { t: "bottom-0 right-0", bY: "top", bX: "left" },
            ].map(({ t, bY, bX }, i) => (
              <div
                key={i}
                className={`absolute ${t} w-5 h-5 pointer-events-none z-10`}
              >
                <div
                  style={{
                    position: "absolute",
                    [bY]: 0,
                    [bX]: 0,
                    width: "12px",
                    height: "1.5px",
                    background: `${color}60`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    [bY]: 0,
                    [bX]: 0,
                    width: "1.5px",
                    height: "12px",
                    background: `${color}60`,
                  }}
                />
              </div>
            ))}

            {/* Formula overlay */}
            <div
              className="absolute top-3 right-3 z-10 font-mono text-[10px] px-2.5 py-1.5 rounded-lg pointer-events-none"
              style={{
                color: `${color}90`,
                background: isDark
                  ? "rgba(5,1,18,0.75)"
                  : "rgba(255,255,255,0.88)",
                border: `1px solid ${color}20`,
                backdropFilter: "blur(8px)",
              }}
            >
              {selected.formula}
            </div>

            {/* Mobile hint (hidden on desktop since toolbar handles it) */}
            <div
              className="lg:hidden absolute bottom-3 right-3 z-10 text-[9px] font-mono pointer-events-none"
              style={{ color: `${color}35` }}
            >
              scroll zoom{selected.is3d ? " · drag rotate" : ""}
            </div>

            <ParametricCanvas
              example={selected}
              animated={animated}
              speed={speed}
              showAxes={showAxes}
              zoom={zoom}
              color={color}
              rx={rx}
              ry={ry}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Status bar */}
        <div
          className="flex-shrink-0 flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 border-t font-mono text-[10px]"
          style={{
            borderColor: `${color}10`,
            background: isDark ? "#070115" : "rgba(238,244,255,0.9)",
            color: `${color}35`,
          }}
        >
          <span>t ∈ [0, {selected.tMax.toFixed(2)}]</span>
          <span>·</span>
          <span>zoom {zoom.toFixed(2)}×</span>
          {selected.is3d && (
            <>
              <span>·</span>
              <span>
                rx={rx.toFixed(2)} ry={ry.toFixed(2)}
              </span>
            </>
          )}
          <span className="ml-auto">
            {selected.is3d ? "3D" : "2D"} · {selected.category}
          </span>
        </div>
      </main>
    </div>
  );
}
