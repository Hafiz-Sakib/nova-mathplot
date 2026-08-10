import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useTheme } from "../ThemeContext";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import * as math from "mathjs";

const POINTS = 1000;
const PHI = (1 + Math.sqrt(5)) / 2;
const SCOPE = {
  pi: Math.PI,
  e: Math.E,
  phi: PHI,
  omega: 2 * Math.PI,
  tau: 2 * Math.PI,
};

const LINE_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#f472b6",
  "#fb923c",
  "#fbbf24",
  "#60a5fa",
  "#4ade80",
];

function evalExpr(expr, x) {
  try {
    const r = math.evaluate(expr, { ...SCOPE, x });
    return typeof r === "number" && isFinite(r) ? r : null;
  } catch {
    return null;
  }
}

function buildData(plots, xMin, xMax) {
  const step = (xMax - xMin) / POINTS;
  return Array.from({ length: POINTS + 1 }, (_, i) => {
    const x = xMin + i * step;
    const pt = { x: parseFloat(x.toFixed(5)) };
    plots.forEach((p) => {
      if (p.visible && p.expr?.trim()) {
        pt[`y_${p.id}`] = evalExpr(p.expr, x);
      }
    });
    return pt;
  });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "var(--c-tooltip-bg, rgba(2,6,20,0.97))",
        border: "1px solid rgba(139,92,246,0.25)",
        borderRadius: 10,
        padding: "10px 14px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(139,92,246,0.15)",
        color: "var(--c-text)",
      }}
    >
      <div
        className="pb-2 mb-2 font-mono-code text-[10px]"
        style={{
          color: "#475569",
          borderBottom: "1px solid rgba(139,92,246,0.12)",
        }}
      >
        x = {typeof label === "number" ? label.toFixed(4) : label}
      </div>
      {payload.map(
        (entry) =>
          entry.value != null && (
            <div
              key={entry.dataKey}
              className="flex items-center gap-2 font-mono-code text-xs mt-1"
              style={{ color: entry.color }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: entry.color,
                  boxShadow: `0 0 6px ${entry.color}`,
                }}
              />
              <span>{entry.name}:</span>
              <span>{entry.value.toFixed(5)}</span>
            </div>
          ),
      )}
    </div>
  );
}

export default function GraphPanel({
  plots,
  xMin,
  xMax,
  yMin,
  yMax,
  autoY,
  setYMin,
  setYMax,
  setError,
}) {
  const { isDark } = useTheme();
  const [intXMin, setIntXMin] = useState(xMin);
  const [intXMax, setIntXMax] = useState(xMax);
  const containerRef = useRef(null);
  const dragRef = useRef(null);

  // Sync external props
  useEffect(() => {
    setIntXMin(xMin);
    setIntXMax(xMax);
  }, [xMin, xMax]);

  // Mouse-wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const frac = (e.clientX - rect.left) / rect.width;
      const range = intXMax - intXMin;
      const factor = e.deltaY < 0 ? 0.8 : 1.25;
      const newRange = range * factor;
      const focusX = intXMin + frac * range;

      setIntXMin(focusX - frac * newRange);
      setIntXMax(focusX + (1 - frac) * newRange);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [intXMin, intXMax]);

  // Click-drag pan
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onDown = (e) => {
      if (e.button !== 0) return;
      dragRef.current = {
        startX: e.clientX,
        startXMin: intXMin,
        startXMax: intXMax,
        width: el.getBoundingClientRect().width,
      };
      el.style.cursor = "grabbing";
    };

    const onMove = (e) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const range = dragRef.current.startXMax - dragRef.current.startXMin;
      const shift = -(dx / dragRef.current.width) * range;

      setIntXMin(dragRef.current.startXMin + shift);
      setIntXMax(dragRef.current.startXMax + shift);
    };

    const onUp = () => {
      dragRef.current = null;
      if (containerRef.current) containerRef.current.style.cursor = "crosshair";
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [intXMin, intXMax]);

  const data = useMemo(() => {
    try {
      return buildData(plots, intXMin, intXMax);
    } catch (e) {
      setError(e.message);
      return [];
    }
  }, [plots, intXMin, intXMax, setError]);

  // Expression validation
  useEffect(() => {
    const errs = [];
    plots.forEach((p) => {
      if (!p.expr?.trim()) return;
      try {
        math.evaluate(p.expr, { ...SCOPE, x: 1 });
      } catch (e) {
        errs.push(`"${p.expr}" — ${e.message}`);
      }
    });
    setError(errs[0] || "");
  }, [plots, setError]);

  const yDomain = useMemo(() => {
    if (!autoY) return [yMin, yMax];
    let lo = Infinity,
      hi = -Infinity;
    data.forEach((pt) =>
      Object.entries(pt).forEach(([k, v]) => {
        if (k !== "x" && v != null) {
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
      }),
    );
    if (!isFinite(lo)) return [-10, 10];
    const pad = (hi - lo) * 0.12 || 1;
    return [
      parseFloat((lo - pad).toFixed(3)),
      parseFloat((hi + pad).toFixed(3)),
    ];
  }, [data, autoY, yMin, yMax]);

  const zoomIn = useCallback(() => {
    const mid = (intXMin + intXMax) / 2;
    const half = (intXMax - intXMin) / 4;
    setIntXMin(mid - half);
    setIntXMax(mid + half);
  }, [intXMin, intXMax]);

  const zoomOut = useCallback(() => {
    const mid = (intXMin + intXMax) / 2;
    const half = intXMax - intXMin;
    setIntXMin(mid - half);
    setIntXMax(mid + half);
  }, [intXMin, intXMax]);

  const zoomReset = useCallback(() => {
    setIntXMin(xMin);
    setIntXMax(xMax);
  }, [xMin, xMax]);

  const panLeft = useCallback(() => {
    const d = (intXMax - intXMin) * 0.25;
    setIntXMin((v) => v - d);
    setIntXMax((v) => v - d);
  }, [intXMax, intXMin]);

  const panRight = useCallback(() => {
    const d = (intXMax - intXMin) * 0.25;
    setIntXMin((v) => v + d);
    setIntXMax((v) => v + d);
  }, [intXMax, intXMin]);

  const activePlots = useMemo(
    () => plots.filter((p) => p.visible && p.expr?.trim()),
    [plots],
  );

  const plotColor = (plot, idx) =>
    plot.color || LINE_COLORS[idx % LINE_COLORS.length];

  const ZoomBtn = ({ onClick, title, children, wide }) => (
    <button
      onClick={onClick}
      title={title}
      className="font-mono-code flex items-center justify-center rounded-lg transition-all"
      style={{
        width: wide ? 38 : 28,
        height: 28,
        background: isDark ? "rgba(2,8,20,0.8)" : "rgba(255,255,255,0.97)",
        border: "1px solid rgba(139,92,246,0.18)",
        color: "#64748b",
        fontSize: "0.75rem",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)";
        e.currentTarget.style.color = "#a78bfa";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(139,92,246,0.18)";
        e.currentTarget.style.color = "#64748b";
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 p-2 sm:p-3">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <div className="flex items-center gap-1">
          <ZoomBtn onClick={zoomIn} title="Zoom In">
            +
          </ZoomBtn>
          <ZoomBtn onClick={zoomOut} title="Zoom Out">
            −
          </ZoomBtn>
          <ZoomBtn onClick={zoomReset} title="Reset" wide>
            RST
          </ZoomBtn>
        </div>
        <div className="flex items-center gap-1">
          <ZoomBtn onClick={panLeft} title="Pan Left">
            ◀
          </ZoomBtn>
          <ZoomBtn onClick={panRight} title="Pan Right">
            ▶
          </ZoomBtn>
        </div>
        <div className="ml-auto flex items-center gap-3 flex-wrap">
          <span
            className="font-mono-code text-[9px] hidden sm:flex items-center gap-1"
            style={{ color: "#334155" }}
          >
            <span style={{ color: "#a78bfa" }}>⊙</span> scroll to zoom · drag to
            pan
          </span>
          <span
            className="font-mono-code text-[9px]"
            style={{ color: "#334155" }}
          >
            x:[{intXMin.toFixed(2)}, {intXMax.toFixed(2)}]
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-0 rounded-xl overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg,#020810 0%,#080418 50%,#020810 100%)"
            : "linear-gradient(135deg,#f8fafc 0%,#eef4ff 50%,#f0f4ff 100%)",
          border: isDark ? "1px solid rgba(139,92,246,0.12)" : "1px solid rgba(139,92,246,0.2)",
          cursor: "crosshair",
          userSelect: "none",
        }}
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
              style={{ background: "rgba(139,92,246,0.4)" }}
            />
            <div
              className={`absolute ${inner} w-0.5 h-3`}
              style={{ background: "rgba(139,92,246,0.4)" }}
            />
          </div>
        ))}

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 65%)",
          }}
        />

        {activePlots.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="font-mono-code text-6xl"
              style={{ color: "rgba(139,92,246,0.12)" }}
            >
              ∿
            </div>
            <p
              className="font-orbitron text-xs tracking-widest uppercase"
              style={{ color: "#334155" }}
            >
              Enter a function to visualize
            </p>
            <span
              className="font-mono-code text-xs text-center px-4"
              style={{ color: "#1e293b" }}
            >
              Try: sin(x) · x² · e^(-x²) · cos(x)+sin(x)
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 16, right: 12, bottom: 16, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 6"
                stroke={isDark ? "rgba(139,92,246,0.07)" : "rgba(139,92,246,0.15)"}
              />
              <XAxis
                dataKey="x"
                type="number"
                domain={[intXMin, intXMax]}
                tickCount={9}
                tick={{
                  fill: isDark ? "#334155" : "#475569",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  fontSize: 9,
                }}
                axisLine={{ stroke: "rgba(139,92,246,0.2)" }}
                tickLine={{ stroke: "rgba(139,92,246,0.12)" }}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <YAxis
                type="number"
                domain={yDomain}
                tickCount={7}
                tick={{
                  fill: isDark ? "#334155" : "#475569",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  fontSize: 9,
                }}
                axisLine={{ stroke: "rgba(139,92,246,0.2)" }}
                tickLine={{ stroke: "rgba(139,92,246,0.12)" }}
                tickFormatter={(v) => v.toFixed(1)}
                width={44}
              />
              <ReferenceLine
                x={0}
                stroke="rgba(139,92,246,0.25)"
                strokeWidth={1}
              />
              <ReferenceLine
                y={0}
                stroke="rgba(139,92,246,0.25)"
                strokeWidth={1}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(val, entry) => (
                  <span
                    style={{
                      color: entry.color,
                      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      fontSize: 10,
                    }}
                  >
                    {val}
                  </span>
                )}
                wrapperStyle={{ paddingTop: 4 }}
              />

              {activePlots.map((plot, idx) => {
                const color = plotColor(plot, idx);
                return (
                  <Line
                    key={plot.id}
                    dataKey={`y_${plot.id}`}
                    name={plot.label || plot.expr}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 4.5,
                      fill: "#ffffff",
                      stroke: color,
                      strokeWidth: 2.5,
                    }}
                    isAnimationActive
                    animationDuration={500}
                    animationEasing="ease-out"
                    connectNulls={false}
                    style={{
                      filter: `drop-shadow(0 0 8px ${color}99)`,
                    }}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
