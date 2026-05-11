import { useTheme } from "../ThemeContext";
import React, { useEffect, useRef, useState } from "react";

/* ─── Animated sine wave ─── */
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

/* ─── Gaussian bell curve preview ─── */
function GaussianPreview() {
  const pts = [];
  for (let x = -3.5; x <= 3.5; x += 0.08) {
    const y = Math.exp(-x * x);
    pts.push([x * 33 + 140, 68 - y * 52]);
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
        <linearGradient id="gG2" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={f} fill="url(#gG2)" />
      <path d={d} fill="none" stroke="#34d399" strokeWidth="2.2" />
    </svg>
  );
}

/* ─── FIXED: Real Euler Spiral (Cornu spiral) preview ─── */
function EulerSpiralPreview() {
  const W = 280,
    H = 80;
  // Euler/Cornu spiral: parametric x=∫cos(t²/2)dt, y=∫sin(t²/2)dt
  const pts = [];
  const steps = 300;
  const tMax = 4.5;
  let cx = 0,
    cy = 0;
  const dt = tMax / steps;
  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    if (i > 0) {
      cx += Math.cos((t * t) / 2) * dt;
      cy += Math.sin((t * t) / 2) * dt;
    }
    pts.push([cx, cy]);
  }
  // Scale & center in SVG
  const xs = pts.map((p) => p[0]),
    ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
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
        <linearGradient id="eulerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
        </linearGradient>
        <filter id="eulerGlow">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#eulerGrad)"
        strokeWidth="2"
        filter="url(#eulerGlow)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Activation preview: sigmoid + relu + tanh ─── */
function ActivationPreview() {
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
        <filter id="actGlow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1="0"
        y1={toY(0)}
        x2={W}
        y2={toY(0)}
        stroke="rgba(139,92,246,0.15)"
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

/* ─── Particle field background ─── */
function ParticleField() {
  const canvasRef = useRef(null);
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
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      hue: [188, 160, 270, 210][Math.floor(Math.random() * 4)],
    }));
    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
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
      style={{ opacity: 0.7 }}
    />
  );
}

/* ─── Data ─── */
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
    badge: "NEW",
  },
];

const TECH_STACK = [
  { name: "React 18", color: "#61dafb" },
  { name: "Three.js", color: "#ffffff" },
  { name: "React Three Fiber", color: "#f97316" },
  { name: "Math.js", color: "#22d3ee" },
  { name: "Recharts", color: "#10b981" },
  { name: "Tailwind CSS", color: "#38bdf8" },
  { name: "Vite", color: "#a78bfa" },
];

const STATS = [
  { num: "50+", label: "Example Functions", color: "#22d3ee" },
  { num: "18", label: "Activation Fns", color: "#a78bfa" },
  { num: "5", label: "Visualization Modes", color: "#10b981" },
  { num: "100%", label: "Browser-Based", color: "#fb923c" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick a Mode",
    desc: "Choose from 2D, 3D, Complex, Parametric, or Activation visualizer.",
    color: "#22d3ee",
  },
  {
    step: "02",
    title: "Enter Your Function",
    desc: "Type any expression using standard math notation. Live preview updates instantly.",
    color: "#a78bfa",
  },
  {
    step: "03",
    title: "Explore & Interact",
    desc: "Zoom, pan, animate, compare — interact with the math in real time.",
    color: "#34d399",
  },
];

/* ─── Main Component ─── */
export default function HomePage({ setPage }) {
  const { isDark } = useTheme();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <main className="flex-1 overflow-y-auto nova-bg">
      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-4 py-16">
        <div className="absolute inset-0 nova-grid opacity-50" />
        <div className="absolute inset-0">
          <ParticleField />
        </div>
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse,rgba(6,182,212,0.07) 0%,transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse,rgba(139,92,246,0.06) 0%,transparent 70%)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
              style={{ background: "#22d3ee", boxShadow: "0 0 8px #22d3ee" }}
            />
            <span
              className="font-mono-code text-xs tracking-widest uppercase"
              style={{ color: "#22d3ee" }}
            >
              Scientific Visualization Platform v3
            </span>
          </div>

          <h1
            className="font-orbitron font-black mb-4 leading-none"
            style={{
              fontSize: "clamp(3rem,10vw,7rem)",
              background:
                "linear-gradient(135deg,#22d3ee 0%,#34d399 30%,#a78bfa 65%,#f472b6 100%)",
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
              fontSize: "clamp(0.85rem,2.5vw,1.35rem)",
              color: "#475569",
              letterSpacing: "0.3em",
            }}
          >
            MATHPLOT PLATFORM
          </h2>

          <p
            className="font-rajdhani text-xl sm:text-2xl font-light mb-3 max-w-3xl mx-auto"
            style={{ color: "#94a3b8" }}
          >
            2D plotting · 3D visualization · complex analysis · activation
            functions
          </p>
          <p
            className="font-mono-code text-sm max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: "#334155" }}
          >
            {"{ "}
            <span style={{ color: "#22d3ee" }}>sin</span>(x) ·{" "}
            <span style={{ color: "#34d399" }}>e</span>^(
            <span style={{ color: "#f472b6" }}>ix</span>) ·{" "}
            <span style={{ color: "#a78bfa" }}>σ</span>(x) ·{" "}
            <span style={{ color: "#fb923c" }}>ReLU</span>(x){" }"}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16">
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
              σ Activations
            </button>
          </div>

          {/* Hero preview card */}
          <div
            className="max-w-3xl mx-auto rounded-2xl overflow-hidden"
            style={{
              background: "rgba(4,10,24,0.82)",
              border: "1px solid rgba(6,182,212,0.18)",
              boxShadow:
                "0 0 60px rgba(6,182,212,0.1),0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="flex items-center gap-3 px-5 py-3 border-b"
              style={{ borderColor: "rgba(6,182,212,0.1)" }}
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
                className="font-mono-code text-xs"
                style={{ color: "#334155" }}
              >
                f(x) = sin(x)·cos(2x) + e^(-x²/4)
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                  style={{ background: "#22d3ee" }}
                />
                <span
                  className="font-mono-code text-[10px]"
                  style={{ color: "#334155" }}
                >
                  LIVE
                </span>
              </div>
            </div>
            <div className="p-4">
              <AnimatedSine />
            </div>
            <div className="px-4 pb-4 grid grid-cols-3 gap-3">
              {[
                {
                  label: "Gaussian",
                  content: <GaussianPreview />,
                  color: "#10b981",
                },
                {
                  label: "Euler Spiral",
                  content: <EulerSpiralPreview />,
                  color: "#a78bfa",
                },
                {
                  label: "Activations",
                  content: <ActivationPreview />,
                  color: "#fb923c",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-3"
                  style={{
                    background: isDark ? "rgba(6,18,40,0.6)" : "rgba(255,255,255,0.88)",
                    border: `1px solid ${item.color}20`,
                  }}
                >
                  {item.content}
                  <p
                    className="font-mono-code text-[10px] text-center mt-1.5"
                    style={{ color: item.color, opacity: 0.6 }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        <div className="nova-divider mb-12" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="text-center p-6 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(4,10,24,0.7)",
                border: `1px solid ${s.color}25`,
                boxShadow: `0 0 0px ${s.color}00`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 24px ${s.color}20`;
                e.currentTarget.style.borderColor = `${s.color}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0px ${s.color}00`;
                e.currentTarget.style.borderColor = `${s.color}25`;
              }}
            >
              <div
                className="font-orbitron font-black text-3xl sm:text-4xl mb-1"
                style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}
              >
                {s.num}
              </div>
              <div
                className="font-mono-code text-xs"
                style={{ color: "#475569" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="nova-divider mb-12" />
        <div className="text-center mb-10">
          <div
            className="section-label justify-center mb-3"
            style={{ letterSpacing: "0.3em" }}
          >
            Workflow
          </div>
          <h2
            className="font-orbitron font-bold text-2xl sm:text-3xl mb-3"
            style={{ color: "#34d399" }}
          >
            How It Works
          </h2>
          <p className="font-rajdhani text-lg" style={{ color: "#475569" }}>
            From equation to insight in three steps
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.step}
              className="relative p-6 rounded-2xl text-center"
              style={{
                background: "rgba(4,10,24,0.75)",
                border: `1px solid ${step.color}25`,
              }}
            >
              {i < HOW_IT_WORKS.length - 1 && (
                <div
                  className="hidden sm:block absolute top-1/2 -right-3 z-10 font-mono text-xs"
                  style={{
                    color: "rgba(71,85,105,0.5)",
                    transform: "translateY(-50%)",
                  }}
                >
                  →
                </div>
              )}
              <div
                className="font-orbitron font-black text-4xl mb-3"
                style={{ color: `${step.color}30` }}
              >
                {step.step}
              </div>
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: `${step.color}12`,
                  border: `1px solid ${step.color}30`,
                }}
              >
                <span style={{ color: step.color, fontSize: "1.1rem" }}>
                  {i === 0 ? "⊞" : i === 1 ? "f(x)" : "⟳"}
                </span>
              </div>
              <h3
                className="font-orbitron font-bold text-sm mb-2"
                style={{ color: step.color }}
              >
                {step.title}
              </h3>
              <p
                className="font-rajdhani text-sm leading-relaxed"
                style={{ color: "#64748b" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="nova-divider mb-12" />
        <div className="text-center mb-12">
          <div
            className="section-label justify-center mb-3"
            style={{ letterSpacing: "0.3em" }}
          >
            Features
          </div>
          <h2
            className="font-orbitron font-bold text-2xl sm:text-3xl mb-3 text-glow-cyan"
            style={{ color: "#22d3ee" }}
          >
            Explore the Platform
          </h2>
          <p className="font-rajdhani text-lg" style={{ color: "#475569" }}>
            Powerful tools for mathematical visualization and exploration
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card-nova p-6 sm:p-8 cursor-pointer"
              style={{
                border: `1.5px solid ${hoveredFeature === f.title ? f.borderColor : f.color + "22"}`,
                boxShadow:
                  hoveredFeature === f.title
                    ? `0 0 32px ${f.glowColor}, inset 0 0 24px ${f.color}06`
                    : `0 0 0px transparent`,
                transition:
                  "border-color 0.25s, box-shadow 0.25s, transform 0.2s",
                transform:
                  hoveredFeature === f.title ? "translateY(-3px)" : "none",
                background:
                  hoveredFeature === f.title
                    ? `${f.bgColor}`
                    : "rgba(4,10,24,0.75)",
              }}
              onMouseEnter={() => setHoveredFeature(f.title)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg,transparent,${f.color}${hoveredFeature === f.title ? "80" : "40"},transparent)`,
                }}
              />

              {/* NEW badge */}
              {f.badge && (
                <div className="absolute top-3 right-3">
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
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
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
                    className="font-orbitron font-bold text-sm sm:text-base mb-1"
                    style={{ color: f.color }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="font-rajdhani text-sm leading-relaxed"
                    style={{ color: "#64748b" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {f.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span style={{ color: f.color, fontSize: "0.55rem" }}>
                      ◆
                    </span>
                    <span
                      className="font-mono-code text-xs"
                      style={{ color: "#475569" }}
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
          ))}
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="nova-divider mb-10" />
        <div className="text-center mb-6">
          <h3
            className="font-orbitron font-bold text-base"
            style={{ color: "#334155" }}
          >
            Built With
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {TECH_STACK.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
              style={{
                background: "rgba(4,10,24,0.8)",
                border: "1px solid rgba(6,182,212,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${t.color}40`;
                e.currentTarget.style.boxShadow = `0 0 12px ${t.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(6,182,212,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
              />
              <span
                className="font-mono-code text-xs"
                style={{ color: t.color }}
              >
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="border-t px-4 sm:px-8 py-12"
        style={{
          borderColor: "rgba(6,182,212,0.1)",
          background: "rgba(2,5,14,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mb-10">
            {/* Brand */}
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
                className="font-mono-code text-xs mb-4"
                style={{ color: "#334155" }}
              >
                Scientific Visualization Platform v3.0
              </div>
              {/* Links */}
              <div className="flex flex-col gap-2">
                <a
                  href="https://nova-mathplot.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <span style={{ color: "#334155", fontSize: "0.65rem" }}>
                    🌐
                  </span>
                  <span
                    className="font-mono-code text-xs transition-colors"
                    style={{ color: "#475569" }}
                    onMouseEnter={(e) => (e.target.style.color = "#22d3ee")}
                    onMouseLeave={(e) => (e.target.style.color = "#475569")}
                  >
                    nova-mathplot.vercel.app
                  </span>
                </a>
                <a
                  href="https://github.com/Hafiz-Sakib/nova-mathplot"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <span style={{ color: "#334155", fontSize: "0.65rem" }}>
                    ⌥
                  </span>
                  <span
                    className="font-mono-code text-xs transition-colors"
                    style={{ color: "#475569" }}
                    onMouseEnter={(e) => (e.target.style.color = "#a78bfa")}
                    onMouseLeave={(e) => (e.target.style.color = "#475569")}
                  >
                    github.com/Hafiz-Sakib/nova-mathplot
                  </span>
                </a>
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div className="flex flex-col gap-2">
                <span
                  className="font-orbitron text-[10px] tracking-widest uppercase mb-1"
                  style={{ color: "#1e293b" }}
                >
                  Pages
                </span>
                {[
                  ["Home", "home"],
                  ["2D Plotter", "plotter2d"],
                  ["3D Plotter", "plotter3d"],
                ].map(([l, p]) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="font-rajdhani text-sm text-left transition-colors"
                    style={{ color: "#475569" }}
                    onMouseEnter={(e) => (e.target.style.color = "#22d3ee")}
                    onMouseLeave={(e) => (e.target.style.color = "#475569")}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="font-orbitron text-[10px] tracking-widest uppercase mb-1"
                  style={{ color: "#1e293b" }}
                >
                  Tools
                </span>
                {[
                  ["Complex", "complex"],
                  ["Parametric", "parametric"],
                  ["Activations", "activation"],
                ].map(([l, p]) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="font-rajdhani text-sm text-left transition-colors"
                    style={{
                      color: p === "activation" ? "#a78bfa" : "#475569",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#22d3ee")}
                    onMouseLeave={(e) =>
                      (e.target.style.color =
                        p === "activation" ? "#a78bfa" : "#475569")
                    }
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="font-orbitron text-[10px] tracking-widest uppercase mb-1"
                  style={{ color: "#1e293b" }}
                >
                  Info
                </span>
                <button
                  onClick={() => setPage("developer")}
                  className="font-rajdhani text-sm text-left transition-colors"
                  style={{ color: "#475569" }}
                  onMouseEnter={(e) => (e.target.style.color = "#f472b6")}
                  onMouseLeave={(e) => (e.target.style.color = "#475569")}
                >
                  Developer
                </button>
              </div>
            </div>
          </div>

          <div className="nova-divider mb-6" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div
              className="font-mono-code text-xs"
              style={{ color: "#1e293b" }}
            >
              Powered by{" "}
              {["mathjs", "recharts", "Three.js", "React Three Fiber"].map(
                (t, i) => (
                  <span key={t}>
                    <span style={{ color: "#22d3ee" }}>{t}</span>
                    {i < 3 && <span style={{ color: "#1e293b" }}> · </span>}
                  </span>
                ),
              )}
            </div>
            <div
              className="font-mono-code text-xs"
              style={{ color: "#1e293b" }}
            >
              Built by{" "}
              <button
                onClick={() => setPage("developer")}
                className="transition-colors"
                style={{ color: "#475569" }}
                onMouseEnter={(e) => (e.target.style.color = "#f472b6")}
                onMouseLeave={(e) => (e.target.style.color = "#475569")}
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
