import { useTheme } from "../ThemeContext";
import React, { useState } from "react";

const CATEGORIES = [
  {
    name: "Trigonometry",
    icon: "〜",
    color: "#22d3ee",
    desc: "Sine, cosine and their combinations",
    examples: [
      {
        label: "Sine wave",
        expr: "sin(x)",
        xMin: -10,
        xMax: 10,
        desc: "The classic wave — repeats every 2π",
      },
      {
        label: "Cosine wave",
        expr: "cos(x)",
        xMin: -10,
        xMax: 10,
        desc: "Cosine — shifted sine by π/2",
      },
      {
        label: "Tangent",
        expr: "tan(x)",
        xMin: -5,
        xMax: 5,
        desc: "Has vertical asymptotes at ±π/2",
      },
      {
        label: "Sinc function",
        expr: "sin(x) / x",
        xMin: -20,
        xMax: 20,
        desc: "sin(x)/x — used in signal processing",
      },
      {
        label: "Damped sine",
        expr: "sin(x) * e^(-x/5)",
        xMin: -5,
        xMax: 20,
        desc: "Oscillation that fades over time",
      },
      {
        label: "Double angle",
        expr: "sin(2*x)",
        xMin: -10,
        xMax: 10,
        desc: "Twice the frequency of sin(x)",
      },
      {
        label: "Beat frequency",
        expr: "sin(x) + sin(1.1*x)",
        xMin: -50,
        xMax: 50,
        desc: "Two close frequencies produce 'beats'",
      },
      {
        label: "sin(x²)",
        expr: "sin(x^2)",
        xMin: -6,
        xMax: 6,
        desc: "Chirp: frequency increases with x",
      },
      {
        label: "Harmonic sum",
        expr: "sin(x) + sin(3*x)/3 + sin(5*x)/5",
        xMin: -10,
        xMax: 10,
        desc: "Fourier series building a square wave",
      },
    ],
  },
  {
    name: "Euler's Formula",
    icon: "ε",
    color: "#34d399",
    desc: "e^(ix) = cos(x) + i·sin(x)",
    examples: [
      {
        label: "cos(x) = Re[e^(ix)]",
        expr: "cos(x)",
        xMin: -8,
        xMax: 8,
        desc: "Real part of Euler's formula",
      },
      {
        label: "sin(x) = Im[e^(ix)]",
        expr: "sin(x)",
        xMin: -8,
        xMax: 8,
        desc: "Imaginary part of Euler's formula",
      },
      {
        label: "Damped oscillation",
        expr: "e^(-0.3*x) * cos(2*pi*x)",
        xMin: 0,
        xMax: 10,
        desc: "Decaying wave — RLC circuits, springs",
      },
      {
        label: "Gaussian wave",
        expr: "e^(-x^2) * cos(5*x)",
        xMin: -4,
        xMax: 4,
        desc: "Bell-envelope modulated wave",
      },
      {
        label: "cos²+sin²=1",
        expr: "cos(x)^2 + sin(x)^2",
        xMin: -8,
        xMax: 8,
        desc: "Pythagorean identity — always 1",
      },
      {
        label: "cos(x)·sin(x)",
        expr: "cos(x) * sin(x)",
        xMin: -8,
        xMax: 8,
        desc: "Equals sin(2x)/2",
      },
      {
        label: "Interference",
        expr: "cos(x) + cos(1.05*x)",
        xMin: -60,
        xMax: 60,
        desc: "Nearly-same frequencies cancel/reinforce",
      },
    ],
  },
  {
    name: "Exponential & Log",
    icon: "eˣ",
    color: "#10b981",
    desc: "Growth, decay and logarithms",
    examples: [
      {
        label: "Gaussian bell",
        expr: "e^(-x^2)",
        xMin: -4,
        xMax: 4,
        desc: "Normal/Gaussian distribution shape",
      },
      {
        label: "Exponential growth",
        expr: "e^x",
        xMin: -5,
        xMax: 3,
        desc: "Doubles every ln(2) ≈ 0.69 units",
      },
      {
        label: "e^(sin x)",
        expr: "e^(sin(x))",
        xMin: -10,
        xMax: 10,
        desc: "Exponential with oscillating exponent",
      },
      {
        label: "Natural log ln(x)",
        expr: "log(x)",
        xMin: 0.01,
        xMax: 10,
        desc: "Inverse of e^x; undefined for x≤0",
      },
      {
        label: "x·ln(x)",
        expr: "x * log(x)",
        xMin: 0.01,
        xMax: 5,
        desc: "Appears in entropy formulas",
      },
      {
        label: "ln(|sin x|)",
        expr: "log(abs(sin(x)))",
        xMin: -10,
        xMax: 10,
        desc: "Stretches near zero-crossings",
      },
      {
        label: "Logistic curve",
        expr: "1 / (1 + e^(-x))",
        xMin: -8,
        xMax: 8,
        desc: "S-curve used in neural networks",
      },
      {
        label: "Decay e^(−x)",
        expr: "e^(-x)",
        xMin: -2,
        xMax: 8,
        desc: "Radioactive decay, RC discharge",
      },
    ],
  },
  {
    name: "Polynomials",
    icon: "Pₙ",
    color: "#f59e0b",
    desc: "Powers and polynomial functions",
    examples: [
      {
        label: "Parabola x²",
        expr: "x^2",
        xMin: -5,
        xMax: 5,
        desc: "Simplest curved function; vertex at origin",
      },
      {
        label: "Cubic x³",
        expr: "x^3",
        xMin: -5,
        xMax: 5,
        desc: "Odd symmetry; inflection at origin",
      },
      {
        label: "Quartic x⁴−5x²",
        expr: "x^4 - 5*x^2",
        xMin: -4,
        xMax: 4,
        desc: "Two-well potential; double minimum",
      },
      {
        label: "Quintic",
        expr: "x^5 - 4*x^3 + 3*x",
        xMin: -3,
        xMax: 3,
        desc: "Legendre-like polynomial with 5 roots",
      },
      {
        label: "Runge function",
        expr: "1 / (1 + 25*x^2)",
        xMin: -2,
        xMax: 2,
        desc: "Classic interpolation challenge",
      },
      {
        label: "x·(x−1)·(x+1)",
        expr: "x * (x-1) * (x+1)",
        xMin: -2,
        xMax: 2,
        desc: "Roots at −1, 0, 1",
      },
      {
        label: "x⁴ − 1",
        expr: "x^4 - 1",
        xMin: -2,
        xMax: 2,
        desc: "Roots at ±1; flat near zero",
      },
    ],
  },
  {
    name: "Special Functions",
    icon: "✦",
    color: "#f472b6",
    desc: "Piecewise, floor, and special math",
    examples: [
      {
        label: "Absolute value |x|",
        expr: "abs(x)",
        xMin: -5,
        xMax: 5,
        desc: "V-shape; distance from zero",
      },
      {
        label: "Floor ⌊x⌋",
        expr: "floor(x)",
        xMin: -5,
        xMax: 5,
        desc: "Round down to nearest integer",
      },
      {
        label: "Sawtooth wave",
        expr: "x - floor(x)",
        xMin: -5,
        xMax: 5,
        desc: "Rises from 0 to 1, then resets",
      },
      {
        label: "Triangle wave",
        expr: "abs(x - 2*floor(x/2+0.5))",
        xMin: -8,
        xMax: 8,
        desc: "Linear zigzag between 0 and 1",
      },
      {
        label: "tanh (sigmoid)",
        expr: "tanh(x)",
        xMin: -5,
        xMax: 5,
        desc: "Smooth step from −1 to +1",
      },
      {
        label: "Sign function",
        expr: "sign(x)",
        xMin: -5,
        xMax: 5,
        desc: "Returns −1, 0, or +1",
      },
      {
        label: "Heaviside step",
        expr: "(sign(x)+1)/2",
        xMin: -5,
        xMax: 5,
        desc: "0 for x<0, 1 for x>0",
      },
    ],
  },
  {
    name: "Physics",
    icon: "⚛",
    color: "#a78bfa",
    desc: "Waves, oscillations and physical laws",
    examples: [
      {
        label: "Simple harmonic",
        expr: "cos(2*pi*x)",
        xMin: 0,
        xMax: 4,
        desc: "One oscillation per unit",
      },
      {
        label: "Damped spring",
        expr: "e^(-0.5*x) * cos(2*pi*x)",
        xMin: 0,
        xMax: 8,
        desc: "Under-damped spring oscillator",
      },
      {
        label: "Overdamped",
        expr: "e^(-x) - e^(-3*x)",
        xMin: 0,
        xMax: 5,
        desc: "Overdamped system returning to equilibrium",
      },
      {
        label: "AC Power",
        expr: "sin(x)^2",
        xMin: 0,
        xMax: 15,
        desc: "Instantaneous power in AC circuit",
      },
      {
        label: "Resonance peak",
        expr: "1 / sqrt((1-x^2)^2 + (0.2*x)^2)",
        xMin: 0,
        xMax: 3,
        desc: "Resonance frequency response; peak at ω=1",
      },
      {
        label: "Blackbody (approx)",
        expr: "x^3 / (e^x - 1)",
        xMin: 0.1,
        xMax: 10,
        desc: "Planck distribution shape — peak ~3",
      },
      {
        label: "Potential well",
        expr: "-1/(abs(x) + 0.3)",
        xMin: -5,
        xMax: 5,
        desc: "Coulomb/gravitational potential",
      },
      {
        label: "Doppler chirp",
        expr: "sin(x + 0.1*x^2)",
        xMin: 0,
        xMax: 15,
        desc: "Frequency that shifts with position",
      },
    ],
  },
  {
    name: "Number Theory",
    icon: "ℕ",
    color: "#fb923c",
    desc: "Arithmetic and integer-related functions",
    examples: [
      {
        label: "Mod 2 (parity)",
        expr: "x mod 2",
        xMin: -8,
        xMax: 8,
        desc: "Remainder after dividing by 2",
      },
      {
        label: "Fractional part",
        expr: "x - floor(x)",
        xMin: -4,
        xMax: 4,
        desc: "Decimal part of x; 0 to 1 cycle",
      },
      {
        label: "Integer part",
        expr: "floor(x)",
        xMin: -4,
        xMax: 4,
        desc: "Rounds down to nearest whole number",
      },
      {
        label: "Staircase",
        expr: "floor(x/1.5) * 1.5",
        xMin: -6,
        xMax: 6,
        desc: "Step function with spacing 1.5",
      },
      {
        label: "GCD pattern",
        expr: "sin(pi*x) * sin(pi*x*2) / 2",
        xMin: -4,
        xMax: 4,
        desc: "Product of harmonics — peaks at integers",
      },
      {
        label: "Primes approx.",
        expr: "x / log(x + 0.01)",
        xMin: 0,
        xMax: 20,
        desc: "π(x) ≈ x/ln(x) prime counting estimate",
      },
    ],
  },
];

export default function ExamplesPanel({ onLoad }) {
  const { isDark } = useTheme();
  const [openCat, setOpenCat] = useState("Trigonometry");
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? CATEGORIES.map((cat) => ({
        ...cat,
        examples: cat.examples.filter(
          (ex) =>
            ex.label.toLowerCase().includes(search.toLowerCase()) ||
            ex.expr.toLowerCase().includes(search.toLowerCase()) ||
            (ex.desc || "").toLowerCase().includes(search.toLowerCase()),
        ),
      })).filter((cat) => cat.examples.length > 0)
    : CATEGORIES;

  const totalCount = CATEGORIES.reduce((n, c) => n + c.examples.length, 0);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="font-orbitron text-[9px] tracking-[3px] uppercase"
          style={{ color: "#164e63" }}
        >
          Examples
        </div>
        <span
          className="font-mono-code text-[9px] px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(6,182,212,0.07)",
            border: "1px solid rgba(6,182,212,0.12)",
            color: "#22d3ee",
          }}
        >
          {totalCount} functions
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-code text-[11px] pointer-events-none"
          style={{ color: "#334155" }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search examples…"
          spellCheck={false}
          style={{
            width: "100%",
            background: "rgba(2,10,20,0.9)",
            border: "1px solid rgba(6,182,212,0.15)",
            borderRadius: 10,
            color: "#64748b",
            fontFamily: "'Nunito', system-ui, -apple-system, sans-serif",
            fontSize: "0.78rem",
            padding: "7px 32px 7px 30px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.45)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.15)")}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono-code text-[10px] w-5 h-5 flex items-center justify-center rounded"
            style={{ color: "#334155" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
          >
            ✕
          </button>
        )}
      </div>

      {/* Category accordion */}
      <div className="flex flex-col gap-2">
        {filtered.map((cat) => {
          const isOpen = openCat === cat.name || !!search;
          return (
            <div key={cat.name}>
              {/* Category header */}
              <button
                onClick={() =>
                  setOpenCat(openCat === cat.name ? null : cat.name)
                }
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: isOpen ? `${cat.color}0d` : isDark ? "rgba(2,8,20,0.5)" : "rgba(255,255,255,0.88)",
                  border: `1px solid ${isOpen ? cat.color + "30" : "rgba(6,182,212,0.07)"}`,
                }}
              >
                {/* Icon */}
                <span
                  className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 text-sm"
                  style={{
                    background: `${cat.color}12`,
                    border: `1px solid ${cat.color}25`,
                  }}
                >
                  {cat.icon}
                </span>

                {/* Name + desc */}
                <div className="flex-1 text-left min-w-0">
                  <div
                    className="font-rajdhani text-xs font-semibold"
                    style={{ color: isOpen ? cat.color : "#475569" }}
                  >
                    {cat.name}
                  </div>
                  {!search && (
                    <div
                      className="font-rajdhani text-[9px] truncate"
                      style={{ color: "#164e63" }}
                    >
                      {cat.desc}
                    </div>
                  )}
                </div>

                {/* Count + arrow */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className="font-mono-code text-[9px] px-1.5 py-0.5 rounded-md"
                    style={{ background: `${cat.color}15`, color: cat.color }}
                  >
                    {cat.examples.length}
                  </span>
                  <span
                    className="font-mono-code text-[9px]"
                    style={{ color: "#334155" }}
                  >
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Examples list */}
              {isOpen && (
                <div className="mt-1.5 ml-1 flex flex-col gap-1">
                  {cat.examples.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => onLoad(ex)}
                      className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 group"
                      style={{
                        background: isDark ? "rgba(2,8,20,0.4)" : "rgba(255,255,255,0.88)",
                        border: "1px solid rgba(6,182,212,0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${cat.color}09`;
                        e.currentTarget.style.borderColor = `${cat.color}28`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDark ? "rgba(2,8,20,0.4)" : "rgba(255,255,255,0.88)";
                        e.currentTarget.style.borderColor =
                          "rgba(6,182,212,0.05)";
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          {/* Label + expression */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="font-rajdhani text-xs font-semibold"
                              style={{ color: "#64748b" }}
                            >
                              {ex.label}
                            </span>
                            <code
                              className="font-mono-code text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
                              style={{
                                background: `${cat.color}12`,
                                color: cat.color,
                              }}
                            >
                              {ex.expr}
                            </code>
                          </div>
                          {/* Description */}
                          {ex.desc && (
                            <div
                              className="font-rajdhani text-[9px] mt-0.5 leading-relaxed"
                              style={{ color: "#1e3a5f" }}
                            >
                              {ex.desc}
                            </div>
                          )}
                        </div>
                        {/* Arrow */}
                        <span
                          className="font-mono-code text-[10px] flex-shrink-0 mt-0.5 transition-all"
                          style={{ color: "#164e63" }}
                        >
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-8 flex flex-col items-center gap-2">
            <div
              className="font-mono-code text-2xl"
              style={{ color: "rgba(6,182,212,0.1)" }}
            >
              ∿
            </div>
            <div
              className="font-mono-code text-xs"
              style={{ color: "#334155" }}
            >
              No examples match
            </div>
            <div
              className="font-rajdhani text-[10px]"
              style={{ color: "#164e63" }}
            >
              Try: sin, cos, log, x^2…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
