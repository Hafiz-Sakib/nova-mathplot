import React from 'react';

export default function Header({ onMenuToggle, sidebarOpen }) {
  return (
    <header className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8"
      style={{
        height: '68px',
        background: 'linear-gradient(180deg, #0d0820 0%, #09051a 100%)',
        borderBottom: '1px solid rgba(139,92,246,0.15)',
      }}>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent)' }} />

      {/* Left: logo */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex flex-col justify-center gap-1 w-8 h-8 p-1 rounded-md transition-colors"
          style={{ background: sidebarOpen ? 'rgba(139,92,246,0.15)' : 'transparent' }}
          aria-label="Toggle sidebar"
        >
          <span className={`block h-0.5 transition-all duration-300 ${sidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                style={{ background: '#a78bfa' }} />
          <span className={`block h-0.5 transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`}
                style={{ background: '#a78bfa' }} />
          <span className={`block h-0.5 transition-all duration-300 ${sidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                style={{ background: '#a78bfa' }} />
        </button>

        {/* Logo icon */}
        <div className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
             style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ animation: 'glowPulse 3s ease-in-out infinite' }}>
            <ellipse cx="11" cy="11" rx="9" ry="5" stroke="#a78bfa" strokeWidth="1.2" fill="none" opacity="0.6"/>
            <ellipse cx="11" cy="11" rx="5" ry="9" stroke="#c4b5fd" strokeWidth="1.2" fill="none" opacity="0.5"/>
            <circle cx="11" cy="11" r="2" fill="#a78bfa"/>
            <line x1="2" y1="11" x2="20" y2="11" stroke="#a78bfa" strokeWidth="0.7" opacity="0.35"/>
          </svg>
        </div>

        <div className="flex flex-col leading-none gap-0.5">
          <span className="font-orbitron font-black text-base sm:text-lg tracking-widest text-glow-violet"
                style={{ color: '#c4b5fd', letterSpacing: '3px' }}>
            MathPlot
          </span>
          <span className="font-mono text-[9px] tracking-[4px] uppercase"
                style={{ color: '#5b3a9a' }}>
            Equation Visualizer
          </span>
        </div>
      </div>

      {/* Right: badges */}
      <div className="hidden sm:flex items-center gap-2">
        {['∫ dx', '∑', 'eⁱˣ', 'f(x)'].map(b => (
          <span key={b}
                className="font-mono text-xs px-2.5 py-1 rounded-md transition-all duration-300 cursor-default"
                style={{
                  color: '#7c5cbf',
                  background: 'rgba(139,92,246,0.06)',
                  border: '1px solid rgba(139,92,246,0.15)',
                }}>
            {b}
          </span>
        ))}
      </div>
    </header>
  );
}
