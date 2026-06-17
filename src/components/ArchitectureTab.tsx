import React, { useMemo } from 'react';
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

const colorMap: Record<string, string> = {
  frontend: '#1E3A5F',
  backend: '#1A1A1A',
  database: '#1F2937',
  service: '#292524',
  external: '#1C1917'
};

const borderMap: Record<string, string> = {
  frontend: 'border-transparent',
  backend: 'border-primary',
  database: 'border-success',
  service: 'border-error',
  external: 'border-border'
};

export const ArchitectureTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Auto-layout logic (very basic horizontal distribution)
    let typeCounts: Record<string, number> = {};
    
    data.architecture.components.forEach((comp) => {
      const type = comp.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      
      const x = ['frontend', 'external'].includes(type) ? 100 : ['backend', 'service'].includes(type) ? 400 : 700;
      const y = (typeCounts[type] * 120) - 50;

      nodes.push({
        id: comp.id,
        position: { x, y },
        data: { label: comp.name, type: comp.type, desc: comp.description },
        type: 'customNode'
      });

      comp.connections.forEach(targetId => {
        edges.push({
          id: `e-${comp.id}-${targetId}`,
          source: comp.id,
          target: targetId,
          animated: true,
          style: { stroke: '#F59E0B', strokeWidth: 2 }
        });
      });
    });

    return { nodes, edges };
  }, [data]);

  return (
    <div className="w-full h-[600px] border border-border rounded-md bg-[#0a0a0a] overflow-hidden animate-in fade-in duration-500">
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={{ customNode: CustomNode }}
        fitView
      >
        <Background color="#2A2A2A" gap={16} />
        <Controls className="!bg-surfaceAlt !border-border !fill-textPrimary" />
      </ReactFlow>
    </div>
  );
};

const CustomNode = ({ data }: { data: any }) => {
  const Icon = iconMap[data.type] || Box;
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-surfaceAlt border-2 ${borderMap[data.type] || 'border-border'} min-w-[150px]`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-textMuted" />
        <div className="font-mono text-sm font-bold text-textPrimary">{data.label}</div>
      </div>
      <div className="text-xs text-textMuted mt-1 max-w-[200px] truncate">{data.desc}</div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ backgroundColor: colorMap[data.type] || '#1A1A1A', opacity: 0.1, zIndex: -1 }}></div>
    </div>
  );
};
