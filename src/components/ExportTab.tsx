import React from 'react';
import { SystemArchitecture } from '../types';
import { FileText, Database, Download, FileSpreadsheet, Code } from 'lucide-react';

function generateMarkdown(data: SystemArchitecture): string {
  const { overview, database, api, sprints, risks } = data;
  let md = `# ${overview.projectName}\n\n${overview.summary}\n\n`;
  md += `## Overview\n- **Complexity:** ${overview.complexity}\n- **Team Size:** ${overview.estimatedTeamSize} engineers\n- **Timeline:** ${overview.estimatedTimeline}\n- **Tech Stack:** ${overview.techStack.join(', ')}\n\n`;

  md += `## Architecture Layers\n${data.architecture.layers.map(l => `- ${l}`).join('\n')}\n\n`;
  md += `## Components\n${data.architecture.components.map(c => `- **${c.name}** (${c.type}): ${c.description}`).join('\n')}\n\n`;

  md += `## Database Schema\n`;
  database.tables.forEach(t => {
    md += `### ${t.name}\n| Field | Type | Constraints |\n|---|---|---|\n`;
    t.fields.forEach(f => { md += `| ${f.name} | ${f.type} | ${f.constraints} |\n`; });
    if (t.relationships.length) md += `\n*Relationships:* ${t.relationships.join(', ')}\n`;
    md += '\n';
  });

  md += `## API Endpoints\nBase URL: \`${api.baseUrl}\`\n\n`;
  api.endpoints.forEach(ep => {
    md += `### ${ep.method} ${ep.path}\n${ep.description}\n- Auth: ${ep.auth ? 'Required' : 'None'}\n`;
    if (ep.requestBody) md += `- Request: \`${ep.requestBody}\`\n`;
    md += `- Response: \`${ep.response}\`\n\n`;
  });

  md += `## Sprint Plan\n`;
  sprints.forEach(s => {
    md += `### Sprint ${s.number}: ${s.name} (${s.duration})\n`;
    s.tasks.forEach(t => { md += `- [${t.priority}] ${t.task} — ${t.points} pts\n`; });
    md += '\n';
  });

  md += `## Risk Analysis\n`;
  risks.forEach(r => {
    md += `### ${r.title} (${r.severity})\n${r.description}\n**Mitigation:** ${r.mitigation}\n\n`;
  });
  return md;
}

function generateSQL(tables: SystemArchitecture['database']['tables']): string {
  return tables.map(table => {
    const fields = table.fields.map(f => {
      const constraints = f.constraints ? ` ${f.constraints}` : '';
      return `  ${f.name} ${f.type}${constraints}`;
    }).join(',\n');
    return `CREATE TABLE ${table.name} (\n${fields}\n);\n`;
  }).join('\n');
}

function generateCSV(sprints: SystemArchitecture['sprints']): string {
  let csv = 'Sprint,Sprint Name,Task,Story Points,Priority\n';
  sprints.forEach(s => {
    s.tasks.forEach(t => {
      csv += `${s.number},"${s.name}","${t.task}",${t.points},${t.priority}\n`;
    });
  });
  return csv;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

interface ExportTabProps {
  data: SystemArchitecture | null;
}

const ExportRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onDownload: () => void;
  disabled?: boolean;
}> = ({ icon, title, description, onDownload, disabled }) => (
  <div className={`border border-[#2A2A2A] bg-[#141414] rounded-md px-5 py-4 flex items-center justify-between group transition-colors ${disabled ? 'opacity-40' : 'hover:border-[#F59E0B]/30'}`}>
    <div className="flex items-center gap-4">
      <div className="text-[#525252] group-hover:text-[#F59E0B] transition-colors">{icon}</div>
      <div>
        <div className="text-sm font-medium text-[#F5F5F5]">{title}</div>
        <div className="text-xs text-[#525252] mt-0.5">{description}</div>
      </div>
    </div>
    <button
      onClick={onDownload}
      disabled={disabled}
      className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] text-[#0D0D0D] text-xs font-semibold rounded hover:bg-[#D97706] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
    >
      <Download className="w-3.5 h-3.5" />
      Download
    </button>
  </div>
);

export const ExportTab: React.FC<ExportTabProps> = ({ data }) => {
  const noData = !data;

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
      {noData && (
        <div className="text-xs text-[#525252] font-mono border border-[#2A2A2A] bg-[#141414] px-4 py-3 rounded">
          Generate an architecture first to enable exports.
        </div>
      )}

      <ExportRow
        icon={<FileText className="w-5 h-5" />}
        title="Export as Markdown"
        description="Full document with all sections — Overview, Architecture, DB, API, Sprints, Risks"
        onDownload={() => data && downloadFile(generateMarkdown(data), `${data.overview.projectName.replace(/\s+/g, '_')}_architecture.md`, 'text/markdown')}
        disabled={noData}
      />
      <ExportRow
        icon={<Database className="w-5 h-5" />}
        title="Export SQL Schema"
        description="Generates CREATE TABLE statements for all database tables"
        onDownload={() => data && downloadFile(generateSQL(data.database.tables), 'schema.sql', 'text/plain')}
        disabled={noData}
      />
      <ExportRow
        icon={<Code className="w-5 h-5" />}
        title="Export OpenAPI JSON"
        description="Machine-readable OpenAPI 3.0 spec for all API endpoints"
        onDownload={() => {
          if (!data) return;
          const spec = {
            openapi: '3.0.0',
            info: { title: data.overview.projectName, version: '1.0.0' },
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
          downloadFile(JSON.stringify(spec, null, 2), 'openapi.json', 'application/json');
        }}
        disabled={noData}
      />
      <ExportRow
        icon={<FileSpreadsheet className="w-5 h-5" />}
        title="Export Sprint CSV"
        description="Task spreadsheet with sprint, story points, and priority columns"
        onDownload={() => data && downloadFile(generateCSV(data.sprints), 'sprints.csv', 'text/csv')}
        disabled={noData}
      />
    </div>
  );
};
