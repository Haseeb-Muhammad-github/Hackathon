import React, { useState } from 'react';
import { SystemArchitecture } from '../types';
import { Lock, ChevronDown, ChevronRight, Download } from 'lucide-react';

export const ApiTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const handleExportOpenAPI = () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'API', version: '1.0.0' },
      servers: [{ url: data.api.baseUrl }],
      paths: data.api.endpoints.reduce((acc: any, ep) => {
        const path = ep.path;
        if (!acc[path]) acc[path] = {};
        acc[path][ep.method.toLowerCase()] = {
          description: ep.description,
          security: ep.auth ? [{ bearerAuth: [] }] : [],
          requestBody: ep.requestBody ? { content: { 'application/json': { schema: { example: ep.requestBody } } } } : undefined,
          responses: { '200': { description: ep.response } }
        };
        return acc;
      }, {}),
    };
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'openapi.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
      {/* Header row */}
      <div className="flex items-center justify-between py-2">
        <div className="text-xs font-mono">
          <span className="text-[#525252]">BASE: </span>
          <span className="text-[#F59E0B]">{data.api.baseUrl.toUpperCase()}</span>
        </div>
        <button
          onClick={handleExportOpenAPI}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded border border-[#2A2A2A] bg-[#1A1A1A] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#F59E0B] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          OpenAPI JSON
        </button>
      </div>

      {/* Endpoint List */}
      <div className="flex flex-col gap-2">
        {data.api.endpoints.map((ep, i) => (
          <EndpointRow key={i} endpoint={ep} />
        ))}
      </div>
    </div>
  );
};

const METHOD_STYLES: Record<string, string> = {
  GET:    'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
  POST:   'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
  PUT:    'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30',
  DELETE: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
  PATCH:  'bg-[#EAB308]/15 text-[#EAB308] border-[#EAB308]/30',
};

const EndpointRow: React.FC<{ endpoint: SystemArchitecture['api']['endpoints'][0] }> = ({ endpoint }) => {
  const [expanded, setExpanded] = useState(false);
  const methodStyle = METHOD_STYLES[endpoint.method] || 'bg-[#1A1A1A] text-[#A3A3A3] border-[#2A2A2A]';

  return (
    <div className="border border-[#2A2A2A] bg-[#141414] rounded overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#1A1A1A] transition-colors"
      >
        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border min-w-[52px] text-center shrink-0 ${methodStyle}`}>
          {endpoint.method}
        </span>
        <span className="font-mono text-sm text-[#F5F5F5] shrink-0">{endpoint.path}</span>
        {endpoint.auth && <Lock className="w-3.5 h-3.5 text-[#525252] shrink-0" />}
        <span className="text-xs text-[#525252] ml-2 truncate flex-1 text-left">{endpoint.description}</span>
        {expanded ? <ChevronDown className="w-4 h-4 text-[#525252] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[#525252] shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 py-4 bg-[#0D0D0D] border-t border-[#2A2A2A] flex flex-col gap-4">
          {endpoint.requestBody && (
            <div>
              <div className="text-[#525252] text-xs font-mono uppercase mb-2">Request Body</div>
              <pre className="text-xs font-mono text-[#A3A3A3] bg-[#141414] p-3 rounded border border-[#2A2A2A] overflow-x-auto whitespace-pre-wrap">{endpoint.requestBody}</pre>
            </div>
          )}
          <div>
            <div className="text-[#525252] text-xs font-mono uppercase mb-2">Response</div>
            <pre className="text-xs font-mono text-[#A3A3A3] bg-[#141414] p-3 rounded border border-[#2A2A2A] overflow-x-auto whitespace-pre-wrap">{endpoint.response}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
