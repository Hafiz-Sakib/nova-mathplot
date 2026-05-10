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

const POINTS = 800;
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
  {
    label: "Euler: e^(ix)",
    expr: "e^(i*x)",
    desc: "Euler's formula — real and imaginary parts trace a circle on the complex plane",
  },
  {
    label: "Complex sin",
    expr: "sin(i*x)",
    desc: "sin(ix) = i·sinh(x) — complex sine gives hyperbolic functions",
  },
  {
    label: "Complex exp",
    expr: "e^(x + i*x)",
    desc: "Spiraling complex exponential — growing amplitude",
  },
  {
    label: "Zeta-like",
    expr: "e^(-x) * (cos(x) + i*sin(x))",
    desc: "Damped complex oscillator — decaying spiral",
  },
  {
    label: "Complex log",
    expr: "log(x + i*x)",
    desc: "Complex logarithm — phase and magnitude",
  },
  {
    label: "i^x",
    expr: "(0 + 1i)^x",
    desc: "i raised to a real power — periodic in the complex plane",
  },
  {
    label: "Modulated",
    expr: "e^(i*x*x/4)",
    desc: "Chirp signal — phase increases quadratically",
  },
  {
    label: "Riemann-like",
    expr: "e^(-abs(x)) * cos(3*x) + i * e^(-abs(x)) * sin(3*x)",
    desc: "Gaussian-modulated complex oscillation",
  },
];

function ArgandDiagram({ data }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width,
      H = canvas.height;
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
    const pad = 0.1;
    minRe -= pad;
    maxRe += pad;
    minIm -= pad;
    maxIm += pad;
    const toX = (re) => ((re - minRe) / (maxRe - minRe)) * W;
    const toY = (im) => H - ((im - minIm) / (maxIm - minIm)) * H;
    // Axes
    ctx.strokeStyle = "rgba(6,182,212,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toX(0), 0);
    ctx.lineTo(toX(0), H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, toY(0));
    ctx.lineTo(W, toY(0));
    ctx.stroke();
    // Curve
    ctx.lineWidth = 2;
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#22d3ee");
    grad.addColorStop(0.5, "#a78bfa");
    grad.addColorStop(1, "#f472b6");
    ctx.strokeStyle = grad;
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
    // Arrow tip
    const last = data.filter((d) => d.re != null && d.im != null).slice(-1)[0];
    if (last) {
      ctx.beginPath();
      ctx.arc(toX(last.re), toY(last.im), 4, 0, Math.PI * 2);
      ctx.fillStyle = "#f472b6";
      ctx.fill();
    }
  }, [data]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(4,10,24,0.85)",
        border: "1px solid rgba(6,182,212,0.15)",
      }}
    >
      <div
        className="px-3 py-2 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(6,182,212,0.1)" }}
      >
        <span
          className="font-orbitron text-xs font-bold"
          style={{ color: "#a78bfa" }}
        >
          Argand Diagram
        </span>
        <span
          className="font-mono-code text-[10px]"
          style={{ color: "#334155" }}
        >
          Complex Plane
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={220}
        className="w-full"
        style={{ display: "block" }}
      />
    </div>
  );
}

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

export default function ComplexPage() {
  const [expr, setExpr] = useState("e^(i*x)");
  const [inputExpr, setInputExpr] = useState("e^(i*x)");
  const [xMin, setXMin] = useState(-2 * Math.PI);
  const [xMax, setXMax] = useState(2 * Math.PI);
  const [showRe, setShowRe] = useState(true);
  const [showIm, setShowIm] = useState(true);
  const [showMag, setShowMag] = useState(true);
  const [zoom, setZoom] = useState(1);

  const [internalXMin, setInternalXMin] = useState(-2 * Math.PI);
  const [internalXMax, setInternalXMax] = useState(2 * Math.PI);

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

  const handleZoomIn = () => {
    const mid = (internalXMin + internalXMax) / 2,
      half = (internalXMax - internalXMin) / 4;
    setInternalXMin(mid - half);
    setInternalXMax(mid + half);
  };
  const handleZoomOut = () => {
    const mid = (internalXMin + internalXMax) / 2,
      half = internalXMax - internalXMin;
    setInternalXMin(mid - half);
    setInternalXMax(mid + half);
  };
  const handleZoomReset = () => {
    setInternalXMin(xMin);
    setInternalXMax(xMax);
  };

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-72 xl:w-80 border-r overflow-y-auto"
        style={{
          borderColor: "rgba(236,72,153,0.15)",
          background: "linear-gradient(180deg,#020810,#0a020e)",
        }}
      >
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(236,72,153,0.5),rgba(139,92,246,0.3),transparent)",
          }}
        />
        <div
          className="px-4 py-4 border-b"
          style={{ borderColor: "rgba(236,72,153,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
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
          <div>
            <div className="section-label">Expression f(x) → ℂ</div>
            <div className="flex gap-2">
              <input
                className="nova-input flex-1"
                value={inputExpr}
                onChange={(e) => setInputExpr(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setExpr(inputExpr)}
                placeholder="e^(i*x)"
              />
              <button
                onClick={() => setExpr(inputExpr)}
                className="px-3 py-1 rounded-lg font-mono-code text-[10px]"
                style={{
                  background: "rgba(236,72,153,0.12)",
                  border: "1px solid rgba(236,72,153,0.35)",
                  color: "#f472b6",
                }}
              >
                Plot
              </button>
            </div>
            <p
              className="font-mono-code text-[9px] mt-1.5"
              style={{ color: "#334155" }}
            >
              Use i for imaginary unit
            </p>
          </div>

          <div>
            <div className="section-label">Show Components</div>
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
                className="flex items-center gap-3 py-1.5 cursor-pointer"
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

          <div>
            <div className="section-label">X Range</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Min", xMin, setXMin],
                ["Max", xMax, setXMax],
              ].map(([l, v, s]) => (
                <div key={l}>
                  <div
                    className="font-mono-code text-[9px] mb-1"
                    style={{ color: "#334155" }}
                  >
                    {l}
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    className="nova-input-sm"
                    value={v}
                    onChange={(e) => {
                      s(+e.target.value);
                      if (l === "Min") setInternalXMin(+e.target.value);
                      else setInternalXMax(+e.target.value);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Argand Diagram */}
          <ArgandDiagram data={data} />
        </div>

        <div className="p-4">
          <div className="section-label mb-2">Examples</div>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                setExpr(ex.expr);
                setInputExpr(ex.expr);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all"
              style={{
                background:
                  expr === ex.expr ? "rgba(236,72,153,0.08)" : "transparent",
                border: `1px solid ${expr === ex.expr ? "rgba(236,72,153,0.3)" : "rgba(236,72,153,0.07)"}`,
              }}
            >
              <div
                className="font-mono-code text-xs mb-0.5"
                style={{ color: expr === ex.expr ? "#f472b6" : "#64748b" }}
              >
                {ex.label}
              </div>
              <div
                className="font-rajdhani text-xs"
                style={{ color: "#334155" }}
              >
                {ex.desc}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main chart area */}
      <main className="flex flex-col flex-1 overflow-hidden min-w-0">
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b flex-wrap"
          style={{
            borderColor: "rgba(236,72,153,0.1)",
            background: "rgba(2,4,16,0.8)",
          }}
        >
          <span
            className="font-orbitron text-xs font-bold"
            style={{ color: "#f472b6" }}
          >
            f(x) = {expr}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button className="zoom-btn" onClick={handleZoomIn}>
              +
            </button>
            <button className="zoom-btn" onClick={handleZoomOut}>
              −
            </button>
            <button
              className="zoom-btn text-[10px]"
              onClick={handleZoomReset}
              style={{ width: 34 }}
            >
              RST
            </button>
          </div>
        </div>

        <div className="flex-1 p-3 sm:p-4 flex flex-col overflow-hidden">
          {/* Mobile examples */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-2">
            {EXAMPLES.slice(0, 4).map((ex) => (
              <button
                key={ex.label}
                onClick={() => {
                  setExpr(ex.expr);
                  setInputExpr(ex.expr);
                }}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg font-mono-code text-[10px]"
                style={{
                  background:
                    expr === ex.expr
                      ? "rgba(236,72,153,0.12)"
                      : "rgba(6,18,40,0.8)",
                  border: `1px solid ${expr === ex.expr ? "rgba(236,72,153,0.4)" : "rgba(236,72,153,0.12)"}`,
                  color: expr === ex.expr ? "#f472b6" : "#64748b",
                }}
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div
            className="relative flex-1 graph-container min-h-0"
            style={{ borderColor: "rgba(236,72,153,0.12)" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 16, right: 12, bottom: 16, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="2 6"
                  stroke="rgba(236,72,153,0.05)"
                />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[internalXMin, internalXMax]}
                  tickCount={9}
                  tick={{
                    fill: "#334155",
                    fontFamily: "JetBrains Mono",
                    fontSize: 9,
                  }}
                  axisLine={{ stroke: "rgba(236,72,153,0.18)" }}
                  tickLine={{ stroke: "rgba(236,72,153,0.1)" }}
                  tickFormatter={(v) => v.toFixed(2)}
                />
                <YAxis
                  type="number"
                  tickCount={7}
                  tick={{
                    fill: "#334155",
                    fontFamily: "JetBrains Mono",
                    fontSize: 9,
                  }}
                  axisLine={{ stroke: "rgba(236,72,153,0.18)" }}
                  tickLine={{ stroke: "rgba(236,72,153,0.1)" }}
                  tickFormatter={(v) => v.toFixed(2)}
                  width={50}
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
                        fontSize: 10,
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
                    animationDuration={600}
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
                    animationDuration={600}
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
                    animationDuration={600}
                    connectNulls={false}
                    strokeDasharray="4 2"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Euler's formula info box */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Euler's Formula",
                value: "e^(ix) = cos(x) + i·sin(x)",
                color: "#f472b6",
              },
              { label: "Magnitude", value: "|e^(ix)| = 1", color: "#fbbf24" },
              { label: "Phase", value: "arg(e^(ix)) = x", color: "#22d3ee" },
            ].map((item) => (
              <div
                key={item.label}
                className="px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(4,10,24,0.8)",
                  border: `1px solid ${item.color}20`,
                }}
              >
                <div
                  className="font-mono-code text-[10px] mb-1"
                  style={{ color: "#334155" }}
                >
                  {item.label}
                </div>
                <div
                  className="font-mono-code text-xs"
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
