import React, { useState, useRef, useEffect } from "react";

const TAU = 2 * Math.PI;

const EXAMPLES = [
  // ==================== BASIC ====================
  {
    label: "Circle",
    category: "Basic",
    formula: "x = cos(t), y = sin(t)",
    desc: "Unit circle",
    xfn: (t) => Math.cos(t),
    yfn: (t) => Math.sin(t),
    tMax: TAU,
    color: "#22d3ee",
  },
  {
    label: "Ellipse",
    category: "Basic",
    formula: "x = 2cos(t), y = sin(t)",
    desc: "Stretched circle",
    xfn: (t) => 2 * Math.cos(t),
    yfn: (t) => Math.sin(t),
    tMax: TAU,
    color: "#34d399",
  },

  // ==================== LISSAJOUS ====================
  {
    label: "Lissajous (3:2)",
    category: "Lissajous",
    formula: "x = cos(3t), y = sin(2t)",
    desc: "Classic 3:2 ratio",
    xfn: (t) => Math.cos(3 * t),
    yfn: (t) => Math.sin(2 * t),
    tMax: TAU,
    color: "#a78bfa",
  },
  {
    label: "Lissajous (5:4)",
    category: "Lissajous",
    formula: "x = cos(5t), y = sin(4t)",
    desc: "Complex harmonic pattern",
    xfn: (t) => Math.cos(5 * t),
    yfn: (t) => Math.sin(4 * t),
    tMax: TAU,
    color: "#f472b6",
  },
  {
    label: "Lissajous (5:3)",
    category: "Lissajous",
    formula: "x = cos(5t), y = sin(3t)",
    desc: "Intricate knot pattern",
    xfn: (t) => Math.cos(5 * t),
    yfn: (t) => Math.sin(3 * t),
    tMax: TAU,
    color: "#60a5fa",
  },

  // ==================== FOURIER ====================
  {
    label: "Square Wave",
    category: "Fourier",
    formula: "y = (4/π) Σ sin((2k+1)t)/(2k+1)",
    desc: "Fourier series of square wave",
    xfn: (t) => t / Math.PI - 1,
    yfn: (t) =>
      (4 / Math.PI) * (Math.sin(t) + Math.sin(3 * t) / 3 + Math.sin(5 * t) / 5),
    tMax: TAU * 2,
    color: "#fb923c",
  },
  {
    label: "Sawtooth Wave",
    category: "Fourier",
    formula: "y ≈ Σ sin(kt)/k",
    desc: "Fourier approximation",
    xfn: (t) => t / Math.PI - 1,
    yfn: (t) =>
      (2 / Math.PI) * (Math.sin(t) + Math.sin(2 * t) / 2 + Math.sin(3 * t) / 3),
    tMax: TAU * 2,
    color: "#4ade80",
  },

  // ==================== LAPLACE / DAMPED ====================
  {
    label: "Damped Oscillator",
    category: "Laplace",
    formula: "x = e^(-0.2t) cos(3t)",
    desc: "Underdamped system",
    xfn: (t) => Math.exp(-0.2 * t) * Math.cos(3 * t),
    yfn: (t) => Math.exp(-0.2 * t) * Math.sin(3 * t),
    tMax: 15,
    color: "#f59e0b",
  },
  {
    label: "Critically Damped",
    category: "Laplace",
    formula: "x = (1 + t)e^(-t)",
    desc: "Fastest return to equilibrium",
    xfn: (t) => (1 + t) * Math.exp(-t),
    yfn: (t) => (1 + 0.5 * t) * Math.exp(-t * 1.1),
    tMax: 12,
    color: "#eab308",
  },
  {
    label: "Overdamped",
    category: "Laplace",
    formula: "x = e^(-0.5t) - e^(-2t)",
    desc: "Slow return without oscillation",
    xfn: (t) => Math.exp(-0.5 * t) - Math.exp(-2 * t),
    yfn: (t) => Math.exp(-0.4 * t) - Math.exp(-1.8 * t),
    tMax: 12,
    color: "#f43f5e",
  },

  // ==================== POLAR / ROSE ====================
  {
    label: "Rose (3 petals)",
    category: "Polar",
    formula: "r = cos(3θ)",
    desc: "Three-petaled rose",
    xfn: (t) => Math.cos(3 * t) * Math.cos(t),
    yfn: (t) => Math.cos(3 * t) * Math.sin(t),
    tMax: Math.PI,
    color: "#fbbf24",
  },
  {
    label: "Rose (5 petals)",
    category: "Polar",
    formula: "r = cos(5θ)",
    desc: "Five-petaled rose",
    xfn: (t) => Math.cos(5 * t) * Math.cos(t),
    yfn: (t) => Math.cos(5 * t) * Math.sin(t),
    tMax: Math.PI,
    color: "#c084fc",
  },
  {
    label: "Cardioid",
    category: "Polar",
    formula: "r = 1 - cos(θ)",
    desc: "Heart curve",
    xfn: (t) => (1 - Math.cos(t)) * Math.cos(t) * 0.9,
    yfn: (t) => (1 - Math.cos(t)) * Math.sin(t) * 0.9,
    tMax: TAU,
    color: "#f472b6",
  },

  // ==================== SPECIAL ====================
  {
    label: "Butterfly Curve",
    category: "Special",
    formula: "Complex exponential curve",
    desc: "One of the most beautiful",
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
    tMax: 12 * Math.PI,
    color: "#a78bfa",
  },
  {
    label: "Astroid",
    category: "Special",
    formula: "x³ + y³ = a³",
    desc: "Hypocycloid with 4 cusps",
    xfn: (t) => Math.pow(Math.cos(t), 3),
    yfn: (t) => Math.pow(Math.sin(t), 3),
    tMax: TAU,
    color: "#22d3ee",
  },
  {
    label: "Lemniscate of Bernoulli",
    category: "Special",
    formula: "r² = a² cos(2θ)",
    desc: "Figure-eight curve",
    xfn: (t) => Math.cos(2 * t) * Math.cos(t) * 1.2,
    yfn: (t) => Math.cos(2 * t) * Math.sin(t) * 1.2,
    tMax: TAU / 2,
    color: "#34d399",
  },

  // ==================== SPIRALS ====================
  {
    label: "Archimedean Spiral",
    category: "Spiral",
    formula: "r = θ",
    desc: "Linear spiral",
    xfn: (t) => t * Math.cos(t) * 0.13,
    yfn: (t) => t * Math.sin(t) * 0.13,
    tMax: 8 * Math.PI,
    color: "#4ade80",
  },
  {
    label: "Logarithmic Spiral",
    category: "Spiral",
    formula: "r = e^(0.15θ)",
    desc: "Golden spiral",
    xfn: (t) => Math.exp(0.15 * t) * Math.cos(t) * 0.1,
    yfn: (t) => Math.exp(0.15 * t) * Math.sin(t) * 0.1,
    tMax: 6 * Math.PI,
    color: "#fb923c",
  },
];

function ParametricCanvas({ example, animated, speed, showAxes, zoom }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !example) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth * dpr;
    const H = canvas.offsetHeight * dpr;
    canvas.width = W;
    canvas.height = H;

    const N = 1800;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * example.tMax;
      const x = example.xfn(t);
      const y = example.yfn(t);
      if (isFinite(x) && isFinite(y)) pts.push([x, y]);
    }

    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs),
      maxX = Math.max(...xs);
    const minY = Math.min(...ys),
      maxY = Math.max(...ys);
    const rangeX = maxX - minX || 2;
    const rangeY = maxY - minY || 2;
    const mx = W / 2,
      my = H / 2;
    const scale = Math.min(W / rangeX, H / rangeY) * 0.48 * zoom;
    const cx = (minX + maxX) / 2,
      cy = (minY + maxY) / 2;

    const toSX = (x) => mx + (x - cx) * scale;
    const toSY = (y) => my - (y - cy) * scale;

    const draw = (progress) => {
      ctx.clearRect(0, 0, W, H);

      if (showAxes) {
        ctx.strokeStyle = "rgba(6,182,212,0.08)";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < W; i += W / 12) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, H);
          ctx.stroke();
        }
        for (let i = 0; i < H; i += H / 12) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(W, i);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(6,182,212,0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mx, 0);
        ctx.lineTo(mx, H);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, my);
        ctx.lineTo(W, my);
        ctx.stroke();
      }

      const count = Math.floor(pts.length * progress);
      if (count < 2) return;

      ctx.lineWidth = 2.8 * dpr;
      ctx.strokeStyle = example.color;
      ctx.shadowColor = example.color;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(toSX(pts[0][0]), toSY(pts[0][1]));
      for (let i = 1; i < count; i++) {
        ctx.lineTo(toSX(pts[i][0]), toSY(pts[i][1]));
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (animated && count < pts.length) {
        const p = pts[count - 1];
        ctx.beginPath();
        ctx.arc(toSX(p[0]), toSY(p[1]), 5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = example.color;
        ctx.shadowBlur = 18;
        ctx.fill();
      }
    };

    if (animated) {
      progressRef.current = 0;
      const animate = () => {
        progressRef.current = Math.min(1, progressRef.current + speed * 0.003);
        draw(progressRef.current);
        if (progressRef.current < 1)
          animRef.current = requestAnimationFrame(animate);
      };
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw(1);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [example, animated, speed, showAxes, zoom]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl"
      style={{ display: "block", background: "#020810" }}
    />
  );
}

export default function ParametricPage() {
  const [selected, setSelected] = useState(EXAMPLES[0]);
  const [animated, setAnimated] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showAxes, setShowAxes] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [...new Set(EXAMPLES.map((e) => e.category))];

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto w-80 xl:w-96 flex flex-col border-r transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          borderColor: "rgba(249,115,22,0.15)",
          background: "linear-gradient(180deg,#020810,#100802)",
          top: "56px",
          height: "calc(100vh - 56px)",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-4 border-b"
          style={{ borderColor: "rgba(249,115,22,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/30">
              <span className="text-orange-400 text-xl">∞</span>
            </div>
            <div>
              <div className="font-orbitron font-bold text-sm tracking-widest text-orange-400">
                PARAMETRIC
              </div>
              <div className="text-[10px] text-slate-400">
                Curves • Fourier • Laplace
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          className="p-4 space-y-5 border-b"
          style={{ borderColor: "rgba(249,115,22,0.08)" }}
        >
          {/* Toggles */}
          {[
            { label: "Animate", value: animated, setter: setAnimated },
            { label: "Show Axes", value: showAxes, setter: setShowAxes },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => item.setter(!item.value)}
            >
              <span className="text-sm">{item.label}</span>
              <div
                className={`w-11 h-6 rounded-full relative ${item.value ? "bg-orange-500" : "bg-gray-700"}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${item.value ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </div>
            </div>
          ))}

          {/* Speed & Zoom */}
          {animated && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Speed</label>
              <input
                type="range"
                min="0.2"
                max="5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(+e.target.value)}
                className="w-full accent-orange-400"
              />
              <div className="text-right text-xs text-slate-400">
                {speed.toFixed(1)}x
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1">Zoom</label>
            <div className="flex gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(0.3, z * 0.75))}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm"
              >
                -
              </button>
              <button
                onClick={() => setZoom(1)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(5, z * 1.35))}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Examples List */}
        <div className="flex-1 overflow-y-auto p-4">
          {categories.map((cat) => (
            <div key={cat} className="mb-6">
              <div className="text-orange-400 text-xs font-bold tracking-widest mb-2 pl-1">
                {cat.toUpperCase()}
              </div>
              {EXAMPLES.filter((e) => e.category === cat).map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setSelected(ex)}
                  className={`w-full text-left p-3 rounded-2xl mb-2 transition-all ${selected.label === ex.label ? "bg-orange-500/10 border border-orange-500/30" : "hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: ex.color }}
                    />
                    <span
                      className={`font-medium ${selected.label === ex.label ? "text-orange-300" : "text-slate-200"}`}
                    >
                      {ex.label}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1 pl-5">
                    {ex.formula}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div
          className="border-b px-4 py-3 flex items-center justify-between bg-[#02060f]"
          style={{ borderColor: "rgba(249,115,22,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: selected.color }}
            />
            <div>
              <div className="font-medium text-orange-300">
                {selected.label}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {selected.formula}
              </div>
            </div>
          </div>

          <button
            onClick={() => setAnimated(!animated)}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: animated ? "#f59e0b" : "#334155",
              color: animated ? "#000" : "#fff",
            }}
          >
            {animated ? "PAUSE" : "PLAY"}
          </button>
        </div>

        <div className="flex-1 p-3 sm:p-6" style={{ background: "#020810" }}>
          <ParametricCanvas
            example={selected}
            animated={animated}
            speed={speed}
            showAxes={showAxes}
            zoom={zoom}
          />
        </div>
      </main>
    </div>
  );
}
