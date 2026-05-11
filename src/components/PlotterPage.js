import React, { useState, useCallback } from "react";
import InputPanel from "./InputPanel";
import GraphPanel from "./GraphPanel";
import ExamplesPanel from "./ExamplesPanel";
import { useTheme } from "../ThemeContext";

const DEFAULT_PLOTS = [
  { id: Date.now(), expr: "sin(x)", color: "#22d3ee", label: "sin(x)", visible: true },
];

const COLORS = ["#22d3ee","#34d399","#a78bfa","#f472b6","#fb923c","#60a5fa","#fbbf24","#4ade80"];

export default function PlotterPage() {
  const { isDark } = useTheme();
  const [plots, setPlots] = useState(DEFAULT_PLOTS);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-5);
  const [yMax, setYMax] = useState(5);
  const [autoY, setAutoY] = useState(true);
  const [activeId, setActiveId] = useState(DEFAULT_PLOTS[0].id);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addPlot = useCallback((expr = "", label = "") => {
    const usedColors = plots.map((p) => p.color);
    const color = COLORS.find((c) => !usedColors.includes(c)) || COLORS[plots.length % COLORS.length];
    const newPlot = { id: Date.now(), expr, color, label: label || expr || "", visible: true };
    setPlots((prev) => [...prev, newPlot]);
    setActiveId(newPlot.id);
    setError("");
  }, [plots]);

  const removePlot = useCallback((id) => {
    setPlots((prev) => { const next = prev.filter((p) => p.id !== id); return next.length === 0 ? prev : next; });
    setActiveId((prev) => prev === id ? plots.find((p) => p.id !== id)?.id : prev);
  }, [plots]);

  const updatePlot = useCallback((id, changes) => {
    setPlots((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }, []);

  const loadExample = useCallback((example) => {
    const usedColors = plots.map((p) => p.color);
    const color = COLORS.find((c) => !usedColors.includes(c)) || COLORS[plots.length % COLORS.length];
    const newPlot = { id: Date.now(), expr: example.expr, color, label: example.label, visible: true };
    setPlots((prev) => [...prev, newPlot]);
    setActiveId(newPlot.id);
    setXMin(example.xMin ?? -10);
    setXMax(example.xMax ?? 10);
    if (example.yMin !== undefined) { setYMin(example.yMin); setYMax(example.yMax); setAutoY(false); }
    else setAutoY(true);
    setError("");
    setSidebarOpen(false);
  }, [plots]);

  const panelProps = { plots, activeId, setActiveId, addPlot, removePlot, updatePlot, xMin, setXMin, xMax, setXMax, yMin, setYMin, yMax, setYMax, autoY, setAutoY, error, setError };

  const sidebarBg = isDark
    ? "linear-gradient(180deg, #020810 0%, #030d18 100%)"
    : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)";
  const borderCol = isDark ? "rgba(6,182,212,0.1)" : "rgba(148,163,184,0.2)";
  const mainBg = isDark ? "linear-gradient(135deg, #020810 0%, #030d18 100%)" : "linear-gradient(135deg, #f8fafc 0%, #eef4ff 100%)";
  const topBarBg = isDark ? "rgba(2,8,20,0.6)" : "rgba(241,245,249,0.92)";
  const mutedText = isDark ? "#334155" : "#64748b";

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="lg:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(16,185,129,0.2))",
          border: "1px solid rgba(6,182,212,0.4)",
          boxShadow: "0 0 20px rgba(6,182,212,0.3)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 4h14M1 8h14M1 12h14" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto w-80 xl:w-96 flex flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto`}
        style={{ borderColor: borderCol, background: sidebarBg, top: "60px", height: "calc(100vh - 60px)" }}
      >
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(16,185,129,0.3), transparent)" }} />
        <div className="px-4 py-4 border-b" style={{ borderColor: borderCol }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)" }}>
              <span style={{ color: "#22d3ee", fontSize: "0.85rem" }}>∿</span>
            </div>
            <div>
              <div className="font-orbitron font-bold text-xs tracking-widest" style={{ color: "#22d3ee" }}>2D PLOTTER</div>
              <div className="font-mono-code text-[9px] tracking-widest" style={{ color: mutedText }}>Function Visualizer</div>
            </div>
          </div>
        </div>
        <InputPanel {...panelProps} />
        <ExamplesPanel onLoad={loadExample} />
        <div className="h-px w-full mt-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.25), transparent)" }} />
      </aside>

      {/* Graph area */}
      <main className="flex flex-col flex-1 overflow-hidden min-w-0" style={{ background: mainBg }}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: borderCol, background: topBarBg }}>
          <div className="flex items-center gap-4 flex-wrap">
            {[["mathjs", "Engine", "#22d3ee"], ["recharts", "Renderer", "#34d399"]].map(([name, label, color]) => (
              <span key={name} className="font-mono-code text-[10px] flex items-center gap-1.5" style={{ color: mutedText }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
                {label}: <span style={{ color }}>{name}</span>
              </span>
            ))}
          </div>
          <span className="font-mono-code text-[10px] hidden sm:block" style={{ color: mutedText }}>
            Use{" "}
            <code className="px-1 rounded" style={{ background: isDark ? "rgba(6,182,212,0.08)" : "rgba(6,182,212,0.1)", color: "#22d3ee" }}>^</code>
            {" "}for powers ·{" "}
            <code className="px-1 rounded" style={{ background: isDark ? "rgba(6,182,212,0.08)" : "rgba(6,182,212,0.1)", color: "#22d3ee" }}>*</code>
            {" "}for multiply
          </span>
        </div>
        <GraphPanel plots={plots} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} autoY={autoY} setYMin={setYMin} setYMax={setYMax} setError={setError} />
      </main>
    </div>
  );
}
