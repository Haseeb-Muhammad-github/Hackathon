import React, { useMemo, useState } from 'react';
import { SystemArchitecture } from '../types';
import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Layers, Database, Server, Globe, Box } from 'lucide-react';

const iconMap: Record<string, any> = {
  frontend: Globe,
  backend: Server,
  database: Database,
  service: Box,
  external: Layers
};

const nodeColors: Record<string, { bg: string; border: string; label: string }> = {
  frontend: { bg: '#1E3A5F', border: '#2563EB', label: 'FRONTEND' },
  backend:  { bg: '#1A1A0F', border: '#F59E0B', label: 'BACKEND' },
  database: { bg: '#1F2937', border: '#10B981', label: 'DATABASE' },
  service:  { bg: '#292524', border: '#EF4444', label: 'SERVICE' },
  external: { bg: '#1C1917', border: '#525252', label: 'EXTERNAL' },
};

const legendColors: Record<string, string> = {
  FRONTEND: '#2563EB',
  BACKEND:  '#F59E0B',
  DATABASE: '#10B981',
  SERVICE:  '#EF4444',
  EXTERNAL: '#525252',
};

export const ArchitectureTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const [showLabels, setShowLabels] = useState(true);

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let typeCounts: Record<string, number> = {};

    const xPositions: Record<string, number> = {
      frontend: 0, external: 0, backend: 350, service: 350, database: 700
    };
    const ySpacing = 130;

    data.architecture.components.forEach((comp) => {
      const type = comp.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      const x = xPositions[type] ?? 350;
      const y = (typeCounts[type] * ySpacing) - 50;

      nodes.push({
        id: comp.id,
        position: { x, y },
        data: { label: comp.name, type: comp.type, desc: comp.description, showLabels },
        type: 'customNode'
      });

      comp.connections.forEach(targetId => {
        edges.push({
          id: `e-${comp.id}-${targetId}`,
          source: comp.id,
          target: targetId,
          animated: false,
          style: { stroke: '#F59E0B', strokeWidth: 1.5, opacity: 0.7 },
          labelStyle: { fill: '#525252', fontSize: 9, fontFamily: 'JetBrains Mono' },
          label: 'REST/HTTPS',
        });
      });
    });

    return { nodes, edges };
  }, [data, showLabels]);

  return (
    <div className="w-full h-[620px] border border-[#2A2A2A] rounded-md bg-[#0a0a0a] overflow-hidden relative animate-[fadeIn_0.3s_ease]">
      {/* View toggles top-right */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${showLabels ? 'bg-[#F59E0B] text-[#0D0D0D] border-[#F59E0B]' : 'bg-[#1A1A1A] text-[#A3A3A3] border-[#2A2A2A] hover:border-[#F59E0B]'}`}
        >
          LABELS
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ customNode: CustomNode }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#2A2A2A" gap={20} size={1} />
        <Controls className="!bg-[#1A1A1A] !border-[#2A2A2A]" />
      </ReactFlow>

      {/* Legend bottom-left */}
      <div className="absolute bottom-3 left-3 z-10 bg-[#141414] border border-[#2A2A2A] rounded p-3 flex flex-col gap-1.5">
        {Object.entries(legendColors).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: color + '30', borderColor: color }} />
            <span className="text-[#525252] text-xs font-mono">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomNode = ({ data }: { data: any }) => {
  const Icon = iconMap[data.type] || Box;
  const colors = nodeColors[data.type] || { bg: '#1A1A1A', border: '#2A2A2A', label: 'SERVICE' };

  return (
    <div
      className="px-3 py-2.5 rounded min-w-[140px] max-w-[200px]"
      style={{ backgroundColor: colors.bg, border: `1.5px solid ${colors.border}` }}
    >
      {data.showLabels && (
        <div className="text-[8px] font-mono mb-1" style={{ color: colors.border, opacity: 0.7 }}>
          {colors.label}
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: colors.border }} />
        <span className="font-mono text-xs font-bold text-[#F5F5F5] leading-tight">{data.label}</span>
      </div>
    </div>
  );
};
