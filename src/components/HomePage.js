import { useTheme } from "../ThemeContext";
import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   MINI SVG PREVIEW COMPONENTS (preserved from original)
═══════════════════════════════════════════════════════════════════ */
function AnimatedSine({ color = "#22d3ee", color2 = "#10b981" }) {
  const id = `sG-${color.replace("#", "")}-${color2.replace("#", "")}`;
  return (
    <svg viewBox="0 0 280 80" className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="30%" stopColor={color} stopOpacity="1" />
          <stop offset="70%" stopColor={color2} stopOpacity="1" />
          <stop offset="100%" stopColor={color2} stopOpacity="0" />
        </linearGradient>
        <filter id={`g-${id}`}>
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M0,40 C14,40 21,10 35,10 C49,10 56,70 70,70 C84,70 91,10 105,10 C119,10 126,70 140,70 C154,70 161,10 175,10 C189,10 196,70 210,70 C224,70 231,10 245,10 C259,10 266,40 280,40"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="2.2"
        filter={`url(#g-${id})`}
        style={{
          strokeDasharray: 800,
          animation: "dash-anim 4s linear infinite",
        }}
      />
    </svg>
  );
}

function GaussianPreview({ isDark }) {
  const pts = [];
  for (let x = -3.5; x <= 3.5; x += 0.08) {
    pts.push([x * 33 + 140, 68 - Math.exp(-x * x) * 52]);
  }
  const d = pts
    .map(
      (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`,
    )
    .join(" ");
  const f =
    d +
    ` L${pts[pts.length - 1][0].toFixed(1)},68 L${pts[0][0].toFixed(1)},68 Z`;
  return (
    <svg viewBox="0 0 280 80" className="w-full">
      <defs>
        <pattern
          id="gridG"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke={isDark ? "#67e8f9" : "#1e2937"}
            strokeWidth="0.9"
            strokeOpacity="0.40"
          />
        </pattern>
        <linearGradient id="gG2" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="280" height="80" fill="url(#gridG)" />
      <path d={f} fill="url(#gG2)" />
      <path d={d} fill="none" stroke="#34d399" strokeWidth="2.2" />
    </svg>
  );
}

function EulerSpiralPreview({ isDark }) {
  const W = 280,
    H = 80,
    steps = 300,
    tMax = 4.5;
  let cx = 0,
    cy = 0;
  const dt = tMax / steps;
  const pts = [[0, 0]];
  for (let i = 1; i <= steps; i++) {
    const t = i * dt;
    cx += Math.cos((t * t) / 2) * dt;
    cy += Math.sin((t * t) / 2) * dt;
    pts.push([cx, cy]);
  }
  const xs = pts.map((p) => p[0]),
    ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1,
    rangeY = maxY - minY || 1;
  const pad = 8;
  const toSX = (x) => pad + ((x - minX) / rangeX) * (W - pad * 2);
  const toSY = (y) => H - pad - ((y - minY) / rangeY) * (H - pad * 2);
  const d = pts
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${toSX(p[0]).toFixed(1)},${toSY(p[1]).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <pattern
          id="gridE"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke={isDark ? "#67e8f9" : "#1e2937"}
            strokeWidth="0.9"
            strokeOpacity="0.40"
          />
        </pattern>
        <linearGradient id="eulerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#gridE)" />
      <path
        d={d}
        fill="none"
        stroke="url(#eulerGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivationPreview({ isDark }) {
  const W = 280,
    H = 80;
  const toX = (x) => ((x + 5) / 10) * W;
  const toY = (y) => H - ((y + 1.2) / 2.4) * H;
  const sigmoid = [],
    relu = [],
    tanh_ = [];
  for (let x = -5; x <= 5; x += 0.1) {
    sigmoid.push([toX(x), toY(1 / (1 + Math.exp(-x)))]);
    relu.push([toX(x), toY(Math.max(0, x) * 0.5)]);
    tanh_.push([toX(x), toY(Math.tanh(x))]);
  }
  const path = (pts) =>
    pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`,
      )
      .join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="gridA"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke={isDark ? "#67e8f9" : "#1e2937"}
            strokeWidth="0.9"
            strokeOpacity="0.40"
          />
        </pattern>
        <filter id="actGlow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#gridA)" />
      <line
        x1="0"
        y1={toY(0)}
        x2={W}
        y2={toY(0)}
        stroke="rgba(139,92,246,0.25)"
        strokeWidth="0.7"
      />
      <path
        d={path(tanh_)}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.8"
        filter="url(#actGlow)"
        opacity="0.9"
      />
      <path
        d={path(sigmoid)}
        fill="none"
        stroke="#34d399"
        strokeWidth="1.8"
        filter="url(#actGlow)"
        opacity="0.9"
      />
      <path
        d={path(relu)}
        fill="none"
        stroke="#fb923c"
        strokeWidth="1.8"
        filter="url(#actGlow)"
        opacity="0.9"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PARTICLE FIELD (enhanced with mouse interaction)
═══════════════════════════════════════════════════════════════════ */
function ParticleField({ isDark }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", () => {
      mouseRef.current = { x: -9999, y: -9999 };
    });

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      hue: [188, 160, 270, 210][Math.floor(Math.random() * 4)],
    }));

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;
      particles.forEach((p) => {
        const dx = mx - p.x,
          dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx -= (dx / dist) * 0.04;
          p.vy -= (dy / dist) * 0.04;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,65%,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++)
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x,
            dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${0.07 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: isDark ? 0.7 : 0.35 }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TILT CARD (hover tilt effect - no framer-motion dependency)
═══════════════════════════════════════════════════════════════════ */
function TiltCard({ children, className = "", style = {}, intensity = 8 }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.transform = `perspective(600px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(8px)`;
  };
  const handleLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition: "transform 0.2s ease" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════════════════════════════ */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION WRAPPER with fade-in
═══════════════════════════════════════════════════════════════════ */
function RevealSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════════════════ */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  color = "#22d3ee",
  isDark,
}) {
  return (
    <div className="text-center mb-12">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
        style={{
          background: `${color}12`,
          border: `1px solid ${color}30`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
        <span
          className="font-mono text-[10px] tracking-[3px] uppercase"
          style={{ color }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className="font-orbitron font-black mb-3"
        style={{
          fontSize: "clamp(1.5rem,4vw,2.5rem)",
          background: `linear-gradient(135deg, ${color}, ${color}99)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="font-rajdhani text-lg max-w-2xl mx-auto"
          style={{ color: isDark ? "#64748b" : "#475569" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FLOATING ORBS BACKGROUND
═══════════════════════════════════════════════════════════════════ */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { color: "6,182,212", x: "20%", y: "25%", size: 400, dur: 8 },
        { color: "139,92,246", x: "75%", y: "65%", size: 320, dur: 10 },
        { color: "244,114,182", x: "55%", y: "15%", size: 250, dur: 12 },
        { color: "52,211,153", x: "10%", y: "75%", size: 200, dur: 9 },
      ].map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(ellipse, rgba(${orb.color},0.06) 0%, transparent 70%)`,
            transform: "translate(-50%,-50%)",
            animation: `float ${orb.dur}s ease-in-out infinite ${i % 2 === 0 ? "" : "reverse"}`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════════════════ */
function AnimatedCounter({ target, suffix = "", color }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal(0.5);
  useEffect(() => {
    if (!visible) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    const isPercent = target.includes("%");
    const isPlus = target.includes("+");
    let start = 0;
    const step = num / 60;
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      setCount(Math.floor(start));
      if (start >= num) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target]);

  const display = target.includes("+")
    ? `${count}+`
    : target.includes("%")
      ? `${count}%`
      : `${count}`;

  return (
    <span
      ref={ref}
      style={{
        color,
        textShadow: `0 0 20px ${color}60`,
        fontFamily: "Orbitron, sans-serif",
        fontWeight: 900,
      }}
    >
      {display}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DATA CONSTANTS
═══════════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: "📈",
    title: "2D Function Plotter",
    color: "#22d3ee",
    bgColor: "rgba(6,182,212,0.07)",
    borderColor: "rgba(6,182,212,0.35)",
    glowColor: "rgba(6,182,212,0.12)",
    desc: "Plot any mathematical expression — trig, polynomial, exponential. Multi-function overlay, zoom & pan, animated waves.",
    items: [
      "50+ example functions",
      "Multi-curve overlay",
      "Zoom & pan controls",
      "Animated waveforms",
    ],
    page: "plotter2d",
    cta: "Launch 2D Plotter",
  },
  {
    icon: "🌌",
    title: "3D Surface Visualizer",
    color: "#a78bfa",
    bgColor: "rgba(139,92,246,0.07)",
    borderColor: "rgba(139,92,246,0.35)",
    glowColor: "rgba(139,92,246,0.12)",
    desc: "Immersive 3D graphing with orbit controls, cinematic animations, helix, torus, Möbius strip, and GPU-accelerated rendering.",
    items: [
      "Orbit camera controls",
      "17+ 3D presets",
      "Animated surfaces",
      "Zoom & pan 3D",
    ],
    page: "plotter3d",
    cta: "Launch 3D Plotter",
  },
  {
    icon: "ℂ",
    title: "Complex Analysis",
    color: "#f472b6",
    bgColor: "rgba(236,72,153,0.07)",
    borderColor: "rgba(236,72,153,0.35)",
    glowColor: "rgba(236,72,153,0.12)",
    desc: "Euler's formula e^(ix) = cos(x)+i·sin(x), complex spirals, phase visualization, and magnitude surfaces.",
    items: [
      "Euler's formula viz",
      "Phase coloring",
      "Complex spirals",
      "Magnitude surfaces",
    ],
    page: "complex",
    cta: "Explore Complex",
  },
  {
    icon: "∑",
    title: "Parametric & Polar",
    color: "#fb923c",
    bgColor: "rgba(249,115,22,0.07)",
    borderColor: "rgba(249,115,22,0.35)",
    glowColor: "rgba(249,115,22,0.12)",
    desc: "Lissajous curves, Fourier series, rose curves, epitrochoids, parametric spirals, and polar equations with animation.",
    items: [
      "Lissajous figures",
      "Fourier harmonics",
      "Polar equations",
      "Beat frequencies",
    ],
    page: "parametric",
    cta: "Try Parametric",
  },
  {
    icon: "σ",
    title: "Activation Functions",
    color: "#a78bfa",
    bgColor: "rgba(139,92,246,0.07)",
    borderColor: "rgba(139,92,246,0.35)",
    glowColor: "rgba(139,92,246,0.12)",
    desc: "Interactive neural network activation function explorer — ReLU, Sigmoid, Tanh, GELU, Swish, Mish and 12 more with adjustable parameters.",
    items: [
      "18 activation functions",
      "Adjustable parameters",
      "Side-by-side comparison",
      "Scroll zoom",
    ],
    page: "activation",
    cta: "Explore Activations",
    badge: "AI/ML",
  },
];

const STATS = [
  { num: "350+", label: "Example Functions", color: "#22d3ee", icon: "f(x)" },
  { num: "18", label: "Activation Functions", color: "#a78bfa", icon: "σ" },
  { num: "5", label: "Visualization Modes", color: "#10b981", icon: "⊞" },
  { num: "100%", label: "Browser-Based", color: "#fb923c", icon: "⚡" },
  { num: "3D", label: "GPU Rendering", color: "#f472b6", icon: "🌌" },
  { num: "∞", label: "Possibilities", color: "#fbbf24", icon: "∞" },
];

const TECH_STACK = [
  { name: "React 18", color: "#61dafb", icon: "⚛" },
  { name: "Three.js", color: "#ffffff", icon: "△" },
  { name: "React Three Fiber", color: "#f97316", icon: "🎨" },
  { name: "Math.js", color: "#22d3ee", icon: "∑" },
  { name: "Recharts", color: "#10b981", icon: "📊" },
  { name: "Tailwind CSS", color: "#38bdf8", icon: "🎨" },
  { name: "Vercel", color: "#a78bfa", icon: "▲" },
];

const QUOTES = [
  {
    text: "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding.",
    author: "William Paul Thurston",
    field: "Mathematics",
  },
  {
    text: "The unreasonable effectiveness of mathematics in the natural sciences is a wonderful gift which we neither understand nor deserve.",
    author: "Eugene Wigner",
    field: "Physics",
  },
  {
    text: "Pure mathematics is, in its way, the poetry of logical ideas.",
    author: "Albert Einstein",
    field: "Theoretical Physics",
  },
  {
    text: "In mathematics you don't understand things. You just get used to them.",
    author: "John von Neumann",
    field: "Mathematics & Computing",
  },
  {
    text: "The most beautiful thing we can experience is the mysterious. It is the source of all true art and science.",
    author: "Albert Einstein",
    field: "Physics",
  },
];

const MATH_WORLDS = [
  {
    name: "Calculus",
    symbol: "∫",
    color: "#22d3ee",
    desc: "Derivatives, integrals, limits, and the language of change",
    formula: "∫f(x)dx",
  },
  {
    name: "Complex Analysis",
    symbol: "ℂ",
    color: "#f472b6",
    desc: "Numbers in the imaginary plane, Euler's formula, residues",
    formula: "e^(iπ)+1=0",
  },
  {
    name: "Topology",
    symbol: "∞",
    color: "#a78bfa",
    desc: "Shapes, surfaces, knots, and continuous deformation",
    formula: "χ=2-2g",
  },
  {
    name: "Fourier Analysis",
    symbol: "∑",
    color: "#fb923c",
    desc: "Decomposing signals into frequency components",
    formula: "Σaₙcos(nx)",
  },
  {
    name: "Linear Algebra",
    symbol: "M",
    color: "#10b981",
    desc: "Vectors, matrices, eigenvalues, and transformations",
    formula: "Av=λv",
  },
  {
    name: "Neural Networks",
    symbol: "σ",
    color: "#fbbf24",
    desc: "Activation functions, backpropagation, gradient descent",
    formula: "σ(Wx+b)",
  },
];

const ROADMAP = [
  {
    phase: "v1",
    title: "Foundation",
    status: "done",
    color: "#22d3ee",
    items: ["2D Function Plotter", "Basic SVG rendering", "Expression parser"],
  },
  {
    phase: "v2",
    title: "Expansion",
    status: "done",
    color: "#10b981",
    items: [
      "3D Surface Visualizer",
      "Complex Analysis module",
      "Dark/Light theming",
    ],
  },
  {
    phase: "v3",
    title: "Intelligence",
    status: "done",
    color: "#a78bfa",
    items: [
      "Activation Functions Explorer",
      "Parametric & Polar plotter",
      "Animated curves",
    ],
  },
  {
    phase: "v4",
    title: "Future",
    status: "upcoming",
    color: "#f472b6",
    items: [
      "AI-powered function generator",
      "Collaborative sessions",
      "Export to LaTeX",
    ],
  },
];

const COMPARISON_FEATURES = [
  {
    feature: "2D Function Plotting",
    nova: true,
    wolfram: true,
    geogebra: true,
  },
  {
    feature: "3D Surface Rendering",
    nova: true,
    wolfram: true,
    geogebra: false,
  },
  { feature: "Complex Analysis", nova: true, wolfram: true, geogebra: false },
  { feature: "Parametric Curves", nova: true, wolfram: false, geogebra: true },
  {
    feature: "Neural Activation Functions",
    nova: true,
    wolfram: false,
    geogebra: false,
  },
  { feature: "100% Free & Open", nova: true, wolfram: false, geogebra: true },
  {
    feature: "Browser-Based (No Install)",
    nova: true,
    wolfram: true,
    geogebra: true,
  },
  {
    feature: "Animated Visualizations",
    nova: true,
    wolfram: false,
    geogebra: false,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function HomePage({ setPage }) {
  const { isDark } = useTheme();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [hoveredWorld, setHoveredWorld] = useState(null);

  // Auto-advance quotes
  useEffect(() => {
    const t = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % QUOTES.length);
        setQuoteVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const bg = isDark ? "#020810" : "#f0f6ff";
  const cardBg = isDark ? "rgba(4,10,24,0.85)" : "rgba(255,255,255,0.95)";
  const cardBorder = isDark ? "rgba(6,182,212,0.15)" : "rgba(100,149,237,0.25)";
  const textPrimary = isDark ? "#e2e8f0" : "#0f172a";
  const textSecondary = isDark ? "#64748b" : "#475569";
  const textMuted = isDark ? "#334155" : "#94a3b8";

  return (
    <main className="flex-1 overflow-y-auto nova-bg" style={{ background: bg }}>
      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 py-16">
        {isDark && <div className="absolute inset-0 nova-grid opacity-40" />}
        <div className="absolute inset-0">
          <ParticleField isDark={isDark} />
        </div>
        <FloatingOrbs />

        {/* Gradient mesh */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 60%)"
              : "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 text-center max-w-6xl mx-auto w-full">
          {/* Version badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
            style={{
              background: isDark
                ? "rgba(6,182,212,0.08)"
                : "rgba(99,102,241,0.07)",
              border: isDark
                ? "1px solid rgba(6,182,212,0.2)"
                : "1px solid rgba(99,102,241,0.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "#22d3ee",
                boxShadow: "0 0 8px #22d3ee",
                animation: "pulse 2s ease infinite",
              }}
            />
            <span
              className="font-mono text-xs tracking-[0.25em] uppercase"
              style={{ color: isDark ? "#22d3ee" : "#6366f1" }}
            >
              Scientific Visualization Platform · v3.0
            </span>
          </div>

          {/* Main title */}
          <h1
            className="font-orbitron font-black leading-none mb-2"
            style={{
              fontSize: "clamp(3.5rem,12vw,8rem)",
              background: isDark
                ? "linear-gradient(135deg, #22d3ee 0%, #34d399 25%, #a78bfa 60%, #f472b6 100%)"
                : "linear-gradient(135deg, #0ea5e9 0%, #10b981 30%, #6366f1 70%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NOVA
          </h1>

          <h2
            className="font-orbitron font-bold mb-6"
            style={{
              fontSize: "clamp(0.8rem,2vw,1.2rem)",
              color: textMuted,
              letterSpacing: "0.4em",
            }}
          >
            MATHPLOT PLATFORM
          </h2>

          <p
            className="font-rajdhani text-xl sm:text-2xl font-light mb-3 max-w-3xl mx-auto"
            style={{ color: textSecondary }}
          >
            Where mathematics meets machine learning, visualization, and
            scientific discovery
          </p>

          <div
            className="font-mono text-sm max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: textMuted }}
          >
            {"{ "}
            <span style={{ color: "#22d3ee" }}>sin</span>(x) ·{" "}
            <span style={{ color: "#34d399" }}>e</span>^(
            <span style={{ color: "#f472b6" }}>ix</span>) ·{" "}
            <span style={{ color: "#a78bfa" }}>σ</span>(x) ·{" "}
            <span style={{ color: "#fb923c" }}>ReLU</span>(x) ·{" "}
            <span style={{ color: "#fbbf24" }}>∇</span>f(x){" }"}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
            <button
              onClick={() => setPage("plotter2d")}
              className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3"
            >
              Launch 2D Plotter →
            </button>
            <button
              onClick={() => setPage("plotter3d")}
              className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3"
            >
              🌌 3D Visualizer
            </button>
            <button
              onClick={() => setPage("activation")}
              className="btn-accent text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3"
            >
              σ Neural Activations
            </button>
          </div>

          {/* Hero preview panel */}
          <TiltCard intensity={5} style={{ maxWidth: 760, margin: "0 auto" }}>
            <div
              style={{
                background: isDark
                  ? "rgba(4,10,24,0.9)"
                  : "rgba(255,255,255,0.97)",
                border: isDark
                  ? "1px solid rgba(6,182,212,0.25)"
                  : "1px solid rgba(99,102,241,0.28)",
                borderRadius: "1.25rem",
                boxShadow: isDark
                  ? "0 0 60px rgba(6,182,212,0.12), 0 30px 80px rgba(0,0,0,0.5)"
                  : "0 20px 60px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Grid overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "1.25rem",
                  backgroundImage: isDark
                    ? "linear-gradient(rgba(103,232,249,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,0.35) 1px, transparent 1px)"
                    : "linear-gradient(rgba(0,0,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.35) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  pointerEvents: "none",
                }}
              />
              {/* Titlebar */}
              <div
                className="flex items-center gap-3 px-5 py-3 border-b relative"
                style={{
                  borderColor: isDark
                    ? "rgba(6,182,212,0.15)"
                    : "rgba(99,102,241,0.2)",
                }}
              >
                <div className="flex gap-1.5">
                  {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
                    <div
                      key={c}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span
                  className="font-mono text-xs flex-1"
                  style={{ color: isDark ? "#334155" : "#475569" }}
                >
                  f(x) = sin(x)·cos(2x) + e^(-x²/4)
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#22d3ee",
                      animation: "pulse 2s ease infinite",
                    }}
                  />
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "#22d3ee" }}
                  >
                    LIVE
                  </span>
                </div>
              </div>
              <div className="p-4 relative">
                <AnimatedSine />
              </div>
              <div className="px-4 pb-4 grid grid-cols-3 gap-3 relative">
                {[
                  {
                    label: "Gaussian",
                    content: <GaussianPreview isDark={isDark} />,
                    color: "#10b981",
                  },
                  {
                    label: "Euler Spiral",
                    content: <EulerSpiralPreview isDark={isDark} />,
                    color: "#a78bfa",
                  },
                  {
                    label: "Activations",
                    content: <ActivationPreview isDark={isDark} />,
                    color: "#fb923c",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl p-3"
                    style={{
                      background: isDark
                        ? "rgba(6,18,40,0.85)"
                        : "rgba(248,250,255,0.95)",
                      border: `1px solid ${item.color}35`,
                    }}
                  >
                    {item.content}
                    <p
                      className="font-mono text-[10px] text-center mt-1.5"
                      style={{ color: item.color }}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: "#22d3ee" }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(180deg, #22d3ee, transparent)",
            }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-20 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATS.map((s, i) => (
              <TiltCard key={s.label} intensity={6}>
                <div
                  className="text-center p-5 rounded-2xl h-full transition-all duration-300 cursor-default"
                  style={{
                    background: cardBg,
                    border: `1px solid ${s.color}25`,
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px ${s.color}20`;
                    e.currentTarget.style.borderColor = `${s.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = `${s.color}25`;
                  }}
                >
                  <div
                    className="font-mono text-xl mb-1"
                    style={{ color: `${s.color}70` }}
                  >
                    {s.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl mb-1.5">
                    <AnimatedCounter target={s.num} color={s.color} />
                  </div>
                  <div
                    className="font-mono text-[10px] tracking-wider"
                    style={{ color: textSecondary }}
                  >
                    {s.label}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          SCIENTIFIC UNIVERSE OVERVIEW
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <SectionHeader
            eyebrow="Overview"
            title="Scientific Universe"
            isDark={isDark}
            subtitle="NOVA MathPlot bridges pure mathematics, scientific computing, and modern AI — all in one elegant platform."
            color="#22d3ee"
          />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              {[
                {
                  icon: "🔢",
                  label: "Pure Mathematics",
                  text: "From classical algebra and calculus to modern topology and complex analysis — visualize the foundations of mathematics interactively.",
                  color: "#22d3ee",
                },
                {
                  icon: "🤖",
                  label: "Machine Learning",
                  text: "Explore neural network activation functions, gradient descent, and the mathematical building blocks of modern AI systems.",
                  color: "#a78bfa",
                },
                {
                  icon: "🌊",
                  label: "Signal Processing",
                  text: "Fourier transforms, Laplace analysis, wave equations, and the mathematical language underlying all digital signals.",
                  color: "#fb923c",
                },
                {
                  icon: "🌌",
                  label: "3D Scientific Viz",
                  text: "GPU-accelerated 3D surface rendering lets you see equations as living geometry — rotate, zoom, animate in real time.",
                  color: "#10b981",
                },
              ].map((item, i) => (
                <RevealSection key={item.label} delay={i * 100}>
                  <div
                    className="flex gap-4 p-4 rounded-xl transition-all duration-300"
                    style={{
                      background: cardBg,
                      border: `1px solid ${cardBorder}`,
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${item.color}40`;
                      e.currentTarget.style.boxShadow = `0 0 20px ${item.color}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = cardBorder;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                      style={{
                        background: `${item.color}15`,
                        border: `1px solid ${item.color}30`,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div
                        className="font-orbitron font-bold text-sm mb-1"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </div>
                      <p
                        className="font-rajdhani text-sm leading-relaxed"
                        style={{ color: textSecondary }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>

            <RevealSection delay={200}>
              <div
                className="relative p-6 rounded-2xl"
                style={{
                  background: isDark
                    ? "rgba(4,10,24,0.9)"
                    : "rgba(255,255,255,0.95)",
                  border: isDark
                    ? "1px solid rgba(6,182,212,0.2)"
                    : "1px solid rgba(99,102,241,0.2)",
                  boxShadow: isDark
                    ? "0 0 60px rgba(6,182,212,0.08)"
                    : "0 10px 40px rgba(99,102,241,0.08)",
                }}
              >
                <div className="relative text-center space-y-4">
                  <div
                    className="font-orbitron font-black text-5xl"
                    style={{
                      background:
                        "linear-gradient(135deg,#22d3ee,#a78bfa,#f472b6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    e^(iπ)+1=0
                  </div>
                  <p
                    className="font-mono text-xs tracking-widest"
                    style={{ color: textSecondary }}
                  >
                    Euler's Identity — the most beautiful equation
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                      ["e", "#22d3ee", "Euler's number"],
                      ["i", "#f472b6", "Imaginary unit"],
                      ["π", "#a78bfa", "Pi"],
                    ].map(([sym, col, desc]) => (
                      <div
                        key={sym}
                        className="p-3 rounded-xl text-center"
                        style={{
                          background: `${col}10`,
                          border: `1px solid ${col}25`,
                        }}
                      >
                        <div
                          className="font-orbitron font-black text-2xl"
                          style={{ color: col }}
                        >
                          {sym}
                        </div>
                        <div
                          className="font-mono text-[9px] mt-1"
                          style={{ color: textSecondary }}
                        >
                          {desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          VISUALIZATION MODULES EXPLORER
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <SectionHeader
            eyebrow="Modules"
            title="Visualization Explorer"
            isDark={isDark}
            subtitle="Five powerful tools, each purpose-built for a different branch of mathematical visualization."
            color="#a78bfa"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => (
              <RevealSection key={f.title} delay={idx * 80}>
                <div
                  className="relative p-6 sm:p-7 rounded-2xl cursor-pointer h-full flex flex-col transition-all duration-300"
                  style={{
                    background: hoveredFeature === f.title ? f.bgColor : cardBg,
                    border: `1.5px solid ${hoveredFeature === f.title ? f.borderColor : f.color + "22"}`,
                    boxShadow:
                      hoveredFeature === f.title
                        ? `0 0 40px ${f.glowColor}, inset 0 0 30px ${f.color}06`
                        : "none",
                    transform:
                      hoveredFeature === f.title ? "translateY(-6px)" : "none",
                  }}
                  onMouseEnter={() => setHoveredFeature(f.title)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                    style={{
                      background: `linear-gradient(90deg,transparent,${f.color}${hoveredFeature === f.title ? "80" : "40"},transparent)`,
                    }}
                  />
                  {f.badge && (
                    <div className="absolute top-4 right-4">
                      <span
                        className="font-orbitron font-bold text-[9px] px-2 py-0.5 rounded-full tracking-widest"
                        style={{
                          background: `${f.color}20`,
                          color: f.color,
                          border: `1px solid ${f.color}35`,
                        }}
                      >
                        {f.badge}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: f.bgColor,
                        border: `1px solid ${f.borderColor}`,
                        boxShadow: `0 0 20px ${f.color}15`,
                      }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <h3
                        className="font-orbitron font-bold text-sm mb-1"
                        style={{ color: f.color }}
                      >
                        {f.title}
                      </h3>
                      <p
                        className="font-rajdhani text-sm leading-relaxed"
                        style={{ color: textSecondary }}
                      >
                        {f.desc}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-5 flex-1">
                    {f.items.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span style={{ color: f.color, fontSize: "0.5rem" }}>
                          ◆
                        </span>
                        <span
                          className="font-mono text-xs"
                          style={{ color: textSecondary }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(f.page)}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      background: f.bgColor,
                      border: `1px solid ${f.borderColor}`,
                      color: f.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 20px ${f.color}30`;
                      e.currentTarget.style.background = `${f.color}18`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background = f.bgColor;
                    }}
                  >
                    {f.cta} →
                  </button>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
    MATHEMATICAL WORLDS - Improved Animation
══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />

        <RevealSection>
          <SectionHeader
            eyebrow="Domains"
            title="Mathematical Worlds"
            isDark={isDark}
            subtitle="Explore the rich domains of mathematics that NOVA MathPlot helps you visualize and understand."
            color="#10b981"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MATH_WORLDS.map((world, i) => (
              <RevealSection key={world.name} delay={i * 45} className="group">
                <TiltCard intensity={12}>
                  <div
                    className="p-6 rounded-3xl h-full cursor-default relative overflow-hidden transition-all duration-500 group-hover:-translate-y-3"
                    style={{
                      background:
                        hoveredWorld === world.name
                          ? isDark
                            ? `rgba(16, 185, 129, 0.12)` // fallback + custom per card below
                            : `${world.color}15`
                          : cardBg,
                      border: `1px solid ${hoveredWorld === world.name ? world.color + "60" : world.color + "25"}`,
                      boxShadow:
                        hoveredWorld === world.name
                          ? `0 25px 50px -12px ${world.color}40`
                          : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    onMouseEnter={() => setHoveredWorld(world.name)}
                    onMouseLeave={() => setHoveredWorld(null)}
                  >
                    {/* Dynamic Background Glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 40% 25%, ${world.color}30, transparent 70%)`,
                      }}
                    />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Symbol */}
                      <div
                        className="font-orbitron font-black text-4xl mb-3 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                        style={{
                          color: world.color,
                          textShadow:
                            hoveredWorld === world.name
                              ? `0 0 35px ${world.color}80`
                              : `0 0 20px ${world.color}50`,
                        }}
                      >
                        {world.symbol}
                      </div>

                      {/* Name */}
                      <div
                        className="font-orbitron font-bold text-xs tracking-[2px] mb-3 transition-all"
                        style={{ color: world.color }}
                      >
                        {world.name}
                      </div>

                      {/* Description */}
                      <p
                        className="font-rajdhani text-sm leading-relaxed mb-5 flex-1 transition-colors duration-300"
                        style={{ color: textSecondary }}
                      >
                        {world.desc}
                      </p>

                      {/* Formula */}
                      <div
                        className="font-mono text-[10px] px-4 py-2.5 rounded-2xl text-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-inner"
                        style={{
                          background: `${world.color}12`,
                          color: world.color,
                          border: `1px solid ${world.color}35`,
                        }}
                      >
                        {world.formula}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          LEARN THROUGH VISUALIZATION
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <SectionHeader
            eyebrow="Pedagogy"
            title="Learn Through Visualization"
            isDark={isDark}
            subtitle="The most effective way to understand mathematics is to see it. NOVA MathPlot transforms abstract equations into living visual intuition."
            color="#f472b6"
          />
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "⊞",
                title: "Choose Your Domain",
                desc: "Pick from 2D, 3D, Complex, Parametric, or Neural Activation visualizers — each tailored to a specific branch of mathematics.",
                color: "#22d3ee",
              },
              {
                step: "02",
                icon: "f(x)",
                title: "Input Your Expression",
                desc: "Type any mathematical expression using natural notation. The live engine parses and evaluates instantly — no compile step, no delay.",
                color: "#a78bfa",
              },
              {
                step: "03",
                icon: "⟳",
                title: "Interact & Discover",
                desc: "Zoom, pan, rotate, animate. Adjust parameters and watch the math respond in real time. Build intuition you can't get from a textbook.",
                color: "#34d399",
              },
            ].map((step, i) => (
              <RevealSection key={step.step} delay={i * 120}>
                <div
                  className="relative p-7 rounded-2xl text-center h-full"
                  style={{
                    background: cardBg,
                    border: `1px solid ${step.color}25`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {i < 2 && (
                    <div
                      className="hidden sm:block absolute top-1/2 -right-3 z-10 font-mono text-base"
                      style={{
                        color: textMuted,
                        transform: "translateY(-50%)",
                      }}
                    >
                      →
                    </div>
                  )}
                  <div
                    className="font-orbitron font-black text-5xl mb-4"
                    style={{ color: `${step.color}20` }}
                  >
                    {step.step}
                  </div>
                  <div
                    className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{
                      background: `${step.color}12`,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    <span
                      style={{
                        color: step.color,
                        fontFamily: "Orbitron",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                      }}
                    >
                      {step.icon}
                    </span>
                  </div>
                  <h3
                    className="font-orbitron font-bold text-sm mb-3"
                    style={{ color: step.color }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-rajdhani text-sm leading-relaxed"
                    style={{ color: textSecondary }}
                  >
                    {step.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          PLATFORM STATISTICS (detailed)
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <SectionHeader
            eyebrow="By The Numbers"
            title="Platform Statistics"
            isDark={isDark}
            subtitle="A comprehensive toolkit built with attention to depth and educational value."
            color="#22d3ee"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "2D Function Plotter",
                color: "#22d3ee",
                stats: [
                  ["50+", "Preset functions"],
                  ["∞", "Custom expressions"],
                  ["Multi", "Curve overlay"],
                  ["Live", "Preview updates"],
                ],
              },
              {
                title: "3D Visualizer",
                color: "#a78bfa",
                stats: [
                  ["17+", "3D presets"],
                  ["60fps", "Smooth rendering"],
                  ["WebGL", "GPU powered"],
                  ["360°", "Orbit controls"],
                ],
              },
              {
                title: "Activation Explorer",
                color: "#f472b6",
                stats: [
                  ["18", "Functions"],
                  ["Derivative", "Overlay toggle"],
                  ["Scroll", "Zoom on X-axis"],
                  ["Formula", "Reference sidebar"],
                ],
              },
            ].map((group, gi) => (
              <RevealSection key={group.title} delay={gi * 100}>
                <div
                  className="p-6 rounded-2xl h-full"
                  style={{
                    background: cardBg,
                    border: `1px solid ${group.color}25`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <h3
                    className="font-orbitron font-bold text-sm mb-4"
                    style={{ color: group.color }}
                  >
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {group.stats.map(([val, lbl]) => (
                      <div
                        key={lbl}
                        className="p-3 rounded-xl text-center"
                        style={{
                          background: `${group.color}08`,
                          border: `1px solid ${group.color}18`,
                        }}
                      >
                        <div
                          className="font-orbitron font-black text-lg mb-0.5"
                          style={{ color: group.color }}
                        >
                          {val}
                        </div>
                        <div
                          className="font-mono text-[9px]"
                          style={{ color: textSecondary }}
                        >
                          {lbl}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          EDUCATIONAL ROADMAP
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <SectionHeader
            eyebrow="Journey"
            title="Educational Roadmap"
            isDark={isDark}
            subtitle="From beginner to researcher — NOVA MathPlot grows with your mathematical journey."
            color="#10b981"
          />
          <div className="relative">
            {/* Connecting line */}
            <div
              className="hidden lg:block absolute top-8 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(6,182,212,0.3), rgba(139,92,246,0.3), rgba(244,114,182,0.3), transparent)`,
              }}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ROADMAP.map((phase, i) => (
                <RevealSection key={phase.phase} delay={i * 100}>
                  <div
                    className="relative p-6 rounded-2xl"
                    style={{
                      background: cardBg,
                      border: `1px solid ${phase.color}${phase.status === "upcoming" ? "30" : "45"}`,
                      opacity: phase.status === "upcoming" ? 0.75 : 1,
                    }}
                  >
                    {/* Phase dot (timeline) */}
                    <div
                      className="hidden lg:flex absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        background:
                          phase.status === "done" ? phase.color : cardBg,
                        border: `2px solid ${phase.color}`,
                        boxShadow:
                          phase.status === "done"
                            ? `0 0 15px ${phase.color}60`
                            : "none",
                      }}
                    >
                      {phase.status === "done" && (
                        <span
                          style={{
                            color: isDark ? "#000" : "#fff",
                            fontSize: "9px",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="font-orbitron font-black text-xs px-2 py-0.5 rounded-lg"
                        style={{
                          color: phase.color,
                          background: `${phase.color}15`,
                          border: `1px solid ${phase.color}30`,
                        }}
                      >
                        {phase.phase}
                      </span>
                      <span
                        className="font-orbitron font-bold text-sm"
                        style={{ color: phase.color }}
                      >
                        {phase.title}
                      </span>
                      {phase.status === "upcoming" && (
                        <span
                          className="ml-auto font-mono text-[8px] px-2 py-0.5 rounded-full"
                          style={{
                            color: "#fbbf24",
                            background: "rgba(251,191,36,0.1)",
                            border: "1px solid rgba(251,191,36,0.3)",
                          }}
                        >
                          SOON
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {phase.items.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <span
                            style={{ color: phase.color, fontSize: "0.5rem" }}
                          >
                            {phase.status === "done" ? "✓" : "○"}
                          </span>
                          <span
                            className="font-rajdhani text-sm"
                            style={{ color: textSecondary }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          INSPIRATIONAL QUOTES CAROUSEL
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <SectionHeader
            eyebrow="Inspiration"
            title="Voices of Science"
            isDark={isDark}
            subtitle="The great minds who shaped our understanding of the mathematical universe."
            color="#f472b6"
          />
          <div className="relative max-w-3xl mx-auto">
            <div
              style={{
                background: cardBg,
                border: `1px solid rgba(244,114,182,0.2)`,
                borderRadius: "1.5rem",
                padding: "2.5rem",
                boxShadow: isDark
                  ? "0 0 60px rgba(244,114,182,0.08)"
                  : "0 10px 40px rgba(244,114,182,0.08)",
                backdropFilter: "blur(12px)",
                minHeight: 200,
              }}
            >
              <div
                className="text-6xl mb-4 opacity-20 font-serif"
                style={{ color: "#f472b6" }}
              >
                "
              </div>
              <div
                style={{
                  opacity: quoteVisible ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
              >
                <p
                  className="font-rajdhani text-xl leading-relaxed mb-6"
                  style={{ color: textPrimary, fontStyle: "italic" }}
                >
                  {QUOTES[quoteIdx].text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-px flex-1"
                    style={{ background: "rgba(244,114,182,0.3)" }}
                  />
                  <div className="text-right">
                    <div
                      className="font-orbitron font-bold text-sm"
                      style={{ color: "#f472b6" }}
                    >
                      {QUOTES[quoteIdx].author}
                    </div>
                    <div
                      className="font-mono text-xs"
                      style={{ color: textMuted }}
                    >
                      {QUOTES[quoteIdx].field}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuoteVisible(false);
                    setTimeout(() => {
                      setQuoteIdx(i);
                      setQuoteVisible(true);
                    }, 300);
                  }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === quoteIdx ? 24 : 8,
                    height: 8,
                    background:
                      i === quoteIdx
                        ? "#f472b6"
                        : isDark
                          ? "#334155"
                          : "#cbd5e1",
                    boxShadow:
                      i === quoteIdx
                        ? "0 0 10px rgba(244,114,182,0.5)"
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          FUTURE ROADMAP
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <SectionHeader
            eyebrow="Coming Soon"
            title="Future Roadmap"
            isDark={isDark}
            subtitle="The next generation of features being built for NOVA MathPlot."
            color="#fbbf24"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "🤖",
                title: "AI Function Generator",
                desc: "Describe a shape or behavior in plain English — the AI generates the mathematical expression automatically.",
                color: "#a78bfa",
                badge: "v4",
              },
              {
                icon: "🤝",
                title: "Collaborative Sessions",
                desc: "Share live visualization sessions with classmates or colleagues. Real-time collaborative math exploration.",
                color: "#22d3ee",
                badge: "v4",
              },
              {
                icon: "📄",
                title: "LaTeX Export",
                desc: "Export any plot with its equation directly to LaTeX format for inclusion in academic papers and presentations.",
                color: "#10b981",
                badge: "v4",
              },
              {
                icon: "📱",
                title: "Mobile-First UI",
                desc: "Full touch gesture support — pinch-to-zoom, swipe navigation, and an optimized mobile equation input keyboard.",
                color: "#fb923c",
                badge: "v4",
              },
              {
                icon: "🧩",
                title: "Plugin System",
                desc: "Extend NOVA MathPlot with community plugins for domain-specific tools — physics, finance, statistics.",
                color: "#f472b6",
                badge: "v5",
              },
              {
                icon: "📚",
                title: "Curriculum Library",
                desc: "Curated learning paths with guided visualizations for calculus, linear algebra, and statistics courses.",
                color: "#fbbf24",
                badge: "v5",
              },
            ].map((item, i) => (
              <RevealSection key={item.title} delay={i * 80}>
                <div
                  className="p-5 rounded-2xl h-full"
                  style={{
                    background: cardBg,
                    border: `1px solid ${item.color}20`,
                    backdropFilter: "blur(8px)",
                    opacity: 0.85,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${item.color}45`;
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.boxShadow = `0 0 25px ${item.color}12`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${item.color}20`;
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">{item.icon}</span>
                    <h3
                      className="font-orbitron font-bold text-sm flex-1"
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </h3>
                    <span
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                      style={{
                        color: "#fbbf24",
                        background: "rgba(251,191,36,0.1)",
                        border: "1px solid rgba(251,191,36,0.25)",
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p
                    className="font-rajdhani text-sm leading-relaxed"
                    style={{ color: textSecondary }}
                  >
                    {item.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          PREMIUM CALL TO ACTION
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <div
            className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.1) 50%, rgba(244,114,182,0.07) 100%)"
                : "linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(139,92,246,0.06) 50%, rgba(244,114,182,0.05) 100%)",
              border: isDark
                ? "1px solid rgba(6,182,212,0.2)"
                : "1px solid rgba(99,102,241,0.2)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Animated background grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(rgba(103,232,249,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,0.12) 1px, transparent 1px)"
                  : "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                pointerEvents: "none",
              }}
            />
            {/* Orbs */}
            <div
              className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)",
                animation: "float 7s ease-in-out infinite",
              }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)",
                animation: "float 9s ease-in-out infinite reverse",
              }}
            />

            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.25)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#22d3ee",
                    animation: "pulse 2s ease infinite",
                  }}
                />
                <span
                  className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: "#22d3ee" }}
                >
                  Start Exploring
                </span>
              </div>

              <h2
                className="font-orbitron font-black mb-4"
                style={{
                  fontSize: "clamp(2rem,5vw,3.5rem)",
                  background:
                    "linear-gradient(135deg,#22d3ee 0%,#a78bfa 50%,#f472b6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.1,
                }}
              >
                Mathematics Awaits
              </h2>
              <p
                className="font-rajdhani text-xl max-w-2xl mx-auto mb-3"
                style={{ color: textSecondary }}
              >
                Visualize any equation. Explore any surface. Understand any
                function. All in your browser — completely free, forever.
              </p>
              <p
                className="font-mono text-sm mb-10"
                style={{ color: textMuted }}
              >
                No installation · No account · No limits
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {[
                  {
                    label: "2D Plotter →",
                    page: "plotter2d",
                    color: "#22d3ee",
                  },
                  {
                    label: "🌌 3D Visualizer",
                    page: "plotter3d",
                    color: "#a78bfa",
                  },
                  {
                    label: "ℂ Complex Analysis",
                    page: "complex",
                    color: "#f472b6",
                  },
                  {
                    label: "∑ Parametric",
                    page: "parametric",
                    color: "#fb923c",
                  },
                  {
                    label: "σ Activations",
                    page: "activation",
                    color: "#10b981",
                  },
                ].map((btn) => (
                  <button
                    key={btn.page}
                    onClick={() => setPage(btn.page)}
                    className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      background: `${btn.color}15`,
                      border: `1px solid ${btn.color}40`,
                      color: btn.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${btn.color}25`;
                      e.currentTarget.style.boxShadow = `0 0 25px ${btn.color}30`;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${btn.color}15`;
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          TECHNOLOGY CONSTELLATION
      ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="nova-divider mb-14" />
        <RevealSection>
          <SectionHeader
            eyebrow="Stack"
            title="Technology Constellation"
            isDark={isDark}
            subtitle="Powered by the best tools in the modern web ecosystem — React, Three.js, mathjs, and more."
            color="#fb923c"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                name: "React 18",
                color: "#61dafb",
                icon: "⚛",
                desc: "UI framework with hooks and context",
                detail: "Component-driven architecture",
              },
              {
                name: "Three.js",
                color: isDark ? "#ffffff" : "#0f172a",
                icon: "△",
                desc: "WebGL 3D rendering engine",
                detail: "GPU-accelerated surfaces",
              },
              {
                name: "Math.js",
                color: "#22d3ee",
                icon: "∑",
                desc: "Powerful math expression parser",
                detail: "Evaluates any formula",
              },
              {
                name: "React Three Fiber",
                color: "#f97316",
                icon: "🔺",
                desc: "React renderer for Three.js",
                detail: "Declarative 3D scenes",
              },
            ].map((t, i) => (
              <RevealSection key={t.name} delay={i * 80}>
                <TiltCard intensity={8}>
                  <div
                    className="p-5 rounded-2xl h-full transition-all duration-300"
                    style={{
                      background: cardBg,
                      border: `1px solid ${t.color}25`,
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${t.color}55`;
                      e.currentTarget.style.boxShadow = `0 0 30px ${t.color}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${t.color}25`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold"
                        style={{
                          background: `${t.color}15`,
                          color: t.color,
                          border: `1px solid ${t.color}30`,
                        }}
                      >
                        {t.icon}
                      </div>
                      <div>
                        <div
                          className="font-orbitron font-bold text-xs"
                          style={{ color: t.color }}
                        >
                          {t.name}
                        </div>
                        <div
                          className="font-mono text-[9px]"
                          style={{ color: textMuted }}
                        >
                          {t.detail}
                        </div>
                      </div>
                    </div>
                    <p
                      className="font-rajdhani text-xs"
                      style={{ color: textSecondary }}
                    >
                      {t.desc}
                    </p>
                  </div>
                </TiltCard>
              </RevealSection>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${t.color}50`;
                  e.currentTarget.style.boxShadow = `0 0 15px ${t.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = cardBorder;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: t.color,
                    boxShadow: `0 0 6px ${t.color}`,
                  }}
                />
                <span
                  className="font-mono text-xs"
                  style={{
                    color: isDark
                      ? t.color
                      : t.color === "#ffffff"
                        ? "#1e293b"
                        : t.color,
                  }}
                >
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer
        className="border-t px-4 sm:px-8 py-14"
        style={{
          borderColor: isDark ? "rgba(6,182,212,0.1)" : "rgba(100,149,237,0.2)",
          background: isDark ? "rgba(2,5,14,0.9)" : "rgba(240,246,255,0.95)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mb-10">
            <div className="flex-shrink-0">
              <div
                className="font-orbitron font-black text-xl tracking-widest mb-1"
                style={{
                  background: "linear-gradient(90deg,#22d3ee,#34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NOVA MathPlot
              </div>
              <div
                className="font-mono text-xs mb-5"
                style={{ color: textMuted }}
              >
                Scientific Visualization Platform v3.0
              </div>
              <div className="flex flex-col gap-2">
                {[
                  [
                    "🌐",
                    "nova-mathplot.vercel.app",
                    "https://nova-mathplot.vercel.app/",
                    "#22d3ee",
                  ],
                  [
                    "⌥",
                    "github.com/Hafiz-Sakib/nova-mathplot",
                    "https://github.com/Hafiz-Sakib/nova-mathplot",
                    "#a78bfa",
                  ],
                ].map(([icon, label, href, col]) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 group"
                  >
                    <span style={{ color: textMuted, fontSize: "0.65rem" }}>
                      {icon}
                    </span>
                    <span
                      className="font-mono text-xs transition-colors"
                      style={{ color: textMuted }}
                      onMouseEnter={(e) => (e.target.style.color = col)}
                      onMouseLeave={(e) => (e.target.style.color = textMuted)}
                    >
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {[
                [
                  "Pages",
                  [
                    ["Home", "home"],
                    ["2D Plotter", "plotter2d"],
                    ["3D Plotter", "plotter3d"],
                  ],
                ],
                [
                  "Tools",
                  [
                    ["Complex", "complex"],
                    ["Parametric", "parametric"],
                    ["Activations", "activation"],
                  ],
                ],
                ["Info", [["Developer", "developer"]]],
              ].map(([section, links]) => (
                <div key={section} className="flex flex-col gap-2">
                  <span
                    className="font-orbitron text-[10px] tracking-widest uppercase mb-1"
                    style={{ color: isDark ? "#94a3b8" : "#0f172a" }}
                  >
                    {section}
                  </span>
                  {links.map(([l, p]) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="font-rajdhani text-sm text-left transition-colors"
                      style={{ color: textMuted }}
                      onMouseEnter={(e) => (e.target.style.color = "#22d3ee")}
                      onMouseLeave={(e) => (e.target.style.color = textMuted)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="nova-divider mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-mono text-xs" style={{ color: textMuted }}>
              Powered by{" "}
              {["mathjs", "recharts", "Three.js", "React Three Fiber"].map(
                (t, i) => (
                  <span key={t}>
                    <span style={{ color: "#22d3ee" }}>{t}</span>
                    {i < 3 && <span style={{ color: textMuted }}> · </span>}
                  </span>
                ),
              )}
            </div>
            <div className="font-mono text-xs" style={{ color: textMuted }}>
              Built by{" "}
              <button
                onClick={() => setPage("developer")}
                className="transition-colors"
                style={{ color: textMuted }}
                onMouseEnter={(e) => (e.target.style.color = "#f472b6")}
                onMouseLeave={(e) => (e.target.style.color = textMuted)}
              >
                Hafizur Rahman Sakib
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
