import React from 'react';
import { SystemArchitecture } from '../types';

export const SprintsTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const totalPoints = data.sprints.reduce((acc, sprint) =>
    acc + sprint.tasks.reduce((sum, task) => sum + task.points, 0), 0
  );

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-[fadeIn_0.3s_ease]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-[#F5F5F5]">Sprint Plan</h2>
          <p className="text-xs text-[#525252] font-mono mt-1">{data.sprints.length} sprints · {totalPoints} total story points</p>
        </div>
      </div>

      {data.sprints.map(sprint => {
        const sprintPoints = sprint.tasks.reduce((sum, task) => sum + task.points, 0);

        return (
          <div key={sprint.number} className="border border-[#2A2A2A] bg-[#141414] rounded-md overflow-hidden">
            {/* Sprint header */}
            <div className="px-5 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-[#1A1A1A] text-[#F59E0B] font-mono text-xs px-2 py-1 rounded border border-[#2A2A2A]">
                  Sprint {sprint.number}
                </span>
                <h3 className="font-medium text-[#F5F5F5] text-sm">{sprint.name}</h3>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#525252] font-mono">
                <span>{sprint.duration}</span>
                <span>{sprintPoints} pts</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-[#1A1A1A]">
              <div
                className="h-full bg-[#F59E0B] transition-all"
                style={{ width: `${Math.min(100, (sprintPoints / Math.max(totalPoints / data.sprints.length, 1)) * 100)}%`, opacity: 0.6 }}
              />
            </div>

            {/* Goals */}
            {sprint.goals && sprint.goals.length > 0 && (
              <div className="px-5 py-3 border-b border-[#2A2A2A] flex flex-wrap gap-2">
                {sprint.goals.map((goal, i) => (
                  <span key={i} className="text-xs text-[#525252] bg-[#1A1A1A] px-2 py-1 rounded border border-[#2A2A2A]">
                    {goal}
                  </span>
                ))}
              </div>
            )}

            {/* Tasks */}
            <div className="divide-y divide-[#2A2A2A]">
              {sprint.tasks.map((task, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center gap-3">
                    <PriorityDot priority={task.priority} />
                    <span className="text-sm text-[#A3A3A3]">{task.task}</span>
                  </div>
                  <span className="font-mono text-xs text-[#525252] bg-[#0D0D0D] px-2 py-1 rounded border border-[#2A2A2A] shrink-0 ml-4">
                    {task.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="border-t border-[#2A2A2A] pt-4 flex justify-between items-center">
        <span className="text-xs text-[#525252] font-mono uppercase">Total Project Story Points</span>
        <span className="font-mono text-[#F59E0B] font-bold text-lg">{totalPoints}</span>
      </div>
    </div>
  );
};

const PriorityDot: React.FC<{ priority: string }> = ({ priority }) => {
  const colors: Record<string, string> = {
    High: '#EF4444',
    Medium: '#F59E0B',
    Low: '#525252'
  };
  return (
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: colors[priority] || '#525252' }}
      title={`Priority: ${priority}`}
    />
  );
};
