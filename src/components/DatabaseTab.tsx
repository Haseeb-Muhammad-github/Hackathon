import React, { useState } from 'react';
import { SystemArchitecture } from '../types';
import { Key, Copy, Check } from 'lucide-react';

function generateSQL(tables: SystemArchitecture['database']['tables']): string {
  return tables.map(table => {
    const fields = table.fields.map(f => `  ${f.name} ${f.type}${f.constraints ? ' ' + f.constraints : ''}`).join(',\n');
    return `CREATE TABLE ${table.name} (\n${fields}\n);\n`;
  }).join('\n');
}

export const DatabaseTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generateSQL(data.database.tables));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
        <span style={{ color: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {data.database.tables.length} Tables
        </span>
        <button
          onClick={handleCopySQL}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: copied ? 'var(--success)' : 'var(--text-2)', cursor: 'pointer' }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy SQL'}
        </button>
      </div>

      {/* 2-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {data.database.tables.map(table => (
          <div key={table.name} style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', borderRadius: 6, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', fontSize: 13, fontWeight: 500 }}>{table.name}</span>
            </div>

            {/* Fields */}
            {table.fields.map((field, i) => (
              <div key={field.name} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 16px', borderBottom: i < table.fields.length - 1 ? '1px solid var(--border)' : undefined, fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-1)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {(field.constraints.toLowerCase().includes('primary') || field.name === 'id') && <Key size={10} color="var(--primary)" />}
                  {field.name}
                </div>
                <div style={{ color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>{field.type}</div>
                <div style={{ color: 'var(--text-3)' }}>{field.constraints}</div>
              </div>
            ))}

            {/* Relationships */}
            {table.relationships?.length > 0 && (
              <div style={{ padding: '8px 16px', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)' }}>
                {table.relationships.map((rel, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace' }}>→ {rel}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
