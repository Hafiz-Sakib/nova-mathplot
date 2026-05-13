/* ══════════════════════════════════════════
   ALL PRESETS FOR 3D PLOTTER
══════════════════════════════════════════ */

export const PRESETS = [
  /* ── Classic ── */
  {
    id: "wave",
    name: "Wave Surface",
    equation: "y = sin(√(x²+z²) − t)",
    icon: "〜",
    color: "cyan",
    animated: true,
    category: "Classic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (u, v, t = 0) => [
      u,
      Math.sin(Math.sqrt(u * u + v * v) - t * 1.5) * 1.2,
      v,
    ],
    type: "surface",
  },
  {
    id: "helix",
    name: "Helix",
    equation: "(cos(8t), 3t, sin(8t))",
    icon: "⟳",
    color: "cyan",
    animated: true,
    category: "Classic",
    range: [
      [-1, 1],
      [-1, 1],
    ],
    fn: (u, v, t = 0) => [
      Math.cos(v * 8 + t) * 1.5,
      v * 3,
      Math.sin(v * 8 + t) * 1.5,
    ],
    type: "line",
  },
  {
    id: "torus",
    name: "Torus",
    equation: "((R+r·cos v)cos u, r·sin v, (R+r·cos v)sin u)",
    icon: "◎",
    color: "violet",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const R = 2.2,
        r = 0.8;
      return [
        (R + r * Math.cos(v)) * Math.cos(u + t * 0.3),
        r * Math.sin(v),
        (R + r * Math.cos(v)) * Math.sin(u + t * 0.3),
      ];
    },
    type: "surface",
  },
  {
    id: "saddle",
    name: "Saddle Surface",
    equation: "y = x² − z²",
    icon: "∩",
    color: "orange",
    category: "Classic",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, (u * u - v * v) * 0.4, v],
    type: "surface",
  },
  {
    id: "paraboloid",
    name: "Paraboloid",
    equation: "y = (x² + z²) / 4",
    icon: "∪",
    color: "emerald",
    category: "Classic",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, (u * u + v * v) * 0.25, v],
    type: "surface",
  },
  {
    id: "ripple",
    name: "Ripple Surface",
    equation: "y = sin(x+t)·cos(z+t)",
    icon: "◉",
    color: "cyan",
    animated: true,
    category: "Classic",
    range: [
      [-5, 5],
      [-5, 5],
    ],
    fn: (u, v, t = 0) => [
      u,
      Math.sin(u * 1.2 + t) * Math.cos(v * 1.2 + t) * 0.8,
      v,
    ],
    type: "surface",
  },
  {
    id: "sphere",
    name: "Sphere",
    equation: "x²+y²+z² = r²",
    icon: "○",
    color: "violet",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const pulse = 1 + 0.05 * Math.sin(t * 2);
      return [
        Math.sin(v) * Math.cos(u) * 2.5 * pulse,
        Math.cos(v) * 2.5 * pulse,
        Math.sin(v) * Math.sin(u) * 2.5 * pulse,
      ];
    },
    type: "surface",
  },
  {
    id: "gaussian",
    name: "Gaussian",
    equation: "y = e^(−(x²+z²)/2)",
    icon: "⌒",
    color: "orange",
    category: "Classic",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, Math.exp(-(u * u + v * v) * 0.5) * 2, v],
    type: "surface",
  },
  {
    id: "spiral",
    name: "Spiral",
    equation: "(r·cos t, t/2, r·sin t), r=t/3+½",
    icon: "🌀",
    color: "pink",
    animated: true,
    category: "Classic",
    range: [
      [-1, 1],
      [0, Math.PI * 6],
    ],
    fn: (u, v, t = 0) => {
      const r = v / 3 + 0.5;
      return [
        r * Math.cos(v + t * 0.5),
        v * 0.5 - 4.7,
        r * Math.sin(v + t * 0.5),
      ];
    },
    type: "line",
  },
  {
    id: "flower",
    name: "Parametric Flower",
    equation: "r = sin(3u)·½ + 1.5",
    icon: "❀",
    color: "pink",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const r = Math.sin(u * 3 + t * 0.5) * 0.5 + 1.5;
      return [
        r * Math.sin(v) * Math.cos(u) * 1.5,
        r * Math.cos(v) * 1.5,
        r * Math.sin(v) * Math.sin(u) * 1.5,
      ];
    },
    type: "surface",
  },
  {
    id: "hyperboloid",
    name: "Hyperboloid",
    equation: "(cosh v·cos u, v, cosh v·sin u)",
    icon: "X",
    color: "emerald",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [-2, 2],
    ],
    fn: (u, v, t = 0) => [
      Math.cosh(v) * Math.cos(u + t * 0.4) * 1.5,
      v * 1.5,
      Math.cosh(v) * Math.sin(u + t * 0.4) * 1.5,
    ],
    type: "surface",
  },
  {
    id: "complexwave",
    name: "Complex Exp",
    equation: "y = e^(−r²/4)·cos(x+y+t)",
    icon: "ℂ",
    color: "violet",
    animated: true,
    category: "Classic",
    range: [
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI],
    ],
    fn: (x, y, t = 0) => {
      const mag = Math.exp((-0.3 * (x * x + y * y)) / 4);
      return [x, mag * Math.cos(x + y + t) * 2, y];
    },
    type: "surface",
  },
  {
    id: "astroid_surface",
    name: "Astroid Surface",
    equation: "(cos³u·cos³v, sin³u, cos³u·sin³v)",
    icon: "⭐",
    color: "gold",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const scale = 1 + 0.05 * Math.sin(t * 2);
      return [
        Math.cos(u) ** 3 * Math.cos(v) ** 3 * 2.5 * scale,
        Math.sin(u) ** 3 * 2.5 * scale,
        Math.cos(u) ** 3 * Math.sin(v) ** 3 * 2.5 * scale,
      ];
    },
    type: "surface",
  },
  {
    id: "limacon_surface",
    name: "Limaçon Revolved",
    equation: "r = 1 + 2cos θ, revolved",
    icon: "🐌",
    color: "emerald",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const r = Math.abs(1 + 2 * Math.cos(u + t * 0.2));
      return [
        r * Math.cos(u + t * 0.2) * Math.sin(v) * 0.7,
        r * Math.cos(v) * 0.7,
        r * Math.sin(u + t * 0.2) * Math.sin(v) * 0.7,
      ];
    },
    type: "surface",
  },
  {
    id: "sinc_surface",
    name: "Sinc Surface",
    equation: "y = sin(r)/r",
    icon: "📡",
    color: "cyan",
    animated: true,
    category: "Classic",
    range: [
      [-5, 5],
      [-5, 5],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z) + 0.001;
      return [x, (Math.sin(r - t * 0.5) / r) * 3, z];
    },
    type: "surface",
  },
  {
    id: "egg_carton",
    name: "Egg Carton",
    equation: "y = sin x · cos z",
    icon: "🥚",
    color: "orange",
    category: "Classic",
    range: [
      [-Math.PI * 1.5, Math.PI * 1.5],
      [-Math.PI * 1.5, Math.PI * 1.5],
    ],
    fn: (x, z) => [x, Math.sin(x) * Math.cos(z) * 1.5, z],
    type: "surface",
  },
  {
    id: "bilinear_patch",
    name: "Bilinear Saddle Twist",
    equation: "y = x·z + sin(x²+z²+t)",
    icon: "🌀",
    color: "violet",
    animated: true,
    category: "Classic",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (x, z, t = 0) => [
      x,
      x * z * 0.5 + 0.3 * Math.sin(x * x + z * z + t * 2),
      z,
    ],
    type: "surface",
  },
  {
    id: "lemniscate_surface",
    name: "Lemniscate Surface",
    equation: "r = a·cos(2θ), revolved",
    icon: "∞",
    color: "pink",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const r = Math.abs(Math.cos(2 * u + t * 0.3)) * 1.8;
      return [
        r * Math.sin(v) * Math.cos(u) * 1.4,
        r * Math.cos(v) * 1.4,
        r * Math.sin(v) * Math.sin(u) * 1.4,
      ];
    },
    type: "surface",
  },
  {
    id: "cardioid_revolution",
    name: "Cardioid Revolution",
    equation: "r = 1 - cos θ",
    icon: "❤️",
    color: "pink" /* FIX: was "red" which is not in COLOR_MAP */,
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const r = 1 - Math.cos(u + t * 0.4);
      return [
        r * Math.sin(v) * Math.cos(u) * 2,
        r * Math.cos(v) * 2,
        r * Math.sin(v) * Math.sin(u) * 2,
      ];
    },
    type: "surface",
  },
  {
    id: "hypocycloid_3d",
    name: "Hypocycloid 3D",
    equation: "Deltoid / Astroid variants",
    icon: "⭐",
    color: "gold",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const k = 3;
      const x = (k - 1) * Math.cos(u) + Math.cos((k - 1) * u + t * 0.3);
      const z = (k - 1) * Math.sin(u) - Math.sin((k - 1) * u + t * 0.3);
      return [x * 1.2, Math.sin(v * 4) * 0.8, z * 1.2];
    },
    type: "surface",
  },
  {
    id: "fermat_spiral_3d",
    name: "Fermat Spiral Surface",
    icon: "🌀",
    color: "emerald",
    animated: true,
    category: "Classic",
    range: [
      [0.01, Math.PI * 4],
      [0, Math.PI],
    ] /* FIX: start from 0.01 to avoid sqrt(0) degenerate row */,
    fn: (theta, phi, t = 0) => {
      const r = Math.sqrt(theta) * 0.6;
      return [
        r * Math.cos(theta + t) * Math.sin(phi),
        r * Math.cos(phi),
        r * Math.sin(theta + t) * Math.sin(phi),
      ];
    },
    type: "surface",
  },

  /* ── Mathematical ── */
  {
    id: "spherical_harmonics",
    name: "Spherical Harmonics",
    equation: "r = |sin(mθ)·cos(nφ)|",
    icon: "Yₗₘ",
    color: "violet",
    animated: true,
    category: "Mathematical",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (phi, theta, t = 0) => {
      const m = 3,
        n = 2;
      const r =
        Math.abs(Math.sin(m * theta + t * 0.3) * Math.cos(n * phi)) * 2 + 0.3;
      return [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(phi),
      ];
    },
    type: "surface",
  },
  {
    id: "superformula",
    name: "Superformula",
    equation: "r = (|cos(mφ/4)/a|^n₂ + |sin(mφ/4)/b|^n₃)^(−1/n₁)",
    icon: "🌸",
    color: "pink",
    category: "Mathematical",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (phi, theta) => {
      const m = 6,
        a = 1,
        b = 1,
        n1 = 2,
        n2 = 7,
        n3 = 7;
      const ang = (m * phi) / 4;
      const r1 = Math.pow(
        Math.pow(Math.abs(Math.cos(ang) / a), n2) +
          Math.pow(Math.abs(Math.sin(ang) / b), n3),
        -1 / n1,
      );
      const r = r1 * 1.5;
      return [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(phi),
      ];
    },
    type: "surface",
  },
  {
    id: "wave_interference",
    name: "Wave Interference",
    equation: "y = sin(r²+t)·cos(3x+t)·sin(3z)",
    icon: "≋",
    color: "cyan",
    animated: true,
    category: "Mathematical",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v, t = 0) => [
      u,
      Math.sin(u * u + v * v + t) *
        Math.cos(3 * u + t * 0.5) *
        Math.sin(3 * v) *
        0.8,
      v,
    ],
    type: "surface",
  },
  {
    id: "fractal_noise",
    name: "Fractal Noise Surface",
    equation: "y = Σ sin(2ⁿx)·cos(2ⁿz) / 2ⁿ",
    icon: "🌊",
    color: "emerald",
    animated: true,
    category: "Mathematical",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v, t = 0) => {
      let z = 0;
      for (let n = 1; n <= 5; n++)
        z +=
          (Math.sin(Math.pow(2, n) * u + t * 0.5) *
            Math.cos(Math.pow(2, n) * v)) /
          Math.pow(2, n);
      return [u, z * 0.8, v];
    },
    type: "surface",
  },
  {
    id: "heart_surface",
    name: "Heart Surface",
    equation: "(x²+y²+z²−1)³ = x²z³+y²z³/9",
    icon: "❤",
    color: "pink",
    animated: true,
    category: "Mathematical",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (u, v, t = 0) => {
      const tt = u * Math.PI,
        s = (v * Math.PI) / 2;
      const scale = 1 + 0.05 * Math.sin(t * 2);
      return [
        4 * Math.pow(Math.sin(tt), 3) * Math.cos(s) * 0.6 * scale,
        (13 * Math.cos(tt) -
          5 * Math.cos(2 * tt) -
          2 * Math.cos(3 * tt) -
          Math.cos(4 * tt)) *
          0.12 *
          Math.abs(Math.cos(s)),
        4 * Math.pow(Math.sin(tt), 3) * Math.sin(s) * 0.6 * scale,
      ];
    },
    type: "surface",
  },
  {
    id: "steinmetz_solid",
    name: "Steinmetz Solid",
    equation: "Intersection of two cylinders",
    icon: "⟡",
    color: "emerald",
    category: "Mathematical",
    range: [
      [-Math.PI, Math.PI],
      [-2, 2],
    ],
    fn: (u, v) => {
      const r = Math.sqrt(4 - v * v);
      return [r * Math.cos(u), v * 1.2, r * Math.sin(u)];
    },
    type: "surface",
  },
  {
    id: "swiss_roll",
    name: "Swiss Roll Manifold",
    equation: "Parametric spiral sheet",
    icon: "🥐",
    color: "orange",
    animated: true,
    category: "Mathematical",
    range: [
      [0, Math.PI * 6],
      [-1.5, 1.5],
    ],
    fn: (u, v, t = 0) => [
      u * Math.cos(u + t * 0.2) * 0.4,
      v * 1.8,
      u * Math.sin(u + t * 0.2) * 0.4,
    ],
    type: "surface",
  },
  {
    id: "butterfly_curve_3d",
    name: "Butterfly Curve 3D",
    equation: "r = e^sinθ - 2cos(4θ) + sin^5(θ/12)",
    icon: "🦋",
    color: "violet",
    animated: true,
    category: "Mathematical",
    range: [
      [0, Math.PI * 12],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r =
        Math.exp(Math.sin(theta)) -
        2 * Math.cos(4 * theta) +
        Math.pow(Math.sin(theta / 12), 5);
      return [
        r * Math.cos(theta) * Math.sin(phi) * 0.6,
        r * Math.sin(theta) * 0.8,
        r * Math.sin(theta) * Math.cos(phi) * 0.6,
      ];
    },
    type: "surface",
  },

  /* ── Minimal Surfaces ── */
  {
    id: "gyroid",
    name: "Gyroid",
    equation: "sin x·cos y + sin y·cos z + sin z·cos x = 0",
    icon: "⬡",
    color: "emerald",
    category: "Minimal Surfaces",
    range: [
      [-Math.PI * 1.5, Math.PI * 1.5],
      [-Math.PI * 1.5, Math.PI * 1.5],
    ],
    fn: (u, v) => {
      const x = u,
        z = v;
      const y = Math.asin(
        Math.max(
          -1,
          Math.min(
            1,
            -(Math.sin(z) * Math.cos(x)) /
              Math.max(0.01, Math.abs(Math.cos(x * 0.5))),
          ),
        ),
      );
      return [x * 0.8, y * 0.8, z * 0.8];
    },
    type: "surface",
  },
  {
    id: "schwarz_p",
    name: "Schwarz P Surface",
    equation: "cos x + cos y + cos z = 0",
    icon: "𝒫",
    color: "cyan",
    category: "Minimal Surfaces",
    range: [
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI],
    ],
    fn: (u, v) => {
      const x = u,
        z = v;
      const y = Math.acos(
        Math.max(-1, Math.min(1, -(Math.cos(x) + Math.cos(z)))),
      );
      return [x * 0.9, (y - Math.PI / 2) * 0.9, z * 0.9];
    },
    type: "surface",
  },
  {
    id: "enneper",
    name: "Enneper Surface",
    equation: "(u−u³/3+uv², u²−v², v−v³/3+vu²)",
    icon: "𝔼",
    color: "gold",
    animated: true,
    category: "Minimal Surfaces",
    range: [
      [-1.5, 1.5],
      [-1.5, 1.5],
    ],
    fn: (u, v, t = 0) => {
      const s = Math.sin(t * 0.3) * 0.3;
      return [
        (u - (u * u * u) / 3 + u * v * v) * 0.6,
        (u * u - v * v + s) * 0.6,
        (v - (v * v * v) / 3 + v * u * u) * 0.6,
      ];
    },
    type: "surface",
  },
  {
    id: "catenoid",
    name: "Catenoid",
    equation: "(cosh v·cos u, v, cosh v·sin u)",
    icon: "🪣",
    color: "cyan",
    animated: true,
    category: "Minimal Surfaces",
    range: [
      [0, Math.PI * 2],
      [-2, 2],
    ],
    fn: (u, v, t = 0) => [
      Math.cosh(v) * Math.cos(u + t * 0.3) * 1.2,
      v * 1.2,
      Math.cosh(v) * Math.sin(u + t * 0.3) * 1.2,
    ],
    type: "surface",
  },
  {
    id: "helicoid",
    name: "Helicoid",
    equation: "(v·cos u, u/2, v·sin u)",
    icon: "🐚",
    color: "emerald",
    animated: true,
    category: "Minimal Surfaces",
    range: [
      [0, Math.PI * 4],
      [-2, 2],
    ],
    fn: (u, v, t = 0) => [
      v * Math.cos(u + t * 0.3) * 1.2,
      u * 0.5 - Math.PI,
      v * Math.sin(u + t * 0.3) * 1.2,
    ],
    type: "surface",
  },

  /* ── Topology ── */
  {
    id: "mobius",
    name: "Möbius Strip",
    equation: "((1+v·cos u/2)cos u, v·sin u/2, (1+v·cos u/2)sin u)",
    icon: "∞",
    color: "pink",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [-0.6, 0.6],
    ],
    fn: (u, v, t = 0) => [
      (1 + v * Math.cos(u / 2)) * Math.cos(u + t * 0.4) * 2,
      v * Math.sin(u / 2) * 2,
      (1 + v * Math.cos(u / 2)) * Math.sin(u + t * 0.4) * 2,
    ],
    type: "surface",
  },
  {
    id: "klein",
    name: "Klein Bottle",
    equation: "Non-orientable closed surface in ℝ⁴",
    icon: "∮",
    color: "gold",
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => {
      const r = 4;
      const x =
        (r +
          Math.cos(u / 2) * Math.sin(v) -
          Math.sin(u / 2) * Math.sin(2 * v)) *
        Math.cos(u);
      const y =
        (r +
          Math.cos(u / 2) * Math.sin(v) -
          Math.sin(u / 2) * Math.sin(2 * v)) *
        Math.sin(u);
      const z =
        Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v);
      return [x * 0.28, z * 0.28, y * 0.28];
    },
    type: "surface",
  },
  {
    id: "boys_surface",
    name: "Boy's Surface",
    equation: "Apéry immersion of RP² in ℝ³",
    icon: "𝔹",
    color: "violet",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const x = Math.cos(u + t * 0.2) * Math.sin(v),
        y = Math.sin(u + t * 0.2) * Math.sin(v),
        z = Math.cos(v);
      const denom = Math.sqrt(2) - Math.sin(2 * u) * Math.sin(3 * v);
      const bx = Math.sqrt(2) * x * x - y * y - z * z + Math.sqrt(2) * x * z;
      const by = Math.sqrt(2) * (y * y - x * x) + Math.sqrt(2) * y * z;
      const bz = (3 * z * z) / 2;
      return [(bx / denom) * 1.2, (bz / denom) * 1.2, (by / denom) * 1.2];
    },
    type: "surface",
  },
  {
    id: "roman_surface",
    name: "Roman Surface (Steiner)",
    equation: "x²y²+y²z²+z²x² = xyz",
    icon: "🏛",
    color: "orange",
    category: "Topology",
    range: [
      [0, Math.PI],
      [0, Math.PI],
    ],
    fn: (u, v) => [
      Math.sin(2 * u) * Math.cos(v) * Math.cos(v) * 2,
      Math.sin(u) * Math.sin(2 * v) * 2,
      Math.cos(u) * Math.sin(2 * v) * 2,
    ],
    type: "surface",
  },
  {
    id: "whitney_umbrella",
    name: "Whitney Umbrella",
    equation: "x²z = y²",
    icon: "☂",
    color: "pink",
    category: "Topology",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (u, v) => [u * v * 0.8, u * 0.8, v * v * 0.8],
    type: "surface",
  },
  {
    id: "hopf_fibration",
    name: "Hopf Fibration",
    equation: "S³ → S² fiber bundle, S¹ fibers",
    icon: "ℍ",
    color: "violet",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const theta = v,
        phi = u,
        psi = u * 2 + t * 0.2;
      const x = Math.cos((theta + phi) / 2) * Math.cos((theta - phi) / 2 + psi);
      const y = Math.cos((theta + phi) / 2) * Math.sin((theta - phi) / 2 + psi);
      const z = Math.sin((theta + phi) / 2) * Math.cos((theta - phi) / 2);
      const w = Math.sin((theta + phi) / 2) * Math.sin((theta - phi) / 2);
      const d = 1 - w + 0.01;
      return [(x / d) * 1.5, (y / d) * 1.5, (z / d) * 1.5];
    },
    type: "surface",
  },
  {
    id: "twisted_torus",
    name: "Twisted Torus",
    equation: "Torus with Möbius twist",
    icon: "🌀",
    color: "violet",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const twist = v * 0.5,
        R = 2.5,
        r = 0.9;
      return [
        (R + r * Math.cos(v)) * Math.cos(u + twist + t * 0.3),
        r * Math.sin(v),
        (R + r * Math.cos(v)) * Math.sin(u + twist + t * 0.3),
      ];
    },
    type: "surface",
  },
  {
    id: "real_projective_plane",
    name: "Real Projective Plane",
    equation: "Boy's surface variant",
    icon: "🟦",
    color: "pink",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const x = Math.cos(u) * Math.sin(v),
        y = Math.sin(u) * Math.sin(v),
        z = Math.cos(v);
      return [
        (x * x - y * y) * 2,
        2 * x * y * 1.5,
        (z * z - 0.5) * 2 + Math.sin(t) * 0.3,
      ];
    },
    type: "surface",
  },
  {
    id: "mobius_twist",
    name: "Twisted Möbius Band",
    icon: "♾",
    color: "pink",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [-1, 1],
    ],
    fn: (u, v, t = 0) => [
      (2 + v * Math.cos(u / 2)) * Math.cos(u + t * 0.5),
      v * Math.sin(u / 2),
      (2 + v * Math.cos(u / 2)) * Math.sin(u + t * 0.5),
    ],
    type: "surface",
  },

  /* ── Attractors ── */
  {
    id: "lorenz",
    name: "Lorenz Attractor",
    equation: "ẋ=σ(y−x), ẏ=x(ρ−z)−y, ż=xy−βz",
    icon: "🦋",
    color: "cyan",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [0.1, 0, 0],
      scale: 0.09,
      dt: 0.005,
      steps: 10000,
      deriv: (x, y, z) => {
        const s = 10,
          rho = 28,
          b = 8 / 3;
        return [s * (y - x), x * (rho - z) - y, x * y - b * z];
      },
    },
  },
  {
    id: "rossler",
    name: "Rössler Attractor",
    equation: "ẋ=−y−z, ẏ=x+ay, ż=b+z(x−c)",
    icon: "🌀",
    color: "violet",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [1, 1, 1],
      scale: 0.12,
      dt: 0.008,
      steps: 8000,
      deriv: (x, y, z) => {
        const a = 0.2,
          b = 0.2,
          c = 5.7;
        return [-y - z, x + a * y, b + z * (x - c)];
      },
    },
  },
  {
    id: "aizawa_attractor",
    name: "Aizawa Attractor",
    equation: "ẋ=(z−b)x−dy, ẏ=dx+(z−b)y, ż=c+az−z³/3−...",
    icon: "🌀",
    color: "emerald",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [0.1, 0, 0],
      scale: 0.6,
      dt: 0.01,
      steps: 10000,
      deriv: (x, y, z) => {
        const a = 0.95,
          b = 0.7,
          c = 0.6,
          d = 3.5,
          e = 0.25,
          f = 0.1;
        return [
          (z - b) * x - d * y,
          d * x + (z - b) * y,
          c +
            a * z -
            (z * z * z) / 3 -
            (x * x + y * y) * (1 + e * z) +
            f * z * x * x * x,
        ];
      },
    },
  },
  {
    id: "halvorsen_attractor",
    name: "Halvorsen Attractor",
    equation: "ẋ=−ax−4y−4z−y²",
    icon: "🔯",
    color: "pink",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [-1.48, -1.51, 2.04],
      scale: 0.12,
      dt: 0.005,
      steps: 10000,
      deriv: (x, y, z) => {
        const a = 1.89;
        return [
          -a * x - 4 * y - 4 * z - y * y,
          -a * y - 4 * z - 4 * x - z * z,
          -a * z - 4 * x - 4 * y - x * x,
        ];
      },
    },
  },
  {
    id: "dadras_attractor",
    name: "Dadras Attractor",
    equation: "ẋ=y−ax+byz, ẏ=cy−xz+z, ż=dxy−ez",
    icon: "🪷",
    color: "gold",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [1, 1, 0],
      scale: 0.12,
      dt: 0.005,
      steps: 9000,
      deriv: (x, y, z) => {
        const a = 3,
          b = 2.7,
          c = 1.7,
          d = 2,
          e = 9;
        return [y - a * x + b * y * z, c * y - x * z + z, d * x * y - e * z];
      },
    },
  },
  {
    id: "chen_attractor",
    name: "Chen Attractor",
    equation: "ẋ=a(y−x), ẏ=(c−a)x−xz+cy, ż=xy−bz",
    icon: "🌊",
    color: "cyan",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [1, 0, 0],
      scale: 0.08,
      dt: 0.004,
      steps: 10000,
      deriv: (x, y, z) => {
        const a = 35,
          b = 3,
          c = 28;
        return [a * (y - x), (c - a) * x - x * z + c * y, x * y - b * z];
      },
    },
  },
  {
    id: "thomas_attractor",
    name: "Thomas Attractor",
    equation: "ẋ=sin y - b x, ẏ=sin z - b y, ż=sin x - b z",
    icon: "🌀",
    color: "emerald",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [0.1, 0, 0],
      scale: 1.8,
      dt: 0.015,
      steps: 12000,
      deriv: (x, y, z) => {
        const b = 0.19;
        return [Math.sin(y) - b * x, Math.sin(z) - b * y, Math.sin(x) - b * z];
      },
    },
  },
  {
    id: "sprott_attractor",
    name: "Sprott Attractor",
    equation: "ẋ=y+0.2z, ... (chaotic)",
    icon: "🌪",
    color: "pink",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [0, 0.1, 0],
      scale: 2.2,
      dt: 0.008,
      steps: 9000,
      deriv: (x, y, z) => [y + 0.2 * z, -x + 0.2 * y * z, x - y + 0.3 * z],
    },
  },

  /* ── Knots ── */
  {
    id: "torus_knot",
    name: "Torus Knot (2,3)",
    equation: "((R+r·cos 3t)cos 2t, r·sin 3t, (R+r·cos 3t)sin 2t)",
    icon: "🪢",
    color: "orange",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const p = 2,
        q = 3,
        R = 2,
        r = 0.5;
      return [
        (R + r * Math.cos(q * v)) * Math.cos(p * v + t * 0.3),
        r * Math.sin(q * v),
        (R + r * Math.cos(q * v)) * Math.sin(p * v + t * 0.3),
      ];
    },
    type: "line",
  },
  {
    id: "lissajous_knot",
    name: "Lissajous Knot",
    equation: "(sin 3t, sin 4t, sin(5t+π/6))",
    icon: "⊛",
    color: "emerald",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => [
      Math.sin(3 * v + t * 0.2) * 2,
      Math.sin(4 * v) * 2,
      Math.sin(5 * v + Math.PI / 6) * 2,
    ],
    type: "line",
  },
  {
    id: "trefoil_knot",
    name: "Trefoil Knot",
    equation: "(sin t+2sin 2t, cos t−2cos 2t, −sin 3t)",
    icon: "✶",
    color: "violet",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => [
      (Math.sin(v) + 2 * Math.sin(2 * v)) * 1.2,
      (Math.cos(v) - 2 * Math.cos(2 * v)) * 1.2,
      -Math.sin(3 * v + t * 0.2) * 1.2,
    ],
    type: "line",
  },
  {
    id: "figure_eight_knot",
    name: "Figure-Eight Knot",
    equation: "((2+cos 2t)cos 3t, (2+cos 2t)sin 3t, sin 4t)",
    icon: "∞",
    color: "pink",
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => [
      (2 + Math.cos(2 * v)) * Math.cos(3 * v) * 0.7,
      (2 + Math.cos(2 * v)) * Math.sin(3 * v) * 0.7,
      Math.sin(4 * v) * 0.7,
    ],
    type: "line",
  },
  {
    id: "cinquefoil_knot",
    name: "Cinquefoil Knot (2,5)",
    equation: "((R+r·cos 5t)cos 2t, r·sin 5t, (R+r·cos 5t)sin 2t)",
    icon: "✿",
    color: "pink",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const p = 2,
        q = 5,
        R = 2,
        r = 0.5;
      return [
        (R + r * Math.cos(q * v)) * Math.cos(p * v + t * 0.3),
        r * Math.sin(q * v),
        (R + r * Math.cos(q * v)) * Math.sin(p * v + t * 0.3),
      ];
    },
    type: "line",
  },
  {
    id: "torus_knot_3_4",
    name: "Torus Knot (3,4)",
    equation: "((R+r·cos 4t)cos 3t, r·sin 4t, (R+r·cos 4t)sin 3t)",
    icon: "🔗",
    color: "gold",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const p = 3,
        q = 4,
        R = 2,
        r = 0.5;
      return [
        (R + r * Math.cos(q * v)) * Math.cos(p * v + t * 0.2),
        r * Math.sin(q * v),
        (R + r * Math.cos(q * v)) * Math.sin(p * v + t * 0.2),
      ];
    },
    type: "line",
  },
  {
    id: "figure_eight_knot_3d",
    name: "Figure-Eight Knot Variant",
    equation: "Parametric (2,3) variant",
    icon: "8",
    color: "violet",
    animated: true,
    category: "Knots",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 4],
    ],
    fn: (u, v, t = 0) => [
      (2 + Math.cos(3 * v)) * Math.cos(2 * v + t * 0.4) * 0.9,
      (2 + Math.cos(3 * v)) * Math.sin(2 * v + t * 0.4) * 0.9,
      Math.sin(4 * v) * 1.4,
    ],
    type: "line",
  },
  {
    id: "petersen_graph_knot",
    name: "Petersen Knot Projection",
    icon: "🔀",
    color: "gold",
    animated: true,
    category: "Knots",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 5],
    ],
    fn: (u, v, t = 0) => [
      Math.sin(2 * v + t) * 1.8,
      Math.cos(3 * v) * 1.6,
      Math.sin(5 * v) * 1.4,
    ],
    type: "line",
  },

  /* ── Quadrics ── */
  {
    id: "hyperbolic_paraboloid",
    name: "Hyperbolic Paraboloid",
    equation: "y = (x² − z²) · k",
    icon: "⌗",
    color: "gold",
    category: "Quadrics",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (u, v) => [u, (u * u - v * v) * 0.3, v],
    type: "surface",
  },
  {
    id: "ellipsoid",
    name: "Ellipsoid",
    equation: "x²/a² + y²/b² + z²/c² = 1",
    icon: "🥚",
    color: "emerald",
    animated: true,
    category: "Quadrics",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const a = 2 + 0.1 * Math.sin(t),
        b = 3,
        c = 1.5;
      return [
        a * Math.sin(v) * Math.cos(u),
        b * Math.cos(v),
        c * Math.sin(v) * Math.sin(u),
      ];
    },
    type: "surface",
  },
  {
    id: "one_sheet_hyperboloid",
    name: "Hyperboloid (One Sheet)",
    equation: "x²+z² − y² = 1",
    icon: "⌛",
    color: "cyan",
    animated: true,
    category: "Quadrics",
    range: [
      [0, Math.PI * 2],
      [-2, 2],
    ],
    fn: (u, v, t = 0) => [
      Math.cosh(v * 0.8) * Math.cos(u + t * 0.3) * 1.5,
      v * 1.5,
      Math.cosh(v * 0.8) * Math.sin(u + t * 0.3) * 1.5,
    ],
    type: "surface",
  },
  {
    id: "cone_surface",
    name: "Elliptic Cone",
    equation: "z = √(x²/a² + y²/b²)",
    icon: "🔺",
    color: "orange",
    category: "Quadrics",
    range: [
      [0, Math.PI * 2],
      [0, 3],
    ],
    fn: (u, v) => [v * Math.cos(u) * 1.2, v, v * Math.sin(u) * 0.8],
    type: "surface",
  },
  {
    id: "two_sheet_hyperboloid",
    name: "Hyperboloid (Two Sheets)",
    equation: "x² + z² - y² = -1",
    icon: "⏳",
    color: "cyan",
    animated: true,
    category: "Quadrics",
    range: [
      [0, Math.PI * 2],
      [-3, 3],
    ],
    fn: (u, v, t = 0) => [
      Math.sinh(v * 0.8) * Math.cos(u + t * 0.2) * 1.6,
      v * 1.1,
      Math.sinh(v * 0.8) * Math.sin(u + t * 0.2) * 1.6,
    ],
    type: "surface",
  },
  {
    id: "parabolic_cylinder",
    name: "Parabolic Cylinder",
    equation: "y = x²",
    icon: "📏",
    color: "emerald",
    category: "Quadrics",
    range: [
      [-3, 3],
      [-4, 4],
    ],
    fn: (x, z) => [x, x * x * 0.6, z],
    type: "surface",
  },

  /* ── Differential Geometry ── */
  {
    id: "dini_surface",
    name: "Dini's Surface",
    equation: "(cos u·sin v, sin u·sin v, cos v+ln tan(v/2)+bu)",
    icon: "ð",
    color: "gold",
    category: "Differential Geometry",
    range: [
      [0, Math.PI * 4],
      [0.05, 2],
    ],
    fn: (u, v) => {
      const a = 1,
        b = 0.2;
      return [
        a * Math.cos(u) * Math.sin(v) * 0.8,
        a * Math.sin(u) * Math.sin(v) * 0.8,
        a * (Math.cos(v) + Math.log(Math.tan(v / 2))) * 0.8 + b * u * 0.8,
      ];
    },
    type: "surface",
  },
  {
    id: "pseudosphere",
    name: "Pseudosphere (Tractroid)",
    equation: "(sech v·cos u, sech v·sin u, v−tanh v)",
    icon: "🪣",
    color: "violet",
    category: "Differential Geometry",
    range: [
      [0, Math.PI * 2],
      [-3, 3],
    ],
    fn: (u, v) => {
      const sech = 1 / Math.cosh(v);
      return [
        sech * Math.cos(u) * 1.5,
        (v - Math.tanh(v)) * 1.5,
        sech * Math.sin(u) * 1.5,
      ];
    },
    type: "surface",
  },
  {
    id: "figure8_immersion",
    name: "Figure-8 Immersion of Klein",
    equation: "cos(u/2)·cos²(v/2)·κ(u,v)",
    icon: "∞",
    color: "pink",
    category: "Differential Geometry",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => {
      const cos_half = Math.cos(u / 2),
        sin_half = Math.sin(u / 2);
      return [
        (2 + cos_half * Math.sin(v) - sin_half * Math.sin(2 * v)) *
          Math.cos(u) *
          0.5,
        (2 + cos_half * Math.sin(v) - sin_half * Math.sin(2 * v)) *
          Math.sin(u) *
          0.5,
        sin_half * Math.sin(v) + cos_half * Math.sin(2 * v) * 0.5,
      ];
    },
    type: "surface",
  },
  {
    id: "tractrix_surface",
    name: "Tractrix Surface of Revolution",
    equation: "x = sech u, z = u - tanh u",
    icon: "🚂",
    color: "cyan",
    category: "Differential Geometry",
    range: [
      [0, Math.PI * 2],
      [-3, 3],
    ],
    fn: (u, v) => {
      const sech = 1 / Math.cosh(v);
      return [
        sech * Math.cos(u) * 2.5,
        sech * Math.sin(u) * 2.5,
        (v - Math.tanh(v)) * 1.2,
      ];
    },
    type: "surface",
  },
  {
    id: "plucker_conoid",
    name: "Plücker Conoid",
    equation: "z = (x y) / (x² + y²)",
    icon: "🌀",
    color: "emerald",
    category: "Differential Geometry",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, y) => [x, ((x * y) / (x * x + y * y + 0.01)) * 3, y],
    type: "surface",
  },
  {
    id: "monkey_saddle",
    name: "Monkey Saddle",
    equation: "z = x³ - 3 x y²",
    icon: "🐒",
    color: "orange",
    category: "Differential Geometry",
    range: [
      [-2.5, 2.5],
      [-2.5, 2.5],
    ],
    fn: (x, y) => [x, x * x * x - 3 * x * y * y, y],
    type: "surface",
  },

  /* ── Cosmic ── */
  {
    id: "nebula_surface",
    name: "Nebula Surface",
    equation: "r = 1+0.4·sin(12θ+t)·cos 9φ",
    icon: "🌌",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r =
        1 +
        0.4 * Math.sin(12 * theta + t) * Math.cos(9 * phi) +
        0.2 * Math.sin(24 * phi);
      return [
        r * Math.sin(phi) * Math.cos(theta) * 2.5,
        r * Math.cos(phi) * 2.5,
        r * Math.sin(phi) * Math.sin(theta) * 2.5,
      ];
    },
    type: "surface",
  },
  {
    id: "galaxy_spiral",
    name: "Galaxy Spiral",
    equation: "(r·cos(θ+0.3r), 0.5·sin(8θ)·e^(−0.1r), r·sin(θ+0.3r))",
    icon: "🌠",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [-1, 1],
      [0, Math.PI * 6],
    ],
    fn: (u, r, t = 0) => {
      const theta = r;
      return [
        r * Math.cos(theta + 0.3 * r + t * 0.3) * 0.5,
        0.5 * Math.sin(8 * theta) * Math.exp(-0.1 * r),
        r * Math.sin(theta + 0.3 * r + t * 0.3) * 0.5,
      ];
    },
    type: "line",
  },
  {
    id: "pulsar_field",
    name: "Pulsar Field",
    equation: "y = sin(20r−4t) / (1+0.1r²)",
    icon: "✦",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z) + 0.001;
      return [x, Math.sin(20 * r - t * 4) / (1 + 0.1 * r * r), z];
    },
    type: "surface",
  },
  {
    id: "black_hole_funnel",
    name: "Black Hole Funnel",
    equation: "y = −5/r (Flamm's paraboloid)",
    icon: "⚫",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z) + 0.1;
      return [x, Math.max(-5 / r + 0.05 * Math.sin(t * 2 + r * 3), -4), z];
    },
    type: "surface",
  },
  {
    id: "wormhole_surface",
    name: "Wormhole Surface",
    equation: "(cosh v·cos θ, v, cosh v·sin θ)",
    icon: "🕳",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [-2, 2],
    ],
    fn: (theta, v, t = 0) => {
      const r = Math.cosh(v);
      return [r * Math.cos(theta + t * 0.2), v, r * Math.sin(theta + t * 0.2)];
    },
    type: "surface",
  },
  {
    id: "event_horizon_ripple",
    name: "Event Horizon Ripple",
    equation: "y = e^(−0.05r²)·sin(15r−3t)",
    icon: "🕳",
    color: "pink",
    animated: true,
    category: "Cosmic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z);
      return [x, Math.exp(-0.05 * r * r) * Math.sin(15 * r - t * 3) * 0.8, z];
    },
    type: "surface",
  },
  {
    id: "cosmic_web",
    name: "Cosmic Web",
    equation: "y = sin x·cos z + sin(z+t)·cos x",
    icon: "🕸",
    color: "emerald",
    animated: true,
    category: "Cosmic",
    range: [
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI],
    ],
    fn: (x, z, t = 0) => [
      x,
      (Math.sin(x) * Math.cos(z) + Math.sin(z + t * 0.5) * Math.cos(x)) * 0.6,
      z,
    ],
    type: "surface",
  },
  {
    id: "starburst_sphere",
    name: "Starburst Sphere",
    equation: "r = 1+0.5|sin(20θ+t)·sin(20φ)|",
    icon: "✨",
    color: "gold",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r =
        1 + 0.5 * Math.abs(Math.sin(20 * theta + t) * Math.sin(20 * phi));
      return [
        r * Math.sin(phi) * Math.cos(theta) * 2,
        r * Math.cos(phi) * 2,
        r * Math.sin(phi) * Math.sin(theta) * 2,
      ];
    },
    type: "surface",
  },
  {
    id: "meteor_crater",
    name: "Meteor Crater Terrain",
    equation: "y = −e^(−r²/2) + 0.1·sin(10r+t)",
    icon: "☄",
    color: "orange",
    animated: true,
    category: "Cosmic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z);
      return [x, (-Math.exp(-0.5 * r * r) + 0.1 * Math.sin(10 * r + t)) * 2, z];
    },
    type: "surface",
  },
  {
    id: "saturn_ring_wave",
    name: "Saturn Ring Wave",
    equation: "y = 0.1·sin(30r−2t)·e^(−0.05r)",
    icon: "🪐",
    color: "gold",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0.5, 4],
    ],
    fn: (theta, r, t = 0) => [
      r * Math.cos(theta + (t * 0.5) / r),
      0.1 * Math.sin(30 * r - t * 2) * Math.exp(-0.05 * r),
      r * Math.sin(theta + (t * 0.5) / r),
    ],
    type: "surface",
  },
  {
    id: "solar_flare",
    name: "Solar Flare Surface",
    equation: "r = 1+0.3·e^(−3φ)·sin(25θ+2t)",
    icon: "☀",
    color: "orange",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r = 1 + 0.3 * Math.exp(-3 * phi) * Math.sin(25 * theta + t * 2);
      return [
        r * Math.sin(phi) * Math.cos(theta) * 2.5,
        r * Math.cos(phi) * 2.5,
        r * Math.sin(phi) * Math.sin(theta) * 2.5,
      ];
    },
    type: "surface",
  },
  {
    id: "aurora_shell",
    name: "Aurora Shell",
    equation: "r = 1+0.2·sin(6φ+12θ+1.5t)",
    icon: "🌈",
    color: "emerald",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r = 1 + 0.2 * Math.sin(6 * phi + 12 * theta + t * 1.5);
      return [
        r * Math.sin(phi) * Math.cos(theta) * 2.5,
        r * Math.cos(phi) * 2.5,
        r * Math.sin(phi) * Math.sin(theta) * 2.5,
      ];
    },
    type: "surface",
  },
  {
    id: "supernova_blast",
    name: "Supernova Blast",
    equation: "r = (1+0.8·e^(−0.2φ)·sin(30θ+3t)·cos 20φ)",
    icon: "💥",
    color: "orange",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r =
        (1 +
          0.8 *
            Math.exp(-0.2 * phi) *
            Math.sin(30 * theta + t * 3) *
            Math.cos(20 * phi)) *
        (1 + 0.1 * Math.sin(t));
      return [
        r * Math.sin(phi) * Math.cos(theta) * 2,
        r * Math.cos(phi) * 2,
        r * Math.sin(phi) * Math.sin(theta) * 2,
      ];
    },
    type: "surface",
  },
  {
    id: "quasar_jet",
    name: "Quasar Jet",
    icon: "⚡",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [-1, 1],
      [0, Math.PI * 6],
    ],
    fn: (u, tp, t = 0) => [
      Math.cos(tp + t * 0.5),
      tp * 0.4,
      Math.sin(tp + t * 0.5) + 0.5 * Math.sin(10 * tp + t),
    ],
    type: "line",
  },
  {
    id: "accretion_disk",
    name: "Accretion Disk",
    equation: "y = 0.05·sin(40θ−3t)·e^(−0.02r²)",
    icon: "💫",
    color: "gold",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0.5, 4],
    ],
    fn: (theta, r, t = 0) => [
      r * Math.cos(theta + (t * 0.5) / r),
      0.05 * Math.sin(40 * theta - t * 3) * Math.exp(-0.02 * r * r),
      r * Math.sin(theta + (t * 0.5) / r),
    ],
    type: "surface",
  },
  {
    id: "dark_matter_halo",
    name: "Dark Matter Halo",
    equation: "r = 1/(1+0.2·sin(8θ)·cos(8φ))",
    icon: "🌑",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r =
        1 / (1 + 0.2 * Math.sin(8 * theta + t * 0.5) * Math.cos(8 * phi));
      return [
        r * Math.sin(phi) * Math.cos(theta) * 3,
        r * Math.cos(phi) * 3,
        r * Math.sin(phi) * Math.sin(theta) * 3,
      ];
    },
    type: "surface",
  },
  {
    id: "cosmic_bubble",
    name: "Cosmic Bubble",
    equation: "r = 1+0.2·sin(10u+t)·sin(10v)",
    icon: "🫧",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const r = 1 + 0.2 * Math.sin(10 * u + t) * Math.sin(10 * v);
      return [
        r * Math.sin(v) * Math.cos(u) * 2.5,
        r * Math.cos(v) * 2.5,
        r * Math.sin(v) * Math.sin(u) * 2.5,
      ];
    },
    type: "surface",
  },
  {
    id: "gravity_well",
    name: "Gravity Well",
    equation: "y = −10/(1+x²+z²)",
    icon: "🌀",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => [
      x,
      -10 / (1 + x * x + z * z) + 0.05 * Math.sin(t * 2),
      z,
    ],
    type: "surface",
  },
  {
    id: "planetary_terrain",
    name: "Planetary Terrain",
    equation: "y = 0.2·sin(5x)·cos(5z)+0.1·sin(20x)·cos(20z)",
    icon: "🌍",
    color: "emerald",
    animated: true,
    category: "Cosmic",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => {
      const y =
        0.2 * Math.sin(5 * x + t * 0.3) * Math.cos(5 * z) +
        0.1 * Math.sin(20 * x) * Math.cos(20 * z);
      return [x, y * 2, z];
    },
    type: "surface",
  },
  {
    id: "lunar_surface",
    name: "Lunar Surface",
    equation: "y = 0.3·sin(x²+z²) / (1+0.1r²)",
    icon: "🌙",
    color: "gold",
    animated: true,
    category: "Cosmic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z) + 0.1;
      return [
        x,
        ((0.3 * Math.sin(x * x + z * z + t * 0.5)) / (1 + 0.1 * r * r)) * 3,
        z,
      ];
    },
    type: "surface",
  },
  {
    id: "comet_tail",
    name: "Comet Tail",
    icon: "☄",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [-1, 1],
      [0, 10],
    ],
    fn: (u, tp, t = 0) => [
      tp,
      Math.sin(3 * tp + t) * Math.exp(-0.1 * tp),
      Math.cos(5 * tp + t * 0.5) * Math.exp(-0.1 * tp),
    ],
    type: "line",
  },
  {
    id: "spiral_galaxy",
    name: "Logarithmic Galaxy Arms",
    equation: "r = 0.3·e^(0.15θ)",
    icon: "🌌",
    color: "gold",
    animated: true,
    category: "Cosmic",
    range: [
      [-1, 1],
      [0, Math.PI * 4],
    ],
    fn: (u, theta, t = 0) => {
      const r = 0.3 * Math.exp(0.15 * theta);
      return [
        r * Math.cos(theta + t * 0.2),
        0.2 * Math.sin(6 * theta + t),
        r * Math.sin(theta + t * 0.2),
      ];
    },
    type: "line",
  },
  {
    id: "cosmic_vortex",
    name: "Cosmic Vortex",
    equation: "(r·cos(r+5/r), 0.5·sin(10r+2t), r·sin(r+5/r))",
    icon: "🌪",
    color: "pink",
    animated: true,
    category: "Cosmic",
    range: [
      [-1, 1],
      [0.1, Math.PI * 4],
    ],
    fn: (u, r, t = 0) => [
      r * Math.cos(r + 5 / r + t * 0.3),
      Math.sin(10 * r + t * 2) * 0.5,
      r * Math.sin(r + 5 / r + t * 0.3),
    ],
    type: "line",
  },
  {
    id: "radiation_shell",
    name: "Radiation Shell",
    equation: "r = 1+0.25·sin(50θ+2t)·sin(50φ)",
    icon: "☢",
    color: "orange",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r = 1 + 0.25 * Math.sin(50 * theta + t * 2) * Math.sin(50 * phi);
      return [
        r * Math.sin(phi) * Math.cos(theta) * 2.5,
        r * Math.cos(phi) * 2.5,
        r * Math.sin(phi) * Math.sin(theta) * 2.5,
      ];
    },
    type: "surface",
  },
  {
    id: "plasma_sphere",
    name: "Plasma Sphere",
    equation: "r = 1+0.15·sin(20θ+10φ+3t)",
    icon: "⚛",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r = 1 + 0.15 * Math.sin(20 * theta + 10 * phi + t * 3);
      return [
        r * Math.sin(phi) * Math.cos(theta) * 2.5,
        r * Math.cos(phi) * 2.5,
        r * Math.sin(phi) * Math.sin(theta) * 2.5,
      ];
    },
    type: "surface",
  },
  {
    id: "exoplanet_mountains",
    name: "Exoplanet Mountains",
    equation: "y = Σ sin(2ⁿx)·cos(2ⁿz) / 2ⁿ  (n=1..4)",
    icon: "⛰",
    color: "emerald",
    animated: true,
    category: "Cosmic",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => {
      let y = 0;
      for (let n = 1; n <= 4; n++)
        y +=
          (Math.sin(Math.pow(2, n) * x + t * 0.3) *
            Math.cos(Math.pow(2, n) * z)) /
          Math.pow(2, n);
      return [x, y, z];
    },
    type: "surface",
  },
  {
    id: "time_warp",
    name: "Time Warp Surface",
    equation: "y = sin(x²−z²+2t) / (1+0.05r²)",
    icon: "⏱",
    color: "pink",
    animated: true,
    category: "Cosmic",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => [
      x,
      Math.sin(x * x - z * z + t * 2) / (1 + 0.05 * (x * x + z * z)),
      z,
    ],
    type: "surface",
  },
  {
    id: "photon_wave",
    name: "Photon Wave",
    equation: "y = sin(30x+30z−5t)·e^(−0.02r²)",
    icon: "🌊",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => [
      x,
      Math.sin(30 * x + 30 * z - t * 5) *
        Math.exp(-0.02 * (x * x + z * z)) *
        0.5,
      z,
    ],
    type: "surface",
  },
  {
    id: "interstellar_portal",
    name: "Interstellar Portal",
    equation: "((2+cos 8v)cos u, (2+cos 8v)sin u, sin 8v)",
    icon: "🌀",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => [
      (2 + Math.cos(8 * v)) * Math.cos(u + t * 0.3),
      (2 + Math.cos(8 * v)) * Math.sin(u + t * 0.3),
      Math.sin(8 * v),
    ],
    type: "surface",
  },
  {
    id: "neutron_star",
    name: "Neutron Star Crust",
    icon: "⭐",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r = 2 + 0.4 * Math.sin(40 * theta + t * 5) * Math.sin(30 * phi);
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ];
    },
    type: "surface",
  },
  {
    id: "magnetar_field",
    name: "Magnetar Field Lines",
    icon: "🧲",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 4],
      [-3, 3],
    ],
    fn: (u, v, t = 0) => [
      Math.cos(u * 3 + t) * (2 + Math.sin(v * 2)),
      v * 0.8,
      Math.sin(u * 3 + t) * (2 + Math.cos(v * 2)),
    ],
    type: "line",
  },

  /* ── Waves & Physics ── */
  {
    id: "standing_wave",
    name: "Standing Wave",
    equation: "y = sin(πx)·cos(πz)·cos(2t)",
    icon: "〰",
    color: "cyan",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => [
      x,
      Math.sin(Math.PI * x) * Math.cos(Math.PI * z) * Math.cos(2 * t) * 1.2,
      z,
    ],
    type: "surface",
  },
  {
    id: "double_slit",
    name: "Double-Slit Interference",
    equation: "y = cos(r₁)·e^(−r₁/4) + cos(r₂)·e^(−r₂/4)",
    icon: "🔬",
    color: "emerald",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r1 = Math.sqrt((x - 1) ** 2 + z * z) + 0.01;
      const r2 = Math.sqrt((x + 1) ** 2 + z * z) + 0.01;
      return [
        x,
        (Math.cos(r1 * 3 - t * 2) * Math.exp(-r1 / 4) +
          Math.cos(r2 * 3 - t * 2) * Math.exp(-r2 / 4)) *
          0.8,
        z,
      ];
    },
    type: "surface",
  },
  {
    id: "drum_membrane",
    name: "Drum Membrane Mode",
    equation: "y = J₀(kr)·cos(ωt)",
    icon: "🥁",
    color: "orange",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z);
      const j0 = Math.cos(r * 1.5) * Math.exp(-r * 0.08);
      return [x, j0 * Math.cos(t * 2.5) * 1.5, z];
    },
    type: "surface",
  },
  {
    id: "shockwave",
    name: "Shockwave Cone",
    equation: "y = e^(−2(r−vt)²)·sin(8(r−vt))",
    icon: "💢",
    color: "pink",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z);
      const front = r - t * 1.2;
      return [x, Math.exp(-2 * front * front) * Math.sin(8 * front) * 1.2, z];
    },
    type: "surface",
  },
  {
    id: "electromagnetic_field",
    name: "EM Dipole Field",
    equation: "y = cos(θ)/r² · sin(ωt)",
    icon: "⚡",
    color: "gold",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-3.5, 3.5],
      [-3.5, 3.5],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z) + 0.3;
      return [x, (x / r / (r * r)) * Math.sin(t * 2) * 3, z];
    },
    type: "surface",
  },
  {
    id: "soliton_wave",
    name: "Soliton Wave",
    equation: "y = sech²(x − vt)",
    icon: "🌊",
    color: "cyan",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const sech = (a) => 2 / (Math.exp(a) + Math.exp(-a));
      return [x, sech(x - t * 1.5) ** 2 * Math.cos(z * 0.8) * 1.5, z];
    },
    type: "surface",
  },
  {
    id: "schrodinger_packet",
    name: "Schrödinger Wave Packet",
    equation: "ψ = e^(−σr²)·cos(kx − ωt)",
    icon: "Ψ",
    color: "violet",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const envelope = Math.exp(-0.15 * ((x - t) ** 2 + z * z * 0.3));
      return [x, envelope * Math.cos(3 * x - t * 2) * 1.5, z];
    },
    type: "surface",
  },
  {
    id: "kelvin_wake",
    name: "Kelvin Ship Wake",
    equation: "V-shaped wave pattern",
    icon: "🚤",
    color: "cyan",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [0, 6],
    ],
    fn: (x, z, t = 0) => {
      const wake =
        Math.exp(-0.6 * Math.abs(x)) * Math.sin(8 * z - t * 3) * (1 / (z + 1));
      return [x, wake * 1.8, z];
    },
    type: "surface",
  },
  {
    id: "quantum_harmonic",
    name: "Quantum Harmonic Oscillator",
    equation: "ψ_n(x) probability density",
    icon: "Ψ",
    color: "violet",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const psi = Math.exp(-x * x * 0.3) * Math.cos(3 * x - t * 1.5);
      return [x, psi * 2.5 + Math.sin(z * 4) * 0.3, z];
    },
    type: "surface",
  },
  {
    id: "wave_ribbon",
    name: "Wave Ribbon",
    equation: "Sinusoidal ribbon",
    icon: "〰",
    color: "cyan",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [0, Math.PI * 3],
    ],
    fn: (x, v, t = 0) => [
      x,
      Math.sin(x * 3 + t * 2) * 1.8,
      v * 1.8 + Math.cos(x * 4) * 0.6,
    ],
    type: "surface",
  },

  /* ── Algebraic ── */
  {
    id: "cassini_oval",
    name: "Cassini Oval Surface",
    equation: "((x²+z²)² = a⁴cos 2θ)",
    icon: "🥚",
    color: "gold",
    category: "Algebraic",
    range: [
      [0, Math.PI * 2],
      [-1.2, 1.2],
    ],
    fn: (theta, v) => {
      const a = 1.8;
      const cos2 = Math.cos(2 * theta);
      if (cos2 < 0) return [0, v * 0.01, 0];
      const r = a * Math.sqrt(Math.abs(cos2));
      return [r * Math.cos(theta) * 1.5, v * 1.2, r * Math.sin(theta) * 1.5];
    },
    type: "surface",
  },
  {
    id: "kuen_surface",
    name: "Kuen Surface",
    equation: "(2(cos u+u sin u)sin v/(1+u²sin²v), ...)",
    icon: "𝒦",
    color: "emerald",
    category: "Algebraic",
    range: [
      [-4, 4],
      [0.05, Math.PI - 0.05],
    ],
    fn: (u, v) => {
      const d = 1 + u * u * Math.sin(v) * Math.sin(v);
      return [
        ((2 * (Math.cos(u) + u * Math.sin(u)) * Math.sin(v)) / d) * 0.7,
        ((2 * (Math.sin(u) - u * Math.cos(u)) * Math.sin(v)) / d) * 0.7,
        (Math.log(Math.tan(v / 2)) + (2 * Math.cos(v)) / d) * 0.7,
      ];
    },
    type: "surface",
  },
  {
    id: "cross_cap",
    name: "Cross-Cap",
    equation: "(sin u sin 2v, sin 2u cos²v, cos 2u cos²v)",
    icon: "✚",
    color: "pink",
    category: "Algebraic",
    range: [
      [0, Math.PI],
      [0, Math.PI],
    ],
    fn: (u, v) => [
      Math.sin(u) * Math.sin(2 * v) * 2,
      Math.sin(2 * u) * Math.cos(v) * Math.cos(v) * 2,
      Math.cos(2 * u) * Math.cos(v) * Math.cos(v) * 2,
    ],
    type: "surface",
  },
  {
    id: "bohemian_dome",
    name: "Bohemian Dome",
    equation: "(a·cos u, b·cos v+a·sin u, c·sin v)",
    icon: "⛺",
    color: "orange",
    animated: true,
    category: "Algebraic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const a = 0.5,
        b = 1.5,
        c = 1.0;
      return [
        a * Math.cos(u + t * 0.2) * 2,
        (b * Math.cos(v) + a * Math.sin(u + t * 0.2)) * 2,
        c * Math.sin(v) * 2,
      ];
    },
    type: "surface",
  },
  {
    id: "steiners_roman",
    name: "Steiner's Roman Surface II",
    equation: "(sin 2u·cos²v, sin u·sin 2v, cos u·sin 2v)",
    icon: "🏛",
    color: "violet",
    category: "Algebraic",
    range: [
      [0, Math.PI],
      [0, Math.PI],
    ],
    fn: (u, v) => [
      Math.sin(2 * u) * Math.cos(v) ** 2 * 2.2,
      Math.sin(u) * Math.sin(2 * v) * 2.2,
      Math.cos(u) * Math.sin(2 * v) * 2.2,
    ],
    type: "surface",
  },
  {
    id: "barth_sextic",
    name: "Barth Sextic (approx)",
    equation: "4(φ²x²−y²)(φ²y²−z²)(φ²z²−x²) = (1+2φ)(x²+y²+z²−1)²",
    icon: "✡",
    color: "gold",
    category: "Algebraic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v) => {
      const r = 1 + 0.4 * Math.abs(Math.sin(3 * u) * Math.cos(3 * v));
      return [
        r * Math.sin(v) * Math.cos(u) * 2,
        r * Math.cos(v) * 2,
        r * Math.sin(v) * Math.sin(u) * 2,
      ];
    },
    type: "surface",
  },
  {
    id: "cayley_cubic",
    name: "Cayley Cubic",
    equation: "Cubic surface with 4 nodes",
    icon: "🧊",
    color: "gold",
    category: "Algebraic",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (u, v) => [u, v, u * u * u - v * v * v + u * v * 0.5],
    type: "surface",
  },
  {
    id: "clebsch_cubic",
    name: "Clebsch Cubic Surface",
    equation: "Cubic surface with 27 lines",
    icon: "◼",
    color: "gold",
    category: "Algebraic",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (u, v) => [u, v, (u * u * u - 3 * u * v * v) * 0.6],
    type: "surface",
  },

  /* ── Nature & Organic ── */
  {
    id: "seashell",
    name: "Seashell",
    icon: "🐚",
    color: "orange",
    category: "Nature",
    range: [
      [0, Math.PI * 6],
      [0, Math.PI * 2],
    ],
    fn: (u, v) => {
      const b = 0.2,
        scale = 0.3;
      const r = Math.exp((b * u) / (2 * Math.PI)) * scale;
      return [
        r * Math.cos(u) * (1 + Math.cos(v)),
        r * Math.sin(u) * (1 + Math.cos(v)),
        r * Math.sin(v) - r * 0.5,
      ];
    },
    type: "surface",
  },
  {
    id: "leaf_surface",
    name: "Leaf Surface",
    equation: "y = e^(−r)·sin²(4θ)",
    icon: "🍃",
    color: "emerald",
    animated: true,
    category: "Nature",
    range: [
      [0, Math.PI * 2],
      [0, 3],
    ],
    fn: (theta, r, t = 0) => {
      const mask = Math.sin(theta) * Math.sin(theta);
      const y = Math.exp(-r) * mask * (1 + 0.05 * Math.sin(t * 3));
      return [r * Math.cos(theta), y * 2, r * Math.sin(theta)];
    },
    type: "surface",
  },
  {
    id: "rose_surface",
    name: "3D Rose Surface",
    equation: "r = cos(kθ), revolved around y",
    icon: "🌹",
    color: "pink",
    animated: true,
    category: "Nature",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (phi, theta, t = 0) => {
      const k = 4;
      const r = Math.abs(Math.cos(k * phi + t * 0.2)) + 0.2;
      return [
        r * Math.sin(theta) * Math.cos(phi) * 2.5,
        r * Math.cos(theta) * 2.5,
        r * Math.sin(theta) * Math.sin(phi) * 2.5,
      ];
    },
    type: "surface",
  },
  {
    id: "coral_surface",
    name: "Coral Reef Surface",
    icon: "🪸",
    color: "orange",
    animated: true,
    category: "Nature",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z);
      const base =
        Math.sin(x * Math.PI * 0.5) *
        Math.cos(z * Math.PI * 0.5) *
        Math.exp(-0.1 * r);
      const ripple = 0.15 * Math.sin(r * 3 - t * 2);
      return [x, (base + ripple) * 1.5, z];
    },
    type: "surface",
  },
  {
    id: "fern_curve",
    name: "Fern Spiral",
    icon: "🌿",
    color: "emerald",
    animated: true,
    category: "Nature",
    range: [
      [-1, 1],
      [0, Math.PI * 8],
    ],
    fn: (u, theta, t = 0) => {
      const decay = Math.exp(-0.1 * theta);
      const r = decay + 0.1;
      return [
        r * Math.cos(theta + t * 0.3) * 1.5,
        theta * 0.2 - Math.PI * 0.8,
        r * Math.sin(theta + t * 0.3) * 1.5,
      ];
    },
    type: "line",
  },
  {
    id: "brain_coral",
    name: "Brain Coral Maze",
    equation: "y = 0.3·sin(10x)·cos(10z)·sech(r)",
    icon: "🧠",
    color: "pink",
    animated: true,
    category: "Nature",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z);
      const sech = 2 / (Math.exp(r) + Math.exp(-r));
      return [
        x,
        0.3 * Math.sin(10 * x + t * 0.5) * Math.cos(10 * z) * sech * 4,
        z,
      ];
    },
    type: "surface",
  },
  {
    id: "mushroom_cap",
    name: "Mushroom Cap",
    icon: "🍄",
    color: "gold",
    animated: true,
    category: "Nature",
    range: [
      [0, Math.PI * 2],
      [0, 2],
    ],
    fn: (u, v, t = 0) => {
      const r = v * 1.8;
      return [
        r * Math.cos(u),
        -Math.exp(-0.8 * v) * 2 + Math.sin(u * 12) * 0.08,
        r * Math.sin(u),
      ];
    },
    type: "surface",
  },
  {
    id: "dna_helix_double",
    name: "Double Helix DNA",
    icon: "🧬",
    color: "emerald",
    animated: true,
    category: "Nature",
    range: [
      [0, Math.PI * 2],
      [0, 12],
    ],
    fn: (u, v, t = 0) => {
      const phase = v * 1.5 + t * 2;
      return [
        Math.cos(phase) * 1.2 + Math.cos(phase + Math.PI) * 0.3,
        v - 6,
        Math.sin(phase) * 1.2 + Math.sin(phase + Math.PI) * 0.3,
      ];
    },
    type: "line",
  },
  {
    id: "pineapple_surface",
    name: "Pineapple Texture",
    icon: "🍍",
    color: "orange",
    animated: true,
    category: "Nature",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const r = 2.2 + 0.15 * Math.sin(12 * u) * Math.sin(8 * v);
      return [
        r * Math.sin(v) * Math.cos(u),
        r * Math.cos(v),
        r * Math.sin(v) * Math.sin(u),
      ];
    },
    type: "surface",
  },
  {
    id: "perlin_terrain",
    name: "Procedural Terrain",
    equation: "fBm noise",
    icon: "🏔",
    color: "emerald",
    animated: true,
    category: "Nature",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      let h = 0,
        amp = 1;
      for (let i = 0; i < 6; i++) {
        h +=
          Math.sin(x * Math.pow(2, i) + t * 0.1) *
          Math.cos(z * Math.pow(2, i)) *
          amp;
        amp *= 0.5;
      }
      return [x, h * 1.4, z];
    },
    type: "surface",
  },

  /* ── Fractals ── */
  {
    id: "mandelbulb_slice",
    name: "Mandelbulb Slice",
    equation: "Mandelbulb cross-section escape-time map",
    icon: "🔮",
    color: "violet",
    category: "Fractals",
    range: [
      [-2.5, 2.5],
      [-2.5, 2.5],
    ],
    fn: (x, z) => {
      let cx = x,
        cz = z,
        cy = 0,
        bx = 0,
        by = 0,
        bz = 0,
        i = 0;
      for (; i < 8; i++) {
        const r = Math.sqrt(bx * bx + by * by + bz * bz);
        if (r > 2) break;
        const n = 8,
          theta = Math.atan2(Math.sqrt(bx * bx + bz * bz), by),
          phi = Math.atan2(bz, bx),
          rn = Math.pow(r, n);
        bx = rn * Math.sin(n * theta) * Math.cos(n * phi) + cx;
        by = rn * Math.cos(n * theta) + cy;
        bz = rn * Math.sin(n * theta) * Math.sin(n * phi) + cz;
      }
      return [x, (i / 8) * 2 - 0.5, z];
    },
    type: "surface",
  },
  {
    id: "julia_landscape",
    name: "Julia Set Landscape",
    equation: "z_{n+1} = z_n² + c, height = escape time",
    icon: "🌀",
    color: "rainbow",
    category: "Fractals",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (x, z) => {
      const cx = -0.7,
        cy = 0.27015;
      let zx = x,
        zy = z,
        i = 0;
      for (; i < 16; i++) {
        if (zx * zx + zy * zy > 4) break;
        const tmp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = tmp;
      }
      return [x, (i / 16) * 2, z];
    },
    type: "surface",
  },
  {
    id: "sierpinski_approx",
    name: "Sierpiński Pyramid Approx",
    equation: "Iterated function system surface",
    icon: "△",
    color: "gold",
    category: "Fractals",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z) => {
      const r = Math.sqrt(x * x + z * z);
      let y = 0;
      for (let n = 1; n <= 6; n++)
        y +=
          Math.sin(x * Math.pow(2, n) + z * Math.pow(2, n) * 0.7) /
          Math.pow(2, n);
      return [x, y * (1 - Math.min(1, r / 3.5)) * 1.5, z];
    },
    type: "surface",
  },
  {
    id: "dragon_curve_surface",
    name: "Dragon Flame Surface",
    equation: "y = Σ sin(3ⁿx)·cos(2ⁿz) / 3ⁿ",
    icon: "🐉",
    color: "orange",
    animated: true,
    category: "Fractals",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => {
      let y = 0;
      for (let n = 1; n <= 5; n++)
        y +=
          (Math.sin(Math.pow(3, n) * x * 0.4 + t * 0.3) *
            Math.cos(Math.pow(2, n) * z * 0.4)) /
          Math.pow(3, n);
      return [x, y * 2.5, z];
    },
    type: "surface",
  },
  {
    id: "burning_ship",
    name: "Burning Ship Fractal",
    equation: "z = (|Re z| + i|Im z|)^2 + c",
    icon: "🔥",
    color: "orange",
    category: "Fractals",
    range: [
      [-2, 1],
      [-1.5, 1.5],
    ],
    fn: (x, z) => {
      let zx = 0,
        zy = 0,
        i = 0;
      const cx = x * 0.8,
        cy = z * 0.8;
      for (; i < 12; i++) {
        const zx2 = Math.abs(zx),
          zy2 = Math.abs(zy);
        const tx = zx2 * zx2 - zy2 * zy2 + cx;
        zy = 2 * zx2 * zy2 + cy;
        zx = tx;
        if (zx * zx + zy * zy > 4) break;
      }
      return [x, i * 0.25 - 1.5, z];
    },
    type: "surface",
  },

  /* ── Abstract ── */
  {
    id: "voronoi_3d_approx",
    name: "Voronoi Landscape",
    equation: "Cellular noise heightmap",
    icon: "📦",
    color: "orange",
    animated: true,
    category: "Abstract",
    range: [
      [-3.5, 3.5],
      [-3.5, 3.5],
    ],
    fn: (x, z, t = 0) => {
      let h = 0;
      for (let i = 1; i <= 5; i++) {
        const cx = Math.floor(x * i) / i,
          cz = Math.floor(z * i) / i;
        h += Math.sin(cx * 12 + cz * 8 + t * i) / i;
      }
      return [x, h * 1.6, z];
    },
    type: "surface",
  },

  /* ════════════════════════════════════════
     50 NEW PRESETS
  ════════════════════════════════════════ */

  /* ── New Classic ── */
  {
    id: "epitrochoid_3d",
    name: "Epitrochoid Surface",
    equation: "((R+r)cos t − d·cos((R+r)t/r), ...)",
    icon: "🔁",
    color: "cyan",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const R = 3,
        r = 1,
        d = 1.5;
      const x =
        (R + r) * Math.cos(u) - d * Math.cos(((R + r) * u) / r + t * 0.4);
      const z =
        (R + r) * Math.sin(u) - d * Math.sin(((R + r) * u) / r + t * 0.4);
      return [x * Math.sin(v) * 0.6, Math.cos(v) * 2, z * Math.sin(v) * 0.6];
    },
    type: "surface",
  },
  {
    id: "viviani_curve",
    name: "Viviani Curve",
    equation: "(1+cos t, sin t, 2sin(t/2))",
    icon: "∿",
    color: "emerald",
    animated: true,
    category: "Classic",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => [
      (1 + Math.cos(v)) * 1.5,
      Math.sin(v) * 1.5,
      2 * Math.sin(v / 2 + t * 0.3) * 1.5,
    ],
    type: "line",
  },
  {
    id: "superellipsoid",
    name: "Superellipsoid",
    equation: "(|cos v|^(2/e1)cos u, |sin v|^(2/e2), |cos v|^(2/e1)sin u)",
    icon: "🔷",
    color: "violet",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 2],
      [-Math.PI / 2, Math.PI / 2],
    ],
    fn: (u, v, t = 0) => {
      const e1 = 0.5 + 0.4 * Math.sin(t * 0.5);
      const e2 = 0.5 + 0.4 * Math.cos(t * 0.5);
      const cv = Math.cos(v),
        sv = Math.sin(v);
      const scv = Math.sign(cv) * Math.pow(Math.abs(cv), e1);
      const ssv = Math.sign(sv) * Math.pow(Math.abs(sv), e2);
      return [scv * Math.cos(u) * 2, ssv * 2, scv * Math.sin(u) * 2];
    },
    type: "surface",
  },
  {
    id: "rose_3d_5petals",
    name: "5-Petal Rose",
    equation: "r = cos(5θ/2)",
    icon: "🌸",
    color: "pink",
    animated: true,
    category: "Classic",
    range: [
      [0, Math.PI * 4],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r = Math.abs(Math.cos(2.5 * theta + t * 0.3)) * 2.5;
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ];
    },
    type: "surface",
  },
  {
    id: "witch_of_agnesi",
    name: "Witch of Agnesi",
    equation: "y = 8a³/(x²+4a²)",
    icon: "🧙",
    color: "gold",
    animated: true,
    category: "Classic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const a = 1 + 0.2 * Math.sin(t);
      return [x, (8 * a * a * a) / (x * x + 4 * a * a), z];
    },
    type: "surface",
  },

  /* ── New Mathematical ── */
  {
    id: "lame_curve_surface",
    name: "Lamé Curve (Squircle) Surface",
    equation: "|x/a|^n + |z/b|^n = 1",
    icon: "⬜",
    color: "cyan",
    animated: true,
    category: "Mathematical",
    range: [
      [0, Math.PI * 2],
      [-2, 2],
    ],
    fn: (theta, v, t = 0) => {
      const n = 2 + Math.abs(Math.sin(t * 0.3)) * 6;
      const cosT = Math.cos(theta),
        sinT = Math.sin(theta);
      const x = Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n) * 2.5;
      const z = Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n) * 2.5;
      return [x, v * 0.8, z];
    },
    type: "surface",
  },
  {
    id: "geodesic_dome",
    name: "Geodesic Dome",
    equation: "Icosahedral subdivision of sphere",
    icon: "⬡",
    color: "emerald",
    animated: true,
    category: "Mathematical",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI / 2],
    ],
    fn: (u, v, t = 0) => {
      const freq = 4;
      const r = 2.5 + 0.08 * Math.sin(freq * u + t) * Math.sin(freq * v);
      return [
        r * Math.sin(v) * Math.cos(u),
        r * Math.cos(v),
        r * Math.sin(v) * Math.sin(u),
      ];
    },
    type: "surface",
  },
  {
    id: "apollonian_gasket",
    name: "Apollonian Foam",
    equation: "Nested tangent circle arrangement",
    icon: "⊙",
    color: "violet",
    animated: true,
    category: "Mathematical",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => {
      let y = 0;
      for (let k = 1; k <= 5; k++) {
        const scale = Math.pow(0.5, k);
        y += Math.sin(x / scale + t * 0.3) * Math.cos(z / scale) * scale;
      }
      return [x, y * 1.8, z];
    },
    type: "surface",
  },
  {
    id: "cartan_umbrella",
    name: "Cartan Umbrella",
    equation: "z(x²+y²) = x³",
    icon: "☂",
    color: "orange",
    category: "Mathematical",
    range: [
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI],
    ],
    fn: (u, v) => {
      const x = Math.cos(u) * v,
        z = Math.sin(u) * v;
      const y = ((x * x * x) / Math.max(0.01, x * x + z * z)) * 1.5;
      return [x, y, z];
    },
    type: "surface",
  },
  {
    id: "clifford_torus",
    name: "Clifford Torus",
    equation: "Flat torus in ℝ⁴ projected to ℝ³",
    icon: "◑",
    color: "cyan",
    animated: true,
    category: "Mathematical",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const w1 = Math.cos(u + t * 0.2),
        w2 = Math.sin(u + t * 0.2);
      const w3 = Math.cos(v),
        w4 = Math.sin(v);
      const d = 2 - w1 * w3;
      return [((w2 * w3) / d) * 3, ((w1 * w4) / d) * 3, ((w2 * w4) / d) * 3];
    },
    type: "surface",
  },

  /* ── New Topology ── */
  {
    id: "crosscap_2",
    name: "Crosscap Variant",
    equation: "Immersion of RP² in ℝ³",
    icon: "✛",
    color: "gold",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const r = Math.sin(u);
      return [
        r * Math.cos(v + t * 0.3) * 2,
        r * Math.sin(v + t * 0.3) * 2,
        Math.cos(u) * 2 + Math.cos(2 * v) * Math.sin(u) * 0.5,
      ];
    },
    type: "surface",
  },
  {
    id: "lawson_surface",
    name: "Lawson Surface τ(3,1)",
    equation: "Minimal surface in S³",
    icon: "⊗",
    color: "pink",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => [
      Math.sin(u) * Math.cos(v + t * 0.2) * 2.5,
      Math.sin(u) * Math.sin(v + t * 0.2) * 2.5,
      Math.cos(u) * Math.sin(2 * v) * 1.2,
    ],
    type: "surface",
  },
  {
    id: "seifert_surface",
    name: "Seifert Surface",
    equation: "Spanning surface of trefoil knot",
    icon: "🌊",
    color: "emerald",
    animated: true,
    category: "Topology",
    range: [
      [0, Math.PI * 2],
      [-1, 1],
    ],
    fn: (u, v, t = 0) => {
      const r = 2 + Math.cos(3 * u + t * 0.2);
      return [
        r * Math.cos(2 * u + t * 0.1) * (1 + v * 0.3),
        r * Math.sin(2 * u + t * 0.1) * (1 + v * 0.3),
        v * Math.sin(3 * u) * 0.8,
      ];
    },
    type: "surface",
  },

  /* ── New Attractors ── */
  {
    id: "duffing_attractor",
    name: "Duffing Oscillator",
    equation: "ẍ + δẋ − x + x³ = γcos(ωt)",
    icon: "🔄",
    color: "gold",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [0.1, 0.1, 0],
      scale: 1.2,
      dt: 0.02,
      steps: 8000,
      deriv: (x, y, z) => {
        const delta = 0.3,
          gamma = 0.37,
          omega = 1.2;
        return [y, x - x * x * x - delta * y + gamma * Math.cos(omega * z), 1];
      },
    },
  },
  {
    id: "burke_shaw_attractor",
    name: "Burke–Shaw Attractor",
    equation: "ẋ=−s(x+y), ẏ=−y−sxz, ż=sxy+v",
    icon: "🌀",
    color: "pink",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [1, 0, 0],
      scale: 0.25,
      dt: 0.003,
      steps: 11000,
      deriv: (x, y, z) => {
        const s = 10,
          v = 4.272;
        return [-s * (x + y), -y - s * x * z, s * x * y + v];
      },
    },
  },
  {
    id: "genesio_tesi_attractor",
    name: "Genesio–Tesi Attractor",
    equation: "ẋ=y, ẏ=z, ż=−cx−by−az+x²",
    icon: "🦚",
    color: "emerald",
    category: "Attractors",
    type: "attractor",
    attractor: {
      init: [0.1, 0.1, 0.1],
      scale: 0.35,
      dt: 0.008,
      steps: 9000,
      deriv: (x, y, z) => {
        const a = 0.44,
          b = 1.3,
          c = 0.507;
        return [y, z, -c * x - b * y - a * z + x * x];
      },
    },
  },

  /* ── New Knots ── */
  {
    id: "torus_knot_5_2",
    name: "Torus Knot (5,2)",
    equation: "((R+r·cos 2t)cos 5t, r·sin 2t, (R+r·cos 2t)sin 5t)",
    icon: "✦",
    color: "cyan",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const p = 5,
        q = 2,
        R = 2,
        r = 0.5;
      return [
        (R + r * Math.cos(q * v)) * Math.cos(p * v + t * 0.2),
        r * Math.sin(q * v),
        (R + r * Math.cos(q * v)) * Math.sin(p * v + t * 0.2),
      ];
    },
    type: "line",
  },
  {
    id: "torus_knot_3_5",
    name: "Torus Knot (3,5)",
    icon: "⭕",
    color: "violet",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const p = 3,
        q = 5,
        R = 2,
        r = 0.5;
      return [
        (R + r * Math.cos(q * v)) * Math.cos(p * v + t * 0.3),
        r * Math.sin(q * v),
        (R + r * Math.cos(q * v)) * Math.sin(p * v + t * 0.3),
      ];
    },
    type: "line",
  },
  {
    id: "granny_knot",
    name: "Granny Knot",
    equation: "Sum of two trefoil knots",
    icon: "🪢",
    color: "orange",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => [
      (Math.sin(v) + 2 * Math.sin(2 * v) + 0.8 * Math.sin(4 * v)) * 0.9,
      (Math.cos(v) - 2 * Math.cos(2 * v) + 0.5 * Math.cos(4 * v)) * 0.9,
      -Math.sin(3 * v + t * 0.2) * 1.2,
    ],
    type: "line",
  },

  /* ── New Cosmic ── */
  {
    id: "magnetosphere",
    name: "Magnetosphere",
    equation: "Compressed dipole field",
    icon: "🌐",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0.1, Math.PI - 0.1],
    ],
    fn: (theta, phi, t = 0) => {
      const r = 2.5 * Math.sin(phi) ** 2;
      const stretch = 1 + 0.15 * Math.cos(theta + t * 0.3);
      return [
        r * Math.sin(phi) * Math.cos(theta) * stretch,
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta) * stretch,
      ];
    },
    type: "surface",
  },
  {
    id: "pulsar_jets",
    name: "Pulsar Jets",
    equation: "Bipolar outflow",
    icon: "💨",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [-1, 1],
      [-6, 6],
    ],
    fn: (u, v, t = 0) => {
      const r = Math.exp(-0.15 * v * v);
      return [
        r * Math.cos(v * 4 + t * 2),
        v * 0.7,
        r * Math.sin(v * 4 + t * 2),
      ];
    },
    type: "line",
  },
  {
    id: "tidal_disruption",
    name: "Tidal Disruption Event",
    equation: "Stretched stream + accretion disk",
    icon: "🌊",
    color: "orange",
    animated: true,
    category: "Cosmic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z) + 0.1;
      const theta = Math.atan2(z, x);
      const stretch = Math.exp(-0.1 * r) * Math.sin(theta * 2 + t * 0.5);
      return [x, stretch * 1.5 - 2 / (r + 0.5), z];
    },
    type: "surface",
  },

  /* ── New Waves & Physics ── */
  {
    id: "bragg_diffraction",
    name: "Bragg Diffraction Pattern",
    equation: "Constructive interference from crystal planes",
    icon: "💎",
    color: "emerald",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      let y = 0;
      for (let n = 1; n <= 4; n++) {
        y += (Math.cos(n * x * 1.5 + t * 0.5) * Math.cos(n * z * 1.5)) / n;
      }
      return [x, y, z];
    },
    type: "surface",
  },
  {
    id: "plasma_instability",
    name: "Plasma Kelvin-Helmholtz",
    equation: "Shear-flow instability",
    icon: "⚡",
    color: "pink",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const shear = Math.sin(z + t) * Math.exp(-0.1 * x * x);
      const kelvin =
        0.4 *
        Math.sin(3 * x + 2 * z + t * 1.5) *
        Math.exp(-0.05 * (x * x + z * z));
      return [x, shear + kelvin, z];
    },
    type: "surface",
  },
  {
    id: "nonlinear_schrodinger",
    name: "Nonlinear Schrödinger Soliton",
    equation: "ψ = sech(x−t)·e^(i(x/2−t/4))",
    icon: "Ψ",
    color: "gold",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const sech = 1 / Math.cosh(x - t);
      return [x, sech * Math.cos(x * 0.5 - t * 0.25 + z * 0.3) * 2.5, z];
    },
    type: "surface",
  },
  {
    id: "acoustic_resonance",
    name: "Acoustic Resonance Mode",
    equation: "ψ = sin(mx)·sin(nz)·cos(ωt)",
    icon: "🎵",
    color: "violet",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI],
    ],
    fn: (x, z, t = 0) => [
      x,
      Math.sin(2 * x) * Math.sin(3 * z) * Math.cos(t * 2.5) * 1.8,
      z,
    ],
    type: "surface",
  },
  {
    id: "rogue_wave",
    name: "Rogue Wave (Peregrine Soliton)",
    equation: "ψ = (1−4(1+2it)/(1+4x²+4t²))e^(it)",
    icon: "🌊",
    color: "cyan",
    animated: true,
    category: "Waves & Physics",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const denom = 1 + 4 * x * x + 4 * (z - t) * (z - t);
      const amplitude = Math.abs(1 - 4 / denom);
      return [x, amplitude * Math.cos(z + t) * 2.5, z];
    },
    type: "surface",
  },

  /* ── New Algebraic ── */
  {
    id: "togliatti_quintic",
    name: "Togliatti Quintic (approx)",
    equation: "Quintic surface with 31 nodes",
    icon: "⬟",
    color: "emerald",
    animated: true,
    category: "Algebraic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const k = 5;
      const r =
        1 + 0.3 * Math.abs(Math.cos((k * u) / 2)) * (1 + 0.1 * Math.sin(t));
      return [
        r * Math.sin(v) * Math.cos(u) * 2.2,
        r * Math.cos(v) * 2.2,
        r * Math.sin(v) * Math.sin(u) * 2.2,
      ];
    },
    type: "surface",
  },
  {
    id: "endrass_octic",
    name: "Endrass Octic (approx)",
    equation: "Octic surface with 168 nodes",
    icon: "✴",
    color: "gold",
    animated: true,
    category: "Algebraic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const r =
        1 +
        0.25 * Math.abs(Math.sin(4 * u) * Math.cos(4 * v)) +
        0.1 * Math.sin(t * 0.5);
      return [
        r * Math.sin(v) * Math.cos(u) * 2.4,
        r * Math.cos(v) * 2.4,
        r * Math.sin(v) * Math.sin(u) * 2.4,
      ];
    },
    type: "surface",
  },
  {
    id: "hunt_surface",
    name: "Hunt's Surface",
    equation: "4x²(x²+y²+2z²) = (1−z²)(1+2z²) variant",
    icon: "🏹",
    color: "pink",
    category: "Algebraic",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (u, v) => {
      const z = u * 0.8,
        y = v * 0.8;
      const x = Math.sqrt(
        Math.max(
          0,
          ((1 - z * z) * (1 + 2 * z * z)) /
            Math.max(0.01, 4 * (1 + y * y + 2 * z * z)),
        ),
      );
      return [x * 1.8, y * 2.2, z * 2.2];
    },
    type: "surface",
  },

  /* ── New Nature ── */
  {
    id: "sunflower_spiral",
    name: "Sunflower Spiral (Phyllotaxis)",
    equation: "r = √n, θ = n·137.5°",
    icon: "🌻",
    color: "gold",
    animated: true,
    category: "Nature",
    range: [
      [-1, 1],
      [0, 300],
    ],
    fn: (u, n, t = 0) => {
      const angle = n * 2.399963 + t * 0.1;
      const r = Math.sqrt(n) * 0.18;
      return [
        r * Math.cos(angle),
        Math.sin(n * 0.05) * 0.4,
        r * Math.sin(angle),
      ];
    },
    type: "line",
  },
  {
    id: "nautilus_shell",
    name: "Nautilus Shell",
    equation: "Equiangular spiral surface",
    icon: "🐚",
    color: "orange",
    animated: true,
    category: "Nature",
    range: [
      [0, Math.PI * 6],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const a = 0.18,
        k = 0.18;
      const r = a * Math.exp(k * u);
      return [
        r * Math.cos(u + t * 0.1) * (1 + Math.cos(v)),
        r * Math.sin(v) * 0.8,
        r * Math.sin(u + t * 0.1) * (1 + Math.cos(v)),
      ];
    },
    type: "surface",
  },
  {
    id: "lichen_patch",
    name: "Lichen Patch",
    equation: "Reaction-diffusion texture surface",
    icon: "🍀",
    color: "emerald",
    animated: true,
    category: "Nature",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => {
      let h = 0;
      for (let k = 1; k <= 6; k++) {
        h +=
          (Math.sin(x * k * 1.3 + t * 0.2) * Math.cos(z * k * 0.9 + t * 0.15)) /
          (k * 1.2);
      }
      return [x, h * 1.5, z];
    },
    type: "surface",
  },
  {
    id: "cactus_spine",
    name: "Cactus Spine Surface",
    equation: "Spiny radial surface",
    icon: "🌵",
    color: "emerald",
    animated: true,
    category: "Nature",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r =
        2 +
        0.6 *
          Math.abs(Math.sin(8 * theta + t * 0.4)) *
          Math.abs(Math.sin(8 * phi));
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ];
    },
    type: "surface",
  },

  /* ── New Fractals ── */
  {
    id: "newton_fractal_surface",
    name: "Newton Fractal (z³−1)",
    equation: "z_{n+1} = z − f(z)/f'(z), f(z)=z³−1",
    icon: "🔮",
    color: "rainbow",
    category: "Fractals",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (x, z) => {
      let re = x,
        im = z;
      let i = 0;
      for (; i < 20; i++) {
        const r2 = re * re + im * im;
        const r4 = r2 * r2;
        if (r4 < 1e-10) break;
        const dRe = (2 * re * re * re + re * im * im) / (3 * r4) + 1 / 3;
        const newRe =
          re -
          (re * re * re - 3 * re * im * im - 1) / (3 * (re * re + im * im));
        im = im - (3 * re * re * im - im * im * im) / (3 * (re * re + im * im));
        re = newRe;
      }
      return [x, (i / 20) * 2 - 1, z];
    },
    type: "surface",
  },
  {
    id: "cantor_dust_surface",
    name: "Cantor Dust Surface",
    equation: "Recursive self-similar exclusion",
    icon: "::::",
    color: "violet",
    category: "Fractals",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z) => {
      let h = 0;
      for (let n = 1; n <= 7; n++) {
        const scale = Math.pow(3, n);
        const cx = Math.abs(((x * scale) % 3) - 1.5);
        const cz = Math.abs(((z * scale) % 3) - 1.5);
        h += Math.exp(-cx * cx - cz * cz) / n;
      }
      return [x, h, z];
    },
    type: "surface",
  },
  {
    id: "barnsley_fern_3d",
    name: "Barnsley Fern Surface",
    equation: "IFS approximation in 3D",
    icon: "🌿",
    color: "emerald",
    animated: true,
    category: "Fractals",
    range: [
      [-3, 3],
      [-3, 3],
    ],
    fn: (x, z, t = 0) => {
      let h = 0;
      for (let n = 1; n <= 5; n++) {
        h +=
          Math.sin(x * Math.pow(1.6, n) + t * 0.2 * n) *
          Math.cos(z * Math.pow(1.4, n)) *
          Math.pow(0.6, n);
      }
      return [x, h * 2, z];
    },
    type: "surface",
  },

  /* ── New Abstract ── */
  {
    id: "penrose_tiling_surface",
    name: "Penrose Tiling Height",
    equation: "Quasicrystalline surface",
    icon: "🔶",
    color: "gold",
    animated: true,
    category: "Abstract",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      let h = 0;
      const angles = [
        0,
        (Math.PI * 2) / 5,
        (Math.PI * 4) / 5,
        (Math.PI * 6) / 5,
        (Math.PI * 8) / 5,
      ];
      for (const a of angles)
        h += Math.cos(x * Math.cos(a) + z * Math.sin(a) + t * 0.2);
      return [x, h * 0.5, z];
    },
    type: "surface",
  },
  {
    id: "interference_moire",
    name: "Moiré Interference",
    equation: "Overlapping concentric waves",
    icon: "🌐",
    color: "cyan",
    animated: true,
    category: "Abstract",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r1 = Math.sqrt(x * x + z * z);
      const r2 = Math.sqrt((x - 1) * (x - 1) + z * z);
      return [
        x,
        (Math.sin(r1 * 8 - t * 2) + Math.sin(r2 * 8 - t * 2)) * 0.4,
        z,
      ];
    },
    type: "surface",
  },
  {
    id: "hyperbolic_plane",
    name: "Hyperbolic Plane (Poincaré Disk)",
    equation: "Beltrami–Klein model embedded in ℝ³",
    icon: "🌀",
    color: "pink",
    animated: true,
    category: "Abstract",
    range: [
      [-2.8, 2.8],
      [-2.8, 2.8],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z);
      if (r >= 2.8) return [x, 0, z];
      const k = 1 / (1 - (r * r) / 8);
      return [x, Math.log(k) * 0.5 + 0.1 * Math.sin(t + r * 3), z];
    },
    type: "surface",
  },
  {
    id: "strange_attractor_surface",
    name: "Strange Basin Boundary",
    equation: "Newton basins of attraction height",
    icon: "🌀",
    color: "rainbow",
    animated: true,
    category: "Abstract",
    range: [
      [-2.5, 2.5],
      [-2.5, 2.5],
    ],
    fn: (x, z, t = 0) => {
      let h = 0;
      for (let k = 0; k < 3; k++) {
        const ax = Math.cos(k * 2.094) * 1.2,
          az = Math.sin(k * 2.094) * 1.2;
        const d = Math.sqrt((x - ax) ** 2 + (z - az) ** 2) + 0.2;
        h += Math.sin(t + 1 / d) / d;
      }
      return [x, h * 0.6, z];
    },
    type: "surface",
  },
  {
    id: "tesseract_shadow",
    name: "Tesseract Shadow",
    equation: "4D hypercube stereographic projection",
    icon: "🔲",
    color: "violet",
    animated: true,
    category: "Abstract",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const w = Math.cos(u * 2 + t * 0.3);
      const x = Math.cos(u) * Math.sin(v),
        y = Math.sin(u) * Math.sin(v),
        z = Math.cos(v);
      const d = 2 - w * 0.5;
      return [(x / d) * 2.5, (y / d) * 2.5, (z / d) * 2.5];
    },
    type: "surface",
  },
  {
    id: "data_manifold",
    name: "Swiss Roll Data Manifold",
    equation: "High-dimensional data embedding",
    icon: "📊",
    color: "orange",
    animated: true,
    category: "Abstract",
    range: [
      [0, Math.PI * 6],
      [-2, 2],
    ],
    fn: (u, v, t = 0) => [
      u * Math.cos(u + t * 0.1) * 0.35,
      v,
      u * Math.sin(u + t * 0.1) * 0.35 + 0.1 * Math.sin(u * 3 + t),
    ],
    type: "surface",
  },

  /* ── New Differential Geometry ── */
  {
    id: "breather_surface",
    name: "Breather Surface",
    equation: "Pseudospherical surface of constant negative curvature",
    icon: "🫁",
    color: "cyan",
    animated: true,
    category: "Differential Geometry",
    range: [
      [-15, 15],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const aa = 0.4;
      const r = aa * aa;
      const w = Math.sqrt(1 - r);
      const denom =
        aa *
        (Math.pow(w * Math.cosh(aa * u), 2) +
          Math.pow(aa * Math.sin(w * v), 2));
      if (Math.abs(denom) < 0.001) return [0, 0, 0];
      return [
        (-u + (2 * (1 - r) * Math.cosh(aa * u) * Math.sinh(aa * u)) / denom) *
          0.3,
        ((2 *
          w *
          Math.cosh(aa * u) *
          (-w * Math.cos(v) * Math.cos(w * v) -
            Math.sin(v) * Math.sin(w * v))) /
          denom) *
          0.3,
        ((2 *
          w *
          Math.cosh(aa * u) *
          (-w * Math.sin(v) * Math.cos(w * v) +
            Math.cos(v) * Math.sin(w * v))) /
          denom) *
          0.3,
      ];
    },
    type: "surface",
  },
  {
    id: "striction_ruled",
    name: "Ruled Striction Surface",
    equation: "Moving frame along striction curve",
    icon: "📐",
    color: "gold",
    animated: true,
    category: "Differential Geometry",
    range: [
      [0, Math.PI * 4],
      [-1.5, 1.5],
    ],
    fn: (u, v, t = 0) => [
      (Math.cos(u) + v * Math.sin(u) * 0.5) * 1.8,
      (u * 0.2 - 2 + 0.1 * Math.sin(t + u)) * 1.2,
      (Math.sin(u) - v * Math.cos(u) * 0.5) * 1.8,
    ],
    type: "surface",
  },

  /* ── New Quadrics ── */
  {
    id: "oblate_spheroid",
    name: "Oblate Spheroid",
    equation: "x²/a² + y²/b² + z²/a² = 1, a>b",
    icon: "🌍",
    color: "cyan",
    animated: true,
    category: "Quadrics",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const a = 2.5,
        b = 1.5 + 0.1 * Math.sin(t);
      return [
        a * Math.sin(v) * Math.cos(u),
        b * Math.cos(v),
        a * Math.sin(v) * Math.sin(u),
      ];
    },
    type: "surface",
  },
  {
    id: "prolate_spheroid",
    name: "Prolate Spheroid",
    equation: "x²/a² + y²/b² + z²/a² = 1, b>a",
    icon: "🏈",
    color: "orange",
    animated: true,
    category: "Quadrics",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const a = 1.5,
        b = 3 + 0.1 * Math.sin(t);
      return [
        a * Math.sin(v) * Math.cos(u),
        b * Math.cos(v),
        a * Math.sin(v) * Math.sin(u),
      ];
    },
    type: "surface",
  },

  /* ── New Minimal Surfaces ── */
  {
    id: "scherk_surface",
    name: "Scherk's First Surface",
    equation: "e^z·cos y = cos x",
    icon: "✦",
    color: "emerald",
    category: "Minimal Surfaces",
    range: [
      [-Math.PI * 0.45, Math.PI * 0.45],
      [-Math.PI * 0.45, Math.PI * 0.45],
    ],
    fn: (x, y) => {
      const val = Math.cos(x) / Math.cos(y);
      if (val <= 0) return [x, 0, y];
      return [x, Math.log(val), y];
    },
    type: "surface",
  },
  {
    id: "richmond_surface",
    name: "Richmond Surface",
    equation: "Weierstrass representation with f=1/z³",
    icon: "🌀",
    color: "pink",
    animated: true,
    category: "Minimal Surfaces",
    range: [
      [-2, 2],
      [-2, 2],
    ],
    fn: (u, v, t = 0) => {
      const r = Math.sqrt(u * u + v * v) + 0.01;
      const angle = Math.atan2(v, u) + t * 0.2;
      return [
        (u / (2 * r * r) - (u * r * r) / 4) * 1.5,
        (v / (2 * r * r) - (v * r * r) / 4) * 1.5,
        Math.log(r) * Math.cos(angle) * 1.2,
      ];
    },
    type: "surface",
  },
  {
    id: "minimal_costa",
    name: "Costa Surface (approx)",
    equation: "Three-ended minimal surface",
    icon: "🌐",
    color: "gold",
    animated: true,
    category: "Minimal Surfaces",
    range: [
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI],
    ],
    fn: (u, v, t = 0) => {
      const x = u,
        y = v;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      const h =
        Math.log(r) -
        (Math.cos(2 * Math.atan2(y, x) + t * 0.2) / (r * r)) * 0.5;
      return [x, h * 0.8, y];
    },
    type: "surface",
  },

  /* ── New Knots ── */
  {
    id: "satellite_knot",
    name: "Satellite Knot",
    equation: "Companion + pattern",
    icon: "🛸",
    color: "cyan",
    animated: true,
    category: "Knots",
    range: [
      [-1, 1],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const R = 2,
        r = 0.8,
        p = 2,
        q = 3;
      const noise = 0.15 * Math.sin(6 * v + t);
      return [
        (R + (r + noise) * Math.cos(q * v)) * Math.cos(p * v + t * 0.2),
        (r + noise) * Math.sin(q * v),
        (R + (r + noise) * Math.cos(q * v)) * Math.sin(p * v + t * 0.2),
      ];
    },
    type: "line",
  },

  /* ── Fill remaining with more Cosmic & Nature ── */
  {
    id: "bipolar_nebula",
    name: "Bipolar Nebula",
    equation: "Two lobed emission structure",
    icon: "💫",
    color: "violet",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI],
    ],
    fn: (theta, phi, t = 0) => {
      const r =
        2 * Math.abs(Math.cos(phi)) + 0.3 + 0.1 * Math.sin(8 * theta + t);
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ];
    },
    type: "surface",
  },
  {
    id: "einstein_ring",
    name: "Einstein Ring",
    equation: "Gravitational lensing arc",
    icon: "💍",
    color: "gold",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [-0.4, 0.4],
    ],
    fn: (theta, v, t = 0) => {
      const r = 2.5 + 0.3 * Math.sin(theta * 3 + t) + v * 0.5;
      return [
        r * Math.cos(theta + t * 0.15),
        v * 2,
        r * Math.sin(theta + t * 0.15),
      ];
    },
    type: "surface",
  },
  {
    id: "coriolis_storm",
    name: "Coriolis Storm System",
    equation: "Rotating atmospheric vortex",
    icon: "🌪",
    color: "cyan",
    animated: true,
    category: "Cosmic",
    range: [
      [-4, 4],
      [-4, 4],
    ],
    fn: (x, z, t = 0) => {
      const r = Math.sqrt(x * x + z * z) + 0.1;
      const theta = Math.atan2(z, x) + (t * 0.5) / (r + 0.5);
      const y = Math.exp(-0.1 * r * r) * Math.sin(4 * theta + r * 2 - t) * 1.2;
      return [x, y, z];
    },
    type: "surface",
  },
  {
    id: "Van_Allen_belt",
    name: "Van Allen Belt",
    equation: "Toroidal radiation belt cross-section",
    icon: "☢",
    color: "orange",
    animated: true,
    category: "Cosmic",
    range: [
      [0, Math.PI * 2],
      [0, Math.PI * 2],
    ],
    fn: (u, v, t = 0) => {
      const R = 2.5,
        r1 = 0.6,
        r2 = 1.0;
      const rr = r1 + ((r2 - r1) * (1 + Math.sin(v + t))) / 2;
      return [
        (R + rr * Math.cos(v)) * Math.cos(u + t * 0.2),
        rr * Math.sin(v),
        (R + rr * Math.cos(v)) * Math.sin(u + t * 0.2),
      ];
    },
    type: "surface",
  },
];
