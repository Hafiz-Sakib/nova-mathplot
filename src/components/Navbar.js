import React, { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home", page: "home", icon: "⌂" },
  { label: "2D Plotter", page: "plotter2d", icon: "∿" },
  { label: "3D Visualizer", page: "plotter3d", icon: "🌌" },
  { label: "Complex", page: "complex", icon: "ℂ" },
  { label: "Parametric", page: "parametric", icon: "∑" },
  { label: "Activations", page: "activation", icon: "σ" },
];

export default function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: scrolled ? "rgba(6,182,212,0.15)" : "rgba(6,182,212,0.08)",
        background: scrolled ? "rgba(2,8,20,0.95)" : "rgba(2,8,20,0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center h-14 sm:h-16 gap-3">
        {/* Logo */}
        <button
          onClick={() => {
            setPage("home");
            setMenuOpen(false);
          }}
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center relative"
            style={{
              background:
                "linear-gradient(135deg,rgba(6,182,212,0.25),rgba(16,185,129,0.15))",
              border: "1px solid rgba(6,182,212,0.4)",
            }}
          >
            <span style={{ color: "#22d3ee", fontSize: "1rem" }}>∿</span>
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ boxShadow: "0 0 15px rgba(6,182,212,0.4)" }}
            />
          </div>
          <span
            className="font-orbitron font-black text-sm sm:text-base tracking-wider hidden xs:block"
            style={{
              background: "linear-gradient(90deg,#22d3ee,#34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NOVA
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5 ml-4 lg:ml-6 flex-1 min-w-0 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const isActive = page === link.page;
            /* Activations gets violet accent to stand out */
            const accent =
              link.page === "activation"
                ? {
                    on: "rgba(139,92,246,0.1)",
                    border: "rgba(139,92,246,0.35)",
                    text: "#a78bfa",
                  }
                : {
                    on: "rgba(6,182,212,0.1)",
                    border: "rgba(6,182,212,0.35)",
                    text: "#22d3ee",
                  };
            return (
              <button
                key={link.page}
                onClick={() => setPage(link.page)}
                className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  background: isActive ? accent.on : "transparent",
                  color: isActive ? accent.text : "#475569",
                  border: `1px solid ${isActive ? accent.border : "transparent"}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#64748b";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#475569";
                }}
              >
                <span className="text-xs">{link.icon}</span>
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(6,18,40,0.8)",
              border: "1px solid rgba(6,182,212,0.1)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#34d399",
                boxShadow: "0 0 6px #34d399",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
            <span
              className="font-mono-code text-xs"
              style={{ color: "#334155" }}
            >
              v3.0
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-colors"
            style={{
              background: menuOpen
                ? "rgba(6,182,212,0.1)"
                : "rgba(6,18,40,0.8)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-0.5 rounded transition-all duration-300"
                style={{
                  width: i === 1 ? 10 : 14,
                  background: menuOpen ? "#22d3ee" : "#475569",
                  transform: menuOpen
                    ? i === 0
                      ? "rotate(45deg) translateY(7px)"
                      : i === 2
                        ? "rotate(-45deg) translateY(-7px)"
                        : "scaleX(0)"
                    : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            borderColor: "rgba(6,182,212,0.1)",
            background: "rgba(2,8,20,0.98)",
            animation: "slideDown 0.2s ease",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = page === link.page;
            const accentColor =
              link.page === "activation" ? "#a78bfa" : "#22d3ee";
            return (
              <button
                key={link.page}
                onClick={() => {
                  setPage(link.page);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 border-b text-sm"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  borderColor: "rgba(6,182,212,0.06)",
                  background: isActive ? `${accentColor}08` : "transparent",
                  color: isActive ? accentColor : "#475569",
                }}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
                {link.page === "activation" && (
                  <span
                    className="ml-auto font-mono-code text-[9px] px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(139,92,246,0.12)",
                      color: "#a78bfa",
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}
                  >
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(6,182,212,0.35),rgba(139,92,246,0.25),rgba(16,185,129,0.2),transparent)",
        }}
      />
    </header>
  );
}
