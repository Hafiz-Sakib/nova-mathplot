import React, { useMemo, useEffect } from "react";
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

const POINTS = 900;
const PHI = (1 + Math.sqrt(5)) / 2;
const OMEGA = 2 * Math.PI;
const SCOPE = {
  pi: Math.PI,
  e: Math.E,
  phi: PHI,
  omega: OMEGA,
  tau: 2 * Math.PI,
};

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
      if (p.visible && p.expr.trim()) pt[`y_${p.id}`] = evalExpr(p.expr, x);
    });
    return pt;
  });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="nova-tooltip">
      <div
        className="pb-2 mb-2 font-mono-code text-[10px]"
        style={{
          color: "#475569",
          borderBottom: "1px solid rgba(6,182,212,0.15)",
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
                  boxShadow: `0 0 5px ${entry.color}`,
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

function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div
        className="font-mono-code text-6xl animate-float"
        style={{ color: "rgba(6,182,212,0.1)" }}
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
  const data = useMemo(() => {
    try {
      return buildData(plots, xMin, xMax);
    } catch (e) {
      setError(e.message);
      return [];
    }
  }, [plots, xMin, xMax]);

  useEffect(() => {
    const errs = [];
    plots.forEach((p) => {
      if (!p.expr.trim()) return;
      try {
        math.evaluate(p.expr, { ...SCOPE, x: 1 });
      } catch (e) {
        errs.push(`"${p.expr}" — ${e.message}`);
      }
    });
    setError(errs[0] || "");
  }, [plots]);

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

  const activePlots = plots.filter((p) => p.visible && p.expr.trim());

  return (
    <div className="flex-1 p-3 sm:p-4 flex flex-col overflow-hidden min-h-0">
      <div className="relative flex-1 graph-container min-h-0">
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
              style={{ background: "rgba(6,182,212,0.4)" }}
            />
            <div
              className={`absolute ${inner} w-0.5 h-3`}
              style={{ background: "rgba(6,182,212,0.4)" }}
            />
          </div>
        ))}

        {/* Inner glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.025) 0%, transparent 65%)",
          }}
        />

        {activePlots.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 16, right: 16, bottom: 16, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 6"
                stroke="rgba(6,182,212,0.06)"
              />
              <XAxis
                dataKey="x"
                type="number"
                domain={[xMin, xMax]}
                tickCount={9}
                tick={{
                  fill: "#334155",
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                }}
                axisLine={{ stroke: "rgba(6,182,212,0.18)" }}
                tickLine={{ stroke: "rgba(6,182,212,0.1)" }}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <YAxis
                type="number"
                domain={yDomain}
                tickCount={7}
                tick={{
                  fill: "#334155",
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                }}
                axisLine={{ stroke: "rgba(6,182,212,0.18)" }}
                tickLine={{ stroke: "rgba(6,182,212,0.1)" }}
                tickFormatter={(v) => v.toFixed(1)}
                width={44}
              />
              <ReferenceLine
                x={0}
                stroke="rgba(6,182,212,0.2)"
                strokeWidth={1}
              />
              <ReferenceLine
                y={0}
                stroke="rgba(6,182,212,0.2)"
                strokeWidth={1}
              />
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
                wrapperStyle={{ paddingTop: 4 }}
              />
              {activePlots.map((plot) => (
                <Line
                  key={plot.id}
                  dataKey={`y_${plot.id}`}
                  name={plot.label || plot.expr}
                  stroke={plot.color}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: plot.color,
                    stroke: "#020810",
                    strokeWidth: 2,
                  }}
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-out"
                  connectNulls={false}
                  style={{ filter: `drop-shadow(0 0 5px ${plot.color}80)` }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
