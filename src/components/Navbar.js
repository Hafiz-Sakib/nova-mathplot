import React, { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home", page: "home", icon: "⌂" },
  { label: "2D Plotter", page: "plotter2d", icon: "∿" },
  { label: "3D Visualizer", page: "plotter3d", icon: "🌌" },
  { label: "Complex", page: "complex", icon: "ℂ" },
  { label: "Parametric", page: "parametric", icon: "∑" },
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
      className="navbar-blur sticky top-0 z-50 border-b"
      style={{
        borderColor: scrolled ? "rgba(6,182,212,0.15)" : "rgba(6,182,212,0.08)",
        background: scrolled ? "rgba(2,8,20,0.92)" : "rgba(2,8,20,0.75)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center h-14 sm:h-16 gap-3">
        {/* Logo */}
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(16,185,129,0.15))",
              border: "1px solid rgba(6,182,212,0.4)",
            }}
          >
            <span style={{ color: "#22d3ee", fontSize: "1rem" }}>∿</span>
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                boxShadow: "0 0 15px rgba(6,182,212,0.4)",
              }}
            />
          </div>

          <span
            className="font-orbitron font-black text-sm sm:text-base tracking-wider hidden xs:block"
            style={{
              background: "linear-gradient(90deg, #22d3ee, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NOVA
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 ml-4 lg:ml-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => setPage(link.page)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-space-grotesk text-sm font-medium transition-all duration-200"
              style={{
                background:
                  page === link.page ? "rgba(6,182,212,0.1)" : "transparent",
                color: page === link.page ? "#22d3ee" : "#475569",
                border: `1px solid ${
                  page === link.page ? "rgba(6,182,212,0.35)" : "transparent"
                }`,
              }}
              onMouseEnter={(e) => {
                if (page !== link.page) {
                  e.currentTarget.style.color = "#64748b";
                }
              }}
              onMouseLeave={(e) => {
                if (page !== link.page) {
                  e.currentTarget.style.color = "#475569";
                }
              }}
            >
              <span className="text-xs">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2">
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(6,18,40,0.8)",
              border: "1px solid rgba(6,182,212,0.1)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
              style={{ background: "#34d399" }}
            />
            <span
              className="font-mono-code text-xs"
              style={{ color: "#334155" }}
            >
              v3.0
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1"
            style={{
              background: "rgba(6,18,40,0.8)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-4 h-0.5 rounded transition-all"
                style={{
                  background: menuOpen ? "#22d3ee" : "#475569",
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className="md:hidden border-t animate-slide-down"
          style={{
            borderColor: "rgba(6,182,212,0.1)",
            background: "rgba(2,8,20,0.97)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => {
                setPage(link.page);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 border-b font-space-grotesk text-sm"
              style={{
                borderColor: "rgba(6,182,212,0.06)",
                background:
                  page === link.page ? "rgba(6,182,212,0.06)" : "transparent",
                color: page === link.page ? "#22d3ee" : "#475569",
              }}
            >
              <span>{link.icon}</span>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
