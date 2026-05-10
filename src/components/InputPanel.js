import React, { useRef, useState } from "react";

/* Quick-insert symbols */
const SYMBOLS = [
  { label: "sin", insert: "sin(", desc: "Sine" },
  { label: "cos", insert: "cos(", desc: "Cosine" },
  { label: "tan", insert: "tan(", desc: "Tangent" },
  { label: "√x", insert: "sqrt(", desc: "Square root" },
  { label: "|x|", insert: "abs(", desc: "Absolute value" },
  { label: "ln", insert: "log(", desc: "Natural log" },
  { label: "log₁₀", insert: "log10(", desc: "Log base 10" },
  { label: "eˣ", insert: "e^x", desc: "Exponential" },
  { label: "x²", insert: "x^2", desc: "Squared" },
  { label: "x³", insert: "x^3", desc: "Cubed" },
  { label: "π", insert: "pi", desc: "Pi ≈ 3.14159" },
  { label: "e", insert: "e", desc: "Euler ≈ 2.718" },
  { label: "φ", insert: "phi", desc: "Golden ratio" },
  { label: "sinh", insert: "sinh(", desc: "Hyperbolic sin" },
  { label: "cosh", insert: "cosh(", desc: "Hyperbolic cos" },
  { label: "asin", insert: "asin(", desc: "Arcsin" },
  { label: "acos", insert: "acos(", desc: "Arccos" },
  { label: "atan", insert: "atan(", desc: "Arctan" },
  { label: "⌊x⌋", insert: "floor(", desc: "Floor / round down" },
  { label: "⌈x⌉", insert: "ceil(", desc: "Ceiling / round up" },
  { label: "sign", insert: "sign(", desc: "Sign: −1, 0, or +1" },
  { label: "mod", insert: " mod ", desc: "Modulo / remainder" },
  { label: "max", insert: "max(", desc: "Maximum of values" },
  { label: "min", insert: "min(", desc: "Minimum of values" },
];

const PLOT_COLORS = [
  "#22d3ee",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
  "#60a5fa",
  "#fbbf24",
  "#4ade80",
];

/* Quick range presets */
const RANGE_PRESETS = [
  { label: "−10…10", xMin: -10, xMax: 10 },
  { label: "−π…π", xMin: -Math.PI, xMax: Math.PI },
  { label: "−2π…2π", xMin: -2 * Math.PI, xMax: 2 * Math.PI },
  { label: "0…10", xMin: 0, xMax: 10 },
  { label: "−5…5", xMin: -5, xMax: 5 },
  { label: "−20…20", xMin: -20, xMax: 20 },
];

/* Syntax reference */
const SYNTAX_GUIDE = [
  { input: "x^2", means: "x squared (x²)" },
  { input: "2*x", means: "2 times x (2x)" },
  { input: "sin(x)", means: "Sine of x" },
  { input: "e^(-x)", means: "e to the power −x" },
  { input: "sqrt(x)", means: "Square root of x" },
  { input: "abs(x)", means: "Absolute value |x|" },
  { input: "x mod 2", means: "x remainder ÷ 2" },
  { input: "pi, e, phi", means: "Constants π, e, φ" },
];

export default function InputPanel({
  plots,
  activeId,
  setActiveId,
  addPlot,
  removePlot,
  updatePlot,
  xMin,
  setXMin,
  xMax,
  setXMax,
  yMin,
  setYMin,
  yMax,
  setYMax,
  autoY,
  setAutoY,
  error,
  setError,
}) {
  const inputRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const activePlot = plots.find((p) => p.id === activeId);

  const handleExprChange = (val) => {
    setError("");
    if (activePlot) updatePlot(activeId, { expr: val, label: val });
  };

  const insertSymbol = (sym) => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart,
      end = input.selectionEnd;
    const current = activePlot?.expr || "";
    const newVal = current.slice(0, start) + sym + current.slice(end);
    updatePlot(activeId, { expr: newVal, label: newVal });
    setError("");
    setTimeout(() => {
      input.focus();
      const pos = start + sym.length;
      input.setSelectionRange(pos, pos);
    }, 0);
  };

  const applyRangePreset = (preset) => {
    setXMin(preset.xMin);
    setXMax(preset.xMax);
  };

  return (
    <div className="flex flex-col font-rajdhani">
      {/* ── Functions List ── */}
      <div
        className="p-4 border-b"
        style={{ borderColor: "rgba(6,182,212,0.08)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="section-label">Functions</div>
          <span
            className="font-mono-code text-[9px] px-1.5 py-0.5 rounded"
            style={{
              background: "rgba(6,182,212,0.07)",
              color: "#22d3ee",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
          >
            {plots.filter((p) => p.visible && p.expr).length} active
          </span>
        </div>

        <div className="flex flex-col gap-1.5 mb-3">
          {plots.map((plot) => (
            <div
              key={plot.id}
              onClick={() => setActiveId(plot.id)}
              className={`plot-item flex items-center gap-2.5 px-3 py-2.5 ${plot.id === activeId ? "active" : ""}`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  background: plot.color,
                  boxShadow: `0 0 ${plot.id === activeId ? "8px" : "4px"} ${plot.color}`,
                }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="font-mono-code text-xs truncate"
                  style={{ color: plot.expr ? "#94a3b8" : "#334155" }}
                >
                  {plot.expr || "empty — click to edit"}
                </div>
                {plot.expr && (
                  <div
                    className="font-rajdhani text-[9px]"
                    style={{ color: "#1e3a5f" }}
                  >
                    f(x) ={" "}
                    {plot.expr.length > 20
                      ? plot.expr.slice(0, 20) + "…"
                      : plot.expr}
                  </div>
                )}
              </div>
              <div
                className="flex items-center gap-1"
                style={{ opacity: plot.id === activeId ? 1 : undefined }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updatePlot(plot.id, { visible: !plot.visible });
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded text-[10px]"
                  style={{ color: plot.visible ? plot.color : "#334155" }}
                  title={plot.visible ? "Hide" : "Show"}
                >
                  {plot.visible ? "●" : "○"}
                </button>
                {plots.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlot(plot.id);
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded text-[10px] transition-colors"
                    style={{ color: "#334155" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#f87171")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#334155")
                    }
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => addPlot()}
          className="w-full py-2 rounded-xl font-mono-code text-xs tracking-widest transition-all duration-300"
          style={{
            color: "#334155",
            border: "1px dashed rgba(6,182,212,0.2)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(6,182,212,0.05)";
            e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)";
            e.currentTarget.style.color = "#22d3ee";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(6,182,212,0.2)";
            e.currentTarget.style.color = "#334155";
          }}
        >
          <span className="mr-1.5 text-base">+</span> Add Function
        </button>
      </div>

      {/* ── Expression Editor ── */}
      {activePlot && (
        <div
          className="p-4 border-b animate-fade"
          style={{ borderColor: "rgba(6,182,212,0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="section-label">Edit f(x)</div>
            <button
              onClick={() => setShowGuide((v) => !v)}
              className="font-mono-code text-[9px] px-2 py-0.5 rounded"
              style={{
                background: showGuide ? "rgba(6,182,212,0.1)" : "transparent",
                border: "1px solid rgba(6,182,212,0.2)",
                color: showGuide ? "#22d3ee" : "#475569",
              }}
            >
              {showGuide ? "▲ Hide guide" : "? Syntax guide"}
            </button>
          </div>

          {/* Syntax guide */}
          {showGuide && (
            <div
              className="mb-3 p-3 rounded-xl"
              style={{
                background: "rgba(6,182,212,0.04)",
                border: "1px solid rgba(6,182,212,0.12)",
              }}
            >
              <div
                className="font-mono-code text-[9px] tracking-widest uppercase mb-2"
                style={{ color: "#334155" }}
              >
                How to write expressions
              </div>
              <div className="grid grid-cols-1 gap-1">
                {SYNTAX_GUIDE.map((g) => (
                  <div key={g.input} className="flex items-center gap-2">
                    <code
                      className="font-mono-code text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{
                        background: "rgba(6,182,212,0.1)",
                        color: "#22d3ee",
                        minWidth: 80,
                      }}
                    >
                      {g.input}
                    </code>
                    <span
                      className="font-rajdhani text-[10px]"
                      style={{ color: "#475569" }}
                    >
                      {g.means}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color picker row */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="color"
              value={activePlot.color}
              onChange={(e) => updatePlot(activeId, { color: e.target.value })}
              className="w-7 h-7 rounded cursor-pointer border-0 p-0.5 flex-shrink-0"
              style={{
                background: "rgba(4,10,24,0.8)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
              title="Pick custom color"
            />
            <span
              className="font-mono-code text-[9px]"
              style={{ color: "#475569" }}
            >
              Curve color:
            </span>
            <div className="flex gap-1 flex-wrap">
              {PLOT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => updatePlot(activeId, { color: c })}
                  className="w-4 h-4 rounded-full flex-shrink-0 border transition-transform hover:scale-110"
                  style={{
                    background: c,
                    boxShadow: activePlot.color === c ? `0 0 6px ${c}` : "none",
                    borderColor:
                      activePlot.color === c ? "white" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Expression input */}
          <div
            className="relative rounded-xl overflow-hidden mb-2"
            style={{
              background: "rgba(4,10,24,0.9)",
              border: "1px solid rgba(6,182,212,0.25)",
              boxShadow: "0 0 12px rgba(6,182,212,0.05)",
            }}
          >
            <div className="flex items-center px-3 py-2.5 gap-2">
              <span
                className="font-mono-code text-xs flex-shrink-0"
                style={{ color: "#22d3ee" }}
              >
                f(x) =
              </span>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent outline-none font-mono-code text-sm"
                style={{ color: "#e2e8f0" }}
                value={activePlot.expr}
                onChange={(e) => handleExprChange(e.target.value)}
                placeholder="e.g.  sin(x) + cos(2*x)"
                spellCheck={false}
                autoComplete="off"
              />
              {activePlot.expr && (
                <button
                  onClick={() => handleExprChange("")}
                  className="font-mono-code text-[10px] flex-shrink-0"
                  style={{ color: "#334155" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#f87171")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#334155")
                  }
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-2 px-3 py-2 rounded-lg font-mono-code text-[10px] flex items-start gap-2"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
              }}
            >
              <span className="flex-shrink-0">⚠</span>
              <div>
                <div>{error}</div>
                <div className="mt-0.5" style={{ color: "#9ca3af" }}>
                  Check: use <code style={{ color: "#22d3ee" }}>*</code> for
                  multiply · <code style={{ color: "#22d3ee" }}>^</code> for
                  power
                </div>
              </div>
            </div>
          )}

          {/* Quick-insert buttons */}
          <div
            className="font-mono-code text-[9px] tracking-widest uppercase mb-1.5"
            style={{ color: "#334155" }}
          >
            Quick Insert — click to add to expression
          </div>
          <div className="flex flex-wrap gap-1 mb-1">
            {SYMBOLS.map((s) => (
              <button
                key={s.label}
                className="sym-btn-nova"
                onClick={() => insertSymbol(s.insert)}
                title={`Insert ${s.insert} — ${s.desc}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Examples for this input */}
          <div className="mt-3">
            <div
              className="font-mono-code text-[9px] tracking-widest uppercase mb-1.5"
              style={{ color: "#334155" }}
            >
              Try these expressions
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                "sin(x)",
                "x^2",
                "e^(-x^2)",
                "tan(x)",
                "sin(x)/x",
                "abs(sin(x))",
                "x*sin(x)",
                "cos(x^2)",
              ].map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    handleExprChange(ex);
                    inputRef.current?.focus();
                  }}
                  className="font-mono-code text-[9px] px-2 py-0.5 rounded transition-all"
                  style={{
                    background:
                      activePlot.expr === ex
                        ? "rgba(6,182,212,0.12)"
                        : "rgba(4,10,24,0.8)",
                    border: `1px solid ${activePlot.expr === ex ? "rgba(6,182,212,0.4)" : "rgba(6,182,212,0.1)"}`,
                    color: activePlot.expr === ex ? "#22d3ee" : "#475569",
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── View Range ── */}
      <div
        className="p-4 border-b"
        style={{ borderColor: "rgba(6,182,212,0.08)" }}
      >
        <div className="section-label mb-3">View Range (X Axis)</div>

        {/* Range presets */}
        <div className="mb-3">
          <div
            className="font-mono-code text-[9px] tracking-widest uppercase mb-1.5"
            style={{ color: "#334155" }}
          >
            Quick presets
          </div>
          <div className="flex flex-wrap gap-1">
            {RANGE_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyRangePreset(p)}
                className="font-mono-code text-[9px] px-2 py-1 rounded"
                style={{
                  background:
                    xMin === p.xMin && xMax === p.xMax
                      ? "rgba(6,182,212,0.12)"
                      : "rgba(4,10,24,0.8)",
                  border: `1px solid ${xMin === p.xMin && xMax === p.xMax ? "rgba(6,182,212,0.4)" : "rgba(6,182,212,0.1)"}`,
                  color:
                    xMin === p.xMin && xMax === p.xMax ? "#22d3ee" : "#64748b",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual inputs */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            ["X min", xMin, setXMin],
            ["X max", xMax, setXMax],
          ].map(([lbl, val, set]) => (
            <label key={lbl} className="flex flex-col gap-1">
              <span
                className="font-mono-code text-[10px]"
                style={{ color: "#475569" }}
              >
                {lbl}
              </span>
              <input
                type="number"
                value={val}
                onChange={(e) => set(+e.target.value)}
                className="nova-input py-1.5 text-xs"
              />
            </label>
          ))}
        </div>

        {/* Y range toggle */}
        <div
          className="flex items-center gap-3 mb-2 cursor-pointer"
          onClick={() => setAutoY((v) => !v)}
        >
          <div className={`toggle-track-nova ${autoY ? "on" : ""}`}>
            <div className="toggle-thumb-nova" />
          </div>
          <div>
            <span
              className="font-mono-code text-xs"
              style={{ color: autoY ? "#22d3ee" : "#475569" }}
            >
              Auto Y range
            </span>
            <div
              className="font-rajdhani text-[9px]"
              style={{ color: "#1e3a5f" }}
            >
              {autoY
                ? "Y axis scales to fit the curve"
                : "Set Y range manually below"}
            </div>
          </div>
        </div>

        {!autoY && (
          <div className="grid grid-cols-2 gap-2 animate-slide-down">
            {[
              ["Y min", yMin, setYMin],
              ["Y max", yMax, setYMax],
            ].map(([lbl, val, set]) => (
              <label key={lbl} className="flex flex-col gap-1">
                <span
                  className="font-mono-code text-[10px]"
                  style={{ color: "#475569" }}
                >
                  {lbl}
                </span>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => set(+e.target.value)}
                  className="nova-input py-1.5 text-xs"
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
