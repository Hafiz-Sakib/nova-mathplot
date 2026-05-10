import React, { useEffect, useRef, useState } from "react";

/* ─── Animated SVG Previews ─── */
function AnimatedSine({ color = "#22d3ee", color2 = "#10b981" }) {
  return (
    <svg viewBox="0 0 280 80" className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sG1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="30%" stopColor={color} stopOpacity="1" />
          <stop offset="70%" stopColor={color2} stopOpacity="1" />
          <stop offset="100%" stopColor={color2} stopOpacity="0" />
        </linearGradient>
        <filter id="glow1">
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
        stroke="url(#sG1)"
        strokeWidth="2.2"
        filter="url(#glow1)"
        style={{
          strokeDasharray: 800,
          animation: "dash-anim 4s linear infinite",
        }}
      />
      <path
        d="M0,40 C14,40 21,10 35,10 C49,10 56,70 70,70 C84,70 91,10 105,10 C119,10 126,70 140,70 C154,70 161,10 175,10 C189,10 196,70 210,70 C224,70 231,10 245,10 C259,10 266,40 280,40"
        fill="none"
        stroke={color}
        strokeWidth="5"
        opacity="0.08"
      />
    </svg>
  );
}

function GaussianPreview() {
  const pts = [],
    fill = [];
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
        <linearGradient id="gaussG" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <filter id="gaussGlow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={f} fill="url(#gaussG)" />
      <path
        d={d}
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
        filter="url(#gaussGlow)"
      />
    </svg>
  );
}

function SpiralPreview() {
  const pts = [];
  for (let t = 0; t < 5 * Math.PI; t += 0.07) {
    const r = t * 9;
    const x = 140 + r * Math.cos(t);
    const y = 40 + r * Math.sin(t) * 0.6;
    if (x > 5 && x < 275 && y > 5 && y < 75) pts.push([x, y]);
  }
  const d = pts
    .map(
      (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg viewBox="0 0 280 80" className="w-full">
      <defs>
        <linearGradient id="spG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="1" />
        </linearGradient>
        <filter id="spGlow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#spG)"
        strokeWidth="1.8"
        filter="url(#spGlow)"
      />
    </svg>
  );
}

/* ─── Particle Canvas ─── */
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

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.6 ? 188 : Math.random() > 0.5 ? 160 : 270,
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
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
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

/* ─── Feature card data ─── */
const FEATURES = [
  {
    icon: "📈",
    title: "2D Function Plotter",
    color: "#22d3ee",
    bgColor: "rgba(6,182,212,0.08)",
    borderColor: "rgba(6,182,212,0.2)",
    desc: "Plot any mathematical expression — trig, polynomial, exponential, and more. Multi-function overlay, zoom & pan, animated waves.",
    items: [
      "50+ example functions",
      "Multi-curve overlay",
      "Zoom & pan",
      "Animated waveforms",
    ],
    page: "plotter2d",
    cta: "Launch 2D Plotter",
  },
  {
    icon: "🌌",
    title: "3D Surface Visualizer",
    color: "#a78bfa",
    bgColor: "rgba(139,92,246,0.08)",
    borderColor: "rgba(139,92,246,0.2)",
    desc: "Immersive 3D graphing with orbit controls, cinematic animations, helix, torus, Möbius strip, and GPU-accelerated rendering.",
    items: [
      "Orbit camera controls",
      "17+ 3D presets",
      "Animated surfaces",
      "Custom functions",
    ],
    page: "plotter3d",
    cta: "Launch 3D Plotter",
  },
  {
    icon: "ℂ",
    title: "Complex Analysis",
    color: "#f472b6",
    bgColor: "rgba(236,72,153,0.08)",
    borderColor: "rgba(236,72,153,0.2)",
    desc: "Euler's formula e^(ix) = cos(x) + i·sin(x), complex spirals, phase visualization, and Riemann-style surfaces.",
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
    bgColor: "rgba(249,115,22,0.08)",
    borderColor: "rgba(249,115,22,0.2)",
    desc: "Lissajous curves, Fourier series, rose curves, epitrochoids, parametric spirals, and polar equations.",
    items: [
      "Lissajous figures",
      "Fourier harmonics",
      "Polar equations",
      "Beat frequencies",
    ],
    page: "plotter2d",
    cta: "Try Examples",
  },
];

const TECH_STACK = [
  { name: "React 18", color: "#61dafb" },
  { name: "Three.js", color: "#ffffff" },
  { name: "React Three Fiber", color: "#f97316" },
  { name: "Math.js", color: "#22d3ee" },
  { name: "Recharts", color: "#10b981" },
  { name: "Framer Motion", color: "#ec4899" },
];

const STATS = [
  { num: "50+", label: "Example Functions", color: "#22d3ee" },
  { num: "17", label: "3D Presets", color: "#a78bfa" },
  { num: "∞", label: "Plot Precision", color: "#10b981" },
  { num: "100%", label: "Browser-Based", color: "#fb923c" },
];

export default function HomePage({ setPage }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 50);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="flex-1 overflow-y-auto nova-bg">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
        {/* Grid background */}
        <div className="absolute inset-0 nova-grid opacity-60" />
        {/* Particles */}
        <div className="absolute inset-0">
          <ParticleField />
        </div>
        {/* Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)",
            animation: "float 12s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              animation: "heroFadeIn 0.6s ease forwards",
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

          {/* Title */}
          <h1
            className="font-orbitron font-black mb-4 leading-none"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              background:
                "linear-gradient(135deg, #22d3ee 0%, #34d399 35%, #a78bfa 65%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "heroFadeIn 0.7s 0.1s ease both",
            }}
          >
            NOVA
          </h1>
          <h2
            className="font-orbitron font-bold mb-6"
            style={{
              fontSize: "clamp(1rem, 3vw, 1.5rem)",
              color: "#475569",
              letterSpacing: "0.3em",
              animation: "heroFadeIn 0.7s 0.2s ease both",
            }}
          >
            MATHPLOT PLATFORM
          </h2>

          <p
            className="font-rajdhani text-xl sm:text-2xl font-light mb-4 max-w-3xl mx-auto"
            style={{
              color: "#94a3b8",
              animation: "heroFadeIn 0.7s 0.3s ease both",
            }}
          >
            2D plotting · 3D visualization · complex analysis · animated
            rendering
          </p>
          <p
            className="font-mono-code text-sm max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{
              color: "#334155",
              animation: "heroFadeIn 0.7s 0.4s ease both",
            }}
          >
            {"{ "}
            <span style={{ color: "#22d3ee" }}>sin</span>(x) ·{" "}
            <span style={{ color: "#34d399" }}>e</span>^(
            <span style={{ color: "#f472b6" }}>ix</span>) ·{" "}
            <span style={{ color: "#a78bfa" }}>∑</span> Fourier ·{" "}
            <span style={{ color: "#fb923c" }}>∇²</span>f(x,y,z){" }"}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
            style={{ animation: "heroFadeIn 0.7s 0.5s ease both" }}
          >
            <button
              onClick={() => setPage("plotter2d")}
              className="btn-primary text-base px-8 py-3"
            >
              <span>Launch 2D Plotter</span>
              <span style={{ fontSize: "1.1em" }}>→</span>
            </button>
            <button
              onClick={() => setPage("plotter3d")}
              className="btn-secondary text-base px-8 py-3"
            >
              <span>🌌 3D Visualizer</span>
            </button>
            <button
              onClick={() => setPage("complex")}
              className="btn-accent text-base px-6 py-3"
            >
              <span>ℂ Complex Analysis</span>
            </button>
          </div>

          {/* Live Graph Preview */}
          <div
            className="max-w-3xl mx-auto rounded-2xl overflow-hidden"
            style={{
              background: "rgba(4,10,24,0.8)",
              border: "1px solid rgba(6,182,212,0.18)",
              boxShadow:
                "0 0 60px rgba(6,182,212,0.1), 0 30px 60px rgba(0,0,0,0.5)",
              animation: "heroFadeIn 0.7s 0.6s ease both",
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
                  content: <AnimatedSine color="#a78bfa" color2="#f472b6" />,
                  color: "#a78bfa",
                },
                {
                  label: "Parametric",
                  content: <SpiralPreview />,
                  color: "#fb923c",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-3"
                  style={{
                    background: "rgba(6,18,40,0.6)",
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

      {/* ─── STATS ─── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        <div className="nova-divider mb-12" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="text-center p-6 rounded-2xl"
              style={{
                background: "rgba(4,10,24,0.7)",
                border: `1px solid ${s.color}20`,
              }}
            >
              <div
                className="font-orbitron font-black text-3xl mb-1"
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

      {/* ─── FEATURES ─── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="section-label justify-center mb-3 text-center"
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

        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card-nova p-8">
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${f.color}50, transparent)`,
                }}
              />
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
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
                    className="font-orbitron font-bold text-base mb-1"
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
                    <span style={{ color: f.color, fontSize: "0.6rem" }}>
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
                className="w-full py-2.5 rounded-xl font-space-grotesk font-semibold text-sm transition-all duration-200"
                style={{
                  background: f.bgColor,
                  border: `1px solid ${f.borderColor}`,
                  color: f.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 20px ${f.color}25`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {f.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="nova-divider mb-12" />
        <div className="text-center mb-8">
          <h3
            className="font-orbitron font-bold text-lg mb-2"
            style={{ color: "#334155" }}
          >
            Built With
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {TECH_STACK.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "rgba(4,10,24,0.8)",
                border: "1px solid rgba(6,182,212,0.1)",
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

      {/* ─── FOOTER ─── */}
      <footer
        className="border-t px-4 sm:px-8 py-10"
        style={{
          borderColor: "rgba(6,182,212,0.1)",
          background: "rgba(2,5,14,0.7)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <div
                className="font-orbitron font-black text-lg tracking-widest mb-1"
                style={{
                  background: "linear-gradient(90deg, #22d3ee, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NOVA MathPlot
              </div>
              <div
                className="font-mono-code text-xs"
                style={{ color: "#334155" }}
              >
                Scientific Visualization Platform
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                ["Home", "home"],
                ["2D Plotter", "plotter2d"],
                ["3D Plotter", "plotter3d"],
                ["Complex", "complex"],
              ].map(([l, p]) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="font-rajdhani text-sm hover:text-cyan-400 transition-colors"
                  style={{ color: "#475569" }}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { label: "GitHub", icon: "⌥" },
                { label: "Docs", icon: "📚" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: "rgba(6,18,40,0.8)",
                    border: "1px solid rgba(6,182,212,0.12)",
                    color: "#475569",
                  }}
                >
                  <span className="text-sm">{s.icon}</span>
                  <span className="font-mono-code text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="nova-divider mb-6" />
          <div
            className="text-center font-mono-code text-xs"
            style={{ color: "#1e293b" }}
          >
            Powered by{" "}
            {["mathjs", "recharts", "Three.js", "React Three Fiber"].map(
              (t, i) => (
                <span key={t}>
                  <span style={{ color: "#22d3ee" }}>{t}</span>
                  {i < 3 ? <span style={{ color: "#1e293b" }}> · </span> : ""}
                </span>
              ),
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}
