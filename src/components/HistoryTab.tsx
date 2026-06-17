import React from 'react';
import { SystemArchitecture } from '../types';

interface HistoryEntry {
  id: string;
  timestamp: number;
  projectName: string;
  complexity: string;
  data: SystemArchitecture;
}

interface HistoryTabProps {
  onReload: (data: SystemArchitecture) => void;
}

const STORAGE_KEY = 'arch_ai_history';

export function saveToHistory(data: SystemArchitecture) {
  const existing: HistoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const entry: HistoryEntry = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    projectName: data.overview.projectName,
    complexity: data.overview.complexity,
    data
  };
  const updated = [entry, ...existing].slice(0, 20); // keep last 20
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ onReload }) => {
  const [entries, setEntries] = React.useState<HistoryEntry[]>(() =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  );

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const complexityColor: Record<string, string> = {
    Low:    'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10',
    Medium: 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10',
    High:   'text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10',
  };

  if (entries.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-64 opacity-30">
        <div className="text-center">
          <p className="text-[#F5F5F5] font-medium">No history yet</p>
          <p className="text-[#A3A3A3] text-sm mt-1">Generated architectures will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
      <div className="flex justify-between items-center">
        <span className="text-[#525252] text-xs font-mono uppercase">{entries.length} generations</span>
        <button
          onClick={handleClearAll}
          className="text-xs text-[#525252] hover:text-[#EF4444] font-mono transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {entries.map(entry => (
          <div
            key={entry.id}
            className="border border-[#2A2A2A] bg-[#141414] rounded-md px-4 py-3 flex items-center justify-between group hover:border-[#F59E0B]/30 transition-colors"
          >
            <button
              onClick={() => onReload(entry.data)}
              className="flex items-center gap-4 flex-1 text-left"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-[#F5F5F5] font-medium group-hover:text-[#F59E0B] transition-colors">
                  {entry.projectName}
                </span>
                <span className="text-xs text-[#525252] font-mono">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ml-auto mr-4 ${complexityColor[entry.complexity] || ''}`}>
                {entry.complexity}
              </span>
            </button>
            <button
              onClick={() => handleDelete(entry.id)}
              className="text-[#525252] hover:text-[#EF4444] text-xs font-mono transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
