# 🔭 NOVA MathPlot — Scientific Visualization Platform

<div align="center">

**A premium, multi-modal mathematical visualization platform built with React.**
Plot functions in 2D and 3D, explore complex analysis, parametric curves, and neural activation functions — all in one sleek, dual-theme interface.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-nova--mathplot.vercel.app-22d3ee?style=for-the-badge&logo=vercel)](https://nova-mathplot.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-white?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)](./LICENSE)
[![Version](https://img.shields.io/badge/Version-3.0-34d399?style=for-the-badge)](https://github.com/Hafiz-Sakib/nova-mathplot)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Pages & Modules](#-pages--modules)
- [Theming](#-theming)
- [Future Roadmap](#-future-roadmap)
- [Developer](#-developer)
- [License](#-license)

---

## 🌟 Overview

**NOVA MathPlot v3.0** is a full-featured scientific visualization web application designed for students, researchers, educators, and math enthusiasts who want to explore and visualize mathematical concepts interactively. The platform supports everything from basic 2D function plots to animated 3D parametric curves, chaotic attractors, topological surfaces, and neural network activation function analysis.

> ⚡ Fully client-side — no backend required. All computation happens in the browser using **mathjs**, **Three.js**, and **React Three Fiber**.

**At a glance:**
- 📈 **350+** example functions across all modules
- 🧊 **60+** 3D surface, attractor, and topology presets
- 🌀 **40+** parametric curve presets across 8 categories
- σ **17** neural network activation functions with derivative overlay
- 🎨 Dual dark/light theme with animated transitions

---

## 📸 Screenshots

### 🏠 Home
![Home](./src/images/photos_for_readme/home.png)

### 📈 2D Function Plotter
![2D Plotter](./src/images/photos_for_readme/2d.png)

### 🧊 3D Surface Visualizer
![3D Visualizer](./src/images/photos_for_readme/3d.png)

### ℂ Complex Analysis
![Complex Analysis](./src/images/photos_for_readme/complx.png)

### 🌀 Parametric Plotter
![Parametric Plotter](./src/images/photos_for_readme/parametric.png)

### σ Activation Functions Explorer
![Activation Functions](./src/images/photos_for_readme/activation.png)

### 👨‍💻 Developer Page
![Developer](./src/images/photos_for_readme/developer.png)

---

## ✨ Features

### 📈 2D Function Plotter
- Plot multiple functions simultaneously with individual colors
- Powered by **mathjs** expression engine — supports `sin`, `cos`, `tan`, `log`, `abs`, `sqrt`, `e^x`, and more
- Real-time scroll-to-zoom and drag-to-pan
- Auto Y-range or manual range control
- Quick-insert symbol buttons for fast expression entry
- X-range presets (−π…π, −2π…2π, −5…5, −10…10)
- Live legend with visibility toggles
- 50+ built-in example functions

### 🧊 3D Surface Visualizer
- GPU-accelerated 3D surface rendering via **React Three Fiber** + **Three.js**
- Orbit, zoom, and pan with mouse/touch controls
- **60+ presets** across 9 categories:
  - **Classic** — Wave Surface, Helix, Torus, Saddle, Paraboloid, Ripple, Sphere, Gaussian, Sinc, Egg Carton, and more
  - **Mathematical** — Spherical Harmonics, Superformula, Wave Interference, Fractal Noise Surface, Heart Surface
  - **Minimal Surfaces** — Gyroid, Schwarz P, Enneper, Catenoid, Helicoid
  - **Topology** — Möbius Strip, Klein Bottle, Boy's Surface, Roman Surface, Whitney Umbrella, Hopf Fibration
  - **Attractors** — Lorenz, Rössler, Aizawa, Halvorsen, Dadras, Chen
  - **Knots** — Cinquefoil (2,5), Torus Knot (3,4)
  - **Quadrics** — Ellipsoid, Hyperboloid, Elliptic Cone
  - **Differential Geometry** — Pseudosphere, Figure-8 Klein Immersion
  - **Nature** — Leaf Surface, 3D Rose, Coral Reef, Fern Spiral, Brain Coral Maze
  - **Fractals** — Mandelbulb Slice, Julia Set Landscape, Sierpiński Pyramid, Dragon Flame
- Adjustable resolution (55×55 / 60×60 mesh), wireframe mode, star field, XYZ axes, and auto-rotate
- Custom expression mode: define your own `z = f(x, y)` surface
- Multiple color gradient schemes
- Animated surfaces support

### ℂ Complex Analysis (f: ℝ → ℂ)
- Visualize complex-valued functions of a real variable
- Simultaneous display of **Real**, **Imaginary**, and **Magnitude** components
- Euler's formula panel with live annotations
- Color-coded legend (cyan = Re, pink = Im, gold = |f|)
- Example inputs: `e^(i*x)`, `i*x^2`, `(1+i)*x`, `abs(e^(i*x))`

### 🌀 Parametric Plotter (2D & 3D)
- Animated parametric curve drawing with glow effect trail
- **40+ presets** across 8 categories:

| Category | Examples |
|---|---|
| Basic 2D | Circle, Ellipse, Figure-Eight |
| Lissajous | 3:2, 5:4, 7:6, 4:3, 8:5 ratios |
| Fourier | Square Wave, Sawtooth, Damped Oscillator |
| Euler | Re(e^it)=cos(t), Euler Spiral |
| Polar | Rose curves, Archimedean Spiral, Fermat's Spiral |
| Laplace | Laplace transform visualizations |
| Special | Epitrochoids, Beat Frequencies, and more |
| 3D Curves | e^(iωt) Helix, Trefoil Knot, Torus Knot (3,2) & (5,3), 3D Lissajous, Spherical Spiral, DNA Double Helix |

- Adjustable speed, zoom, and color scheme
- 3D drag-to-rotate for spatial curves

### σ Activation Functions Explorer
- Interactive canvas plot of **17 neural network activation functions**
- Derivative overlay toggle for all functions
- Scroll-to-zoom on the X axis
- Coordinate crosshair tooltip showing exact x/y values
- Sidebar formula reference with miniature sparkline previews
- Group filter (All, Classic, Advanced, Approximations)
- Mathematical property cards (range, monotonic, zero-centered, smooth, bounded)

**All 17 included functions:**

| Name | Formula | Key Property |
|---|---|---|
| Linear | `x` | Identity baseline |
| Binary Step | `x ≥ 0 ? 1 : 0` | Threshold gate |
| Sigmoid | `1 / (1 + e^−x)` | Bounded [0, 1] |
| Tanh | `(e^x − e^−x) / (e^x + e^−x)` | Bounded [−1, 1], zero-centered |
| ReLU | `max(0, x)` | Sparse activation |
| Leaky ReLU | `x > 0 ? x : 0.01x` | No dying neurons |
| PReLU | `x > 0 ? x : 0.25x` | Learnable slope |
| ELU | `x > 0 ? x : α(e^x − 1)` | Smooth negative |
| SELU | `λ · ELU(x, α)` | Self-normalizing |
| Softplus | `ln(1 + e^x)` | Smooth ReLU approx |
| Softsign | `x / (1 + |x|)` | Smooth bounded |
| Swish | `x · σ(x)` | Self-gated |
| Mish | `x · tanh(softplus(x))` | Smooth, unbounded above |
| GELU | `x · Φ(x)` | Used in BERT, GPT |
| Hard Sigmoid | `clip((x+3)/6, 0, 1)` | Computationally cheap |
| Hard Swish | `x · clip((x+3)/6, 0, 1)` | Mobile-optimized |
| Softmax | `e^xᵢ / Σe^xⱼ` | Multi-class output |

### 🌗 Dual Theme (Dark / Light)
- Fully designed dark mode (default) with glowing cyan/violet palette
- Clean light mode with proper contrast throughout every page
- Persisted via React Context with animated transition
- Theme toggle available in both desktop navbar and mobile menu

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 18 |
| **Animation** | Framer Motion (motion v12) |
| **Icons** | FontAwesome (Free Solid + Brands) |
| **Styling** | Tailwind CSS v3, custom CSS variables |
| **Math Engine** | mathjs v12 |
| **2D Charts** | Recharts v2 |
| **3D Rendering** | Three.js r160, React Three Fiber, Drei |
| **Fonts** | Orbitron, JetBrains Mono, Space Grotesk, Rajdhani |
| **Build Tool** | Create React App |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** v8 or higher (or **yarn**)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Hafiz-Sakib/nova-mathplot.git
cd nova-mathplot

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `build/` folder, ready to deploy to Vercel, Netlify, GitHub Pages, or any static host.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 📁 Project Structure

```
nova-mathplot/
├── public/
│   └── index.html                  # HTML entry point
├── src/
│   ├── components/
│   │   ├── Navbar.js               # Top navigation bar with theme toggle
│   │   ├── Header.js / Header.css  # Page-level header
│   │   ├── HomePage.js             # Landing page — hero, feature cards, stats, comparison, roadmap
│   │   ├── PlotterPage.js          # 2D function plotter page
│   │   ├── InputPanel.js / .css    # Left sidebar for 2D plotter
│   │   ├── GraphPanel.js / .css    # Recharts-based 2D graph renderer
│   │   ├── ExamplesPanel.js / .css # Example functions sidebar panel
│   │   ├── Plotter3DPage.js        # 3D surface visualizer (60+ presets, Three.js / R3F)
│   │   ├── ComplexPage.js          # Complex analysis module
│   │   ├── ParametricPage.js       # Parametric plotter (2D + 3D animated, 40+ presets)
│   │   ├── ActivationPage.js       # Neural activation functions explorer (17 functions)
│   │   ├── DeveloperPage.js        # Developer/portfolio page
│   │   └── InfoBar.js / .css       # Status/info bar
│   ├── images/
│   │   ├── developer.png           # Developer profile image
│   │   └── photos_for_readme/      # README screenshot images
│   ├── App.js                      # Root component, page routing
│   ├── App.css
│   ├── ThemeContext.js             # Dark/Light theme React context
│   ├── index.js                    # React DOM entry point
│   └── index.css                   # Global styles, design tokens, Tailwind
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env
└── README.md
```

---

## 📐 Pages & Modules

### `PlotterPage.js` — 2D Plotter
The main 2D plotting interface. Uses the `mathjs` library to evaluate expressions and renders them via `recharts`.

**Expression syntax examples:**
```
sin(x)           → sine wave
cos(x)^2         → cosine squared
e^(-x^2)         → Gaussian bell curve
abs(x)           → absolute value / V-shape
log(x, 10)       → log base 10
x^3 - 3*x        → cubic polynomial
sin(x)/x         → sinc function
```

---

### `Plotter3DPage.js` — 3D Visualizer
Uses **React Three Fiber** to render GPU-accelerated parametric surfaces, attractors, and line curves. Supports both custom expression mode and 60+ built-in presets with cinematic animations, wireframe toggle, star field, and coordinate axes.

**Example surfaces:**
```
sin(sqrt(x^2 + y^2))      → Ripple / Mexican hat
sin(x) * cos(y)           → Saddle waves
x^2 - y^2                 → Hyperbolic paraboloid
e^(-(x^2+y^2)/4)          → 3D Gaussian
```

**Preset categories:** Classic · Mathematical · Minimal Surfaces · Topology · Attractors · Knots · Quadrics · Differential Geometry · Nature · Fractals

---

### `ComplexPage.js` — Complex Analysis
Plots `Re(f(x))`, `Im(f(x))`, and `|f(x)|` for a complex-valued function using `i` for the imaginary unit.

**Example inputs:**
```
e^(i*x)          → Euler's formula: cos(x) + i·sin(x)
i*x^2            → imaginary quadratic
(1+i)*x          → complex linear
abs(e^(i*x))     → magnitude = 1 (unit circle property)
```

---

### `ParametricPage.js` — Parametric Plotter
A canvas-based animated parametric curve renderer supporting both 2D and 3D modes, with glow trail effects and 40+ built-in presets spanning 8 categories (Basic 2D, Lissajous, Fourier, Euler, Polar, Laplace, Special, 3D Curves).

---

### `ActivationPage.js` — Activation Functions Explorer

An educational explorer for 17 neural network activation functions. Features a coordinate crosshair tooltip, derivative overlay, group filtering, sparkline previews in the sidebar, and scroll-to-zoom.

---

### `HomePage.js` — Landing Page

A rich multi-section landing page including:
- Animated hero section with live SVG curve previews
- Feature cards for all 5 visualization modules
- Key statistics (350+ example functions, 18 activation functions, 5 visualization modes, 200+ presets)
- Rotating mathematician quotes
- Tech stack showcase
- Comparison table vs. Wolfram Alpha and GeoGebra
- Future roadmap (v4 / v5 features)
- Call-to-action section

---

## 🎨 Theming

The app uses a **CSS custom property system** defined in `index.css`, toggled by a `data-theme="light"` attribute on the root element. The `ThemeContext.js` provides `isDark` and `toggleTheme` to all components via React Context.

**Design token examples:**

```css
/* Dark mode (default) */
:root {
  --c-bg: #020810;
  --c-text: #cbd5e1;
  --c-cyan: #06b6d4;
  --c-violet: #8b5cf6;
}

/* Light mode */
[data-theme="light"] {
  --c-bg: #f0f6ff;
  --c-text: #1e293b;
}
```

**Usage in components:**
```jsx
const { isDark } = useTheme();

<div style={{
  background: isDark ? "rgba(2,8,20,0.9)" : "rgba(255,255,255,0.95)",
  color: isDark ? "#cbd5e1" : "#1e293b"
}} />
```

---

## 🗺 Future Roadmap

| Feature | Target |
|---|---|
| 🤖 AI Function Generator — describe a shape in plain English, AI generates the expression | v4 |
| 🤝 Collaborative Sessions — real-time shared visualization rooms | v4 |
| 📄 LaTeX Export — export any plot with its equation to LaTeX format | v4 |
| 📱 Mobile-First UI — pinch-to-zoom, swipe navigation, mobile equation keyboard | v4 |
| 🧩 Plugin System — community plugins for physics, finance, statistics | v5 |
| 📚 Curriculum Library — guided learning paths for calculus, linear algebra, statistics | v5 |

---

## 👨‍💻 Developer

**Hafizur Rahman Sakib**

A passionate software developer and mathematician who built NOVA MathPlot as a creative intersection of mathematics, visualization, and modern web development.

- 🌐 [nova-mathplot.vercel.app](https://nova-mathplot.vercel.app/)
- 🐙 [github.com/Hafiz-Sakib/nova-mathplot](https://github.com/Hafiz-Sakib/nova-mathplot)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License — Copyright (c) 2024 Hafizur Rahman Sakib

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">
  <p>Made with ❤️ and mathematics by <strong>Hafizur Rahman Sakib</strong></p>
  <p>
    <a href="https://nova-mathplot.vercel.app/">🚀 Live Demo</a>
    ·
    <a href="https://github.com/Hafiz-Sakib/nova-mathplot/issues">🐛 Report Bug</a>
    ·
    <a href="https://github.com/Hafiz-Sakib/nova-mathplot/issues">💡 Request Feature</a>
  </p>
</div>
