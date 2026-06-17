import React from 'react';
import { SystemArchitecture } from '../types';
import { Database, Key } from 'lucide-react';

export const DatabaseTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-500">
      {data.database.tables.map(table => (
        <div key={table.name} className="border border-border rounded-md bg-surfaceAlt overflow-hidden flex flex-col">
          <div className="bg-surface px-4 py-3 border-b border-border flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <h3 className="font-mono text-primary font-medium">{table.name}</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface/50 text-textMuted font-mono text-xs uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-2 font-normal">Field</th>
                  <th className="px-4 py-2 font-normal">Type</th>
                  <th className="px-4 py-2 font-normal">Constraints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {table.fields.map(field => (
                  <tr key={field.name} className="hover:bg-surface/30">
                    <td className="px-4 py-2 font-mono text-textPrimary">
                      <div className="flex items-center gap-2">
                        {field.constraints.toLowerCase().includes('primary') && <Key className="w-3 h-3 text-primary" />}
                        {field.name}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-textSecondary font-mono">{field.type}</td>
                    <td className="px-4 py-2 text-textMuted text-xs">{field.constraints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.relationships && table.relationships.length > 0 && (
            <div className="px-4 py-2 bg-surface/50 border-t border-border flex flex-col gap-1">
              <span className="text-xs font-mono text-textMuted">Relationships:</span>
              {table.relationships.map((rel, i) => (
                <span key={i} className="text-xs text-textSecondary font-mono">{rel}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
