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
        label: "Witch of Agnesi",
        expr: "1 / (1 + x^2)",
        xMin: -6,
        xMax: 6,
        desc: "Bell curve; Cauchy distribution",
      },
      {
        label: "Sign function",
        expr: "sign(x)",
        xMin: -3,
        xMax: 3,
        desc: "Returns −1, 0, or +1",
      },
      {
        label: "Step / Heaviside",
        expr: "(sign(x) + 1) / 2",
        xMin: -5,
        xMax: 5,
        desc: "0 for x<0, 1 for x>0",
      },
    ],
  },
  {
    name: "Beautiful Curves",
    icon: "✧",
    color: "#a78bfa",
    desc: "Visually striking mathematical shapes",
    examples: [
      {
        label: "Chirp sin(x²)",
        expr: "sin(x^2)",
        xMin: -10,
        xMax: 10,
        desc: "Frequency increases — like a radar chirp",
      },
      {
        label: "Fourier square wave",
        expr: "sin(x) + sin(3*x)/3 + sin(5*x)/5 + sin(7*x)/7",
        xMin: -10,
        xMax: 10,
        desc: "Odd harmonics approximate a square wave",
      },
      {
        label: "Dragon curve",
        expr: "sin(x) * cos(x^2/4)",
        xMin: -6,
        xMax: 6,
        desc: "Amplitude-modulated oscillation",
      },
      {
        label: "Superposition",
        expr: "sin(x) + sin(sqrt(2)*x)",
        xMin: -30,
        xMax: 30,
        desc: "Incommensurable frequencies — never repeats",
      },
      {
        label: "Butterfly",
        expr: "e^(cos(x)) - 2*cos(4*x) - sin(x/12)^5",
        xMin: -10,
        xMax: 10,
        desc: "Famed butterfly curve component",
      },
      {
        label: "Spiral decay",
        expr: "x * e^(-x^2/10) * sin(x)",
        xMin: -12,
        xMax: 12,
        desc: "Outward spiral then inward decay",
      },
      {
        label: "Twin peaks",
        expr: "e^(-x^2)*sin(3*x) + e^(-(x-4)^2)*sin(2*x)",
        xMin: -4,
        xMax: 8,
        desc: "Interference between two Gaussian packets",
      },
      {
        label: "Clover spiral",
        expr: "sin(3*x) * cos(x)",
        xMin: -8,
        xMax: 8,
        desc: "Three-petal rose function projected to 1D",
      },
    ],
  },
  {
    name: "Physics & Engineering",
    icon: "⚛",
    color: "#60a5fa",
    desc: "Functions from real-world models",
    examples: [
      {
        label: "Simple harmonic",
        expr: "cos(2*pi*x)",
        xMin: 0,
        xMax: 4,
        desc: "One oscillation per unit — simple harmonic motion",
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
        desc: "Instantaneous power in AC circuit (always ≥ 0)",
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

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="section-label">Examples</div>
        <span
          className="font-mono-code text-[9px]"
          style={{ color: "#334155" }}
        >
          {CATEGORIES.reduce((n, c) => n + c.examples.length, 0)} functions
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <input
          className="nova-input w-full text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search examples…"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 font-mono-code text-[10px]"
            style={{ color: "#475569" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Category accordion */}
      <div className="flex flex-col gap-2">
        {filtered.map((cat) => (
          <div key={cat.name}>
            {/* Category header */}
            <button
              onClick={() => setOpenCat(openCat === cat.name ? null : cat.name)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
              style={{
                background:
                  openCat === cat.name ? `${cat.color}10` : "rgba(4,10,24,0.5)",
                border: `1px solid ${openCat === cat.name ? cat.color + "35" : "rgba(6,182,212,0.07)"}`,
              }}
            >
              <span className="text-sm flex-shrink-0">{cat.icon}</span>
              <div className="flex-1 text-left">
                <div
                  className="font-rajdhani text-xs font-semibold"
                  style={{
                    color: openCat === cat.name ? cat.color : "#64748b",
                  }}
                >
                  {cat.name}
                </div>
                {!search && (
                  <div
                    className="font-rajdhani text-[9px]"
                    style={{ color: "#1e3a5f" }}
                  >
                    {cat.desc}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className="font-mono-code text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: `${cat.color}15`, color: cat.color }}
                >
                  {cat.examples.length}
                </span>
                <span
                  className="font-mono-code text-[10px]"
                  style={{ color: "#334155" }}
                >
                  {openCat === cat.name ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {/* Examples list */}
            {(openCat === cat.name || search) && (
              <div className="mt-1 ml-1 flex flex-col gap-1">
                {cat.examples.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => onLoad(ex)}
                    className="w-full text-left px-3 py-2 rounded-xl transition-all group"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(6,182,212,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${cat.color}08`;
                      e.currentTarget.style.borderColor = `${cat.color}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor =
                        "rgba(6,182,212,0.06)";
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        {/* Label + expression */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-rajdhani text-xs font-semibold"
                            style={{ color: "#94a3b8" }}
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
                            className="font-rajdhani text-[10px] mt-0.5"
                            style={{ color: "#334155" }}
                          >
                            {ex.desc}
                          </div>
                        )}
                      </div>
                      {/* Load arrow */}
                      <span
                        className="font-mono-code text-[10px] flex-shrink-0 mt-0.5"
                        style={{ color: "#1e3a5f" }}
                      >
                        →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-6">
            <div
              className="font-mono-code text-xs"
              style={{ color: "#334155" }}
            >
              No examples match
            </div>
            <div
              className="font-rajdhani text-[10px] mt-1"
              style={{ color: "#1e293b" }}
            >
              Try: sin, cos, log, x^2…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
