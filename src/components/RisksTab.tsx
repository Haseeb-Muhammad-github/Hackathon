import React from 'react';
import { SystemArchitecture } from '../types';

export const RisksTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const severityConfig: Record<string, { color: string; label: string }> = {
    Critical: { color: 'var(--error)',   label: 'CRITICAL' },
    High:     { color: 'var(--primary)', label: 'HIGH' },
    Medium:   { color: '#6B7280',        label: 'MEDIUM' },
    Low:      { color: 'var(--text-3)',  label: 'LOW' },
  };

  return (
    <div style={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.3s ease' }}>
      {data.risks.map((risk, i) => {
        const cfg = severityConfig[risk.severity] || severityConfig.Medium;
        return (
          <div key={i} style={{ border: '1px solid var(--border)', borderLeft: `4px solid ${cfg.color}`, backgroundColor: 'var(--surface)', borderRadius: 6, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', margin: 0 }}>{risk.title}</h3>
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: cfg.color, letterSpacing: '0.08em' }}>{cfg.label}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{risk.description}</p>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 4, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16 }}>🛡</span>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>Mitigation</div>
                <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{risk.mitigation}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
