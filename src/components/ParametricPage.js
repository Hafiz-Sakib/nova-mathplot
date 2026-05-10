import React, { useState, useMemo, useRef, useEffect } from "react";

const TAU = 2 * Math.PI;

const EXAMPLES = [
  {
    label: "Lissajous (3:2)",
    category: "Lissajous",
    desc: "Classic pattern from coupled oscillators",
    xfn: (t) => Math.cos(3 * t),
    yfn: (t) => Math.sin(2 * t),
    tMax: TAU,
    color: "#22d3ee",
  },
  {
    label: "Lissajous (5:4)",
    category: "Lissajous",
    desc: "Higher harmonic Lissajous figure",
    xfn: (t) => Math.cos(5 * t),
    yfn: (t) => Math.sin(4 * t),
    tMax: TAU,
    color: "#34d399",
  },
  {
    label: "Circle",
    category: "Basic",
    desc: "x=cos(t), y=sin(t)",
    xfn: (t) => Math.cos(t),
    yfn: (t) => Math.sin(t),
    tMax: TAU,
    color: "#a78bfa",
  },
  {
    label: "Ellipse",
    category: "Basic",
    desc: "x=2cos(t), y=sin(t)",
    xfn: (t) => 2 * Math.cos(t),
    yfn: (t) => Math.sin(t),
    tMax: TAU,
    color: "#f472b6",
  },
  {
    label: "Butterfly",
    category: "Special",
    desc: "Famous butterfly curve",
    xfn: (t) =>
      Math.sin(t) *
      (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.sin(t / 12) ** 5),
    yfn: (t) =>
      Math.cos(t) *
      (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.sin(t / 12) ** 5),
    tMax: 12 * Math.PI,
    color: "#fb923c",
  },
  {
    label: "Rose (4 petals)",
    category: "Polar",
    desc: "r=cos(2θ)",
    xfn: (t) => Math.cos(2 * t) * Math.cos(t),
    yfn: (t) => Math.cos(2 * t) * Math.sin(t),
    tMax: TAU,
    color: "#f472b6",
  },
  {
    label: "Rose (3 petals)",
    category: "Polar",
    desc: "r=cos(3θ)",
    xfn: (t) => Math.cos(3 * t) * Math.cos(t),
    yfn: (t) => Math.cos(3 * t) * Math.sin(t),
    tMax: Math.PI,
    color: "#a78bfa",
  },
  {
    label: "Epitrochoid",
    category: "Roulette",
    desc: "Circle rolling outside another circle",
    xfn: (t) => (3 + 1) * Math.cos(t) - 1 * Math.cos((3 + 1) * t),
    yfn: (t) => (3 + 1) * Math.sin(t) - 1 * Math.sin((3 + 1) * t),
    tMax: TAU,
    color: "#22d3ee",
  },
  {
    label: "Hypotrochoid",
    category: "Roulette",
    desc: "Circle rolling inside another circle",
    xfn: (t) => (3 - 1) * Math.cos(t) + 0.5 * Math.cos((3 - 1) * t),
    yfn: (t) => (3 - 1) * Math.sin(t) - 0.5 * Math.sin((3 - 1) * t),
    tMax: TAU,
    color: "#34d399",
  },
  {
    label: "Archimedean Spiral",
    category: "Spiral",
    desc: "r=θ",
    xfn: (t) => t * Math.cos(t) * 0.15,
    yfn: (t) => t * Math.sin(t) * 0.15,
    tMax: 8 * Math.PI,
    color: "#fbbf24",
  },
  {
    label: "Logarithmic Spiral",
    category: "Spiral",
    desc: "r=e^(0.1θ)",
    xfn: (t) => Math.exp(0.1 * t) * Math.cos(t) * 0.15,
    yfn: (t) => Math.exp(0.1 * t) * Math.sin(t) * 0.15,
    tMax: 6 * Math.PI,
    color: "#fb923c",
  },
  {
    label: "Fourier Approx (Sq)",
    category: "Fourier",
    desc: "Square wave: sum of odd harmonics",
    xfn: (t) => t / Math.PI - 1,
    yfn: (t) =>
      (4 / Math.PI) *
      (Math.sin(t) +
        Math.sin(3 * t) / 3 +
        Math.sin(5 * t) / 5 +
        Math.sin(7 * t) / 7 +
        Math.sin(9 * t) / 9 +
        Math.sin(11 * t) / 11),
    tMax: TAU,
    color: "#22d3ee",
  },
  {
    label: "Triskelion",
    category: "Special",
    desc: "3-fold rotational symmetry",
    xfn: (t) => Math.cos(t + TAU / 3) * Math.cos(3 * t) * 1.5,
    yfn: (t) => Math.sin(t) * Math.cos(3 * t) * 1.5,
    tMax: TAU,
    color: "#a78bfa",
  },
  {
    label: "Maclaurin Trisectrix",
    category: "Special",
    desc: "Classic cubic curve",
    xfn: (t) => 3 * Math.cos(t) - Math.cos(3 * t),
    yfn: (t) => 3 * Math.sin(t) - Math.sin(3 * t),
    tMax: TAU * 2,
    color: "#f472b6",
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
    const W = canvas.offsetWidth * window.devicePixelRatio || 600;
    const H = canvas.offsetHeight * window.devicePixelRatio || 400;
    canvas.width = W;
    canvas.height = H;

    const N = 1200;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * example.tMax;
      const x = example.xfn(t),
        y = example.yfn(t);
      if (isFinite(x) && isFinite(y)) pts.push([x, y]);
    }

    const xs = pts.map((p) => p[0]),
      ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs),
      maxX = Math.max(...xs);
    const minY = Math.min(...ys),
      maxY = Math.max(...ys);
    const rangeX = maxX - minX || 2,
      rangeY = maxY - minY || 2;
    const mx = W / 2,
      my = H / 2;
    const scale = Math.min(W / rangeX, H / rangeY) * 0.42 * zoom;
    const cx = (minX + maxX) / 2,
      cy = (minY + maxY) / 2;
    const toSX = (x) => mx + (x - cx) * scale;
    const toSY = (y) => my - (y - cy) * scale;

    const draw = (progress) => {
      ctx.clearRect(0, 0, W, H);
      // Background grid
      if (showAxes) {
        ctx.strokeStyle = "rgba(6,182,212,0.06)";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < W; i += W / 8) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, H);
          ctx.stroke();
        }
        for (let i = 0; i < H; i += H / 8) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(W, i);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(6,182,212,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mx, 0);
        ctx.lineTo(mx, H);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, my);
        ctx.lineTo(W, my);
        ctx.stroke();
      }
      // Curve
      const count = Math.floor(pts.length * progress);
      if (count < 2) return;
      ctx.lineWidth = 2 * window.devicePixelRatio;
      for (let i = 1; i < count; i++) {
        const t = i / pts.length;
        const hue = (t * 360 + 180) % 360;
        ctx.strokeStyle = example.color;
        ctx.shadowColor = example.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(toSX(pts[i - 1][0]), toSY(pts[i - 1][1]));
        ctx.lineTo(toSX(pts[i][0]), toSY(pts[i][1]));
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      // Moving dot
      if (animated && count < pts.length) {
        const p = pts[count - 1];
        ctx.beginPath();
        ctx.arc(toSX(p[0]), toSY(p[1]), 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = example.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    if (animated) {
      progressRef.current = 0;
      const animate = () => {
        progressRef.current = Math.min(1, progressRef.current + speed * 0.003);
        draw(progressRef.current);
        if (progressRef.current < 1)
          animRef.current = requestAnimationFrame(animate);
        else animRef.current = null;
      };
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw(1);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [example, animated, speed, showAxes, zoom]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="lg:hidden fixed bottom-6 left-4 z-50 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg,rgba(249,115,22,0.3),rgba(251,146,60,0.2))",
          border: "1px solid rgba(249,115,22,0.45)",
          boxShadow: "0 0 20px rgba(249,115,22,0.3)",
        }}
      >
        <span style={{ color: "#fb923c", fontSize: "1.1rem" }}>☰</span>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto w-72 xl:w-80 flex flex-col border-r transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          borderColor: "rgba(249,115,22,0.15)",
          background: "linear-gradient(180deg,#020810,#100802)",
          top: "56px",
          height: "calc(100vh - 56px)",
        }}
      >
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(249,115,22,0.5),rgba(251,146,60,0.3),transparent)",
          }}
        />

        <div
          className="px-4 py-4 border-b"
          style={{ borderColor: "rgba(249,115,22,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(249,115,22,0.1)",
                border: "1px solid rgba(249,115,22,0.3)",
              }}
            >
              <span style={{ color: "#fb923c", fontSize: "0.9rem" }}>∑</span>
            </div>
            <div>
              <div
                className="font-orbitron font-bold text-xs tracking-widest"
                style={{ color: "#fb923c" }}
              >
                PARAMETRIC & POLAR
              </div>
              <div
                className="font-mono-code text-[9px]"
                style={{ color: "#334155" }}
              >
                Curves & Patterns
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-4 flex flex-col gap-4 border-b"
          style={{ borderColor: "rgba(249,115,22,0.08)" }}
        >
          <div>
            <div className="section-label">Options</div>
            {[
              { label: "Animate Drawing", value: animated, set: setAnimated },
              { label: "Show Axes", value: showAxes, set: setShowAxes },
            ].map((opt) => (
              <div
                key={opt.label}
                className="flex items-center gap-3 py-1.5 cursor-pointer"
                onClick={() => opt.set((v) => !v)}
              >
                <div
                  className={`toggle-track-nova ${opt.value ? "on" : ""}`}
                  style={
                    opt.value
                      ? {
                          background: "rgba(249,115,22,0.2)",
                          borderColor: "rgba(249,115,22,0.5)",
                        }
                      : {}
                  }
                >
                  <div
                    className="toggle-thumb-nova"
                    style={opt.value ? { background: "#fb923c" } : {}}
                  />
                </div>
                <span
                  className="font-mono-code text-xs"
                  style={{ color: opt.value ? "#fb923c" : "#475569" }}
                >
                  {opt.label}
                </span>
              </div>
            ))}
          </div>

          {animated && (
            <div>
              <div className="section-label">Animation Speed</div>
              <input
                type="range"
                min="0.2"
                max="5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(+e.target.value)}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(90deg, rgba(249,115,22,0.7) ${(speed / 5) * 100}%, rgba(6,18,40,0.8) ${(speed / 5) * 100}%)`,
                }}
              />
              <div
                className="font-mono-code text-[9px] mt-1"
                style={{ color: "#334155" }}
              >
                Speed: {speed.toFixed(1)}x
              </div>
            </div>
          )}

          <div>
            <div className="section-label">Zoom</div>
            <div className="flex items-center gap-2">
              <button
                className="zoom-btn"
                onClick={() => setZoom((z) => Math.min(z * 1.4, 5))}
              >
                +
              </button>
              <button
                className="zoom-btn"
                onClick={() => setZoom((z) => Math.max(z / 1.4, 0.3))}
              >
                −
              </button>
              <button
                className="zoom-btn text-[10px]"
                onClick={() => setZoom(1)}
                style={{ width: 34 }}
              >
                RST
              </button>
              <span
                className="font-mono-code text-[10px]"
                style={{ color: "#334155" }}
              >
                {zoom.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Current curve info */}
          {selected && (
            <div
              className="rounded-xl p-3"
              style={{
                background: "rgba(249,115,22,0.06)",
                border: "1px solid rgba(249,115,22,0.15)",
              }}
            >
              <div
                className="font-orbitron text-xs font-bold mb-1"
                style={{ color: "#fb923c" }}
              >
                {selected.label}
              </div>
              <div
                className="font-mono-code text-[10px]"
                style={{ color: "#64748b" }}
              >
                x(t), y(t) ∈ [{selected.category}]
              </div>
              <div
                className="font-rajdhani text-sm mt-1"
                style={{ color: "#475569" }}
              >
                {selected.desc}
              </div>
            </div>
          )}
        </div>

        {/* Curve list by category */}
        <div className="p-4">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <div
                className="section-label mb-2"
                style={{ color: "rgba(249,115,22,0.6)" }}
              >
                {cat}
              </div>
              {EXAMPLES.filter((e) => e.category === cat).map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setSelected(ex)}
                  className="w-full text-left px-3 py-2 rounded-xl mb-1 flex items-center gap-2 transition-all"
                  style={{
                    background:
                      selected.label === ex.label
                        ? "rgba(249,115,22,0.1)"
                        : "transparent",
                    border: `1px solid ${selected.label === ex.label ? "rgba(249,115,22,0.35)" : "rgba(249,115,22,0.07)"}`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: ex.color }}
                  />
                  <span
                    className="font-rajdhani text-sm"
                    style={{
                      color:
                        selected.label === ex.label ? "#fb923c" : "#64748b",
                    }}
                  >
                    {ex.label}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <main className="flex flex-col flex-1 overflow-hidden min-w-0">
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b flex-wrap gap-2"
          style={{
            borderColor: "rgba(249,115,22,0.1)",
            background: "rgba(2,4,16,0.8)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: selected?.color ?? "#fb923c" }}
            />
            <span
              className="font-orbitron text-xs font-bold"
              style={{ color: "#fb923c" }}
            >
              {selected?.label}
            </span>
            <span
              className="font-mono-code text-[10px] hidden sm:block"
              style={{ color: "#334155" }}
            >
              t ∈ [0, {(selected?.tMax / Math.PI).toFixed(2)}π]
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="zoom-btn"
              onClick={() => setZoom((z) => Math.min(z * 1.4, 5))}
            >
              +
            </button>
            <button
              className="zoom-btn"
              onClick={() => setZoom((z) => Math.max(z / 1.4, 0.3))}
            >
              −
            </button>
            <button
              className="zoom-btn text-[10px]"
              onClick={() => setZoom(1)}
              style={{ width: 34 }}
            >
              RST
            </button>
            <button
              className="zoom-btn ml-1"
              onClick={() => setAnimated((a) => !a)}
              style={{
                width: 38,
                color: animated ? "#fb923c" : "#475569",
                fontSize: "0.65rem",
              }}
            >
              {animated ? "STOP" : "PLAY"}
            </button>
          </div>
        </div>

        <div
          className="flex-1 p-3 sm:p-4 overflow-hidden"
          style={{ minHeight: 0 }}
        >
          {/* Mobile curve selector */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setSelected(ex)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg font-mono-code text-[10px]"
                style={{
                  background:
                    selected.label === ex.label
                      ? "rgba(249,115,22,0.12)"
                      : "rgba(6,18,40,0.8)",
                  border: `1px solid ${selected.label === ex.label ? "rgba(249,115,22,0.4)" : "rgba(249,115,22,0.12)"}`,
                  color: selected.label === ex.label ? "#fb923c" : "#64748b",
                }}
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div
            className="h-full graph-container"
            style={{ borderColor: "rgba(249,115,22,0.12)" }}
          >
            {selected && (
              <ParametricCanvas
                key={`${selected.label}-${animated}-${speed}`}
                example={selected}
                animated={animated}
                speed={speed}
                showAxes={showAxes}
                zoom={zoom}
              />
            )}
          </div>
        </div>

        {/* Info row */}
        <div
          className="px-4 py-2 border-t flex flex-wrap gap-4"
          style={{
            borderColor: "rgba(249,115,22,0.08)",
            background: "rgba(2,4,16,0.8)",
          }}
        >
          {[
            ["Equation", "x(t), y(t) parametric", "#fb923c"],
            ["Category", selected?.category, "#fbbf24"],
            ["Rendering", "Canvas 2D", "#34d399"],
          ].map(([l, v, c]) => (
            <span
              key={l}
              className="font-mono-code text-[10px] flex items-center gap-1.5"
              style={{ color: "#334155" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: c }}
              />
              {l}: <span style={{ color: c }}>{v}</span>
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
