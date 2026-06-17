import React from 'react';
import { SystemArchitecture } from '../types';

export const OverviewTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const { overview } = data;
  
  const complexityColor = {
    Low: 'text-success border-success bg-success/10',
    Medium: 'text-primary border-primary bg-primary/10',
    High: 'text-error border-error bg-error/10'
  }[overview.complexity];

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-border bg-surfaceAlt rounded-md p-4 flex flex-col gap-1">
          <span className="text-textMuted text-xs font-mono uppercase">Complexity</span>
          <span className={`text-sm font-medium px-2 py-0.5 rounded border inline-flex w-fit mt-1 ${complexityColor}`}>
            {overview.complexity}
          </span>
        </div>
        <div className="border border-border bg-surfaceAlt rounded-md p-4 flex flex-col gap-1">
          <span className="text-textMuted text-xs font-mono uppercase">Team Size</span>
          <span className="text-sm font-medium text-textPrimary">{overview.estimatedTeamSize} engineers</span>
        </div>
        <div className="border border-border bg-surfaceAlt rounded-md p-4 flex flex-col gap-1">
          <span className="text-textMuted text-xs font-mono uppercase">Timeline</span>
          <span className="text-sm font-medium text-textPrimary">{overview.estimatedTimeline}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-mono font-bold tracking-tight">{overview.projectName}</h1>
        <p className="text-textSecondary leading-relaxed">{overview.summary}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-mono text-textMuted uppercase mb-2">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {overview.techStack.map(tech => (
            <span key={tech} className="bg-surfaceAlt text-primary font-mono text-xs px-3 py-1.5 rounded-md border border-border">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
