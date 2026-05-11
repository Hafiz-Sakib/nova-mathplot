import React, { useRef, useState } from "react";
import { useTheme } from "../ThemeContext";

const SYMBOLS = [
  { label: "sin", insert: "sin(", desc: "Sine" },
  { label: "cos", insert: "cos(", desc: "Cosine" },
  { label: "tan", insert: "tan(", desc: "Tangent" },
  { label: "√x", insert: "sqrt(", desc: "Square root" },
  { label: "|x|", insert: "abs(", desc: "Absolute value" },
  { label: "ln", insert: "log(", desc: "Natural log" },
  { label: "log₁₀", insert: "log10(", desc: "Log base 10" },
  { label: "eˣ", insert: "e^x", desc: "Exponential" },
  { label: "x²", insert: "x^2", desc: "x squared" },
  { label: "x³", insert: "x^3", desc: "x cubed" },
  { label: "π", insert: "pi", desc: "Pi ≈ 3.14159" },
  { label: "e", insert: "e", desc: "Euler ≈ 2.718" },
  { label: "φ", insert: "phi", desc: "Golden ratio" },
  { label: "sinh", insert: "sinh(", desc: "Hyperbolic sin" },
  { label: "cosh", insert: "cosh(", desc: "Hyperbolic cos" },
  { label: "asin", insert: "asin(", desc: "Arcsin" },
  { label: "acos", insert: "acos(", desc: "Arccos" },
  { label: "atan", insert: "atan(", desc: "Arctan" },
  { label: "⌊x⌋", insert: "floor(", desc: "Floor" },
  { label: "⌈x⌉", insert: "ceil(", desc: "Ceiling" },
  { label: "mod", insert: " mod ", desc: "Modulo" },
];

const PLOT_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#f472b6",
  "#fb923c",
  "#60a5fa",
  "#fbbf24",
  "#4ade80",
];

const RANGE_PRESETS = [
  { label: "−10…10", xMin: -10, xMax: 10 },
  { label: "−π…π", xMin: -Math.PI, xMax: Math.PI },
  { label: "−2π…2π", xMin: -2 * Math.PI, xMax: 2 * Math.PI },
  { label: "0…10", xMin: 0, xMax: 10 },
  { label: "−5…5", xMin: -5, xMax: 5 },
  { label: "−20…20", xMin: -20, xMax: 20 },
];

const QUICK_EXPRS = [
  "sin(x)",
  "x^2",
  "e^(-x^2)",
  "tan(x)",
  "sin(x)/x",
  "abs(sin(x))",
  "x*sin(x)",
  "cos(x^2)",
];

const sb = { borderColor: "rgba(139,92,246,0.08)" };

function DarkInput({ value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  const { isDark } = useTheme();
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      spellCheck={false}
      autoComplete="off"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        background: isDark ? "rgba(2,6,20,0.9)" : "rgba(255,255,255,0.92)",
        border: `1px solid ${focused ? (isDark ? "rgba(139,92,246,0.55)" : "rgba(6,182,212,0.6)") : (isDark ? "rgba(139,92,246,0.2)" : "rgba(148,163,184,0.35)")}`,
        borderRadius: 8,
        color: isDark ? "#94a3b8" : "#0f172a",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.8rem",
        padding: "7px 10px",
        outline: "none",
        width: "100%",
        boxShadow: focused ? "0 0 0 2px rgba(139,92,246,0.08)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <div
      className="font-orbitron text-[9px] tracking-[3px] uppercase mb-3"
      style={{ color: "#3b1d8a" }}
    >
      {children}
    </div>
  );
}

function XnBuilder({ onInsert }) {
  const [coeff, setCoeff] = useState("1");
  const [exp, setExp] = useState("2");
  const preview = `${coeff === "1" ? "" : coeff + "*"}x^${exp}`;
  const miniInput = (val, set, label) => (
    <div className="flex flex-col gap-1">
      <span className="font-mono-code text-[9px]" style={{ color: "#475569" }}>
        {label}
      </span>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        style={{
          width: 52,
          background: "rgba(2,6,20,0.9)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 6,
          color: "#94a3b8",
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: "0.75rem",
          padding: "4px 6px",
          outline: "none",
        }}
      />
    </div>
  );
  return (
    <div
      className="p-3 rounded-xl mb-3"
      style={{
        background: "rgba(139,92,246,0.05)",
        border: "1px solid rgba(139,92,246,0.18)",
      }}
    >
      <div
        className="font-mono-code text-[9px] tracking-widest uppercase mb-2"
        style={{ color: "#3b1d8a" }}
      >
        xⁿ Builder
      </div>
      <div className="flex items-end gap-2 flex-wrap">
        {miniInput(coeff, setCoeff, "coeff")}
        <span
          className="font-mono-code text-lg pb-1"
          style={{ color: "#a78bfa" }}
        >
          × x ^
        </span>
        {miniInput(exp, setExp, "power n")}
        <button
          onClick={() => onInsert(preview)}
          style={{
            padding: "5px 14px",
            borderRadius: 8,
            marginBottom: 0,
            background: "rgba(139,92,246,0.18)",
            border: "1px solid rgba(139,92,246,0.4)",
            color: "#a78bfa",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "0.72rem",
            cursor: "pointer",
          }}
        >
          Insert
        </button>
      </div>
      <div
        className="font-mono-code text-[10px] mt-2"
        style={{ color: "#64748b" }}
      >
        Preview: <span style={{ color: "#c4b5fd" }}>{preview}</span>
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
  const [showGuide, setShowGuide] = useState(false);
  const [showXn, setShowXn] = useState(false);
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
      input.setSelectionRange(start + sym.length, start + sym.length);
    }, 0);
  };

  return (
    <div className="flex flex-col">
      {/* FUNCTIONS LIST */}
      <div className="p-4 border-b" style={sb}>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Functions</SectionLabel>
          <span
            className="font-mono-code text-[9px] px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.18)",
              color: "#a78bfa",
            }}
          >
            {plots.filter((p) => p.visible && p.expr).length} active
          </span>
        </div>

        <div className="flex flex-col gap-1.5 mb-3">
          {plots.map((plot, idx) => {
            const isActive = plot.id === activeId;
            const c = plot.color || PLOT_COLORS[idx % PLOT_COLORS.length];
            return (
              <div
                key={plot.id}
                onClick={() => setActiveId(plot.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: isActive ? `${c}10` : "rgba(2,6,20,0.5)",
                  border: `1px solid ${isActive ? c + "45" : "rgba(139,92,246,0.07)"}`,
                  boxShadow: isActive ? `0 0 14px ${c}18` : "none",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: c,
                    boxShadow: `0 0 ${isActive ? "8px" : "4px"} ${c}`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="font-mono-code text-xs truncate"
                    style={{ color: plot.expr ? "#64748b" : "#2d1b69" }}
                  >
                    {plot.expr || (
                      <em style={{ color: "#2d1b69", fontStyle: "italic" }}>
                        empty — click to edit
                      </em>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePlot(plot.id, { visible: !plot.visible });
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-[11px]"
                    style={{
                      color: plot.visible ? c : "#2d1b69",
                      background: plot.visible ? `${c}14` : "transparent",
                    }}
                  >
                    {plot.visible ? "●" : "○"}
                  </button>
                  {plots.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePlot(plot.id);
                      }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg text-[11px] transition-all"
                      style={{ color: "#2d1b69" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#f87171";
                        e.currentTarget.style.background =
                          "rgba(248,113,113,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#2d1b69";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => addPlot()}
          className="w-full py-2.5 rounded-xl font-mono-code text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            color: "#3b1d8a",
            border: "1px dashed rgba(139,92,246,0.22)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139,92,246,0.07)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
            e.currentTarget.style.color = "#a78bfa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.22)";
            e.currentTarget.style.color = "#3b1d8a";
          }}
        >
          <span style={{ fontSize: "1rem" }}>+</span> Add Function
        </button>
      </div>

      {/* EXPRESSION EDITOR */}
      {activePlot && (
        <div className="p-4 border-b" style={sb}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
            <SectionLabel>Edit f(x)</SectionLabel>
            <div className="flex gap-1">
              <button
                onClick={() => setShowXn((v) => !v)}
                className="font-mono-code text-[9px] px-2 py-0.5 rounded transition-all"
                style={{
                  background: showXn ? "rgba(139,92,246,0.18)" : "transparent",
                  border: "1px solid rgba(139,92,246,0.28)",
                  color: showXn ? "#a78bfa" : "#475569",
                }}
              >
                xⁿ
              </button>
              <button
                onClick={() => setShowGuide((v) => !v)}
                className="font-mono-code text-[9px] px-2 py-0.5 rounded transition-all"
                style={{
                  background: showGuide
                    ? "rgba(139,92,246,0.1)"
                    : "transparent",
                  border: "1px solid rgba(139,92,246,0.2)",
                  color: showGuide ? "#a78bfa" : "#475569",
                }}
              >
                {showGuide ? "▲ Hide" : "? Guide"}
              </button>
            </div>
          </div>

          {showXn && (
            <XnBuilder
              onInsert={(s) => {
                insertSymbol(s);
                setShowXn(false);
              }}
            />
          )}

          {showGuide && (
            <div
              className="mb-3 p-3 rounded-xl"
              style={{
                background: "rgba(139,92,246,0.04)",
                border: "1px solid rgba(139,92,246,0.12)",
              }}
            >
              <div
                className="font-mono-code text-[9px] tracking-widest uppercase mb-2"
                style={{ color: "#3b1d8a" }}
              >
                Syntax
              </div>
              {[
                ["x^2", "x squared"],
                ["2*x", "multiply"],
                ["sin(x)", "sine"],
                ["e^(-x)", "decay"],
                ["sqrt(x)", "root"],
                ["x mod 2", "remainder"],
                ["pi, e, phi", "constants"],
              ].map(([inp, means]) => (
                <div key={inp} className="flex items-center gap-2 mb-1">
                  <code
                    className="font-mono-code text-[10px] px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(139,92,246,0.1)",
                      color: "#a78bfa",
                      minWidth: 80,
                    }}
                  >
                    {inp}
                  </code>
                  <span
                    className="font-rajdhani text-[10px]"
                    style={{ color: "#475569" }}
                  >
                    {means}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Color row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <input
              type="color"
              value={activePlot.color}
              onChange={(e) => updatePlot(activeId, { color: e.target.value })}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "1px solid rgba(139,92,246,0.2)",
                background: "rgba(2,6,20,0.9)",
                cursor: "pointer",
                padding: 2,
                flexShrink: 0,
              }}
            />
            <span
              className="font-mono-code text-[9px]"
              style={{ color: "#334155" }}
            >
              Color:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {PLOT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => updatePlot(activeId, { color: c })}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: c,
                    flexShrink: 0,
                    border: `2px solid ${activePlot.color === c ? "rgba(255,255,255,0.7)" : "transparent"}`,
                    boxShadow: activePlot.color === c ? `0 0 7px ${c}` : "none",
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Expression box */}
          <div
            className="relative rounded-xl overflow-hidden mb-2"
            style={{
              background: "rgba(2,6,20,0.9)",
              border: "1px solid rgba(139,92,246,0.28)",
            }}
          >
            <div
              className="flex items-center gap-2 px-3 pt-2 pb-1"
              style={{ borderBottom: "1px solid rgba(139,92,246,0.08)" }}
            >
              <span
                className="font-mono-code text-[9px] tracking-widest uppercase"
                style={{ color: "#3b1d8a" }}
              >
                Expression
              </span>
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{
                  background: activePlot.color,
                  boxShadow: `0 0 4px ${activePlot.color}`,
                }}
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span
                className="font-mono-code text-sm flex-shrink-0"
                style={{ color: "#a78bfa" }}
              >
                f(x) =
              </span>
              <input
                ref={inputRef}
                type="text"
                value={activePlot.expr}
                onChange={(e) => handleExprChange(e.target.value)}
                placeholder="e.g.  sin(x) + x^2"
                spellCheck={false}
                autoComplete="off"
                className="flex-1 bg-transparent outline-none font-mono-code text-sm"
                style={{ color: "#94a3b8", caretColor: "#a78bfa" }}
              />
              {activePlot.expr && (
                <button
                  onClick={() => handleExprChange("")}
                  title="Clear"
                  className="flex-shrink-0 font-mono-code text-[11px] w-5 h-5 flex items-center justify-center rounded"
                  style={{ color: "#334155" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#334155";
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {error && (
            <div
              className="mb-2 px-3 py-2 rounded-xl font-mono-code text-[10px] flex items-start gap-2"
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.22)",
                color: "#f87171",
              }}
            >
              <span>⚠</span>
              <div>
                {error}
                <div className="mt-0.5" style={{ color: "#6b7280" }}>
                  Use <code style={{ color: "#a78bfa" }}>*</code> to multiply ·{" "}
                  <code style={{ color: "#a78bfa" }}>^</code> for power
                </div>
              </div>
            </div>
          )}

          {/* Quick Insert */}
          <div
            className="font-mono-code text-[9px] tracking-widest uppercase mb-1.5 mt-1"
            style={{ color: "#3b1d8a" }}
          >
            Quick Insert
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {SYMBOLS.map((s) => (
              <button
                key={s.label}
                onClick={() => insertSymbol(s.insert)}
                title={`${s.insert} — ${s.desc}`}
                className="font-mono-code text-[10px] px-2 py-1 rounded-lg transition-all"
                style={{
                  background: "rgba(2,6,20,0.9)",
                  border: "1px solid rgba(139,92,246,0.12)",
                  color: "#475569",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.12)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
                  e.currentTarget.style.color = "#a78bfa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(2,6,20,0.9)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.12)";
                  e.currentTarget.style.color = "#475569";
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Try these */}
          <div
            className="font-mono-code text-[9px] tracking-widest uppercase mb-1.5"
            style={{ color: "#3b1d8a" }}
          >
            Try these
          </div>
          <div className="flex flex-wrap gap-1">
            {QUICK_EXPRS.map((ex) => {
              const isAct = activePlot?.expr === ex;
              return (
                <button
                  key={ex}
                  onClick={() => {
                    handleExprChange(ex);
                    inputRef.current?.focus();
                  }}
                  className="font-mono-code text-[9px] px-2 py-0.5 rounded transition-all"
                  style={{
                    background: isAct
                      ? "rgba(139,92,246,0.14)"
                      : "rgba(2,6,20,0.8)",
                    border: `1px solid ${isAct ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.1)"}`,
                    color: isAct ? "#a78bfa" : "#334155",
                  }}
                >
                  {ex}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW RANGE */}
      <div className="p-4 border-b" style={sb}>
        <SectionLabel>View Range</SectionLabel>
        <div className="mb-3">
          <div
            className="font-mono-code text-[9px] tracking-widest uppercase mb-1.5"
            style={{ color: "#3b1d8a" }}
          >
            X presets
          </div>
          <div className="flex flex-wrap gap-1">
            {RANGE_PRESETS.map((p) => {
              const isAct = xMin === p.xMin && xMax === p.xMax;
              return (
                <button
                  key={p.label}
                  onClick={() => {
                    setXMin(p.xMin);
                    setXMax(p.xMax);
                  }}
                  className="font-mono-code text-[9px] px-2.5 py-1 rounded-lg transition-all"
                  style={{
                    background: isAct
                      ? "rgba(139,92,246,0.14)"
                      : "rgba(2,6,20,0.8)",
                    border: `1px solid ${isAct ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.1)"}`,
                    color: isAct ? "#a78bfa" : "#475569",
                    boxShadow: isAct ? "0 0 8px rgba(139,92,246,0.12)" : "none",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            ["X min", xMin, setXMin],
            ["X max", xMax, setXMax],
          ].map(([lbl, val, set]) => (
            <label key={lbl} className="flex flex-col gap-1.5">
              <span
                className="font-mono-code text-[10px]"
                style={{ color: "#334155" }}
              >
                {lbl}
              </span>
              <DarkInput
                type="number"
                value={val}
                onChange={(e) => set(+e.target.value)}
              />
            </label>
          ))}
        </div>
        <div
          className="flex items-center gap-3 mb-2 cursor-pointer select-none p-2.5 rounded-xl transition-all"
          onClick={() => setAutoY((v) => !v)}
          style={{
            background: autoY ? "rgba(139,92,246,0.06)" : "rgba(2,6,20,0.4)",
            border: `1px solid ${autoY ? "rgba(139,92,246,0.25)" : "rgba(139,92,246,0.07)"}`,
          }}
        >
          <div
            className="flex-shrink-0 relative"
            style={{
              width: 34,
              height: 18,
              background: autoY ? "rgba(139,92,246,0.3)" : "rgba(4,8,28,0.8)",
              border: `1px solid ${autoY ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.15)"}`,
              borderRadius: 9,
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 2,
                left: autoY ? 16 : 2,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: autoY ? "#a78bfa" : "#334155",
                boxShadow: autoY ? "0 0 6px #a78bfa" : "none",
                transition: "all 0.2s",
              }}
            />
          </div>
          <div>
            <span
              className="font-mono-code text-xs"
              style={{ color: autoY ? "#a78bfa" : "#475569" }}
            >
              Auto Y range
            </span>
            <div
              className="font-rajdhani text-[9px]"
              style={{ color: "#3b1d8a" }}
            >
              {autoY
                ? "Y axis scales to fit the curve"
                : "Set Y bounds manually below"}
            </div>
          </div>
        </div>
        {!autoY && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              ["Y min", yMin, setYMin],
              ["Y max", yMax, setYMax],
            ].map(([lbl, val, set]) => (
              <label key={lbl} className="flex flex-col gap-1.5">
                <span
                  className="font-mono-code text-[10px]"
                  style={{ color: "#334155" }}
                >
                  {lbl}
                </span>
                <DarkInput
                  type="number"
                  value={val}
                  onChange={(e) => set(+e.target.value)}
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
