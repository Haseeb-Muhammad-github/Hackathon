import React from 'react';
import { SystemArchitecture } from '../types';

export const SprintsTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const totalPoints = data.sprints.reduce((acc, sprint) => 
    acc + sprint.tasks.reduce((sum, task) => sum + task.points, 0), 0
  );

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-medium text-textPrimary">Sprint Plan</h2>
          <p className="text-sm text-textSecondary mt-1">Total estimated effort: {totalPoints} story points</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {data.sprints.map(sprint => (
          <div key={sprint.number} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-surfaceAlt text-primary font-mono text-xs px-2 py-1 rounded border border-border">
                Sprint {sprint.number}
              </span>
              <h3 className="font-medium text-textPrimary">{sprint.name}</h3>
              <span className="text-xs text-textMuted ml-auto font-mono">{sprint.duration}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              {sprint.tasks.map((task, i) => (
                <div key={i} className="bg-surfaceAlt border border-border rounded p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PriorityDot priority={task.priority} />
                    <span className="text-sm text-textSecondary">{task.task}</span>
                  </div>
                  <span className="font-mono text-xs text-textMuted bg-surface px-2 py-1 rounded">
                    {task.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PriorityDot: React.FC<{ priority: string }> = ({ priority }) => {
  const color = {
    High: 'bg-error',
    Medium: 'bg-primary',
    Low: 'bg-textMuted'
  }[priority] || 'bg-textMuted';

  return <div className={`w-2 h-2 rounded-full ${color}`} title={`Priority: ${priority}`} />;
};
