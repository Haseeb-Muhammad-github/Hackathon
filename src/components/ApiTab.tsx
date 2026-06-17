import React, { useState } from 'react';
import { SystemArchitecture } from '../types';
import { Lock, ChevronDown, ChevronRight } from 'lucide-react';

export const ApiTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="mb-4">
        <span className="text-sm font-mono text-textMuted uppercase">Base URL</span>
        <div className="mt-1 font-mono text-primary bg-surfaceAlt px-3 py-2 rounded-md border border-border inline-block">
          {data.api.baseUrl}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {data.api.endpoints.map((ep, i) => (
          <EndpointRow key={i} endpoint={ep} />
        ))}
      </div>
    </div>
  );
};

const EndpointRow: React.FC<{ endpoint: SystemArchitecture['api']['endpoints'][0] }> = ({ endpoint }) => {
  const [expanded, setExpanded] = useState(false);

  const methodColors: Record<string, string> = {
    GET: 'text-success bg-success/10 border-success/20',
    POST: 'text-primary bg-primary/10 border-primary/20',
    PUT: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    DELETE: 'text-error bg-error/10 border-error/20',
    PATCH: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  };

  return (
    <div className="border border-border rounded-md bg-surfaceAlt overflow-hidden flex flex-col transition-all">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`font-mono text-xs font-bold px-2 py-1 rounded border w-16 text-center ${methodColors[endpoint.method] || 'text-textPrimary bg-surface'}`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-sm text-textPrimary">{endpoint.path}</span>
          {endpoint.auth && <Lock className="w-3.5 h-3.5 text-textMuted ml-2" />}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-textMuted hidden sm:inline-block">{endpoint.description}</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-textMuted" /> : <ChevronRight className="w-4 h-4 text-textMuted" />}
        </div>
      </button>
      
      {expanded && (
        <div className="px-4 py-3 bg-surface border-t border-border flex flex-col gap-4">
          {endpoint.requestBody && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-textMuted uppercase">Request Body</span>
              <pre className="text-xs font-mono text-textSecondary bg-background p-3 rounded border border-border overflow-x-auto">
                {endpoint.requestBody}
              </pre>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-textMuted uppercase">Response</span>
            <pre className="text-xs font-mono text-textSecondary bg-background p-3 rounded border border-border overflow-x-auto">
              {endpoint.response}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
