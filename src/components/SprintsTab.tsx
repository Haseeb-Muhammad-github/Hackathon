import React from 'react';
import { SystemArchitecture } from '../types';

export const SprintsTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const totalPoints = data.sprints.reduce((acc, s) => acc + s.tasks.reduce((sum, t) => sum + t.points, 0), 0);
  const avgPoints = totalPoints / Math.max(data.sprints.length, 1);

  return (
    <div style={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-1)', margin: 0 }}>Sprint Plan</h2>
          <p style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>{data.sprints.length} sprints · {totalPoints} total story points</p>
        </div>
      </div>

      {data.sprints.map(sprint => {
        const sprintPoints = sprint.tasks.reduce((sum, task) => sum + task.points, 0);
        const pct = Math.min(100, (sprintPoints / avgPoints) * 100);

        return (
          <div key={sprint.number} style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', borderRadius: 6, overflow: 'hidden' }}>
            {/* Sprint header */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', padding: '2px 8px', border: '1px solid var(--border)', borderRadius: 3, backgroundColor: 'var(--surface-alt)' }}>Sprint {sprint.number}</span>
                <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', margin: 0 }}>{sprint.name}</h3>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace' }}>
                <span>{sprint.duration}</span>
                <span style={{ color: 'var(--primary)' }}>{sprintPoints} pts</span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 2, backgroundColor: 'var(--border)' }}>
              <div style={{ height: '100%', backgroundColor: 'var(--primary)', width: `${pct}%`, opacity: 0.7, transition: 'width 0.5s ease' }} />
            </div>

            {/* Goals */}
            {sprint.goals?.length > 0 && (
              <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {sprint.goals.map((goal, i) => (
                  <span key={i} style={{ fontSize: 11, color: 'var(--text-3)', backgroundColor: 'var(--surface-alt)', padding: '3px 10px', borderRadius: 3, border: '1px solid var(--border)' }}>{goal}</span>
                ))}
              </div>
            )}

            {/* Tasks */}
            {sprint.tasks.map((task, i) => (
              <div key={i} style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < sprint.tasks.length - 1 ? '1px solid var(--border)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, backgroundColor: task.priority === 'High' ? 'var(--error)' : task.priority === 'Medium' ? 'var(--primary)' : 'var(--text-3)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{task.task}</span>
                </div>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-3)', padding: '2px 8px', border: '1px solid var(--border)', borderRadius: 3, backgroundColor: 'var(--surface-alt)', flexShrink: 0, marginLeft: 12 }}>{task.points} pts</span>
              </div>
            ))}
          </div>
        );
      })}

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Total Project Story Points</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', fontWeight: 700, fontSize: 20 }}>{totalPoints}</span>
      </div>
    </div>
  );
};
