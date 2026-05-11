import React, { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import PlotterPage from "./components/PlotterPage";
import Plotter3DPage from "./components/Plotter3DPage";
import ComplexPage from "./components/ComplexPage";
import ParametricPage from "./components/ParametricPage";
import ActivationPage from "./components/ActivationPage";

export default function App() {
  const [page, setPage] = useState("home");

  const handleSetPage = useCallback((p) => {
    setPage(p);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ background: "#020810" }}
    >
      <div className="pointer-events-none fixed inset-0 z-0 nova-grid opacity-100" />
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(6,182,212,0.07) 0%, transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-full h-full z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(139,92,246,0.06) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar page={page} setPage={handleSetPage} />
        {page === "home" && <HomePage setPage={handleSetPage} />}
        {page === "plotter2d" && <PlotterPage />}
        {page === "plotter3d" && <Plotter3DPage />}
        {page === "complex" && <ComplexPage />}
        {page === "parametric" && <ParametricPage />}
        {page === "activation" && <ActivationPage />}
      </div>
    </div>
  );
}
