import React, { useState, useRef, useEffect } from "react";

const TAU = 2 * Math.PI;

const COLOR_SCHEMES = [
  { id: "cyan", name: "Cyan", color: "#22d3ee" },
  { id: "violet", name: "Violet", color: "#a78bfa" },
  { id: "emerald", name: "Emerald", color: "#34d399" },
  { id: "orange", name: "Orange", color: "#fb923c" },
  { id: "pink", name: "Pink", color: "#f472b6" },
  { id: "gold", name: "Gold", color: "#fbbf24" },
];

const EXAMPLES = [
  // Basic
  {
    label: "Circle",
    category: "Basic",
    formula: "x=cos(t), y=sin(t)",
    xfn: (t) => Math.cos(t),
    yfn: (t) => Math.sin(t),
    tMax: TAU,
    color: "#22d3ee",
  },
  {
    label: "Ellipse",
    category: "Basic",
    formula: "x=2cos(t), y=sin(t)",
    xfn: (t) => 2 * Math.cos(t),
    yfn: (t) => Math.sin(t),
    tMax: TAU,
    color: "#34d399",
  },

  // Lissajous
  {
    label: "Lissajous (3:2)",
    category: "Lissajous",
    formula: "x=cos(3t), y=sin(2t)",
    xfn: (t) => Math.cos(3 * t),
    yfn: (t) => Math.sin(2 * t),
    tMax: TAU,
    color: "#a78bfa",
  },
  {
    label: "Lissajous (5:4)",
    category: "Lissajous",
    formula: "x=cos(5t), y=sin(4t)",
    xfn: (t) => Math.cos(5 * t),
    yfn: (t) => Math.sin(4 * t),
    tMax: TAU,
    color: "#f472b6",
  },

  // Fourier
  {
    label: "Square Wave",
    category: "Fourier",
    formula: "y=(4/π)Σ sin((2k+1)t)/(2k+1)",
    xfn: (t) => t / Math.PI - 1,
    yfn: (t) =>
      (4 / Math.PI) * (Math.sin(t) + Math.sin(3 * t) / 3 + Math.sin(5 * t) / 5),
    tMax: TAU * 2,
    color: "#fb923c",
  },

  // Laplace
  {
    label: "Damped Oscillator",
    category: "Laplace",
    formula: "x=e^(-0.2t)cos(3t)",
    xfn: (t) => Math.exp(-0.2 * t) * Math.cos(3 * t),
    yfn: (t) => Math.exp(-0.2 * t) * Math.sin(3 * t),
    tMax: 15,
    color: "#f59e0b",
  },

  // Polar
  {
    label: "Rose (3 petals)",
    category: "Polar",
    formula: "r=cos(3θ)",
    xfn: (t) => Math.cos(3 * t) * Math.cos(t),
    yfn: (t) => Math.cos(3 * t) * Math.sin(t),
    tMax: Math.PI,
    color: "#fbbf24",
  },
  {
    label: "Cardioid",
    category: "Polar",
    formula: "r=1-cos(θ)",
    xfn: (t) => (1 - Math.cos(t)) * Math.cos(t) * 0.9,
    yfn: (t) => (1 - Math.cos(t)) * Math.sin(t) * 0.9,
    tMax: TAU,
    color: "#f472b6",
  },

  // Special & Spirals
  {
    label: "Butterfly Curve",
    category: "Special",
    formula: "Complex Butterfly",
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
    color: "#a78bfa",
  },
  {
    label: "Archimedean Spiral",
    category: "Spiral",
    formula: "r=θ",
    xfn: (t) => t * Math.cos(t) * 0.13,
    yfn: (t) => t * Math.sin(t) * 0.13,
    tMax: 8 * TAU,
    color: "#4ade80",
  },
];

function ParametricCanvas({ example, animated, speed, showAxes, zoom, color }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !example) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let W = canvas.offsetWidth * dpr;
    let H = canvas.offsetHeight * dpr;
    canvas.width = W;
    canvas.height = H;

    const N = 1600;
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
    let scale = Math.min(W / rangeX, H / rangeY) * 0.48 * zoom;

    const toSX = (x) => mx + (x - (minX + maxX) / 2) * scale;
    const toSY = (y) => my - (y - (minY + maxY) / 2) * scale;

    const draw = (progress) => {
      ctx.clearRect(0, 0, W, H);

      if (showAxes) {
        ctx.strokeStyle = "rgba(6,182,212,0.08)";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < W; i += W / 10) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, H);
          ctx.stroke();
        }
        for (let i = 0; i < H; i += H / 10) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(W, i);
          ctx.stroke();
        }
      }

      const count = Math.floor(pts.length * progress);
      if (count < 2) return;

      ctx.lineWidth = 2.8 * dpr;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(toSX(pts[0][0]), toSY(pts[0][1]));
      for (let i = 1; i < count; i++) {
        ctx.lineTo(toSX(pts[i][0]), toSY(pts[i][1]));
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    if (animated) {
      progressRef.current = 0;
      const animate = () => {
        progressRef.current = Math.min(1, progressRef.current + speed * 0.003);
        draw(progressRef.current);
        if (progressRef.current < 1)
          animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw(1);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [example, animated, speed, showAxes, zoom, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl"
      style={{ background: "#020810", display: "block" }}
    />
  );
}

export default function ParametricPage() {
  const [selected, setSelected] = useState(EXAMPLES[0]);
  const [animated, setAnimated] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showAxes, setShowAxes] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [colorScheme, setColorScheme] = useState("cyan");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentColor =
    COLOR_SCHEMES.find((c) => c.id === colorScheme)?.color || "#22d3ee";

  const categories = [...new Set(EXAMPLES.map((e) => e.category))];

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 flex flex-col border-r transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "linear-gradient(180deg,#020810,#100802)",
          borderColor: "rgba(139,92,246,0.15)",
        }}
      >
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          <h1 className="font-orbitron text-lg tracking-widest text-[#a78bfa]">
            PARAMETRIC PLOTTER
          </h1>
        </div>

        {/* Color Picker */}
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          <div className="text-xs text-slate-400 mb-2">COLOR</div>
          <div className="flex flex-wrap gap-2">
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setColorScheme(scheme.id)}
                className={`w-9 h-9 rounded-2xl border-2 transition-all ${colorScheme === scheme.id ? "border-white scale-110" : "border-transparent"}`}
                style={{ background: scheme.color }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div
          className="p-4 space-y-4 border-b"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          {[
            { label: "Animate", value: animated, set: setAnimated },
            { label: "Show Axes", value: showAxes, set: setShowAxes },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => item.set(!item.value)}
            >
              <span>{item.label}</span>
              <div
                className={`w-11 h-6 rounded-full relative transition-colors ${item.value ? "bg-emerald-500" : "bg-gray-700"}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${item.value ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </div>
            </div>
          ))}

          <div>
            <label className="text-xs text-slate-400 block mb-1">Speed</label>
            <input
              type="range"
              min="0.2"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
              className="w-full accent-violet-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Zoom: {zoom.toFixed(1)}x
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(0.3, z * 0.75))}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl"
              >
                -
              </button>
              <button
                onClick={() => setZoom(1)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs"
              >
                RESET
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(5, z * 1.35))}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="flex-1 overflow-y-auto p-4">
          {categories.map((cat) => (
            <div key={cat} className="mb-6">
              <div className="text-orange-400 text-xs font-bold tracking-widest mb-2 pl-1">
                {cat}
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

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div
          className="border-b px-4 py-3 flex items-center justify-between bg-[#02060f]"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: currentColor }}
            />
            <span className="font-medium text-white">{selected.label}</span>
          </div>
          <button
            onClick={() => setAnimated(!animated)}
            className="px-5 py-2 rounded-xl text-sm font-medium"
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
            color={currentColor}
          />
        </div>
      </main>
    </div>
  );
}
