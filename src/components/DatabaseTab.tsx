import React, { useState } from 'react';
import { SystemArchitecture } from '../types';
import { Key, Copy, Check } from 'lucide-react';

function generateSQL(tables: SystemArchitecture['database']['tables']): string {
  return tables.map(table => {
    const fields = table.fields.map(f => {
      const constraints = f.constraints ? ` ${f.constraints}` : '';
      return `  ${f.name} ${f.type}${constraints}`;
    }).join(',\n');
    return `CREATE TABLE ${table.name} (\n${fields}\n);`;
  }).join('\n\n');
}

export const DatabaseTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySQL = () => {
    const sql = generateSQL(data.database.tables);
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
      {/* Header row */}
      <div className="flex items-center justify-between py-2">
        <span className="text-[#525252] text-xs font-mono uppercase tracking-wider">
          {data.database.tables.length} Tables
        </span>
        <button
          onClick={handleCopySQL}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded border border-[#2A2A2A] bg-[#1A1A1A] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#F59E0B] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy SQL'}
        </button>
      </div>

      {/* 2-column grid of table cards */}
      <div className="grid grid-cols-2 gap-4">
        {data.database.tables.map(table => (
          <div key={table.name} className="border border-[#2A2A2A] bg-[#141414] rounded-md overflow-hidden flex flex-col">
            {/* Table name header */}
            <div className="px-4 py-3 border-b border-[#2A2A2A]">
              <span className="font-mono text-[#F59E0B] font-medium text-sm">{table.name}</span>
            </div>

            {/* Fields */}
            <div className="divide-y divide-[#2A2A2A]">
              {table.fields.map(field => (
                <div key={field.name} className="grid grid-cols-3 px-4 py-2.5 text-xs hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center gap-1.5 text-[#F5F5F5] font-mono">
                    {(field.constraints.toLowerCase().includes('primary') || field.name === 'id') && (
                      <Key className="w-3 h-3 text-[#F59E0B] shrink-0" />
                    )}
                    {field.name}
                  </div>
                  <div className="text-[#F59E0B] font-mono">{field.type}</div>
                  <div className="text-[#525252]">{field.constraints}</div>
                </div>
              ))}
            </div>

            {/* Relationships */}
            {table.relationships && table.relationships.length > 0 && (
              <div className="px-4 py-3 border-t border-[#2A2A2A] bg-[#0D0D0D] flex flex-col gap-1">
                {table.relationships.map((rel, i) => (
                  <span key={i} className="text-xs text-[#525252] font-mono">→ {rel}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
