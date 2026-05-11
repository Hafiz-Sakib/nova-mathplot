import React, { useState, useRef, useEffect, useMemo } from "react";

/* ─────────────────────────────────────────────
   ACTIVATION FUNCTION DEFINITIONS
───────────────────────────────────────────── */
const ALPHA = 0.01; // Leaky ReLU default
const ELU_A = 1.0;
const SELU_LAMBDA = 1.0507;
const SELU_ALPHA = 1.6733;

const ACTIVATIONS = [
  {
    id: "linear",
    name: "Linear",
    formula: "f(x) = x",
    latexHint: "f(x)=x",
    color: "#22d3ee",
    group: "Basic",
    desc: "Identity mapping. Output equals input. Used in regression output layers.",
    fn: (x) => x,
    derivative: (x) => 1,
  },
  {
    id: "binary_step",
    name: "Binary Step",
    formula: "f(x) = 1 if x≥0, else 0",
    latexHint: "f(x)=\\begin{cases}1&x\\ge0\\\\0&x<0\\end{cases}",
    color: "#f472b6",
    group: "Basic",
    desc: "Hard threshold at zero. Not differentiable; rarely used in modern networks.",
    fn: (x) => (x >= 0 ? 1 : 0),
    derivative: (x) => 0,
  },
  {
    id: "sigmoid",
    name: "Sigmoid",
    formula: "f(x) = 1 / (1 + e⁻ˣ)",
    latexHint: "f(x)=\\frac{1}{1+e^{-x}}",
    color: "#34d399",
    group: "Classic",
    desc: "Squashes output to (0,1). Classic choice for binary classification outputs.",
    fn: (x) => 1 / (1 + Math.exp(-x)),
    derivative: (x) => {
      const s = 1 / (1 + Math.exp(-x));
      return s * (1 - s);
    },
  },
  {
    id: "tanh",
    name: "Tanh",
    formula: "f(x) = tanh(x)",
    latexHint: "f(x)=\\tanh(x)",
    color: "#a78bfa",
    group: "Classic",
    desc: "Zero-centered version of Sigmoid. Output range (−1,1). Preferred over Sigmoid in hidden layers.",
    fn: (x) => Math.tanh(x),
    derivative: (x) => 1 - Math.tanh(x) ** 2,
  },
  {
    id: "relu",
    name: "ReLU",
    formula: "f(x) = max(0, x)",
    latexHint: "f(x)=\\max(0,x)",
    color: "#fb923c",
    group: "ReLU Family",
    desc: "Most widely used activation. Sparse, fast, but suffers from dying neuron problem.",
    fn: (x) => Math.max(0, x),
    derivative: (x) => (x > 0 ? 1 : 0),
  },
  {
    id: "leaky_relu",
    name: "Leaky ReLU",
    formula: "f(x) = max(αx, x), α=0.01",
    latexHint: "f(x)=\\max(\\alpha x,x)",
    color: "#fbbf24",
    group: "ReLU Family",
    desc: "Fixes dying ReLU by allowing a small negative slope α for x < 0.",
    fn: (x) => (x >= 0 ? x : ALPHA * x),
    derivative: (x) => (x > 0 ? 1 : ALPHA),
  },
  {
    id: "prelu",
    name: "PReLU",
    formula: "f(x) = max(ax, x), a learned",
    latexHint: "f(x)=\\max(ax,x)",
    color: "#f97316",
    group: "ReLU Family",
    desc: "Parametric ReLU — the negative slope a is learned during training.",
    fn: (x, a = 0.25) => (x >= 0 ? x : a * x),
    derivative: (x, a = 0.25) => (x > 0 ? 1 : a),
  },
  {
    id: "elu",
    name: "ELU",
    formula: "f(x) = x if x>0, else α(eˣ−1)",
    latexHint: "f(x)=\\begin{cases}x&x>0\\\\\\alpha(e^x-1)&x\\le0\\end{cases}",
    color: "#e879f9",
    group: "ReLU Family",
    desc: "Exponential Linear Unit. Smooth, negative saturation. Faster convergence than ReLU.",
    fn: (x) => (x > 0 ? x : ELU_A * (Math.exp(x) - 1)),
    derivative: (x) => (x > 0 ? 1 : ELU_A * Math.exp(x)),
  },
  {
    id: "selu",
    name: "SELU",
    formula: "f(x) = λ·x if x>0, else λα(eˣ−1)",
    latexHint:
      "f(x)=\\lambda\\begin{cases}x&x>0\\\\\\alpha(e^x-1)&x\\le0\\end{cases}",
    color: "#c084fc",
    group: "ReLU Family",
    desc: "Self-normalizing. Keeps activations near zero mean and unit variance without BatchNorm.",
    fn: (x) =>
      x > 0 ? SELU_LAMBDA * x : SELU_LAMBDA * SELU_ALPHA * (Math.exp(x) - 1),
    derivative: (x) =>
      x > 0 ? SELU_LAMBDA : SELU_LAMBDA * SELU_ALPHA * Math.exp(x),
  },
  {
    id: "softplus",
    name: "Softplus",
    formula: "f(x) = ln(1 + eˣ)",
    latexHint: "f(x)=\\ln(1+e^x)",
    color: "#67e8f9",
    group: "Smooth",
    desc: "Smooth approximation of ReLU. Differentiable everywhere; output always positive.",
    fn: (x) => Math.log(1 + Math.exp(Math.min(x, 80))),
    derivative: (x) => 1 / (1 + Math.exp(-x)),
  },
  {
    id: "softsign",
    name: "Softsign",
    formula: "f(x) = x / (1 + |x|)",
    latexHint: "f(x)=\\frac{x}{1+|x|}",
    color: "#86efac",
    group: "Smooth",
    desc: "Similar to Tanh but converges more slowly to ±1, keeping more gradient signal.",
    fn: (x) => x / (1 + Math.abs(x)),
    derivative: (x) => 1 / (1 + Math.abs(x)) ** 2,
  },
  {
    id: "swish",
    name: "Swish",
    formula: "f(x) = x·σ(x)",
    latexHint: "f(x)=x\\sigma(x)",
    color: "#818cf8",
    group: "Modern",
    desc: "Google's self-gated activation. Outperforms ReLU on deep networks. Non-monotonic.",
    fn: (x) => x * (1 / (1 + Math.exp(-x))),
    derivative: (x) => {
      const sig = 1 / (1 + Math.exp(-x));
      return sig + x * sig * (1 - sig);
    },
  },
  {
    id: "mish",
    name: "Mish",
    formula: "f(x) = x·tanh(ln(1+eˣ))",
    latexHint: "f(x)=x\\tanh(\\ln(1+e^x))",
    color: "#f0abfc",
    group: "Modern",
    desc: "Smooth, non-monotonic. Used in YOLOv4. Outperforms Swish in many vision tasks.",
    fn: (x) => x * Math.tanh(Math.log(1 + Math.exp(Math.min(x, 80)))),
    derivative: (x) => {
      const ex = Math.exp(Math.min(x, 80));
      const sp = Math.log(1 + ex);
      const th = Math.tanh(sp);
      const sech2 = 1 - th * th;
      return th + x * sech2 * (ex / (1 + ex));
    },
  },
  {
    id: "gelu",
    name: "GELU",
    formula: "f(x) = x·Φ(x)",
    latexHint: "f(x)=x\\Phi(x)",
    color: "#7dd3fc",
    group: "Modern",
    desc: "Gaussian Error Linear Unit. Default in BERT, GPT, and most Transformers.",
    fn: (x) =>
      0.5 *
      x *
      (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
    derivative: (x) => {
      const c = Math.sqrt(2 / Math.PI);
      const tanh_val = Math.tanh(c * (x + 0.044715 * x ** 3));
      const sech2 = 1 - tanh_val ** 2;
      return (
        0.5 * (1 + tanh_val) + 0.5 * x * sech2 * c * (1 + 3 * 0.044715 * x ** 2)
      );
    },
  },
  {
    id: "hard_sigmoid",
    name: "Hard Sigmoid",
    formula: "f(x) = max(0, min(1, 0.2x+0.5))",
    latexHint: "f(x)=\\max(0,\\min(1,0.2x+0.5))",
    color: "#fcd34d",
    group: "Efficient",
    desc: "Piecewise-linear approximation of Sigmoid. Faster computation for mobile/edge devices.",
    fn: (x) => Math.max(0, Math.min(1, 0.2 * x + 0.5)),
    derivative: (x) => (x > -2.5 && x < 2.5 ? 0.2 : 0),
  },
  {
    id: "hard_swish",
    name: "Hard Swish",
    formula: "f(x) = x·ReLU6(x+3)/6",
    latexHint: "f(x)=x\\frac{\\mathrm{ReLU6}(x+3)}{6}",
    color: "#fdba74",
    group: "Efficient",
    desc: "Mobile-friendly Swish approximation. Used in MobileNetV3 for edge inference.",
    fn: (x) => x * (Math.min(Math.max(x + 3, 0), 6) / 6),
    derivative: (x) => {
      const relu6 = Math.min(Math.max(x + 3, 0), 6);
      const d_relu6 = x + 3 > 0 && x + 3 < 6 ? 1 : 0;
      return relu6 / 6 + (x * d_relu6) / 6;
    },
  },
  {
    id: "softmax",
    name: "Softmax",
    formula: "fᵢ(x) = eˣⁱ / Σⱼ eˣʲ",
    latexHint: "f_i(x)=\\frac{e^{x_i}}{\\sum_j e^{x_j}}",
    color: "#6ee7b7",
    group: "Output",
    desc: "Multi-class probability distribution. Output sums to 1. Standard for classification heads.",
    fn: (x) => {
      // Visualize as applied to [x, 0, 0] → first component
      const e0 = Math.exp(Math.min(x, 80));
      const e1 = Math.exp(0);
      return e0 / (e0 + e1 + e1);
    },
    derivative: (x) => {
      const e0 = Math.exp(Math.min(x, 80));
      const e1 = 1;
      const sum = e0 + 2 * e1;
      const s = e0 / sum;
      return s * (1 - s);
    },
  },
];

const GROUPS = [
  "Basic",
  "Classic",
  "ReLU Family",
  "Smooth",
  "Modern",
  "Efficient",
  "Output",
];

/* ─────────────────────────────────────────────
   MINI CHART (sidebar sparkline)
───────────────────────────────────────────── */
function Sparkline({ fn, color, showDerivative = false, derivFn }) {
  const W = 80,
    H = 36;
  const xs = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= 60; i++) arr.push(-5 + (i / 60) * 10);
    return arr;
  }, []);

  const points = xs.map((x) => ({ x, y: fn(x) }));
  const dpoints =
    showDerivative && derivFn ? xs.map((x) => ({ x, y: derivFn(x) })) : [];

  const allY = points.map((p) => p.y).concat(dpoints.map((p) => p.y));
  const yMin = Math.max(-3, Math.min(...allY));
  const yMax = Math.min(3, Math.max(...allY));
  const yRange = yMax - yMin || 1;

  const toSVG = (p) => ({
    sx: ((p.x + 5) / 10) * W,
    sy: H - ((p.y - yMin) / yRange) * H,
  });

  const pathStr = (pts) =>
    pts
      .map((p, i) => {
        const { sx, sy } = toSVG(p);
        return `${i === 0 ? "M" : "L"}${sx.toFixed(1)},${Math.max(0, Math.min(H, sy)).toFixed(1)}`;
      })
      .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {/* zero x line */}
      <line
        x1={W / 2}
        y1={0}
        x2={W / 2}
        y2={H}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.5"
      />
      {/* zero y line */}
      {yMin < 0 && yMax > 0 && (
        <line
          x1={0}
          y1={H - ((0 - yMin) / yRange) * H}
          x2={W}
          y2={H - ((0 - yMin) / yRange) * H}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />
      )}
      <path
        d={pathStr(points)}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDerivative && dpoints.length > 0 && (
        <path
          d={pathStr(dpoints)}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="3,2"
          opacity="0.55"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN PLOT CANVAS
───────────────────────────────────────────── */
function MainPlot({ selected, showDerivative, xRange, onXRangeChange }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  // Mouse-wheel zoom: zoom toward cursor x position
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const PAD_L = 48,
        PAD_R = 20;
      const plotW = rect.width - PAD_L - PAD_R;
      // Fraction of plot width where cursor is (0 = left edge, 1 = right)
      const frac = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left - PAD_L) / plotW),
      );

      const [xMin, xMax] = xRange;
      const span = xMax - xMin;
      const ZOOM_FACTOR = e.deltaY > 0 ? 1.15 : 1 / 1.15; // scroll down = zoom out
      const newSpan = Math.min(40, Math.max(1, span * ZOOM_FACTOR));
      const pivot = xMin + frac * span; // x-value under cursor
      const newMin = pivot - frac * newSpan;
      const newMax = pivot + (1 - frac) * newSpan;
      onXRangeChange([newMin, newMax]);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [xRange, onXRangeChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const PAD = { l: 48, r: 20, t: 24, b: 40 };
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;

    const [xMin, xMax] = xRange;
    const yMin = -2.5,
      yMax = 2.5;

    const toCanvasX = (x) => PAD.l + ((x - xMin) / (xMax - xMin)) * plotW;
    const toCanvasY = (y) => PAD.t + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    // Background grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.7;
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(gx), PAD.t);
      ctx.lineTo(toCanvasX(gx), PAD.t + plotH);
      ctx.stroke();
    }
    for (let gy = -2; gy <= 2; gy++) {
      ctx.beginPath();
      ctx.moveTo(PAD.l, toCanvasY(gy));
      ctx.lineTo(PAD.l + plotW, toCanvasY(gy));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.l, toCanvasY(0));
    ctx.lineTo(PAD.l + plotW, toCanvasY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), PAD.t);
    ctx.lineTo(toCanvasX(0), PAD.t + plotH);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "rgba(100,116,139,0.8)";
    ctx.font = "10px 'Space Mono', monospace";
    ctx.textAlign = "right";
    [-2, -1, 0, 1, 2].forEach((v) => {
      ctx.fillText(v, PAD.l - 4, toCanvasY(v) + 3.5);
    });
    ctx.textAlign = "center";
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx += 2) {
      ctx.fillText(gx, toCanvasX(gx), PAD.t + plotH + 14);
    }

    const STEPS = 500;
    selected.forEach((act) => {
      // Main function
      ctx.beginPath();
      let first = true;
      for (let i = 0; i <= STEPS; i++) {
        const x = xMin + (i / STEPS) * (xMax - xMin);
        let y;
        try {
          y = act.fn(x);
        } catch {
          y = 0;
        }
        y = Math.max(yMin - 0.5, Math.min(yMax + 0.5, y));
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);
        if (first) {
          ctx.moveTo(cx, cy);
          first = false;
        } else ctx.lineTo(cx, cy);
      }
      ctx.strokeStyle = act.color;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = act.color;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Derivative
      if (showDerivative && act.derivative) {
        ctx.beginPath();
        first = true;
        for (let i = 0; i <= STEPS; i++) {
          const x = xMin + (i / STEPS) * (xMax - xMin);
          let y;
          try {
            y = act.derivative(x);
          } catch {
            y = 0;
          }
          y = Math.max(yMin - 0.5, Math.min(yMax + 0.5, y));
          const cx = toCanvasX(x);
          const cy = toCanvasY(y);
          if (first) {
            ctx.moveTo(cx, cy);
            first = false;
          } else ctx.lineTo(cx, cy);
        }
        ctx.strokeStyle = act.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 3]);
        ctx.globalAlpha = 0.55;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
    });
  }, [selected, showDerivative, xRange]);

  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", height: "100%", cursor: "crosshair" }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={440}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ActivationPage({ setPage }) {
  const [selectedIds, setSelectedIds] = useState(["relu", "sigmoid", "tanh"]);
  const [showDerivative, setShowDerivative] = useState(false);
  const [xRange, setXRange] = useState([-6, 6]);
  const [activeGroup, setActiveGroup] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);

  const selected = ACTIVATIONS.filter((a) => selectedIds.includes(a.id));

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= 5
          ? [...prev.slice(1), id]
          : [...prev, id],
    );
  };

  const filteredActs =
    activeGroup === "All"
      ? ACTIVATIONS
      : ACTIVATIONS.filter((a) => a.group === activeGroup);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "rgb(2,8,20)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* ── PAGE HEADER ── */}
      <div
        className="relative px-4 sm:px-8 pt-10 pb-8 border-b overflow-hidden"
        style={{ borderColor: "rgba(139,92,246,0.15)" }}
      >
        {/* BG glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {/* breadcrumb */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setPage && setPage("home")}
                className="font-mono text-xs transition-colors"
                style={{ color: "#334155" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#22d3ee")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
              >
                Home
              </button>
              <span style={{ color: "#1e293b" }}>/</span>
              <span className="font-mono text-xs" style={{ color: "#a78bfa" }}>
                Activation Functions
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.2)",
                }}
              >
                σ
              </div>
              <h1
                className="font-orbitron font-black text-2xl sm:text-3xl tracking-wider"
                style={{
                  background:
                    "linear-gradient(90deg, #a78bfa, #c084fc, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Activation Functions
              </h1>
            </div>
            <p className="font-rajdhani text-base" style={{ color: "#475569" }}>
              Interactive reference for 17 neural network activation functions —
              formulas, plots, and derivatives.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowDerivative((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: showDerivative
                  ? "rgba(139,92,246,0.15)"
                  : "rgba(15,23,42,0.8)",
                border: `1px solid ${showDerivative ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.15)"}`,
                color: showDerivative ? "#c084fc" : "#64748b",
              }}
            >
              <span style={{ fontFamily: "serif", fontSize: "0.9rem" }}>
                f′
              </span>
              Show Derivative
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(139,92,246,0.1)",
                color: "#475569",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 flex gap-4 items-start">
        {/* ── SIDEBAR ── */}
        <aside
          className="hidden lg:flex flex-col gap-1 flex-shrink-0 overflow-y-auto"
          style={{
            width: 260,
            maxHeight: "calc(100vh - 160px)",
            position: "sticky",
            top: 80,
          }}
        >
          {/* Group filter */}
          <div
            className="flex flex-wrap gap-1 mb-2 pb-3"
            style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}
          >
            {["All", ...GROUPS].map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className="px-2 py-0.5 rounded text-[10px] font-medium transition-all"
                style={{
                  background:
                    activeGroup === g ? "rgba(139,92,246,0.18)" : "transparent",
                  color: activeGroup === g ? "#c084fc" : "#475569",
                  border: `1px solid ${activeGroup === g ? "rgba(139,92,246,0.35)" : "transparent"}`,
                }}
              >
                {g}
              </button>
            ))}
          </div>

          {filteredActs.map((act) => {
            const isSelected = selectedIds.includes(act.id);
            const isHovered = hoveredId === act.id;
            return (
              <button
                key={act.id}
                onClick={() => toggleSelect(act.id)}
                onMouseEnter={() => setHoveredId(act.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="text-left rounded-xl p-2.5 transition-all duration-200 w-full"
                style={{
                  background: isSelected
                    ? `${act.color}12`
                    : isHovered
                      ? "rgba(255,255,255,0.03)"
                      : "transparent",
                  border: `1px solid ${isSelected ? act.color + "35" : "transparent"}`,
                  outline: "none",
                }}
              >
                <div className="flex items-start gap-2.5">
                  {/* Color dot */}
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 transition-all"
                    style={{
                      background: act.color,
                      boxShadow: isSelected ? `0 0 8px ${act.color}` : "none",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className="font-orbitron font-bold text-xs tracking-wide"
                        style={{ color: isSelected ? act.color : "#64748b" }}
                      >
                        {act.name}
                      </span>
                      {isSelected && (
                        <Sparkline
                          fn={act.fn}
                          color={act.color}
                          showDerivative={showDerivative}
                          derivFn={act.derivative}
                        />
                      )}
                    </div>
                    <div
                      className="font-mono text-[10px] leading-tight truncate"
                      style={{
                        color: isSelected ? act.color + "bb" : "#334155",
                      }}
                    >
                      {act.formula}
                    </div>
                    <div
                      className="text-[9px] mt-0.5 font-mono uppercase tracking-wider"
                      style={{ color: "#1e3a5f" }}
                    >
                      {act.group}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Plot */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(4,10,24,0.9)",
              border: "1px solid rgba(139,92,246,0.15)",
              boxShadow: "0 0 40px rgba(139,92,246,0.06)",
            }}
          >
            {/* Plot header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(139,92,246,0.1)" }}
            >
              <div className="flex items-center gap-3 flex-wrap">
                {selected.length === 0 ? (
                  <span
                    className="font-mono text-xs"
                    style={{ color: "#334155" }}
                  >
                    Select functions from the sidebar →
                  </span>
                ) : (
                  selected.map((a) => (
                    <div key={a.id} className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-0.5 rounded"
                        style={{
                          background: a.color,
                          boxShadow: `0 0 6px ${a.color}`,
                        }}
                      />
                      <span
                        className="font-mono text-xs"
                        style={{ color: a.color }}
                      >
                        {a.name}
                      </span>
                    </div>
                  ))
                )}
                {showDerivative && selected.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-0.5 rounded"
                      style={{
                        background: "rgba(255,255,255,0.3)",
                        borderTop: "1px dashed rgba(255,255,255,0.3)",
                      }}
                    />
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#475569" }}
                    >
                      f′ (dashed)
                    </span>
                  </div>
                )}
              </div>
              {/* Zoom controls */}
              <div className="flex items-center gap-1.5">
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "#334155" }}
                >
                  x: [{xRange[0].toFixed(1)}, {xRange[1].toFixed(1)}]
                </span>
                <button
                  onClick={() => {
                    const [a, b] = xRange;
                    const mid = (a + b) / 2;
                    const half = (b - a) / 2;
                    const newHalf = Math.max(0.5, half / 1.3);
                    setXRange([mid - newHalf, mid + newHalf]);
                  }}
                  title="Zoom In"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    color: "#c084fc",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(139,92,246,0.22)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(139,92,246,0.1)")
                  }
                >
                  +
                </button>
                <button
                  onClick={() => {
                    const [a, b] = xRange;
                    const mid = (a + b) / 2;
                    const half = (b - a) / 2;
                    const newHalf = Math.min(20, half * 1.3);
                    setXRange([mid - newHalf, mid + newHalf]);
                  }}
                  title="Zoom Out"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    color: "#c084fc",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(139,92,246,0.22)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(139,92,246,0.1)")
                  }
                >
                  −
                </button>
                <button
                  onClick={() => setXRange([-6, 6])}
                  title="Reset zoom"
                  className="px-2 h-7 rounded-lg text-[10px] font-mono transition-all"
                  style={{
                    background: "rgba(139,92,246,0.06)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    color: "#475569",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c084fc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#475569")
                  }
                >
                  reset
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div style={{ height: 380, padding: "8px", position: "relative" }}>
              <MainPlot
                selected={selected}
                showDerivative={showDerivative}
                xRange={xRange}
                onXRangeChange={setXRange}
              />
              <div
                className="absolute bottom-3 right-4 font-mono text-[9px] pointer-events-none"
                style={{ color: "rgba(71,85,105,0.6)" }}
              >
                scroll to zoom
              </div>
            </div>
          </div>

          {/* ── SELECTED FUNCTION DETAIL CARDS ── */}
          {selected.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {selected.map((act) => (
                <div
                  key={act.id}
                  className="rounded-xl p-4 relative overflow-hidden"
                  style={{
                    background: "rgba(4,10,24,0.85)",
                    border: `1px solid ${act.color}25`,
                  }}
                >
                  {/* top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg,transparent,${act.color}70,transparent)`,
                    }}
                  />
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: act.color,
                          boxShadow: `0 0 8px ${act.color}`,
                        }}
                      />
                      <span
                        className="font-orbitron font-bold text-sm"
                        style={{ color: act.color }}
                      >
                        {act.name}
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                      style={{
                        background: `${act.color}15`,
                        color: `${act.color}99`,
                        border: `1px solid ${act.color}20`,
                      }}
                    >
                      {act.group}
                    </span>
                  </div>
                  <div
                    className="font-mono text-xs mb-2 p-2 rounded-lg"
                    style={{
                      background: `${act.color}08`,
                      border: `1px solid ${act.color}18`,
                      color: act.color,
                    }}
                  >
                    {act.formula}
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#64748b" }}
                  >
                    {act.desc}
                  </p>
                  <button
                    onClick={() => toggleSelect(act.id)}
                    className="mt-3 text-[10px] font-mono transition-colors"
                    style={{ color: "#475569" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#f87171")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#475569")
                    }
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── MOBILE FUNCTION LIST ── */}
          <div className="lg:hidden">
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(4,10,24,0.9)",
                border: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              <div
                className="font-orbitron text-xs font-bold mb-3"
                style={{ color: "#a78bfa" }}
              >
                Select Functions (tap to toggle)
              </div>
              <div className="flex flex-wrap gap-2">
                {ACTIVATIONS.map((act) => {
                  const isSelected = selectedIds.includes(act.id);
                  return (
                    <button
                      key={act.id}
                      onClick={() => toggleSelect(act.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: isSelected
                          ? `${act.color}18`
                          : "rgba(255,255,255,0.03)",
                        color: isSelected ? act.color : "#475569",
                        border: `1px solid ${isSelected ? act.color + "40" : "rgba(255,255,255,0.05)"}`,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: act.color }}
                      />
                      {act.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── REFERENCE TABLE ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(4,10,24,0.85)",
              border: "1px solid rgba(139,92,246,0.12)",
            }}
          >
            <div
              className="px-5 py-3 border-b flex items-center gap-2"
              style={{ borderColor: "rgba(139,92,246,0.1)" }}
            >
              <span
                className="font-orbitron font-bold text-xs tracking-widest"
                style={{ color: "#a78bfa" }}
              >
                ∑ REFERENCE TABLE
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: "#334155" }}
              >
                — all 17 functions
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}
                  >
                    {[
                      "Function",
                      "Formula",
                      "Group",
                      "Range",
                      "Properties",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 font-mono"
                        style={{ color: "#334155", fontWeight: 600 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ACTIVATIONS.map((act, i) => {
                    const isSelected = selectedIds.includes(act.id);
                    return (
                      <tr
                        key={act.id}
                        onClick={() => toggleSelect(act.id)}
                        className="cursor-pointer transition-all"
                        style={{
                          background: isSelected
                            ? `${act.color}08`
                            : i % 2 === 0
                              ? "transparent"
                              : "rgba(255,255,255,0.01)",
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                        }}
                        onMouseEnter={(e) =>
                          !isSelected &&
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.025)")
                        }
                        onMouseLeave={(e) =>
                          !isSelected &&
                          (e.currentTarget.style.background =
                            i % 2 === 0
                              ? "transparent"
                              : "rgba(255,255,255,0.01)")
                        }
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                background: act.color,
                                boxShadow: isSelected
                                  ? `0 0 6px ${act.color}`
                                  : "none",
                              }}
                            />
                            <span
                              className="font-orbitron font-bold text-[11px]"
                              style={{
                                color: isSelected ? act.color : "#64748b",
                              }}
                            >
                              {act.name}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-4 py-2.5 font-mono text-[11px]"
                          style={{ color: "#475569" }}
                        >
                          {act.formula}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                            style={{
                              background: `${act.color}10`,
                              color: `${act.color}99`,
                            }}
                          >
                            {act.group}
                          </span>
                        </td>
                        <td
                          className="px-4 py-2.5 font-mono text-[11px]"
                          style={{ color: "#334155" }}
                        >
                          {act.id === "relu"
                            ? "[0,∞)"
                            : act.id === "sigmoid" || act.id === "hard_sigmoid"
                              ? "(0,1)"
                              : act.id === "binary_step"
                                ? "{0,1}"
                                : act.id === "tanh"
                                  ? "(-1,1)"
                                  : act.id === "softmax"
                                    ? "(0,1)"
                                    : act.id === "linear" ||
                                        act.id === "leaky_relu" ||
                                        act.id === "prelu"
                                      ? "(-∞,∞)"
                                      : act.id === "elu" || act.id === "selu"
                                        ? "(-α,∞)"
                                        : act.id === "softplus"
                                          ? "(0,∞)"
                                          : act.id === "softsign"
                                            ? "(-1,1)"
                                            : "(-∞,∞)"}
                        </td>
                        <td
                          className="px-4 py-2.5 font-mono text-[11px]"
                          style={{ color: "#334155" }}
                        >
                          {act.id === "relu"
                            ? "Non-neg, non-diff at 0"
                            : act.id === "sigmoid"
                              ? "Saturates, vanish grad"
                              : act.id === "tanh"
                                ? "Zero-centered"
                                : act.id === "leaky_relu"
                                  ? "No dying ReLU"
                                  : act.id === "gelu"
                                    ? "Non-monotonic, smooth"
                                    : act.id === "swish"
                                      ? "Non-monotonic, self-gated"
                                      : act.id === "selu"
                                        ? "Self-normalizing"
                                        : act.id === "softmax"
                                          ? "Multi-class prob"
                                          : act.id === "mish"
                                            ? "Smooth, unbounded above"
                                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
