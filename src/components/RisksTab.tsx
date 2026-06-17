import React from 'react';
import { SystemArchitecture } from '../types';
import { ShieldAlert } from 'lucide-react';

export const RisksTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const severityColors: Record<string, string> = {
    Critical: 'border-l-error',
    High: 'border-l-primary',
    Medium: 'border-l-textMuted',
    Low: 'border-l-surfaceAlt'
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-4 animate-in fade-in duration-500">
      {data.risks.map((risk, i) => (
        <div key={i} className={`bg-surfaceAlt border border-border border-l-4 rounded-md p-4 flex flex-col gap-3 ${severityColors[risk.severity] || 'border-l-border'}`}>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-textPrimary">{risk.title}</h3>
            <span className="text-xs font-mono text-textMuted uppercase tracking-wider">{risk.severity}</span>
          </div>
          <p className="text-sm text-textSecondary">{risk.description}</p>
          <div className="mt-2 bg-surface/50 p-3 rounded border border-border flex gap-3 items-start">
            <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-textMuted uppercase">Mitigation</span>
              <p className="text-sm text-textSecondary">{risk.mitigation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
