import React, { useState, useCallback, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import PlotterPage from "./components/PlotterPage";
import Plotter3DPage from "./components/Plotter3DPage";
import ComplexPage from "./components/ComplexPage";
import ParametricPage from "./components/ParametricPage";
import ActivationPage from "./components/ActivationPage";
import DeveloperPage from "./components/DeveloperPage";
import { ThemeProvider, useTheme } from "./ThemeContext";

const VALID_PAGES = [
  "home",
  "plotter2d",
  "plotter3d",
  "complex",
  "parametric",
  "activation",
  "developer",
];

//Day and Night mode implemented in this version.

// Path → page name mapping
const PATH_TO_PAGE = {
  "/": "home",
  "/home": "home",
  "/plotter2d": "plotter2d",
  "/plotter3d": "plotter3d",
  "/complex": "complex",
  "/parametric": "parametric",
  "/activation": "activation",
  "/developer": "developer",
};

const PAGE_TO_PATH = {
  home: "/home",
  plotter2d: "/plotter2d",
  plotter3d: "/plotter3d",
  complex: "/complex",
  parametric: "/parametric",
  activation: "/activation",
  developer: "/developer",
};

function getPageFromPath() {
  const path = window.location.pathname;
  return PATH_TO_PAGE[path] || "home";
}

function AppContent() {
  const [page, setPage] = useState(getPageFromPath);
  const { isDark } = useTheme();

  useEffect(() => {
    const handlePop = () => {
      setPage(getPageFromPath());
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const handleSetPage = useCallback((p) => {
    const path = PAGE_TO_PATH[p] || "/home";
    window.history.pushState({ page: p }, "", path);
    setPage(p);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{
        background: isDark
          ? "#020810"
          : "linear-gradient(135deg, #f8fafc 0%, #eef4ff 50%, #f0f9ff 100%)",
      }}
    >
      {/* Grid background */}
      {isDark && (
        <div className="pointer-events-none fixed inset-0 z-0 nova-grid opacity-100" />
      )}
      {!isDark && (
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(6,182,212,0.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      )}

      {/* Radial glow accents */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(6,182,212,0.07) 0%, transparent 55%)"
            : "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(6,182,212,0.08) 0%, transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-full h-full z-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(139,92,246,0.06) 0%, transparent 55%)"
            : "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(139,92,246,0.06) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        <Navbar page={page} setPage={handleSetPage} />
        {page === "home" && <HomePage setPage={handleSetPage} />}
        {page === "plotter2d" && <PlotterPage />}
        {page === "plotter3d" && <Plotter3DPage />}
        {page === "complex" && <ComplexPage />}
        {page === "parametric" && <ParametricPage />}
        {page === "activation" && <ActivationPage />}
        {page === "developer" && <DeveloperPage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
