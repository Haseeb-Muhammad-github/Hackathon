import React, { useMemo, useState } from 'react';
import { SystemArchitecture } from '../types';
import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Server, Globe, Box } from 'lucide-react';

const iconMap: Record<string, any> = { frontend: Globe, backend: Server, database: Box, service: Box, external: Globe };

type NodeType = 'frontend' | 'backend' | 'database' | 'service' | 'external';
const nodeColors: Record<NodeType, { bg: string; border: string; text: string; label: string }> = {
  frontend: { bg: '#1E3A5F', border: '#2563EB', text: '#BFDBFE', label: 'FRONTEND' },
  backend:  { bg: '#1C1400', border: '#F59E0B', text: '#FDE68A', label: 'BACKEND' },
  database: { bg: '#064E3B', border: '#10B981', text: '#A7F3D0', label: 'DATABASE' },
  service:  { bg: '#3B0A0A', border: '#EF4444', text: '#FECACA', label: 'SERVICE' },
  external: { bg: '#1C1917', border: '#78716C', text: '#D6D3D1', label: 'EXTERNAL' },
};

const legendColors = [
  { label: 'FRONTEND', color: '#2563EB' },
  { label: 'BACKEND',  color: '#F59E0B' },
  { label: 'DATABASE', color: '#10B981' },
  { label: 'SERVICE',  color: '#EF4444' },
  { label: 'EXTERNAL', color: '#78716C' },
];

export const ArchitectureTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const [showLabels, setShowLabels] = useState(true);

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const typeCounts: Record<string, number> = {};
    const xPos: Record<string, number> = { frontend: 50, external: 50, backend: 380, service: 380, database: 710 };

    data.architecture.components.forEach((comp) => {
      typeCounts[comp.type] = (typeCounts[comp.type] || 0) + 1;
      nodes.push({
        id: comp.id,
        position: { x: xPos[comp.type] ?? 380, y: typeCounts[comp.type] * 120 - 50 },
        data: { label: comp.name, type: comp.type, desc: comp.description, showLabels },
        type: 'customNode'
      });
      comp.connections.forEach(t => edges.push({
        id: `e-${comp.id}-${t}`, source: comp.id, target: t, animated: false,
        style: { stroke: '#F59E0B80', strokeWidth: 1.5 }, label: 'REST/HTTPS',
        labelStyle: { fill: '#52525280', fontSize: 9, fontFamily: 'JetBrains Mono' },
      }));
    });
    return { nodes, edges };
  }, [data, showLabels]);

  return (
    <div style={{ width: '100%', height: 600, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
      {/* LABELS toggle */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
        <button
          onClick={() => setShowLabels(!showLabels)}
          style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', borderRadius: 3, border: '1px solid', cursor: 'pointer', backgroundColor: showLabels ? 'var(--primary)' : 'var(--surface)', color: showLabels ? '#0D0D0D' : 'var(--text-3)', borderColor: showLabels ? 'var(--primary)' : 'var(--border)' }}
        >LABELS</button>
      </div>

      <ReactFlow nodes={nodes} edges={edges} nodeTypes={{ customNode: CustomNode }} fitView fitViewOptions={{ padding: 0.2 }}>
        <Background color="var(--border)" gap={20} size={1} />
        <Controls />
      </ReactFlow>

      {/* Legend bottom-left */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 10, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {legendColors.map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color + '30', border: `1px solid ${color}` }} />
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-3)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomNode = ({ data }: { data: any }) => {
  const Icon = iconMap[data.type] || Box;
  const colors = nodeColors[data.type as NodeType] || nodeColors.external;
  return (
    <div style={{ padding: '8px 12px', borderRadius: 4, backgroundColor: colors.bg, border: `1.5px solid ${colors.border}`, minWidth: 130, maxWidth: 200 }}>
      {data.showLabels && <div style={{ fontSize: 8, fontFamily: 'JetBrains Mono, monospace', color: colors.border, opacity: 0.7, marginBottom: 4 }}>{colors.label}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={13} color={colors.border} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: colors.text }}>{data.label}</span>
      </div>
    </div>
  );
};
