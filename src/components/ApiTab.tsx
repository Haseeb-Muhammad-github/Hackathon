import React, { useState } from 'react';
import { SystemArchitecture } from '../types';
import { Lock, ChevronDown, ChevronRight, Download } from 'lucide-react';

const METHOD_STYLES: Record<string, { color: string; bg: string }> = {
  GET:    { color: 'var(--success)', bg: 'color-mix(in srgb, var(--success) 12%, transparent)' },
  POST:   { color: 'var(--primary)', bg: 'color-mix(in srgb, var(--primary) 12%, transparent)' },
  PUT:    { color: '#3B82F6',        bg: 'rgba(59,130,246,0.12)' },
  DELETE: { color: 'var(--error)',   bg: 'color-mix(in srgb, var(--error) 12%, transparent)' },
  PATCH:  { color: '#EAB308',        bg: 'rgba(234,179,8,0.12)' },
};

export const ApiTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const handleExportOpenAPI = () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'API', version: '1.0.0' },
      servers: [{ url: data.api.baseUrl }],
      paths: data.api.endpoints.reduce((acc: any, ep) => {
        if (!acc[ep.path]) acc[ep.path] = {};
        acc[ep.path][ep.method.toLowerCase()] = {
          description: ep.description,
          security: ep.auth ? [{ bearerAuth: [] }] : [],
          responses: { '200': { description: ep.response } }
        };
        return acc;
      }, {}),
    };
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'openapi.json'; a.click();
  };

  return (
    <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
        <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ color: 'var(--text-3)' }}>BASE: </span>
          <span style={{ color: 'var(--primary)' }}>{data.api.baseUrl.toUpperCase()}</span>
        </div>
        <button
          onClick={handleExportOpenAPI}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-2)', cursor: 'pointer' }}
        >
          <Download size={13} />OpenAPI JSON
        </button>
      </div>

      {/* Endpoints */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.api.endpoints.map((ep, i) => <EndpointRow key={i} endpoint={ep} />)}
      </div>
    </div>
  );
};

const EndpointRow: React.FC<{ endpoint: SystemArchitecture['api']['endpoints'][0] }> = ({ endpoint }) => {
  const [expanded, setExpanded] = useState(false);
  const ms = METHOD_STYLES[endpoint.method] || { color: 'var(--text-2)', bg: 'var(--surface-alt)' };

  return (
    <div style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', borderRadius: 6, overflow: 'hidden' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, padding: '3px 8px', borderRadius: 3, border: `1px solid ${ms.color}40`, color: ms.color, backgroundColor: ms.bg, minWidth: 52, textAlign: 'center' }}>
          {endpoint.method}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--text-1)', flexShrink: 0 }}>{endpoint.path}</span>
        {endpoint.auth && <Lock size={12} color="var(--text-3)" />}
        <span style={{ fontSize: 12, color: 'var(--text-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{endpoint.description}</span>
        {expanded ? <ChevronDown size={14} color="var(--text-3)" /> : <ChevronRight size={14} color="var(--text-3)" />}
      </button>

      {expanded && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {endpoint.requestBody && (
            <div>
              <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 6 }}>Request Body</div>
              <pre style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-2)', backgroundColor: 'var(--bg)', padding: 12, borderRadius: 4, border: '1px solid var(--border)', overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>{endpoint.requestBody}</pre>
            </div>
          )}
          <div>
            <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 6 }}>Response</div>
            <pre style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-2)', backgroundColor: 'var(--bg)', padding: 12, borderRadius: 4, border: '1px solid var(--border)', overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>{endpoint.response}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
