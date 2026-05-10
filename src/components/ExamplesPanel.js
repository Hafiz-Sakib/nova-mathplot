import React, { useState } from "react";

const CATEGORIES = [
  {
    name: "Trigonometry",
    icon: "〜",
    color: "#22d3ee",
    examples: [
      { label: "Sine Wave", expr: "sin(x)", xMin: -10, xMax: 10 },
      { label: "Cosine Wave", expr: "cos(x)", xMin: -10, xMax: 10 },
      { label: "Damped Sine", expr: "sin(x) * e^(-x/5)", xMin: -5, xMax: 20 },
      { label: "Tangent", expr: "tan(x)", xMin: -5, xMax: 5 },
      { label: "Sinc sin(x)/x", expr: "sin(x) / x", xMin: -20, xMax: 20 },
      { label: "sin(x²)", expr: "sin(x^2)", xMin: -6, xMax: 6 },
      {
        label: "Beat Frequency",
        expr: "sin(x) + sin(1.1*x)",
        xMin: -50,
        xMax: 50,
      },
    ],
  },
  {
    name: "Euler's Formula eⁱˣ",
    icon: "ε",
    color: "#34d399",
    examples: [
      { label: "Re[eⁱˣ] = cos(x)", expr: "cos(x)", xMin: -8, xMax: 8 },
      { label: "Im[eⁱˣ] = sin(x)", expr: "sin(x)", xMin: -8, xMax: 8 },
      {
        label: "Damped oscillation",
        expr: "e^(-0.3*x) * cos(2*pi*x)",
        xMin: 0,
        xMax: 10,
      },
      {
        label: "Modulated wave",
        expr: "e^(-x^2) * cos(5*x)",
        xMin: -4,
        xMax: 4,
      },
      { label: "cos²+sin²=1", expr: "cos(x)^2 + sin(x)^2", xMin: -8, xMax: 8 },
    ],
  },
  {
    name: "Exponential & Log",
    icon: "eˣ",
    color: "#10b981",
    examples: [
      { label: "Gaussian e^(-x²)", expr: "e^(-x^2)", xMin: -4, xMax: 4 },
      { label: "e^x growth", expr: "e^x", xMin: -5, xMax: 3 },
      { label: "e^(sin x)", expr: "e^(sin(x))", xMin: -10, xMax: 10 },
      { label: "Natural log ln(x)", expr: "log(x)", xMin: 0.01, xMax: 10 },
      { label: "x · ln(x)", expr: "x * log(x)", xMin: 0.01, xMax: 5 },
      { label: "ln(|sin x|)", expr: "log(abs(sin(x)))", xMin: -10, xMax: 10 },
    ],
  },
  {
    name: "Polynomials",
    icon: "Pₙ",
    color: "#f59e0b",
    examples: [
      { label: "Parabola x²", expr: "x^2", xMin: -5, xMax: 5 },
      { label: "Cubic x³", expr: "x^3", xMin: -5, xMax: 5 },
      { label: "x⁴ − 5x²", expr: "x^4 - 5*x^2", xMin: -4, xMax: 4 },
      { label: "Quintic", expr: "x^5 - 4*x^3 + 3*x", xMin: -3, xMax: 3 },
      {
        label: "Runge 1/(1+25x²)",
        expr: "1 / (1 + 25*x^2)",
        xMin: -2,
        xMax: 2,
      },
    ],
  },
  {
    name: "Special Functions",
    icon: "✦",
    color: "#f472b6",
    examples: [
      { label: "Absolute |x|", expr: "abs(x)", xMin: -5, xMax: 5 },
      { label: "Floor ⌊x⌋", expr: "floor(x)", xMin: -5, xMax: 5 },
      { label: "Sawtooth", expr: "x - floor(x)", xMin: -5, xMax: 5 },
      {
        label: "Triangle wave",
        expr: "abs(x - 2*floor(x/2+0.5))",
        xMin: -8,
        xMax: 8,
      },
      { label: "tanh sigmoid", expr: "tanh(x)", xMin: -5, xMax: 5 },
      { label: "Witch of Agnesi", expr: "1 / (1 + x^2)", xMin: -6, xMax: 6 },
    ],
  },
  {
    name: "Beautiful Curves",
    icon: "✧",
    color: "#a78bfa",
    examples: [
      { label: "Chirp sin(x²)", expr: "sin(x^2)", xMin: -10, xMax: 10 },
      {
        label: "Fourier harmonics",
        expr: "sin(x)+sin(2*x)/2+sin(3*x)/3",
        xMin: -10,
        xMax: 10,
      },
      { label: "Butterfly", expr: "sin(x) * abs(cos(x))", xMin: -10, xMax: 10 },
      { label: "Euler spiral", expr: "e^(-x^2) * cos(5*x)", xMin: -4, xMax: 4 },
      { label: "Golden ratio φ", expr: "phi * sin(x)", xMin: -10, xMax: 10 },
      { label: "Fresnel-like", expr: "sin(x^2) + cos(x^2)", xMin: -6, xMax: 6 },
    ],
  },
  {
    name: "Parametric / Polar",
    icon: "⊙",
    color: "#fb923c",
    examples: [
      { label: "Rose curve", expr: "sin(4*x)", xMin: -10, xMax: 10 },
      { label: "Epitrochoid", expr: "cos(x) + cos(3*x)", xMin: -10, xMax: 10 },
      {
        label: "Hypocycloid y",
        expr: "sin(x) - sin(3*x)/3",
        xMin: -10,
        xMax: 10,
      },
      {
        label: "Lissajous y",
        expr: "sin(3*x) * cos(2*x)",
        xMin: -10,
        xMax: 10,
      },
    ],
  },
];

export default function ExamplesPanel({ onLoad }) {
  const [openCat, setOpenCat] = useState("Euler's Formula eⁱˣ");

  return (
    <div className="border-t" style={{ borderColor: "rgba(6,182,212,0.08)" }}>
      <div className="px-4 pt-4 pb-2">
        <div className="section-label">Example Library</div>
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat.name}>
          <button
            onClick={() => setOpenCat(openCat === cat.name ? "" : cat.name)}
            className={`cat-btn ${openCat === cat.name ? "open" : ""}`}
          >
            <span
              className="w-6 h-6 flex items-center justify-center rounded-md text-xs font-mono-code flex-shrink-0"
              style={{
                color: cat.color,
                background: `${cat.color}12`,
                border: `1px solid ${cat.color}28`,
              }}
            >
              {cat.icon}
            </span>
            <span
              className="flex-1 text-xs font-medium text-left leading-tight font-rajdhani"
              style={{ color: openCat === cat.name ? cat.color : "#64748b" }}
            >
              {cat.name}
            </span>
            <span
              className="text-[8px] transition-transform duration-200 flex-shrink-0"
              style={{
                color: "#334155",
                transform: openCat === cat.name ? "rotate(180deg)" : "none",
              }}
            >
              ▼
            </span>
          </button>

          {openCat === cat.name && (
            <div
              className="py-1.5 px-2 animate-slide-down"
              style={{ background: "rgba(4,10,24,0.4)" }}
            >
              {cat.examples.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => onLoad(ex)}
                  className="example-btn"
                >
                  <span
                    className="text-xs font-medium font-rajdhani"
                    style={{ color: "#94a3b8" }}
                  >
                    {ex.label}
                  </span>
                  <span
                    className="font-mono-code text-[10px]"
                    style={{ color: cat.color, opacity: 0.55 }}
                  >
                    {ex.expr}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="h-4" />
    </div>
  );
}
