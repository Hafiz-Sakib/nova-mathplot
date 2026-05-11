import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import * as math from "mathjs";
import { useTheme } from "../ThemeContext";

const POINTS = 600;
const SCOPE = { pi: Math.PI, e: Math.E, tau: 2 * Math.PI };

function evalComplex(expr, x) {
  try {
    const r = math.evaluate(expr, { ...SCOPE, x });
    if (typeof r === "number" && isFinite(r))
      return { re: r, im: 0, mag: Math.abs(r) };
    if (r && typeof r.re === "number") {
      const re = isFinite(r.re) ? r.re : null;
      const im = isFinite(r.im) ? r.im : null;
      const mag =
        re !== null && im !== null ? Math.sqrt(re * re + im * im) : null;
      return { re, im, mag };
    }
    return null;
  } catch {
    return null;
  }
}

const EXAMPLES = [
  // ── Original Examples ─────────────────────────────────────
  {
    label: "Euler's Formula",
    expr: "e^(i*x)",
    desc: "e^(ix) = cos(x) + i·sin(x) — traces a unit circle",
    tag: "🌀",
  },
  {
    label: "Complex Sine",
    expr: "sin(i*x)",
    desc: "sin(ix) = i·sinh(x)",
    tag: "〜",
  },
  {
    label: "Spiral Exp",
    expr: "e^(x + i*x)",
    desc: "Expanding spiral",
    tag: "🌪",
  },
  {
    label: "Damped Spiral",
    expr: "e^(-x) * (cos(x) + i*sin(x))",
    desc: "Decaying oscillation",
    tag: "📉",
  },
  {
    label: "Complex Log",
    expr: "log(x + i*x)",
    desc: "Complex logarithm",
    tag: "ln",
  },
  {
    label: "i^x",
    expr: "(0 + 1i)^x",
    desc: "i raised to real power",
    tag: "𝑖",
  },
  {
    label: "Chirp Signal",
    expr: "e^(i*x*x/4)",
    desc: "Quadratic phase chirp",
    tag: "📡",
  },
  {
    label: "Gaussian Wave",
    expr: "e^(-abs(x)) * cos(3*x) + i * e^(-abs(x)) * sin(3*x)",
    desc: "Gaussian-modulated wave",
    tag: "🔔",
  },
  {
    label: "Zeta-like",
    expr: "1/x^(0.5 + i*x)",
    desc: "Zeta-inspired oscillation",
    tag: "ζ",
  },
  {
    label: "Bessel-like",
    expr: "cos(x - pi/4) / sqrt(x+0.01)",
    desc: "Bessel J approximation",
    tag: "𝐽",
  },
  {
    label: "Fresnel S",
    expr: "sin(x^2 / 2)",
    desc: "Fresnel integral component",
    tag: "∫",
  },
  {
    label: "Modulated",
    expr: "sin(x) * cos(x*x/4 + i*x)",
    desc: "Amplitude-modulated complex wave",
    tag: "📻",
  },

  // ── NEW: 70+ Additional Examples ─────────────────────────────
  // Polynomials & Rational
  { label: "z^2", expr: "x^2", desc: "Simple quadratic", tag: "²" },
  { label: "z^3", expr: "x^3", desc: "Cubic", tag: "³" },
  {
    label: "(z+1)/(z-1)",
    expr: "(x+1)/(x-1)",
    desc: "Möbius transformation",
    tag: "↔",
  },
  {
    label: "z^2 + i*z",
    expr: "x^2 + i*x",
    desc: "Parabola shifted by i",
    tag: "🌀",
  },

  // Exponentials
  {
    label: "e^(i*x^2)",
    expr: "e^(i*x*x)",
    desc: "Quadratic phase spiral",
    tag: "🌌",
  },
  { label: "e^(2i*x)", expr: "e^(2*i*x)", desc: "Faster rotation", tag: "⟳" },
  {
    label: "e^(-0.3*x + 3i*x)",
    expr: "e^(-0.3*x + 3*i*x)",
    desc: "Damped fast spiral",
    tag: "📉",
  },
  { label: "e^(i*x^3)", expr: "e^(i*x*x*x)", desc: "Cubic phase", tag: "∛" },

  // Trigonometric
  {
    label: "cos(x) + i*sin(2x)",
    expr: "cos(x) + i*sin(2*x)",
    desc: "Different frequencies",
    tag: "≈",
  },
  {
    label: "sin(3x) + i*cos(5x)",
    expr: "sin(3*x) + i*cos(5*x)",
    desc: "Lissajous-like in complex",
    tag: "⟐",
  },
  { label: "tan(i*x)", expr: "tan(i*x)", desc: "Complex tangent", tag: "tan" },
  {
    label: "sinh(x) + i*cosh(x)",
    expr: "sinh(x) + i*cosh(x)",
    desc: "Hyperbolic",
    tag: "sinh",
  },

  // Log & Power
  {
    label: "log(1 + i*x)",
    expr: "log(1 + i*x)",
    desc: "Log with imaginary shift",
    tag: "log",
  },
  {
    label: "x^i",
    expr: "x^i",
    desc: "Real base to imaginary power",
    tag: "ˣⁱ",
  },
  { label: "(1 + i)^x", expr: "(1 + i)^x", desc: "Complex base", tag: "¹⁺ⁱ" },
  {
    label: "x^(0.5 + 2i)",
    expr: "x^(0.5 + 2*i)",
    desc: "Fractional + imaginary power",
    tag: "√ⁱ",
  },

  // Special Spirals & Fractal-like
  {
    label: "e^(i*x*log(x+1))",
    expr: "e^(i*x*log(x+1))",
    desc: "Logarithmic spiral modulation",
    tag: "🌀",
  },
  {
    label: "sin(x) * e^(i*x)",
    expr: "sin(x) * e^(i*x)",
    desc: "Amplitude modulated circle",
    tag: "⊙",
  },
  {
    label: "e^(i*e^x)",
    expr: "e^(i*e^x)",
    desc: "Extremely rapid rotation",
    tag: "⚡",
  },

  // Wave Packets & Pulses
  {
    label: "sech(x) * e^(i*4*x)",
    expr: "1/cosh(x) * e^(i*4*x)",
    desc: "Soliton-like wave packet",
    tag: "🌊",
  },
  {
    label: "e^(-x^2) * e^(i*8*x)",
    expr: "e^(-x*x) * e^(i*8*x)",
    desc: "Gaussian wave packet",
    tag: "📦",
  },
  {
    label: "1/(x^2 + 1) * e^(i*x)",
    expr: "1/(x*x+1) * e^(i*x)",
    desc: "Lorentzian modulated",
    tag: "📍",
  },

  // More Trigonometric & Hyperbolic
  { label: "cos(i*x)", expr: "cos(i*x)", desc: "cosh(x)", tag: "cosh" },
  { label: "sin(x + i)", expr: "sin(x + i)", desc: "Shifted sine", tag: "sin" },
  {
    label: "tanh(x + i*x)",
    expr: "tanh(x + i*x)",
    desc: "Complex tanh",
    tag: "tanh",
  },

  // Polynomials with higher degrees
  { label: "z^4 - 1", expr: "x^4 - 1", desc: "Roots of unity", tag: "⁴" },
  { label: "z^5 + i", expr: "x^5 + i", desc: "Quintic", tag: "⁵" },
  {
    label: "(x^2 + 1)^2",
    expr: "(x*x + 1)^2",
    desc: "Squared denominator",
    tag: "□",
  },

  // Rational + Complex
  {
    label: "1/(x - i)",
    expr: "1/(x - i)",
    desc: "Simple pole at i",
    tag: "⚡",
  },
  {
    label: "1/(x^2 + 4)",
    expr: "1/(x*x + 4)",
    desc: "Poles at ±2i",
    tag: "📍",
  },
  {
    label: "(x + i)/(x - i)",
    expr: "(x + i)/(x - i)",
    desc: "Phase shift",
    tag: "φ",
  },

  // Fresnel & Diffraction
  {
    label: "Fresnel C",
    expr: "cos(x*x / 2)",
    desc: "Fresnel cosine integral",
    tag: "C",
  },
  {
    label: "Fresnel Combo",
    expr: "sin(x*x) + i*cos(x*x)",
    desc: "Complex Fresnel",
    tag: "∫∫",
  },

  // More Interesting Ones
  {
    label: "e^(i*x^2 + x)",
    expr: "e^(i*x*x + x)",
    desc: "Chirp with linear growth",
    tag: "📈",
  },
  {
    label: "sin(1/x + i*x)",
    expr: "sin(1/x + i*x)",
    desc: "Near x=0 singularity",
    tag: "⚠",
  },
  {
    label: "x * e^(i*x^2)",
    expr: "x * e^(i*x*x)",
    desc: "Amplitude growing chirp",
    tag: "📊",
  },
  {
    label: "gamma(1 + i*x)",
    expr: "gamma(1 + i*x)",
    desc: "Gamma function on imaginary",
    tag: "Γ",
  },
  {
    label: "zeta(0.5 + i*x)",
    expr: "zeta(0.5 + i*x)",
    desc: "Riemann zeta on critical line",
    tag: "ζ",
  },

  {
    label: "Ai(x) Airy",
    expr: "airyai(x)",
    desc: "Airy function of first kind",
    tag: "Ai",
  },
  {
    label: "Bi(x) Airy",
    expr: "airybi(x)",
    desc: "Airy function of second kind",
    tag: "Bi",
  },

  {
    label: "Bessel J0",
    expr: "besselj(0, x)",
    desc: "Bessel function of first kind",
    tag: "J₀",
  },
  {
    label: "Bessel Y0",
    expr: "bessely(0, x)",
    desc: "Bessel function of second kind",
    tag: "Y₀",
  },

  // Extra Spirals & Rotations
  {
    label: "e^(i*ln(x+2))",
    expr: "e^(i*log(x+2))",
    desc: "Log spiral",
    tag: "🌀",
  },
  { label: "x^(i*2)", expr: "x^(2*i)", desc: "Power spiral", tag: "ˣⁱ" },
  {
    label: "sin(x) + i*x",
    expr: "sin(x) + i*x",
    desc: "Linear imaginary growth",
    tag: "📏",
  },
  {
    label: "cos(x^2) + i*sin(x^2)",
    expr: "cos(x*x) + i*sin(x*x)",
    desc: "Quadratic rotation",
    tag: "⟲",
  },

  // Random Fun Ones
  {
    label: "1/sin(x + i)",
    expr: "1/sin(x + i)",
    desc: "Complex cosecant",
    tag: "csc",
  },
  {
    label: "e^(sin(x) + i*cos(x))",
    expr: "e^(sin(x) + i*cos(x))",
    desc: "Modulated unit circle",
    tag: "🌍",
  },
  {
    label: "x + i*sin(10*x)",
    expr: "x + i*sin(10*x)",
    desc: "Fast oscillation on real line",
    tag: "📈",
  },
  {
    label: "(cos(x) + i*sin(x))^3",
    expr: "(cos(x) + i*sin(x))^3",
    desc: "Triple angle",
    tag: "³",
  },
  {
    label: "e^(i*pi*x)",
    expr: "e^(i*pi*x)",
    desc: "Half-turn per unit",
    tag: "π",
  },

  // Final Batch
  {
    label: "log(x + i)",
    expr: "log(x + i)",
    desc: "Log shifted up",
    tag: "log",
  },
  {
    label: "sqrt(x + i*x)",
    expr: "sqrt(x + i*x)",
    desc: "Complex square root",
    tag: "√",
  },
  {
    label: "sin(x*i + 2)",
    expr: "sin(i*x + 2)",
    desc: "Shifted hyperbolic",
    tag: "〜",
  },
  {
    label: "e^(-abs(x)) * (cos(5*x) + i*sin(7*x))",
    expr: "e^(-abs(x)) * (cos(5*x) + i*sin(7*x))",
    desc: "Asymmetric packet",
    tag: "🌊",
  },
  {
    label: "1/(1 + x^4 + i*x^2)",
    expr: "1/(1 + x*x*x*x + i*x*x)",
    desc: "Complex rational",
    tag: "⚖",
  },
];

/* ─── Argand Diagram (canvas) ─── */
function ArgandDiagram({ data }) {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth || 280;
    const H = canvas.offsetHeight || 180;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    let minRe = -2,
      maxRe = 2,
      minIm = -2,
      maxIm = 2;
    data.forEach((d) => {
      if (d.re != null && d.im != null) {
        if (d.re < minRe) minRe = d.re;
        if (d.re > maxRe) maxRe = d.re;
        if (d.im < minIm) minIm = d.im;
        if (d.im > maxIm) maxIm = d.im;
      }
    });
    const pad = Math.max(maxRe - minRe, maxIm - minIm) * 0.1 + 0.1;
    minRe -= pad;
    maxRe += pad;
    minIm -= pad;
    maxIm += pad;

    const toX = (re) => ((re - minRe) / (maxRe - minRe)) * W;
    const toY = (im) => H - ((im - minIm) / (maxIm - minIm)) * H;

    // Grid
    ctx.strokeStyle = "rgba(6,182,212,0.07)";
    ctx.lineWidth = 0.5;
    for (let i = -8; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(toX(i), 0);
      ctx.lineTo(toX(i), H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, toY(i));
      ctx.lineTo(W, toY(i));
      ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = "rgba(6,182,212,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toX(0), 0);
    ctx.lineTo(toX(0), H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, toY(0));
    ctx.lineTo(W, toY(0));
    ctx.stroke();
    // Labels
    ctx.fillStyle = "rgba(6,182,212,0.4)";
    ctx.font = "9px monospace";
    ctx.fillText("Re →", W - 30, toY(0) - 4);
    ctx.fillText("Im ↑", toX(0) + 4, 12);

    // Curve
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#22d3ee");
    grad.addColorStop(0.5, "#a78bfa");
    grad.addColorStop(1, "#f472b6");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    let first = true;
    data.forEach((d) => {
      if (d.re == null || d.im == null) {
        first = true;
        return;
      }
      const x = toX(d.re),
        y = toY(d.im);
      if (first) {
        ctx.moveTo(x, y);
        first = false;
      } else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // End dot
    const last = data.filter((d) => d.re != null && d.im != null).slice(-1)[0];
    if (last) {
      ctx.beginPath();
      ctx.arc(toX(last.re), toY(last.im), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#f472b6";
      ctx.fill();
    }
  }, [data]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: isDark ? "rgba(4,10,24,0.85)" : "rgba(255,255,255,0.9)",
        border: "1px solid rgba(6,182,212,0.15)",
      }}
    >
      <div
        className="px-3 py-1.5 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(6,182,212,0.1)" }}
      >
        <span
          className="font-orbitron text-[10px] font-bold"
          style={{ color: "#a78bfa" }}
        >
          Argand Diagram
        </span>
        <span
          className="font-mono-code text-[9px]"
          style={{ color: "#334155" }}
        >
          Complex Plane
        </span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "160px" }}
      />
    </div>
  );
}

/* ─── Tooltip ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="nova-tooltip text-xs">
      <div
        className="font-mono-code text-[10px] pb-1 mb-1 border-b"
        style={{ color: "#475569", borderColor: "rgba(6,182,212,0.15)" }}
      >
        x = {Number(label).toFixed(3)}
      </div>
      {payload.map(
        (e) =>
          e.value != null && (
            <div
              key={e.dataKey}
              className="flex gap-2 font-mono-code text-[11px] mt-0.5"
              style={{ color: e.color }}
            >
              <span>{e.name}:</span>
              <span>{e.value.toFixed(4)}</span>
            </div>
          ),
      )}
    </div>
  );
}

/* ─── Zoom button style ─── */
const zoomBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: 7,
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "0.8rem",
  fontWeight: 700,
  background: "rgba(236,72,153,0.1)",
  border: "1px solid rgba(236,72,153,0.25)",
  color: "#f472b6",
  cursor: "pointer",
  transition: "all 0.15s",
  flexShrink: 0,
};

/* ─── Main Component ─── */
export default function ComplexPage() {
  const { isDark } = useTheme();
  /* committed (plotted) expression */
  const [expr, setExpr] = useState("e^(i*x)");
  /* draft expression — only committed on Plot click or Enter */
  const [inputExpr, setInputExpr] = useState("e^(i*x)");

  const [xMin, setXMin] = useState(-2 * Math.PI);
  const [xMax, setXMax] = useState(2 * Math.PI);
  const [showRe, setShowRe] = useState(true);
  const [showIm, setShowIm] = useState(true);
  const [showMag, setShowMag] = useState(true);
  const [internalXMin, setInternalXMin] = useState(-2 * Math.PI);
  const [internalXMax, setInternalXMax] = useState(2 * Math.PI);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ref to the chart wrapper for wheel zoom */
  const chartWrapperRef = useRef(null);

  /* ── commit draft → plotted expr ── */
  const commitExpr = useCallback(() => {
    setExpr(inputExpr);
  }, [inputExpr]);

  /* ── data ── */
  const data = useMemo(() => {
    const step = (internalXMax - internalXMin) / POINTS;
    return Array.from({ length: POINTS + 1 }, (_, i) => {
      const x = internalXMin + i * step;
      const c = evalComplex(expr, x);
      return {
        x: parseFloat(x.toFixed(4)),
        re: c?.re ?? null,
        im: c?.im ?? null,
        mag: c?.mag ?? null,
      };
    });
  }, [expr, internalXMin, internalXMax]);

  /* ── zoom helpers ── */
  const handleZoomIn = useCallback(() => {
    const mid = (internalXMin + internalXMax) / 2;
    const half = (internalXMax - internalXMin) / 4;
    setInternalXMin(mid - half);
    setInternalXMax(mid + half);
  }, [internalXMin, internalXMax]);

  const handleZoomOut = useCallback(() => {
    const mid = (internalXMin + internalXMax) / 2;
    const half = internalXMax - internalXMin;
    setInternalXMin(mid - half);
    setInternalXMax(mid + half);
  }, [internalXMin, internalXMax]);

  const handleZoomReset = useCallback(() => {
    setInternalXMin(xMin);
    setInternalXMax(xMax);
  }, [xMin, xMax]);

  /* ── mouse-wheel zoom on chart ── */
  useEffect(() => {
    const el = chartWrapperRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 0.8 : 1.25; /* scroll up = zoom in */
      const mid = (internalXMin + internalXMax) / 2;
      const halfSpan = ((internalXMax - internalXMin) / 2) * factor;
      setInternalXMin(mid - halfSpan);
      setInternalXMax(mid + halfSpan);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    /* must re-bind when zoom state changes so closure is fresh */
  }, [internalXMin, internalXMax]);

  /* ── load example ── */
  const loadExample = useCallback((ex) => {
    setExpr(ex.expr);
    setInputExpr(ex.expr);
    setSidebarOpen(false);
  }, []);

  /* ══════════════════════════════════════════════════
     SIDEBAR  — defined OUTSIDE render to avoid remount
     State that sidebar needs is passed via props/closure.
     ══════════════════════════════════════════════════ */
  const sidebar = (
    <>
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(236,72,153,0.5),rgba(139,92,246,0.3),transparent)",
        }}
      />

      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "rgba(236,72,153,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(236,72,153,0.1)",
              border: "1px solid rgba(236,72,153,0.3)",
            }}
          >
            <span style={{ color: "#f472b6", fontSize: "1rem" }}>ℂ</span>
          </div>
          <div>
            <div
              className="font-orbitron font-bold text-xs tracking-widest"
              style={{ color: "#f472b6" }}
            >
              COMPLEX ANALYSIS
            </div>
            <div
              className="font-mono-code text-[9px]"
              style={{ color: "#334155" }}
            >
              f: ℝ → ℂ
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-4 flex flex-col gap-4 border-b"
        style={{ borderColor: "rgba(236,72,153,0.08)" }}
      >
        {/* ── Expression Input ── */}
        <div>
          <div
            className="text-xs mb-2 font-medium"
            style={{ color: "#94a3b8" }}
          >
            Expression f(x) → ℂ
          </div>

          {/* Input row */}
          <div
            className="flex items-center rounded-xl overflow-hidden mb-2"
            style={{
              background: isDark
                ? "rgba(10,15,28,0.9)"
                : "rgba(255,255,255,0.95)",
              border: "1px solid rgba(6,182,212,0.25)",
            }}
          >
            <span
              className="font-mono-code text-xs px-3 flex-shrink-0"
              style={{ color: "#f472b6" }}
            >
              f(x)=
            </span>
            <input
              /* KEY FIX: value + onChange only — no autoFocus tricks.
                 The component is now stable (not re-created each render)
                 so focus is never lost between keystrokes.              */
              className="flex-1 bg-transparent outline-none font-mono-code text-sm py-3 pr-3"
              style={{
                color: isDark ? "#e2e8f0" : "#0f172a",
                caretColor: "#22d3ee",
              }}
              value={inputExpr}
              onChange={(e) => setInputExpr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitExpr()}
              placeholder="e^(i*x)"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {/* Plot button */}
          <button
            onClick={commitExpr}
            className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: "linear-gradient(90deg,#f472b6,#a78bfa)",
              color: "#fff",
              fontFamily: "Space Grotesk, sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter = "brightness(1.12)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          >
            Plot →
          </button>

          {/* Tips */}
          <div
            className="mt-2 p-3 rounded-xl text-[10px] font-mono leading-relaxed"
            style={{
              background: isDark
                ? "rgba(15,23,42,0.6)"
                : "rgba(238,244,255,0.88)",
              border: "1px solid rgba(236,72,153,0.15)",
              color: isDark ? "#94a3b8" : "#475569",
            }}
          >
            <span style={{ color: "#f472b6" }}>Tips:</span> Use{" "}
            <code style={{ color: "#22d3ee" }}>i</code> for imaginary ·{" "}
            <code style={{ color: "#22d3ee" }}>e^(i*x)</code> ·{" "}
            <code style={{ color: "#22d3ee" }}>abs()</code> · scroll chart to
            zoom
          </div>
        </div>

        {/* ── Component toggles ── */}
        <div>
          <div className="section-label mb-1">Show Components</div>
          {[
            {
              label: "Re[f(x)] — Real part",
              value: showRe,
              set: setShowRe,
              color: "#22d3ee",
            },
            {
              label: "Im[f(x)] — Imaginary",
              value: showIm,
              set: setShowIm,
              color: "#f472b6",
            },
            {
              label: "|f(x)| — Magnitude",
              value: showMag,
              set: setShowMag,
              color: "#fbbf24",
            },
          ].map((opt) => (
            <div
              key={opt.label}
              className="flex items-center gap-3 py-1.5 cursor-pointer select-none"
              onClick={() => opt.set((v) => !v)}
            >
              <div className={`toggle-track-nova ${opt.value ? "on" : ""}`}>
                <div className="toggle-thumb-nova" />
              </div>
              <span
                className="font-mono-code text-[10px]"
                style={{ color: opt.value ? opt.color : "#475569" }}
              >
                {opt.label}
              </span>
            </div>
          ))}
        </div>

        {/* X Range */}
        <div>
          <div className="text-xs text-slate-400 mb-2 font-medium">X Range</div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["Min", xMin, setXMin],
              ["Max", xMax, setXMax],
            ].map(([label, value, setter]) => (
              <div key={label}>
                <div className="font-mono text-[10px] mb-1.5 text-slate-400">
                  {label}
                </div>
                <input
                  type="number"
                  step="0.5"
                  className="w-full border border-cyan-500/30 focus:border-cyan-400 
                     rounded-xl px-4 py-3 text-sm font-mono 
                     focus:outline-none transition-colors"
                  style={{
                    background: isDark ? "#0a0f1c" : "rgba(255,255,255,0.95)",
                    color: isDark ? "#fff" : "#0f172a",
                  }}
                  value={value}
                  onChange={(e) => {
                    const newVal = +e.target.value;
                    setter(newVal);
                    if (label === "Min") setInternalXMin(newVal);
                    else setInternalXMax(newVal);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Quick Presets */}
          <div className="mt-4">
            <div className="text-xs text-slate-400 mb-2">Quick Presets</div>
            <div className="flex flex-wrap gap-2">
              {[
                ["-π…π", -Math.PI, Math.PI],
                ["-2π…2π", -2 * Math.PI, 2 * Math.PI],
                ["-5…5", -5, 5],
                ["-10…10", -10, 10],
              ].map(([label, minVal, maxVal]) => (
                <button
                  key={label}
                  onClick={() => {
                    setXMin(minVal);
                    setXMax(maxVal);
                    setInternalXMin(minVal);
                    setInternalXMax(maxVal);
                  }}
                  className="font-mono text-xs px-3 py-1.5 rounded-xl transition-all hover:bg-white/10 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Argand Diagram ── */}
        <ArgandDiagram data={data} />
      </div>

      {/* ── Examples list ── */}
      <div className="p-4">
        <div className="section-label mb-2">Examples ({EXAMPLES.length})</div>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => loadExample(ex)}
            className="w-full text-left px-3 py-2 rounded-xl mb-1 transition-all"
            style={{
              background:
                expr === ex.expr ? "rgba(236,72,153,0.08)" : "transparent",
              border: `1px solid ${expr === ex.expr ? "rgba(236,72,153,0.3)" : "rgba(236,72,153,0.07)"}`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm flex-shrink-0">{ex.tag}</span>
              <div className="flex-1 min-w-0">
                <div
                  className="font-mono-code text-xs truncate"
                  style={{ color: expr === ex.expr ? "#f472b6" : "#64748b" }}
                >
                  {ex.label}
                </div>
                <div
                  className="font-mono-code text-[9px] truncate"
                  style={{ color: "#22d3ee", opacity: 0.7 }}
                >
                  {ex.expr}
                </div>
                <div
                  className="font-rajdhani text-[10px] mt-0.5 line-clamp-2"
                  style={{ color: "#334155" }}
                >
                  {ex.desc}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );

  /* ══════ RENDER ══════ */
  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 60px)" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{
            background: isDark ? "rgba(0,0,0,0.7)" : "rgba(30,41,59,0.5)",
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
            "linear-gradient(135deg,rgba(236,72,153,0.3),rgba(139,92,246,0.2))",
          border: "1px solid rgba(236,72,153,0.4)",
          boxShadow: "0 0 20px rgba(236,72,153,0.3)",
        }}
      >
        <span style={{ color: "#f472b6", fontSize: "1.1rem" }}>ℂ</span>
      </button>

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
          flex flex-col border-r overflow-y-auto
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          /* responsive width: full on mobile, fixed on desktop */
          width: "clamp(280px, 85vw, 320px)",
          maxWidth: "100vw",
          borderColor: "rgba(236,72,153,0.15)",
          background: isDark
            ? "linear-gradient(180deg,#020810,#0a020e)"
            : "linear-gradient(180deg,#eef4ff,#e8f0fc)",
          top: "60px",
          height: "calc(100vh - 60px)",
        }}
      >
        {sidebar}
      </aside>

      {/* ── Main chart ── */}
      <main className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center gap-2 px-3 py-2 border-b flex-wrap"
          style={{
            borderColor: "rgba(236,72,153,0.1)",
            background: isDark ? "rgba(2,4,16,0.8)" : "rgba(238,244,255,0.92)",
          }}
        >
          {/* Current expression badge */}
          <span
            className="font-orbitron text-xs font-bold truncate"
            style={{ color: "#f472b6", maxWidth: "calc(100vw - 160px)" }}
          >
            f(x) = {expr}
          </span>

          {/* Zoom controls */}
          <div className="ml-auto flex items-center gap-1 flex-shrink-0">
            <button
              style={zoomBtnStyle}
              onClick={handleZoomIn}
              title="Zoom in (or scroll up on chart)"
            >
              +
            </button>
            <button
              style={zoomBtnStyle}
              onClick={handleZoomOut}
              title="Zoom out (or scroll down on chart)"
            >
              −
            </button>
            <button
              style={{ ...zoomBtnStyle, width: 38, fontSize: "0.65rem" }}
              onClick={handleZoomReset}
              title="Reset zoom"
            >
              RST
            </button>
          </div>
        </div>

        <div className="flex-1 p-2 sm:p-3 flex flex-col overflow-hidden min-h-0">
          {/* Mobile quick-examples scroll strip */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-2 flex-shrink-0">
            {EXAMPLES.slice(0, 6).map((ex) => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex)}
                className="flex-shrink-0 px-2.5 py-1.5 rounded-lg font-mono-code text-[9px] whitespace-nowrap"
                style={{
                  background:
                    expr === ex.expr
                      ? "rgba(236,72,153,0.12)"
                      : isDark
                        ? "rgba(6,18,40,0.8)"
                        : "rgba(238,244,255,0.8)",
                  border: `1px solid ${expr === ex.expr ? "rgba(236,72,153,0.4)" : "rgba(236,72,153,0.12)"}`,
                  color: expr === ex.expr ? "#f472b6" : "#64748b",
                }}
              >
                {ex.tag} {ex.label}
              </button>
            ))}
          </div>

          {/* ── Chart — scroll wheel zooms here ── */}
          <div
            ref={chartWrapperRef}
            className="relative flex-1 graph-container min-h-0"
            style={{
              borderColor: "rgba(236,72,153,0.12)",
              cursor: "crosshair",
              /* ensure the div captures wheel even when chart SVG is on top */
              touchAction: "none",
            }}
            title="Scroll to zoom"
          >
            {/* Corner accents */}
            {[
              ["top-0 left-0", "right-0 bottom-0"],
              ["top-0 right-0", "left-0 bottom-0"],
              ["bottom-0 left-0", "right-0 top-0"],
              ["bottom-0 right-0", "left-0 top-0"],
            ].map(([pos, inner], i) => (
              <div
                key={i}
                className={`absolute ${pos} w-4 h-4 pointer-events-none z-10`}
              >
                <div
                  className={`absolute ${inner} w-3 h-0.5`}
                  style={{ background: "rgba(236,72,153,0.4)" }}
                />
                <div
                  className={`absolute ${inner} w-0.5 h-3`}
                  style={{ background: "rgba(236,72,153,0.4)" }}
                />
              </div>
            ))}

            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 12, right: 8, bottom: 12, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="2 6"
                  stroke="rgba(236,72,153,0.05)"
                />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[internalXMin, internalXMax]}
                  tickCount={7}
                  tick={{
                    fill: isDark ? "#334155" : "#475569",
                    fontFamily: "JetBrains Mono",
                    fontSize: 8,
                  }}
                  axisLine={{ stroke: "rgba(236,72,153,0.18)" }}
                  tickLine={{ stroke: "rgba(236,72,153,0.1)" }}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <YAxis
                  type="number"
                  tickCount={7}
                  tick={{
                    fill: isDark ? "#334155" : "#475569",
                    fontFamily: "JetBrains Mono",
                    fontSize: 8,
                  }}
                  axisLine={{ stroke: "rgba(236,72,153,0.18)" }}
                  tickLine={{ stroke: "rgba(236,72,153,0.1)" }}
                  tickFormatter={(v) => v.toFixed(1)}
                  width={38}
                />
                <ReferenceLine x={0} stroke="rgba(236,72,153,0.15)" />
                <ReferenceLine y={0} stroke="rgba(236,72,153,0.15)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(val, entry) => (
                    <span
                      style={{
                        color: entry.color,
                        fontFamily: "JetBrains Mono",
                        fontSize: 9,
                      }}
                    >
                      {val}
                    </span>
                  )}
                />
                {showRe && (
                  <Line
                    dataKey="re"
                    name="Re[f(x)]"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive
                    animationDuration={500}
                    connectNulls={false}
                    style={{ filter: "drop-shadow(0 0 4px #22d3ee80)" }}
                  />
                )}
                {showIm && (
                  <Line
                    dataKey="im"
                    name="Im[f(x)]"
                    stroke="#f472b6"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive
                    animationDuration={500}
                    connectNulls={false}
                    style={{ filter: "drop-shadow(0 0 4px #f472b680)" }}
                  />
                )}
                {showMag && (
                  <Line
                    dataKey="mag"
                    name="|f(x)|"
                    stroke="#fbbf24"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive
                    animationDuration={500}
                    connectNulls={false}
                    strokeDasharray="4 2"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Info cards */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 flex-shrink-0">
            {[
              {
                label: "Euler's Formula",
                value: "e^(ix) = cos(x) + i·sin(x)",
                color: "#f472b6",
              },
              {
                label: "Magnitude",
                value: "|e^(ix)| = 1 (unit circle)",
                color: "#fbbf24",
              },
              {
                label: "Phase",
                value: "arg(e^(ix)) = x radians",
                color: "#22d3ee",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="px-3 py-2 rounded-xl"
                style={{
                  background: isDark
                    ? "rgba(4,10,24,0.8)"
                    : "rgba(255,255,255,0.88)",
                  border: `1px solid ${item.color}20`,
                }}
              >
                <div
                  className="font-mono-code text-[9px] mb-1"
                  style={{ color: isDark ? "#334155" : "#64748b" }}
                >
                  {item.label}
                </div>
                <div
                  className="font-mono-code text-[10px] break-words"
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
