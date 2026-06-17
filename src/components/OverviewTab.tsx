import React from 'react';
import { SystemArchitecture } from '../types';
import { Activity, Users, Clock } from 'lucide-react';

// Lookup table for common tech descriptions
const TECH_DESCRIPTIONS: Record<string, string> = {
  'React': 'Component-based UI library for building interactive interfaces with a large ecosystem.',
  'Next.js': 'Provides SSR, SSG, and API routes, crucial for SEO and performance.',
  'Vue.js': 'Progressive framework for building user interfaces with gentle learning curve.',
  'Node.js': 'Asynchronous, event-driven runtime for building scalable backend services.',
  'Express.js': 'Minimal and flexible Node.js framework for building RESTful APIs rapidly.',
  'FastAPI': 'High-performance Python web framework with automatic API documentation.',
  'Django': 'Batteries-included Python framework with ORM and admin out of the box.',
  'PostgreSQL': 'Robust relational database known for reliability and data integrity.',
  'MongoDB': 'Document-oriented NoSQL database for flexible, schema-less data.',
  'MySQL': 'Widely-used open-source relational database with strong community support.',
  'Redis': 'In-memory data structure store used as cache, message broker, and queue.',
  'TypeScript': 'Typed superset of JavaScript that catches errors at compile time.',
  'Docker': 'Containerization platform for consistent deployment across environments.',
  'Kubernetes': 'Container orchestration system for automating deployment and scaling.',
  'AWS': 'Comprehensive cloud platform with 200+ services for any workload.',
  'Stripe API': 'PCI-compliant payment processing platform with webhooks and strong security.',
  'GraphQL': 'Query language for APIs enabling clients to request exactly needed data.',
  'WebSocket': 'Protocol for full-duplex communication channels over a single TCP connection.',
  'Tailwind CSS': 'Utility-first CSS framework for rapid UI development.',
  'Prisma': 'Next-generation ORM for Node.js and TypeScript with type-safe queries.',
};

function getTechDescription(tech: string): string {
  const key = Object.keys(TECH_DESCRIPTIONS).find(k =>
    tech.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(tech.toLowerCase())
  );
  return TECH_DESCRIPTIONS[key || ''] || `Core technology component for the ${tech} stack layer.`;
}

export const OverviewTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const { overview } = data;

  const complexityConfig = {
    Low: { badge: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30', desc: 'The project has straightforward requirements with minimal integrations and a simple data model.' },
    Medium: { badge: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30', desc: 'The project has moderate complexity with several integrations and a structured data model.' },
    High: { badge: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30', desc: 'The project involves multiple user roles, complex integrations, and stringent non-functional requirements.' },
  }[overview.complexity] || { badge: '', desc: '' };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 animate-[fadeIn_0.3s_ease]">
      {/* Title + Summary */}
      <div>
        <h1 className="text-3xl font-semibold text-[#F5F5F5] tracking-tight mb-2">{overview.projectName}</h1>
        <p className="text-[#A3A3A3] text-sm leading-relaxed max-w-3xl">{overview.summary}</p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Complexity */}
        <div className="border border-[#2A2A2A] bg-[#141414] rounded-md p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#525252] text-xs font-mono uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            Complexity
          </div>
          <span className={`text-sm font-semibold px-2.5 py-1 rounded border w-fit ${complexityConfig.badge}`}>
            {overview.complexity}
          </span>
          <p className="text-xs text-[#525252] leading-relaxed">{complexityConfig.desc}</p>
        </div>

        {/* Team */}
        <div className="border border-[#2A2A2A] bg-[#141414] rounded-md p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#525252] text-xs font-mono uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            Team
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#F5F5F5]">{overview.estimatedTeamSize}</span>
            <span className="text-[#A3A3A3] text-sm">engineers</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="border border-[#2A2A2A] bg-[#141414] rounded-md p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#525252] text-xs font-mono uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Timeline
          </div>
          <span className="text-2xl font-semibold text-[#F5F5F5]">{overview.estimatedTimeline}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="border border-[#2A2A2A] bg-[#141414] rounded-md p-5 border-l-4 border-l-[#F59E0B]">
        <div className="text-[#525252] text-xs font-mono uppercase tracking-wider mb-3">Executive Summary</div>
        <p className="text-[#A3A3A3] text-sm leading-relaxed">{overview.summary}</p>
      </div>

      {/* Tech Stack */}
      <div>
        <div className="text-[#525252] text-xs font-mono uppercase tracking-wider mb-4">Tech Stack</div>
        <div className="grid grid-cols-2 gap-3">
          {overview.techStack.map(tech => (
            <div key={tech} className="border border-[#2A2A2A] bg-[#141414] rounded p-3 flex flex-col gap-1.5">
              <span className="text-[#F59E0B] text-sm font-medium font-mono">{tech}</span>
              <p className="text-[#525252] text-xs leading-relaxed">{getTechDescription(tech)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
