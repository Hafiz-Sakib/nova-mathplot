import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PlotterPage from './components/PlotterPage';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'plotter'

  return (
    <div className="relative flex flex-col min-h-screen" style={{ background: '#020c07' }}>
      {/* Animated grid background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid opacity-100" />
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed -top-1/4 -left-1/4 w-3/4 h-3/4 z-0 ambient-orb" />
      <div className="pointer-events-none fixed -bottom-1/4 -right-1/4 w-2/3 h-2/3 z-0"
           style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)', animation: 'ambient 10s ease-in-out infinite alternate-reverse' }} />
      {/* Scan line */}
      <div className="pointer-events-none fixed inset-x-0 z-0 scan-line" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar page={page} setPage={setPage} />
        {page === 'home' ? (
          <HomePage setPage={setPage} />
        ) : (
          <PlotterPage />
        )}
      </div>
    </div>
  );
}
