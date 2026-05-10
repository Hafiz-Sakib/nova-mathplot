import React, { useRef, useState } from "react";

const SYMBOLS = [
  { label: "π", insert: "pi" },
  { label: "e", insert: "e" },
  { label: "ω", insert: "omega" },
  { label: "φ", insert: "phi" },
  { label: "τ", insert: "tau" },
  { label: "√", insert: "sqrt(" },
  { label: "|x|", insert: "abs(" },
  { label: "ln", insert: "log(" },
  { label: "lg", insert: "log10(" },
  { label: "sin", insert: "sin(" },
  { label: "cos", insert: "cos(" },
  { label: "tan", insert: "tan(" },
  { label: "asin", insert: "asin(" },
  { label: "acos", insert: "acos(" },
  { label: "atan", insert: "atan(" },
  { label: "sinh", insert: "sinh(" },
  { label: "cosh", insert: "cosh(" },
  { label: "tanh", insert: "tanh(" },
  { label: "x²", insert: "x^2" },
  { label: "x³", insert: "x^3" },
  { label: "eˣ", insert: "e^x" },
  { label: "⌊x⌋", insert: "floor(" },
  { label: "⌈x⌉", insert: "ceil(" },
  { label: "sgn", insert: "sign(" },
  { label: "mod", insert: " mod " },
  { label: "max", insert: "max(" },
  { label: "min", insert: "min(" },
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

function PowerModal({ onInsert, onClose }) {
  const [base, setBase] = useState("x");
  const [exp, setExp] = useState("2");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="rounded-2xl p-6 w-80 animate-fade"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(4,10,28,0.95)",
          border: "1px solid rgba(6,182,212,0.25)",
          boxShadow: "0 0 40px rgba(6,182,212,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <span style={{ color: "#22d3ee", fontSize: "1.2rem" }}>xⁿ</span>
          <span
            className="font-orbitron text-xs tracking-widest uppercase"
            style={{ color: "#22d3ee" }}
          >
            Power Input
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <div
              className="font-mono-code text-[10px] mb-1.5"
              style={{ color: "#475569" }}
            >
              Base
            </div>
            <input
              className="nova-input"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              placeholder="x"
              autoFocus
            />
          </div>
          <span
            className="font-orbitron text-xl mt-5"
            style={{ color: "#22d3ee" }}
          >
            ^
          </span>
          <div className="flex-1">
            <div
              className="font-mono-code text-[10px] mb-1.5"
              style={{ color: "#475569" }}
            >
              Exponent
            </div>
            <input
              className="nova-input"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              placeholder="2"
              onKeyDown={(e) =>
                e.key === "Enter" && (onInsert(`(${base})^(${exp})`), onClose())
              }
            />
          </div>
        </div>
        <div
          className="mb-4 px-3 py-2 rounded-lg font-mono-code text-sm text-center"
          style={{
            background: "rgba(6,182,212,0.06)",
            border: "1px solid rgba(6,182,212,0.15)",
            color: "#22d3ee",
          }}
        >
          ({base || "…"}) ^ ({exp || "…"})
        </div>
        <div className="mb-4">
          <div
            className="font-mono-code text-[9px] tracking-widest uppercase mb-2"
            style={{ color: "#334155" }}
          >
            Quick Presets
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              ["x²", "x", "2"],
              ["x³", "x", "3"],
              ["x⁴", "x", "4"],
              ["x½", "x", "0.5"],
              ["eˣ", "e", "x"],
              ["10ˣ", "10", "x"],
            ].map(([lbl, b, ex]) => (
              <button
                key={lbl}
                className="sym-btn-nova"
                onClick={() => {
                  setBase(b);
                  setExp(ex);
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl font-mono-code text-xs transition-all"
            style={{
              background: "transparent",
              border: "1px solid rgba(6,182,212,0.2)",
              color: "#475569",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)";
              e.currentTarget.style.color = "#22d3ee";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(6,182,212,0.2)";
              e.currentTarget.style.color = "#475569";
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onInsert(`(${base})^(${exp})`);
              onClose();
            }}
            className="flex-1 py-2 rounded-xl font-mono-code text-xs font-semibold transition-all"
            style={{
              background: "rgba(6,182,212,0.12)",
              border: "1px solid rgba(6,182,212,0.35)",
              color: "#22d3ee",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(6,182,212,0.22)";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(6,182,212,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(6,182,212,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Insert xⁿ
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [showPower, setShowPower] = useState(false);
  const activePlot = plots.find((p) => p.id === activeId);

  const handleExprChange = (val) => {
    setError("");
    if (activePlot) updatePlot(activeId, { expr: val, label: val });
  };

  const insertSymbol = (sym) => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
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

  return (
    <div className="flex flex-col font-rajdhani">
      {showPower && (
        <PowerModal
          onInsert={insertSymbol}
          onClose={() => setShowPower(false)}
        />
      )}

      {/* Functions list */}
      <div
        className="p-4 border-b"
        style={{ borderColor: "rgba(6,182,212,0.08)" }}
      >
        <div className="section-label">Functions</div>
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
              <span
                className="flex-1 font-mono-code text-xs truncate"
                style={{ color: plot.expr ? "#94a3b8" : "#334155" }}
              >
                {plot.expr || "empty function…"}
              </span>
              <div
                className="flex items-center gap-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
                style={{ opacity: plot.id === activeId ? 1 : undefined }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updatePlot(plot.id, { visible: !plot.visible });
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded text-[10px] transition-colors"
                  style={{ color: plot.visible ? plot.color : "#334155" }}
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

      {/* Expression editor */}
      {activePlot && (
        <div
          className="p-4 border-b animate-fade"
          style={{ borderColor: "rgba(6,182,212,0.08)" }}
        >
          <div className="section-label">Expression Editor</div>

          {/* Color picker */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="relative">
              <input
                type="color"
                value={activePlot.color}
                onChange={(e) =>
                  updatePlot(activeId, { color: e.target.value })
                }
                className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0.5"
                style={{
                  background: "rgba(4,10,24,0.8)",
                  border: "1px solid rgba(6,182,212,0.2)",
                }}
                title="Curve color"
              />
            </div>
            <span
              className="font-mono-code text-[11px]"
              style={{ color: "#475569" }}
            >
              Color
            </span>
            <div className="ml-auto flex gap-1 flex-wrap justify-end">
              {PLOT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => updatePlot(activeId, { color: c })}
                  className="w-4 h-4 rounded-full transition-transform hover:scale-110 flex-shrink-0 border border-transparent hover:border-white/20"
                  style={{
                    background: c,
                    boxShadow: activePlot.color === c ? `0 0 6px ${c}` : "none",
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
            <div className="flex items-center px-3 py-3 gap-2">
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
                placeholder="e.g. sin(x) + cos(2*x)"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-2 px-3 py-2 rounded-lg font-mono-code text-[11px] flex items-start gap-2"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
              }}
            >
              <span className="flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Symbol grid */}
          <div
            className="font-mono-code text-[9px] tracking-widest uppercase mb-2"
            style={{ color: "#334155" }}
          >
            Quick Insert
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            <button
              className="sym-btn-nova"
              style={{ color: "#a78bfa", borderColor: "rgba(139,92,246,0.25)" }}
              onClick={() => setShowPower(true)}
              title="Power expression"
            >
              xⁿ
            </button>
            {SYMBOLS.map((s) => (
              <button
                key={s.label}
                className="sym-btn-nova"
                onClick={() => insertSymbol(s.insert)}
                title={s.insert}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div
            className="mt-2 font-mono-code text-[10px] leading-relaxed"
            style={{ color: "#334155" }}
          >
            <span style={{ color: "#475569" }}>Var:</span>{" "}
            <code
              className="px-1 rounded"
              style={{ color: "#22d3ee", background: "rgba(6,182,212,0.08)" }}
            >
              x
            </code>
            {"  "}
            <span style={{ color: "#475569" }}>Constants:</span>{" "}
            {["pi", "e", "phi", "omega"].map((c) => (
              <code
                key={c}
                className="px-1 rounded mr-0.5"
                style={{ color: "#22d3ee", background: "rgba(6,182,212,0.08)" }}
              >
                {c}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* View range */}
      <div
        className="p-4 border-b"
        style={{ borderColor: "rgba(6,182,212,0.08)" }}
      >
        <div className="section-label">View Range</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            ["X min", xMin, setXMin],
            ["X max", xMax, setXMax],
          ].map(([lbl, val, set]) => (
            <label key={lbl} className="flex flex-col gap-1.5">
              <span
                className="font-mono-code text-[10px] tracking-wider"
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
        <div
          className="flex items-center gap-3 mb-2 cursor-pointer"
          onClick={() => setAutoY((v) => !v)}
        >
          <div className={`toggle-track-nova ${autoY ? "on" : ""}`}>
            <div className="toggle-thumb-nova" />
          </div>
          <span
            className="font-mono-code text-xs"
            style={{ color: autoY ? "#22d3ee" : "#475569" }}
          >
            Auto Y range
          </span>
        </div>
        {!autoY && (
          <div className="grid grid-cols-2 gap-2 animate-slide-down">
            {[
              ["Y min", yMin, setYMin],
              ["Y max", yMax, setYMax],
            ].map(([lbl, val, set]) => (
              <label key={lbl} className="flex flex-col gap-1.5">
                <span
                  className="font-mono-code text-[10px] tracking-wider"
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
