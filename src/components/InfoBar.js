import React from 'react';

export default function InfoBar() {
  return (
    <div className="flex items-center justify-between px-4 sm:px-5 py-2 flex-wrap gap-2"
         style={{ borderTop: '1px solid rgba(34,197,94,0.1)', background: 'rgba(2,8,4,0.6)' }}>
      <div className="flex items-center gap-4 flex-wrap">
        {[['mathjs', 'Engine'], ['recharts', 'Renderer']].map(([name, label]) => (
          <span key={name} className="font-mono-code text-[10px] flex items-center gap-1.5" style={{ color: '#166534' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#16a34a' }} />
            {label}: <span style={{ color: '#22c55e' }}>{name}</span>
          </span>
        ))}
      </div>
      <span className="font-mono-code text-[10px]" style={{ color: '#166534' }}>
        Use <code className="px-1 rounded" style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80' }}>^</code> for powers ·{' '}
        <code className="px-1 rounded" style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80' }}>*</code> for multiply
      </span>
    </div>
  );
}
