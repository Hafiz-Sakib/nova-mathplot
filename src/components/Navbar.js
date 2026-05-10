import React, { useState, useEffect } from "react";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "plotter2d", label: "2D Plotter" },
  { id: "plotter3d", label: "3D Plotter" },
  { id: "complex", label: "Complex" },
];

export default function Navbar({ page, setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 navbar-nova transition-all duration-300 ${scrolled ? "shadow-[0_4px_30px_rgba(0,0,0,0.4)]" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <button
            onClick={() => {
              setPage("home");
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.1))",
                  border: "1px solid rgba(6,182,212,0.3)",
                }}
              />
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="relative z-10"
              >
                <path
                  d="M2 12 Q5 6 10 10 Q15 14 18 6"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="10" r="2" fill="#22d3ee" opacity="0.6" />
              </svg>
            </div>
            <div>
              <span
                className="font-orbitron font-bold text-sm tracking-[3px] block leading-none"
                style={{ color: "#22d3ee" }}
              >
                NOVA
              </span>
              <span
                className="font-mono-code text-[8px] tracking-[4px] uppercase block"
                style={{ color: "#334155" }}
              >
                MathPlot
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => setPage(link.id)}
                className={`nav-link-nova ${page === link.id ? "active" : ""}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {["∫", "Σ", "eⁱˣ", "ℂ"].map((b) => (
              <span
                key={b}
                className="font-mono-code text-xs px-2 py-1 rounded"
                style={{
                  color: "#334155",
                  background: "rgba(6,18,40,0.6)",
                  border: "1px solid rgba(6,182,212,0.08)",
                }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-8 h-8 flex flex-col justify-center gap-[5px] p-1.5 rounded-lg transition-colors"
            style={{
              background: mobileOpen ? "rgba(6,182,212,0.1)" : "transparent",
              border: "1px solid rgba(6,182,212,0.2)",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-0.5 rounded transition-all duration-300"
                style={{
                  background: "#22d3ee",
                  transform: mobileOpen
                    ? i === 0
                      ? "rotate(45deg) translateY(7px)"
                      : i === 2
                        ? "rotate(-45deg) translateY(-7px)"
                        : "scaleX(0)"
                    : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1 animate-slide-down"
          style={{
            borderColor: "rgba(6,182,212,0.1)",
            background: "rgba(2,8,20,0.97)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setPage(link.id);
                setMobileOpen(false);
              }}
              className={`nav-link-nova text-left w-full py-3 ${page === link.id ? "active" : ""}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(16,185,129,0.3), rgba(139,92,246,0.2), transparent)",
        }}
      />
    </header>
  );
}
